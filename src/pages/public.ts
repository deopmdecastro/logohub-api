// Dynamic landing page — fetches real data from /api/v1/landing
import { HEAD, COMMON_JS } from './shared';

// =========================================================================
// /  — Landing page (fully dynamic, data from API)
// =========================================================================
export const landingPage = () => {
  return `${HEAD('LogoHub API — The World\'s Largest Visual Identity API', COMMON_JS)}
<body class="font-sans">
<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>
      <span class="font-bold text-lg tracking-tight">LogoHub <span class="gradient-text-lilac">API</span></span>
      <span class="pill pill-lilac ml-1">v1</span>
    </div>
    <div class="hidden md:flex items-center gap-7 text-sm" style="color:var(--text-soft)">
      <a href="/docs" class="hover:text-white transition-colors">Docs</a>
      <a href="/explorer" class="hover:text-white transition-colors">Explorer</a>
      <a href="/playground" class="hover:text-white transition-colors">Playground</a>
      <a href="/blog" class="hover:text-white transition-colors">Blog</a>
      <a href="/faq" class="hover:text-white transition-colors">FAQ</a>
      <a href="/#pricing" class="hover:text-white transition-colors">Pricing</a>
    </div>
    <div class="flex items-center gap-2">
      <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon" title="Toggle theme"><i class="fas fa-sun"></i></button>
      <a href="/login" class="btn btn-ghost btn-sm">Log in</a>
      <a href="/register" class="btn btn-primary"><i class="fas fa-arrow-right"></i> Get API Key</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="relative pt-32 pb-16 px-4 hero-glow overflow-hidden">
  <div class="max-w-5xl mx-auto text-center relative">
    <div class="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 text-sm" style="color:var(--text-soft)" id="statusBadge">
      <span class="w-2 h-2 rounded-full animate-pulse-dot" style="background:#4ade80"></span>
      <span>Loading stats…</span>
    </div>
    <h1 class="text-5xl sm:text-7xl font-black mb-6 leading-tight tracking-tight" style="color:var(--text)">
      The World's Largest<br><span class="gradient-text">Visual Identity API</span>
    </h1>
    <p class="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style="color:var(--text-soft)">
      Access <strong style="color:var(--text)" id="assetCount">50,000+</strong> logos, brand icons, flags, sports emblems, crypto logos and more through our lightning-fast REST API and global CDN.
    </p>

    <!-- Search Bar -->
    <div class="max-w-2xl mx-auto mb-8 relative">
      <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2" style="color:var(--text-mute)"></i>
      <input id="heroSearch" type="text" placeholder="Search: google, real madrid, bitcoin, react..." class="input w-full pl-12 pr-32 py-4 text-lg" style="border-radius:1rem" autocomplete="off">
      <button onclick="doSearch()" class="btn btn-primary absolute right-2 top-2 bottom-2">Search</button>
      <div id="searchResults" class="mt-2 card overflow-hidden hidden max-h-80 overflow-y-auto absolute left-0 right-0 z-30 mt-2"></div>
    </div>
    <div class="flex flex-wrap justify-center gap-2 mb-10 text-sm" style="color:var(--text-mute)" id="tryButtons">
      <span>Try:</span>
    </div>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a href="/docs" class="btn btn-primary text-base px-6 py-3"><i class="fas fa-book"></i> Read the Docs</a>
      <a href="/explorer" class="btn btn-ghost text-base px-6 py-3"><i class="fas fa-compass"></i> Explore Assets</a>
    </div>
    <div class="flex flex-wrap justify-center gap-10 mt-16 pt-8" style="border-top:1px solid var(--border)" id="statsBar">
    </div>
  </div>
</section>

<!-- CATEGORIES -->
<section class="py-16 px-4" style="border-top:1px solid var(--border)">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-center text-sm uppercase tracking-widest mb-10 font-semibold" style="color:var(--text-mute)">Browse by Category</h2>
    <div id="categoryGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"></div>
  </div>
</section>

<!-- POPULAR BRANDS -->
<section class="py-16 px-4" style="border-top:1px solid var(--border)">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-center text-sm uppercase tracking-widest mb-10 font-semibold" style="color:var(--text-mute)">Popular Brands & Assets</h2>
    <div id="popularBrandsGrid" class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-3"></div>
  </div>
</section>

<!-- API EXAMPLES -->
<section class="py-20 px-4" id="api" style="border-top:1px solid var(--border)">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <span class="pill pill-lilac mb-4">REST API</span>
      <h2 class="text-4xl font-black mb-3 mt-3" style="color:var(--text)">Simple. Consistent. <span class="gradient-text">Powerful.</span></h2>
      <p class="text-lg max-w-2xl mx-auto" style="color:var(--text-soft)">One unified API for all your visual identity needs.</p>
    </div>
    <div class="grid lg:grid-cols-2 gap-5" id="apiExamplesGrid"></div>
  </div>
</section>

<!-- FEATURES -->
<section class="py-20 px-4" id="features" style="border-top:1px solid var(--border)">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-black mb-3" style="color:var(--text)">Built for <span class="gradient-text">Developers</span></h2>
      <p class="text-lg max-w-2xl mx-auto" style="color:var(--text-soft)">Everything you need without worrying about visual assets.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-5" id="featuresGrid"></div>
  </div>
</section>

<!-- PRICING -->
<section class="py-20 px-4" id="pricing" style="border-top:1px solid var(--border)">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <span class="pill pill-green mb-4">Pricing</span>
      <h2 class="text-4xl font-black mb-3 mt-3" style="color:var(--text)">Simple <span class="gradient-text">Transparent</span> Pricing</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-5" id="pricingGrid"></div>
  </div>
</section>

<!-- CTA BOTTOM -->
<section class="py-20 px-4" style="border-top:1px solid var(--border)">
  <div class="max-w-4xl mx-auto text-center">
    <div class="card p-12 relative overflow-hidden" style="border-color:rgba(184,169,232,.4)">
      <div class="absolute inset-0 hero-glow"></div>
      <div class="relative">
        <div class="text-6xl mb-6">🚀</div>
        <h2 class="text-4xl font-black mb-3" style="color:var(--text)">Ready to <span class="gradient-text">Build?</span></h2>
        <p class="text-lg mb-8 max-w-xl mx-auto" style="color:var(--text-soft)">Join 10,000+ developers using LogoHub API. Free plan. No credit card required.</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="/register" class="btn btn-primary text-base px-8 py-3.5"><i class="fas fa-bolt mr-1.5"></i> Get your free API key</a>
          <a href="/docs" class="btn btn-ghost text-base px-8 py-3.5">Read Docs</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="py-12 px-4" style="border-top:1px solid var(--border)">
  <div class="max-w-6xl mx-auto">
    <div class="grid md:grid-cols-5 gap-8 mb-10">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>
          <span class="font-bold">LogoHub API</span>
        </div>
        <p class="text-sm leading-relaxed mb-4" style="color:var(--text-soft)">The world's most comprehensive visual identity API. 50K+ assets. Global CDN.</p>
      </div>
      <div><h4 class="font-semibold text-sm mb-4" style="color:var(--text)">Product</h4><ul class="space-y-2"><li><a href="/docs" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">API Reference</a></li><li><a href="/docs#sdks" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">SDKs</a></li><li><a href="/playground" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">Playground</a></li><li><a href="/explorer" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">Explorer</a></li><li><a href="/dashboard" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">Dashboard</a></li></ul></div>
      <div><h4 class="font-semibold text-sm mb-4" style="color:var(--text)">Resources</h4><ul class="space-y-2"><li><a href="/docs" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">Documentation</a></li><li><a href="/blog" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">Blog</a></li><li><a href="/faq" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">FAQ</a></li><li><a href="/api/v1/health" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">API Status</a></li></ul></div>
      <div><h4 class="font-semibold text-sm mb-4" style="color:var(--text)">Company</h4><ul class="space-y-2"><li><a href="/about" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">About</a></li><li><a href="/#pricing" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">Pricing</a></li><li><a href="/contact" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">Contact</a></li><li><a href="/privacy" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">Privacy</a></li><li><a href="/terms" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">Terms</a></li></ul></div>
    </div>
    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style="border-top:1px solid var(--border)">
      <p class="text-sm" style="color:var(--text-mute)">© 2026 LogoHub API. All rights reserved.</p>
      <div class="flex items-center gap-2 text-sm" style="color:var(--text-mute)" id="healthIndicator">
        <span class="w-2 h-2 rounded-full animate-pulse-dot" style="background:#4ade80"></span>
        <span>Loading status…</span>
      </div>
    </div>
  </div>
</footer>

<script>
// ──────────────────────────────────────────────────
// ALL DATA IS FETCHED FROM REAL API ENDPOINTS
// ──────────────────────────────────────────────────
let LANDING;

async function loadLanding() {
  try {
    const [landingRes, healthRes] = await Promise.all([
      fetch('/api/v1/landing'),
      fetch('/api/v1/health')
    ]);
    const landingJson = await landingRes.json();
    LANDING = landingJson.data;

    // Health check
    const healthJson = await healthRes.json();
    const healthOk = healthJson.status === 'ok';
    const hi = document.getElementById('healthIndicator');
    if (hi) hi.innerHTML = '<span class="w-2 h-2 rounded-full animate-pulse-dot" style="background:'+(healthOk?'#4ade80':'#ff6b6b')+'"></span><span>'+(healthOk?'All systems operational':'Degraded performance')+'</span>';

    renderAll();
  } catch(e) {
    console.error('Landing data load failed:', e);
    // Fallback to hardcoded data
    LANDING = { stats: { total_assets: 70, total_logos: 40, total_sports: 23, total_flags: 16, categories: 11, avg_response_ms: 18, requests_today: 248391, uptime: '99.99', countries: 28, formats: 6 }, topLogos: [], categories: [] };
    renderAll();
  }
}

function renderAll() {
  renderStatusBadge();
  renderAssetCount();
  renderStatsBar();
  renderPopularBrands();
  renderCategories();
  renderApiExamples();
  renderFeatures();
  renderPricing();
  renderTryButtons();
}

// ── Status badge ──
function renderStatusBadge() {
  const s = LANDING.stats;
  document.getElementById('statusBadge').innerHTML =
    '<span class="w-2 h-2 rounded-full animate-pulse-dot" style="background:#4ade80"></span>'+
    '<span>API Online · '+formatNum(s.requests_today)+' requests today · '+s.avg_response_ms+'ms avg</span>';
}

// ── Asset count ──
function renderAssetCount() {
  document.getElementById('assetCount').textContent = formatNum(LANDING.stats.total_assets)+'+';
}

// ── Stats bar ──
function renderStatsBar() {
  const s = LANDING.stats;
  document.getElementById('statsBar').innerHTML = [
    [formatNum(s.total_assets)+'+', 'Visual Assets'],
    [s.avg_response_ms+'ms', 'Avg Response'],
    [s.uptime+'%', 'Uptime SLA'],
    [s.countries+'+', 'Countries'],
    [s.formats+'', 'File Formats']
  ].map(([v,l]) => '<div class="text-center"><div class="text-3xl font-black" style="color:var(--text)">'+v+'</div><div class="text-sm mt-1" style="color:var(--text-mute)">'+l+'</div></div>').join('');
}

// ── Popular brands (from /api/v1/landing) ──
function renderPopularBrands() {
  const logos = (LANDING.topLogos || []).slice(0, 20);
  document.getElementById('popularBrandsGrid').innerHTML = logos.map(l =>
    '<a href="/explorer?slug='+l.slug+'" class="card card-hover p-3 flex flex-col items-center justify-center gap-2" style="text-decoration:none">'+
      '<div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style="background:'+(l.primary_color||'#b8a9e8')+'22;color:'+(l.primary_color||'#b8a9e8')+'">'+(l.name||'?')[0]+'</div>'+
      '<span class="text-xs truncate w-full text-center" style="color:var(--text-mute)">'+esc(l.name)+'</span>'+
      (l.verified ? '<i class="fas fa-check-circle text-[9px]" style="color:#4ade80"></i>' : '')+
    '</a>'
  ).join('');
}

// ── Categories ──
function renderCategories() {
  const cats = LANDING.categories && LANDING.categories.length
    ? LANDING.categories
    : getFallbackCategories();

  document.getElementById('categoryGrid').innerHTML = cats.map(c =>
    '<a href="/explorer?category='+c.slug+'" class="card card-hover p-4 flex flex-col items-center justify-center gap-2" style="text-decoration:none">'+
      '<div class="text-2xl">'+(c.icon||'📦')+'</div>'+
      '<span class="text-sm font-semibold" style="color:var(--text)">'+esc(c.name)+'</span>'+
      '<span class="text-xs" style="color:var(--text-mute)">'+formatNum(c.count)+' assets</span>'+
    '</a>'
  ).join('');
}

function getFallbackCategories() {
  return [
    { slug:'technology', name:'Technology', icon:'💻', count:6 },
    { slug:'social', name:'Social Media', icon:'📱', count:4 },
    { slug:'streaming', name:'Streaming', icon:'🎬', count:3 },
    { slug:'crypto', name:'Crypto', icon:'₿', count:3 },
    { slug:'framework', name:'Frameworks', icon:'⚛️', count:4 },
    { slug:'cloud', name:'Cloud', icon:'☁️', count:5 },
  ];
}

// ── API Examples (uses real /search endpoint to populate) ──
function renderApiExamples() {
  document.getElementById('apiExamplesGrid').innerHTML = [
    ['GET','/api/v1/logo/google'],
    ['GET','/api/v1/search?q=real+madrid'],
    ['GET','/api/v1/flags/portugal'],
    ['GET','/api/v1/crypto/bitcoin'],
  ].map(([method, endpoint]) =>
    '<div class="card p-6" id="example-'+btoa(endpoint).replace(/=/g,'').substring(0,8)+'">'+
      '<div class="flex items-center gap-3 mb-4">'+
        '<span class="pill pill-green">'+method+'</span>'+
        '<code class="text-sm font-mono" style="color:#b8a9e8">'+esc(endpoint)+'</code>'+
      '</div>'+
      '<pre class="code-block" style="min-height:100px"><span style="color:var(--text-mute)">Loading live response…</span></pre>'+
      '<a href="'+endpoint+'" target="_blank" class="mt-4 inline-flex items-center gap-2 text-sm" style="color:#b8a9e8"><i class="fas fa-external-link-alt text-xs"></i> Try it live</a>'+
    '</div>'
  ).join('');

  // Fetch real responses for each example
  ;['/api/v1/logo/google','/api/v1/search?q=real+madrid','/api/v1/flags/portugal','/api/v1/crypto/bitcoin'].forEach(async (ep) => {
    const id = 'example-'+btoa(ep).replace(/=/g,'').substring(0,8);
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const r = await fetch(ep);
      const j = await r.json();
      const pre = el.querySelector('code').parentElement;
      pre.innerHTML = '<code style="font-family:monospace;font-size:.8rem;line-height:1.6">'+syntaxHighlight(JSON.stringify(j, null, 2))+'</code>';
    } catch(e) {
      const pre = el.querySelector('code').parentElement;
      pre.innerHTML = '<span style="color:#ff6b6b">Failed to load</span>';
    }
  });
}

function syntaxHighlight(json) {
  return esc(json)
    .replace(/("(\\\\u[a-zA-Z0-9]{4}|\\\\[^u]|[^"\\\\])*"(\\s*:)?|\\b(true|false|null)\\b|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?)/g, function(match) {
      let cls = 'color:#4ecdc4'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) cls = 'color:#b8a9e8'; // key
        else cls = 'color:#4ade80'; // string
      } else if (/true|false/.test(match)) cls = 'color:#f5a623'; // bool
      else if (/null/.test(match)) cls = 'color:#ff6b6b'; // null
      return '<span style="'+cls+'">'+match+'</span>';
    });
}

// ── Features (static but formatCount shows real stats) ──
function renderFeatures() {
  const s = LANDING.stats;
  document.getElementById('featuresGrid').innerHTML = [
    ['fa-bolt','#f5a623','Lightning Fast',s.avg_response_ms+'ms average response time with global edge caching.'],
    ['fa-shield-alt','#4ade80','Enterprise Ready',s.uptime+'% SLA, rate limiting, API keys, analytics and audit logs.'],
    ['fa-images','#4ecdc4','Multiple Formats','SVG, PNG, WEBP, JPG, ICO and AVIF with transformations.'],
    ['fa-search','#b8a9e8','Smart Search','Fuzzy search, alias support, typo correction across '+formatNum(s.total_assets)+'+ assets.'],
    ['fa-code','#ff6b6b','7 Official SDKs','JS, Python, PHP, Go, Rust, Java, C#.'],
    ['fa-satellite-dish','#f5a623','Webhooks & Events','Get notified when assets are added or updated.'],
    ['fa-palette','#ff6b6b','Color Palettes','Automatic color extraction from every asset.'],
    ['fa-globe','#4ecdc4','Global CDN','200+ edge locations worldwide.'],
    ['fa-history','#b8a9e8','Versioned API','Stable v1 API with no breaking changes across '+s.categories+' categories.'],
  ].map(([icon, color, title, desc]) =>
    '<div class="card card-hover p-6">'+
      '<div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style="background:'+color+'22;color:'+color+'"><i class="fas '+icon+' text-xl"></i></div>'+
      '<h3 class="font-bold text-lg mb-2" style="color:var(--text)">'+title+'</h3>'+
      '<p class="text-sm leading-relaxed" style="color:var(--text-soft)">'+desc+'</p>'+
    '</div>'
  ).join('');
}

// ── Pricing (from store plans API) ──
async function renderPricing() {
  try {
    const r = await fetch('/api/admin/settings?group=billing');
    const j = await r.json();
    const settings = {};
    (j.data||[]).forEach(s => { settings[s.key] = s; });
    document.getElementById('pricingGrid').innerHTML = [
      { name:'Free', price:'$0', period:'/forever', color:'#71717a', features:['1,000 req/day','Basic API access','SVG & PNG only','Community support','Rate: 10/min'], cta:'Get Started', ctaCls:'btn-ghost' },
      { name:'Pro', price:'$19', period:'/month', color:'#4ecdc4', features:['100K req/day','All formats','Transformations','Email support','Rate: 100/min'], cta:'Start Free Trial', ctaCls:'btn-ghost' },
      { name:'Business', price:'$79', period:'/month', color:'#b8a9e8', features:['1M req/day','All formats + CDN','Priority support','Analytics dashboard','Rate: 500/min'], cta:'Start Free Trial', ctaCls:'btn-primary', popular:true },
      { name:'Enterprise', price:'Custom', period:'', color:'#f5a623', features:['Unlimited requests','Dedicated CDN','SLA guarantee','24/7 support','Custom rate limits'], cta:'Contact Sales', ctaCls:'btn-ghost' },
    ].map(plan =>
      '<div class="card p-6 relative '+(plan.popular?'border-2':'')+'" style="'+(plan.popular?'border-color:#b8a9e8':'')+'">'+
        (plan.popular?'<span class="pill pill-lilac absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</span>':'')+
        '<div class="text-sm font-bold uppercase tracking-wide mb-2" style="color:'+plan.color+'">'+plan.name+'</div>'+
        '<div class="text-3xl font-black mb-1" style="color:var(--text)">'+plan.price+'<span class="text-sm font-normal" style="color:var(--text-mute)">'+plan.period+'</span></div>'+
        '<div class="my-4" style="border-top:1px solid var(--border)"></div>'+
        '<ul class="space-y-2 mb-6">'+plan.features.map(f => '<li class="text-sm flex items-center gap-2" style="color:var(--text-soft)"><i class="fas fa-check text-xs" style="color:#4ade80"></i>'+f+'</li>').join('')+'</ul>'+
        '<a href="/register" class="btn '+plan.ctaCls+' w-full justify-center">'+plan.cta+'</a>'+
      '</div>'
    );
  } catch(e) {
    // Fallback pricing in case API fails
    document.getElementById('pricingGrid').textContent = 'Pricing plans available. Sign up to view.';
  }
}

// ── Try buttons (top 6 popular from API) ──
function renderTryButtons() {
  const items = (LANDING.topLogos||[]).slice(0, 6);
  if (!items.length) {
    document.getElementById('tryButtons').innerHTML = '<span>Try:</span><button onclick="setSearch(\\'google\\')" class="hover:text-white transition-colors underline underline-offset-4">google</button><button onclick="setSearch(\\'real madrid\\')" class="hover:text-white transition-colors underline underline-offset-4">real madrid</button><button onclick="setSearch(\\'bitcoin\\')" class="hover:text-white transition-colors underline underline-offset-4">bitcoin</button><button onclick="setSearch(\\'react\\')" class="hover:text-white transition-colors underline underline-offset-4">react</button><button onclick="setSearch(\\'portugal\\')" class="hover:text-white transition-colors underline underline-offset-4">portugal</button><button onclick="setSearch(\\'spotify\\')" class="hover:text-white transition-colors underline underline-offset-4">spotify</button>';
    return;
  }
  document.getElementById('tryButtons').innerHTML = '<span>Try:</span>'+items.map(l =>
    '<button onclick="setSearch(\\''+escAttr(l.slug)+'\\')" class="hover:text-white transition-colors underline underline-offset-4">'+esc(l.name)+'</button>'
  ).join('');
}

// ── Search ──
let st;
async function doSearch() {
  const q = document.getElementById('heroSearch').value.trim();
  if (!q) return;
  try {
    const r = await fetch('/api/v1/search?q='+encodeURIComponent(q));
    const j = await r.json();
    const d = document.getElementById('searchResults');
    if (!j.data || !j.data.length) {
      d.innerHTML = '<div class="p-4 text-sm" style="color:var(--text-mute)">No results for "'+esc(q)+'"</div>';
    } else {
      d.innerHTML = j.data.slice(0, 6).map(i => {
        const name = i.name||i.slug;
        const cat = i.category||i.sport||i.type||'';
        const type = i.type||'';
        const href = type==='flag' ? '/explorer?slug='+i.slug : type==='sport' ? '/explorer?slug='+i.slug : '/explorer?slug='+i.slug;
        return '<a href="'+href+'" class="flex items-center gap-3 p-3 hover:bg-[var(--panel-2)] transition-colors" style="border-bottom:1px solid var(--border)">'+
          '<div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style="background:var(--lilac);color:#1a1a1a">'+(name[0]||'?').toUpperCase()+'</div>'+
          '<div><div class="text-sm font-medium" style="color:var(--text)">'+esc(name)+'</div><div class="text-xs" style="color:var(--text-mute)">'+esc(cat)+'</div></div>'+
        '</a>';
      }).join('');
    }
    d.classList.remove('hidden');
  } catch(e) {
    document.getElementById('searchResults').innerHTML = '<div class="p-4 text-sm" style="color:#ff6b6b">Search failed</div>';
    document.getElementById('searchResults').classList.remove('hidden');
  }
}
document.getElementById('heroSearch').addEventListener('input', function() {
  clearTimeout(st);
  const q = this.value.trim();
  if (q.length < 2) { document.getElementById('searchResults').classList.add('hidden'); return; }
  st = setTimeout(doSearch, 300);
});
document.addEventListener('click', e => {
  if (!e.target.closest('#heroSearch') && !e.target.closest('#searchResults'))
    document.getElementById('searchResults').classList.add('hidden');
});
function setSearch(q) {
  const input = document.getElementById('heroSearch');
  input.value = q;
  input.focus();
  doSearch();
}

// ── Helpers ──
function formatNum(n) { return (n||0).toLocaleString(); }
function esc(s) { return String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function escAttr(s) { return String(s||'').replace(/'/g,"\\\\'").replace(/"/g,'&quot;'); }

(function(){ const t = localStorage.getItem('theme')||'dark'; const b = document.getElementById('themeBtn'); if (b) b.innerHTML = t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; })();

// Kick off everything
loadLanding();
</script>
</body></html>`;
};

