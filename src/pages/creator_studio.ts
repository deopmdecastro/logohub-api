import { HEAD, COMMON_JS } from './shared';
import { creatorSidebar, shellWrap, topbar, CREATOR_CTX } from './layout';

export const creatorStudioPage = () => `${HEAD('Creator Studio — LogoHub', COMMON_JS)}
${shellWrap(creatorSidebar('content'), `${topbar('Creator Studio', 'Manage APIs, versions, endpoints, SDKs and collaborators', CREATOR_CTX)}
<div class="px-4 lg:px-6 py-5 lg:py-7 max-w-[1500px] mx-auto space-y-5 animate-fade-up">
  <div class="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-4 lg:gap-5">
    <section class="space-y-4">
      <div class="card p-4 lg:p-5">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:rgba(184,169,232,.14);color:var(--lilac)"><i class="fas fa-layer-group"></i></div>
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-bold" style="color:var(--text)">My APIs</h2>
            <p class="text-[11px]" style="color:var(--text-mute)">Drafts, betas and public releases</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="openCreateApi()"><i class="fas fa-plus text-[10px]"></i> New API</button>
        </div>
        <div class="relative mb-3">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2" style="color:var(--text-mute)"></i>
          <input id="apiSearch" class="input input-pill" placeholder="Search APIs" oninput="renderApiList()">
        </div>
        <div id="apiList" class="space-y-2"></div>
      </div>
      <div class="card p-4 lg:p-5" style="background:linear-gradient(135deg,rgba(245,166,35,.08),rgba(184,169,232,.04))">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(245,166,35,.14);color:var(--amber)">💡</div>
          <div>
            <p class="text-sm font-bold">Publish faster</p>
            <p class="text-[11px] mt-1" style="color:var(--text-mute)">The biggest adoption gains usually come from three things: a public version, at least 3 endpoints with examples, and one SDK ready to install.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4 min-w-0">
      <div class="card p-5 lg:p-6" id="studioHero">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span class="pill pill-lilac">Creator</span>
              <span id="heroStatus" class="pill pill-neutral">Select an API</span>
            </div>
            <h2 id="heroTitle" class="text-2xl lg:text-3xl font-black tracking-tight" style="color:var(--text)">Choose an API to manage</h2>
            <p id="heroDesc" class="text-sm mt-2 max-w-3xl" style="color:var(--text-soft)">Review versions, endpoints, collaborators and SDK generation from a single workspace.</p>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button class="btn btn-ghost btn-sm" id="btnInviteCollab" onclick="openInviteCollaborator()" disabled><i class="fas fa-user-plus text-[10px]"></i> Invite</button>
            <button class="btn btn-ghost btn-sm" id="btnGenerateSdk" onclick="openGenerateSdk()" disabled><i class="fas fa-box text-[10px]"></i> Generate SDK</button>
            <button class="btn btn-primary btn-sm" id="btnCreateVersion" onclick="openCreateVersion()" disabled><i class="fas fa-code-branch text-[10px]"></i> New version</button>
          </div>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5" id="apiStatsGrid">
          <div class="card p-4"><div class="text-[11px] uppercase tracking-wide font-semibold mb-1" style="color:var(--text-mute)">Versions</div><div class="text-2xl font-black" id="statVersions">0</div></div>
          <div class="card p-4"><div class="text-[11px] uppercase tracking-wide font-semibold mb-1" style="color:var(--text-mute)">Endpoints</div><div class="text-2xl font-black" id="statEndpoints">0</div></div>
          <div class="card p-4"><div class="text-[11px] uppercase tracking-wide font-semibold mb-1" style="color:var(--text-mute)">Collaborators</div><div class="text-2xl font-black" id="statCollaborators">0</div></div>
          <div class="card p-4"><div class="text-[11px] uppercase tracking-wide font-semibold mb-1" style="color:var(--text-mute)">SDKs</div><div class="text-2xl font-black" id="statSdks">0</div></div>
        </div>
      </div>

      <div class="card p-2">
        <div class="flex flex-wrap gap-1" id="studioTabs">
          <button class="tab-pill active" data-tab="overview">Overview</button>
          <button class="tab-pill" data-tab="versions">Versions</button>
          <button class="tab-pill" data-tab="endpoints">Endpoints</button>
          <button class="tab-pill" data-tab="sdks">SDKs</button>
          <button class="tab-pill" data-tab="collaborators">Collaborators</button>
        </div>
      </div>

      <div id="studioPanelOverview" class="space-y-4"></div>
      <div id="studioPanelVersions" class="space-y-4 hidden"></div>
      <div id="studioPanelEndpoints" class="space-y-4 hidden"></div>
      <div id="studioPanelSdks" class="space-y-4 hidden"></div>
      <div id="studioPanelCollaborators" class="space-y-4 hidden"></div>
    </section>
  </div>
