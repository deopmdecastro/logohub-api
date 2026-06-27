// Blog pages — list & single post
import { HEAD, COMMON_JS } from './shared';

// ============================================================
// /blog  — Blog listing
// ============================================================
export function blogListPage() {
  return `${HEAD('Blog — LogoHub API', COMMON_JS)}
<body class="font-sans">
<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>
      <span class="font-bold text-lg tracking-tight">LogoHub <span class="gradient-text-lilac">API</span></span>
    </a>
    <div class="hidden md:flex items-center gap-7 text-sm" style="color:var(--text-soft)">
      <a href="/docs" class="hover:text-white transition-colors">Docs</a>
      <a href="/explorer" class="hover:text-white transition-colors">Explorer</a>
      <a href="/playground" class="hover:text-white transition-colors">Playground</a>
      <a href="/blog" class="hover:text-white transition-colors font-semibold" style="color:var(--text)">Blog</a>
      <a href="/faq" class="hover:text-white transition-colors">FAQ</a>
    </div>
    <div class="flex items-center gap-2">
      <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon" title="Toggle theme"><i class="fas fa-sun"></i></button>
      <a href="/login" class="btn btn-primary btn-sm">Dashboard</a>
    </div>
  </div>
</nav>

<section class="pt-28 pb-20 px-4">
  <div class="max-w-5xl mx-auto">
    <div class="text-center mb-12 animate-fade-up">
      <span class="pill pill-lilac mb-4">Blog</span>
      <h1 class="text-4xl sm:text-5xl font-black mb-3 tracking-tight" style="color:var(--text)">Latest <span class="gradient-text">Articles</span></h1>
      <p class="text-lg" style="color:var(--text-soft)">API updates, tutorials, and visual identity insights.</p>
    </div>

    <!-- Category tabs -->
    <div class="flex flex-wrap justify-center gap-2 mb-8" id="blogCategories"></div>

    <!-- Blog grid -->
    <div id="blogGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up"></div>
  </div>
</section>

<script>
let POSTS = [];
let activeCat = '';

async function loadPosts() {
  try {
    const res = await fetch('/api/admin/blog?status=published');
    const json = await res.json();
    POSTS = json.data || [];
    renderCategories();
    renderPosts();
  } catch(e) {
    document.getElementById('blogGrid').innerHTML = '<div class="col-span-full empty-state"><i class="fas fa-exclamation-triangle text-3xl mb-3 opacity-30 block"></i>Failed to load blog posts</div>';
  }
}

function renderCategories() {
  const cats = [...new Set(POSTS.map(p => p.category || 'General'))];
  const html = '<button class="pill '+(activeCat===''?'pill-lilac':'pill-neutral')+'" onclick="filterCat(\\'\\')">All</button>' +
    cats.map(c => '<button class="pill '+(activeCat===c?'pill-lilac':'pill-neutral')+'" onclick="filterCat(\\''+escAttr(c)+'\\')">'+esc(c)+'</button>').join('');
  document.getElementById('blogCategories').innerHTML = html;
}

function filterCat(cat) { activeCat = cat; renderCategories(); renderPosts(); }

function renderPosts() {
  let items = POSTS;
  if (activeCat) items = items.filter(p => p.category === activeCat);

  if (!items.length) {
    document.getElementById('blogGrid').innerHTML = '<div class="col-span-full empty-state"><i class="fas fa-newspaper text-3xl mb-3 opacity-30 block"></i>No articles yet</div>';
    return;
  }

  document.getElementById('blogGrid').innerHTML = items.map(p => \`
    <a href="/blog/\\${p.slug}" class="card card-hover overflow-hidden flex flex-col" style="text-decoration:none;color:inherit">
      \\${p.cover_url ? '<div class="h-40 bg-cover bg-center" style="background-image:url(\\''+escAttr(p.cover_url)+'\\')"></div>' : '<div class="h-40 flex items-center justify-center" style="background:linear-gradient(135deg,var(--lilac)22,var(--lilac)11)"><i class="fas fa-newspaper text-3xl" style="color:var(--lilac);opacity:.5"></i></div>'}
      <div class="p-5 flex-1 flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          \\${p.category ? '<span class="pill pill-teal" style="font-size:10px">'+esc(p.category)+'</span>' : ''}
          \\${p.tags && p.tags.length ? p.tags.slice(0,2).map(t => '<span class="pill pill-neutral" style="font-size:10px">'+esc(t)+'</span>').join('') : ''}
        </div>
        <h2 class="text-lg font-bold mb-2 leading-snug" style="color:var(--text)">\\${esc(p.title)}</h2>
        <p class="text-sm flex-1" style="color:var(--text-soft);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">\\${esc(p.excerpt || '')}</p>
        <div class="flex items-center gap-3 mt-4 pt-4" style="border-top:1px solid var(--border)">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style="background:var(--lilac);color:#1a1a1a">\\${(p.author||'LH')[0].toUpperCase()}</div>
          <span class="text-xs" style="color:var(--text-mute)">\\${esc(p.author||'LogoHub')} · \\${formatDate(p.created_at)}</span>
          <span class="text-xs ml-auto" style="color:var(--lilac)">Read →</span>
        </div>
      </div>
    </a>
  \`).join('');
}

function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }); }
  catch { return d; }
}
function esc(s) { return String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return String(s||'').replace(/'/g,"\\\\'").replace(/"/g,'&quot;'); }

(function(){ const t = localStorage.getItem('theme')||'dark'; const b = document.getElementById('themeBtn'); if (b) b.innerHTML = t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; })();
loadPosts();
</script>
</body></html>`;
}

