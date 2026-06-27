// User system: Admin, Creator, Consumer
// Plans: Free, Pro, Business, Enterprise

import { randomUUID } from 'crypto';

// ============================================================
// Types
// ============================================================
export type UserRole = 'admin' | 'creator' | 'consumer';
export type UserPlan = 'free' | 'pro' | 'business' | 'enterprise';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  plan: UserPlan;
  status: UserStatus;
  avatar_url: string;
  earnings_balance: number;  // for creators
  requests_today: number;
  requests_total: number;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: UserPlan;
  price_usd: number;
  requests_per_day: number;
  max_api_keys: number;
  max_files_per_key: number;
  features: string[];
  is_active: boolean;
}

export interface UserSession {
  user_id: string;
  token: string;
  expires_at: string;
}

// ============================================================
// Plans configuration
// ============================================================
export const PLANS: Plan[] = [
  {
    id: 'plan_free',
    name: 'Free',
    slug: 'free',
    price_usd: 0,
    requests_per_day: 1000,
    max_api_keys: 1,
    max_files_per_key: 3,
    features: ['Basic API access', 'SVG & PNG formats', '1 API key', 'Community support'],
    is_active: true,
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    slug: 'pro',
    price_usd: 19,
    requests_per_day: 100000,
    max_api_keys: 5,
    max_files_per_key: 10,
    features: ['All image formats', 'URL transformations', '5 API keys', 'Email support', 'Analytics'],
    is_active: true,
  },
  {
    id: 'plan_business',
    name: 'Business',
    slug: 'business',
    price_usd: 79,
    requests_per_day: 1000000,
    max_api_keys: 25,
    max_files_per_key: 50,
    features: ['Priority support', 'Advanced analytics', '25 API keys', 'Team access', 'Custom CDN', 'SLA guarantee'],
    is_active: true,
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    slug: 'enterprise',
    price_usd: 0, // custom
    requests_per_day: 999999999,
    max_api_keys: 999,
    max_files_per_key: 999,
    features: ['Unlimited requests', 'Dedicated CDN', 'Custom SLA', 'Dedicated support', 'On-premise option', 'Custom integrations'],
    is_active: true,
  },
];

// ============================================================
// In-memory user store (swap for real DB later)
// ============================================================
const users: User[] = [
  {
    id: 'u_admin_001',
    name: 'Deogracia De Castro',
    email: 'deograciadecastro@gmail.com',
    // bcrypt hash of 'admin123' — pre-computed for seed
    password_hash: '$2a$10$placeholder_admin_hash_will_be_set_on_first_login',
    role: 'admin',
    plan: 'business',
    status: 'active',
    avatar_url: '',
    earnings_balance: 0,
    requests_today: 0,
    requests_total: 0,
    created_at: '2024-01-08T08:00:00Z',
    updated_at: '2024-01-08T08:00:00Z',
  },
];

const sessions: UserSession[] = [];

// ============================================================
// Helpers
// ============================================================
function now() { return new Date().toISOString(); }
function uid() { return 'u_' + randomUUID().slice(0, 8); }

// ============================================================
// Public store API
// ============================================================
export const userStore = {
  // --- Plans ---
  listPlans: () => PLANS,
  getPlan: (slug: UserPlan) => PLANS.find(p => p.slug === slug),
  updatePlan: (id: string, patch: Partial<Plan>): Plan | null => {
    const i = PLANS.findIndex(p => p.id === id);
    if (i === -1) return null;
    PLANS[i] = { ...PLANS[i], ...patch };
    return PLANS[i];
  },

  // --- Users ---
  listUsers: () => users.map(u => ({ ...u, password_hash: undefined as any })),
  getUser: (id: string) => users.find(u => u.id === id),
  getUserByEmail: (email: string) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getUserSafe: (id: string) => {
    const u = users.find(u => u.id === id);
    if (!u) return null;
    const { password_hash, ...safe } = u;
    return safe;
  },

  createUser: (input: { name: string; email: string; password_hash: string; role?: UserRole }): User => {
    const user: User = {
      id: uid(),
      name: input.name,
      email: input.email.toLowerCase(),
      password_hash: input.password_hash,
      role: input.role || 'consumer',
      plan: 'free',
      status: 'active',
      avatar_url: '',
      earnings_balance: 0,
      requests_today: 0,
      requests_total: 0,
      created_at: now(),
      updated_at: now(),
    };
    users.push(user);
    return user;
  },

  updateUser: (id: string, patch: Partial<User>): User | null => {
    const i = users.findIndex(u => u.id === id);
    if (i === -1) return null;
    users[i] = { ...users[i], ...patch, updated_at: now() };
    return users[i];
  },

  deleteUser: (id: string): boolean => {
    const i = users.findIndex(u => u.id === id);
    if (i === -1) return false;
    users.splice(i, 1);
    return true;
  },

  // --- Sessions ---
  createSession: (user_id: string, token: string, expiresInHours = 24): UserSession => {
    const expires_at = new Date(Date.now() + expiresInHours * 3600000).toISOString();
    // Remove old sessions for this user
    const idx = sessions.findIndex(s => s.user_id === user_id);
    if (idx !== -1) sessions.splice(idx, 1);
    const session: UserSession = { user_id, token, expires_at };
    sessions.push(session);
    return session;
  },

  getSession: (token: string): UserSession | null => {
    const s = sessions.find(s => s.token === token && new Date(s.expires_at) > new Date());
    return s || null;
  },

  deleteSession: (token: string): boolean => {
    const i = sessions.findIndex(s => s.token === token);
    if (i === -1) return false;
    sessions.splice(i, 1);
    return true;
  },

  // --- Usage tracking ---
  incrementRequests: (user_id: string): boolean => {
    const u = users.find(u => u.id === user_id);
    if (!u) return false;
    u.requests_today++;
    u.requests_total++;
    return true;
  },

  getUserPlanLimit: (user_id: string): Plan | null => {
    const u = users.find(u => u.id === user_id);
    if (!u) return null;
    return PLANS.find(p => p.slug === u.plan) || null;
  },

  canMakeRequest: (user_id: string): boolean => {
    const u = users.find(u => u.id === user_id);
    if (!u || u.status !== 'active') return false;
    const plan = PLANS.find(p => p.slug === u.plan);
    if (!plan) return false;
    return u.requests_today < plan.requests_per_day;
  },

  // --- Creator earnings ---
  addEarnings: (user_id: string, amount: number): boolean => {
    const u = users.find(u => u.id === user_id);
    if (!u || u.role !== 'creator') return false;
    u.earnings_balance += amount;
    return true;
  },
};
