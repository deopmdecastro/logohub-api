import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { catalogApis } from './catalog';

const apiReference = new Hono();
apiReference.use('/*', cors({ origin: '*', allowMethods: ['GET', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));

const ok = (c: any, data: any, extra: any = {}) => c.json({ data, ...extra, meta: { version: 'api-docs-v1', timestamp: new Date().toISOString() } });

const CORE_DOCS: Record<string, any> = {
  logos: {
    overview: 'Search, list, and fetch high-quality company and brand logos with consistent metadata and formats.',
    versions: [
      { version: 'v1', status: 'Public', published_at: '2026-01-15T00:00:00Z', deprecated_at: null, sunset_at: null },
      { version: 'v0', status: 'Deprecated', published_at: '2025-06-01T00:00:00Z', deprecated_at: '2026-03-10T00:00:00Z', sunset_at: '2026-12-31T00:00:00Z' },
    ],
    sdks: ['JavaScript', 'Python', 'cURL'],
    auth: { type: 'X-API-Key', required_for_try_it: true },
    examples: { curl: `curl -H "X-API-Key: lh_live_xxx" https://api.logohub.dev/api/v1/logo/google`, javascript: `const res = await fetch('/api/v1/logo/google', {\n  headers: { 'X-API-Key': 'lh_live_xxx' }\n});`, python: `import requests\nrequests.get('https://api.logohub.dev/api/v1/logo/google', headers={'X-API-Key': 'lh_live_xxx'})` },
    endpoint_groups: [
      {
        title: 'Lookup',
        endpoints: [
          {
            method: 'GET',
            path: '/api/v1/logo/:slug',
            summary: 'Fetch a logo by slug',
            description: 'Returns the canonical metadata and asset URLs for a single brand logo.',
            params: [
              { name: 'slug', in: 'path', type: 'string', required: true, description: 'Brand slug such as google or stripe.' },
            ],
            request_example: `curl -H "X-API-Key: lh_live_xxx" https://api.logohub.dev/api/v1/logo/google`,
            response_example: { slug: 'google', name: 'Google', category: 'technology', formats: ['svg', 'png', 'webp'], colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853'] },
          },
          {
            method: 'GET',
            path: '/api/v1/logos',
            summary: 'Paginate brand logos',
            description: 'List brand logos with optional category filtering and pagination.',
            params: [
              { name: 'page', in: 'query', type: 'number', required: false, description: 'Page number.' },
              { name: 'limit', in: 'query', type: 'number', required: false, description: 'Items per page (max 100).' },
              { name: 'category', in: 'query', type: 'string', required: false, description: 'Category slug.' },
            ],
            request_example: `curl -H "X-API-Key: lh_live_xxx" "https://api.logohub.dev/api/v1/logos?page=1&limit=24&category=technology"`,
            response_example: { data: [{ slug: 'google', name: 'Google' }], meta: { total: 2450, page: 1, limit: 24, pages: 103 } },
          },
        ],
      },
      {
        title: 'Discovery',
        endpoints: [
          {
            method: 'GET',
            path: '/api/v1/search',
            summary: 'Full-text asset search',
            description: 'Search logos and related assets across the full public catalog.',
            params: [
              { name: 'q', in: 'query', type: 'string', required: true, description: 'Search term.' },
              { name: 'limit', in: 'query', type: 'number', required: false, description: 'Maximum results.' },
            ],
            request_example: `curl -H "X-API-Key: lh_live_xxx" "https://api.logohub.dev/api/v1/search?q=spotify&limit=12"`,
            response_example: { data: [{ slug: 'spotify', name: 'Spotify', score: 0.98 }], meta: { version: 'v1' } },
          },
          {
            method: 'GET',
            path: '/api/v1/categories',
            summary: 'List supported categories',
            description: 'Returns every category available in the public logo dataset.',
            params: [],
            request_example: `curl https://api.logohub.dev/api/v1/categories`,
            response_example: { data: ['technology', 'fintech', 'streaming'] },
          },
        ],
      },
    ],
  },
  flags: {
    overview: 'Access country and territory flags with ISO metadata, asset URLs, and optimized previews.',
    versions: [{ version: 'v1', status: 'Public', published_at: '2026-02-01T00:00:00Z', deprecated_at: null, sunset_at: null }],
    sdks: ['JavaScript', 'Python', 'cURL'],
    auth: { type: 'X-API-Key', required_for_try_it: true },
    examples: { curl: `curl -H "X-API-Key: lh_live_xxx" https://api.logohub.dev/api/v1/flags/portugal` },
    endpoint_groups: [
      {
        title: 'Flags',
        endpoints: [
          {
            method: 'GET',
            path: '/api/v1/flags',
            summary: 'List all flags',
            description: 'Returns country flags and associated metadata.',
            params: [],
            request_example: `curl https://api.logohub.dev/api/v1/flags`,
            response_example: { data: [{ slug: 'portugal', iso2: 'PT', name: 'Portugal' }] },
          },
          {
            method: 'GET',
            path: '/api/v1/flags/:slug',
            summary: 'Get flag by slug',
            description: 'Fetch a single country flag with format URLs.',
            params: [{ name: 'slug', in: 'path', type: 'string', required: true, description: 'Country slug or ISO alias.' }],
            request_example: `curl https://api.logohub.dev/api/v1/flags/brazil`,
            response_example: { slug: 'brazil', iso2: 'BR', colors: ['#009B3A', '#FEDF00', '#002776'] },
          },
        ],
      },
    ],
  },
  sports: {
    overview: 'Browse football, basketball, and Formula 1 visual identities with sport-specific endpoints.',
    versions: [{ version: 'v1', status: 'Beta', published_at: '2026-03-10T00:00:00Z', deprecated_at: null, sunset_at: null }],
    sdks: ['JavaScript', 'cURL'],
    auth: { type: 'X-API-Key', required_for_try_it: true },
    examples: { curl: `curl -H "X-API-Key: lh_live_xxx" https://api.logohub.dev/api/v1/football/real-madrid` },
    endpoint_groups: [
      {
        title: 'Football',
        endpoints: [
          {
            method: 'GET',
            path: '/api/v1/football',
            summary: 'List football teams',
            description: 'Returns football teams and club badges.',
            params: [],
            request_example: `curl https://api.logohub.dev/api/v1/football`,
            response_example: { data: [{ slug: 'real-madrid', name: 'Real Madrid' }] },
          },
          {
            method: 'GET',
            path: '/api/v1/football/:slug',
            summary: 'Get football team by slug',
            description: 'Fetch a single football team badge.',
            params: [{ name: 'slug', in: 'path', type: 'string', required: true, description: 'Team slug.' }],
            request_example: `curl https://api.logohub.dev/api/v1/football/real-madrid`,
            response_example: { slug: 'real-madrid', sport: 'football', colors: ['#00529F', '#FEBE10'] },
          },
        ],
      },
      {
        title: 'Other sports',
        endpoints: [
          { method: 'GET', path: '/api/v1/basketball', summary: 'List basketball teams', description: 'NBA and other team marks.', params: [], request_example: `curl https://api.logohub.dev/api/v1/basketball`, response_example: { data: [{ slug: 'lakers', name: 'Los Angeles Lakers' }] } },
          { method: 'GET', path: '/api/v1/formula1', summary: 'List Formula 1 teams', description: 'F1 constructors and motorsport marks.', params: [], request_example: `curl https://api.logohub.dev/api/v1/formula1`, response_example: { data: [{ slug: 'ferrari', name: 'Ferrari' }] } },
        ],
      },
    ],
  },
  frameworks: {
    overview: 'Programming language and framework logos for docs portals, devtools, and technical catalogs.',
    versions: [{ version: 'v1', status: 'Public', published_at: '2026-01-20T00:00:00Z', deprecated_at: null, sunset_at: null }],
    sdks: ['JavaScript', 'Python', 'cURL'],
    auth: { type: 'X-API-Key', required_for_try_it: true },
    examples: { curl: `curl -H "X-API-Key: lh_live_xxx" https://api.logohub.dev/api/v1/framework/react` },
    endpoint_groups: [
      {
        title: 'Developer assets',
        endpoints: [
          { method: 'GET', path: '/api/v1/frameworks', summary: 'List frameworks', description: 'Framework and library icons.', params: [], request_example: `curl https://api.logohub.dev/api/v1/frameworks`, response_example: { data: [{ slug: 'react', name: 'React' }] } },
          { method: 'GET', path: '/api/v1/languages', summary: 'List languages', description: 'Programming language logos.', params: [], request_example: `curl https://api.logohub.dev/api/v1/languages`, response_example: { data: [{ slug: 'typescript', name: 'TypeScript' }] } },
        ],
      },
    ],
  },
  cloud: {
    overview: 'Cloud provider and blockchain brand assets for infrastructure dashboards and fintech products.',
    versions: [{ version: 'v1', status: 'Beta', published_at: '2026-04-01T00:00:00Z', deprecated_at: null, sunset_at: null }],
    sdks: ['JavaScript', 'cURL'],
    auth: { type: 'X-API-Key', required_for_try_it: true },
    examples: { curl: `curl -H "X-API-Key: lh_live_xxx" https://api.logohub.dev/api/v1/cloud/aws` },
    endpoint_groups: [
      {
        title: 'Cloud & crypto',
        endpoints: [
          { method: 'GET', path: '/api/v1/cloud', summary: 'List cloud logos', description: 'Cloud and infrastructure brands.', params: [], request_example: `curl https://api.logohub.dev/api/v1/cloud`, response_example: { data: [{ slug: 'aws', name: 'AWS' }] } },
          { method: 'GET', path: '/api/v1/crypto', summary: 'List crypto assets', description: 'Cryptocurrency and blockchain project marks.', params: [], request_example: `curl https://api.logohub.dev/api/v1/crypto`, response_example: { data: [{ slug: 'bitcoin', name: 'Bitcoin' }] } },
        ],
      },
    ],
  },
};

function getDoc(slug: string) {
  const catalog = catalogApis.find((item) => item.slug === slug);
  if (!catalog) return null;
  const core = CORE_DOCS[slug] || {
    overview: catalog.description,
    versions: [{ version: 'v1', status: catalog.status, published_at: catalog.created_at, deprecated_at: null, sunset_at: null }],
    sdks: ['JavaScript', 'cURL'],
    auth: { type: 'X-API-Key', required_for_try_it: true },
    examples: { curl: `curl -H "X-API-Key: lh_live_xxx" https://api.logohub.dev/api/v1/${slug}` },
    endpoint_groups: [
      {
        title: 'Overview',
        endpoints: [
          {
            method: 'GET',
            path: `/api/v1/${slug}`,
            summary: `Explore ${catalog.name}`,
            description: catalog.description,
            params: [],
            request_example: `curl -H "X-API-Key: lh_live_xxx" https://api.logohub.dev/api/v1/${slug}`,
            response_example: { data: [], meta: { version: 'v1' } },
          },
        ],
      },
    ],
  };

  return {
    api: catalog,
    overview: core.overview,
    versions: core.versions,
    sdks: core.sdks,
    auth: core.auth,
    examples: core.examples,
    endpoint_groups: core.endpoint_groups,
    changelog: core.versions.map((version: any) => ({
      version: version.version,
      title: `${catalog.name} ${version.version}`,
      description: version.status === 'Deprecated'
        ? 'Deprecated release kept for backwards compatibility.'
        : 'Current recommended release for new integrations.',
      published_at: version.published_at,
      status: version.status,
    })),
  };
}

apiReference.get('/', (c) => {
  const docs = catalogApis
    .filter((item) => item.status === 'Public' || item.status === 'Beta')
    .map((item) => ({
      slug: item.slug,
      name: item.name,
      category: item.category,
      description: item.description,
      status: item.status,
      rating_avg: item.rating_avg,
      rating_count: item.rating_count,
      pricing_model: item.pricing_model,
    }));
  return ok(c, docs);
});

apiReference.get('/:slug', (c) => {
  const doc = getDoc(c.req.param('slug'));
  if (!doc) return c.json({ error: 'API not found', code: 404 }, 404);
  return ok(c, {
    api: doc.api,
    overview: doc.overview,
    auth: doc.auth,
    sdks: doc.sdks,
    changelog: doc.changelog,
  });
});

apiReference.get('/:slug/versions', (c) => {
  const doc = getDoc(c.req.param('slug'));
  if (!doc) return c.json({ error: 'API not found', code: 404 }, 404);
  return ok(c, doc.versions);
});

apiReference.get('/:slug/docs', (c) => {
  const slug = c.req.param('slug');
  const doc = getDoc(slug);
  if (!doc) return c.json({ error: 'API not found', code: 404 }, 404);
  const requestedVersion = c.req.query('version');
  const activeVersion = doc.versions.find((version: any) => version.version === requestedVersion) || doc.versions[0];
  return ok(c, {
    api: doc.api,
    overview: doc.overview,
    auth: doc.auth,
    sdks: doc.sdks,
    changelog: doc.changelog,
    active_version: activeVersion,
    endpoint_groups: doc.endpoint_groups,
    examples: doc.examples,
  });
});

export default apiReference;