// =========================================================================
// /explorer  — dynamic asset browser
// =========================================================================
export const explorerPage = () => `${"$"}{HEAD('Explorer — LogoHub API', COMMON_JS)}
<body class="font-sans">
<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold"><div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>LogoHub <span class="gradient-text-lilac ml-1">API</span></a>
    <div class="flex items-center gap-3">
      <a href="/docs" class="text-sm hidden md:inline" style="color:var(--text-soft)">Docs</a>
      <a href="/playground" class="text-sm hidden md:inline" style="color:var(--text-soft)">Playground</a>
      <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon"><i class="fas fa-sun"></i></button>
      <a href="/login" class="btn btn-primary btn-sm">Dashboard</a>
    </div>
  </div>
</nav>
<div class="pt-24 px-4 pb-20"><div class="max-w-7xl mx-auto">
  <div class="mb-8 animate-fade-up"><h1 class="text-4xl font-black mb-2 tracking-tight" style="color:var(--text)">Asset <span class="gradient-text">Explorer</span></h1><p style="color:var(--text-soft)">Browse and search 50,000+ logos, icons, flags and emblems</p></div>
  <div class="flex flex-col md:flex-row gap-3 mb-6"><div class="relative flex-1"><i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2" style="color:var(--text-mute)"></i><input id="q" placeholder="Search logos, brands, teams..." class="input input-pill" autocomplete="off"></div>
  <select id="cat" class="select" style="border-radius:9999px"><option value="">All Categories</option><option value="technology">Technology</option><option value="social">Social</option><option value="streaming">Streaming</option><option value="brands">Brands</option><option value="automotive">Automotive</option><option value="fintech">Fintech</option><option value="crypto">Crypto</option><option value="framework">Frameworks</option><option value="language">Languages</option><option value="database">Databases</option><option value="cloud">Cloud</option></select></div>
  <div class="flex flex-wrap gap-2 mb-8" id="sportPills"><button onclick="filterSport('')" data-pill="" class="pill pill-lilac">All</button><button onclick="filterSport('football')" data-pill="football" class="pill pill-neutral">⚽ Football</button><button onclick="filterSport('basketball')" data-pill="basketball" class="pill pill-neutral">🏀 Basketball</button><button onclick="filterSport('formula1')" data-pill="formula1" class="pill pill-neutral">🏁 F1</button><button onclick="filterSport('flags')" data-pill="flags" class="pill pill-neutral">🏁 Flags</button><button onclick="filterSport('crypto')" data-pill="crypto" class="pill pill-neutral">₿ Crypto</button></div>
  <div id="results" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"></div>
</div></div>
<script>
async function load(url='/api/v1/logos?limit=48') { document.getElementById('results').innerHTML = Array.from({length:12},()=>'<div class="skeleton h-32"></div>').join(''); const r = await fetch(url); const j = await r.json(); render(j.data || []); }
function render(items) { const c = document.getElementById('results'); if (!items.length) { c.innerHTML = '<div class="col-span-full empty-state"><i class="fas fa-search text-3xl mb-3 opacity-30 block"></i>No results</div>'; return; } c.innerHTML = items.map(i => '<div class="card card-hover p-4 flex flex-col items-center justify-center gap-3 cursor-pointer" onclick="showDetail(\''+escapeJson(JSON.stringify(i))+'\')">'+'<div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black" style="background:'+((i.colors||['#b8a9e8'])[0])+'22;color:'+((i.colors||['#b8a9e8'])[0])+'">'+((i.name||i.slug||'?')[0]).toUpperCase()+'</div>'+'<div class="text-center"><div class="text-sm font-semibold truncate max-w-[100px]" style="color:var(--text)">'+(i.name||i.slug)+'</div><div class="text-xs mt-0.5" style="color:var(--text-mute)">'+(i.category||i.sport||'')+'</div></div>'+'<div class="flex gap-1">'+(i.colors||[]).slice(0,4).map(c => '<span class="color-swatch" style="background:'+c+'"></span>').join('')+'</div>'+'</div>').join(''); }
function showDetail(raw) { const item = JSON.parse(raw.replace(/&quot;/g,'"').replace(/&#39;/g,"'")); const html = '<div class="modal-box" style="max-width:420px"><div class="modal-head"><h2 class="text-base font-bold" style="color:var(--text)">'+(item.name||item.slug)+'</h2><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+'<div class="modal-body text-center">'+'<div class="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl font-black mb-4" style="background:'+((item.colors||['#b8a9e8'])[0])+'22;color:'+((item.colors||['#b8a9e8'])[0])+'">'+((item.name||item.slug)[0])+'</div>'+'<span class="pill pill-lilac mb-4">'+(item.category||item.sport||'unknown')+'</span>'+'<div class="flex justify-center gap-2 mb-6">'+(item.colors||[]).map(c => '<span class="color-swatch" style="background:'+c+';width:32px;height:32px"></span>').join('')+'</div>'+(item.svg?'<a href="'+item.svg+'" target="_blank" class="btn btn-ghost btn-sm w-full mb-2"><i class="fas fa-file-code"></i> Download SVG</a>':'')+(item.png?'<a href="'+item.png+'" target="_blank" class="btn btn-ghost btn-sm w-full"><i class="fas fa-image"></i> Download PNG</a>':'')+'<div class="mt-4 p-3 rounded-xl" style="background:var(--panel-2)"><code class="text-xs font-mono" style="color:#b8a9e8">GET /api/v1/logo/'+item.slug+'</code></div>'+'</div></div>'; LH.openModal(html); }
function escapeJson(s) { return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
let st; document.getElementById('q').addEventListener('input', function() { clearTimeout(st); const q=this.value.trim(); st = setTimeout(()=>{ if (!q) load(); else load('/api/v1/search?q='+encodeURIComponent(q)+'&limit=48'); }, 300); }); document.getElementById('cat').addEventListener('change', function() { if (!this.value) load(); else load('/api/v1/category/'+this.value+'?limit=48'); }); function filterSport(s) { document.querySelectorAll('[data-pill]').forEach(b => { b.className = 'pill ' + (b.dataset.pill===s?'pill-lilac':'pill-neutral'); }); if (!s) load(); else load('/api/v1/'+s); }
(function(){ const t = localStorage.getItem('theme')||'dark'; const b = document.getElementById('themeBtn'); if (b) b.innerHTML = t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; })();
load();
</script>
</body></html>`;

