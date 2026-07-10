// Payment service — Stripe integration
// Handles subscriptions, invoices, webhooks, and marketplace payouts (Stripe Connect).
// All financial calculations are server-side (spec rule #1).

interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
  connectClientId: string;
  currency: string;
  platformFeePercent: number;
}

function getStripeConfig(): StripeConfig {
  const env = (globalThis as any).process?.env || {};
  return {
    secretKey: env.STRIPE_SECRET_KEY || '',
    webhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
    connectClientId: env.STRIPE_CONNECT_CLIENT_ID || '',
    currency: env.STRIPE_CURRENCY || 'usd',
    platformFeePercent: Number(env.PLATFORM_FEE_PERCENT || 20),
  };
}

// ============================================================
// Types
// ============================================================
export interface Plan {
  id: string;
  name: string;
  price: number; // monthly in cents
  quota: number; // -1 = unlimited
  max_keys: number;
  max_projects: number;
  features: string[];
  stripe_price_id: string;
}

export interface Invoice {
  id: string;
  org_id: string;
  stripe_invoice_id: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  pdf_url: string | null;
  issued_at: string;
  paid_at: string | null;
}

export interface Subscription {
  id: string;
  org_id: string;
  plan_id: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string;
  created_at: string;
}

export interface Payout {
  id: string;
  creator_id: string;
  period: string;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  status: 'pending' | 'paid' | 'failed';
  stripe_transfer_id: string | null;
  created_at: string;
}

