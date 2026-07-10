// Billing routes — spec 1.11 (Plans/Subscriptions), 1.12 (Invoices/Payments)
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './auth';
import { billing } from '../services/billing';

const billingRoute = new Hono<{ Variables: { userId: string; userRole: string } }>();
billingRoute.use('/*', cors({ origin: '*', allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'], allowHeaders: ['Content-Type','Authorization'] }));

const ok = (c: any, d: any) => c.json({ data: d, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, m: string, code=400) => c.json({ error: m, code }, code as any);

// ── Public routes (no auth required) ──────────────────────────────

// GET /api/v1/billing/plans — public
billingRoute.get('/plans', (c) => ok(c, billing.listPlans()));

// POST /api/v1/billing/webhooks/stripe — Stripe calls this, no user auth
billingRoute.post('/webhooks/stripe', async (c) => {
  const body = await c.req.text();
  const sig = c.req.header('stripe-signature') || '';
  try {
    const result = await billing.handleStripeWebhook(body, sig);
    return ok(c, result);
  } catch (e: any) { return bad(c, e.message, 400); }
});

// ── Auth-protected routes ─────────────────────────────────────────
// (apply middleware only to these specific routes via a sub-router)
const protectedBilling = new Hono<{ Variables: { userId: string } }>();
protectedBilling.use('/*', authMiddleware as any);

protectedBilling.get('/subscription', (c) => {
  const orgId = c.get('userId');
  const sub = billing.getSubscription(orgId);
  if (!sub) return bad(c, 'No active subscription', 404);
  return ok(c, sub);
});

protectedBilling.post('/subscription/change', async (c) => {
  const orgId = c.get('userId');
  const body = await c.req.json().catch(()=>({}));
  if (!body.plan_id) return bad(c, 'plan_id is required');
  try {
    const sub = await billing.createOrUpdateSubscription(orgId, body.plan_id);
    return ok(c, sub);
  } catch (e: any) { return bad(c, e.message, 422); }
});

protectedBilling.post('/subscription/cancel', async (c) => {
  const orgId = c.get('userId');
  try {
    const sub = await billing.cancelSubscription(orgId);
    return ok(c, sub);
  } catch (e: any) { return bad(c, e.message, 404); }
});

protectedBilling.get('/invoices', (c) => ok(c, billing.listInvoices(c.get('userId'))));

protectedBilling.get('/invoices/:id/pdf', (c) => {
  const orgId = c.get('userId');
  const inv = billing.getInvoice(c.req.param('id'));
  if (!inv || inv.org_id !== orgId) return bad(c, 'Invoice not found', 404);
  return c.json({ data: { download_url: `/api/v1/billing/invoices/${inv.id}/download` } });
});

protectedBilling.get('/payment-methods', (c) => ok(c, billing.listPaymentMethods(c.get('userId'))));

protectedBilling.post('/payment-methods', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  if (!body.brand || !body.last4) return bad(c, 'brand and last4 are required');
  const pm = billing.addPaymentMethod(c.get('userId'), { brand: body.brand, last4: body.last4, exp_month: body.exp_month || 12, exp_year: body.exp_year || 2030 });
  return c.json({ data: pm }, 201);
});

protectedBilling.delete('/payment-methods/:id', (c) => {
  return billing.deletePaymentMethod(c.get('userId'), c.req.param('id'))
    ? ok(c, { deleted: true })
    : bad(c, 'Payment method not found', 404);
});

protectedBilling.get('/usage-breakdown', (c) => {
  const orgId = c.get('userId');
  const sub = billing.getSubscription(orgId);
  const plan = sub ? billing.getPlan(sub.plan_id) : billing.getPlan('free');
  return ok(c, {
    plan: plan?.name || 'Free',
    included_requests: plan?.quota || 0,
    used_this_month: 0,
    overage_cost_cents: billing.calculateOverageCost(plan?.id || 'free', 0),
    currency: 'usd',
  });
});

// Mount protected sub-router
billingRoute.route('/', protectedBilling);

export default billingRoute;
