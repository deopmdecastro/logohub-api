// Catalog routes — spec sections 1.2 "Catálogo de APIs" and 1.3 "Explorar APIs"
// Public catalog of available platform APIs with search, filter, sort.
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const catalog = new Hono();
catalog.use('/*', cors({ origin: '*', allowMethods: ['GET', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));

const ok = (c: any, data: any, extra: any = {}) => c.json({ data, ...extra, meta: { version: 'v2', timestamp: new Date().toISOString() } });

// ============================================================
// Types
// ============================================================
interface CatalogApi {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  owner_name: string;
  owner_id: string;
  status: 'Public' | 'Beta' | 'Deprecated';
  pricing_model: string;
  rating_avg: number;
  rating_count: number;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Catalog data (in-memory — mirrors what creators publish)
// ============================================================
const catalogApis: CatalogApi[] = [
  {
    id: 'cat-001',
    name: 'Logos API',
    slug: 'logos',
    category: 'Logotipos',
    description: 'Access 100,000+ company and brand logos in SVG, PNG, and WebP formats. Search by name, industry, country, or color.',
    owner_name: 'LogoHub',
    owner_id: '00000000-0000-0000-0000-000000000001',
    status: 'Public',
    pricing_model: 'free',
    rating_avg: 4.8,
    rating_count: 342,
    icon_url: '/static/favicon.svg',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'cat-002',
    name: 'Flags API',
    slug: 'flags',
    category: 'Bandeiras',
    description: 'National flags of all 195 countries plus dependencies. Includes historical flags and construction sheets.',
    owner_name: 'LogoHub',
    owner_id: '00000000-0000-0000-0000-000000000001',
    status: 'Public',
    pricing_model: 'free',
    rating_avg: 4.6,
    rating_count: 187,
    icon_url: null,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-05-15T00:00:00Z',
  },
  {
    id: 'cat-003',
    name: 'Sports API',
    slug: 'sports',
    category: 'Desporto',
    description: 'Team logos, league badges, and player silhouettes for football, basketball, Formula 1, and more.',
    owner_name: 'LogoHub',
    owner_id: '00000000-0000-0000-0000-000000000001',
    status: 'Beta',
    pricing_model: 'free',
    rating_avg: 4.3,
    rating_count: 91,
    icon_url: null,
    created_at: '2026-03-10T00:00:00Z',
    updated_at: '2026-06-20T00:00:00Z',
  },
  {
    id: 'cat-004',
    name: 'Frameworks & Languages',
    slug: 'frameworks',
    category: 'Desenvolvimento',
    description: 'Official logos and icons for programming languages, frameworks, libraries, and developer tools.',
    owner_name: 'LogoHub',
    owner_id: '00000000-0000-0000-0000-000000000001',
    status: 'Public',
    pricing_model: 'free',
    rating_avg: 4.7,
    rating_count: 256,
    icon_url: null,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-06-10T00:00:00Z',
  },
  {
    id: 'cat-005',
    name: 'Cloud & Crypto',
    slug: 'cloud',
    category: 'Tecnologia',
    description: 'Cloud provider logos and cryptocurrency/blockchain project icons.',
    owner_name: 'LogoHub',
    owner_id: '00000000-0000-0000-0000-000000000001',
    status: 'Beta',
    pricing_model: 'free',
    rating_avg: 4.2,
    rating_count: 73,
    icon_url: null,
    created_at: '2026-04-01T00:00:00Z',
    updated_at: '2026-06-25T00:00:00Z',
  },
];

// Favorites (in-memory)
const favorites: Map<string, Set<string>> = new Map(); // userId -> Set<apiId>

// ============================================================
// GET /api/v1/catalog — list APIs with filters
// ============================================================
catalog.get('/', (c) => {
  const category = c.req.query('category');
  const sort = c.req.query('sort') || 'popularity';
  const search = c.req.query('q') || '';
  const status = c.req.query('status');
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);

  let results = [...catalogApis];

  // Only show Public + Beta APIs in catalog
  results = results.filter(a => a.status === 'Public' || a.status === 'Beta');

  if (category) results = results.filter(a => a.category === category);
  if (status) results = results.filter(a => a.status === status);
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (sort) {
    case 'newest':
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'alphabetical':
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'popularity':
    default:
      results.sort((a, b) => b.rating_count - a.rating_count);
      break;
  }

  // Paginate
  const total = results.length;
  const paginated = results.slice((page - 1) * limit, page * limit);

  return ok(c, paginated, {
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
    filters: { category: category || null, sort, search, status: status || null },
  });
});

// ============================================================
// GET /api/v1/catalog/categories — list distinct categories
// ============================================================
catalog.get('/categories', (c) => {
  const cats = [...new Set(catalogApis.map(a => a.category))].sort();
  return ok(c, cats.map(cat => ({
    name: cat,
    count: catalogApis.filter(a => a.category === cat).length,
  })));
});

// ============================================================
// GET /api/v1/catalog/:slug — single API detail
// ============================================================
catalog.get('/:slug', (c) => {
  const api = catalogApis.find(a => a.slug === c.req.param('slug'));
  if (!api) return c.json({ error: 'API not found', code: 404 }, 404);
  return ok(c, api);
});

// ============================================================
// POST /api/v1/catalog/:slug/favorite — toggle favorite
// ============================================================
catalog.post('/:slug/favorite', async (c) => {
  // Parse user from auth if available; otherwise use anonymous
  const userId = c.get('userId') || 'anonymous';
  const slug = c.req.param('slug');
  const api = catalogApis.find(a => a.slug === slug);
  if (!api) return c.json({ error: 'API not found', code: 404 }, 404);

  if (!favorites.has(userId)) favorites.set(userId, new Set());
  const userFavs = favorites.get(userId)!;

  if (userFavs.has(api.id)) {
    userFavs.delete(api.id);
    return ok(c, { favorited: false, api_id: api.id });
  } else {
    userFavs.add(api.id);
    return ok(c, { favorited: true, api_id: api.id });
  }
});

// ============================================================
// GET /api/v1/catalog/:slug/favorites — list user's favorites
// ============================================================
catalog.get('/user/favorites', (c) => {
  const userId = c.get('userId') || 'anonymous';
  const userFavs = favorites.get(userId);
  if (!userFavs || userFavs.size === 0) return ok(c, []);
  const favApis = catalogApis.filter(a => userFavs.has(a.id));
  return ok(c, favApis);
});

export { catalogApis, type CatalogApi };
export default catalog;
