// Admin / dashboard CRUD API
// Powers the redesigned dashboard pages. Reads/writes through the hybrid
// store (data/store.ts) — every endpoint already returns the shape the front-end
// expects, so swapping in a real DB later is a one-file refactor.

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { store } from '../data/store';
import { createNotification } from './notifications';
import { sendEmail } from '../services/email';

const admin = new Hono();

admin.use('/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'] }));

const ok = (c: any, data: any, extra: any = {}) => c.json({ data, ...extra, meta: { version: 'admin-v1', timestamp: new Date().toISOString() } });
const bad = (c: any, msg: string, code = 400) => c.json({ error: msg, code }, code as any);

// ============================================================
// API KEYS
// ============================================================
admin.get('/keys', async (c) => ok(c, await store.listKeys()));
admin.get('/keys/:id', async (c) => {
  const k = await store.getKey(c.req.param('id'));
  return k ? ok(c, k) : bad(c, 'Key not found', 404);
});
admin.post('/keys', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return bad(c, 'name is required');
  const k = await store.createKey(body);
  await createNotification({ type: 'info', title: 'New API key created', message: `Key "${k.name}" has been created.`, role: 'admin', link: '/dashboard/keys' });
  return c.json({ data: k, meta: { version: 'admin-v1', timestamp: new Date().toISOString() } }, 201);
});
admin.patch('/keys/:id', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const k = await store.updateKey(c.req.param('id'), body);
  return k ? ok(c, k) : bad(c, 'Key not found', 404);
});
admin.post('/keys/:id/revoke', async (c) => {
  const k = await store.revokeKey(c.req.param('id'));
  if (k) await createNotification({ type: 'warning', title: 'API key revoked', message: `Key "${k.name}" has been revoked.`, role: 'admin', link: '/dashboard/keys' });
  return k ? ok(c, k) : bad(c, 'Key not found', 404);
});
admin.delete('/keys/:id', async (c) => {
  const okDel = await store.deleteKey(c.req.param('id'));
  return okDel ? ok(c, { deleted: true }) : bad(c, 'Key not found', 404);
});

// ============================================================
// CONTENT (logos / sport teams / flags — unified)
// ============================================================
admin.get('/content', async (c) => {
  const q = (c.req.query('q') || '').toLowerCase();
  const category = c.req.query('category') || '';
  const status = c.req.query('status') || '';
  let items = await store.listContent();
  if (category) items = items.filter((i: any) => i.category === category);
  if (status) items = items.filter((i: any) => i.status === status);
  if (q) items = items.filter((i: any) =>
    (i.name + ' ' + i.slug + ' ' + i.description + ' ' + (i.tags || []).join(' ')).toLowerCase().includes(q)
  );
  return ok(c, items, { total: items.length });
});
admin.get('/content/:id', async (c) => {
  const item = await store.getContent(c.req.param('id'));
  return item ? ok(c, item) : bad(c, 'Content not found', 404);
});
admin.post('/content', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.name) return bad(c, 'name is required');
  const item = await store.createContent(body);
  await createNotification({ type: 'success', title: 'New content created', message: `"${item.name}" has been published.`, role: 'creator', link: '/dashboard/content' });
  await createNotification({ type: 'info', title: 'New content submitted', message: `"${item.name}" by creator.`, role: 'admin', link: '/dashboard/content' });
  return c.json({ data: item, meta: { version: 'admin-v1', timestamp: new Date().toISOString() } }, 201);
});
admin.patch('/content/:id', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const item = await store.updateContent(c.req.param('id'), body);
  if (item && body.status === 'published') await createNotification({ type: 'success', title: 'Content published', message: `"${item.name}" is now live.`, role: 'creator', link: '/dashboard/content' });
  return item ? ok(c, item) : bad(c, 'Content not found', 404);
});
admin.delete('/content/:id', async (c) => {
  const okDel = await store.deleteContent(c.req.param('id'));
  return okDel ? ok(c, { deleted: true }) : bad(c, 'Content not found', 404);
});