</div>
<script>
let APIS = [];
let ACTIVE_API = null;
let API_DETAIL = null;
let API_VERSIONS = [];
let API_ENDPOINTS = [];
let API_COLLABS = [];
let API_SDKS = [];
let SDK_LANGUAGES = [];

const STATUS_CLASS = {
  Draft: 'pill-neutral',
  Beta: 'pill-amber',
  Public: 'pill-green',
  Deprecated: 'pill-coral',
  Archived: 'pill-neutral',
};

function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

async function bootstrapStudio(){
  const user = await LH.guardRole(['creator']);
  if(!user) return;
  await loadApis();
  try { const r = await LH.api('/api/v1/sdks/languages'); SDK_LANGUAGES = r.data || []; } catch(e) {}
}

async function loadApis(){
  document.getElementById('apiList').innerHTML = Array.from({length:4}).map(()=>'<div class="skeleton h-20"></div>').join('');
  const res = await LH.api('/api/v1/creator/apis');
  APIS = res.data || [];
  renderApiList();
  if (!ACTIVE_API && APIS.length) {
    await selectApi(APIS[0].id);
  } else if (!APIS.length) {
    renderEmptyWorkspace();
  }
}

function renderApiList(){
  const q = (document.getElementById('apiSearch')?.value || '').toLowerCase().trim();
  const list = APIS.filter(api => !q || [api.name, api.slug, api.category, api.description].join(' ').toLowerCase().includes(q));
  const host = document.getElementById('apiList');
  if (!list.length) {
    host.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open text-2xl mb-3 opacity-30 block"></i>No APIs found</div>';
    return;
  }
  host.innerHTML = list.map(api => {
    const active = ACTIVE_API && ACTIVE_API.id === api.id;
    return '<button class="w-full text-left card p-4 transition-all '+(active?'ring-1 ring-[color:var(--lilac)]':'hover:border-[color:rgba(184,169,232,.28)]')+'" onclick="selectApi(\''+api.id+'\')">'+
      '<div class="flex items-start gap-3">'+
        '<div class="w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center font-black text-sm" style="background:'+(active?'rgba(184,169,232,.18)':'rgba(245,166,35,.14)')+';color:'+(active?'var(--lilac)':'var(--amber)')+'">'+esc((api.name||'A').slice(0,2).toUpperCase())+'</div>'+
        '<div class="min-w-0 flex-1">'+
          '<div class="flex items-center gap-2 flex-wrap"><p class="text-sm font-bold truncate" style="color:var(--text)">'+esc(api.name)+'</p><span class="pill '+(STATUS_CLASS[api.status]||'pill-neutral')+'">'+esc(api.status)+'</span></div>'+
          '<p class="text-[11px] mt-1 truncate" style="color:var(--text-mute)">'+esc(api.category)+' · '+esc(api.current_version || 'v1')+'</p>'+
          '<p class="text-[11px] mt-2 line-clamp-2" style="color:var(--text-soft)">'+esc(api.description || 'No description yet.')+'</p>'+
        '</div>'+
      '</div>'+
    '</button>';
  }).join('');
}

async function selectApi(id){
  ACTIVE_API = APIS.find(api => api.id === id) || null;
  renderApiList();
  if (!ACTIVE_API) return;
  document.getElementById('heroTitle').textContent = ACTIVE_API.name;
  document.getElementById('heroDesc').textContent = ACTIVE_API.description || 'No description yet.';
  document.getElementById('heroStatus').className = 'pill ' + (STATUS_CLASS[ACTIVE_API.status] || 'pill-neutral');
  document.getElementById('heroStatus').textContent = ACTIVE_API.status;
  document.getElementById('btnCreateVersion').disabled = false;
  document.getElementById('btnGenerateSdk').disabled = false;
  document.getElementById('btnInviteCollab').disabled = false;
  document.getElementById('studioPanelOverview').innerHTML = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">'+Array.from({length:4}).map(()=>'<div class="skeleton h-40"></div>').join('')+'</div>';
  const [detail, versions, endpoints, collabs, sdks] = await Promise.all([
    LH.api('/api/v1/creator/apis/' + id),
    LH.api('/api/v1/creator/apis/' + id + '/versions'),
    LH.api('/api/v1/creator/apis/' + id + '/endpoints'),
    LH.api('/api/v1/creator/apis/' + id + '/collaborators'),
    LH.api('/api/v1/sdks/apis/' + id + '/sdks').catch(() => ({ data: [] })),
  ]);
  API_DETAIL = detail.data;
  API_VERSIONS = versions.data || [];
  API_ENDPOINTS = endpoints.data || [];
  API_COLLABS = collabs.data || [];
  API_SDKS = sdks.data || [];
  renderWorkspace();
}

