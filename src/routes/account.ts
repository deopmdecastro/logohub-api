// Security routes — 2FA, sessions, trusted devices (spec 1.14)
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './auth';
import { security } from '../services/security';

const securityRoute = new Hono<{ Variables: { userId: string } }>();
securityRoute.use('/*', cors({ origin: '*', allowMethods: ['GET','POST','DELETE','OPTIONS'], allowHeaders: ['Content-Type','Authorization'] }));
securityRoute.use('/*', authMiddleware as any);

const ok = (c: any, d: any) => c.json({ data: d, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, m: string, code=400) => c.json({ error: m, code }, code as any);

// POST /api/v1/account/2fa/enable — generate TOTP secret
securityRoute.post('/2fa/enable', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(()=>({}));
  const accountName = body.email || 'user@logohub.dev';
  const setup = await security.generateTOTPSecret(userId, accountName);
  return ok(c, { qr_code_url: setup.qrCodeUrl, backup_codes: setup.backupCodes });
});

// POST /api/v1/account/2fa/verify — verify TOTP code
securityRoute.post('/2fa/verify', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(()=>({}));
  if (!body.code) return bad(c, 'code is required');
  const valid = await security.verifyTOTP(userId, body.code);
  return valid ? ok(c, { verified: true }) : bad(c, 'Invalid code', 401);
});

// POST /api/v1/account/2fa/verify-backup — verify backup code
securityRoute.post('/2fa/verify-backup', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(()=>({}));
  if (!body.code) return bad(c, 'code is required');
  const valid = await security.verifyBackupCode(userId, body.code);
  return valid ? ok(c, { verified: true, codes_remaining: security.getBackupCodesRemaining(userId) }) : bad(c, 'Invalid backup code', 401);
});

// POST /api/v1/account/2fa/disable
securityRoute.post('/2fa/disable', async (c) => {
  await security.disable2FA(c.get('userId'));
  return ok(c, { disabled: true });
});

// GET /api/v1/account/2fa/status
securityRoute.get('/2fa/status', (c) => ok(c, {
  enabled: security.is2FAEnabled(c.get('userId')),
  backup_codes_remaining: security.getBackupCodesRemaining(c.get('userId')),
}));

// GET /api/v1/account/sessions
securityRoute.get('/sessions', (c) => ok(c, security.listSessions(c.get('userId'))));

// DELETE /api/v1/account/sessions/:id
securityRoute.delete('/sessions/:id', (c) => {
  const ok_ = security.terminateSession(c.req.param('id'), c.get('userId'));
  return ok_ ? ok(c, { deleted: true }) : bad(c, 'Session not found', 404);
});

// POST /api/v1/account/sessions/terminate-all
securityRoute.post('/sessions/terminate-all', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  const count = security.terminateAllOtherSessions(c.get('userId'), body.current_session_id || '');
  return ok(c, { terminated: count });
});

// GET /api/v1/account/trusted-devices
securityRoute.get('/trusted-devices', (c) => ok(c, security.listTrustedDevices(c.get('userId'))));

// POST /api/v1/account/trusted-devices
securityRoute.post('/trusted-devices', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  const dev = security.addTrustedDevice(c.get('userId'), body.fingerprint || 'unknown', body.name || 'Unknown device');
  return c.json({ data: dev }, 201);
});

// DELETE /api/v1/account/trusted-devices/:id
securityRoute.delete('/trusted-devices/:id', (c) => {
  const ok_ = security.removeTrustedDevice(c.req.param('id'), c.get('userId'));
  return ok_ ? ok(c, { deleted: true }) : bad(c, 'Device not found', 404);
});

// GET /api/v1/account/security-log
securityRoute.get('/security-log', (c) => {
  const limit = parseInt(c.req.query('limit') || '50');
  return ok(c, security.listSecurityLogs(c.get('userId'), limit));
});

export default securityRoute;
