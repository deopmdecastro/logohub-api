// Creator routes — spec section 2.x "Perfil: Criador"
// API management for creators: create, edit, version, publish APIs.
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from './auth';
import { catalogApis } from './catalog';

const creator = new Hono<{ Variables: { userId: string; userRole: string } }>();
creator.use('/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));
creator.use('/*', authMiddleware as any);

const ok = (c: any, data: any, extra: any = {}) => c.json({ data, ...extra, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, msg: string, code = 400) => c.json({ error: msg, code }, code as any);

// ============================================================
// Types
// ============================================================
interface CreatorApi {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  status: 'Draft' | 'Beta' | 'Public' | 'Deprecated' | 'Archived';
  pricing_model: string;
  icon_url: string | null;
  tags: string[];
  current_version: string;
  created_at: string;
  updated_at: string;
}

interface ApiVersion {
  id: string;
  api_id: string;
  version: string;
  status: 'Draft' | 'Beta' | 'Public' | 'Deprecated' | 'Archived';
  changelog: string;
  deprecated_at: string | null;
  sunset_at: string | null;
  published_at: string | null;
  created_at: string;
}

interface EndpointDef {
  id: string;
  api_version_id: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  request_schema: any;
  response_schema: any;
  requires_auth: boolean;
  created_at: string;
}

interface CodeExample {
  id: string;
  endpoint_id: string;
  language: string;
  request_code: string;
  response_json: string;
  is_primary: boolean;
}

interface ApiCollaborator {
  api_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  permissions: string[];
  status: 'active' | 'pending';
}

// ============================================================
// In-memory stores
// ============================================================
const creatorApis: CreatorApi[] = [
  {
    id: 'api-001',
    owner_id: '00000000-0000-0000-0000-000000000002',
    name: 'Modern UI Icons',
    slug: 'modern-ui-icons',
    category: 'Ícones',
    description: 'A curated collection of 10,000+ modern UI icons for web and mobile apps.',
    status: 'Public',
    pricing_model: 'freemium',
    icon_url: null,
    tags: ['icons', 'ui', 'svg'],
    current_version: 'v1',
    created_at: '2026-05-01T00:00:00Z',
    updated_at: '2026-06-15T00:00:00Z',
  },
];
const apiVersions: ApiVersion[] = [];
const endpoints: EndpointDef[] = [];
const codeExamples: CodeExample[] = [];
const collaborators: ApiCollaborator[] = [];

// ============================================================
// GET /api/v1/creator/apis — list my APIs
// ============================================================
creator.get('/apis', (c) => {
  const userId = c.get('userId');
  const status = c.req.query('status');
  const search = c.req.query('q') || '';

  let results = creatorApis.filter(a => a.owner_id === userId);
  // Also include APIs where the user is a collaborator
  const collabApiIds = collaborators
    .filter(col => col.user_id === userId && col.status === 'active')
    .map(col => col.api_id);
  results = [...results, ...creatorApis.filter(a => collabApiIds.includes(a.id))];
  // Deduplicate
  results = [...new Map(results.map(r => [r.id, r])).values()];

  if (status) results = results.filter(a => a.status === status);
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
  }

  return ok(c, results);
});

// ============================================================
// POST /api/v1/creator/apis — create new API (always Draft)
// ============================================================
creator.post('/apis', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json().catch(() => ({}));

  if (!body.name) return bad(c, 'name is required');
  if (!body.category) return bad(c, 'category is required');

  const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const existing = creatorApis.find(a => a.slug === slug && a.owner_id === userId);
  if (existing) return bad(c, `An API with slug "${slug}" already exists`, 409);

  const api: CreatorApi = {
    id: 'api-' + uuidv4().slice(0, 12),
    owner_id: userId,
    name: body.name,
    slug,
    category: body.category,
    description: body.description || '',
    status: 'Draft',
    pricing_model: body.pricing_model || 'free',
    icon_url: body.icon_url || null,
    tags: body.tags || [],
    current_version: 'v1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  creatorApis.push(api);

  // Create initial v1 Draft version
  const initialVersion: ApiVersion = {
    id: 'ver-' + uuidv4().slice(0, 8),
    api_id: api.id,
    version: 'v1',
    status: 'Draft',
    changelog: 'Initial version',
    deprecated_at: null,
    sunset_at: null,
    published_at: null,
    created_at: new Date().toISOString(),
  };
  apiVersions.push(initialVersion);

  return c.json({ data: { ...api, initial_version: initialVersion }, meta: { version: 'v2' } }, 201);
});

// ============================================================
// GET /api/v1/creator/apis/:id — single API detail
// ============================================================
creator.get('/apis/:id', (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found', 404);

  const versions = apiVersions.filter(v => v.api_id === api.id);
  const collabs = collaborators.filter(col => col.api_id === api.id);
  const endpointCount = endpoints.filter(e => versions.some(v => v.id === e.api_version_id)).length;

  return ok(c, {
    ...api,
    versions,
    collaborators: collabs,
    endpoint_count: endpointCount,
  });
});

// ============================================================
// PATCH /api/v1/creator/apis/:id — update API metadata
// ============================================================
creator.patch('/apis/:id', async (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found', 404);

  const body = await c.req.json().catch(() => ({}));
  const allowed = ['name', 'description', 'category', 'icon_url', 'tags', 'pricing_model'];
  const patch: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) patch[key] = body[key];
  }
  Object.assign(api, patch, { updated_at: new Date().toISOString() });

  // Sync catalog entry if Public
  if (api.status === 'Public') {
    const catEntry = catalogApis.find(ca => ca.slug === api.slug);
    if (catEntry) {
      catEntry.name = api.name;
      catEntry.description = api.description;
      catEntry.category = api.category;
      catEntry.updated_at = new Date().toISOString();
    }
  }

  return ok(c, api);
});