function renderWorkspace(){
  if (!ACTIVE_API) return renderEmptyWorkspace();
  document.getElementById('statVersions').textContent = API_VERSIONS.length;
  document.getElementById('statEndpoints').textContent = API_ENDPOINTS.length;
  document.getElementById('statCollaborators').textContent = API_COLLABS.length;
  document.getElementById('statSdks').textContent = API_SDKS.length;
  renderOverview();
  renderVersions();
  renderEndpoints();
  renderSdks();
  renderCollaborators();
}

function renderOverview(){
  const tags = (ACTIVE_API.tags || []).length ? ACTIVE_API.tags.map(tag => '<span class="pill pill-neutral">'+esc(tag)+'</span>').join(' ') : '<span class="text-[11px]" style="color:var(--text-mute)">No tags yet</span>';
  const publicVersion = API_VERSIONS.find(v => v.status === 'Public');
  document.getElementById('studioPanelOverview').innerHTML =
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">'+
      '<div class="card p-5">'+
        '<div class="flex items-center justify-between gap-3 mb-4"><h3 class="text-sm font-bold">API profile</h3><button class="btn btn-ghost btn-sm" onclick="openEditApi()"><i class="fas fa-pen text-[10px]"></i> Edit</button></div>'+
        '<div class="space-y-3 text-sm">'+
          statRow('Slug', ACTIVE_API.slug)+
          statRow('Category', ACTIVE_API.category)+
          statRow('Pricing', ACTIVE_API.pricing_model)+
          statRow('Current version', ACTIVE_API.current_version || 'v1')+
          statRow('Last update', LH.rel(ACTIVE_API.updated_at))+
        '</div>'+
        '<div class="mt-4"><div class="field-label">Tags</div><div class="flex flex-wrap gap-2">'+tags+'</div></div>'+
      '</div>'+
      '<div class="card p-5">'+
        '<div class="flex items-center justify-between gap-3 mb-4"><h3 class="text-sm font-bold">Release readiness</h3><span class="pill '+(publicVersion?'pill-green':'pill-amber')+'">'+(publicVersion?'Public live':'Draft in progress')+'</span></div>'+
        meterRow('Version coverage', API_VERSIONS.length >= 2 ? 82 : 46, API_VERSIONS.length + ' versions configured')+
        meterRow('Endpoint completeness', Math.min(100, API_ENDPOINTS.length * 20), API_ENDPOINTS.length + ' endpoints defined')+
        meterRow('Distribution', API_SDKS.length ? Math.min(100, API_SDKS.length * 33) : 14, API_SDKS.length ? API_SDKS.length + ' SDK packages' : 'No SDK generated yet')+
      '</div>'+
      '<div class="card p-5">'+
        '<div class="flex items-center justify-between gap-3 mb-4"><h3 class="text-sm font-bold">Versions</h3><button class="btn btn-ghost btn-sm" onclick="switchTab(\'versions\')">Open tab</button></div>'+
        (API_VERSIONS.length ? API_VERSIONS.slice(0,4).map(v => miniTimeline(v)).join('') : '<div class="empty-state" style="padding:1.5rem 0">No versions yet</div>')+
      '</div>'+
      '<div class="card p-5">'+
        '<div class="flex items-center justify-between gap-3 mb-4"><h3 class="text-sm font-bold">Quick actions</h3><span class="pill pill-neutral">Focused workflow</span></div>'+
        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">'+
          quickAction('Add endpoint', 'Document a request/response contract', 'fa-plug', 'openAddEndpoint()')+
          quickAction('Invite collaborator', 'Share ownership with product or devrel', 'fa-user-plus', 'openInviteCollaborator()')+
          quickAction('Generate SDK', 'Create installable client packages', 'fa-box', 'openGenerateSdk()')+
          quickAction('Archive API', 'Hide an obsolete API from active work', 'fa-box-archive', 'archiveApi()')+
        '</div>'+
      '</div>'+
    '</div>';
}

