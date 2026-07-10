// SDK routes — generation + publishing (spec 2.10)
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './auth';
import { sdkService } from '../services/sdk';

const sdkRoute = new Hono<{ Variables: { userId: string } }>();
sdkRoute.use('/*', cors({ origin: '*', allowMethods: ['GET','POST','OPTIONS'], allowHeaders: ['Content-Type','Authorization'] }));
sdkRoute.use('/*', authMiddleware as any);

const ok = (c: any, d: any) => c.json({ data: d, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, m: string, code=400) => c.json({ error: m, code }, code as any);

// GET /api/v1/creator/apis/:apiId/sdks/languages
sdkRoute.get('/languages', (c) => ok(c, sdkService.listLanguages()));

// GET /api/v1/creator/apis/:apiId/sdks
sdkRoute.get('/apis/:apiId/sdks', (c) => ok(c, sdkService.listSdks(c.req.param('apiId'))));

// POST /api/v1/creator/apis/:apiId/sdks/generate
sdkRoute.post('/apis/:apiId/sdks/generate', async (c) => {
  const apiId = c.req.param('apiId');
  const body = await c.req.json().catch(()=>({}));
  if (!body.language) return bad(c, 'language is required');
  try {
    const sdk = await sdkService.generate(apiId, body.language, body.name || 'My API', body.slug || 'my-api');
    return ok(c, sdk);
  } catch (e: any) { return bad(c, e.message, 422); }
});

// POST /api/v1/creator/apis/:apiId/sdks/:lang/publish
sdkRoute.post('/apis/:apiId/sdks/:lang/publish', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  try {
    const sdk = await sdkService.publish(c.req.param('apiId'), c.req.param('lang'), body.registry);
    return ok(c, sdk);
  } catch (e: any) { return bad(c, e.message, 404); }
});

export default sdkRoute;