// ============================================================
// POST /api/v1/creator/apis/:id/archive
// ============================================================
creator.post('/apis/:id/archive', (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found', 404);

  api.status = 'Archived';
  api.updated_at = new Date().toISOString();

  // Remove from catalog
  const catIdx = catalogApis.findIndex(ca => ca.slug === api.slug);
  if (catIdx !== -1) catalogApis.splice(catIdx, 1);

  return ok(c, api);
});

// ============================================================
// GET /api/v1/creator/apis/:id/versions — list versions
// ============================================================
creator.get('/apis/:id/versions', (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found', 404);

  const versions = apiVersions.filter(v => v.api_id === api.id);
  return ok(c, versions);
});

// ============================================================
// POST /api/v1/creator/apis/:id/versions — create new version
// ============================================================
creator.post('/apis/:id/versions', async (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found', 404);

  const body = await c.req.json().catch(() => ({}));
  const existingVersions = apiVersions.filter(v => v.api_id === api.id);
  const nextNum = existingVersions.length + 1;
  const versionStr = body.version || `v${nextNum}`;

  const version: ApiVersion = {
    id: 'ver-' + uuidv4().slice(0, 8),
    api_id: api.id,
    version: versionStr,
    status: 'Draft',
    changelog: body.changelog || `Version ${versionStr}`,
    deprecated_at: null,
    sunset_at: null,
    published_at: null,
    created_at: new Date().toISOString(),
  };
  apiVersions.push(version);
  api.current_version = versionStr;
  api.updated_at = new Date().toISOString();

  return c.json({ data: version }, 201);
});

// ============================================================
// PATCH /api/v1/creator/apis/:id/versions/:vid/status — promote/deprecate
// ============================================================
creator.patch('/apis/:id/versions/:vid/status', async (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found', 404);

  const version = apiVersions.find(v => v.id === c.req.param('vid') && v.api_id === api.id);
  if (!version) return bad(c, 'Version not found', 404);

  const body = await c.req.json().catch(() => ({}));
  const newStatus = body.status;
  const allowedTransitions: Record<string, string[]> = {
    'Draft': ['Beta'],
    'Beta': ['Public', 'Draft'],
    'Public': ['Deprecated'],
    'Deprecated': ['Archived', 'Public'],
    'Archived': [],
  };

  if (!allowedTransitions[version.status]?.includes(newStatus)) {
    return bad(c, `Cannot transition from "${version.status}" to "${newStatus}". Allowed: ${allowedTransitions[version.status]?.join(', ') || 'none'}`, 422);
  }

  version.status = newStatus;
  if (newStatus === 'Public') version.published_at = new Date().toISOString();
  if (newStatus === 'Deprecated') {
    version.deprecated_at = new Date().toISOString();
    version.sunset_at = body.sunset_at || null;
  }

  // Update parent API status
  if (newStatus === 'Public') api.status = 'Public';
  if (newStatus === 'Deprecated') api.status = 'Deprecated';

  api.updated_at = new Date().toISOString();

  // Sync to catalog when published
  if (newStatus === 'Public') {
    const existing = catalogApis.findIndex(ca => ca.slug === api.slug);
    const catEntry = {
      id: api.id,
      name: api.name,
      slug: api.slug,
      category: api.category,
      description: api.description,
      owner_name: 'Creator',
      owner_id: api.owner_id,
      status: 'Public' as const,
      pricing_model: api.pricing_model,
      rating_avg: 0,
      rating_count: 0,
      icon_url: api.icon_url,
      created_at: api.created_at,
      updated_at: new Date().toISOString(),
    };
    if (existing !== -1) {
      catalogApis[existing] = catEntry;
    } else {
      catalogApis.push(catEntry);
    }
  }

  return ok(c, version);
});