function renderVersions(){
  document.getElementById('studioPanelVersions').innerHTML =
    '<div class="card p-5">'+
      '<div class="flex items-center justify-between gap-3 mb-4 flex-wrap"><div><h3 class="text-sm font-bold">Version history</h3><p class="text-[11px] mt-1" style="color:var(--text-mute)">Promote drafts to beta/public or deprecate releases with sunset dates.</p></div><button class="btn btn-primary btn-sm" onclick="openCreateVersion()"><i class="fas fa-plus text-[10px]"></i> New version</button></div>'+
      (API_VERSIONS.length ? '<div class="space-y-3">'+API_VERSIONS.map(v => versionCard(v)).join('')+'</div>' : '<div class="empty-state"><i class="fas fa-code-branch text-2xl mb-3 opacity-30 block"></i>No versions yet</div>')+
    '</div>';
}

function renderEndpoints(){
  const versionOptions = API_VERSIONS.map(v => '<option value="'+v.id+'">'+esc(v.version)+' · '+esc(v.status)+'</option>').join('');
  document.getElementById('studioPanelEndpoints').innerHTML =
    '<div class="card p-5">'+
      '<div class="flex items-center justify-between gap-3 mb-4 flex-wrap"><div><h3 class="text-sm font-bold">Endpoints</h3><p class="text-[11px] mt-1" style="color:var(--text-mute)">Contract-first management for methods, paths and schemas.</p></div><button class="btn btn-primary btn-sm" onclick="openAddEndpoint()"><i class="fas fa-plus text-[10px]"></i> Add endpoint</button></div>'+
      '<div class="overflow-x-auto"><table class="lh-table"><thead><tr><th>Method</th><th>Path</th><th>Summary</th><th>Version</th><th>Auth</th></tr></thead><tbody>'+
        (API_ENDPOINTS.length ? API_ENDPOINTS.map(ep => '<tr><td><span class="pill '+methodPill(ep.method)+'">'+esc(ep.method)+'</span></td><td><code class="text-xs font-mono" style="color:var(--lilac)">'+esc(ep.path)+'</code></td><td style="color:var(--text-soft)">'+esc(ep.summary || ep.description || 'No summary')+'</td><td>'+esc((API_VERSIONS.find(v => v.id === ep.api_version_id) || {}).version || '—')+'</td><td>'+(ep.requires_auth ? '<span class="pill pill-lilac">Protected</span>' : '<span class="pill pill-neutral">Public</span>')+'</td></tr>').join('') : '<tr><td colspan="5" style="padding:2rem;text-align:center;color:var(--text-mute)">No endpoints defined yet</td></tr>')+
      '</tbody></table></div>'+
      '<div class="mt-4 text-[11px]" style="color:var(--text-mute)">Tip: add your endpoints to a draft version first, then promote the version after QA.</div>'+
      '<datalist id="versionOptions">'+versionOptions+'</datalist>'+
    '</div>';
}

function renderSdks(){
  document.getElementById('studioPanelSdks').innerHTML =
    '<div class="card p-5">'+
      '<div class="flex items-center justify-between gap-3 mb-4 flex-wrap"><div><h3 class="text-sm font-bold">SDK distribution</h3><p class="text-[11px] mt-1" style="color:var(--text-mute)">Generate typed client libraries from the API contract.</p></div><button class="btn btn-primary btn-sm" onclick="openGenerateSdk()"><i class="fas fa-magic text-[10px]"></i> Generate SDK</button></div>'+
      (API_SDKS.length ? '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">'+API_SDKS.map(sdk => sdkCard(sdk)).join('')+'</div>' : '<div class="empty-state"><i class="fas fa-box text-2xl mb-3 opacity-30 block"></i>No SDKs generated yet</div>')+
    '</div>';
}

function renderCollaborators(){
  document.getElementById('studioPanelCollaborators').innerHTML =
    '<div class="card p-5">'+
      '<div class="flex items-center justify-between gap-3 mb-4 flex-wrap"><div><h3 class="text-sm font-bold">Collaborators</h3><p class="text-[11px] mt-1" style="color:var(--text-mute)">Manage permissions for engineering, product and support teammates.</p></div><button class="btn btn-primary btn-sm" onclick="openInviteCollaborator()"><i class="fas fa-user-plus text-[10px]"></i> Invite</button></div>'+
      (API_COLLABS.length ? '<div class="space-y-2">'+API_COLLABS.map(col => collaboratorRow(col)).join('')+'</div>' : '<div class="empty-state"><i class="fas fa-user-group text-2xl mb-3 opacity-30 block"></i>No collaborators yet</div>')+
    '</div>';
}

