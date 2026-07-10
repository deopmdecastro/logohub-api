import { HEAD, COMMON_JS } from './shared';

export const publicDocsV2Page = () => `${HEAD('Documentation — LogoHub API', COMMON_JS)}
<body class="font-sans">
<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
    <a href="/" class="flex items-center gap-2 font-bold"><div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>LogoHub <span class="gradient-text-lilac ml-1">API</span></a>
    <div class="flex items-center gap-3">
      <a href="/explorer" class="text-sm hidden md:inline" style="color:var(--text-soft)">Explorer</a>
      <a href="/playground" class="text-sm hidden md:inline" style="color:var(--text-soft)">Playground</a>
      <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon"><i class="fas fa-sun"></i></button>
      <a href="/login" class="btn btn-primary btn-sm">Dashboard</a>
    </div>
  </div>
</nav>

<div class="pt-20 px-4 pb-16">
  <div class="max-w-7xl mx-auto space-y-5">
    <section class="card p-5 lg:p-6 overflow-hidden" style="background:linear-gradient(135deg,rgba(184,169,232,.10),rgba(78,205,196,.05) 55%,transparent)">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="min-w-0">
          <span class="pill pill-lilac">API Reference</span>
          <h1 class="text-3xl lg:text-5xl font-black tracking-tight mt-3" style="color:var(--text)">Dynamic docs for every <span class="gradient-text">public API</span></h1>
          <p class="text-sm lg:text-base mt-3 max-w-3xl" style="color:var(--text-soft)">Browse versions, inspect endpoints, compare examples and jump into Playground without leaving the reference flow.</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <a href="/playground" class="btn btn-ghost btn-sm"><i class="fas fa-flask text-[10px]"></i> Open playground</a>
          <a href="/explorer" class="btn btn-primary btn-sm"><i class="fas fa-compass text-[10px]"></i> Explore assets</a>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_340px] gap-4 lg:gap-5">
      <aside class="space-y-4">
        <div class="card p-4 lg:p-5">
          <div class="flex items-center gap-2 mb-3"><div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:rgba(184,169,232,.14);color:var(--lilac)"><i class="fas fa-book-open"></i></div><div><h2 class="text-sm font-bold">Browse APIs</h2><p class="text-[11px]" style="color:var(--text-mute)">Public and beta references</p></div></div>
          <div class="relative mb-3"><i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2" style="color:var(--text-mute)"></i><input id="docsSearch" class="input input-pill" placeholder="Search docs" oninput="renderApiList()"></div>
          <div id="apiList" class="space-y-2"></div>
        </div>
      </aside>

      <main class="space-y-4 min-w-0">
        <div class="card p-5 lg:p-6">
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-2"><span id="apiStatus" class="pill pill-neutral">Select API</span><span id="apiCategory" class="pill pill-neutral">Reference</span></div>
              <h2 id="apiTitle" class="text-2xl lg:text-3xl font-black tracking-tight" style="color:var(--text)">Choose an API from the left</h2>
              <p id="apiOverview" class="text-sm mt-2 max-w-3xl" style="color:var(--text-soft)">Each reference includes versions, endpoint groups, auth requirements, code examples and changelog notes.</p>
            </div>
            <div class="flex gap-2 flex-wrap items-center">
              <select id="versionSelect" class="select" style="min-width:140px" onchange="loadDoc(ACTIVE_SLUG, this.value)"><option>Version</option></select>
              <a id="tryItBtn" href="/playground" class="btn btn-primary btn-sm"><i class="fas fa-flask text-[10px]"></i> Try in Playground</a>
            </div>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5" id="docStats">
            <div class="card p-4"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-14 mb-2"></div><div class="skeleton h-4 w-28"></div></div>
            <div class="card p-4"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-14 mb-2"></div><div class="skeleton h-4 w-28"></div></div>
            <div class="card p-4"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-14 mb-2"></div><div class="skeleton h-4 w-28"></div></div>
            <div class="card p-4"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-14 mb-2"></div><div class="skeleton h-4 w-28"></div></div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-4 lg:gap-5">
          <div class="card p-4 lg:p-5 h-fit lg:sticky" style="top:92px">
            <h3 class="text-sm font-bold mb-3">Endpoints</h3>
            <div id="endpointNav" class="space-y-2"></div>
          </div>
          <div class="space-y-4" id="docContent">
            <div class="card p-8 empty-state"><i class="fas fa-book-open text-3xl mb-3 opacity-30 block"></i>Select an API to load documentation</div>
          </div>
        </div>
      </main>

      <aside class="space-y-4">
        <div class="card p-4 lg:p-5">
          <h3 class="text-sm font-bold mb-3">Authentication</h3>
          <div id="authBox" class="text-sm" style="color:var(--text-soft)">X-API-Key header details appear here after selecting an API.</div>
        </div>
        <div class="card p-4 lg:p-5">
          <h3 class="text-sm font-bold mb-3">SDKs</h3>
          <div id="sdkList" class="flex flex-wrap gap-2"></div>
        </div>
        <div class="card p-4 lg:p-5">
          <h3 class="text-sm font-bold mb-3">Changelog</h3>
          <div id="changelogList" class="space-y-3"></div>
        </div>
      </aside>
    </section>
  </div>
</div>

<script>
let API_LIST = [];
let ACTIVE_SLUG = '';
let ACTIVE_DOC = null;
let ACTIVE_INFO = null;
const STATUS_CLASS = { Public:'pill-green', Beta:'pill-amber', Deprecated:'pill-coral' };

function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

async function bootstrapDocs(){
  try {
    const res = await fetch('/api/v1/apis');
    const json = await res.json();
    API_LIST = json.data || [];
    renderApiList();
    if (API_LIST.length) loadDoc(API_LIST[0].slug);
  } catch (e) {
    document.getElementById('apiList').innerHTML = '<div class="empty-state"><i class="fas fa-triangle-exclamation text-2xl mb-3 opacity-30 block"></i>Failed to load APIs</div>';
  }
}

function renderApiList(){
  const q = (document.getElementById('docsSearch')?.value || '').toLowerCase().trim();
  const items = API_LIST.filter(api => !q || [api.name, api.slug, api.category, api.description].join(' ').toLowerCase().includes(q));
  const host = document.getElementById('apiList');
  if(!items.length){ host.innerHTML = '<div class="empty-state"><i class="fas fa-search text-2xl mb-3 opacity-30 block"></i>No matching API docs</div>'; return; }
  host.innerHTML = items.map(api => {
    const active = ACTIVE_SLUG === api.slug;
    return '<button class="w-full text-left card p-4 transition-all '+(active?'ring-1 ring-[color:var(--lilac)]':'hover:border-[color:rgba(184,169,232,.28)]')+'" onclick="loadDoc(\''+api.slug+'\')">'+
      '<div class="flex items-start gap-3">'+
        '<div class="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center font-black text-sm" style="background:'+(active?'rgba(184,169,232,.18)':'rgba(78,205,196,.12)')+';color:'+(active?'var(--lilac)':'var(--teal)')+'">'+esc(api.name.slice(0,2).toUpperCase())+'</div>'+
        '<div class="min-w-0 flex-1"><div class="flex items-center gap-2 flex-wrap"><p class="text-sm font-bold truncate" style="color:var(--text)">'+esc(api.name)+'</p><span class="pill '+(STATUS_CLASS[api.status]||'pill-neutral')+'">'+esc(api.status)+'</span></div><p class="text-[11px] mt-1" style="color:var(--text-mute)">'+esc(api.category)+'</p><p class="text-[11px] mt-2 line-clamp-2" style="color:var(--text-soft)">'+esc(api.description)+'</p></div>'+
      '</div>'+
    '</button>';
  }).join('');
}

async function loadDoc(slug, version){
  ACTIVE_SLUG = slug;
  renderApiList();
  document.getElementById('docContent').innerHTML = '<div class="grid grid-cols-1 gap-4">'+Array.from({length:3}).map(()=>'<div class="skeleton h-52"></div>').join('')+'</div>';
  try {
    const [infoRes, docRes, versionsRes] = await Promise.all([
      fetch('/api/v1/apis/' + slug).then(r => r.json()),
      fetch('/api/v1/apis/' + slug + '/docs' + (version ? ('?version=' + encodeURIComponent(version)) : '')).then(r => r.json()),
      fetch('/api/v1/apis/' + slug + '/versions').then(r => r.json()),
    ]);
    ACTIVE_INFO = infoRes.data;
    ACTIVE_DOC = docRes.data;
    ACTIVE_DOC.versions = versionsRes.data || [];
    renderDoc();
  } catch (e) {
    document.getElementById('docContent').innerHTML = '<div class="card p-8 empty-state"><i class="fas fa-triangle-exclamation text-3xl mb-3 opacity-30 block"></i>Failed to load documentation</div>';
  }
}

function renderDoc(){
  if(!ACTIVE_DOC || !ACTIVE_INFO) return;
  const api = ACTIVE_INFO.api;
  document.getElementById('apiStatus').className = 'pill ' + (STATUS_CLASS[api.status] || 'pill-neutral');
  document.getElementById('apiStatus').textContent = api.status;
  document.getElementById('apiCategory').textContent = api.category;
  document.getElementById('apiTitle').textContent = api.name;
  document.getElementById('apiOverview').textContent = ACTIVE_DOC.overview || ACTIVE_INFO.overview || api.description;

  const versions = ACTIVE_DOC.versions || [];
  document.getElementById('versionSelect').innerHTML = versions.map(v => '<option value="'+v.version+'" '+(ACTIVE_DOC.active_version && ACTIVE_DOC.active_version.version === v.version ? 'selected' : '')+'>'+esc(v.version)+' · '+esc(v.status)+'</option>').join('');
  document.getElementById('tryItBtn').href = '/playground';

  const endpointCount = (ACTIVE_DOC.endpoint_groups || []).reduce((sum, group) => sum + group.endpoints.length, 0);
  const stats = [
    { label:'Versions', value:versions.length, meta:'Release line coverage' },
    { label:'Endpoints', value:endpointCount, meta:'Across grouped resources' },
    { label:'SDKs', value:(ACTIVE_DOC.sdks || []).length, meta:'Supported install targets' },
    { label:'Rating', value:(api.rating_avg || 0).toFixed(1), meta:LH.fmt(api.rating_count || 0) + ' reviews' },
  ];
  document.getElementById('docStats').innerHTML = stats.map(stat => '<div class="card p-4"><div class="text-[11px] uppercase tracking-wide font-semibold mb-2" style="color:var(--text-mute)">'+stat.label+'</div><div class="text-2xl font-black">'+stat.value+'</div><div class="text-[11px] mt-1" style="color:var(--text-mute)">'+stat.meta+'</div></div>').join('');

  document.getElementById('authBox').innerHTML = '<div class="space-y-3"><div class="pill pill-lilac">'+esc((ACTIVE_DOC.auth || {}).type || 'X-API-Key')+'</div><p>Send your API key in the <code class="font-mono px-2 py-1 rounded" style="background:rgba(184,169,232,.12);color:var(--lilac)">X-API-Key</code> header for authenticated calls.</p><pre class="code-block"><code>curl -H "X-API-Key: lh_live_xxx" https://api.logohub.dev/api/v1/'+esc(api.slug)+'</code></pre></div>';
  document.getElementById('sdkList').innerHTML = (ACTIVE_DOC.sdks || []).length ? ACTIVE_DOC.sdks.map(sdk => '<span class="pill pill-neutral">'+esc(sdk)+'</span>').join('') : '<span class="text-[11px]" style="color:var(--text-mute)">No SDKs published</span>';
  document.getElementById('changelogList').innerHTML = (ACTIVE_DOC.changelog || []).map(entry => '<div><div class="flex items-center gap-2 flex-wrap"><span class="pill '+(STATUS_CLASS[entry.status]||'pill-neutral')+'">'+esc(entry.version)+'</span><span class="text-sm font-semibold">'+esc(entry.title)+'</span></div><p class="text-[11px] mt-1" style="color:var(--text-mute)">'+esc(entry.description)+'</p></div>').join('') || '<div class="text-[11px]" style="color:var(--text-mute)">No changelog entries</div>';
  document.getElementById('endpointNav').innerHTML = (ACTIVE_DOC.endpoint_groups || []).map((group, groupIndex) => '<div><div class="text-[11px] uppercase tracking-wide font-semibold mb-2" style="color:var(--text-mute)">'+esc(group.title)+'</div><div class="space-y-1">'+group.endpoints.map((ep, index) => '<a href="#ep-'+groupIndex+'-'+index+'-'+slugify(ep.path)+'" class="block text-sm px-3 py-2 rounded-xl hover:bg-[var(--panel-2)]" style="color:var(--text-soft)">'+esc(ep.method)+' '+esc(ep.path)+'</a>').join('')+'</div></div>').join('');

  document.getElementById('docContent').innerHTML = (ACTIVE_DOC.endpoint_groups || []).map((group, groupIndex) => {
    return '<section class="card p-5 lg:p-6"><div class="flex items-center justify-between gap-3 mb-5 flex-wrap"><div><span class="pill pill-neutral">'+esc(group.title)+'</span><h3 class="text-xl font-black mt-3">'+esc(group.title)+'</h3></div></div>'+
      group.endpoints.map((ep, index) => renderEndpoint(ep, groupIndex, index)).join('')+
    '</section>';
  }).join('');
}

function renderEndpoint(ep, groupIndex, index){
  const params = ep.params && ep.params.length
    ? '<div class="overflow-x-auto mt-4"><table class="lh-table"><thead><tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr></thead><tbody>'+ep.params.map(p => '<tr><td><code class="text-xs font-mono" style="color:var(--lilac)">'+esc(p.name)+'</code></td><td>'+esc(p.in)+'</td><td>'+esc(p.type)+'</td><td>'+(p.required ? 'Yes' : 'No')+'</td><td style="color:var(--text-soft)">'+esc(p.description || '')+'</td></tr>').join('')+'</tbody></table></div>'
    : '<div class="text-[11px] mt-4" style="color:var(--text-mute)">No parameters for this endpoint.</div>';
  return '<article id="ep-'+groupIndex+'-'+index+'-'+slugify(ep.path)+'" class="pt-5 first:pt-0 border-t first:border-t-0" style="border-color:var(--border)">'+
    '<div class="flex items-start justify-between gap-4 flex-wrap"><div class="min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="pill '+methodClass(ep.method)+'">'+esc(ep.method)+'</span><code class="text-sm font-mono" style="color:var(--lilac)">'+esc(ep.path)+'</code></div><h4 class="text-lg font-bold mt-3">'+esc(ep.summary)+'</h4><p class="text-sm mt-2" style="color:var(--text-soft)">'+esc(ep.description || '')+'</p></div><a href="/playground" class="btn btn-ghost btn-sm"><i class="fas fa-flask text-[10px]"></i> Try it</a></div>'+
    params+
    '<div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5"><div><div class="field-label">Request example</div><pre class="code-block"><code>'+esc(ep.request_example || '')+'</code></pre></div><div><div class="field-label">Response example</div><pre class="code-block"><code>'+esc(JSON.stringify(ep.response_example || {}, null, 2))+'</code></pre></div></div>'+
  '</article>';
}

function methodClass(method){
  method = String(method || '').toUpperCase();
  if(method === 'GET') return 'pill-green';
  if(method === 'POST') return 'pill-lilac';
  if(method === 'PATCH' || method === 'PUT') return 'pill-amber';
  return 'pill-coral';
}

function slugify(text){
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

(function(){ const t = localStorage.getItem('theme')||'dark'; const b = document.getElementById('themeBtn'); if (b) b.innerHTML = t==='dark'?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>'; })();
bootstrapDocs();
</script>
</body></html>`;