// ============================================================
// GET /api/v1/creator/apis/:id/endpoints — list endpoints for a version
// ============================================================
creator.get('/apis/:id/endpoints', (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found', 404);

  const versionId = c.req.query('version');
  const versionIds = new Set(
    apiVersions.filter(v => v.api_id === api.id && (!versionId || v.id === versionId)).map(v => v.id)
  );
  const eps = endpoints.filter(e => versionIds.has(e.api_version_id));
  return ok(c, eps);
});

// ============================================================
// POST /api/v1/creator/apis/:id/endpoints — add endpoint to version
// ============================================================
creator.post('/apis/:id/endpoints', async (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found', 404);

  const body = await c.req.json().catch(() => ({}));
  if (!body.method || !body.path) return bad(c, 'method and path are required');
  if (!body.version_id) return bad(c, 'version_id is required');

  const version = apiVersions.find(v => v.id === body.version_id && v.api_id === api.id);
  if (!version) return bad(c, 'Version not found', 404);
  if (version.status === 'Public') return bad(c, 'Cannot modify endpoints of a Public version; create a new version instead', 422);

  const ep: EndpointDef = {
    id: 'ep-' + uuidv4().slice(0, 8),
    api_version_id: body.version_id,
    method: body.method.toUpperCase(),
    path: body.path,
    summary: body.summary || '',
    description: body.description || '',
    request_schema: body.request_schema || {},
    response_schema: body.response_schema || {},
    requires_auth: body.requires_auth !== undefined ? body.requires_auth : true,
    created_at: new Date().toISOString(),
  };
  endpoints.push(ep);
  return c.json({ data: ep }, 201);
});

// ============================================================
// GET /api/v1/creator/dashboard/summary — creator dashboard
// ============================================================
creator.get('/dashboard/summary', (c) => {
  const userId = c.get('userId');
  const myApis = creatorApis.filter(a => a.owner_id === userId);
  const collabApiIds = collaborators
    .filter(col => col.user_id === userId && col.status === 'active')
    .map(col => col.api_id);
  const allApis = [
    ...myApis,
    ...creatorApis.filter(a => collabApiIds.includes(a.id)),
  ];
  const deduped = [...new Map(allApis.map(a => [a.id, a])).values()];

  const totalRequests = 0; // Placeholder — would query UsageMetric
  const publishedCount = deduped.filter(a => a.status === 'Public').length;
  const totalRating = deduped.reduce((sum, a) => {
    const cat = catalogApis.find(ca => ca.id === a.id);
    return sum + (cat?.rating_avg || 0);
  }, 0);
  const avgRating = deduped.length > 0 ? (totalRating / deduped.length) : 0;

  return ok(c, {
    total_apis: deduped.length,
    published_apis: publishedCount,
    draft_apis: deduped.filter(a => a.status === 'Draft').length,
    total_requests_30d: totalRequests,
    avg_rating: Math.round(avgRating * 10) / 10,
    revenue_month: 0,
    apis: deduped.map(a => ({
      id: a.id,
      name: a.name,
      slug: a.slug,
      status: a.status,
      category: a.category,
      updated_at: a.updated_at,
    })),
  });
});

// ============================================================
// GET /api/v1/creator/apis/:id/collaborators
// ============================================================
creator.get('/apis/:id/collaborators', (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found', 404);

  const collabs = collaborators.filter(col => col.api_id === api.id);
  return ok(c, collabs);
});

// ============================================================
// POST /api/v1/creator/apis/:id/collaborators/invite
// ============================================================
creator.post('/apis/:id/collaborators/invite', async (c) => {
  const userId = c.get('userId');
  const api = creatorApis.find(a => a.id === c.req.param('id'));
  if (!api || api.owner_id !== userId) return bad(c, 'API not found or not authorized', 404);

  const body = await c.req.json().catch(() => ({}));
  if (!body.email) return bad(c, 'email is required');

  const collab: ApiCollaborator = {
    api_id: api.id,
    user_id: 'pending-' + uuidv4().slice(0, 8),
    user_name: body.email.split('@')[0],
    user_email: body.email,
    permissions: body.permissions || ['view_analytics'],
    status: 'pending',
  };
  collaborators.push(collab);
  return c.json({ data: collab }, 201);
});

export { creatorApis, apiVersions };
export default creator;