function renderEmptyWorkspace(){
  document.getElementById('heroTitle').textContent = 'Choose an API to manage';
  document.getElementById('heroDesc').textContent = 'Create your first API to start shipping versions, endpoints and SDKs.';
  document.getElementById('heroStatus').className = 'pill pill-neutral';
  document.getElementById('heroStatus').textContent = 'Empty workspace';
  ['statVersions','statEndpoints','statCollaborators','statSdks'].forEach(id => document.getElementById(id).textContent = '0');
  document.getElementById('btnCreateVersion').disabled = true;
  document.getElementById('btnGenerateSdk').disabled = true;
  document.getElementById('btnInviteCollab').disabled = true;
  ['Overview','Versions','Endpoints','Sdks','Collaborators'].forEach(name => {
    const el = document.getElementById('studioPanel' + name);
    if (el) el.innerHTML = '<div class="card p-8 empty-state"><i class="fas fa-rocket text-3xl mb-3 opacity-30 block"></i>Create an API to unlock this area</div>';
  });
}

function statRow(label, value){
  return '<div class="flex items-center justify-between gap-3"><span style="color:var(--text-mute)">'+esc(label)+'</span><span style="color:var(--text)" class="font-medium text-right">'+esc(value)+'</span></div>';
}

function meterRow(label, pct, meta){
  return '<div class="mb-4"><div class="flex items-center justify-between gap-3 mb-1"><span class="text-sm font-medium">'+esc(label)+'</span><span class="text-[11px]" style="color:var(--text-mute)">'+esc(meta)+'</span></div><div class="progress"><div class="progress-bar lilac" style="width:'+Math.max(6, Math.min(100, pct))+'%"></div></div></div>';
}

function miniTimeline(v){
  return '<div class="flex items-start gap-3 py-2"><div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:rgba(184,169,232,.14);color:var(--lilac)"><i class="fas fa-code-branch text-[10px]"></i></div><div><div class="flex items-center gap-2 flex-wrap"><span class="font-semibold">'+esc(v.version)+'</span><span class="pill '+(STATUS_CLASS[v.status]||'pill-neutral')+'">'+esc(v.status)+'</span></div><p class="text-[11px] mt-1" style="color:var(--text-mute)">'+esc(v.changelog || 'No changelog yet')+'</p></div></div>';
}

function quickAction(title, desc, icon, action){
  return '<button class="card p-4 text-left hover:border-[color:rgba(184,169,232,.28)]" onclick="'+action+'"><div class="flex items-start gap-3"><div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:rgba(184,169,232,.14);color:var(--lilac)"><i class="fas '+icon+' text-[11px]"></i></div><div><p class="text-sm font-semibold">'+title+'</p><p class="text-[11px] mt-1" style="color:var(--text-mute)">'+desc+'</p></div></div></button>';
}

function versionCard(v){
  const canPublish = v.status === 'Beta';
  const canDeprecate = v.status === 'Public';
  return '<div class="card p-4"><div class="flex items-start justify-between gap-3 flex-wrap"><div><div class="flex items-center gap-2 flex-wrap"><h4 class="text-sm font-bold">'+esc(v.version)+'</h4><span class="pill '+(STATUS_CLASS[v.status]||'pill-neutral')+'">'+esc(v.status)+'</span></div><p class="text-[11px] mt-1" style="color:var(--text-mute)">'+esc(v.changelog || 'No changelog yet')+'</p><p class="text-[11px] mt-2" style="color:var(--text-mute)">Created '+LH.rel(v.created_at)+(v.published_at ? ' · Published ' + LH.rel(v.published_at) : '')+'</p></div><div class="flex gap-2 flex-wrap">'+
    (canPublish ? '<button class="btn btn-ghost btn-sm" onclick="changeVersionStatus(\''+v.id+'\', \'Public\')"><i class="fas fa-rocket text-[10px]"></i> Publish</button>' : '')+
    (canDeprecate ? '<button class="btn btn-ghost btn-sm" onclick="changeVersionStatus(\''+v.id+'\', \'Deprecated\')"><i class="fas fa-triangle-exclamation text-[10px]"></i> Deprecate</button>' : '')+
    (v.status === 'Draft' ? '<button class="btn btn-primary btn-sm" onclick="changeVersionStatus(\''+v.id+'\', \'Beta\')"><i class="fas fa-flask text-[10px]"></i> Promote to beta</button>' : '')+
  '</div></div></div>';
}

