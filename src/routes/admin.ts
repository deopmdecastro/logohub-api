// Admin / dashboard CRUD API
// Powers the redesigned dashboard pages. Reads/writes through the in-memory
// store (data/store.ts) — every endpoint already returns the shape the front-end
// expects, so swapping in a real DB later is a one-file refactor.

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { store } from '../data/store';

const admin = new Hono();

admin.use('/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'] }));

const ok = (c: any, data: any, extra: any = {}) => c.json({ data, ...extra, meta: { version: 'admin-v1', timestamp: new Date().toISOString() } });
const bad = (c: any, msg: string, code = 400) => c.json({ error: msg, code }, code as any);

// ============================================================
// API KEYS
// ============================================================
admin.get('/keys', (c) => ok(c, store.listKeys()));
admin.get('/keys/:id', (c) => {
  const k = store.getKey(c.req.param('id'));
  return k ? ok(c, k) : bad(c, 'Key not found', 404);
});
admin.post('/keys', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return bad(c, 'name is required');
  const k = store.createKey(body);
  return c.json({ data: k, meta: { version: 'admin-v1', timestamp: new Date().toISOString() } }, 201);
});
admin.patch('/keys/:id', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const k = store.updateKey(c.req.param('id'), body);
  return k ? ok(c, k) : bad(c, 'Key not found', 404);
});
admin.post('/keys/:id/revoke', (c) => {
  const k = store.revokeKey(c.req.param('id'));
  return k ? ok(c, k) : bad(c, 'Key not found', 404);
});
admin.delete('/keys/:id', (c) => {
  const okDel = store.deleteKey(c.req.param('id'));
  return okDel ? ok(c, { deleted: true }) : bad(c, 'Key not found', 404);
});

// ============================================================
// CONTENT (logos / sport teams / flags — unified)
// ============================================================
admin.get('/content', (c) => {
  const q = (c.req.query('q') || '').toLowerCase();
  const category = c.req.query('category') || '';
  const status = c.req.query('status') || '';
  let items = store.listContent();
  if (category) items = items.filter(i => i.category === category);
  if (status) items = items.filter(i => i.status === status);
  if (q) items = items.filter(i =>
    (i.name + ' ' + i.slug + ' ' + i.description + ' ' + i.tags.join(' ')).toLowerCase().includes(q)
  );
  return ok(c, items, { total: items.length });
});
admin.get('/content/:id', (c) => {
  const item = store.getContent(c.req.param('id'));
  return item ? ok(c, item) : bad(c, 'Content not found', 404);
});
admin.post('/content', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return bad(c, 'name is required');
  const item = store.createContent(body);
  return c.json({ data: item, meta: { version: 'admin-v1', timestamp: new Date().toISOString() } }, 201);
});
admin.patch('/content/:id', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const item = store.updateContent(c.req.param('id'), body);
  return item ? ok(c, item) : bad(c, 'Content not found', 404);
});
admin.delete('/content/:id', (c) => {
  return store.deleteContent(c.req.param('id')) ? ok(c, { deleted: true }) : bad(c, 'Content not found', 404);
});

// ============================================================
// TEAM
// ============================================================
admin.get('/team', (c) => ok(c, store.listTeam()));
admin.post('/team', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  return ok(c, store.saveTeamMember(body));
});
admin.delete('/team/:id', (c) => {
  return store.deleteTeamMember(Number(c.req.param('id'))) ? ok(c, { deleted: true }) : bad(c, 'Member not found', 404);
});

// ============================================================
// SETTINGS  (includes Git config)
// ============================================================
admin.get('/settings', (c) => {
  const group = c.req.query('group');
  let items = store.listSettings();
  if (group) items = items.filter(s => s.group === group);
  return ok(c, items);
});
admin.patch('/settings/:key', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (typeof body.value === 'undefined') return bad(c, 'value is required');
  const s = store.updateSetting(c.req.param('key'), String(body.value));
  return s ? ok(c, s) : bad(c, 'Setting not found', 404);
});

// Test Git connection (lightweight, never exposes the PAT).
// Validates required fields and runs a HEAD request against the repo URL.
admin.post('/git/test', async (c) => {
  const url = store.getSetting('git_repo_url')?.value || '';
  const branch = store.getSetting('git_branch')?.value || '';
  const pat = store.getSetting('git_pat')?.value || '';
  const errors: string[] = [];
  if (!/^https?:\/\//.test(url)) errors.push('Repo URL must start with https://');
  if (!branch) errors.push('Branch is required');
  if (!pat || pat.length < 8) errors.push('Personal access token is missing or too short');
  if (errors.length) {
    store.updateSetting('git_connection_status', 'error');
    return c.json({ data: { ok: false, errors }, meta: { version: 'admin-v1' } }, 400);
  }
  // Try a HEAD against the repo URL
  let ok = false; let detail = '';
  try {
    const r = await (globalThis as any).fetch(url, { method: 'HEAD' });
    ok = r.ok || r.status === 301 || r.status === 302;
    detail = 'HTTP ' + r.status;
  } catch (e: any) {
    detail = e?.message || 'fetch failed';
  }
  store.updateSetting('git_connection_status', ok ? 'connected' : 'error');
  return c.json({ data: { ok, detail }, meta: { version: 'admin-v1' } });
});

// ============================================================
// ACTIVITY
// ============================================================
admin.get('/activity', (c) => ok(c, store.listActivity()));

// ============================================================
// STATS (combined snapshot for the overview page)
// ============================================================
admin.get('/stats', (c) => {
  const keys = store.listKeys();
  const content = store.listContent();
  const team = store.listTeam();
  const settings = store.listSettings();
  const sv = (k: string) => settings.find(s => s.key === k)?.value;
  return ok(c, {
    total_requests: Number(sv('total_requests_24h')) || 0,
    avg_latency_ms: Number(sv('avg_latency_ms')) || 0,
    success_rate: Number(sv('success_rate')) || 0,
    errors_24h: Number(sv('errors_24h')) || 0,
    total_assets: content.length,
    verified_assets: content.filter(c => c.verified === 'yes').length,
    pending_assets: content.filter(c => c.verified === 'pending').length,
    active_keys: keys.filter(k => k.status === 'active').length,
    total_keys: keys.length,
    team_members: team.length,
    plan: sv('current_plan'),
    plan_used_today: Number(sv('plan_used_today')) || 0,
    plan_quota_daily: Number(sv('plan_quota_daily')) || 0,
  });
});

export default admin;
