// API Keys routes — CRUD + file management + tag system
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { randomUUID } from 'crypto';
import { authMiddleware } from './auth';

const apiKeys = new Hono();
apiKeys.use('/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'] }));

const ok = (c: any, data: any, extra: any = {}) => c.json({ data, ...extra, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, msg: string, code = 400) => c.json({ error: msg, code }, code as any);

// ============================================================
// Types
// ============================================================
interface KeyFile {
  id: string;
  name: string;
  tag: string;
  content_type: string;
  data_url: string;  // base64 data URL
  size_bytes: number;
  created_at: string;
}

interface ApiKeyItem {
  id: string;
  user_id: string;
  name: string;
  description: string;
  key: string;
  prefix: string;
  permissions: string[];
  environment: 'development' | 'staging' | 'production';
  rate_limit: number;
  expires_at: string;
  status: 'active' | 'inactive' | 'revoked';
  tags: string[];
  files: KeyFile[];
  notes: string;
  requests: number;
  last_used: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// In-memory store
// ============================================================
const keys: ApiKeyItem[] = [];
const keyFiles: Map<string, KeyFile[]> = new Map();

function now() { return new Date().toISOString(); }
function genKey(env: string) {
  const tag = env === 'production' ? 'live' : env === 'staging' ? 'stg' : 'test';
  const rand = () => Array.from({ length: 32 }, () => 'abcdef0123456789'[Math.floor(Math.random() * 16)]).join('');
  return `lh_${tag}_sk_${rand()}`;
}
function maskKey(k: string) { return k.length > 16 ? k.slice(0, 16) + '...' : k; }

// ============================================================
// GET /api/v1/keys — list user's keys
// ============================================================
apiKeys.get('/', authMiddleware, (c) => {
  const userId = c.get('userId');
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
  const userKeys = keys.filter(k => k.user_id === userId);
  const total = userKeys.length;
  const paginated = userKeys.slice((page - 1) * limit, page * limit);
  // Strip full key value for safety
  const safe = paginated.map(k => ({ ...k, key: maskKey(k.key) }));
  return c.json({ data: safe, meta: { total, page, limit, pages: Math.ceil(total / limit) } });
});

// ============================================================
// POST /api/v1/keys — create a new key
// ============================================================
apiKeys.post('/', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return bad(c, 'name is required');

  const env = (body.environment as ApiKeyItem['environment']) || 'development';
  const fullKey = genKey(env);
  const files: KeyFile[] = [];

  // Process files from request body
  if (Array.isArray(body.files)) {
    for (const f of body.files) {
      if (!f.name || !f.tag) continue;
      files.push({
        id: 'f_' + randomUUID().slice(0, 8),
        name: f.name,
        tag: f.tag.toLowerCase().trim(),
        content_type: f.content_type || 'application/octet-stream',
        data_url: f.data_url || '',
        size_bytes: f.size_bytes || 0,
        created_at: now(),
      });
    }
  }

  const item: ApiKeyItem = {
    id: 'k_' + randomUUID().slice(0, 8),
    user_id: userId,
    name: body.name,
    description: body.description || '',
    key: fullKey,
    prefix: maskKey(fullKey),
    permissions: body.permissions || ['read'],
    environment: env,
    rate_limit: Number(body.rate_limit) || 1000,
    expires_at: body.expires_at || '',
    status: 'active',
    tags: body.tags || [],
    files,
    notes: body.notes || '',
    requests: 0,
    last_used: '',
    created_at: now(),
    updated_at: now(),
  };

  keys.unshift(item);
  return c.json({ data: { ...item, key: fullKey }, meta: { version: 'v2', timestamp: now() } }, 201);
});

// ============================================================
// GET /api/v1/keys/:id
// ============================================================
apiKeys.get('/:id', authMiddleware, (c) => {
  const userId = c.get('userId');
  const k = keys.find(k => k.id === c.req.param('id') && k.user_id === userId);
  if (!k) return bad(c, 'Key not found', 404);
  return ok(c, { ...k, key: maskKey(k.key) });
});

// ============================================================
// PATCH /api/v1/keys/:id
// ============================================================
apiKeys.patch('/:id', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const i = keys.findIndex(k => k.id === c.req.param('id') && k.user_id === userId);
  if (i === -1) return bad(c, 'Key not found', 404);

  const body = await c.req.json().catch(() => ({}));
  // Don't allow changing key value or prefix via patch
  const { key, prefix, ...safeBody } = body;
  keys[i] = { ...keys[i], ...safeBody, updated_at: now() };
  return ok(c, { ...keys[i], key: maskKey(keys[i].key) });
});