function collaboratorRow(col){
  return '<div class="card p-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style="background:linear-gradient(135deg,#b8a9e8,#4ecdc4);color:#12121a">'+esc((col.user_name||'U').slice(0,2).toUpperCase())+'</div><div class="min-w-0 flex-1"><p class="text-sm font-semibold truncate">'+esc(col.user_name || col.user_email)+'</p><p class="text-[11px] truncate" style="color:var(--text-mute)">'+esc(col.user_email)+'</p></div><div class="hidden md:flex flex-wrap gap-2">'+(col.permissions || []).map(p => '<span class="pill pill-neutral">'+esc(p)+'</span>').join('')+'</div><span class="pill '+(col.status === 'active' ? 'pill-green' : 'pill-amber')+'">'+esc(col.status)+'</span></div></div>';
}

function sdkCard(sdk){
  return '<div class="card p-4"><div class="flex items-start justify-between gap-3"><div><div class="flex items-center gap-2"><span class="pill pill-lilac">'+esc(sdk.language || sdk.registry || 'SDK')+'</span><span class="pill '+(sdk.published_at ? 'pill-green' : 'pill-neutral')+'">'+(sdk.published_at ? 'published' : 'draft')+'</span></div><p class="text-sm font-semibold mt-3">'+esc(sdk.package_name || sdk.name || 'Generated package')+'</p><p class="text-[11px] mt-1" style="color:var(--text-mute)">'+esc(sdk.registry || 'Internal registry')+'</p></div>'+
    '<div class="text-right"><div class="text-[11px]" style="color:var(--text-mute)">'+(sdk.version || 'v1.0.0')+'</div>'+
    (sdk.language ? '<button class="btn btn-ghost btn-sm mt-3" onclick="publishSdk(\''+sdk.language+'\')"><i class="fas fa-cloud-arrow-up text-[10px]"></i> Publish</button>' : '')+'</div></div></div>';
}

function methodPill(method){
  method = String(method || '').toUpperCase();
  if (method === 'GET') return 'pill-green';
  if (method === 'POST') return 'pill-lilac';
  if (method === 'PATCH' || method === 'PUT') return 'pill-amber';
  return 'pill-coral';
}

function switchTab(tab){
  document.querySelectorAll('#studioTabs .tab-pill').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  ['overview','versions','endpoints','sdks','collaborators'].forEach(name => {
    document.getElementById('studioPanel' + name.charAt(0).toUpperCase() + name.slice(1)).classList.toggle('hidden', name !== tab);
  });
}

document.querySelectorAll('#studioTabs .tab-pill').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

function openCreateApi(){
  const html = '<div class="modal-box" style="max-width:620px"><div class="modal-head"><div><h2 class="text-base font-bold">Create new API</h2><p class="text-[11px]" style="color:var(--text-mute)">Start with metadata, then add versions and endpoints.</p></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="apiCreateForm" class="modal-body space-y-4">'+
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="field-label">Name</label><input class="input" name="name" placeholder="Payments Insights API" required></div><div><label class="field-label">Category</label><input class="input" name="category" placeholder="Fintech" required></div></div>'+
      '<div><label class="field-label">Description</label><textarea class="textarea" name="description" rows="4" placeholder="Explain what the API does and who it serves"></textarea></div>'+
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="field-label">Pricing model</label><select class="select" name="pricing_model"><option value="free">free</option><option value="freemium">freemium</option><option value="paid">paid</option></select></div><div><label class="field-label">Tags</label><input class="input" name="tags" placeholder="payments, insights, analytics"></div></div>'+
    '</form><div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="createApiBtn"><i class="fas fa-plus"></i> Create API</button></div></div>';
  const modal = LH.openModal(html);
  modal.querySelector('#createApiBtn').onclick = async () => {
    const fd = new FormData(modal.querySelector('#apiCreateForm'));
    const body = Object.fromEntries(fd.entries());
    body.tags = String(body.tags || '').split(',').map(s => s.trim()).filter(Boolean);
    await LH.api('/api/v1/creator/apis', { method:'POST', body: JSON.stringify(body) });
    modal.remove();
    LH.toast('success', 'API created');
    await loadApis();
  };
}

