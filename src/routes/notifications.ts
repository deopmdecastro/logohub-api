import { Hono } from 'hono';
import { cors } from 'hono/cors';

// In-memory notification store
let nextId = 1;
let notifications: Notification[] = [];

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  user_id?: string;
  role?: string;
  read: boolean;
  ts: string;
  link?: string;
}

// SSE clients map: userId -> Set<writable>
const clients = new Map<string, Set<WritableStreamDefaultWriter<any>>>();

const notificationsRoute = new Hono();
notificationsRoute.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposeHeaders: ['Content-Type'],
}));

const ok = (c: any, data: any, extra: any = {}) =>
  c.json({ data, ...extra, meta: { version: 'v1', timestamp: new Date().toISOString() } });

// Broadcast notification to SSE clients by role or user_id
export function broadcastNotification(n: Notification) {
  notifications.push(n);
  const data = `data: ${JSON.stringify(n)}\n\n`;
  for (const [uid, writers] of clients.entries()) {
    // Broadcast to specific user or all users with matching role (or all if no filter)
    if (n.user_id && n.user_id !== uid) continue;
    for (const writer of writers) {
      try { writer.write(new TextEncoder().encode(data)); } catch {}
    }
  }
  // Also emit to "broadcast" channel for global listeners
  const globalWriters = clients.get('__broadcast__');
  if (globalWriters) {
    for (const writer of globalWriters) {
      try { writer.write(new TextEncoder().encode(data)); } catch {}
    }
  }
}

// Helper to create notification from anywhere in the codebase
export function createNotification(opts: {
  type?: Notification['type'];
  title: string;
  message: string;
  user_id?: string;
  role?: string;
  link?: string;
}): Notification {
  const n: Notification = {
    id: nextId++,
    type: opts.type || 'info',
    title: opts.title,
    message: opts.message,
    user_id: opts.user_id || '',
    role: opts.role || '',
    read: false,
    ts: new Date().toISOString(),
    link: opts.link || '',
  };
  broadcastNotification(n);
  return n;
}