// ============================================================
// TEAM
// ============================================================
admin.get('/team', async (c) => ok(c, await store.listTeam()));
admin.post('/team', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const member = await store.saveTeamMember(body);
  await createNotification({ type: 'info', title: 'New team member', message: `${member.name} has been added to the team.`, role: 'admin', link: '/dashboard/team' });
  return ok(c, member);
});
admin.delete('/team/:id', async (c) => {
  const okDel = await store.deleteTeamMember(Number(c.req.param('id')));
  return okDel ? ok(c, { deleted: true }) : bad(c, 'Member not found', 404);
});

// ============================================================
// TEAM INVITE EMAIL
// ============================================================
admin.post('/team/invite', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { email, name, role, plan } = body;
  if (!email) return bad(c, 'Email is required');

  const appUrl = (globalThis as any).process?.env?.APP_URL || 'http://localhost:3000';

  const inviteHtml = '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;background:#0a0a0f;color:#f4f4f5">' +
    '<div style="text-align:center;margin-bottom:30px">' +
      '<div style="width:48px;height:48px;border-radius:12px;background:#b8a9e8;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#1a1a1a">L</div>' +
    '</div>' +
    '<h1 style="font-size:22px;margin-bottom:8px">You\'re invited to LogoHub!</h1>' +
    '<p style="color:#a1a1aa;line-height:1.6;margin-bottom:8px">'+(name||'A team admin')+' has invited you to join LogoHub as a <strong>'+(role||'viewer')+'</strong> on the <strong>'+(plan||'free')+'</strong> plan.</p>' +
    '<p style="color:#a1a1aa;line-height:1.6;margin-bottom:24px">LogoHub is the world\'s largest visual identity API — explore 50,000+ logos, icons, and visual assets.</p>' +
    '<a href="'+appUrl+'/register" style="display:inline-block;padding:12px 24px;background:#b8a9e8;color:#1a1a1a;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px">Create your account →</a>' +
    '<p style="color:#71717a;font-size:12px;margin-top:32px;border-top:1px solid rgba(255,255,255,.06);padding-top:20px">LogoHub — The World\'s Largest Visual Identity API</p>' +
  '</div>';

  const result = await sendEmail({
    to: email,
    subject: (name||'Someone')+' invited you to join LogoHub 🎉',
    html: inviteHtml,
  });

  if (!result.ok) return bad(c, 'Failed to send invitation', 500);

  await createNotification({
    type: 'info',
    title: 'Invitation sent',
    message: 'Email invitation sent to '+email,
    role: 'admin',
    link: '/dashboard/team',
  });

  return ok(c, { sent: true, email, result });
});

// ============================================================
// SETTINGS  (includes Git config)
// ============================================================
admin.get('/settings', async (c) => {
  const group = c.req.query('group');
  let items = await store.listSettings();
  if (group) items = items.filter((s: any) => s.group === group);
  return ok(c, items);
});
admin.patch('/settings/:key', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (typeof body.value === 'undefined') return bad(c, 'value is required');
  const s = await store.updateSetting(c.req.param('key'), String(body.value));
  return s ? ok(c, s) : bad(c, 'Setting not found', 404);
});