function openEditApi(){
  if (!ACTIVE_API) return;
  const html = '<div class="modal-box" style="max-width:620px"><div class="modal-head"><div><h2 class="text-base font-bold">Edit API metadata</h2><p class="text-[11px]" style="color:var(--text-mute)">Keep your public listing clean and searchable.</p></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="apiEditForm" class="modal-body space-y-4">'+
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="field-label">Name</label><input class="input" name="name" value="'+esc(ACTIVE_API.name)+'"></div><div><label class="field-label">Category</label><input class="input" name="category" value="'+esc(ACTIVE_API.category)+'"></div></div>'+
      '<div><label class="field-label">Description</label><textarea class="textarea" name="description" rows="4">'+esc(ACTIVE_API.description || '')+'</textarea></div>'+
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="field-label">Pricing model</label><select class="select" name="pricing_model">'+['free','freemium','paid'].map(v => '<option value="'+v+'" '+(ACTIVE_API.pricing_model===v?'selected':'')+'>'+v+'</option>').join('')+'</select></div><div><label class="field-label">Tags</label><input class="input" name="tags" value="'+esc((ACTIVE_API.tags || []).join(', '))+'"></div></div>'+
    '</form><div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="saveApiBtn"><i class="fas fa-save"></i> Save changes</button></div></div>';
  const modal = LH.openModal(html);
  modal.querySelector('#saveApiBtn').onclick = async () => {
    const fd = new FormData(modal.querySelector('#apiEditForm'));
    const body = Object.fromEntries(fd.entries());
    body.tags = String(body.tags || '').split(',').map(s => s.trim()).filter(Boolean);
    await LH.api('/api/v1/creator/apis/' + ACTIVE_API.id, { method:'PATCH', body: JSON.stringify(body) });
    modal.remove();
    LH.toast('success', 'API updated');
    await loadApis();
    await selectApi(ACTIVE_API.id);
  };
}

function openCreateVersion(){
  if (!ACTIVE_API) return;
  const html = '<div class="modal-box" style="max-width:520px"><div class="modal-head"><div><h2 class="text-base font-bold">Create version</h2><p class="text-[11px]" style="color:var(--text-mute)">Start a fresh draft for breaking or additive changes.</p></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="versionForm" class="modal-body space-y-4"><div><label class="field-label">Version</label><input class="input" name="version" placeholder="v2"></div><div><label class="field-label">Changelog</label><textarea class="textarea" name="changelog" rows="3" placeholder="Summarize the release"></textarea></div></form>'+
    '<div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="createVersionBtn"><i class="fas fa-plus"></i> Create version</button></div></div>';
  const modal = LH.openModal(html);
  modal.querySelector('#createVersionBtn').onclick = async () => {
    const body = Object.fromEntries(new FormData(modal.querySelector('#versionForm')).entries());
    await LH.api('/api/v1/creator/apis/' + ACTIVE_API.id + '/versions', { method:'POST', body: JSON.stringify(body) });
    modal.remove();
    LH.toast('success', 'Version created');
    await selectApi(ACTIVE_API.id);
    switchTab('versions');
  };
}

function openAddEndpoint(){
  if (!ACTIVE_API) return;
  const versionOptions = API_VERSIONS.map(v => '<option value="'+v.id+'">'+esc(v.version)+' · '+esc(v.status)+'</option>').join('');
  const html = '<div class="modal-box" style="max-width:720px"><div class="modal-head"><div><h2 class="text-base font-bold">Add endpoint</h2><p class="text-[11px]" style="color:var(--text-mute)">Define the contract before you ship the implementation.</p></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="endpointForm" class="modal-body space-y-4">'+
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label class="field-label">Version</label><select class="select" name="version_id">'+versionOptions+'</select></div><div><label class="field-label">Method</label><select class="select" name="method">'+['GET','POST','PATCH','DELETE'].map(v => '<option value="'+v+'">'+v+'</option>').join('')+'</select></div><div><label class="field-label">Path</label><input class="input" name="path" placeholder="/v1/items/:id"></div></div>'+
      '<div><label class="field-label">Summary</label><input class="input" name="summary" placeholder="Retrieve a single item"></div>'+
      '<div><label class="field-label">Description</label><textarea class="textarea" name="description" rows="3" placeholder="Explain the use case and response semantics"></textarea></div>'+
      '<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="requires_auth" checked style="accent-color:#b8a9e8"><span class="text-sm">Requires authentication</span></label>'+
    '</form><div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="createEndpointBtn"><i class="fas fa-plus"></i> Add endpoint</button></div></div>';
  const modal = LH.openModal(html);
  modal.querySelector('#createEndpointBtn').onclick = async () => {
    const fd = new FormData(modal.querySelector('#endpointForm'));
    const body = Object.fromEntries(fd.entries());
    body.requires_auth = fd.get('requires_auth') === 'on';
    await LH.api('/api/v1/creator/apis/' + ACTIVE_API.id + '/endpoints', { method:'POST', body: JSON.stringify(body) });
    modal.remove();
    LH.toast('success', 'Endpoint created');
    await selectApi(ACTIVE_API.id);
    switchTab('endpoints');
  };
}

