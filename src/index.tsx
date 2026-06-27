import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { swaggerUI } from '@hono/swagger-ui';
import api from './routes/api';
import admin from './routes/admin';
import auth from './routes/auth';
import apiKeys from './routes/keys';
import playground from './routes/playground';
import { openApiSpec } from './swagger';
import { landingPage, explorerPage, docsPage, adminPage } from './pages/public';
import { overviewPage, keysPage } from './pages/dashboard';
import { contentPage } from './pages/content';
import { settingsPage, teamPage, billingPage, analyticsPage, activityPage } from './pages/other';
import { playgroundPage } from './pages/playground_page';
import {
  privacyPage, termsPage, cookiesPage,
  aboutPage, contactPage, faqPage,
  careersPage, blogPage,
} from './pages/footer';

const app = new Hono();

// Static assets
app.use('/static/*', serveStatic({ root: './' }));

// =====================================================================
// SWAGGER / OPENAPI
// =====================================================================
app.get('/api/openapi.json', (c) => c.json(openApiSpec));
app.get('/api/docs', swaggerUI({ url: '/api/openapi.json' }));

// =====================================================================
// API ROUTES
// =====================================================================
// Public API v1
app.route('/api/v1', api);
// Auth (users, plans, admin users)
app.route('/api/v1/auth', auth);
// API Keys (with tags & files)
app.route('/api/v1/keys', apiKeys);
// Playground API
app.route('/api/v1/playground', playground);
// Admin / dashboard API
app.route('/api/admin', admin);
app.get('/api', (c) => c.redirect('/api/v1/stats'));

// =====================================================================
// PUBLIC SITE
// =====================================================================
app.get('/', (c) => c.html(landingPage()));
app.get('/explorer', (c) => c.html(explorerPage()));
app.get('/docs', (c) => c.html(docsPage()));
app.get('/admin', (c) => c.html(adminPage()));

// =====================================================================
// PLAYGROUND (front-end)
// =====================================================================
app.get('/playground', (c) => c.html(playgroundPage()));

// =====================================================================
// FOOTER PAGES
// =====================================================================
app.get('/privacy', (c) => c.html(privacyPage()));
app.get('/terms', (c) => c.html(termsPage()));
app.get('/cookies', (c) => c.html(cookiesPage()));
app.get('/about', (c) => c.html(aboutPage()));
app.get('/contact', (c) => c.html(contactPage()));
app.get('/faq', (c) => c.html(faqPage()));
app.get('/careers', (c) => c.html(careersPage()));
app.get('/blog', (c) => c.html(blogPage()));

// =====================================================================
// DASHBOARD
// =====================================================================
app.get('/dashboard', (c) => c.html(overviewPage()));
app.get('/dashboard/keys', (c) => c.html(keysPage()));
app.get('/dashboard/content', (c) => c.html(contentPage()));
app.get('/dashboard/analytics', (c) => c.html(analyticsPage()));
app.get('/dashboard/activity', (c) => c.html(activityPage()));
app.get('/dashboard/billing', (c) => c.html(billingPage()));
app.get('/dashboard/team', (c) => c.html(teamPage()));
app.get('/dashboard/settings', (c) => c.html(settingsPage()));

// Pricing → landing page anchor
app.get('/pricing', (c) => c.redirect('/#pricing'));

// 404
app.notFound((c) => c.html(`<!DOCTYPE html><html><head><title>404 — Not found</title>
<script src="https://cdn.tailwindcss.com"></script></head>
<body class="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white font-sans">
<div class="text-center"><div class="text-7xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 to-purple-400">404</div>
<p class="text-lg mb-6 text-gray-400">This page does not exist.</p>
<a href="/" class="inline-block bg-[#b8a9e8] text-black px-6 py-2 rounded-full font-semibold">Back home</a></div></body></html>`, 404));

export default app;
