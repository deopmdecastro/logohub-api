-- LogoHub Database Initialization Script
-- Run once when the PostgreSQL container starts for the first time

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL DEFAULT 'consumer' CHECK (role IN ('admin', 'creator', 'consumer')),
    plan        VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
    status      VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
    avatar_url  TEXT,
    bio         TEXT,
    website     VARCHAR(500),
    company     VARCHAR(255),
    earnings_balance DECIMAL(12,2) DEFAULT 0,
    requests_today   INTEGER DEFAULT 0,
    requests_30d     INTEGER DEFAULT 0,
    last_login  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- API KEYS
-- ============================================================
CREATE TABLE IF NOT EXISTS api_keys (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    key         VARCHAR(255) UNIQUE NOT NULL,
    prefix      VARCHAR(20) NOT NULL,
    status      VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    permissions JSONB DEFAULT '[]'::jsonb,
    tags        JSONB DEFAULT '[]'::jsonb,
    plan_override VARCHAR(20),
    requests    INTEGER DEFAULT 0,
    last_used   TIMESTAMPTZ,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTENT (logos, icons, flags, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS content (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) UNIQUE NOT NULL,
    description     TEXT,
    category        VARCHAR(100),
    subcategory     VARCHAR(100),
    website         VARCHAR(500),
    country         VARCHAR(5),
    industry        VARCHAR(100),
    tags            JSONB DEFAULT '[]'::jsonb,
    primary_color   VARCHAR(10),
    secondary_color VARCHAR(10),
    background_color VARCHAR(10),
    text_color      VARCHAR(10),
    svg_url         TEXT,
    png_url         TEXT,
    webp_url        TEXT,
    ico_url         TEXT,
    avatar_url      TEXT,
    favicon_url     TEXT,
    cover_url       TEXT,
    thumbnail_url   TEXT,
    verified        VARCHAR(20) DEFAULT 'pending' CHECK (verified IN ('yes', 'no', 'pending')),
    status          VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'rejected')),
    owner_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_key       VARCHAR(255),
    requests        INTEGER DEFAULT 0,
    downloads       INTEGER DEFAULT 0,
    history         JSONB DEFAULT '[]'::jsonb,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id          SERIAL PRIMARY KEY,
    type        VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    title       VARCHAR(255) NOT NULL,
    message     TEXT,
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(20),
    read        BOOLEAN DEFAULT FALSE,
    link        VARCHAR(500),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
    id          VARCHAR(50) PRIMARY KEY,
    key         VARCHAR(100) UNIQUE NOT NULL,
    label       VARCHAR(255),
    value       TEXT,
    group_name  VARCHAR(50) DEFAULT 'platform',
    type        VARCHAR(20) DEFAULT 'text',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    role        VARCHAR(20) DEFAULT 'viewer',
    plan        VARCHAR(20) DEFAULT 'free',
    status      VARCHAR(20) DEFAULT 'invited',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
    id          SERIAL PRIMARY KEY,
    actor       VARCHAR(255),
    action      VARCHAR(255),
    target      VARCHAR(255),
    type        VARCHAR(50),
    details     TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PASSWORD RESET TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS password_resets (
    id          SERIAL PRIMARY KEY,
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) UNIQUE NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_owner ON content(owner_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at);

-- ============================================================
-- DEFAULT DATA
-- ============================================================

-- Settings
INSERT INTO settings (id, key, label, value, group_name, type) VALUES
('s1', 'site_name', 'Site Name', 'LogoHub', 'platform', 'text'),
('s2', 'site_description', 'Site Description', 'The World''s Largest Visual Identity API', 'platform', 'text'),
('s3', 'admin_email', 'Admin Email', 'admin@logohub.dev', 'platform', 'text'),
('s4', 'current_plan', 'Current Plan', 'business', 'billing', 'text'),
('s5', 'plan_price_usd', 'Plan Price (USD)', '79', 'billing', 'number'),
('s6', 'plan_quota_daily', 'Daily Quota', '1000000', 'billing', 'number'),
('s7', 'plan_used_today', 'Used Today', '0', 'billing', 'number'),
('s8', 'payment_method', 'Payment Method', 'Stripe · ending 4242', 'billing', 'text'),
('s9', 'next_invoice_date', 'Next Invoice', '2026-07-15', 'billing', 'text'),
('s10', 'total_requests_24h', 'Requests (24h)', '208000', 'stats', 'number'),
('s11', 'avg_latency_ms', 'Avg Latency (ms)', '18', 'stats', 'number'),
('s12', 'success_rate', 'Success Rate (%)', '99.7', 'stats', 'number'),
('s13', 'errors_24h', 'Errors (24h)', '64', 'stats', 'number'),
('s14', 'git_repo_url', 'Git Repo URL', '', 'git', 'url'),
('s15', 'git_branch', 'Git Branch', 'main', 'git', 'text'),
('s16', 'git_user_name', 'Git User Name', '', 'git', 'text'),
('s17', 'git_user_email', 'Git Email', '', 'git', 'text'),
('s18', 'git_pat', 'Git PAT', '', 'git', 'secret'),
('s19', 'git_connection_status', 'Git Status', 'unknown', 'git', 'text'),
('s20', 'git_last_push', 'Last Push', '', 'git', 'text'),
('br1', 'brand_primary', 'Brand Primary', '#4F46E5', 'brand', 'color'),
('br2', 'brand_secondary', 'Brand Secondary', '#b8a9e8', 'brand', 'color'),
('br3', 'brand_accent', 'Brand Accent', '#F472B6', 'brand', 'color'),
('br4', 'brand_logo_url', 'Logo URL', '', 'brand', 'url'),
('br5', 'brand_favicon_url', 'Favicon URL', '', 'brand', 'url')
ON CONFLICT (key) DO NOTHING;

-- Default admin user (password: Demo@2026)
INSERT INTO users (id, name, email, password, role, plan, status, avatar_url, bio) VALUES
('00000000-0000-0000-0000-000000000001', 'Zana Admin', 'admin@logohub.dev', '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', 'admin', 'business', 'active', 'https://api.dicebear.com/9.x/initials/svg?seed=ZA', 'Platform administrator — LogoHub')
ON CONFLICT (email) DO NOTHING;

-- Default creator (password: Demo@2026)
INSERT INTO users (id, name, email, password, role, plan, status, avatar_url, bio) VALUES
('00000000-0000-0000-0000-000000000002', 'Creator Demo', 'creator@logohub.dev', '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', 'creator', 'pro', 'active', 'https://api.dicebear.com/9.x/initials/svg?seed=CD', 'Professional logo designer & icon creator')
ON CONFLICT (email) DO NOTHING;

-- Default consumer (password: Demo@2026)
INSERT INTO users (id, name, email, password, role, plan, status, avatar_url, bio) VALUES
('00000000-0000-0000-0000-000000000003', 'Consumer Demo', 'consumer@logohub.dev', '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', 'consumer', 'free', 'active', 'https://api.dicebear.com/9.x/initials/svg?seed=CD', 'API consumer & developer')
ON CONFLICT (email) DO NOTHING;
