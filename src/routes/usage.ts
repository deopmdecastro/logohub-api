// Usage analytics + quota — spec sections 1.8 "Analytics de Utilização" and
// 1.10 "Limites e Quotas". Aggregates the caller's own API keys against
// their plan's daily quota so the dashboard has real numbers to render.
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { store } from '../data/store';
import { authMiddleware } from './auth';

const usage = new Hono<{ Variables: { userId: string } }>();
usage.use('/*', cors({ origin: '*', allowMethods: ['GET', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));
usage.use('/*', authMiddleware as any);

const ok = (c: any, data: any) => c.json({ data, meta: { version: 'v2', timestamp: new Date().toISOString() } });

// GET /api/v1/usage/quota — current plan quota vs. consumption today
usage.get('/quota', async (c) => {
  const userId = c.get('userId');
  const user = await store.getUser(userId);
  const plans = store.listPlans();
  const plan = plans.find((p) => p.id === (user?.plan || 'free')) || plans[0];
  const usedToday = user?.requests_today || 0;
  const quota = plan.quota; // -1 means unlimited (enterprise)

  return ok(c, {
    plan: plan.id,
    quota_daily: quota,
    used_today: usedToday,
    remaining_today: quota === -1 ? -1 : Math.max(quota - usedToday, 0),
    percent_used: quota === -1 ? 0 : Math.min(Math.round((usedToday / quota) * 100), 100),
    used_30d: user?.requests_30d || 0,
  });
});

// GET /api/v1/usage/summary — per-key breakdown for the caller, for the
// "Analytics de Utilização" dashboard
usage.get('/summary', async (c) => {
  const userId = c.get('userId');
  const keys = await store.listKeys(userId);

  const totalRequests = keys.reduce((sum: number, k: any) => sum + (k.requests || 0), 0);
  const activeKeys = keys.filter((k: any) => k.status === 'active').length;

  return ok(c, {
    total_requests: totalRequests,
    active_keys: activeKeys,
    revoked_keys: keys.filter((k: any) => k.status === 'revoked').length,
    by_key: keys.map((k: any) => ({
      id: k.id,
      name: k.name,
      status: k.status,
      requests: k.requests || 0,
      last_used: k.last_used || null,
    })),
  });
});

export default usage;
