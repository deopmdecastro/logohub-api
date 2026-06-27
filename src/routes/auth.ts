// Auth routes — user registration, login, profile management
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { userStore } from '../data/users';

const auth = new Hono();
auth.use('/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));

const JWT_SECRET = process.env.JWT_SECRET || 'logohub-dev-secret-change-in-production';
const ok = (c: any, data: any) => c.json({ data, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, msg: string, code = 400) => c.json({ error: msg, code }, code as any);

// --- JWT middleware ---
async function authMiddleware(c: any, next: any) {
  const header = c.req.header('Authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '');
  if (!token) return bad(c, 'Authentication required', 401);
  try {
    const payload = verify(token, JWT_SECRET) as { sub: string; role: string };
    c.set('userId', payload.sub);
    c.set('userRole', payload.role);
    await next();
  } catch {
    return bad(c, 'Invalid or expired token', 401);
  }
}

// --- Admin middleware ---
async function adminMiddleware(c: any, next: any) {
  if (c.get('userRole') !== 'admin') return bad(c, 'Admin access required', 403);
  await next();
}

// ============================================================
// POST /api/v1/auth/register
// ============================================================
auth.post('/register', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { name, email, password, role } = body;

  if (!name || !email || !password) return bad(c, 'Name, email, and password are required');
  if (password.length < 8) return bad(c, 'Password must be at least 8 characters');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(c, 'Invalid email format');

  const existing = userStore.getUserByEmail(email);
  if (existing) return bad(c, 'Email already in use', 409);

  if (role && !['consumer', 'creator'].includes(role)) return bad(c, 'Invalid role. Must be "consumer" or "creator"');

  const password_hash = await hash(password, 10);
  const user = userStore.createUser({ name, email, password_hash, role: role || 'consumer' });

  const token = sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  userStore.createSession(user.id, token);

  const { password_hash: _, ...safeUser } = user;
  return c.json({ data: { user: safeUser, token }, meta: { version: 'v2', timestamp: new Date().toISOString() } }, 201);
});

// ============================================================
// POST /api/v1/auth/login
// ============================================================
auth.post('/login', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { email, password } = body;

  if (!email || !password) return bad(c, 'Email and password are required');

  const user = userStore.getUserByEmail(email);
  if (!user) return bad(c, 'Invalid credentials', 401);

  if (user.status !== 'active') return bad(c, 'Account is ' + user.status, 403);

  const valid = await compare(password, user.password_hash);
  if (!valid) return bad(c, 'Invalid credentials', 401);

  const token = sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  userStore.createSession(user.id, token);

  const { password_hash: _, ...safeUser } = user;
  return ok(c, { user: safeUser, token });
});

// ============================================================
// GET /api/v1/auth/me
// ============================================================
auth.get('/me', authMiddleware, (c) => {
  const userId = c.get('userId');
  const user = userStore.getUserSafe(userId);
  if (!user) return bad(c, 'User not found', 404);
  return ok(c, user);
});

// ============================================================
// PATCH /api/v1/auth/me
// ============================================================
auth.patch('/me', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(() => ({}));
  const patch: any = {};
  if (body.name) patch.name = body.name;
  if (body.avatar_url !== undefined) patch.avatar_url = body.avatar_url;
  const updated = userStore.updateUser(userId, patch);
  if (!updated) return bad(c, 'User not found', 404);
  const { password_hash: _, ...safeUser } = updated;
  return ok(c, safeUser);
});

// ============================================================
// POST /api/v1/auth/logout
// ============================================================
auth.post('/logout', authMiddleware, (c) => {
  const header = c.req.header('Authorization') || '';
  const token = header.replace(/^Bearer\s+/i, '');
  userStore.deleteSession(token);
  return ok(c, { message: 'Logged out successfully' });
});

// ============================================================
// Admin: GET /api/v1/admin/users
// ============================================================
auth.get('/admin/users', authMiddleware, adminMiddleware, (c) => {
  return ok(c, userStore.listUsers());
});

// ============================================================
// Admin: PATCH /api/v1/admin/users/:id
// ============================================================
auth.patch('/admin/users/:id', authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const updated = userStore.updateUser(id, body);
  if (!updated) return bad(c, 'User not found', 404);
  const { password_hash: _, ...safeUser } = updated;
  return ok(c, safeUser);
});

// ============================================================
// Admin: DELETE /api/v1/admin/users/:id
// ============================================================
auth.delete('/admin/users/:id', authMiddleware, adminMiddleware, (c) => {
  const id = c.req.param('id');
  if (!userStore.deleteUser(id)) return bad(c, 'User not found', 404);
  return ok(c, { deleted: true });
});

// ============================================================
// Admin: GET /api/v1/admin/plans
// ============================================================
auth.get('/admin/plans', authMiddleware, adminMiddleware, (c) => {
  return ok(c, userStore.listPlans());
});

// ============================================================
// Admin: PATCH /api/v1/admin/plans/:id
// ============================================================
auth.patch('/admin/plans/:id', authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  const updated = userStore.updatePlan(id, body);
  if (!updated) return bad(c, 'Plan not found', 404);
  return ok(c, updated);
});

export default auth;
export { authMiddleware, adminMiddleware };