// Test Git connection (lightweight, never exposes the PAT).
admin.post('/git/test', async (c) => {
  const urlSetting = await store.getSetting('git_repo_url');
  const branchSetting = await store.getSetting('git_branch');
  const patSetting = await store.getSetting('git_pat');
  const url = urlSetting?.value || '';
  const branch = branchSetting?.value || '';
  const pat = patSetting?.value || '';
  const errors: string[] = [];
  if (!/^https?:\/\//.test(url)) errors.push('Repo URL must start with https://');
  if (!branch) errors.push('Branch is required');
  if (!pat || pat.length < 8) errors.push('Personal access token is missing or too short');
  if (errors.length) {
    await store.updateSetting('git_connection_status', 'error');
    return c.json({ data: { ok: false, errors }, meta: { version: 'admin-v1' } }, 400);
  }
  let ok2 = false; let detail = '';
  try {
    const r = await (globalThis as any).fetch(url, { method: 'HEAD' });
    ok2 = r.ok || r.status === 301 || r.status === 302;
    detail = 'HTTP ' + r.status;
  } catch (e: any) {
    detail = e?.message || 'fetch failed';
  }
  await store.updateSetting('git_connection_status', ok2 ? 'connected' : 'error');
  return c.json({ data: { ok: ok2, detail }, meta: { version: 'admin-v1' } });
});

// ============================================================
// ACTIVITY
// ============================================================
admin.get('/activity', async (c) => ok(c, await store.listActivity()));

// ============================================================
// STATS (combined snapshot for the overview page)
// ============================================================
admin.get('/stats', async (c) => {
  const [keys, content, team, settings] = await Promise.all([
    store.listKeys(),
    store.listContent(),
    store.listTeam(),
    store.listSettings(),
  ]);
  const sv = (k: string) => settings.find((s: any) => s.key === k)?.value;
  return ok(c, {
    total_requests: Number(sv('total_requests_24h')) || 0,
    avg_latency_ms: Number(sv('avg_latency_ms')) || 0,
    success_rate: Number(sv('success_rate')) || 0,
    errors_24h: Number(sv('errors_24h')) || 0,
    total_assets: content.length,
    verified_assets: content.filter((c: any) => c.verified === 'yes').length,
    pending_assets: content.filter((c: any) => c.verified === 'pending').length,
    active_keys: keys.filter((k: any) => k.status === 'active').length,
    total_keys: keys.length,
    team_members: team.length,
    plan: sv('current_plan'),
    plan_used_today: Number(sv('plan_used_today')) || 0,
    plan_quota_daily: Number(sv('plan_quota_daily')) || 0,
  });
});

// ============================================================
// BLOG POSTS
// ============================================================
let blogStore: any[] = JSON.parse(JSON.stringify([
  { id:'blog-001', title:'Getting Started with LogoHub API', slug:'getting-started', content:'# Getting Started\n\nLogoHub API provides access to **50,000+** logos, brand icons, flags, and sports emblems.\n\n## Quick Start\n\n1. Sign up at [logohub.dev](https://logohub.dev)\n2. Get your API key from the dashboard\n3. Make your first request:\n\n```bash\ncurl https://api.logohub.dev/v1/logo/google\n```\n\nThat\'s it! You now have access to the world\'s largest visual identity API.', excerpt:'Learn how to get started with LogoHub API in under 5 minutes.', category:'API Updates', tags:['api','getting-started','tutorial'], cover_url:'', status:'published', author:'LogoHub Team', published_at:'2026-06-20T10:00:00Z', created_at:'2026-06-20T10:00:00Z', updated_at:'2026-06-20T10:00:00Z' },
  { id:'blog-002', title:'10 Creative Uses for the LogoHub API', slug:'creative-uses', content:'# 10 Creative Uses for LogoHub API\n\nHere are some creative ways developers are using LogoHub:\n\n1. **Dynamic branding** - Auto-switch logos based on client preferences\n2. **Design tools** - Integrate logos into Canva-style editors\n3. **Marketplace widgets** - Show brand logos on product pages\n4. **Sports dashboards** - Display team crests in live score apps\n5. **Country selectors** - Flag pickers for forms\n6. **Crypto trackers** - Coin logos in portfolio apps\n7. **Framework badges** - Show tech stack on portfolio sites\n8. **Analytics dashboards** - Brand recognition reports\n9. **Slack bots** - Fetch logos on demand\n10. **Email signatures** - Dynamic company logos', excerpt:'Discover 10 creative ways to integrate LogoHub API into your projects.', category:'Tutorials', tags:['api','use-cases','tutorial'], cover_url:'', status:'published', author:'Zana Acessórios', published_at:'2026-06-25T14:00:00Z', created_at:'2026-06-25T14:00:00Z', updated_at:'2026-06-25T14:00:00Z' },
]));

const faqStore: any[] = JSON.parse(JSON.stringify([
  { id:'faq-001', question:'How do I get an API key?', answer:'Sign up for a free account at [logohub.dev](https://logohub.dev/register). Once registered, go to your dashboard and navigate to **API Keys**. Click **Create Key**, give it a name, and copy your key. The free plan gives you 1,000 requests per day.', category:'Getting Started', tags:['api-key','getting-started'], status:'published', created_at:'2026-06-20T10:00:00Z', updated_at:'2026-06-20T10:00:00Z' },
  { id:'faq-002', question:'What image formats are available?', answer:'We provide assets in **6 formats**: SVG (vector), PNG (raster), WebP (modern), JPG, ICO, and AVIF. SVG is preferred for scalability. All formats are available through our CDN at `https://logohub.dev/cdn/`.', category:'Logos & Assets', tags:['formats','svg','png'], status:'published', created_at:'2026-06-20T10:00:00Z', updated_at:'2026-06-20T10:00:00Z' },
  { id:'faq-003', question:'Is there a rate limit?', answer:'Yes. The **Free plan** allows 1,000 requests/day (10/min). **Pro** increases to 100K/day (100/min), **Business** to 1M/day (500/min), and **Enterprise** has unlimited requests with custom rate limits. Rate limit headers are included in every response.', category:'Pricing & Plans', tags:['rate-limit','pricing','plans'], status:'published', created_at:'2026-06-20T10:00:00Z', updated_at:'2026-06-20T10:00:00Z' },
  { id:'faq-004', question:'How do I search for logos?', answer:'Use the `/api/v1/search?q=your-query` endpoint. It supports fuzzy search, aliases, and typo correction. Example: `GET /api/v1/search?q=googl` will find Google. You can also filter by type: `?type=logo`, `?type=sports`, or `?type=flags`.', category:'Technical', tags:['search','api','endpoint'], status:'published', created_at:'2026-06-20T10:00:00Z', updated_at:'2026-06-20T10:00:00Z' },
  { id:'faq-005', question:'Can I use LogoHub API in commercial projects?', answer:'**Yes!** All plans allow commercial use. The Free plan is suitable for prototyping and small projects. For production applications with higher traffic, we recommend the Pro or Business plan. Enterprise includes custom licensing if needed.', category:'Pricing & Plans', tags:['commercial','licensing','plans'], status:'published', created_at:'2026-06-20T10:00:00Z', updated_at:'2026-06-20T10:00:00Z' },
  { id:'faq-006', question:'How do I get support?', answer:'We offer email support for all plans. **Pro** plans get priority email support (response within 24h). **Business** plans include priority support with 4h response time. **Enterprise** includes 24/7 dedicated support. You can also browse our [documentation](/docs) and [FAQ](/faq).', category:'Account & Billing', tags:['support','help','contact'], status:'published', created_at:'2026-06-20T10:00:00Z', updated_at:'2026-06-20T10:00:00Z' },
]));

const supportStore: any[] = JSON.parse(JSON.stringify([
  { id:'ticket-001', subject:'I need a custom logo pack for my SaaS', description:'Hi, I am building a SaaS analytics dashboard and need a curated pack of 200+ tech company logos in SVG format. What would be the best plan for bulk access?', name:'Carlos Silva', email:'carlos@example.com', priority:'medium', status:'open', notes:'', created_at:'2026-06-26T09:30:00Z', updated_at:'2026-06-26T09:30:00Z' },
  { id:'ticket-002', subject:'API key not working in production', description:'My API key lh_live_xxx works fine locally but returns 401 in my Vercel deployment. I have checked the environment variables and they are set correctly. The key is active in the dashboard.', name:'Maria Santos', email:'maria@example.com', priority:'high', status:'in_progress', notes:'Checked — key is active. Asked user to verify the exact key value in Vercel env vars (no extra spaces).', created_at:'2026-06-26T14:00:00Z', updated_at:'2026-06-26T15:00:00Z' },
]));

// Blog CRUD
admin.get('/blog', (c) => {
  const status = c.req.query('status') || '';
  let items = blogStore;
  if (status) items = items.filter(p => p.status === status);
  return ok(c, items, { total: items.length });
});
admin.get('/blog/:idOrSlug', (c) => {
  const idOrSlug = c.req.param('idOrSlug');
  const item = blogStore.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  return item ? ok(c, item) : bad(c, 'Post not found', 404);
});
admin.post('/blog', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.title) return bad(c, 'title is required');
  const post = {
    id: 'blog-' + Date.now(),
    ...body,
    slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: body.status === 'published' ? new Date().toISOString() : null,
  };
  blogStore.unshift(post);
  await createNotification({ type:'info', title:'New blog post', message:`"${post.title}" has been ${body.status==='published'?'published':'saved as draft'}.`, role:'admin', link:'/dashboard/blog' });
  return c.json({ data: post, meta: { version:'admin-v1' } }, 201);
});
admin.patch('/blog/:id', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const idx = blogStore.findIndex(p => p.id === c.req.param('id'));
  if (idx === -1) return bad(c, 'Post not found', 404);
  blogStore[idx] = {
    ...blogStore[idx],
    ...body,
    updated_at: new Date().toISOString(),
    published_at: body.status === 'published' && !blogStore[idx].published_at ? new Date().toISOString() : blogStore[idx].published_at,
  };
  return ok(c, blogStore[idx]);
});
admin.delete('/blog/:id', (c) => {
  const idx = blogStore.findIndex(p => p.id === c.req.param('id'));
  if (idx === -1) return bad(c, 'Post not found', 404);
  const [deleted] = blogStore.splice(idx, 1);
  return ok(c, { deleted: true, id: deleted.id });
});

