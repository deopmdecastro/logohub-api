// Changelog service — platform & API changelog (spec 1.17)
export interface ChangelogEntry {
  id: string;
  api_id: string | null;
  type: 'feature' | 'improvement' | 'fix' | 'breaking_change' | 'deprecation';
  title: string;
  body: string;
  version: string | null;
  published_at: string;
  created_at: string;
}

// Seeded changelog
const entries: ChangelogEntry[] = [
  { id:'ch-001', api_id:null, type:'feature', title:'Catalog API Launched', body:'Public API catalog with search, categories, and favorites. Discover all available APIs in one place.', version:null, published_at:'2026-06-15T00:00:00Z', created_at:'2026-06-15T00:00:00Z' },
  { id:'ch-002', api_id:null, type:'feature', title:'Creator Dashboard Released', body:'Full creator workflow: create, version, and publish your own APIs with endpoints, docs, and pricing.', version:null, published_at:'2026-06-20T00:00:00Z', created_at:'2026-06-20T00:00:00Z' },
  { id:'ch-003', api_id:null, type:'improvement', title:'API Key Scopes', body:'Fine-grained permissions for API keys — restrict by endpoint, read/write, or environment.', version:null, published_at:'2026-06-25T00:00:00Z', created_at:'2026-06-25T00:00:00Z' },
  { id:'ch-004', api_id:null, type:'feature', title:'Playground v2', body:'Redesigned API playground with request history, export as cURL/code, and autocomplete from schema.', version:null, published_at:'2026-07-01T00:00:00Z', created_at:'2026-07-01T00:00:00Z' },
  { id:'ch-005', api_id:null, type:'feature', title:'Projects & Teams', body:'Organize keys by project, invite team members with role-based access control.', version:null, published_at:'2026-07-05T00:00:00Z', created_at:'2026-07-05T00:00:00Z' },
  { id:'ch-006', api_id:null, type:'improvement', title:'2FA Security', body:'TOTP-based two-factor authentication with backup codes and trusted device management.', version:null, published_at:'2026-07-08T00:00:00Z', created_at:'2026-07-08T00:00:00Z' },
  { id:'ch-007', api_id:null, type:'feature', title:'Billing & Subscriptions', body:'Integrated Stripe billing with plan management, invoices, and payment methods.', version:null, published_at:'2026-07-10T00:00:00Z', created_at:'2026-07-10T00:00:00Z' },
];

const subscribers: Map<string, string[]> = new Map(); // api_id -> userId[]

export const changelog = {
  list(type?: string, apiId?: string, page=1, limit=20) {
    let r = [...entries];
    if (type) r = r.filter(e => e.type === type);
    if (apiId !== undefined) r = r.filter(e => (apiId === null || apiId === '') ? !e.api_id : e.api_id === apiId);
    r.sort((a,b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    const total = r.length;
    return { data: r.slice((page-1)*limit, page*limit), meta: { total, page, limit, pages: Math.ceil(total/limit) } };
  },
  get(id: string): ChangelogEntry | null { return entries.find(e => e.id === id) || null; },
  create(d: Omit<ChangelogEntry,'id'|'published_at'|'created_at'>): ChangelogEntry {
    const e: ChangelogEntry = { id:'ch-'+crypto.randomUUID().slice(0,6), ...d, published_at: new Date().toISOString(), created_at: new Date().toISOString() };
    entries.push(e); return e;
  },
  subscribe(apiId: string|null, userId: string): void {
    const key = apiId || '__platform__';
    if (!subscribers.has(key)) subscribers.set(key, []);
    if (!subscribers.get(key)!.includes(userId)) subscribers.get(key)!.push(userId);
  },
  unsubscribe(apiId: string|null, userId: string): void {
    const key = apiId || '__platform__';
    const list = subscribers.get(key);
    if (list) { const idx = list.indexOf(userId); if (idx !== -1) list.splice(idx, 1); }
  },
  getSubscribers(apiId: string|null): string[] {
    return subscribers.get(apiId || '__platform__') || [];
  },
};
export default changelog;
