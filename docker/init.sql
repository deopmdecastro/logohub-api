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
    password_hash VARCHAR(255),
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
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id          VARCHAR(50) PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) UNIQUE NOT NULL,
    excerpt     TEXT,
    content     TEXT,
    category    VARCHAR(100),
    tags        JSONB DEFAULT '[]'::jsonb,
    author      VARCHAR(255),
    status      VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    image_url   TEXT,
    published_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FAQ ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS faq_entries (
    id          VARCHAR(50) PRIMARY KEY,
    question    TEXT NOT NULL,
    answer      TEXT NOT NULL,
    category    VARCHAR(100),
    status      VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS support_tickets (
    id          VARCHAR(50) PRIMARY KEY,
    subject     VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority    VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
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
INSERT INTO users (id, name, email, password, password_hash, role, plan, status, avatar_url, bio) VALUES
('00000000-0000-0000-0000-000000000001', 'Zana Admin', 'admin@logohub.dev', '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', 'admin', 'business', 'active', 'https://api.dicebear.com/9.x/initials/svg?seed=ZA', 'Platform administrator — LogoHub')
ON CONFLICT (email) DO NOTHING;

-- Default creator (password: Demo@2026)
INSERT INTO users (id, name, email, password, password_hash, role, plan, status, avatar_url, bio) VALUES
('00000000-0000-0000-0000-000000000002', 'Creator Demo', 'creator@logohub.dev', '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', 'creator', 'pro', 'active', 'https://api.dicebear.com/9.x/initials/svg?seed=CD', 'Professional logo designer & icon creator')
ON CONFLICT (email) DO NOTHING;

-- Default consumer (password: Demo@2026)
INSERT INTO users (id, name, email, password, password_hash, role, plan, status, avatar_url, bio) VALUES
('00000000-0000-0000-0000-000000000003', 'Consumer Demo', 'consumer@logohub.dev', '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', '$2a$10$m7GFsAQbgpAnFQQs/.zxIuJmaObDMm2vZ9nGHXycUfkIg96EGaXAO', 'consumer', 'free', 'active', 'https://api.dicebear.com/9.x/initials/svg?seed=CD', 'API consumer & developer')
ON CONFLICT (email) DO NOTHING;


-- ============================================================
-- MOCK CONTENT — 12 logo/assets for demo purposes
-- ============================================================
INSERT INTO content (id, name, slug, description, category, subcategory, website, country, industry, tags, primary_color, secondary_color, background_color, text_color, svg_url, png_url, verified, status, owner_id, requests, downloads) VALUES
('10000000-0000-0000-0000-000000000001', 'Google G Logo', 'google-g', 'The iconic multicolor Google "G" logo mark. One of the most recognized brand marks in the world, used across all Google products and services.', 'technology', 'search', 'https://google.com', 'US', 'Technology', '["search","internet","big tech","multicolor"]', '#4285F4', '#EA4335', '#FFFFFF', '#3C4043', 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_logo.svg', 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_logo.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000001', 5820, 3412),
('10000000-0000-0000-0000-000000000002', 'Apple', 'apple-inc', 'The bitten apple silhouette — minimal, iconic, and unmistakably Apple. A masterclass in brand design simplicity.', 'technology', 'hardware', 'https://apple.com', 'US', 'Technology', '["hardware","consumer electronics","minimal","iconic"]', '#000000', '#555555', '#FFFFFF', '#1D1D1F', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000001', 4120, 2890),
('10000000-0000-0000-0000-000000000003', 'Microsoft', 'microsoft', 'The Microsoft "Window" flag — four colored squares representing the product portfolio. Updated in 2012 for a flatter, modern look.', 'technology', 'software', 'https://microsoft.com', 'US', 'Technology', '["software","windows","office","corporate"]', '#F25022', '#7FBA00', '#FFFFFF', '#737373', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000001', 3890, 2156),
('10000000-0000-0000-0000-000000000004', 'Spotify', 'spotify', 'The green sound wave circles — instantly recognizable music streaming brand. Bold, vibrant, and youthful.', 'technology', 'streaming', 'https://spotify.com', 'SE', 'Music & Audio', '["music","streaming","audio","green"]', '#1DB954', '#191414', '#FFFFFF', '#191414', 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000002', 2340, 1756),
('10000000-0000-0000-0000-000000000005', 'Nike Swoosh', 'nike-swoosh', 'The legendary Nike Swoosh — designed by Carolyn Davidson in 1971 for $35. Represents motion, speed, and athletic excellence.', 'sports', 'apparel', 'https://nike.com', 'US', 'Sportswear', '["sports","athletic","apparel","iconic"]', '#111111', '#EA4335', '#FFFFFF', '#111111', 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000002', 1980, 1234),
('10000000-0000-0000-0000-000000000006', 'Coca-Cola', 'coca-cola', 'The flowing script of Coca-Cola — one of the most valuable brands in the world. Red and white, timeless and classic.', 'food-beverage', 'soft-drinks', 'https://coca-cola.com', 'US', 'Beverages', '["beverage","classic","red","script"]', '#E61D2B', '#FFFFFF', '#E61D2B', '#FFFFFF', 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg', 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000001', 3120, 2340),
('10000000-0000-0000-0000-000000000007', 'Airbnb Bélo', 'airbnb-belo', 'The Bélo — Airbnb''s symbol of belonging. Designed in 2014, it combines a heart, a location pin, and the "A" in Airbnb.', 'technology', 'travel', 'https://airbnb.com', 'US', 'Travel & Hospitality', '["travel","hospitality","coral","belonging"]', '#FF5A5F', '#00A699', '#FFFFFF', '#484848', 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg', 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000002', 1650, 987),
('10000000-0000-0000-0000-000000000008', 'Slack', 'slack', 'The colorful hashtag — Slack''s playful, collaborative brand mark. Four rotating colors representing team communication.', 'technology', 'collaboration', 'https://slack.com', 'US', 'Communication', '["messaging","collaboration","saas","team"]', '#4A154B', '#36C5F0', '#FFFFFF', '#1D1C1D', 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg', 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000001', 1290, 876),
('10000000-0000-0000-0000-000000000009', 'Instagram', 'instagram', 'The vibrant gradient camera — Instagram''s modern, warm brand icon. The gradient symbolizes creativity and self-expression.', 'technology', 'social-media', 'https://instagram.com', 'US', 'Social Media', '["social","photography","gradient","camera"]', '#E4405F', '#FCAF45', '#FFFFFF', '#262626', 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg', 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000002', 5400, 4120),
('10000000-0000-0000-0000-000000000010', 'Twitter X', 'x-twitter', 'The bold new 𝕏 mark — Twitter''s 2023 rebrand to X. Minimalist, stark, and controversial. Black on white, single character.', 'technology', 'social-media', 'https://x.com', 'US', 'Social Media', '["social","microblogging","minimal","controversial"]', '#000000', '#FFFFFF', '#000000', '#FFFFFF', 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg', 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000001', 4830, 3210),
('10000000-0000-0000-0000-000000000011', 'GitHub Octocat', 'github-octocat', 'The GitHub Invertocat mascot — the friendly octocat face. Symbol of open source collaboration and version control.', 'technology', 'developer-tools', 'https://github.com', 'US', 'Developer Tools', '["git","open source","developer","octocat"]', '#181717', '#6E40C9', '#FFFFFF', '#181717', 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg', 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000001', 2150, 1456),
('10000000-0000-0000-0000-000000000012', 'Figma', 'figma', 'The colorful layered shapes — Figma''s creative, collaborative design tool logo. Overlapping colors represent multi-player design.', 'technology', 'design', 'https://figma.com', 'US', 'Design Tools', '["design","prototyping","collaboration","vector"]', '#F24E1E', '#A259FF', '#FFFFFF', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', 'yes', 'published', '00000000-0000-0000-0000-000000000002', 1870, 1254);

-- ============================================================
-- MOCK BLOG POSTS
-- ============================================================
INSERT INTO blog_posts (id, title, slug, excerpt, content, category, tags, author, status, image_url, created_at) VALUES
('b1000000-0000-0000-0000-000000000001', 'Introducing LogoHub API v2', 'introducing-logohub-api-v2', 'Faster queries, richer metadata, and a brand new dashboard for managing visual identities at scale.', 'Full article content about the v2 launch with performance benchmarks, new endpoints, and migration guide.', 'product', '["api","release","v2","performance"]', 'Zana Admin', 'published', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', NOW() - INTERVAL '3 days'),
('b1000000-0000-0000-0000-000000000002', 'How to Build a Logo Search Engine', 'build-logo-search-engine', 'A step-by-step tutorial on building a fast, accurate logo search engine using LogoHub''s vector search API.', 'Detailed tutorial with code examples in JavaScript, Python, and cURL showing how to implement semantic search.', 'tutorial', '["tutorial","search","vector","javascript"]', 'Creator Demo', 'published', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800', NOW() - INTERVAL '5 days'),
('b1000000-0000-0000-0000-000000000003', 'Best Practices for API Key Security', 'api-key-security-best-practices', 'Learn how to protect your LogoHub API keys in production environments — from env vars to secret managers.', 'Security best practices covering environment variables, secret rotation, rate limiting, and monitoring.', 'guide', '["security","api","best practices","production"]', 'Consumer Demo', 'published', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', NOW() - INTERVAL '7 days'),
('b1000000-0000-0000-0000-000000000004', 'The Psychology of Color in Logo Design', 'psychology-of-color-logo-design', 'Why blue means trust, red means energy, and green means growth — the science behind color choices in iconic logos.', 'In-depth analysis of color psychology with examples from Fortune 500 brands and how to leverage color data from LogoHub.', 'article', '["design","color","psychology","branding"]', 'Creator Demo', 'published', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800', NOW() - INTERVAL '10 days');

-- ============================================================
-- MOCK FAQ ENTRIES
-- ============================================================
INSERT INTO faq_entries (id, question, answer, category, status, sort_order, created_at) VALUES
('f1000000-0000-0000-0000-000000000001', 'How do I get an API key?', 'Register for a free account at /register, then navigate to Dashboard → API Keys. Click "New Key" to generate your first API key. Free tier includes 1,000 requests per day.', 'getting-started', 'published', 1, NOW()),
('f1000000-0000-0000-0000-000000000002', 'What image formats does the API support?', 'The LogoHub API returns logos in SVG (vector), PNG (raster), and WebP (modern) formats. You can specify your preferred format via the Accept header or ?format= query parameter.', 'api', 'published', 2, NOW()),
('f1000000-0000-0000-0000-000000000003', 'Can I upload my own logo designs?', 'Yes! Creator accounts can upload, manage, and even monetize their logo designs through the Creator Dashboard. Each upload supports SVG, PNG, and WebP formats with automatic palette extraction.', 'creators', 'published', 3, NOW()),
('f1000000-0000-0000-0000-000000000004', 'Is there a rate limit?', 'Free tier: 1,000 requests/day. Pro tier: 100,000 requests/day. Business tier: 1,000,000 requests/day. Enterprise: custom limits. Rate limit headers are included in every API response.', 'billing', 'published', 4, NOW()),
('f1000000-0000-0000-0000-000000000005', 'Do you offer vector search?', 'Yes — LogoHub supports semantic vector search for finding visually similar logos. Use the /api/v1/search endpoint with a reference image or color palette. Powered by pgvector.', 'api', 'published', 5, NOW()),
('f1000000-0000-0000-0000-000000000006', 'How do I cancel my subscription?', 'Navigate to Dashboard → Billing → Manage Plan and select "Downgrade to Free". Your data and API keys remain active — only the quota changes. No cancellation fees.', 'billing', 'published', 6, NOW()),
('f1000000-0000-0000-0000-000000000007', 'Can I use LogoHub in my commercial app?', 'Absolutely! All plans allow commercial use. If you''re building a SaaS product that resells logo data, please contact us for an Enterprise license with redistribution rights.', 'usage', 'published', 7, NOW()),
('f1000000-0000-0000-0000-000000000008', 'How accurate is the color palette extraction?', 'Our palette extractor uses k-means clustering to identify dominant colors with 95%+ accuracy. You can manually adjust colors in the Content Editor if needed.', 'features', 'published', 8, NOW());

-- ============================================================
-- MOCK SUPPORT TICKETS
-- ============================================================
INSERT INTO support_tickets (id, subject, description, status, priority, user_id, created_at) VALUES
('t1000000-0000-0000-0000-000000000001', 'API returning 429 too quickly', 'Getting rate limited after only 800 requests today when my plan allows 1000. Could this be a bug in the counter?', 'in_progress', 'high', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 hours'),
('t1000000-0000-0000-0000-000000000002', 'Cannot upload SVG with embedded images', 'SVGs containing <image> tags fail validation. Is there a workaround or is this intentional?', 'open', 'medium', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 day'),
('t1000000-0000-0000-0000-000000000003', 'Feature request: batch export', 'Would love to export multiple logos at once as a ZIP. Any plans for batch operations?', 'open', 'low', '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '3 days'),
('t1000000-0000-0000-0000-000000000004', 'Webhook integration not firing', 'Set up a webhook for new content but it never triggered when I uploaded a logo. Checked the URL — it''s valid.', 'resolved', 'high', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '5 days');