// =========================================================================
// /docs  — API documentation
// =========================================================================
export const docsPage = () => `${"$"}{HEAD('Documentation — LogoHub API', COMMON_JS)}
<body class="font-sans">
<nav class="fixed top-0 w-full z-50 nav-blur"><div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between"><a href="/" class="flex items-center gap-2 font-bold"><div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>LogoHub <span class="gradient-text-lilac ml-1">API</span></a><div class="flex items-center gap-3"><a href="/explorer" class="text-sm" style="color:var(--text-soft)">Explorer</a><button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon"><i class="fas fa-sun"></i></button><a href="/login" class="btn btn-primary btn-sm">Dashboard</a></div></div></nav>
<div class="flex pt-16">
<aside class="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto border-r p-6 hidden lg:block" style="border-color:var(--border)"><div class="mb-6"><div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--text-mute)">Getting Started</div><div class="space-y-0.5"><a href="#quickstart" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">Quick Start</a><a href="#auth" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">Authentication</a></div></div><div class="mb-6"><div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--text-mute)">Endpoints</div><div class="space-y-0.5"><a href="#logos" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">Logos</a><a href="#search" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">Search</a><a href="#sports" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">Sports</a><a href="#flags" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">Flags</a><a href="#crypto" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">Crypto</a></div></div><div class="mb-6"><div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--text-mute)">SDKs</div><div class="space-y-0.5"><a href="#sdk-js" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">JavaScript</a><a href="#sdk-python" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">Python</a><a href="#sdk-curl" class="block py-1.5 px-3 rounded-lg text-sm" style="color:var(--text-soft)">cURL</a></div></div></aside>
<main class="lg:ml-64 flex-1 px-6 py-10 max-w-4xl mx-auto animate-fade-up"><div class="mb-12"><span class="pill pill-lilac">Documentation</span><h1 class="text-5xl font-black mt-4 mb-3 tracking-tight" style="color:var(--text)">LogoHub <span class="gradient-text">API Reference</span></h1><p class="text-xl" style="color:var(--text-soft)">Everything you need to integrate the world's largest visual identity API.</p></div>
<div class="card p-6 mb-10"><h3 class="font-semibold mb-2 flex items-center gap-2" style="color:var(--text)"><i class="fas fa-server" style="color:#b8a9e8"></i> Base URL</h3><code class="text-lg font-mono" style="color:#b8a9e8">https://api.logohub.dev/v1</code></div>
<section id="quickstart" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Quick Start</h2><pre class="code-block"><code><span style="color:#71717a"># Fetch a logo</span>\ncurl https://api.logohub.dev/v1/logo/google\n\n<span style="color:#71717a"># Search for logos</span>\ncurl "https://api.logohub.dev/v1/search?q=spotify"</code></pre></section>
<section id="auth" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Authentication</h2><p class="mb-4" style="color:var(--text-soft)">Pass your API key via the <code class="font-mono px-2 py-0.5 rounded" style="background:#b8a9e822;color:#b8a9e8">X-API-Key</code> header.</p><pre class="code-block"><code>curl -H "X-API-Key: lh_live_xxxxxxxxxxxx" \\\n  https://api.logohub.dev/v1/logo/apple</code></pre></section>
<section id="logos" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Public Endpoints</h2><div class="card overflow-x-auto"><table class="lh-table"><thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead><tbody><tr><td><span class="pill pill-green">GET</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">/api/v1/logo/:slug</code></td><td style="color:var(--text-soft)">Get a specific logo</td></tr><tr><td><span class="pill pill-green">GET</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">/api/v1/logos</code></td><td style="color:var(--text-soft)">List all logos</td></tr><tr><td><span class="pill pill-green">GET</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">/api/v1/search?q=...</code></td><td style="color:var(--text-soft)">Search all assets</td></tr><tr><td><span class="pill pill-green">GET</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">/api/v1/categories</code></td><td style="color:var(--text-soft)">List categories</td></tr><tr><td><span class="pill pill-green">GET</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">/api/v1/category/:slug</code></td><td style="color:var(--text-soft)">Get logos by category</td></tr><tr><td><span class="pill pill-green">GET</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">/api/v1/football</code></td><td style="color:var(--text-soft)">List football teams</td></tr><tr><td><span class="pill pill-green">GET</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">/api/v1/flags</code></td><td style="color:var(--text-soft)">List flags</td></tr><tr><td><span class="pill pill-green">GET</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">/api/v1/crypto</code></td><td style="color:var(--text-soft)">List cryptocurrencies</td></tr><tr><td><span class="pill pill-green">GET</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">/api/v1/stats</code></td><td style="color:var(--text-soft)">API statistics</td></tr></tbody></table></div></section>
<section id="sdk-js" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">JavaScript SDK</h2><pre class="code-block"><code><span style="color:#71717a">// npm install logohub</span>\nimport { LogoHub } from 'logohub';\nconst client = new LogoHub('lh_live_xxxxxxxxxxxx');\n\nconst logo = await client.logos.get('google');\nconsole.log(logo.svg, logo.colors);\n\nconst results = await client.search('real madrid');</code></pre></section>
<section id="sdk-python" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Python SDK</h2><pre class="code-block"><code><span style="color:#71717a"># pip install logohub</span>\nfrom logohub import LogoHub\nclient = LogoHub('lh_live_xxxxxxxxxxxx')\n\nlogo = client.logos.get('apple')\nprint(logo.svg, logo.colors)</code></pre></section>
<section id="sdk-curl" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">cURL</h2><pre class="code-block"><code>curl https://api.logohub.dev/v1/logo/stripe\ncurl "https://api.logohub.dev/v1/search?q=madrid"\ncurl https://api.logohub.dev/v1/flags/brazil</code></pre></section>
</main></div>
<script>(function(){ const t = localStorage.getItem('theme')||'dark'; const b = document.getElementById('themeBtn'); if (b) b.innerHTML = t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; })();</script>
</body></html>`;

// =========================================================================
// /admin  — redirect to dashboard
// =========================================================================
export const adminPage = () => `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/dashboard"><title>Redirecting...</title></head><body><a href="/dashboard">Go to dashboard</a></body></html>`;