// FAQ CRUD
admin.get('/faq', (c) => {
  const status = c.req.query('status') || '';
  let items = faqStore;
  if (status) items = items.filter(f => f.status === status);
  return ok(c, items, { total: items.length });
});
admin.get('/faq/:id', (c) => {
  const item = faqStore.find(f => f.id === c.req.param('id'));
  return item ? ok(c, item) : bad(c, 'FAQ not found', 404);
});
admin.post('/faq', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.question || !body.answer) return bad(c, 'question and answer are required');
  const faq = {
    id: 'faq-' + Date.now(),
    ...body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  faqStore.unshift(faq);
  await createNotification({ type:'info', title:'New FAQ added', message:`"${faq.question}"`, role:'admin', link:'/dashboard/faq' });
  return c.json({ data: faq, meta: { version:'admin-v1' } }, 201);
});
admin.patch('/faq/:id', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const idx = faqStore.findIndex(f => f.id === c.req.param('id'));
  if (idx === -1) return bad(c, 'FAQ not found', 404);
  faqStore[idx] = { ...faqStore[idx], ...body, updated_at: new Date().toISOString() };
  return ok(c, faqStore[idx]);
});
admin.delete('/faq/:id', (c) => {
  const idx = faqStore.findIndex(f => f.id === c.req.param('id'));
  if (idx === -1) return bad(c, 'FAQ not found', 404);
  const [deleted] = faqStore.splice(idx, 1);
  return ok(c, { deleted: true, id: deleted.id });
});