// ============================================================
// /blog/:slug  — Single post
// ============================================================
export function blogPostPage() {
  return `${HEAD('Blog Post — LogoHub API', COMMON_JS)}
<body class="font-sans">
<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>
      <span class="font-bold text-lg tracking-tight">LogoHub <span class="gradient-text-lilac">API</span></span>
    </a>
    <div class="flex items-center gap-3">
      <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon" title="Toggle theme"><i class="fas fa-sun"></i></button>
      <a href="/blog" class="btn btn-ghost btn-sm"><i class="fas fa-arrow-left"></i> Back to Blog</a>
      <a href="/login" class="btn btn-primary btn-sm">Dashboard</a>
    </div>
  </div>
</nav>

<section class="pt-28 pb-20 px-4">
  <article id="postContent" class="max-w-3xl mx-auto animate-fade-up">
    <div class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-3xl" style="color:var(--lilac)"></i>
      <p class="mt-3" style="color:var(--text-mute)">Loading…</p>
    </div>
  </article>
</section>

<script>
async function loadPost() {
  const slug = window.location.pathname.replace('/blog/', '').replace(/\\/$/, '');
  if (!slug) { window.location.href = '/blog'; return; }
  try {
    const res = await fetch('/api/admin/blog/' + encodeURIComponent(slug));
    if (!res.ok) throw new Error('Not found');
    const json = await res.json();
    const p = json.data;
    if (!p) throw new Error('Not found');
    document.title = p.title + ' — LogoHub Blog';

    document.getElementById('postContent').innerHTML = \`
      <div class="mb-8">
        <a href="/blog" class="text-sm" style="color:var(--lilac)"><i class="fas fa-arrow-left"></i> All articles</a>
      </div>
      \\${p.cover_url ? '<div class="rounded-2xl overflow-hidden mb-8"><img src="'+escAttr(p.cover_url)+'" alt="'+escAttr(p.title)+'" class="w-full max-h-96 object-cover"></div>' : ''}
      <div class="flex flex-wrap items-center gap-3 mb-4">
        \\${p.category ? '<span class="pill pill-lilac">'+esc(p.category)+'</span>' : ''}
        \\${p.tags && p.tags.length ? p.tags.map(t => '<span class="pill pill-neutral" style="font-size:11px">'+esc(t)+'</span>').join('') : ''}
      </div>
      <h1 class="text-3xl sm:text-4xl font-black mb-4 leading-tight" style="color:var(--text)">\\${esc(p.title)}</h1>
      <div class="flex items-center gap-3 mb-8">
        <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs" style="background:var(--lilac);color:#1a1a1a">\\${(p.author||'LH')[0].toUpperCase()}</div>
        <div>
          <p class="text-sm font-semibold" style="color:var(--text)">\\${esc(p.author||'LogoHub')}</p>
          <p class="text-xs" style="color:var(--text-mute)">\\${formatDate(p.published_at || p.created_at)} · \\${readingTime(p.content)}</p>
        </div>
      </div>
      <div class="prose" style="color:var(--text-soft);font-size:1.05rem;line-height:1.8">
        \\${renderContent(p.content)}
      </div>
      \\${p.tags && p.tags.length ? '<div class="mt-10 pt-8" style="border-top:1px solid var(--border)"><p class="text-xs mb-3 uppercase tracking-widest" style="color:var(--text-mute)">Tags</p><div class="flex flex-wrap gap-2">'+p.tags.map(t => '<span class="pill pill-teal">'+esc(t)+'</span>').join('')+'</div></div>' : ''}
      <div class="mt-10 pt-8 text-center" style="border-top:1px solid var(--border)">
        <a href="/blog" class="btn btn-ghost"><i class="fas fa-arrow-left"></i> Back to all articles</a>
      </div>
    \`;
  } catch(e) {
    document.getElementById('postContent').innerHTML = \`
      <div class="text-center py-20">
        <div class="text-6xl mb-4">📭</div>
        <h2 class="text-2xl font-bold mb-2" style="color:var(--text)">Post not found</h2>
        <p class="mb-6" style="color:var(--text-mute)">This article may have been removed or the link is incorrect.</p>
        <a href="/blog" class="btn btn-primary">Browse all articles</a>
      </div>
    \`;
  }
}

function renderContent(content) {
  if (!content) return '';
  // Basic markdown rendering
  return String(content)
    .replace(/\\\`\\\`\\\`(\\w*)\\n([\\s\\S]*?)\\n\\\`\\\`\\\`/g, '<pre class="code-block my-4"><code>$2</code></pre>')
    .replace(/\\\`([^\\\`]+)\\\`/g, '<code class="font-mono text-xs px-1.5 py-0.5 rounded" style="background:var(--panel-2);color:var(--lilac)">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3" style="color:var(--text)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4" style="color:var(--text)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h2 class="text-3xl font-bold mt-10 mb-4" style="color:var(--text)">$1</h2>')
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
    .replace(/\\[(.+?)\\\]\\((.+?)\\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--lilac)">$1</a>')
    .replace(/^- (.+)$/gm, '<li style="margin-left:1.5rem;list-style-type:disc">$1</li>')
    .replace(/\\n\\n/g, '</p><p style="margin-bottom:1rem">')
    .replace(/^/, '<p style="margin-bottom:1rem">');
}

function readingTime(text) { const words = (text||'').split(/\\s+/).length; return Math.max(1, Math.ceil(words/200)) + ' min read'; }
function formatDate(d) { try { return new Date(d).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }); } catch { return d||''; } }
function esc(s) { return String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return String(s||'').replace(/'/g,"\\\\'").replace(/"/g,'&quot;'); }

(function(){ const t = localStorage.getItem('theme')||'dark'; const b = document.getElementById('themeBtn'); if (b) b.innerHTML = t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; })();
loadPost();
</script>

<style>
.prose img { max-width:100%; border-radius:1rem; margin:1.5rem 0; }
.prose a { color: var(--lilac); }
.prose p { margin-bottom: 1rem; }
.prose ul, .prose ol { margin: 1rem 0; padding-left: 1.5rem; }
</style>
</body></html>`;
}