// ============================================================
// Stripe API helpers
// ============================================================
async function stripeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const config = getStripeConfig();
  const baseUrl = 'https://api.stripe.com/v1';

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${config.secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Stripe API error: ${res.status} ${err}`);
  }
  return res.json();
}

function toUrlParams(obj: Record<string, any>): string {
  return new URLSearchParams(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)])
  ).toString();
}

// ============================================================
// Plans (seeded)
// ============================================================
const PLANS: Plan[] = [
  {
    id: 'free', name: 'Free', price: 0, quota: 1000, max_keys: 2, max_projects: 1,
    features: ['1,000 requests/month', '2 API keys', 'Community support', 'Public catalog access'],
    stripe_price_id: '',
  },
  {
    id: 'pro', name: 'Pro', price: 1900, quota: 100000, max_keys: 10, max_projects: 5,
    features: ['100,000 requests/month', '10 API keys', '5 projects', 'Priority support', 'Advanced analytics', 'Webhooks'],
    stripe_price_id: 'price_pro_monthly',
  },
  {
    id: 'business', name: 'Business', price: 7900, quota: 1000000, max_keys: 50, max_projects: 20,
    features: ['1,000,000 requests/month', '50 API keys', '20 projects', 'Live chat support', 'SSO', 'Custom rate limits'],
    stripe_price_id: 'price_business_monthly',
  },
  {
    id: 'enterprise', name: 'Enterprise', price: -1, quota: -1, max_keys: -1, max_projects: -1,
    features: ['Unlimited requests', 'Unlimited keys', 'Unlimited projects', 'Dedicated support', 'SLA', 'Custom contracts'],
    stripe_price_id: '',
  },
];

// ============================================================
// In-memory stores
// ============================================================
const invoices: Invoice[] = [];
const subscriptions: Subscription[] = [];
const payouts: Payout[] = [];
const paymentMethods: Map<string, any[]> = new Map(); // orgId -> cards[]

// ============================================================
// Billing Service API
// ============================================================
export const billing = {
  // --- Plans ---
  listPlans(): Plan[] {
    return PLANS;
  },

  getPlan(id: string): Plan | null {
    return PLANS.find(p => p.id === id) || null;
  },

  // --- Subscriptions ---
  async getSubscription(orgId: string): Promise<Subscription | null> {
    return subscriptions.find(s => s.org_id === orgId) || null;
  },

  async createOrUpdateSubscription(orgId: string, planId: string): Promise<Subscription> {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) throw new Error(`Plan ${planId} not found`);

    const config = getStripeConfig();
    const existing = subscriptions.find(s => s.org_id === orgId);

    // Try Stripe if configured
    if (config.secretKey && plan.stripe_price_id) {
      try {
        if (existing?.stripe_subscription_id) {
          await stripeRequest(`/subscriptions/${existing.stripe_subscription_id}`, {
            method: 'POST',
            body: toUrlParams({
              'items[0][price]': plan.stripe_price_id,
              proration_behavior: 'create_prorations',
            }),
          });
        } else {
          // Create customer + subscription
          const customer = await stripeRequest('/customers', {
            method: 'POST',
            body: toUrlParams({ 'metadata[org_id]': orgId }),
          });
          await stripeRequest('/subscriptions', {
            method: 'POST',
            body: toUrlParams({
              customer: customer.id,
              'items[0][price]': plan.stripe_price_id,
              'metadata[org_id]': orgId,
            }),
          });
        }
      } catch (e: any) {
        console.warn(`[Billing] Stripe failed, using local: ${e.message}`);
      }
    }

    const now = new Date();
    const sub: Subscription = {
      id: 'sub-' + crypto.randomUUID().slice(0, 8),
      org_id: orgId,
      plan_id: planId,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: new Date(now.getTime() + 30 * 86400000).toISOString(),
      cancel_at_period_end: false,
      stripe_subscription_id: existing?.stripe_subscription_id || '',
      created_at: now.toISOString(),
    };

    const idx = subscriptions.findIndex(s => s.org_id === orgId);
    if (idx !== -1) subscriptions[idx] = sub;
    else subscriptions.push(sub);

    return sub;
  },

  async cancelSubscription(orgId: string): Promise<Subscription> {
    const sub = subscriptions.find(s => s.org_id === orgId);
    if (!sub) throw new Error('No subscription found');

    const config = getStripeConfig();
    if (config.secretKey && sub.stripe_subscription_id) {
      try {
        await stripeRequest(`/subscriptions/${sub.stripe_subscription_id}`, {
          method: 'DELETE',
        });
      } catch (e: any) {
        console.warn(`[Billing] Stripe cancel failed: ${e.message}`);
      }
    }

    sub.status = 'canceled';
    sub.cancel_at_period_end = true;
    return sub;
  },

  // --- Invoices ---
  listInvoices(orgId: string): Invoice[] {
    return invoices.filter(i => i.org_id === orgId).sort((a, b) =>
      new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime()
    );
  },

  getInvoice(id: string): Invoice | null {
    return invoices.find(i => i.id === id) || null;
  },

  createInvoice(orgId: string, amount: number, currency?: string): Invoice {
    const inv: Invoice = {
      id: 'inv-' + crypto.randomUUID().slice(0, 8),
      org_id: orgId,
      stripe_invoice_id: '',
      amount,
      currency: currency || getStripeConfig().currency,
      status: 'open',
      pdf_url: null,
      issued_at: new Date().toISOString(),
      paid_at: null,
    };
    invoices.push(inv);
    return inv;
  },

  markInvoicePaid(id: string): Invoice | null {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return null;
    inv.status = 'paid';
    inv.paid_at = new Date().toISOString();
    return inv;
  },

  // --- Payment Methods ---
  listPaymentMethods(orgId: string): any[] {
    return paymentMethods.get(orgId) || [];
  },

  addPaymentMethod(orgId: string, card: { brand: string; last4: string; exp_month: number; exp_year: number }): any {
    const pm = {
      id: 'pm-' + crypto.randomUUID().slice(0, 8),
      org_id: orgId,
      ...card,
      created_at: new Date().toISOString(),
    };
    if (!paymentMethods.has(orgId)) paymentMethods.set(orgId, []);
    paymentMethods.get(orgId)!.push(pm);

    // Try Stripe
    const config = getStripeConfig();
    if (config.secretKey) {
      // In production: create Stripe PaymentMethod + attach to customer
      console.log(`[Billing] Payment method ${pm.brand} ending ${pm.last4} added for ${orgId}`);
    }

    return pm;
  },

  deletePaymentMethod(orgId: string, pmId: string): boolean {
    const methods = paymentMethods.get(orgId);
    if (!methods) return false;
    const idx = methods.findIndex((m: any) => m.id === pmId);
    if (idx === -1) return false;
    methods.splice(idx, 1);
    return true;
  },

  // --- Payouts (for creators via Stripe Connect) ---
  listPayouts(creatorId: string): Payout[] {
    return payouts.filter(p => p.creator_id === creatorId);
  },

  async createPayout(creatorId: string, grossAmount: number): Promise<Payout> {
    const config = getStripeConfig();
    const fee = Math.round(grossAmount * config.platformFeePercent / 100);
    const net = grossAmount - fee;

    const payout: Payout = {
      id: 'pay-' + crypto.randomUUID().slice(0, 8),
      creator_id: creatorId,
      period: new Date().toISOString().slice(0, 7),
      gross_amount: grossAmount,
      platform_fee: fee,
      net_amount: net,
      status: 'pending',
      stripe_transfer_id: null,
      created_at: new Date().toISOString(),
    };

    if (config.secretKey) {
      try {
        // Stripe Connect transfer
        const transfer = await stripeRequest('/transfers', {
          method: 'POST',
          body: toUrlParams({
            amount: net,
            currency: config.currency,
            destination: creatorId,
            'metadata[platform_fee]': fee,
          }),
        });
        payout.stripe_transfer_id = transfer.id;
        payout.status = 'paid';
      } catch (e: any) {
        console.warn(`[Billing] Stripe Connect transfer failed: ${e.message}`);
      }
    }

    payouts.push(payout);
    return payout;
  },

  // --- Usage → cost calculation ---
  calculateOverageCost(planId: string, requestsUsed: number): number {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan || plan.quota === -1) return 0; // unlimited
    if (requestsUsed <= plan.quota) return 0;
    const overage = requestsUsed - plan.quota;
    // $0.05 per 1000 overage requests
    return Math.ceil(overage / 1000) * 5; // in cents
  },

  // --- Webhook handler ---
  async handleStripeWebhook(payload: string, signature: string): Promise<{ received: boolean; type?: string }> {
    const config = getStripeConfig();
    if (!config.webhookSecret) {
      console.log('[Billing] Webhook received but no secret configured — skipping verification');
    }
    // In production: verify signature with stripe.webhooks.constructEvent()
    try {
      const event = JSON.parse(payload);
      console.log(`[Billing] Stripe webhook: ${event.type}`);

      switch (event.type) {
        case 'invoice.paid': {
          const stripeInvoice = event.data.object;
          const localInv = invoices.find(i => i.stripe_invoice_id === stripeInvoice.id);
          if (localInv) {
            localInv.status = 'paid';
            localInv.paid_at = new Date().toISOString();
          }
          break;
        }
        case 'invoice.payment_failed': {
          const stripeInvoice = event.data.object;
          const localInv = invoices.find(i => i.stripe_invoice_id === stripeInvoice.id);
          if (localInv) localInv.status = 'uncollectible';
          break;
        }
        case 'customer.subscription.deleted': {
          const stripeSub = event.data.object;
          const localSub = subscriptions.find(s => s.stripe_subscription_id === stripeSub.id);
          if (localSub) localSub.status = 'canceled';
          break;
        }
      }
      return { received: true, type: event.type };
    } catch (e: any) {
      console.error(`[Billing] Webhook error: ${e.message}`);
      throw e;
    }
  },

  // --- Configuration for Stripe Connect onboarding ---
  getConnectConfig(): { clientId: string; platformFeePercent: number } {
    const config = getStripeConfig();
    return {
      clientId: config.connectClientId,
      platformFeePercent: config.platformFeePercent,
    };
  },
};

export default billing;
