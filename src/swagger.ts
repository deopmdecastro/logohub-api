// OpenAPI / Swagger Specification for LogoHub API
// Accessible at /api/docs (Swagger UI) and /api/openapi.json (raw spec)

import type { OpenAPIObject } from '@hono/zod-openapi';

export const openApiSpec: OpenAPIObject = {
  openapi: '3.1.0',
  info: {
    title: 'LogoHub API',
    version: 'v2',
    description: `The World's Largest Visual Identity API — access 50,000+ logos, icons, flags, sports emblems, and more.

## Authentication
- **Free tier**: No authentication required (rate-limited)
- **API Key**: Pass via \`X-API-Key\` header or \`?api_key=\` query parameter
- **Bearer**: Pass via \`Authorization: Bearer <token>\` for admin endpoints

## Rate Limits
| Plan     | Requests/day |
|----------|-------------|
| Free     | 1,000       |
| Pro      | 100,000     |
| Business | 1,000,000   |
| Enterprise | Unlimited |

## Response Format
All endpoints return \`{ data, meta }\` with metadata including version and timestamp.`,
    contact: {
      name: 'LogoHub Support',
      email: 'support@logohub.dev',
      url: 'https://logohub.dev',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    { url: 'https://api.logohub.dev', description: 'Production' },
    { url: 'http://localhost:3000', description: 'Local Development' },
  ],
  tags: [
    { name: 'Logos', description: 'Brand and company logos' },
    { name: 'Search', description: 'Full-text search across all assets' },
    { name: 'Categories', description: 'Logo categories and filtering' },
    { name: 'Sports', description: 'Sports teams (football, basketball, F1)' },
    { name: 'Flags', description: 'Country flags' },
    { name: 'Crypto', description: 'Cryptocurrency logos' },
    { name: 'Frameworks', description: 'Frontend/backend frameworks' },
    { name: 'Languages', description: 'Programming languages' },
    { name: 'Cloud', description: 'Cloud provider logos' },
    { name: 'System', description: 'Health, stats, and utility endpoints' },
    { name: 'Users', description: 'User authentication and management' },
    { name: 'Admin', description: 'Admin dashboard and management' },
    { name: 'Playground', description: 'Online code editor / sandbox' },
  ],
  paths: {
    // ============================================================
    // AUTH / USERS
    // ============================================================
    '/api/v1/auth/register': {
      post: {
        tags: ['Users'],
        summary: 'Register a new user',
        description: 'Create a new user account (Consumer or Creator role).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', format: 'password', minLength: 8, example: 'S3cur3P@ss!' },
                  role: { type: 'string', enum: ['consumer', 'creator'], default: 'consumer' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User created successfully. Returns JWT token.' },
          '400': { description: 'Validation error (email already in use, weak password, etc.)' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Users'],
        summary: 'User login',
        description: 'Authenticate and receive a JWT access token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', format: 'password', example: 'S3cur3P@ss!' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful. Returns JWT token and user profile.' },
          '401': { description: 'Invalid credentials.' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Current user profile.' },
          '401': { description: 'Not authenticated.' },
        },
      },
    },
    '/api/v1/auth/me': {
      patch: {
        tags: ['Users'],
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  avatar_url: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Profile updated.' } },
      },
    } as any,
    '/api/v1/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List all users (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of all users.' } },
      },
    },
    '/api/v1/admin/users/:id': {
      patch: {
        tags: ['Admin'],
        summary: 'Update user (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User updated.' } },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Delete user (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User deleted.' } },
      },
    },
    '/api/v1/admin/plans': {
      get: {
        tags: ['Admin'],
        summary: 'List plans (Admin)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of plans with limits.' } },
      },
    },
    '/api/v1/admin/plans/:id': {
      patch: {
        tags: ['Admin'],
        summary: 'Update plan limits (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Plan updated.' } },
      },
    },
    // ============================================================
    // API KEYS (with tags)
    // ============================================================
    '/api/v1/keys': {
      get: {
        tags: ['Admin'],
        summary: 'List user API keys',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'Paginated list of API keys.' } },
      },
      post: {
        tags: ['Admin'],
        summary: 'Create a new API key',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'My App Key' },
                  description: { type: 'string' },
                  environment: { type: 'string', enum: ['development', 'staging', 'production'], default: 'development' },
                  permissions: { type: 'array', items: { type: 'string', enum: ['read', 'write', 'upload'] } },
                  rate_limit: { type: 'integer', default: 1000 },
                  expires_at: { type: 'string', format: 'date-time' },
                  tags: { type: 'array', items: { type: 'string' } },
                  files: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'ficheiro-home' },
                        tag: { type: 'string', example: 'home' },
                        content_type: { type: 'string', example: 'image/svg+xml' },
                      },
                    },
                    description: 'Files associated with this API key, each identified by a tag',
                  },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'API key created.' } },
      },
    },
    '/api/v1/keys/:id': {
      get: {
        tags: ['Admin'],
        summary: 'Get API key details',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'API key details.' } },
      },
      patch: {
        tags: ['Admin'],
        summary: 'Update API key',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'API key updated.' } },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Delete API key',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'API key deleted.' } },
      },
    },
    '/api/v1/keys/:id/revoke': {
      post: {
        tags: ['Admin'],
        summary: 'Revoke API key',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'API key revoked.' } },
      },
    },
    '/api/v1/keys/:id/files': {
      get: {
        tags: ['Admin'],
        summary: 'List files associated with an API key',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'tag', in: 'query', schema: { type: 'string' }, description: 'Filter by file tag' }],
        responses: { '200': { description: 'List of files.' } },
      },
      post: {
        tags: ['Admin'],
        summary: 'Add a file to an API key',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'File added to API key.' } },
      },
    },
    '/api/v1/keys/:keyId/files/:fileId': {
      delete: {
        tags: ['Admin'],
        summary: 'Remove a file from an API key',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'File removed.' } },
      },
    },
    // ============================================================
    // PLAYGROUND
    // ============================================================
    '/api/v1/playground/compile': {
      post: {
        tags: ['Playground'],
        summary: 'Compile / render HTML/CSS/JS/TS code',
        description: 'Submit code and get back a rendered preview URL.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  html: { type: 'string', description: 'HTML code' },
                  css: { type: 'string', description: 'CSS code' },
                  js: { type: 'string', description: 'JavaScript code' },
                  ts: { type: 'string', description: 'TypeScript code (transpiled to JS)' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Compiled result with preview URL.' } },
      },
    },
    // ============================================================
    // FOOTER PAGES
    // ============================================================
    '/privacy': {
      get: { tags: ['System'], summary: 'Privacy Policy page', responses: { '200': { description: 'HTML page' } } },
    },
    '/terms': {
      get: { tags: ['System'], summary: 'Terms of Service page', responses: { '200': { description: 'HTML page' } } },
    },
    '/cookies': {
      get: { tags: ['System'], summary: 'Cookie Policy page', responses: { '200': { description: 'HTML page' } } },
    },
    '/about': {
      get: { tags: ['System'], summary: 'About Us page', responses: { '200': { description: 'HTML page' } } },
    },
    '/contact': {
      get: { tags: ['System'], summary: 'Contact page', responses: { '200': { description: 'HTML page' } } },
    },
    '/faq': {
      get: { tags: ['System'], summary: 'FAQ page', responses: { '200': { description: 'HTML page' } } },
    },
    '/careers': {
      get: { tags: ['System'], summary: 'Careers page', responses: { '200': { description: 'HTML page' } } },
    },
    '/blog': {
      get: { tags: ['System'], summary: 'Blog page', responses: { '200': { description: 'HTML page' } } },
    },
    // ============================================================
    // LOGOS
    // ============================================================
    '/api/v1/logo/{slug}': {
      get: {
        tags: ['Logos'],
        summary: 'Get a specific logo by slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, description: 'Logo slug (e.g. google, apple, spotify)', example: 'google' },
        ],
        responses: { '200': { description: 'Logo details with URLs.' }, '404': { description: 'Logo not found.' } },
      },
    },
    '/api/v1/logos': {
      get: {
        tags: ['Logos'],
        summary: 'List all logos (paginated)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category slug' },
        ],
        responses: { '200': { description: 'Paginated list of logos.' } },
      },
    },
    // ============================================================
    // SEARCH
    // ============================================================
    '/api/v1/search': {
      get: {
        tags: ['Search'],
        summary: 'Full-text search across all assets',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search query' },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['all', 'logo', 'sports', 'flags'], default: 'all' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'Search results.' } },
      },
    },
    // ============================================================
    // CATEGORIES
    // ============================================================
    '/api/v1/categories': {
      get: { tags: ['Categories'], summary: 'List all categories', responses: { '200': { description: 'List of categories.' } } },
    },
    '/api/v1/category/{slug}': {
      get: {
        tags: ['Categories'],
        summary: 'Get logos by category',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Logos in this category.' } },
      },
    },
    // ============================================================
    // SPORTS
    // ============================================================
    '/api/v1/football': {
      get: { tags: ['Sports'], summary: 'List all football teams', responses: { '200': { description: 'List of football teams.' } } },
    },
    '/api/v1/football/{slug}': {
      get: { tags: ['Sports'], summary: 'Get a football team', responses: { '200': { description: 'Team details.' } } },
    },
    '/api/v1/basketball': {
      get: { tags: ['Sports'], summary: 'List all basketball teams', responses: { '200': { description: 'List of basketball teams.' } } },
    },
    '/api/v1/basketball/{slug}': {
      get: { tags: ['Sports'], summary: 'Get a basketball team', responses: { '200': { description: 'Team details.' } } },
    },
    '/api/v1/formula1': {
      get: { tags: ['Sports'], summary: 'List all F1 teams', responses: { '200': { description: 'List of F1 teams.' } } },
    },
    '/api/v1/formula1/{slug}': {
      get: { tags: ['Sports'], summary: 'Get an F1 team', responses: { '200': { description: 'Team details.' } } },
    },
    // ============================================================
    // FLAGS
    // ============================================================
    '/api/v1/flags': {
      get: { tags: ['Flags'], summary: 'List all country flags', responses: { '200': { description: 'List of flags.' } } },
    },
    '/api/v1/flags/{slug}': {
      get: { tags: ['Flags'], summary: 'Get a country flag', responses: { '200': { description: 'Flag details.' } } },
    },
    // ============================================================
    // CRYPTO, FRAMEWORKS, LANGUAGES, CLOUD
    // ============================================================
    '/api/v1/crypto': {
      get: { tags: ['Crypto'], summary: 'List cryptocurrencies', responses: { '200': { description: 'List of crypto logos.' } } },
    },
    '/api/v1/crypto/{slug}': {
      get: { tags: ['Crypto'], summary: 'Get a cryptocurrency', responses: { '200': { description: 'Crypto details.' } } },
    },
    '/api/v1/frameworks': {
      get: { tags: ['Frameworks'], summary: 'List frameworks', responses: { '200': { description: 'List of frameworks.' } } },
    },
    '/api/v1/framework/{slug}': {
      get: { tags: ['Frameworks'], summary: 'Get a framework', responses: { '200': { description: 'Framework details.' } } },
    },
    '/api/v1/languages': {
      get: { tags: ['Languages'], summary: 'List programming languages', responses: { '200': { description: 'List of languages.' } } },
    },
    '/api/v1/language/{slug}': {
      get: { tags: ['Languages'], summary: 'Get a language', responses: { '200': { description: 'Language details.' } } },
    },
    '/api/v1/cloud': {
      get: { tags: ['Cloud'], summary: 'List cloud providers', responses: { '200': { description: 'List of cloud providers.' } } },
    },
    '/api/v1/cloud/{slug}': {
      get: { tags: ['Cloud'], summary: 'Get a cloud provider', responses: { '200': { description: 'Cloud provider details.' } } },
    },
    // ============================================================
    // SYSTEM
    // ============================================================
    '/api/v1/stats': {
      get: { tags: ['System'], summary: 'API statistics', responses: { '200': { description: 'API usage statistics.' } } },
    },
    '/api/v1/health': {
      get: { tags: ['System'], summary: 'Health check', responses: { '200': { description: '{ status: "ok" }' } } },
    },
    '/playground': {
      get: { tags: ['Playground'], summary: 'Online playground / code editor', responses: { '200': { description: 'HTML playground page.' } } },
    },
  },
  components: {
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API Key for public API endpoints',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token for admin / user endpoints',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'creator', 'consumer'] },
          plan: { type: 'string', enum: ['free', 'pro', 'business', 'enterprise'] },
          avatar_url: { type: 'string' },
          status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      ApiKey: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          key: { type: 'string' },
          prefix: { type: 'string' },
          permissions: { type: 'array', items: { type: 'string' } },
          environment: { type: 'string', enum: ['development', 'staging', 'production'] },
          rate_limit: { type: 'integer' },
          status: { type: 'string', enum: ['active', 'inactive', 'revoked'] },
          tags: { type: 'array', items: { type: 'string' } },
          files: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                tag: { type: 'string' },
                content_type: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' },
              },
            },
          },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Plan: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          requests_per_day: { type: 'integer' },
          features: { type: 'array', items: { type: 'string' } },
          max_keys: { type: 'integer' },
          max_files_per_key: { type: 'integer' },
        },
      },
      Logo: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          website: { type: 'string' },
          category: { type: 'string' },
          colors: { type: 'array', items: { type: 'string' } },
          svg: { type: 'string' },
          png: { type: 'string' },
          webp: { type: 'string' },
          favicon: { type: 'string' },
          verified: { type: 'boolean' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          code: { type: 'integer' },
        },
      },
    },
  },
  security: [{ apiKey: [] }],
};