// ============================================================
// DELETE /api/v1/keys/:id
// ============================================================
apiKeys.delete('/:id', authMiddleware, (c) => {
  const userId = c.get('userId');
  const i = keys.findIndex(k => k.id === c.req.param('id') && k.user_id === userId);
  if (i === -1) return bad(c, 'Key not found', 404);
  keys.splice(i, 1);
  return ok(c, { deleted: true });
});

// ============================================================
// POST /api/v1/keys/:id/revoke
// ============================================================
apiKeys.post('/:id/revoke', authMiddleware, (c) => {
  const userId = c.get('userId');
  const i = keys.findIndex(k => k.id === c.req.param('id') && k.user_id === userId);
  if (i === -1) return bad(c, 'Key not found', 404);
  keys[i].status = 'revoked';
  keys[i].updated_at = now();
  return ok(c, { ...keys[i], key: maskKey(keys[i].key) });
});

// ============================================================
// GET /api/v1/keys/:id/files — list files for a key
// ============================================================
apiKeys.get('/:id/files', authMiddleware, (c) => {
  const userId = c.get('userId');
  const k = keys.find(k => k.id === c.req.param('id') && k.user_id === userId);
  if (!k) return bad(c, 'Key not found', 404);

  const tag = (c.req.query('tag') || '').toLowerCase();
  let files = k.files;
  if (tag) files = files.filter(f => f.tag === tag);

  return ok(c, files, { total: files.length });
});

// ============================================================
// POST /api/v1/keys/:id/files — add a file to a key
// ============================================================
apiKeys.post('/:id/files', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const k = keys.find(k => k.id === c.req.param('id') && k.user_id === userId);
  if (!k) return bad(c, 'Key not found', 404);

  const body = await c.req.json().catch(() => ({}));
  if (!body.name || !body.tag) return bad(c, 'name and tag are required');

  // Check for duplicate tag
  const tagLower = body.tag.toLowerCase().trim();
  if (k.files.some(f => f.tag === tagLower)) {
    return bad(c, `A file with tag "${tagLower}" already exists for this key`, 409);
  }

  const file: KeyFile = {
    id: 'f_' + randomUUID().slice(0, 8),
    name: body.name,
    tag: tagLower,
    content_type: body.content_type || 'application/octet-stream',
    data_url: body.data_url || '',
    size_bytes: body.size_bytes || 0,
    created_at: now(),
  };

  k.files.push(file);
  k.updated_at = now();
  return c.json({ data: file, meta: { version: 'v2', timestamp: now() } }, 201);
});

// ============================================================
// DELETE /api/v1/keys/:keyId/files/:fileId
// ============================================================
apiKeys.delete('/:keyId/files/:fileId', authMiddleware, (c) => {
  const userId = c.get('userId');
  const k = keys.find(k => k.id === c.req.param('keyId') && k.user_id === userId);
  if (!k) return bad(c, 'Key not found', 404);

  const fileId = c.req.param('fileId');
  const fi = k.files.findIndex(f => f.id === fileId);
  if (fi === -1) return bad(c, 'File not found', 404);

  k.files.splice(fi, 1);
  k.updated_at = now();
  return ok(c, { deleted: true });
});

// ============================================================
// POST /api/v1/keys/:keyId/files/:fileId/serve
// Serve a file by key + tag (for CDN-like access)
// ============================================================
apiKeys.get('/:keyId/files/:fileId/serve', (c) => {
  const keyId = c.req.param('keyId');
  const fileId = c.req.param('fileId');
  const k = keys.find(k => k.id === keyId && k.status === 'active');
  if (!k) return bad(c, 'Key not found or inactive', 404);

  const file = k.files.find(f => f.id === fileId);
  if (!file) return bad(c, 'File not found', 404);

  // Return file data
  if (file.data_url) {
    const [header, data] = file.data_url.split(',');
    const buffer = Buffer.from(data, 'base64');
    return new Response(buffer, {
      headers: {
        'Content-Type': file.content_type,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }
  return bad(c, 'File has no data', 404);
});

export default apiKeys;
