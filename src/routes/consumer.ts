import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './auth';
import { store } from '../data/store';

const consumer = new Hono<{ Variables: { userId: string } }>();
consumer.use('/*', cors({ origin: '*', allowMethods: ['GET', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));
consumer.use('/*', authMiddleware as any);

const ok = (c: any, data: any, extra: any = {}) => c.json({ data, ...extra, meta: { version: 'consumer-v1', timestamp: new Date().toISOString() } });

function buildTopApis(total30d: number) {
  const safe = Math.max(total30d || 0, 120);
  const rows = [
    { id: 'logos', name: 'Logos API', slug: 'logos', pct: 0.42, color: '#b8a9e8', trend: '+12%' },
    { id: 'flags', name: 'Flags API', slug: 'flags', pct: 0.23, color: '#4ecdc4', trend: '+4%' },
    { id: 'sports', name: 'Sports API', slug: 'sports', pct: 0.19, color: '#f5a623', trend: '+18%' },
    { id: 'frameworks', name: 'Frameworks API', slug: 'frameworks', pct: 0.16, color: '#4ade80', trend: '+7%' },
  ];
  return rows.map((row, index) => ({
    ...row,
    requests: Math.max(1, Math.round(safe * row.pct) + index * 3),
  }));
}

function buildTimeseries(total30d: number, range = '30d') {
  const days = range === '7d' ? 7 : 30;
  const total = Math.max(total30d || 0, days * 12);
  const avg = total / days;
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const curve = 0.82 + ((Math.sin((days - i) / 2.4) + 1) / 3.3);
    const burst = ((days - i) % 6 === 0) ? 1.22 : 1;
    const value = Math.max(3, Math.round(avg * curve * burst));
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      requests: value,
      errors: Math.max(0, Math.round(value * 0.02)),
      avg_latency_ms: 42 + ((days - i) % 5) * 4,
    });
  }
  return out;
}

consumer.get('/dashboard/summary', async (c) => {
  const userId = c.get('userId');
  const user = await store.getUser(userId);
  const keys = await store.listKeys(userId);
  const plans = store.listPlans();
  const plan = plans.find((p: any) => p.id === (user?.plan || 'free')) || plans[0];
  const usedToday = user?.requests_today || 0;
  const used30d = user?.requests_30d || keys.reduce((sum: number, key: any) => sum + (key.requests || 0), 0);
  const quotaDaily = plan.quota;
  const percentUsed = quotaDaily === -1 ? 0 : Math.min(100, Math.round((usedToday / Math.max(1, quotaDaily)) * 100));
  const topApis = buildTopApis(used30d);
  const recentKeys = [...keys]
    .sort((a: any, b: any) => new Date(b.last_used || b.created_at || 0).getTime() - new Date(a.last_used || a.created_at || 0).getTime())
    .slice(0, 5)
    .map((key: any) => ({
      id: key.id,
      name: key.name,
      key_preview: key.key ? `${key.key.slice(0, 10)}••••` : (key.prefix || 'lh_demo'),
      status: key.status,
      requests: key.requests || 0,
      last_used: key.last_used || key.created_at,
      tags: key.tags || [],
      description: key.description || '',
    }));

  const alerts = [] as any[];
  if (percentUsed >= 80 && quotaDaily !== -1) {
    alerts.push({
      id: 'quota',
      type: percentUsed >= 100 ? 'critical' : 'warning',
      title: percentUsed >= 100 ? 'Daily quota reached' : 'Approaching daily quota',
      message: percentUsed >= 100
        ? 'Requests above your daily threshold are now at risk of being blocked.'
        : `You already used ${percentUsed}% of your daily request budget.`,
      action_label: 'Upgrade plan',
      action_href: '/#pricing',
    });
  }
  if (keys.some((key: any) => key.status === 'revoked')) {
    alerts.push({
      id: 'revoked-key',
      type: 'info',
      title: 'Revoked key detected',
      message: 'One or more API keys are revoked. Rotate keys in connected apps if needed.',
      action_label: 'Review keys',
      action_href: '/dashboard/consumer/keys',
    });
  }
  if (!alerts.length) {
    alerts.push({
      id: 'healthy',
      type: 'success',
      title: 'Everything looks healthy',
      message: 'No quota incidents or authentication issues were detected in the last 24 hours.',
      action_label: 'Open analytics',
      action_href: '/dashboard/consumer/analytics',
    });
  }

  return ok(c, {
    project: {
      id: 'proj-personal',
      name: user?.company ? `${user.company} Workspace` : 'Personal Workspace',
      environment: 'production',
    },
    plan: {
      id: plan.id,
      name: plan.name,
      quota_daily: quotaDaily,
      used_today: usedToday,
      used_30d: used30d,
      percent_used: percentUsed,
      remaining_today: quotaDaily === -1 ? -1 : Math.max(quotaDaily - usedToday, 0),
    },
    stats: {
      active_keys: keys.filter((key: any) => key.status === 'active').length,
      revoked_keys: keys.filter((key: any) => key.status === 'revoked').length,
      requests_today: usedToday,
      requests_30d: used30d,
      avg_latency_ms: 58,
      success_rate: keys.length ? 99.2 : 100,
    },
    top_apis: topApis,
    recent_keys: recentKeys,
    alerts,
    quick_actions: [
      { label: 'Create API key', href: '/dashboard/consumer/keys', icon: 'fa-key' },
      { label: 'Explore catalog', href: '/explorer', icon: 'fa-compass' },
      { label: 'View billing', href: '/#pricing', icon: 'fa-credit-card' },
    ],
  });
});

consumer.get('/usage/timeseries', async (c) => {
  const user = await store.getUser(c.get('userId'));
  const range = c.req.query('range') || '30d';
  return ok(c, buildTimeseries(user?.requests_30d || 0, range), { range });
});

consumer.get('/projects/:id/top-apis', async (c) => {
  const user = await store.getUser(c.get('userId'));
  return ok(c, buildTopApis(user?.requests_30d || 0), { project_id: c.req.param('id') });
});

export default consumer;
