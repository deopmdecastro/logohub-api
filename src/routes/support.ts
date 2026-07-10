// Support routes — tickets + FAQ (spec 1.16)
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './auth';
import { support } from '../services/support';

const supportRoute = new Hono<{ Variables: { userId: string; userRole: string } }>();
supportRoute.use('/*', cors({ origin: '*', allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'], allowHeaders: ['Content-Type','Authorization'] }));

const ok = (c: any, d: any) => c.json({ data: d, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, m: string, code=400) => c.json({ error: m, code }, code as any);

// FAQ — public
supportRoute.get('/faq', (c) => {
  const cat = c.req.query('category');
  const q = c.req.query('q');
  if (q) return ok(c, support.searchFaq(q));
  return ok(c, support.listFaqs(cat || undefined));
});

supportRoute.get('/faq/categories', (c) => ok(c, support.getFaqCategories()));

// Tickets — authenticated
supportRoute.use('/tickets/*', authMiddleware as any);

supportRoute.get('/tickets', (c) => {
  const orgId = c.get('userId');
  return ok(c, support.listTickets(orgId));
});

supportRoute.post('/tickets', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(()=>({}));
  if (!body.subject) return bad(c, 'subject is required');
  const t = support.createTicket({
    orgId: userId, userId, userName: body.user_name || 'User',
    subject: body.subject, category: body.category || 'general',
    priority: body.priority || 'medium', plan: body.plan || 'free',
  });
  // Add initial message
  if (body.message) {
    support.addMessage({ ticketId: t.id, authorId: userId, authorName: body.user_name || 'User', body: body.message });
  }
  return c.json({ data: t }, 201);
});

supportRoute.get('/tickets/:id', (c) => {
  const t = support.getTicket(c.req.param('id'));
  if (!t) return bad(c, 'Ticket not found', 404);
  return ok(c, { ...t, messages: support.listMessages(t.id), sla: support.getSlaStatus(t) });
});

supportRoute.patch('/tickets/:id', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  const t = support.updateTicketStatus(c.req.param('id'), body.status);
  if (!t) return bad(c, 'Ticket not found', 404);
  return ok(c, t);
});

supportRoute.post('/tickets/:id/messages', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(()=>({}));
  if (!body.body) return bad(c, 'body is required');
  const t = support.getTicket(c.req.param('id'));
  if (!t) return bad(c, 'Ticket not found', 404);
  const msg = support.addMessage({
    ticketId: c.req.param('id'), authorId: userId,
    authorName: body.author_name || 'User', body: body.body,
    attachments: body.attachments, isStaff: c.get('userRole') === 'admin',
  });
  return c.json({ data: msg }, 201);
});

export default supportRoute;