function openInviteCollaborator(){
  if (!ACTIVE_API) return;
  const html = '<div class="modal-box" style="max-width:560px"><div class="modal-head"><div><h2 class="text-base font-bold">Invite collaborator</h2><p class="text-[11px]" style="color:var(--text-mute)">Add engineering, PM or support partners to this API.</p></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="collabForm" class="modal-body space-y-4"><div><label class="field-label">Email</label><input class="input" name="email" type="email" placeholder="devrel@company.com"></div><div><label class="field-label">Permissions</label><input class="input" name="permissions" placeholder="view_analytics,edit_docs,manage_versions"></div></form>'+
    '<div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="inviteCollabBtn"><i class="fas fa-paper-plane"></i> Send invite</button></div></div>';
  const modal = LH.openModal(html);
  modal.querySelector('#inviteCollabBtn').onclick = async () => {
    const fd = new FormData(modal.querySelector('#collabForm'));
    const body = Object.fromEntries(fd.entries());
    body.permissions = String(body.permissions || '').split(',').map(s => s.trim()).filter(Boolean);
    await LH.api('/api/v1/creator/apis/' + ACTIVE_API.id + '/collaborators/invite', { method:'POST', body: JSON.stringify(body) });
    modal.remove();
    LH.toast('success', 'Invitation created');
    await selectApi(ACTIVE_API.id);
    switchTab('collaborators');
  };
}

function openGenerateSdk(){
  if (!ACTIVE_API) return;
  const langs = (SDK_LANGUAGES.length ? SDK_LANGUAGES : ['typescript', 'python', 'go']).map(lang => '<option value="'+lang+'">'+lang+'</option>').join('');
  const html = '<div class="modal-box" style="max-width:520px"><div class="modal-head"><div><h2 class="text-base font-bold">Generate SDK</h2><p class="text-[11px]" style="color:var(--text-mute)">Create a client package from your API contract.</p></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="sdkForm" class="modal-body space-y-4"><div><label class="field-label">Language</label><select class="select" name="language">'+langs+'</select></div><div><label class="field-label">Package name</label><input class="input" name="name" value="'+esc(ACTIVE_API.name)+' SDK"></div></form>'+
    '<div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="sdkGenBtn"><i class="fas fa-wand-magic-sparkles"></i> Generate</button></div></div>';
  const modal = LH.openModal(html);
  modal.querySelector('#sdkGenBtn').onclick = async () => {
    const body = Object.fromEntries(new FormData(modal.querySelector('#sdkForm')).entries());
    body.slug = ACTIVE_API.slug;
    await LH.api('/api/v1/sdks/apis/' + ACTIVE_API.id + '/sdks/generate', { method:'POST', body: JSON.stringify(body) });
    modal.remove();
    LH.toast('success', 'SDK generated');
    await selectApi(ACTIVE_API.id);
    switchTab('sdks');
  };
}

async function publishSdk(language){
  if (!ACTIVE_API) return;
  await LH.api('/api/v1/sdks/apis/' + ACTIVE_API.id + '/sdks/' + language + '/publish', { method:'POST', body: JSON.stringify({ registry: 'npm' }) });
  LH.toast('success', 'SDK published');
  await selectApi(ACTIVE_API.id);
}

async function changeVersionStatus(versionId, status){
  if (!ACTIVE_API) return;
  const body = { status };
  if (status === 'Deprecated') body.sunset_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString();
  await LH.api('/api/v1/creator/apis/' + ACTIVE_API.id + '/versions/' + versionId + '/status', { method:'PATCH', body: JSON.stringify(body) });
  LH.toast('success', 'Version updated');
  await loadApis();
  await selectApi(ACTIVE_API.id);
}

async function archiveApi(){
  if (!ACTIVE_API) return;
  const yes = await LH.confirm({ title:'Archive this API?', msg:'It will disappear from active workspaces and public discovery.', danger:true, yes:'Archive' });
  if (!yes) return;
  await LH.api('/api/v1/creator/apis/' + ACTIVE_API.id + '/archive', { method:'POST' });
  LH.toast('success', 'API archived');
  ACTIVE_API = null;
  await loadApis();
}

bootstrapStudio();
</script>
`)}`;
