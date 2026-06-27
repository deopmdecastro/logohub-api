import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import api from './routes/api';

const app = new Hono();

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));

// Mount API
app.route('/api/v1', api);

// Redirect /api to /api/v1
app.get('/api', (c) => c.redirect('/api/v1/stats'));

// ============================================================
// LANDING PAGE
// ============================================================
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LogoHub API - The World's Largest Visual Identity API</title>
<meta name="description" content="Access millions of logos, brand icons, flags, sports emblems, cryptocurrency logos and more through our lightning-fast REST API and CDN.">
<meta property="og:title" content="LogoHub API - The World's Largest Visual Identity API">
<meta property="og:description" content="Lightning-fast REST API for logos, flags, sport emblems, crypto icons and more. 50ms response time. Global CDN.">
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          brand: { 50: '#f0f4ff', 100: '#e0e9ff', 500: '#4F46E5', 600: '#4338CA', 700: '#3730A3', 900: '#1e1b4b' },
          surface: { 900: '#0a0a0f', 800: '#111118', 700: '#18181f', 600: '#1f1f2e' },
        },
        animation: {
          'fade-up': 'fadeUp 0.5s ease-out',
          'glow': 'glow 2s ease-in-out infinite',
          'float': 'float 3s ease-in-out infinite',
          'pulse-slow': 'pulse 3s ease-in-out infinite',
        },
        keyframes: {
          fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
          glow: { '0%, 100%': { boxShadow: '0 0 20px rgba(79,70,229,0.4)' }, '50%': { boxShadow: '0 0 40px rgba(79,70,229,0.8)' } },
          float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        },
        backdropBlur: { xs: '2px' },
      }
    }
  }
