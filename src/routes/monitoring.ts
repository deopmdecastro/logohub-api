// Monitoring routes — health, alerts, incidents, error groups (spec 2.14 + 2.15)
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './auth';
import { monitoring } from '../services/monitoring';

const monitoringRoute = new Hono<{ Variables: { userId: string } }>();
monitoringRoute.use('/*', cors({ origin: '*', allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'], allowHeaders: ['Content-Type','Authorization'] }));
monitoringRoute.use('/*', authMiddleware as any);

const ok = (c: any, d: any) => c.json({ data: d, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, m: string, code=400) => c.json({ error: m, code }, code as any);

// GET /api/v1/monitoring/health/:apiId
monitoringRoute.get('/health/:apiId', (c) => {
  return ok(c, monitoring.getCurrentHealth(c.req.param('apiId')));
});

// GET /api/v1/monitoring/samples/:apiId
monitoringRoute.get('/samples/:apiId', (c) => {
  const min = parseInt(c.req.query('minutes') || '60');
  return ok(c, monitoring.getRecentSamples(c.req.param('apiId'), min));
});

// POST /api/v1/monitoring/samples — record a sample (called by internal pipeline)
monitoringRoute.post('/samples', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  if (!body.api_id) return bad(c, 'api_id required');
  const s = monitoring.recordSample({
    api_id: body.api_id, avg_latency_ms: body.avg_latency_ms || 0,
    p95_latency_ms: body.p95_latency_ms || 0, p99_latency_ms: body.p99_latency_ms || 0,
    error_rate: body.error_rate || 0, request_count: body.request_count || 0,
  });
  return c.json({ data: s }, 201);
});

// Alert Rules
monitoringRoute.get('/alert-rules/:apiId', (c) => ok(c, monitoring.listRules(c.req.param('apiId'))));

monitoringRoute.post('/alert-rules/:apiId', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  const r = monitoring.createRule({
    api_id: c.req.param('apiId'), metric: body.metric, condition: body.condition,
    threshold: body.threshold, window_min: body.window_min || 5,
    channels: body.channels || ['email'], enabled: true,
  });
  return c.json({ data: r }, 201);
});

monitoringRoute.patch('/alert-rules/:apiId/:id', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  const r = monitoring.updateRule(c.req.param('id'), c.req.param('apiId'), body);
  return r ? ok(c, r) : bad(c, 'Rule not found', 404);
});

monitoringRoute.delete('/alert-rules/:apiId/:id', (c) => {
  const ok_ = monitoring.deleteRule(c.req.param('id'), c.req.param('apiId'));
  return ok_ ? ok(c, { deleted: true }) : bad(c, 'Not found', 404);
});

// Incidents
monitoringRoute.get('/incidents/:apiId', (c) => ok(c, monitoring.listIncidents(c.req.param('apiId'))));

monitoringRoute.post('/incidents/:apiId', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  const inc = monitoring.createIncident({
    api_id: c.req.param('apiId'), title: body.title,
    severity: body.severity || 'minor', status: 'open',
    started_at: new Date().toISOString(), resolved_at: null,
    summary: body.summary || '',
  });
  return c.json({ data: inc }, 201);
});

monitoringRoute.patch('/incidents/:apiId/:id', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  const inc = monitoring.updateIncident(c.req.param('id'), body);
  return inc ? ok(c, inc) : bad(c, 'Incident not found', 404);
});

// Error Groups
monitoringRoute.get('/errors/:apiId', (c) => {
  const status = c.req.query('status');
  return ok(c, monitoring.listErrorGroups(c.req.param('apiId'), status));
});

monitoringRoute.get('/errors/:apiId/:id', (c) => {
  const g = monitoring.getErrorGroup(c.req.param('id'));
  return g ? ok(c, g) : bad(c, 'Error group not found', 404);
});

monitoringRoute.post('/errors/:apiId', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  const g = monitoring.recordError(
    c.req.param('apiId'), body.endpoint || '/',
    body.status_code || 500, body.message || 'Unknown error'
  );
  return c.json({ data: g }, 201);
});

monitoringRoute.patch('/errors/:apiId/:id', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  const g = monitoring.updateErrorGroup(c.req.param('id'), body);
  return g ? ok(c, g) : bad(c, 'Error group not found', 404);
});

export default monitoringRoute;