// ============ SSE Endpoint (real-time stream) ============
notificationsRoute.get('/stream', (c) => {
  const userId = c.req.query('user_id') || '__broadcast__';
  const role = c.req.query('role') || '';

  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      if (!clients.has(userId)) clients.set(userId, new Set());
      const writer = new WritableStream({
        write(chunk) {
          controller.enqueue(chunk);
        },
        close() {},
        abort() {},
      }).getWriter();
      clients.get(userId)!.add(writer);

      // Send initial connection event
      controller.enqueue(new TextEncoder().encode(
        `data: ${JSON.stringify({ type: 'connected', userId, role })}\n\n`
      ));

      // Keep-alive every 15s
      const keepAlive = setInterval(() => {
        try { controller.enqueue(new TextEncoder().encode(':keepalive\n\n')); } catch {}
      }, 15000);

      // Cleanup on abort
      c.req.raw.signal?.addEventListener('abort', () => {
        clearInterval(keepAlive);
        clients.get(userId)?.delete(writer);
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
});

// ============ REST Endpoints ============

// GET /api/v1/notifications — list notifications
notificationsRoute.get('/', (c) => {
  const userId = c.req.query('user_id');
  const role = c.req.query('role');
  const unread = c.req.query('unread');

  let list = [...notifications];
  if (userId) {
    list = list.filter(n => !n.user_id || n.user_id === userId);
  }
  if (role) {
    list = list.filter(n => !n.role || n.role === role);
  }
  if (unread === 'true') {
    list = list.filter(n => !n.read);
  }
  // Most recent first
  list.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  return ok(c, list.slice(0, 100), { unreadCount: notifications.filter(n => !n.read).length });
});

// GET /api/v1/notifications/count — unread count only
notificationsRoute.get('/count', (c) => {
  const userId = c.req.query('user_id');
  let list = notifications.filter(n => !n.read);
  if (userId) list = list.filter(n => !n.user_id || n.user_id === userId);
  return ok(c, { unread: list.length, total: notifications.length });
});

// PATCH /api/v1/notifications/:id/read — mark as read
notificationsRoute.patch('/:id/read', (c) => {
  const id = Number(c.req.param('id'));
  const n = notifications.find(x => x.id === id);
  if (!n) return c.json({ error: 'Not found' }, 404);
  n.read = true;
  return ok(c, n);
});

// GET /api/v1/notifications/unread-count — get unread count
notificationsRoute.get('/unread-count', (c) => {
  const role = c.req.query('role');
  let list = notifications;
  if (role) list = list.filter(n => n.role === role);
  const unread = list.filter(n => !n.read).length;
  return ok(c, { unread, total: list.length });
});

// PATCH /api/v1/notifications/read-all — mark all as read
notificationsRoute.patch('/read-all', (c) => {
  const userId = c.req.query('user_id');
  let list = notifications;
  if (userId) list = list.filter(n => !n.user_id || n.user_id === userId);
  list.forEach(n => { n.read = true; });
  return ok(c, { marked: list.length });
});

// POST /api/v1/notifications — create a notification (for testing/internal)
notificationsRoute.post('/', async (c) => {
  let body: any = {};
  try { body = await c.req.json(); } catch {}
  const n = createNotification({
    type: body.type || 'info',
    title: body.title || 'New notification',
    message: body.message || '',
    user_id: body.user_id || '',
    role: body.role || '',
    link: body.link || '',
  });
  return ok(c, n);
});

// DELETE /api/v1/notifications/:id — delete a notification
notificationsRoute.delete('/:id', (c) => {
  const id = Number(c.req.param('id'));
  notifications = notifications.filter(x => x.id !== id);
  return ok(c, { deleted: true });
});

// POST /api/v1/notifications/seed — seed demo notifications
notificationsRoute.post('/seed', (c) => {
  const demos: Omit<Notification, 'id'>[] = [
    { type: 'success', title: 'New asset published!', message: 'Your logo "Modern UI Kit" is now live.', user_id: '', role: 'creator', read: false, ts: new Date(Date.now() - 120000).toISOString(), link: '/dashboard/creator/content' },
    { type: 'info', title: 'Download milestone', message: 'Your assets reached 89K downloads this month.', user_id: '', role: 'creator', read: false, ts: new Date(Date.now() - 600000).toISOString(), link: '/dashboard/creator' },
    { type: 'warning', title: 'Plan limit alert', message: 'You have used 85% of your daily quota.', user_id: '', role: 'consumer', read: false, ts: new Date(Date.now() - 900000).toISOString(), link: '/dashboard/consumer' },
    { type: 'error', title: 'API key expired', message: 'Key "Default Key" will expire in 3 days.', user_id: '', role: 'consumer', read: false, ts: new Date(Date.now() - 1800000).toISOString(), link: '/dashboard/consumer/keys' },
    { type: 'info', title: 'New user registered', message: 'Maria Silva joined as a Creator.', user_id: '', role: 'admin', read: false, ts: new Date(Date.now() - 3600000).toISOString(), link: '/dashboard/admin/users' },
    { type: 'success', title: 'Payment received', message: '$412.00 from Modern Dashboard UI Kit downloads.', user_id: '', role: 'creator', read: true, ts: new Date(Date.now() - 7200000).toISOString(), link: '/dashboard/creator' },
    { type: 'info', title: 'Content under review', message: 'Your "SaaS Landing Page Icons" is being reviewed.', user_id: '', role: 'creator', read: true, ts: new Date(Date.now() - 14400000).toISOString(), link: '/dashboard/creator/content' },
    { type: 'success', title: 'Welcome to LogoHub!', message: 'Start exploring 50K+ visual assets.', user_id: '', role: 'consumer', read: true, ts: new Date(Date.now() - 86400000).toISOString(), link: '/explorer' },
  ];
  demos.forEach(d => createNotification(d));
  return ok(c, { seeded: demos.length });
});

export default notificationsRoute;
export { notificationsRoute };
