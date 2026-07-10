// Billing routes — spec sections 1.11 (Plan/Subscription), 1.12 (Billing/Invoices)
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './auth';
import { billing } from '../services/billing';

const billingRoute = new Hono<{ Variables: { userId: string; userRole: string } }>();
billingRoute.use('/*', cors({ origin: '*', allowMethods: ['GET','POST','PATCH','DELETE','OPTIONS'], allowHeaders: ['Content-Type','Authorization'] }));


const ok = (c: any, d: any) => c.json({ data: d, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, m: string, code=400) => c.json({ error: m, code }, code as any);

billingRoute.use('/webhooks/*', cors({ origin: '*' }));

// Public: plans list
// GET /api/v1/billing/plans
billingRoute.get('/plans', (c) => ok(c, billing.listPlans()));

// Protected routes below
billingRoute.use('/*', authMiddleware as any);

// GET /api/v1/billing/subscription
billingRoute.get('/subscription', (c) => {
  const orgId = c.get('userId');
  const sub = billing.getSubscription(orgId);
  if (!sub) return bad(c, 'No active subscription', 404);
  return ok(c, sub);
});

// POST /api/v1/billing/subscription/change
billingRoute.post('/subscription/change', async (c) => {
  const orgId = c.get('userId');
  const body = await c.req.json().catch(()=>({}));
  if (!body.plan_id) return bad(c, 'plan_id is required');
  try {
    const sub = await billing.createOrUpdateSubscription(orgId, body.plan_id);
    return ok(c, sub);
  } catch (e: any) { return bad(c, e.message, 422); }
});

// POST /api/v1/billing/subscription/cancel
billingRoute.post('/subscription/cancel', async (c) => {
  const orgId = c.get('userId');
  try {
    const sub = await billing.cancelSubscription(orgId);
    return ok(c, sub);
  } catch (e: any) { return bad(c, e.message, 404); }
});

// GET /api/v1/billing/invoices
billingRoute.get('/invoices', (c) => {
  const orgId = c.get('userId');
  return ok(c, billing.listInvoices(orgId));
});

// GET /api/v1/billing/invoices/:id/pdf
billingRoute.get('/invoices/:id/pdf', (c) => {
  const orgId = c.get('userId');
  const inv = billing.getInvoice(c.req.param('id'));
  if (!inv || inv.org_id !== orgId) return bad(c, 'Invoice not found', 404);
  // In production: generate PDF or return signed URL
  return c.json({ data: { download_url: `/api/v1/billing/invoices/${inv.id}/download` } });
});

// GET /api/v1/billing/payment-methods
billingRoute.get('/payment-methods', (c) => ok(c, billing.listPaymentMethods(c.get('userId'))));

// POST /api/v1/billing/payment-methods
billingRoute.post('/payment-methods', async (c) => {
  const body = await c.req.json().catch(()=>({}));
  if (!body.brand || !body.last4) return bad(c, 'brand and last4 are required');
  const pm = billing.addPaymentMethod(c.get('userId'), {
    brand: body.brand,
    last4: body.last4,
    exp_month: body.exp_month || 12,
    exp_year: body.exp_year || 2030,
  });
  return c.json({ data: pm }, 201);
});

// DELETE /api/v1/billing/payment-methods/:id
billingRoute.delete('/payment-methods/:id', (c) => {
  const ok_ = billing.deletePaymentMethod(c.get('userId'), c.req.param('id'));
  return ok_ ? ok(c, { deleted: true }) : bad(c, 'Payment method not found', 404);
});

// POST /api/v1/billing/webhooks/stripe
billingRoute.post('/webhooks/stripe', async (c) => {
  const body = await c.req.text();
  const sig = c.req.header('stripe-signature') || '';
  try {
    const result = await billing.handleStripeWebhook(body, sig);
    return ok(c, result);
  } catch (e: any) { return bad(c, e.message, 400); }
});

// GET /api/v1/billing/usage-breakdown
billingRoute.get('/usage-breakdown', (c) => {
  const orgId = c.get('userId');
  const sub = billing.getSubscription(orgId);
  const plan = sub ? billing.getPlan(sub.plan_id) : billing.getPlan('free');
  const used = 0; // Would come from UsageMetric
  const overageCost = billing.calculateOverageCost(plan?.id || 'free', used);
  return ok(c, {
    plan: plan?.name || 'Free',
    included_requests: plan?.quota || 0,
    used_this_month: used,
    overage_cost_cents: overageCost,
    currency: 'usd',
  });
});

export default billingRoute;
