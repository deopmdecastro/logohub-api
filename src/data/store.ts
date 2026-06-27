// In-memory mutable store used by the dashboard/admin CRUD APIs.
// This is the persistence layer used today; it is structured to be easily
// swapped for a real backend (D1, KV, Postgres) — every read/write goes through
// the helpers exported below so the API surface stays stable.

import { logos as seedLogos, categories as seedCategories } from './logos';
import { footballTeams, basketballTeams, formula1Teams } from './sports';
import { flags as seedFlags } from './flags';

// ============================================================
// Types
// ============================================================
export interface ApiKey {
  id: string;
  name: string;
  description: string;
  key: string;          // full secret value
  prefix: string;       // masked preview
  permissions: string[];
  environment: 'development' | 'staging' | 'production';
  rate_limit: number;
  expires_at: string;   // ISO date or ''
  status: 'active' | 'inactive' | 'revoked';
  tags: string[];
  notes: string;
  requests: number;
  last_used: string;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  website: string;
  country: string;
  industry: string;
  tags: string[];
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  svg_url: string;
  png_url: string;
  webp_url: string;
  ico_url: string;
  favicon_url: string;
  cover_url: string;
  thumbnail_url: string;
  verified: 'yes' | 'no' | 'pending';
  status: 'published' | 'draft' | 'review' | 'rejected';
  requests: number;
  owner_key: string;
  history: { ts: string; actor: string; action: string; details?: string }[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number; name: string; email: string;
  role: 'admin' | 'editor' | 'viewer' | 'billing';
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  status: 'active' | 'invited' | 'suspended';
  requests_30d: number; joined_at: string;
}

export interface SettingItem {
  id: string; key: string; label: string; value: string;
  group: 'stats' | 'git' | 'platform' | 'billing' | 'brand';
  type: 'text' | 'number' | 'url' | 'secret' | 'boolean' | 'color';
}

export interface ActivityItem {
  id: string; ts: string; actor: string; action: string; target: string;
  type: 'create' | 'update' | 'delete' | 'publish' | 'upload' | 'key' | 'login' | 'billing';
  details: string;
}

// ============================================================
// Helpers
// ============================================================
function rid(prefix = 'id') {
  return prefix + '_' + Math.random().toString(36).slice(2, 10);
}
function now() { return new Date().toISOString(); }
function genKey(env: ApiKey['environment']) {
  const tag = env === 'production' ? 'live' : env === 'staging' ? 'stg' : 'test';
  const rand = () => Array.from({ length: 32 }, () => 'abcdef0123456789'[Math.floor(Math.random() * 16)]).join('');
  return `lh_${tag}_sk_${rand()}`;
}
function maskKey(k: string) { return k.length > 16 ? k.slice(0, 16) + '...' : k; }

// ============================================================
// Seed data
// ============================================================
function seed(): {
  apiKeys: ApiKey[];
  content: ContentItem[];
  team: TeamMember[];
  activity: ActivityItem[];
  settings: SettingItem[];
} {
  const keys: ApiKey[] = [
    { id: 'k_prod_001', name: 'Production Key', description: 'Main production API key used by our public web platform.',
      key: 'lh_live_sk_a91f3b7e9c2d4865bcdef0123456789abc', prefix: 'lh_live_sk_a91f...',
      permissions: ['read', 'write', 'upload'], environment: 'production', rate_limit: 5000, expires_at: '',
      status: 'active', tags: ['main', 'public', 'web'], notes: 'Primary key used by logohub.dev website.',
      requests: 12483, last_used: '2026-06-27T11:30:00Z', created_at: '2026-01-15T09:00:00Z', updated_at: '2026-01-15T09:00:00Z' },
    { id: 'k_dev_001', name: 'Development Key', description: 'Local dev environment key for engineers.',
      key: 'lh_test_sk_b720c4e8af1597123456789abcdefabcd', prefix: 'lh_test_sk_b720...',
      permissions: ['read', 'write'], environment: 'development', rate_limit: 1000, expires_at: '',
      status: 'active', tags: ['dev', 'internal'], notes: 'Shared with the engineering team via 1Password.',
      requests: 847, last_used: '2026-06-27T13:55:00Z', created_at: '2026-02-03T15:21:00Z', updated_at: '2026-02-03T15:21:00Z' },
    { id: 'k_stg_001', name: 'Staging Key', description: 'Used by the staging environment.',
      key: 'lh_stg_sk_c531d9f2ae3b48721038475612abefcdef', prefix: 'lh_stg_sk_c531...',
      permissions: ['read'], environment: 'staging', rate_limit: 2500, expires_at: '2026-12-31T23:59:00Z',
      status: 'active', tags: ['staging', 'qa'], notes: 'Read-only staging key.',
      requests: 3274, last_used: '2026-06-26T18:14:00Z', created_at: '2026-03-10T11:45:00Z', updated_at: '2026-03-10T11:45:00Z' },
    { id: 'k_part_001', name: 'Partner — Acme Corp', description: 'Restricted partner key for Acme Corp integration.',
      key: 'lh_live_sk_d942e3a1bc7659348290abcdef1234abcd', prefix: 'lh_live_sk_d942...',
      permissions: ['read'], environment: 'production', rate_limit: 500, expires_at: '2026-09-30T23:59:00Z',
      status: 'active', tags: ['partner', 'external', 'read-only'], notes: 'Read-only access for Acme integration partner.',
      requests: 5821, last_used: '2026-06-25T22:03:00Z', created_at: '2026-04-22T08:12:00Z', updated_at: '2026-04-22T08:12:00Z' },
  ];
  // Content seed — adapt the existing logos/sports/flags into a unified ContentItem
  const content: ContentItem[] = [
    ...seedLogos.map((l, i) => ({
      id: l.id, slug: l.slug, name: l.name, description: l.description,
      category: l.category, subcategory: l.subcategory, website: l.website,
      country: l.country, industry: l.industry, tags: l.tags,
      primary_color: l.colors[0] || '#b8a9e8', secondary_color: l.colors[1] || '#f5a623',
      background_color: '#FFFFFF', text_color: '#1A1A1A',
      svg_url: l.svg, png_url: l.png, webp_url: l.webp, ico_url: '',
      favicon_url: l.favicon, cover_url: '', thumbnail_url: '',
      verified: (l.verified ? 'yes' : 'pending') as ContentItem['verified'],
      status: 'published' as ContentItem['status'],
      requests: Math.floor(50000 - i * 1100 + Math.random() * 2000),
      owner_key: 'k_prod_001', history: [
        { ts: '2024-01-10T09:00:00Z', actor: 'system', action: 'Created from seed data' },
      ],
      created_at: '2024-01-10T09:00:00Z', updated_at: '2026-06-20T10:00:00Z',
    })),
    ...footballTeams.slice(0, 6).map(t => ({
      id: t.id, slug: t.slug, name: t.name, description: `${t.name} football club from ${t.city}`,
      category: 'football', subcategory: t.league, website: t.website,
      country: t.country, industry: 'Sports', tags: ['football', t.league, t.country.toLowerCase()],
      primary_color: t.colors[0] || '#b8a9e8', secondary_color: t.colors[1] || '#f5a623',
      background_color: '#FFFFFF', text_color: '#1A1A1A',
      svg_url: t.svg, png_url: t.png, webp_url: '', ico_url: '',
      favicon_url: '', cover_url: '', thumbnail_url: '',
      verified: 'yes' as ContentItem['verified'], status: 'published' as ContentItem['status'],
      requests: Math.floor(20000 + Math.random() * 10000),
      owner_key: 'k_prod_001', history: [], created_at: '2024-01-12T09:00:00Z', updated_at: '2026-06-01T10:00:00Z',
    })),
    ...seedFlags.slice(0, 4).map(f => ({
      id: 'flag-' + f.slug, slug: f.slug, name: f.name + ' Flag', description: 'National flag of ' + f.name,
      category: 'flags', subcategory: 'country', website: '',
      country: f.code, industry: 'Flag', tags: ['flag', 'country', String(f.continent || '')],
      primary_color: '#FF0000', secondary_color: '#FFFFFF',
      background_color: '#FFFFFF', text_color: '#1A1A1A',
      svg_url: f.svg, png_url: f.png, webp_url: '', ico_url: '', favicon_url: '', cover_url: '', thumbnail_url: '',
      verified: 'yes' as ContentItem['verified'], status: 'published' as ContentItem['status'],
      requests: Math.floor(8000 + Math.random() * 8000),
      owner_key: 'k_prod_001', history: [], created_at: '2024-01-20T09:00:00Z', updated_at: '2026-06-05T10:00:00Z',
    })),
  ];

  const team: TeamMember[] = [
    { id: 1, name: 'Deogracia De Castro', email: 'deograciadecastro@gmail.com', role: 'admin', plan: 'business', status: 'active', requests_30d: 184213, joined_at: '2024-01-08T08:00:00Z' },
    { id: 2, name: 'Sofia Ferreira', email: 'sofia.ferreira@logohub.dev', role: 'editor', plan: 'pro', status: 'active', requests_30d: 24812, joined_at: '2024-03-12T10:00:00Z' },
    { id: 3, name: 'Lucas Almeida', email: 'lucas@logohub.dev', role: 'editor', plan: 'pro', status: 'active', requests_30d: 18034, joined_at: '2024-05-04T10:00:00Z' },
    { id: 4, name: 'Marta Costa', email: 'marta.costa@logohub.dev', role: 'viewer', plan: 'free', status: 'active', requests_30d: 423, joined_at: '2025-02-19T10:00:00Z' },
    { id: 5, name: 'Acme Corp Integration', email: 'api@acmecorp.com', role: 'viewer', plan: 'business', status: 'active', requests_30d: 58213, joined_at: '2025-04-22T08:00:00Z' },
  ];

  const activity: ActivityItem[] = [
    { id: 'a1', ts: '2026-06-27T13:45:00Z', actor: 'Deogracia De Castro', action: 'Updated logo', target: 'google', type: 'update', details: 'Refreshed primary palette.' },
    { id: 'a2', ts: '2026-06-27T12:12:00Z', actor: 'Sofia Ferreira', action: 'Created API key', target: 'Partner — Acme Corp', type: 'key', details: 'Read-only key issued to Acme.' },
    { id: 'a3', ts: '2026-06-27T10:58:00Z', actor: 'Lucas Almeida', action: 'Uploaded SVG', target: 'tesla', type: 'upload', details: 'Optimized SVG uploaded.' },
    { id: 'a4', ts: '2026-06-27T09:31:00Z', actor: 'Deogracia De Castro', action: 'Published logo', target: 'spotify', type: 'publish', details: 'Spotify v3 logo set live.' },
    { id: 'a5', ts: '2026-06-26T22:14:00Z', actor: 'system', action: 'Billing renewal', target: 'Business plan', type: 'billing', details: 'Subscription renewed: $79.00.' },
    { id: 'a6', ts: '2026-06-26T18:02:00Z', actor: 'Sofia Ferreira', action: 'Logged in', target: 'dashboard', type: 'login', details: 'Successful login from Lisbon, Portugal.' },
  ];

  const settings: SettingItem[] = [
    { id: 's1', key: 'total_assets', label: 'Total Assets', value: '50234', group: 'stats', type: 'number' },
    { id: 's2', key: 'pending_review', label: 'Pending Review', value: '1247', group: 'stats', type: 'number' },
    { id: 's3', key: 'verified_assets', label: 'Verified Assets', value: '12483', group: 'stats', type: 'number' },
    { id: 's4', key: 'rejected_assets', label: 'Rejected Assets', value: '89', group: 'stats', type: 'number' },
    { id: 's5', key: 'total_requests_24h', label: 'Total Requests (24h)', value: '248391', group: 'stats', type: 'number' },
    { id: 's6', key: 'avg_latency_ms', label: 'Avg Latency (ms)', value: '18', group: 'stats', type: 'number' },
    { id: 's7', key: 'success_rate', label: 'Success Rate (%)', value: '99.8', group: 'stats', type: 'number' },
    { id: 's8', key: 'errors_24h', label: 'Errors (24h)', value: '3', group: 'stats', type: 'number' },
    { id: 'p1', key: 'platform_name', label: 'Platform Name', value: 'LogoHub API', group: 'platform', type: 'text' },
    { id: 'p2', key: 'platform_tagline', label: 'Tagline', value: "The World's Largest Visual Identity API", group: 'platform', type: 'text' },
    { id: 'p3', key: 'support_email', label: 'Support Email', value: 'support@logohub.dev', group: 'platform', type: 'text' },
    { id: 'p4', key: 'cdn_base', label: 'CDN Base URL', value: 'https://cdn.logohub.dev', group: 'platform', type: 'url' },
    { id: 'b1', key: 'current_plan', label: 'Current Plan', value: 'Business', group: 'billing', type: 'text' },
    { id: 'b2', key: 'plan_price_usd', label: 'Plan Price (USD/mo)', value: '79', group: 'billing', type: 'number' },
    { id: 'b3', key: 'plan_quota_daily', label: 'Daily Quota', value: '1000000', group: 'billing', type: 'number' },
    { id: 'b4', key: 'plan_used_today', label: 'Used Today', value: '248391', group: 'billing', type: 'number' },
    { id: 'b5', key: 'next_invoice_date', label: 'Next Invoice', value: '2026-07-26', group: 'billing', type: 'text' },
    { id: 'b6', key: 'payment_method', label: 'Payment Method', value: 'Visa •••• 4242', group: 'billing', type: 'text' },
    { id: 'g1', key: 'git_repo_url', label: 'Repository URL', value: 'https://github.com/deopmdecastro/logohub-api', group: 'git', type: 'url' },
    { id: 'g2', key: 'git_branch', label: 'Main Branch', value: 'main', group: 'git', type: 'text' },
    { id: 'g3', key: 'git_user_name', label: 'Git User Name', value: 'Deogracia De Castro', group: 'git', type: 'text' },
    { id: 'g4', key: 'git_user_email', label: 'Git Email', value: 'deograciadecastro@gmail.com', group: 'git', type: 'text' },
    { id: 'g5', key: 'git_pat', label: 'Personal Access Token', value: '', group: 'git', type: 'secret' },
    { id: 'g6', key: 'git_connection_status', label: 'Connection Status', value: 'unknown', group: 'git', type: 'text' },
    { id: 'g7', key: 'git_last_push', label: 'Last Push', value: '', group: 'git', type: 'text' },
    { id: 'br1', key: 'brand_primary', label: 'Brand Primary', value: '#4F46E5', group: 'brand', type: 'color' },
    { id: 'br2', key: 'brand_secondary', label: 'Brand Secondary', value: '#C084FC', group: 'brand', type: 'color' },
    { id: 'br3', key: 'brand_accent', label: 'Brand Accent', value: '#F472B6', group: 'brand', type: 'color' },
    { id: 'br4', key: 'brand_logo_url', label: 'Logo URL', value: '', group: 'brand', type: 'url' },
    { id: 'br5', key: 'brand_favicon_url', label: 'Favicon URL', value: '', group: 'brand', type: 'url' },
  ];

  return { apiKeys: keys, content, team, activity, settings };
}

const state = seed();

// ============================================================
// Public store API — single source of truth for CRUD pages
// ============================================================
export const store = {
  // --- API keys ---
  listKeys: () => state.apiKeys.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)),
  getKey: (id: string) => state.apiKeys.find(k => k.id === id),
  createKey: (input: Partial<ApiKey>): ApiKey => {
    const env = (input.environment as ApiKey['environment']) || 'development';
    const fullKey = input.key && /^lh_/.test(input.key) ? input.key : genKey(env);
    const item: ApiKey = {
      id: rid('k'),
      name: input.name || 'New Key',
      description: input.description || '',
      key: fullKey,
      prefix: maskKey(fullKey),
      permissions: input.permissions || ['read'],
      environment: env,
      rate_limit: Number(input.rate_limit) || 1000,
      expires_at: input.expires_at || '',
      status: (input.status as ApiKey['status']) || 'active',
      tags: input.tags || [],
      notes: input.notes || '',
      requests: 0,
      last_used: '',
      created_at: now(),
      updated_at: now(),
    };
    state.apiKeys.unshift(item);
    state.activity.unshift({
      id: rid('a'), ts: now(), actor: 'You', action: 'Created API key', target: item.name, type: 'key',
      details: `${item.environment} · ${item.permissions.join(', ')}`,
    });
    return item;
  },
  updateKey: (id: string, patch: Partial<ApiKey>): ApiKey | null => {
    const i = state.apiKeys.findIndex(k => k.id === id);
    if (i === -1) return null;
    const k = state.apiKeys[i];
    const merged: ApiKey = {
      ...k, ...patch,
      permissions: patch.permissions ?? k.permissions,
      tags: patch.tags ?? k.tags,
      updated_at: now(),
      // never let the prefix or key be reassigned via patch
      key: k.key, prefix: k.prefix,
    };
    state.apiKeys[i] = merged;
    state.activity.unshift({
      id: rid('a'), ts: now(), actor: 'You', action: 'Updated API key', target: merged.name, type: 'key',
      details: 'Settings updated.',
    });
    return merged;
  },
  revokeKey: (id: string) => store.updateKey(id, { status: 'revoked' }),
  deleteKey: (id: string) => {
    const i = state.apiKeys.findIndex(k => k.id === id);
    if (i === -1) return false;
    const removed = state.apiKeys.splice(i, 1)[0];
    state.activity.unshift({
      id: rid('a'), ts: now(), actor: 'You', action: 'Deleted API key', target: removed.name, type: 'delete', details: 'Key permanently removed.',
    });
    return true;
  },

  // --- Content (logos) ---
  listContent: () => state.content.slice().sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
  getContent: (id: string) => state.content.find(c => c.id === id),
  createContent: (input: Partial<ContentItem>): ContentItem => {
    const item: ContentItem = {
      id: input.id || rid('c'),
      slug: input.slug || 'new-logo-' + Date.now(),
      name: input.name || 'New Logo',
      description: input.description || '',
      category: input.category || 'technology',
      subcategory: input.subcategory || '',
      website: input.website || '',
      country: input.country || '',
      industry: input.industry || '',
      tags: input.tags || [],
      primary_color: input.primary_color || '#b8a9e8',
      secondary_color: input.secondary_color || '#f5a623',
      background_color: input.background_color || '#FFFFFF',
      text_color: input.text_color || '#1A1A1A',
      svg_url: input.svg_url || '',
      png_url: input.png_url || '',
      webp_url: input.webp_url || '',
      ico_url: input.ico_url || '',
      favicon_url: input.favicon_url || '',
      cover_url: input.cover_url || '',
      thumbnail_url: input.thumbnail_url || '',
      verified: (input.verified as ContentItem['verified']) || 'pending',
      status: (input.status as ContentItem['status']) || 'draft',
      requests: 0,
      owner_key: input.owner_key || '',
      history: [{ ts: now(), actor: 'You', action: 'Created' }],
      created_at: now(), updated_at: now(),
    };
    state.content.unshift(item);
    state.activity.unshift({
      id: rid('a'), ts: now(), actor: 'You', action: 'Created logo', target: item.slug, type: 'create',
      details: `Category: ${item.category}`,
    });
    return item;
  },
  updateContent: (id: string, patch: Partial<ContentItem>) => {
    const i = state.content.findIndex(c => c.id === id);
    if (i === -1) return null;
    const c = state.content[i];
    const merged: ContentItem = {
      ...c, ...patch,
      tags: patch.tags ?? c.tags,
      history: [...c.history, { ts: now(), actor: 'You', action: 'Updated', details: Object.keys(patch).join(', ') }],
      updated_at: now(),
    };
    state.content[i] = merged;
    state.activity.unshift({
      id: rid('a'), ts: now(), actor: 'You', action: 'Updated logo', target: merged.slug, type: 'update',
      details: Object.keys(patch).join(', '),
    });
    return merged;
  },
  deleteContent: (id: string) => {
    const i = state.content.findIndex(c => c.id === id);
    if (i === -1) return false;
    const r = state.content.splice(i, 1)[0];
    state.activity.unshift({ id: rid('a'), ts: now(), actor: 'You', action: 'Deleted logo', target: r.slug, type: 'delete', details: '' });
    return true;
  },

  // --- Team ---
  listTeam: () => state.team.slice(),
  saveTeamMember: (input: Partial<TeamMember>): TeamMember => {
    if (input.id) {
      const i = state.team.findIndex(t => t.id === input.id);
      if (i !== -1) {
        state.team[i] = { ...state.team[i], ...input } as TeamMember;
        return state.team[i];
      }
    }
    const id = Math.max(0, ...state.team.map(t => t.id)) + 1;
    const item: TeamMember = {
      id, name: input.name || '', email: input.email || '',
      role: (input.role as TeamMember['role']) || 'viewer',
      plan: (input.plan as TeamMember['plan']) || 'free',
      status: (input.status as TeamMember['status']) || 'invited',
      requests_30d: 0, joined_at: now(),
    };
    state.team.push(item);
    return item;
  },
  deleteTeamMember: (id: number) => {
    const i = state.team.findIndex(t => t.id === id);
    if (i === -1) return false;
    state.team.splice(i, 1);
    return true;
  },

  // --- Settings ---
  listSettings: () => state.settings.slice(),
  getSetting: (key: string) => state.settings.find(s => s.key === key),
  updateSetting: (idOrKey: string, value: string) => {
    const s = state.settings.find(x => x.id === idOrKey || x.key === idOrKey);
    if (!s) return null;
    s.value = value;
    return s;
  },

  // --- Activity ---
  listActivity: () => state.activity.slice(),

  // --- Stats ---
  listCategories: () => seedCategories,
};

// Make seedCategories accessible without re-import elsewhere
export { seedCategories };