// Support Tickets CRUD
admin.get('/support', (c) => {
  const status = c.req.query('status') || '';
  const priority = c.req.query('priority') || '';
  let items = supportStore;
  if (status) items = items.filter(t => t.status === status);
  if (priority) items = items.filter(t => t.priority === priority);
  return ok(c, items, { total: items.length });
});
admin.get('/support/:id', (c) => {
  const item = supportStore.find(t => t.id === c.req.param('id'));
  return item ? ok(c, item) : bad(c, 'Ticket not found', 404);
});
admin.post('/support', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  if (!body.subject) return bad(c, 'subject is required');
  const ticket = {
    id: 'ticket-' + Date.now(),
    ...body,
    status: body.status || 'open',
    priority: body.priority || 'medium',
    notes: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  supportStore.unshift(ticket);
  await createNotification({ type:'warning', title:'New support ticket', message:`"${ticket.subject}" — ${ticket.priority} priority`, role:'admin', link:'/dashboard/support' });
  return c.json({ data: ticket, meta: { version:'admin-v1' } }, 201);
});
admin.patch('/support/:id', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const idx = supportStore.findIndex(t => t.id === c.req.param('id'));
  if (idx === -1) return bad(c, 'Ticket not found', 404);
  supportStore[idx] = { ...supportStore[idx], ...body, updated_at: new Date().toISOString() };
  if (body.status === 'resolved') {
    await createNotification({ type:'success', title:'Ticket resolved', message:`"${supportStore[idx].subject}"`, role:'admin', link:'/dashboard/support' });
  }
  return ok(c, supportStore[idx]);
});
admin.delete('/support/:id', (c) => {
  const idx = supportStore.findIndex(t => t.id === c.req.param('id'));
  if (idx === -1) return bad(c, 'Ticket not found', 404);
  const [deleted] = supportStore.splice(idx, 1);
  return ok(c, { deleted: true, id: deleted.id });
});

export default admin;