</script>
<style>
  * { box-sizing: border-box; }
  body { background: #0a0a0f; }
  .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
  .glass-hover:hover { background: rgba(255,255,255,0.06); border-color: rgba(79,70,229,0.4); transition: all 0.3s ease; }
  .gradient-text { background: linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #F472B6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .gradient-border { border: 1px solid transparent; background: linear-gradient(#111118, #111118) padding-box, linear-gradient(135deg, #4F46E5, #C084FC) border-box; }
  .hero-glow { background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79,70,229,0.3) 0%, transparent 100%); }
  .code-block { background: rgba(0,0,0,0.6); border: 1px solid rgba(79,70,229,0.3); border-radius: 12px; font-family: 'Fira Code', monospace; }
  .typing-cursor::after { content: '|'; animation: blink 1s step-end infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  .particle { position: absolute; border-radius: 50%; opacity: 0.1; animation: float 4s ease-in-out infinite; }
  .logo-card { transition: all 0.3s ease; }
  .logo-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(79,70,229,0.2); }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111118; } ::-webkit-scrollbar-thumb { background: #4F46E5; border-radius: 3px; }
  .nav-blur { background: rgba(10,10,15,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
  .endpoint-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
  .get-badge { background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
  .search-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; }
  .search-input:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); background: rgba(255,255,255,0.07); }
  .plan-card { transition: all 0.3s ease; }
  .plan-card:hover { transform: translateY(-6px); }
  .plan-popular { border-color: #4F46E5 !important; background: linear-gradient(135deg, rgba(79,70,229,0.1), rgba(192,132,252,0.05)); }
  @media (max-width: 768px) { .hide-mobile { display: none; } }
</style>
</head>
<body class="text-white min-h-screen">

<!-- NAVBAR -->
<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">L</div>
        <span class="font-bold text-lg">LogoHub <span class="text-indigo-400">API</span></span>
        <span class="ml-2 text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">v1</span>
      </div>
      <div class="hidden md:flex items-center gap-8 text-sm">
        <a href="/docs" class="text-gray-400 hover:text-white transition-colors">Docs</a>
        <a href="/explorer" class="text-gray-400 hover:text-white transition-colors">Explorer</a>
        <a href="/pricing" class="text-gray-400 hover:text-white transition-colors">Pricing</a>
        <a href="/api/v1/stats" class="text-gray-400 hover:text-white transition-colors">API</a>
      </div>
      <div class="flex items-center gap-3">
        <a href="/dashboard" class="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Sign in</a>
        <a href="/dashboard" class="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/30">Get API Key</a>
      </div>
    </div>
  </div>
</nav>

<!-- HERO -->
<section class="relative pt-32 pb-20 px-4 hero-glow overflow-hidden">
  <!-- Particles -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="particle w-2 h-2 bg-indigo-500 top-1/4 left-1/5" style="animation-delay:0s"></div>
    <div class="particle w-1 h-1 bg-purple-400 top-1/3 right-1/4" style="animation-delay:1s"></div>
    <div class="particle w-3 h-3 bg-pink-500 top-1/2 left-3/4" style="animation-delay:2s"></div>
    <div class="particle w-1 h-1 bg-blue-400 top-2/3 left-1/3" style="animation-delay:0.5s"></div>
    <div class="particle w-2 h-2 bg-indigo-300 top-1/5 right-1/3" style="animation-delay:1.5s"></div>
  </div>

  <div class="max-w-5xl mx-auto text-center relative">
    <!-- Badge -->
    <div class="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 text-sm text-gray-300">
      <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
      <span>API Online · 248K+ requests today · 18ms avg</span>
    </div>

    <!-- Title -->
    <h1 class="text-5xl sm:text-7xl font-black mb-6 leading-tight tracking-tight">
      The World's Largest<br>
      <span class="gradient-text">Visual Identity API</span>
    </h1>

    <!-- Subtitle -->
    <p class="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
      Access <strong class="text-white">50,000+</strong> logos, brand icons, flags, sports emblems, crypto logos and more through our lightning-fast REST API and global CDN.
    </p>

    <!-- Search Bar -->
    <div class="max-w-2xl mx-auto mb-8">
      <div class="relative">
        <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-500"></i>
        </div>
        <input
          id="heroSearch"
          type="text"
          placeholder="Search: google, real madrid, bitcoin, react..."
          class="search-input w-full pl-12 pr-32 py-4 rounded-2xl text-white placeholder-gray-500 text-lg"
          autocomplete="off"
        >
        <button onclick="doSearch()" class="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-medium transition-all text-sm">
          Search
        </button>
      </div>
      <div id="searchResults" class="mt-2 glass rounded-xl overflow-hidden hidden max-h-64 overflow-y-auto"></div>
    </div>

    <!-- Quick Links -->
    <div class="flex flex-wrap justify-center gap-2 mb-12 text-sm">
      <span class="text-gray-500">Try:</span>
      <button onclick="setSearch('google')" class="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">google</button>
      <button onclick="setSearch('real madrid')" class="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">real madrid</button>
      <button onclick="setSearch('bitcoin')" class="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">bitcoin</button>
      <button onclick="setSearch('react')" class="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">react</button>
      <button onclick="setSearch('portugal')" class="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">portugal</button>
      <button onclick="setSearch('spotify')" class="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">spotify</button>
    </div>

    <!-- CTAs -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="/docs" class="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2">
        <i class="fas fa-book"></i> Read the Docs
      </a>
      <a href="/explorer" class="glass glass-hover text-white px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center gap-2">
        <i class="fas fa-compass"></i> Explore Assets
      </a>
    </div>

    <!-- Stats Bar -->
    <div class="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/5">
      <div class="text-center"><div class="text-3xl font-black text-white">50K+</div><div class="text-sm text-gray-500 mt-1">Visual Assets</div></div>
      <div class="text-center"><div class="text-3xl font-black text-white">18ms</div><div class="text-sm text-gray-500 mt-1">Avg Response</div></div>
      <div class="text-center"><div class="text-3xl font-black text-white">99.99%</div><div class="text-sm text-gray-500 mt-1">Uptime SLA</div></div>
      <div class="text-center"><div class="text-3xl font-black text-white">200+</div><div class="text-sm text-gray-500 mt-1">Countries</div></div>
      <div class="text-center"><div class="text-3xl font-black text-white">6</div><div class="text-sm text-gray-500 mt-1">File Formats</div></div>
    </div>
  </div>
</section>

<!-- POPULAR BRANDS -->
<section class="py-16 px-4 border-t border-white/5">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-center text-sm text-gray-500 uppercase tracking-widest mb-10 font-medium">Thousands of brands covered</h2>
    <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-4">
      ${['Google','Apple','Microsoft','Amazon','Meta','Netflix','Spotify','Tesla','OpenAI','GitHub','Slack','Discord','Stripe','Shopify','YouTube','Instagram','LinkedIn','Twitter','Nike','Adidas'].map(brand => `
      <div class="glass glass-hover logo-card rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer" title="${brand}">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">${brand[0]}</div>
        <span class="text-xs text-gray-500 truncate w-full text-center">${brand}</span>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- API EXAMPLES -->
<section class="py-20 px-4" id="api">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <div class="inline-block text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4 bg-indigo-500/10 px-4 py-2 rounded-full">REST API</div>
      <h2 class="text-4xl font-black mb-4">Simple. Consistent. <span class="gradient-text">Powerful.</span></h2>
      <p class="text-gray-400 text-lg max-w-2xl mx-auto">One unified API for all your visual identity needs. No scraping, no resizing, no hosting headaches.</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Example 1 -->
      <div class="glass rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="endpoint-badge get-badge">GET</span>
          <code class="text-indigo-300 text-sm">/api/v1/logo/google</code>
        </div>
        <pre class="code-block p-4 text-sm overflow-x-auto text-gray-300 rounded-xl"><code id="code1">{
  "data": {
    "name": "Google",
    "slug": "google",
    "category": "technology",
    "website": "https://google.com",
    "svg": "https://cdn.logohub.dev/logos/google.svg",
    "png": "https://cdn.logohub.dev/logos/google.png",
    "colors": ["#4285F4","#EA4335","#FBBC05","#34A853"],
    "verified": true
  }
}</code></pre>
        <a href="/api/v1/logo/google" target="_blank" class="mt-4 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          <i class="fas fa-external-link-alt text-xs"></i> Try it live
        </a>
      </div>

      <!-- Example 2 -->
      <div class="glass rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="endpoint-badge get-badge">GET</span>
          <code class="text-indigo-300 text-sm">/api/v1/search?q=real+madrid</code>
        </div>
        <pre class="code-block p-4 text-sm overflow-x-auto text-gray-300 rounded-xl"><code>{
  "data": [{
    "name": "Real Madrid",
    "slug": "real-madrid",
    "sport": "football",
    "league": "la-liga",
    "country": "ES",
    "colors": ["#FFFFFF","#FFD700"],
    "svg": "https://cdn.logohub.dev/football/real-madrid.svg"
  }],
  "meta": { "query": "real madrid", "total": 1 }
}</code></pre>
        <a href="/api/v1/search?q=real+madrid" target="_blank" class="mt-4 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          <i class="fas fa-external-link-alt text-xs"></i> Try it live
        </a>
      </div>

      <!-- Example 3 -->
      <div class="glass rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="endpoint-badge get-badge">GET</span>
          <code class="text-indigo-300 text-sm">/api/v1/flags/portugal</code>
        </div>
        <pre class="code-block p-4 text-sm overflow-x-auto text-gray-300 rounded-xl"><code>{
  "data": {
    "name": "Portugal",
    "code": "PT",
    "emoji": "🇵🇹",
    "svg": "https://cdn.logohub.dev/flags/pt.svg",
    "png": "https://cdn.logohub.dev/flags/pt.png",
    "type": "country"
  }
}</code></pre>
        <a href="/api/v1/flags/portugal" target="_blank" class="mt-4 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          <i class="fas fa-external-link-alt text-xs"></i> Try it live
        </a>
      </div>

      <!-- Example 4 -->
      <div class="glass rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="endpoint-badge get-badge">GET</span>
          <code class="text-indigo-300 text-sm">/api/v1/crypto/bitcoin</code>
        </div>
        <pre class="code-block p-4 text-sm overflow-x-auto text-gray-300 rounded-xl"><code>{
  "data": {
    "name": "Bitcoin",
    "slug": "bitcoin",
    "category": "crypto",
    "colors": ["#F7931A","#FFFFFF"],
    "svg": "https://cdn.logohub.dev/crypto/bitcoin.svg",
    "png": "https://cdn.logohub.dev/crypto/bitcoin.png",
    "verified": true
  }
}</code></pre>
        <a href="/api/v1/crypto/bitcoin" target="_blank" class="mt-4 inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          <i class="fas fa-external-link-alt text-xs"></i> Try it live
        </a>
      </div>
    </div>

    <!-- CDN section -->
    <div class="glass rounded-2xl p-8 mt-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center"><i class="fas fa-globe text-orange-400"></i></div>
        <div>
          <h3 class="font-bold text-lg">Global CDN Access</h3>
          <p class="text-gray-400 text-sm">Direct URL access in any format</p>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        ${[['SVG','cdn.logohub.dev/logo/google.svg','text-blue-400'],['PNG','cdn.logohub.dev/logo/google.png','text-green-400'],['WEBP','cdn.logohub.dev/logo/google.webp','text-yellow-400'],['ICO','cdn.logohub.dev/logo/google.ico','text-red-400']].map(([fmt,url,color]) => `
        <div class="bg-black/30 rounded-xl p-3">
          <span class="text-xs font-bold ${color} block mb-1">.${fmt.toLowerCase()}</span>
          <code class="text-xs text-gray-400 break-all">${url}</code>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>

<!-- CATEGORIES -->
<section class="py-20 px-4 border-t border-white/5">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <div class="inline-block text-purple-400 text-sm font-semibold uppercase tracking-widest mb-4 bg-purple-500/10 px-4 py-2 rounded-full">Categories</div>
      <h2 class="text-4xl font-black mb-4">Everything <span class="gradient-text">Organized</span></h2>
      <p class="text-gray-400 text-lg">Explore thousands of assets across dozens of categories</p>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      ${[
        ['💻','Technology','Logos of tech companies','technology'],
        ['📱','Social Media','All social platforms','social'],
        ['⚽','Football','Club emblems worldwide','football'],
        ['🏀','Basketball','NBA and global leagues','basketball'],
        ['🏎️','Formula 1','All F1 team logos','formula1'],
        ['🏁','Flags','Countries and regions','flags'],
        ['₿','Crypto','Currencies & tokens','crypto'],
        ['⚛️','Frameworks','JS, Python frameworks','framework'],
        ['👨‍💻','Languages','Programming languages','language'],
        ['🗄️','Databases','SQL and NoSQL','database'],
        ['☁️','Cloud','AWS, GCP, Azure','cloud'],
        ['🎬','Streaming','Video & music platforms','streaming'],
        ['💳','Fintech','Banks & payment apps','fintech'],
        ['🚗','Automotive','Car manufacturers','automotive'],
        ['🏷️','Brands','Global consumer brands','brands'],
        ['🎮','Gaming','Games & eSports','gaming'],
      ].map(([icon,name,desc,slug]) => `
      <a href="/explorer?category=${slug}" class="glass glass-hover logo-card rounded-xl p-5 cursor-pointer group">
        <div class="text-3xl mb-3">${icon}</div>
        <div class="font-semibold text-white mb-1">${name}</div>
        <div class="text-xs text-gray-500">${desc}</div>
        <div class="mt-3 text-indigo-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Explore <i class="fas fa-arrow-right text-xs"></i>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="py-20 px-4 border-t border-white/5">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-black mb-4">Built for <span class="gradient-text">Developers</span></h2>
      <p class="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to build amazing apps without worrying about visual assets</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      ${[
        ['fas fa-bolt','text-yellow-400','bg-yellow-500/10','Lightning Fast','18ms average response time with global edge caching. Your users never wait.'],
        ['fas fa-shield-alt','text-green-400','bg-green-500/10','Enterprise Ready','99.99% SLA, rate limiting, API keys, analytics and audit logs.'],
        ['fas fa-images','text-blue-400','bg-blue-500/10','Multiple Formats','SVG, PNG, WEBP, JPG, ICO and AVIF. With on-the-fly transformations.'],
        ['fas fa-search','text-purple-400','bg-purple-500/10','Smart Search','Fuzzy search, alias support, typo correction and multi-language.'],
        ['fas fa-code','text-pink-400','bg-pink-500/10','7 Official SDKs','JavaScript, Python, PHP, Go, Rust, Java, C# with code examples.'],
        ['fas fa-satellite-dish','text-orange-400','bg-orange-500/10','Webhooks & Events','Get notified when new logos are added or assets are updated.'],
        ['fas fa-palette','text-red-400','bg-red-500/10','Color Palettes','Automatic color extraction from every logo and brand asset.'],
        ['fas fa-globe','text-cyan-400','bg-cyan-500/10','Global CDN','200+ edge locations. Assets served from nearest node worldwide.'],
        ['fas fa-history','text-indigo-400','bg-indigo-500/10','Versioned API','Stable v1 API with no breaking changes. Future-proof your integration.'],
      ].map(([icon,color,bg,title,desc]) => `
      <div class="glass glass-hover rounded-2xl p-6">
        <div class="w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4">
          <i class="${icon} ${color} text-xl"></i>
        </div>
        <h3 class="font-bold text-lg mb-2">${title}</h3>
        <p class="text-gray-400 text-sm leading-relaxed">${desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- PRICING -->
<section class="py-20 px-4 border-t border-white/5" id="pricing">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <div class="inline-block text-green-400 text-sm font-semibold uppercase tracking-widest mb-4 bg-green-500/10 px-4 py-2 rounded-full">Pricing</div>
      <h2 class="text-4xl font-black mb-4">Simple <span class="gradient-text">Transparent</span> Pricing</h2>
      <p class="text-gray-400 text-lg">Start for free, scale as you grow</p>
    </div>
    <div class="grid md:grid-cols-4 gap-6">
      ${[
        { name:'Free', price:'$0', period:'/forever', color:'text-gray-400', border:'border-white/10', features:['1,000 req/day','Basic API access','SVG & PNG only','Community support','Rate: 10/min'], cta:'Get Started', ctaStyle:'glass glass-hover' },
        { name:'Pro', price:'$19', period:'/month', color:'text-blue-400', border:'border-blue-500/30', features:['100K req/day','All formats','Transformations','Email support','Rate: 100/min'], cta:'Start Free Trial', ctaStyle:'bg-blue-600 hover:bg-blue-500' },
        { name:'Business', price:'$79', period:'/month', color:'text-indigo-400', border:'border-indigo-500', bg:'plan-popular', features:['1M req/day','All formats + CDN','Priority support','Analytics dashboard','Rate: 500/min'], cta:'Start Free Trial', ctaStyle:'bg-indigo-600 hover:bg-indigo-500', popular: true },
        { name:'Enterprise', price:'Custom', period:'', color:'text-purple-400', border:'border-purple-500/30', features:['Unlimited requests','Dedicated CDN','SLA guarantee','24/7 support','Custom rate limits'], cta:'Contact Sales', ctaStyle:'glass glass-hover' },
      ].map(plan => `
      <div class="glass rounded-2xl p-6 plan-card ${plan.border} border ${plan.bg||''} relative">
        ${plan.popular ? '<div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</div>' : ''}
        <div class="${plan.color} text-sm font-bold uppercase tracking-wide mb-2">${plan.name}</div>
        <div class="text-3xl font-black text-white mb-1">${plan.price}<span class="text-sm font-normal text-gray-500">${plan.period}</span></div>
        <div class="border-t border-white/10 my-4"></div>
        <ul class="space-y-2 mb-6">
          ${plan.features.map(f => `<li class="text-sm text-gray-400 flex items-center gap-2"><i class="fas fa-check text-green-400 text-xs"></i>${f}</li>`).join('')}
        </ul>
        <a href="/dashboard" class="${plan.ctaStyle} text-white text-sm font-medium py-2.5 px-4 rounded-xl text-center block transition-all hover:shadow-lg">
          ${plan.cta}
        </a>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- SDK SECTION -->
<section class="py-20 px-4 border-t border-white/5">
  <div class="max-w-6xl mx-auto">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div class="inline-block text-pink-400 text-sm font-semibold uppercase tracking-widest mb-4 bg-pink-500/10 px-4 py-2 rounded-full">SDKs</div>
        <h2 class="text-4xl font-black mb-6">Integrate in <span class="gradient-text">Minutes</span></h2>
        <p class="text-gray-400 mb-8 leading-relaxed">Official SDKs available for all major languages. Or use our REST API directly from any HTTP client.</p>
        <div class="grid grid-cols-4 gap-3">
          ${['JavaScript','Python','PHP','Go','Rust','Java','C#','cURL'].map(lang => `<div class="glass rounded-lg p-3 text-center text-xs text-gray-400 hover:text-white transition-colors cursor-pointer glass-hover">${lang}</div>`).join('')}
        </div>
      </div>
      <div class="glass rounded-2xl p-6">
        <div class="flex gap-2 mb-4">
          ${['JS','Python','cURL'].map((lang, i) => `<button onclick="showSDK(${i})" id="sdkBtn${i}" class="text-xs px-3 py-1.5 rounded-lg transition-all ${i===0?'bg-indigo-600 text-white':'text-gray-400 hover:text-white'}">${lang}</button>`).join('')}
        </div>
        <div id="sdk0" class="sdk-code">
          <pre class="code-block p-4 text-sm overflow-x-auto text-gray-300 rounded-xl"><code><span class="text-gray-500">// npm install logohub</span>
<span class="text-purple-400">import</span> { LogoHub } <span class="text-purple-400">from</span> <span class="text-green-400">'logohub'</span>;

<span class="text-blue-400">const</span> client = <span class="text-yellow-400">new</span> LogoHub(<span class="text-green-400">'your-api-key'</span>);

<span class="text-blue-400">const</span> logo = <span class="text-purple-400">await</span> client.logos.<span class="text-yellow-400">get</span>(<span class="text-green-400">'google'</span>);
console.<span class="text-yellow-400">log</span>(logo.svg); <span class="text-gray-500">// SVG URL</span>

<span class="text-blue-400">const</span> results = <span class="text-purple-400">await</span> client.<span class="text-yellow-400">search</span>(<span class="text-green-400">'spotify'</span>);
<span class="text-blue-400">const</span> flag = <span class="text-purple-400">await</span> client.flags.<span class="text-yellow-400">get</span>(<span class="text-green-400">'portugal'</span>);</code></pre>
        </div>
        <div id="sdk1" class="sdk-code hidden">
          <pre class="code-block p-4 text-sm overflow-x-auto text-gray-300 rounded-xl"><code><span class="text-gray-500"># pip install logohub</span>
<span class="text-purple-400">from</span> logohub <span class="text-purple-400">import</span> LogoHub

client = LogoHub(<span class="text-green-400">'your-api-key'</span>)

logo = client.logos.<span class="text-yellow-400">get</span>(<span class="text-green-400">'google'</span>)
<span class="text-yellow-400">print</span>(logo.svg)  <span class="text-gray-500"># SVG URL</span>

results = client.<span class="text-yellow-400">search</span>(<span class="text-green-400">'spotify'</span>)
flag = client.flags.<span class="text-yellow-400">get</span>(<span class="text-green-400">'portugal'</span>)</code></pre>
        </div>
        <div id="sdk2" class="sdk-code hidden">
          <pre class="code-block p-4 text-sm overflow-x-auto text-gray-300 rounded-xl"><code><span class="text-gray-500"># Get a logo</span>
curl -H <span class="text-green-400">"X-API-Key: your-key"</span> \\
  https://api.logohub.dev/v1/logo/google

<span class="text-gray-500"># Search</span>
curl https://api.logohub.dev/v1/search?q=spotify

<span class="text-gray-500"># Get flag</span>
curl https://api.logohub.dev/v1/flags/portugal</code></pre>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="py-20 px-4 border-t border-white/5">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl font-black mb-4">Frequently Asked <span class="gradient-text">Questions</span></h2>
    </div>
    <div class="space-y-4" id="faqContainer">
      ${[
        ['How many logos do you have?','We currently have 50,000+ logos covering technology companies, sports clubs, country flags, cryptocurrency tokens, programming languages, frameworks, and much more. We add hundreds of new assets every week.'],
        ['What file formats are available?','We support SVG, PNG, WEBP, JPG, ICO, and AVIF. You can also apply on-the-fly transformations like resizing, background color, padding, and format conversion via URL parameters.'],
        ['Can I use the free plan for commercial projects?','Yes! The free plan allows commercial use with attribution. Paid plans remove attribution requirements and unlock higher rate limits and additional features.'],
        ['Do you have SDKs?','We provide official SDKs for JavaScript/TypeScript, Python, PHP, Go, Rust, Java, and C#. All SDKs are open-source and available on GitHub.'],
        ['How fast is the API?','Our API averages 18ms response time globally, thanks to our edge network with 200+ locations worldwide. Assets are cached at the CDN level for instant delivery.'],
        ['Can I contribute logos?','Yes! We have a community contribution system where you can submit logos for review. All submissions are verified by our team before being published.'],
      ].map(([q, a], i) => `
      <div class="glass rounded-xl overflow-hidden">
        <button onclick="toggleFaq(${i})" class="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors">
          <span class="font-semibold">${q}</span>
          <i class="fas fa-chevron-down text-gray-500 transition-transform faq-icon-${i}"></i>
        </button>
        <div class="faq-answer-${i} hidden px-5 pb-5 text-gray-400 text-sm leading-relaxed">${a}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- CTA BOTTOM -->
<section class="py-20 px-4 border-t border-white/5">
  <div class="max-w-4xl mx-auto text-center">
    <div class="glass rounded-3xl p-12 gradient-border">
      <div class="text-6xl mb-6">🚀</div>
      <h2 class="text-4xl font-black mb-4">Ready to Build?</h2>
      <p class="text-gray-400 text-lg mb-8 max-w-xl mx-auto">Join 10,000+ developers using LogoHub API to power their applications. Free plan. No credit card required.</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="/dashboard" class="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-indigo-500/30">
          Get API Key — Free
        </a>
        <a href="/docs" class="glass glass-hover text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all">
          Read Docs
        </a>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="border-t border-white/5 py-12 px-4">
  <div class="max-w-6xl mx-auto">
    <div class="grid md:grid-cols-5 gap-8 mb-10">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">L</div>
          <span class="font-bold">LogoHub API</span>
        </div>
        <p class="text-gray-500 text-sm leading-relaxed mb-4">The world's most comprehensive visual identity API. 50K+ assets. Global CDN. Built for developers.</p>
        <div class="flex gap-3">
          ${['fab fa-github','fab fa-twitter','fab fa-discord'].map(icon => `<a href="#" class="w-9 h-9 glass rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors glass-hover"><i class="${icon}"></i></a>`).join('')}
        </div>
      </div>
      ${[
        ['Product',['API Reference','SDKs','Status','Changelog','Roadmap']],
        ['Resources',['Documentation','Blog','Examples','OpenAPI','Postman']],
        ['Company',['About','Pricing','Contact','Privacy','Terms']],
      ].map(([title, links]) => `
      <div>
        <h4 class="font-semibold text-sm text-white mb-4">${title}</h4>
        <ul class="space-y-2">
          ${(links as string[]).map(link => `<li><a href="#" class="text-sm text-gray-500 hover:text-white transition-colors">${link}</a></li>`).join('')}
        </ul>
      </div>`).join('')}
    </div>
    <div class="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-gray-600 text-sm">© 2024 LogoHub API. All rights reserved.</p>
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        <span>All systems operational</span>
      </div>
    </div>
  </div>
</footer>

<script>
// Search functionality
let searchTimeout;
function doSearch() {
  const q = document.getElementById('heroSearch').value.trim();
  if (!q) return;
  fetch('/api/v1/search?q=' + encodeURIComponent(q))
    .then(r => r.json()).then(data => {
      const div = document.getElementById('searchResults');
      if (!data.data || data.data.length === 0) {
        div.innerHTML = '<div class="p-4 text-gray-500 text-sm">No results found</div>';
      } else {
        div.innerHTML = data.data.slice(0, 6).map(item => \`
          <div class="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0" onclick="window.location='/explorer?slug=\${item.slug}'">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
              \${(item.name || item.slug)[0]}
            </div>
            <div>
              <div class="text-sm font-medium text-white">\${item.name || item.slug}</div>
              <div class="text-xs text-gray-500">\${item.category || item.sport || item.type || ''}</div>
            </div>
          </div>
        \`).join('');
      }
      div.classList.remove('hidden');
    }).catch(() => {});
}

document.getElementById('heroSearch').addEventListener('input', function() {
  clearTimeout(searchTimeout);
  const q = this.value.trim();
  if (q.length < 2) { document.getElementById('searchResults').classList.add('hidden'); return; }
  searchTimeout = setTimeout(doSearch, 300);
});

document.addEventListener('click', function(e) {
  if (!e.target.closest('#heroSearch') && !e.target.closest('#searchResults')) {
    document.getElementById('searchResults').classList.add('hidden');
  }
});

function setSearch(q) {
  document.getElementById('heroSearch').value = q;
  doSearch();
}

// SDK tabs
function showSDK(i) {
  document.querySelectorAll('.sdk-code').forEach(el => el.classList.add('hidden'));
  document.getElementById('sdk' + i).classList.remove('hidden');
  for(let j=0; j<3; j++) {
    const btn = document.getElementById('sdkBtn' + j);
    btn.className = j === i ? 'text-xs px-3 py-1.5 rounded-lg transition-all bg-indigo-600 text-white' : 'text-xs px-3 py-1.5 rounded-lg transition-all text-gray-400 hover:text-white';
  }
}

// FAQ
function toggleFaq(i) {
  const answer = document.querySelector('.faq-answer-' + i);
  const icon = document.querySelector('.faq-icon-' + i);
  answer.classList.toggle('hidden');
  icon.style.transform = answer.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
}
</script>

</body>
</html>`);
});

// ============================================================
// EXPLORER PAGE
// ============================================================
app.get('/explorer', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Explorer - LogoHub API</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<style>
body { background: #0a0a0f; }
.glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
.glass-hover:hover { background: rgba(255,255,255,0.06); border-color: rgba(79,70,229,0.4); transition: all 0.3s ease; }
.gradient-text { background: linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #F472B6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.logo-card { transition: all 0.3s ease; cursor: pointer; }
.logo-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(79,70,229,0.2); border-color: rgba(79,70,229,0.5); }
.search-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; }
.search-input:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
.nav-blur { background: rgba(10,10,15,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
.color-swatch { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); display: inline-block; }
.category-pill { transition: all 0.2s ease; cursor: pointer; }
.category-pill.active { background: #4F46E5; color: white; border-color: #4F46E5; }
</style>
</head>
<body class="text-white min-h-screen">

<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">L</div>
      LogoHub <span class="text-indigo-400 ml-1">API</span>
    </a>
    <div class="flex items-center gap-4">
      <a href="/docs" class="text-sm text-gray-400 hover:text-white transition-colors">Docs</a>
      <a href="/dashboard" class="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition-all">Dashboard</a>
    </div>
  </div>
</nav>

<div class="pt-24 px-4 pb-20">
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-black mb-2">Asset <span class="gradient-text">Explorer</span></h1>
      <p class="text-gray-400">Browse and search 50,000+ logos, icons, flags and emblems</p>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="relative flex-1">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
        <input id="explorerSearch" type="text" placeholder="Search logos, brands, teams..." class="search-input w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-500">
      </div>
      <select id="categoryFilter" class="search-input px-4 py-3 rounded-xl text-gray-300 cursor-pointer">
        <option value="">All Categories</option>
        <option value="technology">Technology</option>
        <option value="social">Social Media</option>
        <option value="streaming">Streaming</option>
        <option value="brands">Brands</option>
        <option value="automotive">Automotive</option>
        <option value="fintech">Fintech</option>
        <option value="crypto">Crypto</option>
        <option value="framework">Frameworks</option>
        <option value="language">Languages</option>
        <option value="database">Databases</option>
        <option value="cloud">Cloud</option>
      </select>
    </div>

    <!-- Category Pills -->
    <div class="flex flex-wrap gap-2 mb-8">
      ${[['All',''], ['⚽ Football','football'], ['🏀 Basketball','basketball'], ['🏁 F1','formula1'], ['🏁 Flags','flags'], ['₿ Crypto','crypto']].map(([label, val]) => `
      <button onclick="filterSport('${val}')" class="category-pill glass px-4 py-1.5 rounded-full text-sm text-gray-400 hover:text-white border border-white/10 ${val===''?'active':''}">
        ${label}
      </button>`).join('')}
    </div>

    <!-- Results -->
    <div id="explorerResults" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div class="col-span-full text-center text-gray-500 py-10">
        <i class="fas fa-spinner fa-spin text-2xl mb-3 block text-indigo-400"></i>
        Loading assets...
      </div>
    </div>

    <!-- Load More -->
    <div class="text-center mt-10">
      <button id="loadMoreBtn" onclick="loadMore()" class="glass glass-hover px-8 py-3 rounded-xl text-gray-400 hover:text-white transition-all font-medium hidden">
        Load More Assets
      </button>
    </div>
  </div>
</div>

<!-- Detail Modal -->
<div id="modal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4" onclick="closeModal(event)">
  <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
  <div class="glass rounded-2xl p-8 max-w-md w-full relative z-10" onclick="event.stopPropagation()">
    <button onclick="document.getElementById('modal').classList.add('hidden')" class="absolute top-4 right-4 text-gray-500 hover:text-white">
      <i class="fas fa-times text-xl"></i>
    </button>
    <div id="modalContent"></div>
  </div>
</div>

<script>
let currentPage = 1;
let currentQuery = '';
let currentCategory = '';
let currentSport = '';
let allData = [];

async function loadData() {
  const res = await fetch('/api/v1/logos?limit=48');
  const json = await res.json();
  allData = json.data;
  renderResults(allData);
}

function renderResults(items, append = false) {
  const container = document.getElementById('explorerResults');
  if (!append) container.innerHTML = '';
  if (!items || items.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-16"><i class="fas fa-search text-4xl mb-4 block opacity-30"></i>No results found</div>';
    return;
  }
  const html = items.map(item => \`
    <div class="logo-card glass rounded-xl p-4 flex flex-col items-center justify-center gap-3 group border border-white/5" onclick="showDetail(\${JSON.stringify(item).replace(/"/g, '&quot;')})">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xl font-black text-indigo-300 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
        \${(item.name || item.slug || '?')[0].toUpperCase()}
      </div>
      <div class="text-center">
        <div class="text-sm font-semibold text-white truncate w-full max-w-[100px]">\${item.name || item.slug}</div>
        <div class="text-xs text-gray-500 mt-0.5">\${item.category || item.sport || ''}</div>
      </div>
      <div class="flex gap-1">
        \${(item.colors || []).slice(0,4).map(c => \`<span class="color-swatch" style="background:\${c}" title="\${c}"></span>\`).join('')}
      </div>
    </div>
  \`).join('');
  container.insertAdjacentHTML('beforeend', html);
}

function showDetail(item) {
  document.getElementById('modalContent').innerHTML = \`
    <div class="flex flex-col items-center text-center">
      <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center text-4xl font-black text-indigo-300 mb-4">
        \${(item.name || item.slug)[0]}
      </div>
      <h3 class="text-2xl font-black mb-1">\${item.name || item.slug}</h3>
      <span class="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full mb-4">\${item.category || item.sport || 'unknown'}</span>
      <p class="text-gray-400 text-sm mb-6">\${item.description || ''}</p>
      <div class="flex gap-2 mb-6">
        \${(item.colors || []).map(c => \`<span class="color-swatch w-8 h-8" style="background:\${c}" title="\${c}"></span>\`).join('')}
      </div>
      <div class="w-full space-y-3 text-left">
        \${item.website ? \`<a href="\${item.website}" target="_blank" class="flex items-center gap-3 glass rounded-lg p-3 hover:bg-white/5 transition-colors">
          <i class="fas fa-external-link-alt text-indigo-400 w-4"></i>
          <span class="text-sm text-gray-300">\${item.website}</span>
        </a>\` : ''}
        \${item.svg ? \`<a href="\${item.svg}" target="_blank" class="flex items-center gap-3 glass rounded-lg p-3 hover:bg-white/5 transition-colors">
          <i class="fas fa-file-code text-blue-400 w-4"></i>
          <span class="text-sm text-gray-300">Download SVG</span>
        </a>\` : ''}
        \${item.png ? \`<a href="\${item.png}" target="_blank" class="flex items-center gap-3 glass rounded-lg p-3 hover:bg-white/5 transition-colors">
          <i class="fas fa-image text-green-400 w-4"></i>
          <span class="text-sm text-gray-300">Download PNG</span>
        </a>\` : ''}
      </div>
      <div class="mt-6 p-3 bg-black/30 rounded-xl w-full">
        <code class="text-xs text-indigo-300">GET /api/v1/logo/\${item.slug}</code>
      </div>
    </div>
  \`;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.add('hidden');
  }
}

let searchTimeout;
document.getElementById('explorerSearch').addEventListener('input', function() {
  clearTimeout(searchTimeout);
  const q = this.value.trim();
  if (q.length < 1) { loadData(); return; }
  searchTimeout = setTimeout(async () => {
    const res = await fetch('/api/v1/search?q=' + encodeURIComponent(q) + '&limit=48');
    const json = await res.json();
    renderResults(json.data);
  }, 300);
});

document.getElementById('categoryFilter').addEventListener('change', async function() {
  const cat = this.value;
  if (!cat) { loadData(); return; }
  const res = await fetch('/api/v1/category/' + cat + '?limit=48');
  const json = await res.json();
  renderResults(json.data);
});

async function filterSport(sport) {
  document.querySelectorAll('.category-pill').forEach((el, i) => {
    el.classList.toggle('active', el.textContent.trim().endsWith(sport) || (sport==='' && i===0));
  });
  if (!sport) { loadData(); return; }
  let url = '/api/v1/' + sport;
  const res = await fetch(url);
  const json = await res.json();
  renderResults(json.data);
}

loadData();

// Check URL params
const params = new URLSearchParams(window.location.search);
if (params.get('category')) {
  document.getElementById('categoryFilter').value = params.get('category');
  document.getElementById('categoryFilter').dispatchEvent(new Event('change'));
}
</script>
</body>
</html>`);
});

// ============================================================
// DOCS PAGE
// ============================================================
app.get('/docs', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Documentation - LogoHub API</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<style>
body { background: #0a0a0f; }
.glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
.glass-hover:hover { background: rgba(255,255,255,0.06); border-color: rgba(79,70,229,0.4); }
.gradient-text { background: linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #F472B6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.nav-blur { background: rgba(10,10,15,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
.code-block { background: rgba(0,0,0,0.6); border: 1px solid rgba(79,70,229,0.3); border-radius: 12px; font-family: monospace; }
.sidebar-link { display: block; padding: 8px 12px; border-radius: 8px; font-size: 14px; color: #6b7280; transition: all 0.2s; }
.sidebar-link:hover { color: white; background: rgba(255,255,255,0.05); }
.sidebar-link.active { color: #818CF8; background: rgba(79,70,229,0.1); }
.endpoint-pill { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
.get { background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
.section-header { scroll-margin-top: 100px; }
::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #4F46E5; border-radius: 3px; }
</style>
</head>
<body class="text-white min-h-screen">

<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">L</div>
      LogoHub <span class="text-indigo-400 ml-1">API</span>
    </a>
    <div class="flex items-center gap-4">
      <a href="/explorer" class="text-sm text-gray-400 hover:text-white">Explorer</a>
      <a href="/dashboard" class="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium transition-all">Dashboard</a>
    </div>
  </div>
</nav>

<div class="flex pt-16">
  <!-- Sidebar -->
  <aside class="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto border-r border-white/5 p-6 hidden lg:block">
    <div class="space-y-6">
      ${[
        ['Getting Started', [['Quick Start','#quickstart'],['Authentication','#auth'],['Rate Limits','#limits']]],
        ['Endpoints', [['Logos','#logos'],['Search','#search'],['Categories','#categories'],['Football','#football'],['Basketball','#basketball'],['Flags','#flags'],['Crypto','#crypto'],['Frameworks','#frameworks'],['Languages','#languages'],['Cloud','#cloud']]],
        ['SDKs', [['JavaScript','#sdk-js'],['Python','#sdk-python'],['cURL','#sdk-curl']]],
        ['Advanced', [['Transformations','#transforms'],['CDN','#cdn-docs'],['Webhooks','#webhooks'],['GraphQL','#graphql']]],
      ].map(([section, links]) => `
      <div>
        <div class="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">${section}</div>
        <div class="space-y-0.5">
          ${(links as [string,string][]).map(([label, href]) => `<a href="${href}" class="sidebar-link">${label}</a>`).join('')}
        </div>
      </div>`).join('')}
    </div>
  </aside>

  <!-- Content -->
  <main class="lg:ml-64 flex-1 px-6 py-10 max-w-4xl mx-auto">

    <div class="mb-12">
      <div class="inline-block text-indigo-400 text-sm font-semibold bg-indigo-500/10 px-4 py-2 rounded-full mb-4">Documentation</div>
      <h1 class="text-5xl font-black mb-4">LogoHub <span class="gradient-text">API Reference</span></h1>
      <p class="text-xl text-gray-400">Everything you need to integrate the world's largest visual identity API into your application.</p>
    </div>

    <!-- Base URL -->
    <div class="glass rounded-xl p-6 mb-12">
      <h3 class="font-semibold mb-3 flex items-center gap-2"><i class="fas fa-server text-indigo-400"></i> Base URL</h3>
      <code class="text-indigo-300 text-lg">https://api.logohub.dev/v1</code>
    </div>

    <!-- QUICK START -->
    <section id="quickstart" class="section-header mb-16">
      <h2 class="text-3xl font-black mb-6 pb-4 border-b border-white/10">Quick Start</h2>
      <p class="text-gray-400 mb-6">Get your first logo in under 2 minutes. No authentication required for the free tier.</p>
      <pre class="code-block p-6 text-sm text-gray-300 overflow-x-auto mb-4"><code><span class="text-gray-500"># Fetch a logo</span>
curl https://api.logohub.dev/v1/logo/google

<span class="text-gray-500"># Search for logos</span>
curl "https://api.logohub.dev/v1/search?q=spotify"

<span class="text-gray-500"># Get a country flag</span>
curl https://api.logohub.dev/v1/flags/portugal</code></pre>
    </section>

    <!-- AUTH -->
    <section id="auth" class="section-header mb-16">
      <h2 class="text-3xl font-black mb-6 pb-4 border-b border-white/10">Authentication</h2>
      <p class="text-gray-400 mb-6">Pass your API key via the <code class="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">X-API-Key</code> header or as a query parameter.</p>
      <pre class="code-block p-6 text-sm text-gray-300 overflow-x-auto"><code><span class="text-gray-500"># Header authentication (recommended)</span>
curl -H "X-API-Key: lh_live_xxxxxxxxxxxx" \\
  https://api.logohub.dev/v1/logo/apple

<span class="text-gray-500"># Query parameter</span>
curl "https://api.logohub.dev/v1/logo/apple?api_key=lh_live_xxxxxxxxxxxx"</code></pre>
    </section>

    <!-- ENDPOINTS TABLE -->
    <section id="logos" class="section-header mb-16">
      <h2 class="text-3xl font-black mb-6 pb-4 border-b border-white/10">All Endpoints</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-gray-500 border-b border-white/10">
              <th class="pb-3 pr-6">Method</th>
              <th class="pb-3 pr-6">Endpoint</th>
              <th class="pb-3">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            ${[
              ['GET','/api/v1/logo/:slug','Get a specific logo by slug'],
              ['GET','/api/v1/logos','List all logos (paginated)'],
              ['GET','/api/v1/search?q=...','Search all assets'],
              ['GET','/api/v1/categories','List all categories'],
              ['GET','/api/v1/category/:slug','Get logos by category'],
              ['GET','/api/v1/football','List all football teams'],
              ['GET','/api/v1/football/:slug','Get a football team'],
              ['GET','/api/v1/basketball','List all basketball teams'],
              ['GET','/api/v1/basketball/:slug','Get a basketball team'],
              ['GET','/api/v1/formula1','List all F1 teams'],
              ['GET','/api/v1/formula1/:slug','Get a F1 team'],
              ['GET','/api/v1/flags','List all flags'],
              ['GET','/api/v1/flags/:slug','Get a country flag'],
              ['GET','/api/v1/crypto','List all cryptocurrencies'],
              ['GET','/api/v1/crypto/:slug','Get a cryptocurrency'],
              ['GET','/api/v1/frameworks','List all frameworks'],
              ['GET','/api/v1/framework/:slug','Get a framework'],
              ['GET','/api/v1/languages','List all languages'],
              ['GET','/api/v1/language/:slug','Get a language'],
              ['GET','/api/v1/cloud','List cloud providers'],
              ['GET','/api/v1/cloud/:slug','Get a cloud provider'],
              ['GET','/api/v1/stats','API statistics'],
              ['GET','/api/v1/health','Health check'],
            ].map(([method, ep, desc]) => `
            <tr class="hover:bg-white/2">
              <td class="py-3 pr-6"><span class="endpoint-pill get">${method}</span></td>
              <td class="py-3 pr-6"><code class="text-indigo-300 text-xs">${ep}</code></td>
              <td class="py-3 text-gray-400">${desc}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- RESPONSE FORMAT -->
    <section id="search" class="section-header mb-16">
      <h2 class="text-3xl font-black mb-6 pb-4 border-b border-white/10">Response Format</h2>
      <p class="text-gray-400 mb-6">All responses follow a consistent JSON structure with a <code class="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">data</code> field and a <code class="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">meta</code> field.</p>
      <pre class="code-block p-6 text-sm text-gray-300 overflow-x-auto"><code>{
  "data": {
    "id": "1",
    "slug": "google",
    "name": "Google",
    "aliases": ["alphabet", "googl"],
    "description": "Search engine and technology company",
    "website": "https://google.com",
    "category": "technology",
    "subcategory": "search",
    "country": "US",
    "colors": ["#4285F4", "#EA4335", "#FBBC05", "#34A853"],
    "svg": "https://cdn.logohub.dev/logos/google.svg",
    "png": "https://cdn.logohub.dev/logos/google.png",
    "webp": "https://cdn.logohub.dev/logos/google.webp",
    "favicon": "https://cdn.logohub.dev/favicons/google.png",
    "verified": true,
    "tags": ["search", "tech", "cloud"]
  },
  "meta": {
    "version": "v1",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}</code></pre>
    </section>

    <!-- CDN -->
    <section id="cdn-docs" class="section-header mb-16">
      <h2 class="text-3xl font-black mb-6 pb-4 border-b border-white/10">CDN & Transformations</h2>
      <p class="text-gray-400 mb-6">Access assets directly from our global CDN with on-the-fly transformations via URL parameters.</p>
      <div class="glass rounded-xl p-6 mb-6">
        <h3 class="font-semibold mb-4">URL Parameters</h3>
        <div class="grid sm:grid-cols-2 gap-3">
          ${[
            ['?w=200', 'Width in pixels'],
            ['?h=300', 'Height in pixels'],
            ['?size=128', 'Square size'],
            ['?padding=20', 'Padding in pixels'],
            ['?background=ffffff', 'Background color (hex)'],
            ['?rounded=true', 'Rounded corners'],
            ['?shadow=true', 'Add drop shadow'],
            ['?grayscale=true', 'Convert to grayscale'],
            ['?format=webp', 'Output format (svg/png/webp/jpg/ico/avif)'],
            ['?quality=90', 'Image quality (1-100)'],
          ].map(([param, desc]) => `
          <div class="flex gap-3">
            <code class="text-indigo-300 text-xs bg-indigo-500/10 px-2 py-1 rounded whitespace-nowrap">${param}</code>
            <span class="text-gray-400 text-sm">${desc}</span>
          </div>`).join('')}
        </div>
      </div>
      <pre class="code-block p-4 text-sm text-gray-300 overflow-x-auto"><code>https://cdn.logohub.dev/logo/google.png?w=200&background=ffffff&rounded=true
https://cdn.logohub.dev/logo/apple.svg?size=64&grayscale=true
https://cdn.logohub.dev/logo/nike.png?size=128&padding=20&format=webp</code></pre>
    </section>

    <!-- JS SDK -->
    <section id="sdk-js" class="section-header mb-16">
      <h2 class="text-3xl font-black mb-6 pb-4 border-b border-white/10">JavaScript SDK</h2>
      <pre class="code-block p-6 text-sm text-gray-300 overflow-x-auto"><code><span class="text-gray-500">// Install</span>
npm install logohub

<span class="text-gray-500">// Initialize</span>
import { LogoHub } from 'logohub';
const client = new LogoHub('lh_live_xxxxxxxxxxxx');

<span class="text-gray-500">// Get a logo</span>
const logo = await client.logos.get('google');
console.log(logo.svg, logo.colors);

<span class="text-gray-500">// Search</span>
const results = await client.search('real madrid', { type: 'sports' });

<span class="text-gray-500">// Get flag</span>
const flag = await client.flags.get('portugal');

<span class="text-gray-500">// Get crypto</span>
const btc = await client.crypto.get('bitcoin');

<span class="text-gray-500">// List frameworks</span>
const frameworks = await client.frameworks.list();</code></pre>
    </section>

    <!-- PYTHON SDK -->
    <section id="sdk-python" class="section-header mb-16">
      <h2 class="text-3xl font-black mb-6 pb-4 border-b border-white/10">Python SDK</h2>
      <pre class="code-block p-6 text-sm text-gray-300 overflow-x-auto"><code><span class="text-gray-500"># Install</span>
pip install logohub

<span class="text-gray-500"># Initialize</span>
from logohub import LogoHub
client = LogoHub('lh_live_xxxxxxxxxxxx')

<span class="text-gray-500"># Get a logo</span>
logo = client.logos.get('apple')
print(logo.svg, logo.colors)

<span class="text-gray-500"># Search</span>
results = client.search('barcelona')

<span class="text-gray-500"># Get flag</span>
flag = client.flags.get('brazil')

<span class="text-gray-500"># Get football team</span>
team = client.football.get('real-madrid')</code></pre>
    </section>

    <!-- Live Playground -->
    <section class="section-header mb-16">
      <h2 class="text-3xl font-black mb-6 pb-4 border-b border-white/10">Live Playground</h2>
      <p class="text-gray-400 mb-6">Test the API directly from your browser:</p>
      <div class="glass rounded-xl p-6">
        <div class="flex gap-3 mb-4">
          <select id="playEndpoint" class="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300">
            <option value="/api/v1/stats">GET /api/v1/stats</option>
            <option value="/api/v1/logo/google">GET /api/v1/logo/google</option>
            <option value="/api/v1/search?q=spotify">GET /api/v1/search?q=spotify</option>
            <option value="/api/v1/flags/portugal">GET /api/v1/flags/portugal</option>
            <option value="/api/v1/crypto/bitcoin">GET /api/v1/crypto/bitcoin</option>
            <option value="/api/v1/football/barcelona">GET /api/v1/football/barcelona</option>
            <option value="/api/v1/categories">GET /api/v1/categories</option>
          </select>
          <button onclick="runPlayground()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all">
            <i class="fas fa-play mr-2"></i>Run
          </button>
        </div>
        <pre id="playResult" class="code-block p-4 text-xs text-gray-400 overflow-x-auto max-h-64 rounded-xl">// Click "Run" to execute the request</pre>
      </div>
    </section>

  </main>
</div>

<script>
async function runPlayground() {
  const endpoint = document.getElementById('playEndpoint').value;
  const pre = document.getElementById('playResult');
  pre.textContent = '⏳ Loading...';
  try {
    const res = await fetch(endpoint);
    const json = await res.json();
    pre.textContent = JSON.stringify(json, null, 2);
  } catch (e) {
    pre.textContent = 'Error: ' + e.message;
  }
}

// Highlight active sidebar link on scroll
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});
</script>
</body>
</html>`);
});

// ============================================================
// DASHBOARD PAGE
// ============================================================
app.get('/dashboard', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard - LogoHub API</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
body { background: #0a0a0f; }
.glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
.glass-hover:hover { background: rgba(255,255,255,0.06); border-color: rgba(79,70,229,0.4); }
.gradient-text { background: linear-gradient(135deg, #818CF8 0%, #C084FC 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.nav-blur { background: rgba(10,10,15,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
.sidebar { background: #0d0d14; border-right: 1px solid rgba(255,255,255,0.05); }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 10px; font-size: 14px; color: #6b7280; transition: all 0.2s; cursor: pointer; }
.nav-item:hover, .nav-item.active { background: rgba(79,70,229,0.15); color: white; }
.nav-item i { width: 18px; text-align: center; }
.stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; }
.key-badge { font-family: monospace; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 12px; font-size: 13px; color: #a5b4fc; }
.tab-btn { padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: all 0.2s; color: #6b7280; cursor: pointer; }
.tab-btn.active { background: #4F46E5; color: white; }
</style>
</head>
<body class="text-white min-h-screen flex">

<!-- Sidebar -->
<aside class="sidebar fixed left-0 top-0 bottom-0 w-64 p-6 flex flex-col hidden lg:flex">
  <a href="/" class="flex items-center gap-2 font-bold mb-10">
    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">L</div>
    LogoHub API
  </a>
  <nav class="space-y-1 flex-1">
    ${[
      ['fas fa-chart-bar','Overview','overview'],
      ['fas fa-key','API Keys','keys'],
      ['fas fa-chart-line','Analytics','analytics'],
      ['fas fa-history','Request Logs','logs'],
      ['fas fa-file-invoice-dollar','Billing','billing'],
      ['fas fa-users','Team','team'],
      ['fas fa-cog','Settings','settings'],
    ].map(([icon, label, id], i) => `
    <div class="nav-item ${i===0?'active':''}" onclick="showTab('${id}', this)">
      <i class="${icon}"></i>${label}
    </div>`).join('')}
  </nav>
  <div class="glass rounded-xl p-4 mt-6">
    <div class="text-xs text-gray-500 mb-1">Current Plan</div>
    <div class="font-bold text-indigo-400">Free</div>
    <div class="text-xs text-gray-500 mt-1">847 / 1,000 req today</div>
    <div class="mt-2 bg-white/10 rounded-full h-1.5">
      <div class="bg-indigo-500 h-1.5 rounded-full" style="width:84.7%"></div>
    </div>
    <a href="#" class="mt-3 block text-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg transition-all">Upgrade to Pro</a>
  </div>
</aside>

<!-- Main Content -->
<main class="lg:ml-64 flex-1 flex flex-col">
  <!-- Top Bar -->
  <header class="sticky top-0 z-40 nav-blur px-6 py-4 flex items-center justify-between">
    <div>
      <h1 class="font-bold text-xl">Dashboard</h1>
      <p class="text-xs text-gray-500">Welcome back, Developer!</p>
    </div>
    <div class="flex items-center gap-3">
      <button class="glass px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white glass-hover transition-all">
        <i class="fas fa-plus mr-2"></i>New API Key
      </button>
      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm cursor-pointer">D</div>
    </div>
  </header>

  <div class="flex-1 p-6 space-y-6">

    <!-- OVERVIEW TAB -->
    <div id="tab-overview">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        ${[
          ['fas fa-chart-bar','text-indigo-400','bg-indigo-500/10','Total Requests','248,391','+12.3%'],
          ['fas fa-bolt','text-yellow-400','bg-yellow-500/10','Avg Latency','18ms','-2ms'],
          ['fas fa-check-circle','text-green-400','bg-green-500/10','Success Rate','99.8%','+0.1%'],
          ['fas fa-exclamation-triangle','text-red-400','bg-red-500/10','Errors (24h)','3','−67%'],
        ].map(([icon, color, bg, label, value, change]) => `
        <div class="stat-card">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 ${bg} rounded-xl flex items-center justify-center">
              <i class="${icon} ${color}"></i>
            </div>
            <span class="text-xs ${change.startsWith('+')?'text-green-400':'text-red-400'}">${change}</span>
          </div>
          <div class="text-2xl font-black">${value}</div>
          <div class="text-sm text-gray-500 mt-1">${label}</div>
        </div>`).join('')}
      </div>

      <!-- Charts -->
      <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <div class="glass rounded-2xl p-6">
          <h3 class="font-semibold mb-4">Requests (Last 7 Days)</h3>
          <canvas id="requestChart" height="120"></canvas>
        </div>
        <div class="glass rounded-2xl p-6">
          <h3 class="font-semibold mb-4">Top Endpoints</h3>
          <div class="space-y-3">
            ${[
              ['/api/v1/logo/*','45%','bg-indigo-500'],
              ['/api/v1/search','28%','bg-purple-500'],
              ['/api/v1/flags/*','14%','bg-blue-500'],
              ['/api/v1/crypto/*','9%','bg-yellow-500'],
              ['/api/v1/football/*','4%','bg-green-500'],
            ].map(([ep, pct, color]) => `
            <div>
              <div class="flex justify-between text-sm mb-1">
                <code class="text-gray-400 text-xs">${ep}</code>
                <span class="text-gray-400">${pct}</span>
              </div>
              <div class="bg-white/10 rounded-full h-1.5">
                <div class="${color} h-1.5 rounded-full" style="width:${pct}"></div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- API Keys -->
      <div class="glass rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-semibold">API Keys</h3>
          <button class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-all">
            <i class="fas fa-plus mr-2"></i>Create New Key
          </button>
        </div>
        <div class="space-y-3">
          ${[
            ['Production Key','lh_live_sk_xxxxxxxxxxxx','Active','12,483 reqs','2 hours ago'],
            ['Development Key','lh_test_sk_yyyyyyyyyyyy','Active','847 reqs','5 min ago'],
          ].map(([name, key, status, reqs, last]) => `
          <div class="flex items-center justify-between p-4 bg-black/20 rounded-xl">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <i class="fas fa-key text-indigo-400"></i>
              </div>
              <div>
                <div class="font-medium text-sm">${name}</div>
                <div class="key-badge mt-1">${key.substring(0,20)}...</div>
              </div>
            </div>
            <div class="hidden sm:flex items-center gap-6 text-sm text-gray-500">
              <span class="text-green-400 flex items-center gap-1"><span class="w-1.5 h-1.5 bg-green-400 rounded-full"></span>${status}</span>
              <span>${reqs}</span>
              <span>${last}</span>
            </div>
            <div class="flex gap-2">
              <button class="glass glass-hover px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-all">Copy</button>
              <button class="text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs transition-all">Revoke</button>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>

  </div>
</main>

<script>
// Chart
const ctx = document.getElementById('requestChart');
if (ctx) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        data: [18234, 24561, 19823, 35621, 42183, 28934, 38291],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79,70,229,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4F46E5',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', font: { size: 11 } } }
      }
    }
  });
}

function showTab(id, el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}
</script>
</body>
</html>`);
});

// ============================================================
// ADMIN PAGE
// ============================================================
app.get('/admin', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Panel - LogoHub API</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<style>
body { background: #0a0a0f; }
.glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
.glass-hover:hover { background: rgba(255,255,255,0.06); border-color: rgba(79,70,229,0.4); }
.gradient-text { background: linear-gradient(135deg, #818CF8 0%, #C084FC 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.sidebar { background: #0d0d14; border-right: 1px solid rgba(255,255,255,0.05); }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 10px; font-size: 14px; color: #6b7280; transition: all 0.2s; cursor: pointer; }
.nav-item:hover, .nav-item.active { background: rgba(239,68,68,0.15); color: white; }
.badge { font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
.badge-green { background: rgba(16,185,129,0.15); color: #10B981; }
.badge-blue { background: rgba(59,130,246,0.15); color: #60A5FA; }
.badge-yellow { background: rgba(245,158,11,0.15); color: #F59E0B; }
.badge-red { background: rgba(239,68,68,0.15); color: #EF4444; }
table { width: 100%; border-collapse: collapse; }
th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; border-bottom: 1px solid rgba(255,255,255,0.05); }
td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.03); }
tr:hover td { background: rgba(255,255,255,0.02); }
</style>
</head>
<body class="text-white min-h-screen flex">

<aside class="sidebar fixed left-0 top-0 bottom-0 w-64 p-6 flex flex-col hidden lg:flex">
  <div class="flex items-center gap-2 font-bold mb-2">
    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center font-bold text-sm">A</div>
    Admin Panel
  </div>
  <div class="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full mb-8 inline-flex items-center gap-1 w-fit">
    <i class="fas fa-shield-alt"></i> Administrator
  </div>
  <nav class="space-y-1">
    ${[
      ['fas fa-tachometer-alt','Dashboard','#'],
      ['fas fa-images','Logos','#'],
      ['fas fa-tags','Categories','#'],
      ['fas fa-users','Users','#'],
      ['fas fa-key','API Keys','#'],
      ['fas fa-chart-line','Analytics','#'],
      ['fas fa-check-circle','Moderation','#'],
      ['fas fa-file-import','Bulk Import','#'],
      ['fas fa-credit-card','Payments','#'],
      ['fas fa-cog','Settings','#'],
    ].map(([icon, label, href], i) => `
    <a href="${href}" class="nav-item ${i===0?'active':''}">
      <i class="${icon}"></i>${label}
    </a>`).join('')}
  </nav>
</aside>

<main class="lg:ml-64 flex-1">
  <header class="sticky top-0 z-40 glass px-6 py-4 flex items-center justify-between border-b border-white/5">
    <h1 class="font-bold text-xl">Logo <span class="gradient-text">Management</span></h1>
    <div class="flex gap-3">
      <button onclick="document.getElementById('addModal').classList.remove('hidden')" class="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-2">
        <i class="fas fa-plus"></i> Add Logo
      </button>
      <button class="glass glass-hover px-4 py-2 rounded-lg text-sm text-gray-400 flex items-center gap-2">
        <i class="fas fa-file-import"></i> Bulk Import
      </button>
    </div>
  </header>

  <div class="p-6 space-y-6">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      ${[
        ['50,234','Total Assets','fas fa-images','text-blue-400','bg-blue-500/10'],
        ['1,247','Pending Review','fas fa-clock','text-yellow-400','bg-yellow-500/10'],
        ['12,483','Verified','fas fa-check','text-green-400','bg-green-500/10'],
        ['89','Rejected','fas fa-times','text-red-400','bg-red-500/10'],
      ].map(([num, label, icon, color, bg]) => `
      <div class="glass rounded-xl p-5">
        <div class="w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3">
          <i class="${icon} ${color}"></i>
        </div>
        <div class="text-2xl font-black">${num}</div>
        <div class="text-sm text-gray-500">${label}</div>
      </div>`).join('')}
    </div>

    <!-- Search & Filter -->
    <div class="glass rounded-2xl p-6">
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <input type="text" placeholder="Search logos..." class="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500">
        <select class="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300">
          <option>All Categories</option>
          <option>Technology</option>
          <option>Sports</option>
          <option>Crypto</option>
        </select>
        <select class="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300">
          <option>All Status</option>
          <option>Verified</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Category</th>
              <th>Formats</th>
              <th>Status</th>
              <th>Requests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${[
              ['Google','technology','SVG/PNG/WEBP','Verified','45,231'],
              ['Apple','technology','SVG/PNG','Verified','38,492'],
              ['Real Madrid','sports','SVG/PNG','Verified','28,341'],
              ['Bitcoin','crypto','SVG/PNG/WEBP','Verified','21,832'],
              ['React','framework','SVG/PNG','Verified','19,234'],
              ['Portugal Flag','flags','SVG/PNG','Verified','15,921'],
              ['Tesla','automotive','SVG/PNG','Pending','—'],
              ['Unknown Brand','brands','PNG only','Pending','—'],
            ].map(([name, cat, formats, status, reqs]) => `
            <tr>
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-indigo-300">
                    ${name[0]}
                  </div>
                  <span class="font-medium">${name}</span>
                </div>
              </td>
              <td><span class="text-gray-400 text-sm">${cat}</span></td>
              <td><span class="text-gray-500 text-xs">${formats}</span></td>
              <td><span class="badge ${status === 'Verified' ? 'badge-green' : 'badge-yellow'}">${status}</span></td>
              <td><span class="text-gray-400 text-sm">${reqs}</span></td>
              <td>
                <div class="flex gap-2">
                  <button class="text-xs glass glass-hover px-2 py-1 rounded text-gray-400 hover:text-white transition-all">Edit</button>
                  ${status === 'Pending' ? '<button class="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded hover:bg-green-500/30 transition-all">Approve</button><button class="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition-all">Reject</button>' : ''}
                  <button class="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded transition-all">Delete</button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</main>

<!-- Add Logo Modal -->
<div id="addModal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
  <div class="glass rounded-2xl p-8 max-w-lg w-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">Add New Logo</h2>
      <button onclick="document.getElementById('addModal').classList.add('hidden')" class="text-gray-500 hover:text-white">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>
    <form class="space-y-4" onsubmit="return false">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Name *</label>
          <input type="text" class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Google">
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Slug *</label>
          <input type="text" class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. google">
        </div>
      </div>
      <div>
        <label class="text-sm text-gray-400 mb-1 block">Category *</label>
        <select class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500">
          <option>technology</option><option>social</option><option>sports</option><option>crypto</option><option>framework</option><option>language</option>
        </select>
      </div>
      <div>
        <label class="text-sm text-gray-400 mb-1 block">Website</label>
        <input type="url" class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="https://example.com">
      </div>
      <div>
        <label class="text-sm text-gray-400 mb-1 block">Upload SVG</label>
        <div class="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors cursor-pointer">
          <i class="fas fa-cloud-upload-alt text-3xl text-gray-600 mb-2 block"></i>
          <span class="text-sm text-gray-500">Drop SVG file here or click to browse</span>
        </div>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="submit" class="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl font-semibold transition-all">Add Logo</button>
        <button type="button" onclick="document.getElementById('addModal').classList.add('hidden')" class="glass glass-hover px-6 py-2.5 rounded-xl text-gray-400 hover:text-white transition-all">Cancel</button>
      </div>
    </form>
  </div>
</div>

</body>
</html>`);
});

// ============================================================
// PRICING PAGE
// ============================================================
app.get('/pricing', (c) => c.redirect('/#pricing'));

export default app;
