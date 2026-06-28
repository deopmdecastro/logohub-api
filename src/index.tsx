import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { renderer } from './renderer';
import api from './routes/api';
import auth from './routes/auth';
import admin from './routes/admin';
import notificationsRoute from './routes/notifications';
import playground from './routes/playground';
import { landingPage, explorerPage, docsPage, adminPage } from './pages/public';
import { overviewPage, keysPage } from './pages/dashboard';
import { adminUsersPage } from './pages/admin_users';
import { contentPage } from './pages/content';
import { settingsPage, teamPage, billingPage, analyticsPage, activityPage, usersPage, creatorDashboardPage, consumerDashboardPage } from './pages/other';
import { profilePage } from './pages/profile_page';
import { notificationsPage } from './pages/notifications_page';
import { playgroundPage } from './pages/playground_page';
import { faqPage } from './pages/faq_page';
import { blogListPage, blogPostPage } from './pages/blog_pages';
import { blogAdminPage } from './pages/admin_blog';
import { faqAdminPage } from './pages/admin_faq';
import { supportAdminPage } from './pages/admin_support';
import { loginPage, registerPage } from './pages/auth_pages';
import { HEAD } from './pages/shared';

const app = new Hono();

// Global JSX renderer middleware
app.use('*', renderer);

// Static assets
app.use('/static/*', serveStatic({ root: './' }));

// Health check
app.get('/health', (c) => c.json({ status: 'ok', uptime: process.uptime() }));

// Public API
app.route('/api/v1', api);
// Auth API (login, register, me, etc.)
app.route('/api/v1/auth', auth);
// Admin / dashboard API
app.route('/api/admin', admin);
// Notifications API
app.route('/api/v1/notifications', notificationsRoute);
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

// Auth pages
app.get('/login', (c) => c.html(loginPage()));
app.get('/register', (c) => c.html(registerPage()));

// Playground
app.get('/playground', (c) => c.html(playgroundPage()));

// Public Blog
app.get('/blog', (c) => c.html(blogListPage()));
app.get('/blog/:slug', (c) => c.html(blogPostPage()));

// Public FAQ
app.get('/faq', (c) => c.html(faqPage()));

// Static pages
app.get('/contact', (c) => c.html(landingPage()));
app.get('/privacy', (c) => c.html(
  `${HEAD('Privacy Policy — LogoHub API')}
<body style="font-family:Inter,system-ui,sans-serif;max-width:720px;margin:4rem auto;padding:2rem;background:var(--bg);color:var(--text)">
<div class="card p-8">
<h1 style="color:#b8a9e8;font-size:2rem;font-weight:800;margin-bottom:1rem">Privacy Policy</h1>
<p style="color:var(--text-soft);margin-bottom:.5rem">Last updated: June 2026</p>
<p style="color:var(--text);margin-bottom:1.5rem;line-height:1.7">LogoHub does not share or sell your data. We only collect what is necessary to provide the API service: email for account management, API key usage metrics for rate limiting, and optional profile information. All data is encrypted in transit and at rest.</p>
<div style="border-top:1px solid var(--border);padding-top:1.5rem;margin-top:1.5rem">
<a href="/" style="color:#b8a9e8;text-decoration:none;font-weight:600">← Back to home</a>
</div>
</div>
</body></html>`
));
app.get('/terms', (c) => c.html(
  `${HEAD('Terms of Service — LogoHub API')}
<body style="font-family:Inter,system-ui,sans-serif;max-width:720px;margin:4rem auto;padding:2rem;background:var(--bg);color:var(--text)">
<div class="card p-8">
<h1 style="color:#b8a9e8;font-size:2rem;font-weight:800;margin-bottom:1rem">Terms of Service</h1>
<p style="color:var(--text-soft);margin-bottom:.5rem">Last updated: June 2026</p>
<p style="color:var(--text);margin-bottom:1.5rem;line-height:1.7">By using LogoHub API you agree to our terms. You are responsible for keeping your API keys secure. Rate limits apply per plan. We reserve the right to suspend access for abuse. The service is provided "as is" without warranty.</p>
<div style="border-top:1px solid var(--border);padding-top:1.5rem;margin-top:1.5rem">
<a href="/" style="color:#b8a9e8;text-decoration:none;font-weight:600">← Back to home</a>
</div>
</div>
</body></html>`
));
app.get('/about', (c) => c.redirect('/#features'));

// =====================================================================
// DASHBOARD
// =====================================================================
app.get('/dashboard', (c) => c.html(overviewPage()));
app.get('/dashboard/creator', (c) => c.html(creatorDashboardPage()));
app.get('/dashboard/consumer', (c) => c.html(consumerDashboardPage()));
app.get('/dashboard/keys', (c) => c.html(keysPage()));
app.get('/dashboard/content', (c) => c.html(contentPage()));
app.get('/dashboard/blog', (c) => c.html(blogAdminPage()));
app.get('/dashboard/faq', (c) => c.html(faqAdminPage()));
app.get('/dashboard/support', (c) => c.html(supportAdminPage()));
app.get('/dashboard/admin/users', (c) => c.html(adminUsersPage()));
app.get('/dashboard/analytics', (c) => c.html(analyticsPage()));
app.get('/dashboard/activity', (c) => c.html(activityPage()));
app.get('/dashboard/billing', (c) => c.html(billingPage()));
app.get('/dashboard/team', (c) => c.html(teamPage()));
app.get('/dashboard/settings', (c) => c.html(settingsPage()));
app.get('/dashboard/notifications', (c) => c.html(notificationsPage()));
app.get('/dashboard/profile', (c) => c.html(profilePage()));

// Pricing → landing page anchor
app.get('/pricing', (c) => c.redirect('/#pricing'));

// =====================================================================
// 404 — NOT FOUND
// =====================================================================
app.notFound((c) => {
  return c.html(
    `${HEAD('404 — Page Not Found | LogoHub API')}
<body style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);font-family:Inter,system-ui,sans-serif">
<div style="text-align:center;padding:2rem">
  <div style="font-size:8rem;font-weight:900;line-height:1;background:linear-gradient(135deg,#818cf8,#c084fc,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:.5rem">404</div>
  <p style="font-size:1.25rem;color:var(--text-soft);margin-bottom:2rem">This page does not exist or has been moved.</p>
  <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">
    <a href="/" style="display:inline-flex;align-items:center;gap:.5rem;background:#b8a9e8;color:#1a1a1a;padding:.75rem 1.5rem;border-radius:9999px;font-weight:600;text-decoration:none;transition:all .2s">← Back home</a>
    <a href="/docs" style="display:inline-flex;align-items:center;gap:.5rem;background:var(--panel);color:var(--text);padding:.75rem 1.5rem;border-radius:9999px;font-weight:500;text-decoration:none;border:1px solid var(--border);transition:all .2s">View Docs</a>
  </div>
</div>
</body></html>`,
    404
  );
});

export default app;
