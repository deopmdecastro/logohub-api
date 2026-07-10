// User-facing API Key management — spec section 1.6 "Gestão de API Keys"
// Consumers/creators manage their own keys through the authenticated session.
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { store } from '../data/store';
import { authMiddleware } from './auth';
import { createNotification } from './notifications';

const userKeys = new Hono<{ Variables: { userId: string; userRole: string } }>();
userKeys.use('/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));
userKeys.use('/*', authMiddleware as any);

const ok = (c: any, data: any, extra: any = {}) => c.json({ data, ...extra, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, msg: string, code = 400) => c.json({ error: msg, code }, code as any);

const PLAN_KEY_LIMITS: Record<string, number> = { free: 2, pro: 10, business: 50, enterprise: -1 };

// GET /api/v1/keys — list only the caller's own keys
userKeys.get('/', async (c) => {
  const userId = c.get('userId');
  const keys = await store.listKeys(userId);
  // never leak the full secret on list — only the prefix
  return ok(c, keys.map((k: any) => ({ ...k, key: undefined, key_preview: (k.prefix || '') + '...' })));
});

// POST /api/v1/keys — create a new key, scoped to caller, enforcing plan limits
userKeys.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return bad(c, 'name is required');

  const user = await store.getUser(userId);
  const existing = await store.listKeys(userId);
  const activeCount = existing.filter((k: any) => k.status !== 'revoked').length;
  const limit = PLAN_KEY_LIMITS[user?.plan || 'free'] ?? PLAN_KEY_LIMITS.free;
  if (limit !== -1 && activeCount >= limit) {
    return bad(c, `Plan "${user?.plan || 'free'}" allows up to ${limit} active API keys. Upgrade your plan or revoke an existing key.`, 403);
  }

  const key = await store.createKey({
    user_id: userId,
    name: body.name,
    permissions: Array.isArray(body.scopes) ? body.scopes : (body.permissions || []),
    tags: body.tags || [],
    expires_at: body.expires_at || null,
  });

  await createNotification({ type: 'success', title: 'New API key created', message: `Key "${key.name}" was created.`, user_id: userId, link: '/dashboard/keys' });

  // Full secret is only ever returned once, at creation time.
  return c.json({ data: key, meta: { version: 'v2', timestamp: new Date().toISOString() } }, 201);
});

// GET /api/v1/keys/:id
userKeys.get('/:id', async (c) => {
  const userId = c.get('userId');
  const key = await store.getKey(c.req.param('id'));
  if (!key || key.user_id !== userId) return bad(c, 'Key not found', 404);
  return ok(c, { ...key, key: undefined, key_preview: (key.prefix || '') + '...' });
});

// PATCH /api/v1/keys/:id — rename / change scopes
userKeys.patch('/:id', async (c) => {
  const userId = c.get('userId');
  const existing = await store.getKey(c.req.param('id'));
  if (!existing || existing.user_id !== userId) return bad(c, 'Key not found', 404);
  const body = await c.req.json().catch(() => ({}));
  const patch: any = {};
  if (body.name !== undefined) patch.name = body.name;
  if (body.scopes !== undefined) patch.permissions = body.scopes;
  if (body.permissions !== undefined) patch.permissions = body.permissions;
  if (body.tags !== undefined) patch.tags = body.tags;
  const updated = await store.updateKey(c.req.param('id'), patch);
  return ok(c, { ...updated, key: undefined, key_preview: (updated?.prefix || '') + '...' });
});

// POST /api/v1/keys/:id/revoke — immediate revocation
userKeys.post('/:id/revoke', async (c) => {
  const userId = c.get('userId');
  const existing = await store.getKey(c.req.param('id'));
  if (!existing || existing.user_id !== userId) return bad(c, 'Key not found', 404);
  const updated = await store.revokeKey(c.req.param('id'));
  await createNotification({ type: 'warning', title: 'API key revoked', message: `Key "${existing.name}" was revoked.`, user_id: userId, link: '/dashboard/keys' });
  return ok(c, { ...updated, key: undefined });
});

// DELETE /api/v1/keys/:id
userKeys.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const existing = await store.getKey(c.req.param('id'));
  if (!existing || existing.user_id !== userId) return bad(c, 'Key not found', 404);
  const deleted = await store.deleteKey(c.req.param('id'));
  return deleted ? ok(c, { deleted: true }) : bad(c, 'Key not found', 404);
});

export default userKeys;
