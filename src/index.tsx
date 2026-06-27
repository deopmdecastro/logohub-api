import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import api from './routes/api';
import admin from './routes/admin';
import { landingPage, explorerPage, docsPage, adminPage } from './pages/public';
import { overviewPage, keysPage } from './pages/dashboard';
import { contentPage } from './pages/content';
import { settingsPage, teamPage, billingPage, analyticsPage, activityPage } from './pages/other';

const app = new Hono();

// Static assets
app.use('/static/*', serveStatic({ root: './' }));

// Public API
app.route('/api/v1', api);
// Admin / dashboard API
app.route('/api/admin', admin);
app.get('/api', (c) => c.redirect('/api/v1/stats'));

// =====================================================================
// PUBLIC SITE
// =====================================================================
app.get('/', (c) => c.html(landingPage()));
app.get('/explorer', (c) => c.html(explorerPage()));
app.get('/docs', (c) => c.html(docsPage()));
app.get('/admin', (c) => c.html(adminPage())); // redirects to /dashboard

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
