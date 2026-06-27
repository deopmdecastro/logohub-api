import { HEAD, COMMON_JS } from './shared';
import { store } from '../data/store';

// =========================================================================
// /  — Landing page (modernised: cleaner, premium SaaS aesthetic, lilac brand)
// =========================================================================
export const landingPage = () => {
  const tagline = store.getSetting('platform_tagline')?.value || "The World's Largest Visual Identity API";
  return `${HEAD('LogoHub API — ' + tagline, COMMON_JS)}
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
      <a href="/#pricing" class="hover:text-white transition-colors">Pricing</a>
      <a href="/api/v1/stats" class="hover:text-white transition-colors">API</a>
    </div>
    <div class="flex items-center gap-2">
      <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon" title="Toggle theme"><i class="fas fa-sun"></i></button>
      <a href="/dashboard" class="btn btn-primary"><i class="fas fa-arrow-right"></i> Get API Key</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="relative pt-32 pb-16 px-4 hero-glow overflow-hidden">
  <div class="max-w-5xl mx-auto text-center relative">
    <div class="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 text-sm" style="color:var(--text-soft)">
      <span class="w-2 h-2 rounded-full animate-pulse-dot" style="background:#4ade80"></span>
      <span>API Online · 248K+ requests today · 18ms avg</span>
    </div>
    <h1 class="text-5xl sm:text-7xl font-black mb-6 leading-tight tracking-tight" style="color:var(--text)">
      The World's Largest<br><span class="gradient-text">Visual Identity API</span>
    </h1>
    <p class="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style="color:var(--text-soft)">
      Access <strong style="color:var(--text)">50,000+</strong> logos, brand icons, flags, sports emblems, crypto logos and more through our lightning-fast REST API and global CDN.
    </p>

    <!-- Search Bar -->
    <div class="max-w-2xl mx-auto mb-8 relative">
      <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2" style="color:var(--text-mute)"></i>
      <input id="heroSearch" type="text" placeholder="Search: google, real madrid, bitcoin, react..." class="input w-full pl-12 pr-32 py-4 text-lg" style="border-radius:1rem">
      <button onclick="doSearch()" class="btn btn-primary absolute right-2 top-2 bottom-2">Search</button>
      <div id="searchResults" class="mt-2 card overflow-hidden hidden max-h-64 overflow-y-auto absolute left-0 right-0 z-30 mt-2"></div>
    </div>
    <div class="flex flex-wrap justify-center gap-2 mb-10 text-sm" style="color:var(--text-mute)">
      <span>Try:</span>
      ${['google','real madrid','bitcoin','react','portugal','spotify'].map(q => `<button onclick="setSearch('${q}')" class="hover:text-white transition-colors underline underline-offset-4">${q}</button>`).join('')}
    </div>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a href="/docs" class="btn btn-primary text-base px-6 py-3"><i class="fas fa-book"></i> Read the Docs</a>
      <a href="/explorer" class="btn btn-ghost text-base px-6 py-3"><i class="fas fa-compass"></i> Explore Assets</a>
    </div>
    <div class="flex flex-wrap justify-center gap-10 mt-16 pt-8" style="border-top:1px solid var(--border)">
      ${[['50K+','Visual Assets'],['18ms','Avg Response'],['99.99%','Uptime SLA'],['200+','Countries'],['6','File Formats']].map(([v,l]) => `<div class="text-center"><div class="text-3xl font-black" style="color:var(--text)">${v}</div><div class="text-sm mt-1" style="color:var(--text-mute)">${l}</div></div>`).join('')}
    </div>
  </div>
</section>

<!-- POPULAR BRANDS -->
<section class="py-16 px-4" style="border-top:1px solid var(--border)">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-center text-sm uppercase tracking-widest mb-10 font-semibold" style="color:var(--text-mute)">Thousands of brands covered</h2>
    <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-3">
      ${['Google','Apple','Microsoft','Amazon','Meta','Netflix','Spotify','Tesla','OpenAI','GitHub','Slack','Discord','Stripe','Shopify','YouTube','Instagram','LinkedIn','Twitter','Nike','Adidas'].map(b => `<div class="card card-hover p-3 flex flex-col items-center justify-center gap-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style="background:#b8a9e822;color:#b8a9e8">${b[0]}</div><span class="text-xs truncate w-full text-center" style="color:var(--text-mute)">${b}</span></div>`).join('')}
    </div>
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
    <div class="grid lg:grid-cols-2 gap-5">
      ${[
        ['GET','/api/v1/logo/google',`{
  "data": {
    "name": "Google",
    "slug": "google",
    "category": "technology",
    "svg": "https://cdn.logohub.dev/logos/google.svg",
    "colors": ["#4285F4","#EA4335","#FBBC05","#34A853"],
    "verified": true
  }
}`],
        ['GET','/api/v1/search?q=real+madrid',`{
  "data": [{
    "name": "Real Madrid",
    "slug": "real-madrid",
    "sport": "football",
    "league": "la-liga",
    "country": "ES",
    "colors": ["#FFFFFF","#FFD700"]
  }],
  "meta": { "query": "real madrid", "total": 1 }
}`],
        ['GET','/api/v1/flags/portugal',`{
  "data": {
    "name": "Portugal",
    "code": "PT",
    "emoji": "🇵🇹",
    "svg": "https://cdn.logohub.dev/flags/pt.svg",
    "type": "country"
  }
}`],
        ['GET','/api/v1/crypto/bitcoin',`{
  "data": {
    "name": "Bitcoin",
    "slug": "bitcoin",
    "category": "crypto",
    "colors": ["#F7931A","#FFFFFF"],
    "svg": "https://cdn.logohub.dev/crypto/bitcoin.svg",
    "verified": true
  }
}`],
      ].map(([m, ep, body]) => `
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="pill pill-green">${m}</span>
          <code class="text-sm font-mono" style="color:#b8a9e8">${ep}</code>
        </div>
        <pre class="code-block">${body}</pre>
        <a href="${ep}" target="_blank" class="mt-4 inline-flex items-center gap-2 text-sm" style="color:#b8a9e8"><i class="fas fa-external-link-alt text-xs"></i> Try it live</a>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="py-20 px-4" style="border-top:1px solid var(--border)">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-black mb-3" style="color:var(--text)">Built for <span class="gradient-text">Developers</span></h2>
      <p class="text-lg max-w-2xl mx-auto" style="color:var(--text-soft)">Everything you need without worrying about visual assets.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-5">
      ${[
        ['fa-bolt','#f5a623','Lightning Fast','18ms average response time with global edge caching.'],
        ['fa-shield-alt','#4ade80','Enterprise Ready','99.99% SLA, rate limiting, API keys, analytics and audit logs.'],
        ['fa-images','#4ecdc4','Multiple Formats','SVG, PNG, WEBP, JPG, ICO and AVIF with transformations.'],
        ['fa-search','#b8a9e8','Smart Search','Fuzzy search, alias support, typo correction.'],
        ['fa-code','#ff6b6b','7 Official SDKs','JS, Python, PHP, Go, Rust, Java, C#.'],
        ['fa-satellite-dish','#f5a623','Webhooks & Events','Get notified when assets are added or updated.'],
        ['fa-palette','#ff6b6b','Color Palettes','Automatic color extraction from every asset.'],
        ['fa-globe','#4ecdc4','Global CDN','200+ edge locations worldwide.'],
        ['fa-history','#b8a9e8','Versioned API','Stable v1 API with no breaking changes.'],
      ].map(([icon, color, title, desc]) => `
      <div class="card card-hover p-6">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style="background:${color}22;color:${color}"><i class="fas ${icon} text-xl"></i></div>
        <h3 class="font-bold text-lg mb-2" style="color:var(--text)">${title}</h3>
        <p class="text-sm leading-relaxed" style="color:var(--text-soft)">${desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- PRICING -->
<section class="py-20 px-4" id="pricing" style="border-top:1px solid var(--border)">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <span class="pill pill-green mb-4">Pricing</span>
      <h2 class="text-4xl font-black mb-3 mt-3" style="color:var(--text)">Simple <span class="gradient-text">Transparent</span> Pricing</h2>
    </div>
    <div class="grid md:grid-cols-4 gap-5">
      ${[
        { name:'Free', price:'$0', period:'/forever', color:'#71717a', features:['1,000 req/day','Basic API access','SVG & PNG only','Community support','Rate: 10/min'], cta:'Get Started', ctaCls:'btn-ghost' },
        { name:'Pro', price:'$19', period:'/month', color:'#4ecdc4', features:['100K req/day','All formats','Transformations','Email support','Rate: 100/min'], cta:'Start Free Trial', ctaCls:'btn-ghost' },
        { name:'Business', price:'$79', period:'/month', color:'#b8a9e8', features:['1M req/day','All formats + CDN','Priority support','Analytics dashboard','Rate: 500/min'], cta:'Start Free Trial', ctaCls:'btn-primary', popular:true },
        { name:'Enterprise', price:'Custom', period:'', color:'#f5a623', features:['Unlimited requests','Dedicated CDN','SLA guarantee','24/7 support','Custom rate limits'], cta:'Contact Sales', ctaCls:'btn-ghost' },
      ].map(plan => `
      <div class="card p-6 relative ${plan.popular ? 'border-2' : ''}" style="${plan.popular ? 'border-color:#b8a9e8' : ''}">
        ${plan.popular ? '<span class="pill pill-lilac absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</span>' : ''}
        <div class="text-sm font-bold uppercase tracking-wide mb-2" style="color:${plan.color}">${plan.name}</div>
        <div class="text-3xl font-black mb-1" style="color:var(--text)">${plan.price}<span class="text-sm font-normal" style="color:var(--text-mute)">${plan.period}</span></div>
        <div class="my-4" style="border-top:1px solid var(--border)"></div>
        <ul class="space-y-2 mb-6">
          ${plan.features.map(f => `<li class="text-sm flex items-center gap-2" style="color:var(--text-soft)"><i class="fas fa-check text-xs" style="color:#4ade80"></i>${f}</li>`).join('')}
        </ul>
        <a href="/dashboard" class="btn ${plan.ctaCls} w-full justify-center">${plan.cta}</a>
      </div>`).join('')}
    </div>
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
          <a href="/dashboard" class="btn btn-primary text-base px-8 py-3.5">Get API Key — Free</a>
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
      ${[['Product',[['API Reference','/docs'],['SDKs','/docs#sdks'],['Playground','/playground'],['Explorer','/explorer'],['Dashboard','/dashboard']]],['Resources',[['Documentation','/docs'],['Blog','/blog'],['FAQ','/faq'],['API Status','/api/v1/health'],['OpenAPI Spec','/api/openapi.json']]],['Company',[['About','/about'],['Pricing','/#pricing'],['Contact','/contact'],['Privacy','/privacy'],['Terms','/terms']]]].map(([title, links]) => `
      <div>
        <h4 class="font-semibold text-sm mb-4" style="color:var(--text)">${title}</h4>
        <ul class="space-y-2">
          ${(links as [string,string][]).map(([label,url]) => `<li><a href="${url}" class="text-sm hover:text-white transition-colors" style="color:var(--text-soft)">${label}</a></li>`).join('')}
        </ul>
      </div>`).join('')}
    </div>
    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style="border-top:1px solid var(--border)">
      <p class="text-sm" style="color:var(--text-mute)">© 2026 LogoHub API. All rights reserved.</p>
      <div class="flex items-center gap-2 text-sm" style="color:var(--text-mute)">
        <span class="w-2 h-2 rounded-full animate-pulse-dot" style="background:#4ade80"></span>
        <span>All systems operational</span>
      </div>
    </div>
  </div>
</footer>

<script>
let st;
async function doSearch() {
  const q = document.getElementById('heroSearch').value.trim(); if (!q) return;
  try {
    const r = await fetch('/api/v1/search?q='+encodeURIComponent(q)); const j = await r.json();
    const d = document.getElementById('searchResults');
    if (!j.data || !j.data.length) d.innerHTML = '<div class="p-4 text-sm" style="color:var(--text-mute)">No results</div>';
    else d.innerHTML = j.data.slice(0,6).map(i => '<a href="/explorer?slug='+i.slug+'" class="flex items-center gap-3 p-3 hover:bg-[var(--panel-2)] transition-colors" style="border-bottom:1px solid var(--border)"><div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style="background:#b8a9e822;color:#b8a9e8">'+((i.name||i.slug)[0])+'</div><div><div class="text-sm font-medium" style="color:var(--text)">'+(i.name||i.slug)+'</div><div class="text-xs" style="color:var(--text-mute)">'+(i.category||i.sport||i.type||'')+'</div></div></a>').join('');
    d.classList.remove('hidden');
  } catch (e) {}
}
document.getElementById('heroSearch').addEventListener('input', function() { clearTimeout(st); const q=this.value.trim(); if (q.length<2) { document.getElementById('searchResults').classList.add('hidden'); return; } st = setTimeout(doSearch, 300); });
document.addEventListener('click', e => { if (!e.target.closest('#heroSearch') && !e.target.closest('#searchResults')) document.getElementById('searchResults').classList.add('hidden'); });
function setSearch(q) { document.getElementById('heroSearch').value = q; doSearch(); }
// theme icon sync
(function(){ const t = localStorage.getItem('theme')||'dark'; const b = document.getElementById('themeBtn'); if (b) b.innerHTML = t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; })();
</script>
</body>
</html>`;
};

// =========================================================================
// /explorer
// =========================================================================
export const explorerPage = () => `${HEAD('Explorer — LogoHub API', COMMON_JS)}
<body class="font-sans">
<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold"><div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>LogoHub <span class="gradient-text-lilac ml-1">API</span></a>
    <div class="flex items-center gap-3">
      <a href="/docs" class="text-sm hidden md:inline" style="color:var(--text-soft)">Docs</a>
      <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon"><i class="fas fa-sun"></i></button>
      <a href="/dashboard" class="btn btn-primary btn-sm">Dashboard</a>
    </div>
  </div>
</nav>
<div class="pt-24 px-4 pb-20"><div class="max-w-7xl mx-auto">
  <div class="mb-8 animate-fade-up">
    <h1 class="text-4xl font-black mb-2 tracking-tight" style="color:var(--text)">Asset <span class="gradient-text">Explorer</span></h1>
    <p style="color:var(--text-soft)">Browse and search 50,000+ logos, icons, flags and emblems</p>
  </div>
  <div class="flex flex-col md:flex-row gap-3 mb-6">
    <div class="relative flex-1">
      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2" style="color:var(--text-mute)"></i>
      <input id="q" placeholder="Search logos, brands, teams..." class="input input-pill">
    </div>
    <select id="cat" class="select" style="border-radius:9999px"><option value="">All Categories</option>
      <option value="technology">Technology</option><option value="social">Social</option><option value="streaming">Streaming</option><option value="brands">Brands</option>
      <option value="automotive">Automotive</option><option value="fintech">Fintech</option><option value="crypto">Crypto</option>
      <option value="framework">Frameworks</option><option value="language">Languages</option><option value="database">Databases</option><option value="cloud">Cloud</option>
    </select>
  </div>
  <div class="flex flex-wrap gap-2 mb-8">
    ${[['All',''],['⚽ Football','football'],['🏀 Basketball','basketball'],['🏁 F1','formula1'],['🏁 Flags','flags'],['₿ Crypto','crypto']].map(([l,v]) => `<button onclick="filterSport('${v}')" data-pill="${v}" class="pill ${v===''?'pill-lilac':'pill-neutral'}">${l}</button>`).join('')}
  </div>
  <div id="results" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"></div>
</div></div>

<script>
async function load(url='/api/v1/logos?limit=48') {
  document.getElementById('results').innerHTML = Array.from({length:12},()=>'<div class="skeleton h-32"></div>').join('');
  const r = await fetch(url); const j = await r.json(); render(j.data || []);
}
function render(items) {
  const c = document.getElementById('results');
  if (!items.length) { c.innerHTML = '<div class="col-span-full empty-state"><i class="fas fa-search text-3xl mb-3 opacity-30 block"></i>No results</div>'; return; }
  c.innerHTML = items.map(i => '<div class="card card-hover p-4 flex flex-col items-center justify-center gap-3" onclick="showDetail('+JSON.stringify(i).replace(/"/g,'&quot;')+')">'+
    '<div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black" style="background:'+((i.colors||['#b8a9e8'])[0])+'22;color:'+((i.colors||['#b8a9e8'])[0])+'">'+((i.name||i.slug||'?')[0]).toUpperCase()+'</div>'+
    '<div class="text-center"><div class="text-sm font-semibold truncate max-w-[100px]" style="color:var(--text)">'+(i.name||i.slug)+'</div><div class="text-xs mt-0.5" style="color:var(--text-mute)">'+(i.category||i.sport||'')+'</div></div>'+
    '<div class="flex gap-1">'+(i.colors||[]).slice(0,4).map(c => '<span class="color-swatch" style="background:'+c+'"></span>').join('')+'</div>'+
  '</div>').join('');
}
function showDetail(item) {
  const html = '<div class="modal-box" style="max-width:420px"><div class="modal-head"><h2 class="text-base font-bold" style="color:var(--text)">'+(item.name||item.slug)+'</h2><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<div class="modal-body text-center">'+
    '<div class="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl font-black mb-4" style="background:'+((item.colors||['#b8a9e8'])[0])+'22;color:'+((item.colors||['#b8a9e8'])[0])+'">'+((item.name||item.slug)[0])+'</div>'+
    '<span class="pill pill-lilac mb-4">'+(item.category||item.sport||'unknown')+'</span>'+
    '<p class="text-sm mb-6" style="color:var(--text-soft)">'+(item.description||'')+'</p>'+
    '<div class="flex justify-center gap-2 mb-6">'+(item.colors||[]).map(c => '<span class="color-swatch" style="background:'+c+';width:32px;height:32px"></span>').join('')+'</div>'+
    (item.svg?'<a href="'+item.svg+'" target="_blank" class="btn btn-ghost btn-sm w-full mb-2"><i class="fas fa-file-code"></i> Download SVG</a>':'')+
    (item.png?'<a href="'+item.png+'" target="_blank" class="btn btn-ghost btn-sm w-full"><i class="fas fa-image"></i> Download PNG</a>':'')+
    '<div class="mt-4 p-3 rounded-xl" style="background:var(--panel-2)"><code class="text-xs font-mono" style="color:#b8a9e8">GET /api/v1/logo/'+item.slug+'</code></div>'+
    '</div></div>';
  LH.openModal(html);
}
let st;
document.getElementById('q').addEventListener('input', function() { clearTimeout(st); const q=this.value.trim(); st = setTimeout(()=>{ if (!q) load(); else load('/api/v1/search?q='+encodeURIComponent(q)+'&limit=48'); }, 300); });
document.getElementById('cat').addEventListener('change', function() { if (!this.value) load(); else load('/api/v1/category/'+this.value+'?limit=48'); });
function filterSport(s) { document.querySelectorAll('[data-pill]').forEach(b => { b.className = 'pill ' + (b.dataset.pill===s?'pill-lilac':'pill-neutral'); }); if (!s) load(); else load('/api/v1/'+s); }
load();
(function(){ const t = localStorage.getItem('theme')||'dark'; const b = document.getElementById('themeBtn'); if (b) b.innerHTML = t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; })();
</script>
</body>
</html>`;

// =========================================================================
// /docs
// =========================================================================
export const docsPage = () => `${HEAD('Documentation — LogoHub API', COMMON_JS)}
<body class="font-sans">
<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold"><div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>LogoHub <span class="gradient-text-lilac ml-1">API</span></a>
    <div class="flex items-center gap-3">
      <a href="/explorer" class="text-sm" style="color:var(--text-soft)">Explorer</a>
      <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon"><i class="fas fa-sun"></i></button>
      <a href="/dashboard" class="btn btn-primary btn-sm">Dashboard</a>
    </div>
  </div>
</nav>
<div class="flex pt-16">
  <aside class="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto border-r p-6 hidden lg:block" style="border-color:var(--border)">
    ${[['Getting Started',[['Quick Start','#quickstart'],['Authentication','#auth']]],['Endpoints',[['Logos','#logos'],['Search','#search'],['Categories','#categories'],['Football','#football'],['Flags','#flags'],['Crypto','#crypto']]],['SDKs',[['JavaScript','#sdk-js'],['Python','#sdk-python'],['cURL','#sdk-curl']]],['Admin API',[['API Keys','#admin-keys'],['Content','#admin-content'],['Settings','#admin-settings']]]].map(([s, links]) => `<div class="mb-6"><div class="text-xs font-bold uppercase tracking-widest mb-2" style="color:var(--text-mute)">${s}</div><div class="space-y-0.5">${(links as [string,string][]).map(([l,h]) => `<a href="${h}" class="block py-1.5 px-3 rounded-lg text-sm transition-colors" style="color:var(--text-soft)" onmouseover="this.style.background='var(--panel-2)';this.style.color='var(--text)'" onmouseout="this.style.background='';this.style.color='var(--text-soft)'">${l}</a>`).join('')}</div></div>`).join('')}
  </aside>
  <main class="lg:ml-64 flex-1 px-6 py-10 max-w-4xl mx-auto animate-fade-up">
    <div class="mb-12"><span class="pill pill-lilac">Documentation</span>
      <h1 class="text-5xl font-black mt-4 mb-3 tracking-tight" style="color:var(--text)">LogoHub <span class="gradient-text">API Reference</span></h1>
      <p class="text-xl" style="color:var(--text-soft)">Everything you need to integrate the world's largest visual identity API.</p>
    </div>
    <div class="card p-6 mb-10"><h3 class="font-semibold mb-2 flex items-center gap-2" style="color:var(--text)"><i class="fas fa-server" style="color:#b8a9e8"></i> Base URL</h3><code class="text-lg font-mono" style="color:#b8a9e8">https://api.logohub.dev/v1</code></div>

    <section id="quickstart" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Quick Start</h2>
      <pre class="code-block"><code><span style="color:#71717a"># Fetch a logo</span>
curl https://api.logohub.dev/v1/logo/google

<span style="color:#71717a"># Search for logos</span>
curl "https://api.logohub.dev/v1/search?q=spotify"</code></pre></section>

    <section id="auth" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Authentication</h2>
      <p class="mb-4" style="color:var(--text-soft)">Pass your API key via the <code class="font-mono px-2 py-0.5 rounded" style="background:#b8a9e822;color:#b8a9e8">X-API-Key</code> header.</p>
      <pre class="code-block"><code>curl -H "X-API-Key: lh_live_xxxxxxxxxxxx" \\
  https://api.logohub.dev/v1/logo/apple</code></pre></section>

    <section id="logos" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Public Endpoints</h2>
      <div class="card overflow-x-auto"><table class="lh-table"><thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead><tbody>
      ${[['GET','/api/v1/logo/:slug','Get a specific logo'],['GET','/api/v1/logos','List all logos'],['GET','/api/v1/search?q=...','Search all assets'],['GET','/api/v1/categories','List categories'],['GET','/api/v1/category/:slug','Get logos by category'],['GET','/api/v1/football','List football teams'],['GET','/api/v1/flags','List flags'],['GET','/api/v1/crypto','List cryptocurrencies'],['GET','/api/v1/stats','API statistics']].map(([m,e,d]) => `<tr><td><span class="pill pill-green">${m}</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">${e}</code></td><td style="color:var(--text-soft)">${d}</td></tr>`).join('')}
      </tbody></table></div>
    </section>

    <section id="admin-keys" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Admin API · API Keys</h2>
      <p class="mb-4" style="color:var(--text-soft)">CRUD endpoints powering the dashboard. All routes are prefixed with <code class="font-mono">/api/admin</code>.</p>
      <div class="card overflow-x-auto"><table class="lh-table"><thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead><tbody>
      ${[['GET','/api/admin/keys','List API keys'],['POST','/api/admin/keys','Create a new key'],['GET','/api/admin/keys/:id','Get a key by id'],['PATCH','/api/admin/keys/:id','Update a key'],['POST','/api/admin/keys/:id/revoke','Revoke a key'],['DELETE','/api/admin/keys/:id','Delete a key']].map(([m,e,d]) => `<tr><td><span class="pill ${m==='GET'?'pill-green':m==='POST'?'pill-lilac':m==='PATCH'?'pill-amber':'pill-coral'}">${m}</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">${e}</code></td><td style="color:var(--text-soft)">${d}</td></tr>`).join('')}
      </tbody></table></div>
    </section>

    <section id="admin-content" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Admin API · Content</h2>
      <div class="card overflow-x-auto"><table class="lh-table"><thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead><tbody>
      ${[['GET','/api/admin/content','List content (q, category, status)'],['POST','/api/admin/content','Create a new content item'],['GET','/api/admin/content/:id','Get content by id'],['PATCH','/api/admin/content/:id','Update content (incl. assets and palette)'],['DELETE','/api/admin/content/:id','Delete content']].map(([m,e,d]) => `<tr><td><span class="pill ${m==='GET'?'pill-green':m==='POST'?'pill-lilac':m==='PATCH'?'pill-amber':'pill-coral'}">${m}</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">${e}</code></td><td style="color:var(--text-soft)">${d}</td></tr>`).join('')}
      </tbody></table></div>
    </section>

    <section id="admin-settings" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Admin API · Settings & Git</h2>
      <div class="card overflow-x-auto"><table class="lh-table"><thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead><tbody>
      ${[['GET','/api/admin/settings','List settings (group filter)'],['PATCH','/api/admin/settings/:key','Update a setting by key'],['POST','/api/admin/git/test','Test the Git connection'],['GET','/api/admin/stats','Dashboard stats snapshot'],['GET','/api/admin/activity','Audit log']].map(([m,e,d]) => `<tr><td><span class="pill ${m==='GET'?'pill-green':m==='POST'?'pill-lilac':'pill-amber'}">${m}</span></td><td><code class="text-xs font-mono" style="color:#b8a9e8">${e}</code></td><td style="color:var(--text-soft)">${d}</td></tr>`).join('')}
      </tbody></table></div>
    </section>

    <section id="sdk-js" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">JavaScript SDK</h2>
      <pre class="code-block"><code><span style="color:#71717a">// npm install logohub</span>
import { LogoHub } from 'logohub';
const client = new LogoHub('lh_live_xxxxxxxxxxxx');

const logo = await client.logos.get('google');
console.log(logo.svg, logo.colors);

const results = await client.search('real madrid');</code></pre></section>

    <section id="sdk-python" class="mb-12"><h2 class="text-3xl font-black mb-4 pb-3" style="color:var(--text);border-bottom:1px solid var(--border)">Python SDK</h2>
      <pre class="code-block"><code><span style="color:#71717a"># pip install logohub</span>
from logohub import LogoHub
client = LogoHub('lh_live_xxxxxxxxxxxx')

logo = client.logos.get('apple')
print(logo.svg, logo.colors)</code></pre></section>
  </main>
</div>
<script>(function(){ const t = localStorage.getItem('theme')||'dark'; const b = document.getElementById('themeBtn'); if (b) b.innerHTML = t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; })();</script>
</body>
</html>`;

// =========================================================================
// /admin  — now redirects to /dashboard (admin features fully merged into dashboard)
// =========================================================================
export const adminPage = () => `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/dashboard"><title>Redirecting...</title></head><body><a href="/dashboard">Go to dashboard</a></body></html>`;
