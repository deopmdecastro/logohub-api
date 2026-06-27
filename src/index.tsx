import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import api from './routes/api';
import admin from './routes/admin';
import playground from './routes/playground';
import { landingPage, explorerPage, docsPage, adminPage } from './pages/public';
import { overviewPage, keysPage } from './pages/dashboard';
import { contentPage } from './pages/content';
import { settingsPage, teamPage, billingPage, analyticsPage, activityPage, usersPage } from './pages/other';
import { profilePage } from './pages/profile_page';
import { notificationsPage } from './pages/notifications_page';
import { playgroundPage } from './pages/playground_page';
import { faqPage } from './pages/faq_page';
import { blogListPage, blogPostPage } from './pages/blog_pages';
import { blogAdminPage } from './pages/admin_blog';
import { faqAdminPage } from './pages/admin_faq';
import { supportAdminPage } from './pages/admin_support';

const app = new Hono();

// Static assets
app.use('/static/*', serveStatic({ root: './' }));

// Public API
app.route('/api/v1', api);
// Admin / dashboard API
app.route('/api/admin', admin);
// Playground API
app.route('/api/v1/playground', playground);
app.get('/api', (c) => c.redirect('/api/v1/stats'));

// =====================================================================
// PUBLIC SITE
// =====================================================================
app.get('/', (c) => c.html(landingPage()));
app.get('/explorer', (c) => c.html(explorerPage()));
app.get('/docs', (c) => c.html(docsPage()));
app.get('/admin', (c) => c.html(adminPage())); // redirects to /dashboard

// Playground
app.get('/playground', (c) => c.html(playgroundPage()));

// Public Blog
app.get('/blog', (c) => c.html(blogListPage()));
app.get('/blog/:slug', (c) => c.html(blogPostPage()));

// Public FAQ
app.get('/faq', (c) => c.html(faqPage()));

// Static pages (simple redirect/placeholders)
app.get('/contact', (c) => c.html(landingPage()));
app.get('/privacy', (c) => c.html('<!DOCTYPE html><html><head><title>Privacy — LogoHub</title><meta charset="UTF-8"></head><body style="font-family:sans-serif;max-width:700px;margin:4rem auto;padding:2rem;background:#0a0a0f;color:#ddd"><h1 style="color:#b8a9e8">Privacy Policy</h1><p>Last updated: June 2026</p><p>LogoHub does not share or sell your data.</p><a href="/" style="color:#b8a9e8">← Back</a></body></html>'));
app.get('/terms', (c) => c.html('<!DOCTYPE html><html><head><title>Terms — LogoHub</title><meta charset="UTF-8"></head><body style="font-family:sans-serif;max-width:700px;margin:4rem auto;padding:2rem;background:#0a0a0f;color:#ddd"><h1 style="color:#b8a9e8">Terms of Service</h1><p>Last updated: June 2026</p><p>By using LogoHub API you agree to our terms.</p><a href="/" style="color:#b8a9e8">← Back</a></body></html>'));
app.get('/about', (c) => c.redirect('/#features'));

// =====================================================================
// DASHBOARD
// =====================================================================
app.get('/dashboard', (c) => c.html(overviewPage()));
app.get('/dashboard/keys', (c) => c.html(keysPage()));
app.get('/dashboard/content', (c) => c.html(contentPage()));
app.get('/dashboard/blog', (c) => c.html(blogAdminPage()));
app.get('/dashboard/faq', (c) => c.html(faqAdminPage()));
app.get('/dashboard/support', (c) => c.html(supportAdminPage()));
app.get('/dashboard/admin/users', (c) => c.html(usersPage()));
app.get('/dashboard/analytics', (c) => c.html(analyticsPage()));
app.get('/dashboard/activity', (c) => c.html(activityPage()));
app.get('/dashboard/billing', (c) => c.html(billingPage()));
app.get('/dashboard/team', (c) => c.html(teamPage()));
app.get('/dashboard/settings', (c) => c.html(settingsPage()));
app.get('/dashboard/notifications', (c) => c.html(notificationsPage()));
app.get('/dashboard/profile', (c) => c.html(profilePage()));

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
