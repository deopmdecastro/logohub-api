// Changelog routes — platform updates (spec 1.17)
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './auth';
import { changelog } from '../services/changelog';

const changelogRoute = new Hono();
changelogRoute.use('/*', cors({ origin: '*', allowMethods: ['GET','POST','OPTIONS'], allowHeaders: ['Content-Type','Authorization'] }));

const ok = (c: any, d: any) => c.json({ data: d, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, m: string, code=400) => c.json({ error: m, code }, code as any);

// GET /api/v1/changelog — public
changelogRoute.get('/', (c) => {
  const type = c.req.query('type');
  const apiId = c.req.query('api_id');
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
  const result = changelog.list(type, apiId, page, limit);
  return ok(c, result.data, { meta: result.meta });
});

// GET /api/v1/changelog/:id
changelogRoute.get('/:id', (c) => {
  const entry = changelog.get(c.req.param('id'));
  if (!entry) return bad(c, 'Entry not found', 404);
  return ok(c, entry);
});

// POST /api/v1/changelog — admin only
changelogRoute.post('/', authMiddleware as any, async (c) => {
  if (c.get('userRole') !== 'admin') return bad(c, 'Admin only', 403);
  const body = await c.req.json().catch(()=>({}));
  if (!body.title || !body.type) return bad(c, 'title and type required');
  const entry = changelog.create({
    api_id: body.api_id || null, type: body.type,
    title: body.title, body: body.body || '', version: body.version || null,
  });
  return c.json({ data: entry }, 201);
});

// POST /api/v1/changelog/subscribe
changelogRoute.post('/subscribe', authMiddleware as any, async (c) => {
  const body = await c.req.json().catch(()=>({}));
  changelog.subscribe(body.api_id || null, c.get('userId'));
  return ok(c, { subscribed: true });
});

// POST /api/v1/changelog/unsubscribe
changelogRoute.post('/unsubscribe', authMiddleware as any, async (c) => {
  const body = await c.req.json().catch(()=>({}));
  changelog.unsubscribe(body.api_id || null, c.get('userId'));
  return ok(c, { unsubscribed: true });
});

export default changelogRoute;
