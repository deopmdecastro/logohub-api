// Hybrid Store — PostgreSQL (primary) with in-memory fallback
// Tries DB first; if unavailable, falls back to memory store
// All methods return the same shape the front-end expects

import * as db from './db';
import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';
const nanoId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16);

let dbAvailable = false;
db.checkDbConnection().then(ok => { dbAvailable = ok; });

// ============================================================
// IN-MEMORY FALLBACK STORES (used when DB is not connected)
// ============================================================

const memUsers: any[] = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Zana Admin', email: 'admin@logohub.dev', password_hash: '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', role: 'admin', plan: 'business', status: 'active', avatar_url: null, bio: 'Administrator', website: null, company: null, earnings_balance: 0, requests_today: 0, requests_30d: 0, last_login: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Creator Demo', email: 'creator@logohub.dev', password_hash: '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', role: 'creator', plan: 'pro', status: 'active', avatar_url: null, bio: 'Logo designer', website: null, company: null, earnings_balance: 1247.50, requests_today: 0, requests_30d: 0, last_login: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Consumer Demo', email: 'consumer@logohub.dev', password_hash: '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', role: 'consumer', plan: 'free', status: 'active', avatar_url: null, bio: 'Developer', website: null, company: null, earnings_balance: 0, requests_today: 247, requests_30d: 1247, last_login: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];
const memSessions = new Map<string, string>(); // token -> userId
const memApiKeys: any[] = [
  { id: 'key-001', user_id: '00000000-0000-0000-0000-000000000001', name: 'Admin Key', key: 'lh_admin_demo_key_001', prefix: 'lh_admin', status: 'active', permissions: [], tags: [], requests: 0, last_used: null, expires_at: null, plan_override: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'key-002', user_id: '00000000-0000-0000-0000-000000000003', name: 'Default Key', key: 'lh_consumer_demo_key_002', prefix: 'lh_cons', status: 'active', permissions: [], tags: [], requests: 1250, last_used: new Date().toISOString(), expires_at: null, plan_override: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];
const memContent: any[] = [];
const memSettings: any[] = [
  { id: 's1', key: 'site_name', label: 'Site Name', value: 'LogoHub', group_name: 'platform', type: 'text' },
  { id: 's2', key: 'site_description', label: 'Site Description', value: "The World's Largest Visual Identity API", group_name: 'platform', type: 'text' },
  { id: 's4', key: 'current_plan', label: 'Current Plan', value: 'business', group_name: 'billing', type: 'text' },
  { id: 's5', key: 'plan_price_usd', label: 'Plan Price (USD)', value: '79', group_name: 'billing', type: 'number' },
  { id: 's6', key: 'plan_quota_daily', label: 'Daily Quota', value: '1000000', group_name: 'billing', type: 'number' },
  { id: 's7', key: 'plan_used_today', label: 'Used Today', value: '0', group_name: 'billing', type: 'number' },
  { id: 's8', key: 'payment_method', label: 'Payment Method', value: 'Stripe · ending 4242', group_name: 'billing', type: 'text' },
  { id: 's9', key: 'next_invoice_date', label: 'Next Invoice', value: '2026-07-15', group_name: 'billing', type: 'text' },
  { id: 's10', key: 'total_requests_24h', label: 'Requests (24h)', value: '208000', group_name: 'stats', type: 'number' },
  { id: 's11', key: 'avg_latency_ms', label: 'Avg Latency', value: '18', group_name: 'stats', type: 'number' },
  { id: 's12', key: 'success_rate', label: 'Success Rate (%)', value: '99.7', group_name: 'stats', type: 'number' },
  { id: 's13', key: 'errors_24h', label: 'Errors (24h)', value: '64', group_name: 'stats', type: 'number' },
  { id: 's14', key: 'git_repo_url', label: 'Git Repo URL', value: '', group_name: 'git', type: 'url' },
  { id: 's15', key: 'git_branch', label: 'Branch', value: 'main', group_name: 'git', type: 'text' },
  { id: 's19', key: 'git_connection_status', label: 'Git Status', value: 'unknown', group_name: 'git', type: 'text' },
  { id: 'br4', key: 'brand_logo_url', label: 'Logo URL', value: '', group_name: 'brand', type: 'url' },
  { id: 'br5', key: 'brand_favicon_url', label: 'Favicon URL', value: '', group_name: 'brand', type: 'url' },
];
const memTeam: any[] = [];
const memActivity: any[] = [
  { id: 1, actor: 'Zana Admin', action: 'created', target: 'API Key · Default Key', type: 'key', details: 'Created a new API key for production', ts: new Date(Date.now() - 3600000).toISOString(), created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, actor: 'Zana Admin', action: 'uploaded', target: 'Content · Google Logo', type: 'create', details: 'Added new logo asset', ts: new Date(Date.now() - 7200000).toISOString(), created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, actor: 'Creator Demo', action: 'published', target: 'Content · Modern UI Kit', type: 'publish', details: 'Published to the marketplace', ts: new Date(Date.now() - 14400000).toISOString(), created_at: new Date(Date.now() - 14400000).toISOString() },
];
const memPasswordResets: any[] = [];

// ============================================================
// STORE API
// ============================================================

export const store = {
  // --- USERS ---
  async getUserByEmail(email: string) {
    if (dbAvailable) { const u = await db.findUserByEmail(email); if (u) return u; }
    return memUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  async getUser(id: string) {
    if (dbAvailable) { const u = await db.findUserById(id); if (u) return u; }
    return memUsers.find(u => u.id === id) || null;
  },
  async getUserSafe(id: string) {
    const u = await this.getUser(id);
    if (!u) return null;
    const { password_hash, ...safe } = u;
    return safe;
  },
  async createUser(data: { name: string; email: string; password_hash: string; role?: string }) {
    if (dbAvailable) {
      const u = await db.createUser({ name: data.name, email: data.email, password: data.password_hash, role: data.role || 'consumer' });
      if (u) return u;
    }
    const user = {
      id: uuidv4(),
      name: data.name,
      email: data.email.toLowerCase(),
      password_hash: data.password_hash,
      role: data.role || 'consumer',
      plan: 'free',
      status: 'active',
      avatar_url: null, bio: null, website: null, company: null,
      earnings_balance: 0, requests_today: 0, requests_30d: 0,
      last_login: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    memUsers.push(user);
    return user;
  },
  async updateUser(id: string, data: any) {
    if (dbAvailable) { const u = await db.updateUser(id, data); if (u) return u; }
    const idx = memUsers.findIndex(u => u.id === id);
    if (idx === -1) return null;
    Object.assign(memUsers[idx], data, { updated_at: new Date().toISOString() });
    return memUsers[idx];
  },
  async deleteUser(id: string) {
    if (dbAvailable) { const ok = await db.deleteUser(id); if (ok) return true; }
    const idx = memUsers.findIndex(u => u.id === id);
    if (idx === -1) return false;
    memUsers.splice(idx, 1);
    return true;
  },
  async listUsers(filters?: any) {
    if (dbAvailable) { const list = await db.listUsers(filters); if (list.length > 0) return list; }
    let list = [...memUsers];
    if (filters?.role) list = list.filter(u => u.role === filters.role);
    if (filters?.plan) list = list.filter(u => u.plan === filters.plan);
    if (filters?.status) list = list.filter(u => u.status === filters.status);
    return list.map(({ password_hash, ...u }) => u);
  },

  // --- SESSIONS ---
  createSession(userId: string, token: string) { memSessions.set(token, userId); },
  deleteSession(token: string) { memSessions.delete(token); },
  getSession(token: string) { return memSessions.get(token); },

  // --- PASSWORD RESETS ---
  createPasswordReset(userId: string, token: string, expiresAt: string) {
    if (dbAvailable) { db.createPasswordReset(userId, token, new Date(expiresAt)); return; }
    memPasswordResets.push({ user_id: userId, token, expires_at: expiresAt, used: false });
  },
  getPasswordReset(token: string) {
    if (dbAvailable) return db.findPasswordReset(token);
    return memPasswordResets.find(r => r.token === token && !r.used && new Date(r.expires_at) > new Date()) || null;
  },
  usePasswordReset(token: string) {
    if (dbAvailable) { db.usePasswordReset(token); return; }
    const r = memPasswordResets.find(r => r.token === token);
    if (r) r.used = true;
  },

  // --- API KEYS ---
  async listKeys(userId?: string) {
    if (dbAvailable) { const list = await db.listApiKeys(userId); if (list.length > 0) return list.map(k => ({ ...k, requests_24h: k.requests || 0 })); }
    let keys = [...memApiKeys];
    if (userId) keys = keys.filter(k => k.user_id === userId);
    return keys.map(k => ({ ...k, requests_24h: k.requests || 0 }));
  },
  async getKey(id: string) {
    const keys = await this.listKeys();
    return keys.find(k => k.id === id) || null;
  },
  async createKey(data: any) {
    if (dbAvailable) {
      const k = await db.createApiKey({
        user_id: data.user_id, name: data.name,
        key: data.key || ('lh_' + nanoId()), prefix: data.prefix || 'lh',
        permissions: data.permissions, tags: data.tags,
      });
      if (k) return { ...k, requests_24h: 0 };
    }
    const key = {
      id: 'key-' + nanoId(), user_id: data.user_id || null, name: data.name,
      key: data.key || ('lh_' + nanoId()), prefix: data.prefix || 'lh',
      status: 'active', permissions: data.permissions || [], tags: data.tags || [],
      requests: 0, last_used: null, plan_override: null,
      expires_at: data.expires_at || null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    memApiKeys.push(key);
    return { ...key, requests_24h: 0 };
  },
  async updateKey(id: string, data: any) {
    if (dbAvailable) { const k = await db.updateApiKey(id, data); if (k) return { ...k, requests_24h: k.requests || 0 }; }
    const idx = memApiKeys.findIndex(k => k.id === id);
    if (idx === -1) return null;
    Object.assign(memApiKeys[idx], data, { updated_at: new Date().toISOString() });
    return { ...memApiKeys[idx], requests_24h: memApiKeys[idx].requests || 0 };
  },
  async revokeKey(id: string) {
    return this.updateKey(id, { status: 'revoked' });
  },
  async deleteKey(id: string) {
    if (dbAvailable) { const ok = await db.deleteApiKey(id); if (ok) return true; }
    const idx = memApiKeys.findIndex(k => k.id === id);
    if (idx === -1) return false;
    memApiKeys.splice(idx, 1);
    return true;
  },

  // --- CONTENT ---
  async listContent(filters?: any) {
    if (dbAvailable) { const list = await db.listContent(filters); if (list.length > 0) return list; }
    return memContent;
  },
  async getContent(id: string) {
    if (dbAvailable) { const c = await db.getContentById(id); if (c) return c; }
    return memContent.find(c => c.id === id) || null;
  },
  async createContent(data: any) {
    if (dbAvailable) { const c = await db.createContent(data); if (c) return c; }
    const item = {
      id: uuidv4(), name: data.name, slug: data.slug || '', description: data.description || '',
      category: data.category || '', subcategory: '', website: '', country: '', industry: '',
      tags: data.tags || [], primary_color: data.primary_color || '#b8a9e8', secondary_color: data.secondary_color || '#f5a623',
      background_color: data.background_color || '#FFFFFF', text_color: data.text_color || '#1A1A1A',
      svg_url: data.svg_url || '', png_url: data.png_url || '', webp_url: data.webp_url || '',
      ico_url: '', avatar_url: data.avatar_url || '', favicon_url: data.favicon_url || '',
      cover_url: data.cover_url || '', thumbnail_url: data.thumbnail_url || '',
      verified: 'pending', status: 'draft', owner_id: data.owner_id || null, owner_key: data.owner_key || '',
      requests: 0, downloads: 0, history: [],
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    memContent.push(item);
    return item;
  },
  async updateContent(id: string, data: any) {
    if (dbAvailable) { const c = await db.updateContent(id, data); if (c) return c; }
    const idx = memContent.findIndex(c => c.id === id);
    if (idx === -1) return null;
    Object.assign(memContent[idx], data, { updated_at: new Date().toISOString() });
    return memContent[idx];
  },
  async deleteContent(id: string) {
    if (dbAvailable) { const ok = await db.deleteContent(id); if (ok) return true; }
    const idx = memContent.findIndex(c => c.id === id);
    if (idx === -1) return false;
    memContent.splice(idx, 1);
    return true;
  },

  // --- SETTINGS ---
  async listSettings(group?: string) {
    if (dbAvailable) { const list = await db.listSettings(group); if (list.length > 0) return list; }
    let items = [...memSettings];
    if (group) items = items.filter(s => s.group_name === group);
    return items;
  },
  async getSetting(key: string) {
    if (dbAvailable) { const s = await db.getSetting(key); if (s) return s; }
    return memSettings.find(s => s.key === key) || null;
  },
  async updateSetting(key: string, value: string) {
    if (dbAvailable) { const s = await db.updateSetting(key, value); if (s) return s; }
    const idx = memSettings.findIndex(s => s.key === key);
    if (idx === -1) return null;
    memSettings[idx].value = value;
    memSettings[idx].updated_at = new Date().toISOString();
    return memSettings[idx];
  },

  // --- TEAM ---
  async listTeam() {
    if (dbAvailable) { const list = await db.listTeam(); if (list.length > 0) return list; }
    return memTeam;
  },
  async saveTeamMember(data: any) {
    if (dbAvailable) { const m = await db.saveTeamMember(data); if (m) return m; }
    if (data.id) {
      const idx = memTeam.findIndex(t => t.id === data.id);
      if (idx === -1) return null;
      Object.assign(memTeam[idx], data, { updated_at: new Date().toISOString() });
      return memTeam[idx];
    }
    const member = { id: memTeam.length + 1, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    memTeam.push(member);
    return member;
  },
  async deleteTeamMember(id: number) {
    if (dbAvailable) { const ok = await db.deleteTeamMember(id); if (ok) return true; }
    const idx = memTeam.findIndex(t => t.id === id);
    if (idx === -1) return false;
    memTeam.splice(idx, 1);
    return true;
  },

  // --- ACTIVITY ---
  async listActivity() {
    if (dbAvailable) { const list = await db.listActivity(); if (list.length > 0) return list; }
    return memActivity;
  },
  async logActivity(entry: any) {
    if (dbAvailable) { await db.logActivity(entry); return; }
    memActivity.unshift({
      id: memActivity.length + 1,
      ...entry,
      ts: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  },

  // --- PLANS ---
  listPlans() {
    return [
      { id: 'free', name: 'Free', price: 0, quota: 1000, color: '#71717a' },
      { id: 'pro', name: 'Pro', price: 19, quota: 100000, color: '#4ecdc4' },
      { id: 'business', name: 'Business', price: 79, quota: 1000000, color: '#b8a9e8' },
      { id: 'enterprise', name: 'Enterprise', price: -1, quota: -1, color: '#f5a623' },
    ];
  },
  updatePlan(id: string, data: any) {
    const plans = this.listPlans();
    const idx = plans.findIndex(p => p.id === id);
    if (idx === -1) return null;
    Object.assign(plans[idx], data);
    return plans[idx];
  },
};

// Re-export for backward compatibility with auth.ts
export const userStore = {
  getUserByEmail: (email: string) => store.getUserByEmail(email),
  getUser: (id: string) => store.getUser(id),
  getUserSafe: (id: string) => store.getUserSafe(id),
  createUser: (data: any) => store.createUser(data),
  updateUser: (id: string, data: any) => store.updateUser(id, data),
  deleteUser: (id: string) => store.deleteUser(id),
  listUsers: (filters?: any) => store.listUsers(filters),
  createSession: (userId: string, token: string) => store.createSession(userId, token),
  deleteSession: (token: string) => store.deleteSession(token),
  createPasswordReset: (userId: string, token: string, expiresAt: string) => store.createPasswordReset(userId, token, expiresAt),
  getPasswordReset: (token: string) => store.getPasswordReset(token),
  usePasswordReset: (token: string) => store.usePasswordReset(token),
  listPlans: () => store.listPlans(),
  updatePlan: (id: string, data: any) => store.updatePlan(id, data),
};
