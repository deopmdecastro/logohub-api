// OpenAPI / Swagger Specification for LogoHub API
// Accessible at /api/docs (Swagger UI) and /api/openapi.json (raw spec)

import type { OpenAPIObject } from '@hono/zod-openapi';

export const openApiSpec: OpenAPIObject = {
  openapi: '3.1.0',
  info: {
    title: 'LogoHub API',
    version: 'v2',
    description: `The World's Largest Visual Identity API — access 50,000+ logos, icons, flags, sports emblems, and more.

## 🚀 Quick Start
\`\`\`bash
npm install && npm run dev
# Open http://localhost:3000
\`\`\`

## 🔐 Authentication
| Method          | Use Case                     | How                                   |
|-----------------|------------------------------|---------------------------------------|
| No auth         | Public read endpoints        | No header needed (rate-limited)       |
| **API Key**     | Consumer/creator API access  | \`X-API-Key: <key>\` or \`?api_key=\` |
| **Bearer JWT**  | Admin dashboard, user mgmt   | \`Authorization: Bearer <token>\`     |

## 📊 Rate Limits
| Plan       | Requests/day | Monthly |
|------------|-------------|---------|
| Free       | 1,000       | 30K     |
| Pro        | 100,000     | 3M      |
| Business   | 1,000,000   | 30M     |
| Enterprise | Unlimited   | ∞       |

## 📦 Response Format
All endpoints return:
\`\`\`json
{ "data": { ... }, "meta": { "version": "v2", "timestamp": "2026-..." } }
\`\`\`
Errors: \`{ "error": "message", "code": 400 }\`

## 🗄️ Database
PostgreSQL 16 (Docker). Schema in \`docker/init.sql\`, Prisma types in \`prisma/schema.prisma\`.

## 📧 Emails
SMTP via environment variables. Templates: welcome, password-reset, notification.
Dev mode logs to console.`,
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
    { name: 'Auth', description: 'Registration, login, profile, password management' },
    { name: 'Logos', description: 'Brand and company logos' },
    { name: 'Search', description: 'Full-text search across all assets' },
    { name: 'Categories', description: 'Logo categories and filtering' },
    { name: 'Sports', description: 'Sports teams (football, basketball, F1)' },
    { name: 'Flags', description: 'Country flags' },
    { name: 'Crypto', description: 'Cryptocurrency logos' },
    { name: 'Frameworks', description: 'Frontend/backend frameworks' },
    { name: 'Languages', description: 'Programming languages' },
    { name: 'Cloud', description: 'Cloud provider logos' },
    { name: 'Admin', description: 'Admin dashboard — user management, settings, stats' },
    { name: 'API Keys', description: 'API key CRUD and management' },
    { name: 'Notifications', description: 'Real-time (SSE) notification system' },
    { name: 'Playground', description: 'Online code editor / sandbox' },
    { name: 'System', description: 'Health, stats, pages' },
  ],
  paths: {
    // ============================================================
    // AUTH
    // ============================================================
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Create a new user account. Role must be "consumer" or "creator". A welcome email is sent.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Zana Acessórios' },
                  email: { type: 'string', format: 'email', example: 'zana@example.com' },
                  password: { type: 'string', format: 'password', minLength: 8, example: 'S3cur3P@ss!' },
                  role: { type: 'string', enum: ['consumer', 'creator'], default: 'consumer' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User created. Returns JWT token + user object.' },
          '400': { description: 'Validation error.' },
          '409': { description: 'Email already in use.' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'User login',
        description: 'Authenticate with email and password. Returns JWT token (24h expiry) and user profile.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'admin@logohub.dev' },
                  password: { type: 'string', format: 'password', example: 'Demo@2026' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful. Returns JWT token + user profile.' },
          '401': { description: 'Invalid credentials.' },
          '403': { description: 'Account is banned/suspended/inactive.' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Current user profile (password excluded).' },
          '401': { description: 'Not authenticated.' },
        },
      },
      patch: {
        tags: ['Auth'],
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Zana Updated' },
                  avatar_url: { type: 'string', example: 'https://...' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Profile updated.' } },
      },
    } as any,
    '/api/v1/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout (invalidate JWT session)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Logged out.' } },
      },
    },
    '/api/v1/auth/change-password': {
      post: {
        tags: ['Auth'],
        summary: 'Change password',
        security: [{ bearerAuth: [] }],
        description: 'Requires current password + new password (min 8 chars).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['current_password', 'new_password'],
                properties: {
                  current_password: { type: 'string' },
                  new_password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Password changed.' }, '400': { description: 'Current password is wrong.' } },
      },
    },
    '/api/v1/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', format: 'email' } },
              },
            },
          },
        },
        responses: { '200': { description: 'Reset link sent if email exists.' } },
      },
    },
    '/api/v1/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'new_password'],
                properties: {
                  token: { type: 'string' },
                  new_password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Password reset.' }, '400': { description: 'Invalid/expired token.' } },
      },
    },

    // ============================================================
    // ADMIN — USER MANAGEMENT
    // ============================================================
    '/api/v1/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List all users (Admin only)',
        security: [{ bearerAuth: [] }],
        description: 'Returns all users. Filterable via query params.',
        parameters: [
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['admin', 'creator', 'consumer'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive', 'suspended', 'banned'] } },
          { name: 'plan', in: 'query', schema: { type: 'string', enum: ['free', 'pro', 'business', 'enterprise'] } },
        ],
        responses: { '200': { description: 'List of all users.' }, '403': { description: 'Admin only.' } },
      },
    },
    '/api/v1/admin/users/{id}': {
      patch: {
        tags: ['Admin'],
        summary: 'Update user (Admin only)',
        security: [{ bearerAuth: [] }],
        description: 'Update name, email, role, plan, status. Pass "password_hash" as plain text to reset password.',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string', enum: ['admin', 'creator', 'consumer'] },
                  plan: { type: 'string', enum: ['free', 'pro', 'business', 'enterprise'] },
                  status: { type: 'string', enum: ['active', 'inactive', 'suspended', 'banned'] },
                  password_hash: { type: 'string', description: 'Plain-text password (auto-hashed)' },
                  bio: { type: 'string' },
                  company: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'User updated.' }, '404': { description: 'User not found.' } },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Delete user (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User deleted.' }, '404': { description: 'User not found.' } },
      },
    },
    '/api/v1/admin/users/{id}/reset-password': {
      post: {
        tags: ['Admin'],
        summary: 'Admin reset user password',
        security: [{ bearerAuth: [] }],
        description: 'Set a new password for any user. Activity is logged.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  password: { type: 'string', description: 'New password (min 8 chars)', minLength: 8 },
                  new_password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Password reset. Returns temp password.' }, '404': { description: 'User not found.' } },
      },
    },
    '/api/v1/admin/plans': {
      get: {
        tags: ['Admin'],
        summary: 'List plans',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: '4 plans: free, pro, business, enterprise.' } },
      },
    },
    '/api/v1/admin/plans/{id}': {
      patch: {
        tags: ['Admin'],
        summary: 'Update plan limits (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Plan updated.' } },
      },
    },
    '/api/v1/admin/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Admin statistics overview',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Usage stats for admin dashboard.' } },
      },
    },
    '/api/v1/admin/settings': {
      get: {
        tags: ['Admin'],
        summary: 'List all settings',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'group', in: 'query', schema: { type: 'string' }, description: 'Filter by group (platform, billing, stats, brand, git)' }],
        responses: { '200': { description: 'Settings list.' } },
      },
    },
    '/api/v1/admin/settings/{key}': {
      patch: {
        tags: ['Admin'],
        summary: 'Update a setting value',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Setting updated.' } },
      },
    },
    '/api/v1/admin/activity': {
      get: {
        tags: ['Admin'],
        summary: 'Activity log',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Recent activity entries.' } },
      },
    },

    // ============================================================
    // NOTIFICATIONS
    // ============================================================
    '/api/v1/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'List notifications',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          { name: 'role', in: 'query', schema: { type: 'string' }, description: 'Filter by target role' },
          { name: 'unread', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: { '200': { description: 'List of notifications (newest first).' } },
      },
    },
    '/api/v1/notifications/stream': {
      get: {
        tags: ['Notifications'],
        summary: 'SSE real-time notification stream',
        description: 'Server-Sent Events stream. Connect via EventSource.',
        responses: { '200': { description: 'text/event-stream' } },
      },
    },
    '/api/v1/notifications/unread-count': {
      get: {
        tags: ['Notifications'],
        summary: 'Get unread notification count',
        responses: { '200': { description: '{ unread: number, total: number }' } },
      },
    },
    '/api/v1/notifications/read-all': {
      patch: {
        tags: ['Notifications'],
        summary: 'Mark all notifications as read',
        responses: { '200': { description: 'All notifications marked read.' } },
      },
    },
    '/api/v1/notifications/{id}/read': {
      patch: {
        tags: ['Notifications'],
        summary: 'Mark a notification as read',
        responses: { '200': { description: 'Marked read.' } },
      },
    },
    '/api/v1/notifications/{id}': {
      delete: {
        tags: ['Notifications'],
        summary: 'Delete a notification',
        responses: { '200': { description: 'Deleted.' } },
      },
    },

    // ============================================================
    // API KEYS
    // ============================================================
    '/api/v1/keys': {
      get: {
        tags: ['API Keys'],
        summary: 'List your API keys',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { '200': { description: 'Paginated list of API keys.' } },
      },
      post: {
        tags: ['API Keys'],
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
                  permissions: { type: 'array', items: { type: 'string', enum: ['read', 'write', 'upload'] } },
                  tags: { type: 'array', items: { type: 'string' }, example: ['production', 'frontend'] },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'API key created. Returns the full key (save it now).' } },
      },
    },
    '/api/v1/keys/{id}': {
      get: {
        tags: ['API Keys'],
        summary: 'Get API key details',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'API key details (key field hidden in response).' } },
      },
      patch: {
        tags: ['API Keys'],
        summary: 'Update API key',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'API key updated.' } },
      },
      delete: {
        tags: ['API Keys'],
        summary: 'Delete API key',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'API key deleted.' } },
      },
    },
    '/api/v1/keys/{id}/revoke': {
      post: {
        tags: ['API Keys'],
        summary: 'Revoke API key (deactivate without deleting)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'API key revoked.' } },
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
    // LOGOS
    // ============================================================
    '/api/v1/logo/{slug}': {
      get: {
        tags: ['Logos'],
        summary: 'Get a specific logo by slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, description: 'Logo slug (e.g. google, apple, spotify)', example: 'google' },
        ],
        responses: { '200': { description: 'Logo details with SVG, PNG, WebP URLs.' }, '404': { description: 'Not found.' } },
      },
    },
    '/api/v1/logos': {
      get: {
        tags: ['Logos'],
        summary: 'List all logos (paginated)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
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
      get: { tags: ['Categories'], summary: 'Get logos by category', parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Logos in this category.' } } },
    },

    // ============================================================
    // SPORTS
    // ============================================================
    '/api/v1/football': { get: { tags: ['Sports'], summary: 'List all football teams', responses: { '200': { description: 'List of teams.' } } } },
    '/api/v1/football/{slug}': { get: { tags: ['Sports'], summary: 'Get a football team', responses: { '200': { description: 'Team details.' } } } },
    '/api/v1/basketball': { get: { tags: ['Sports'], summary: 'List all basketball teams', responses: { '200': { description: 'List of teams.' } } } },
    '/api/v1/basketball/{slug}': { get: { tags: ['Sports'], summary: 'Get a basketball team', responses: { '200': { description: 'Team details.' } } } },
    '/api/v1/formula1': { get: { tags: ['Sports'], summary: 'List all F1 teams', responses: { '200': { description: 'List of teams.' } } } },
    '/api/v1/formula1/{slug}': { get: { tags: ['Sports'], summary: 'Get an F1 team', responses: { '200': { description: 'Team details.' } } } },

    // ============================================================
    // FLAGS
    // ============================================================
    '/api/v1/flags': { get: { tags: ['Flags'], summary: 'List all country flags', responses: { '200': { description: 'List of flags.' } } } },
    '/api/v1/flags/{slug}': { get: { tags: ['Flags'], summary: 'Get a country flag', responses: { '200': { description: 'Flag details.' } } } },

    // ============================================================
    // CRYPTO, FRAMEWORKS, LANGUAGES, CLOUD
    // ============================================================
    '/api/v1/crypto': { get: { tags: ['Crypto'], summary: 'List cryptocurrencies', responses: { '200': { description: 'Crypto logos.' } } } },
    '/api/v1/crypto/{slug}': { get: { tags: ['Crypto'], summary: 'Get a cryptocurrency', responses: { '200': { description: 'Crypto details.' } } } },
    '/api/v1/frameworks': { get: { tags: ['Frameworks'], summary: 'List frameworks', responses: { '200': { description: 'Framework list.' } } } },
    '/api/v1/framework/{slug}': { get: { tags: ['Frameworks'], summary: 'Get a framework', responses: { '200': { description: 'Framework details.' } } } },
    '/api/v1/languages': { get: { tags: ['Languages'], summary: 'List languages', responses: { '200': { description: 'Language list.' } } } },
    '/api/v1/language/{slug}': { get: { tags: ['Languages'], summary: 'Get a language', responses: { '200': { description: 'Language details.' } } } },
    '/api/v1/cloud': { get: { tags: ['Cloud'], summary: 'List cloud providers', responses: { '200': { description: 'Cloud list.' } } } },
    '/api/v1/cloud/{slug}': { get: { tags: ['Cloud'], summary: 'Get a cloud provider', responses: { '200': { description: 'Cloud details.' } } } },

    // ============================================================
    // SYSTEM
    // ============================================================
    '/api/v1/stats': { get: { tags: ['System'], summary: 'API statistics', responses: { '200': { description: 'Usage stats.' } } } },
    '/api/v1/health': { get: { tags: ['System'], summary: 'Health check', responses: { '200': { description: '{ status: "ok" }' } } } },

    // ============================================================
    // PAGES
    // ============================================================
    '/': { get: { tags: ['System'], summary: 'Landing page', responses: { '200': { description: 'HTML' } } } },
    '/explorer': { get: { tags: ['System'], summary: 'Logo explorer', responses: { '200': { description: 'HTML' } } } },
    '/login': { get: { tags: ['System'], summary: 'Login page', responses: { '200': { description: 'HTML' } } } },
    '/register': { get: { tags: ['System'], summary: 'Registration page', responses: { '200': { description: 'HTML' } } } },
    '/playground': { get: { tags: ['Playground'], summary: 'Online playground', responses: { '200': { description: 'HTML' } } } },
    '/dashboard': { get: { tags: ['System'], summary: 'Admin dashboard', responses: { '200': { description: 'HTML (auth required)' } } } },
    '/dashboard/admin/users': { get: { tags: ['System'], summary: 'Admin user management', responses: { '200': { description: 'HTML (admin only)' } } } },
    '/dashboard/creator': { get: { tags: ['System'], summary: 'Creator dashboard', responses: { '200': { description: 'HTML (creator only)' } } } },
    '/dashboard/consumer': { get: { tags: ['System'], summary: 'Consumer dashboard', responses: { '200': { description: 'HTML (consumer only)' } } } },
    '/dashboard/analytics': { get: { tags: ['System'], summary: 'Analytics page', responses: { '200': { description: 'HTML' } } } },
    '/dashboard/profile': { get: { tags: ['System'], summary: 'Profile page', responses: { '200': { description: 'HTML (auth required)' } } } },
    '/dashboard/notifications': { get: { tags: ['System'], summary: 'Notifications inbox', responses: { '200': { description: 'HTML (auth required)' } } } },
    '/dashboard/billing': { get: { tags: ['System'], summary: 'Billing page', responses: { '200': { description: 'HTML (admin only)' } } } },
    '/dashboard/keys': { get: { tags: ['System'], summary: 'API Keys page', responses: { '200': { description: 'HTML' } } } },
    '/docs': { get: { tags: ['System'], summary: 'Documentation page', responses: { '200': { description: 'HTML' } } } },
    '/api/docs': { get: { tags: ['System'], summary: 'Swagger UI', responses: { '200': { description: 'Swagger UI page' } } } },
    '/api/openapi.json': { get: { tags: ['System'], summary: 'OpenAPI spec (JSON)', responses: { '200': { description: 'OpenAPI 3.1 spec' } } } },
    '/privacy': { get: { tags: ['System'], summary: 'Privacy Policy', responses: { '200': { description: 'HTML' } } } },
    '/terms': { get: { tags: ['System'], summary: 'Terms of Service', responses: { '200': { description: 'HTML' } } } },
    '/about': { get: { tags: ['System'], summary: 'About Us', responses: { '200': { description: 'HTML' } } } },
    '/contact': { get: { tags: ['System'], summary: 'Contact', responses: { '200': { description: 'HTML' } } } },
    '/faq': { get: { tags: ['System'], summary: 'FAQ', responses: { '200': { description: 'HTML' } } } },
    '/careers': { get: { tags: ['System'], summary: 'Careers', responses: { '200': { description: 'HTML' } } } },
    '/blog': { get: { tags: ['System'], summary: 'Blog', responses: { '200': { description: 'HTML' } } } },
  },
  components: {
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API Key for public and consumer endpoints (also supports ?api_key= query param)',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from /api/v1/auth/login — required for admin and user-specific endpoints',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['admin', 'creator', 'consumer'] },
          plan: { type: 'string', enum: ['free', 'pro', 'business', 'enterprise'] },
          status: { type: 'string', enum: ['active', 'inactive', 'suspended', 'banned'] },
          avatar_url: { type: 'string' },
          bio: { type: 'string' },
          website: { type: 'string' },
          company: { type: 'string' },
          earnings_balance: { type: 'number' },
          requests_today: { type: 'integer' },
          requests_30d: { type: 'integer' },
          last_login: { type: 'string', format: 'date-time' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      ApiKey: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          key: { type: 'string', description: 'Full key (only shown on creation)' },
          prefix: { type: 'string' },
          status: { type: 'string', enum: ['active', 'revoked', 'expired'] },
          permissions: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          requests: { type: 'integer' },
          requests_24h: { type: 'integer' },
          last_used: { type: 'string', format: 'date-time' },
          expires_at: { type: 'string', format: 'date-time' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      Plan: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number', description: 'Monthly price (USD). -1 = custom/enterprise.' },
          quota: { type: 'integer', description: 'Daily request quota.' },
          color: { type: 'string', description: 'Brand color for UI.' },
        },
      },
      Logo: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          slug: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          website: { type: 'string' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          primary_color: { type: 'string' },
          secondary_color: { type: 'string' },
          svg_url: { type: 'string' },
          png_url: { type: 'string' },
          webp_url: { type: 'string' },
          favicon_url: { type: 'string' },
          verified: { type: 'string', enum: ['yes', 'no', 'pending'] },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          type: { type: 'string', enum: ['info', 'success', 'warning', 'error'] },
          title: { type: 'string' },
          message: { type: 'string' },
          role: { type: 'string' },
          read: { type: 'boolean' },
          link: { type: 'string' },
          ts: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', description: 'Human-readable error message' },
          code: { type: 'integer', description: 'HTTP status code' },
        },
      },
    },
  },
  security: [{ apiKey: [] }],
};
