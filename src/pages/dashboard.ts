import { HEAD, COMMON_JS, renderStatSkeletons } from './shared';
import { sidebar, topbar, shellWrap, ctxSidebar, PageCtx, ADMIN_CTX, DASH_NAV } from './layout';

// ============================================================
// /dashboard  — Overview (admin only)
// ============================================================
export const overviewPage = () => `${HEAD('Dashboard \u2014 LogoHub API', COMMON_JS)}
${shellWrap(sidebar('overview'), topbar('Dashboard', 'Welcome back! Here\'s what\'s happening.', ADMIN_CTX) + `
<div class="px-4 lg:px-6 py-5 lg:py-7 max-w-1440 mx-auto space-y-5 anim-fade-up">

  <!-- Stats grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 anim-stagger" id="statGrid">
    ${renderStatSkeletons(4)}
  </div>

  <!-- Chart + endpoints row -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
    <div class="card p-5 lg:col-span-2">
      <div class="flex items-center justify-between mb-5">
        <div><h3 class="text-sm font-bold flex items-center gap-2"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:rgba(184,169,232,.12);color:var(--lilac)"><i class="fas fa-chart-line text-[11px]"></i></span>Requests &middot; Last 7 days</h3><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">Aggregated across all keys</p></div>
        <span class="pill pill-green" id="trendPill">&mdash;</span>
      </div>
      <div style="height:200px"><canvas id="reqChart"></canvas></div>
    </div>
    <div class="card p-5">
      <div class="mb-5"><h3 class="text-sm font-bold flex items-center gap-2"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:rgba(245,166,35,.12);color:var(--amber)"><i class="fas fa-list-ol text-[11px]"></i></span>Top endpoints</h3><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">By request volume</p></div>
      <div class="space-y-3" id="topEndpoints">
        ${[['/api/v1/logo/*',45,'var(--lilac)'],['/api/v1/search',28,'var(--amber)'],['/api/v1/flags/*',14,'var(--teal)'],['/api/v1/crypto/*',9,'var(--coral)'],['/api/v1/football/*',4,'var(--green)']].map(function(e){return '<div><div style=display:flex;justify-content:space-between;margin-bottom:.25rem><code style=font-size:.72rem;color:var(--text-soft)>'+e[0]+'</code><span style=font-size:.72rem;font-weight:600;color:var(--text)>'+e[1]+'%</span></div><div class=progress><div class=progress-bar style=width:'+e[1]+'%;background:'+e[2]+'></div></div></div>'}).join('')}
      </div>
    </div>
  </div>

  <!-- Activity + quick actions -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-4">
    <div class="card p-5 lg:col-span-3">
      <div class="flex items-center justify-between mb-4">
        <div><h3 class="text-sm font-bold flex items-center gap-2"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:rgba(78,205,196,.12);color:var(--teal)"><i class="fas fa-history text-[11px]"></i></span>Recent activity</h3><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">Latest platform actions</p></div>
        <a href="/dashboard/activity" class="btn btn-ghost btn-sm">View all <i class="fas fa-arrow-right text-[10px]"></i></a>
      </div>
      <div id="recentActivity" class="space-y-0"></div>
    </div>
    <div class="card p-5 lg:col-span-2 space-y-0.5">
      <h3 class="text-sm font-bold flex items-center gap-2 mb-2"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:rgba(245,166,35,.12);color:var(--amber)"><i class="fas fa-bolt text-[11px]"></i></span>Quick actions</h3>
      <a href="/dashboard/keys?new=1" class="sidebar-item"><div class="ic" style="background:rgba(245,166,35,.12);color:var(--amber)"><i class="fas fa-plus"></i></div>Create API key</a>
      <a href="/dashboard/content" class="sidebar-item"><div class="ic" style="background:rgba(78,205,196,.12);color:var(--teal)"><i class="fas fa-upload"></i></div>Upload content</a>
      <a href="/dashboard/admin/users" class="sidebar-item"><div class="ic" style="background:rgba(255,107,107,.12);color:var(--coral)"><i class="fas fa-user-plus"></i></div>Manage users</a>
      <a href="/dashboard/settings" class="sidebar-item"><div class="ic" style="background:rgba(156,163,175,.12);color:#9ca3af"><i class="fas fa-sliders"></i></div>Platform settings</a>
      <a href="/playground" class="sidebar-item"><div class="ic" style="background:rgba(184,169,232,.12);color:var(--lilac)"><i class="fas fa-code"></i></div>Open playground</a>
    </div>
  </div>

  <!-- Keys preview -->
  <div class="card p-5">
    <div class="flex items-center justify-between mb-4">
      <div><h3 class="text-sm font-bold flex items-center gap-2"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:rgba(245,166,35,.12);color:var(--amber)"><i class="fas fa-key text-[11px]"></i></span>API Keys</h3><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">Recent keys overview</p></div>
      <div class="flex gap-2"><a href="/dashboard/keys" class="btn btn-ghost btn-sm">Manage all</a><a href="/dashboard/keys?new=1" class="btn btn-primary btn-sm"><i class="fas fa-plus text-[10px]"></i> New key</a></div>
    </div>
    <div class="overflow-x-auto"><table class="data-table"><thead><tr><th>Name</th><th>Prefix</th><th>Env</th><th>Status</th><th>Requests</th><th>Last used</th></tr></thead><tbody id="recentKeys"></tbody></table></div>
  </div>

</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
async function init(){
  try{
    var r=await Promise.all([LH.api('/api/admin/stats'),LH.api('/api/admin/activity'),LH.api('/api/admin/keys')]);
    renderStats(r[0].data);
    renderActivity(r[1].data.slice(0,10));
    renderKeys(r[2].data.slice(0,6));
  }catch(e){LH.toast('error','Failed to load dashboard',e.message)}
}
function renderStats(s){
  document.getElementById('statGrid').innerHTML=[
    {icon:'fa-bolt',bg:'rgba(184,169,232,.12)',fg:'var(--lilac)',val:LH.fmt(s.total_requests_24h||s.total_requests||208000),lbl:'Requests (24h)',trend:'+12%'},
    {icon:'fa-gauge-high',bg:'rgba(245,166,35,.12)',fg:'var(--amber)',val:(s.avg_latency_ms||18)+'ms',lbl:'Avg latency',sub:'p95: '+(s.p95_latency||42)+'ms'},
    {icon:'fa-shield-check',bg:'rgba(52,211,153,.12)',fg:'var(--green)',val:(s.success_rate||'99.7')+'%',lbl:'Success rate'},
    {icon:'fa-exclamation-triangle',bg:'rgba(255,107,107,.12)',fg:'var(--coral)',val:LH.fmt(s.errors_24h||64),lbl:'Errors (24h)',trend:'-67%',trendUp:true}
  ].map(function(c){return '<div class="card card-stats card-hover"><div class=stat-icon style=background:'+c.bg+';color:'+c.fg+'><i class="fas '+c.icon+'"></i></div><div class=stat-value>'+c.val+'</div><div class=stat-label>'+c.lbl+'</div>'+(c.trend?'<div class=stat-trend style=color:'+(c.trendUp!==false?'var(--green)':'var(--coral)')+'><i class="fas fa-arrow-'+(c.trendUp!==false?'up':'down')+' text-[9px]"></i> '+c.trend+'</div>':'')+(c.sub?'<div style=font-size:.65rem;color:var(--text-mute);margin-top:2px>'+c.sub+'</div>':'')+'</div>'}).join('');
  renderChart()
}
function renderActivity(items){
  var el=document.getElementById('recentActivity');
  if(!items.length){el.innerHTML='<div class=empty-state style=padding:2rem><div class=empty-icon><i class="fas fa-inbox"></i></div><h3>No activity yet</h3><p>Actions will appear here</p></div>';return}
  var cols={create:'var(--green)',delete:'var(--coral)',update:'var(--amber)',upload:'var(--teal)',key:'var(--lilac)',publish:'var(--green)',login:'#60a5fa',invite:'#a78bfa',revoke:'var(--coral)'};
  var ics={create:'fa-plus',delete:'fa-trash',update:'fa-pen',upload:'fa-upload',key:'fa-key',publish:'fa-rocket',login:'fa-sign-in-alt',invite:'fa-envelope',revoke:'fa-ban'};
  el.innerHTML=items.map(function(a,i){var co=cols[a.type]||'var(--lilac)',ic=ics[a.type]||'fa-circle';
    return '<div class="flex items-center gap-3 py-2.5 px-1" style="'+(i?'border-top:1px solid var(--border)':'')+'"><div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style=background:'+co+'22;color:'+co+'><i class="fas '+ic+' text-[11px]"></i></div><div class=flex-1><span style=font-weight:600;color:var(--text)>'+a.actor+'</span> <span style=color:var(--text-mute)>'+a.action+'</span> <code style=font-size:.68rem;color:var(--text-mute)>'+(a.target||'')+'</code>'+(a.details?'<div style=font-size:.65rem;color:var(--text-mute)>'+a.details+'</div>':'')+'</div><span style=font-size:.65rem;color:var(--text-mute)>'+LH.rel(a.ts||a.created_at)+'</span></div>'}).join('');
}
function renderKeys(keys){
  var el=document.getElementById('recentKeys');
  if(!keys.length){el.innerHTML='<tr><td colspan=6 style=text-align:center;padding:2rem;color:var(--text-mute)>No API keys yet</td></tr>';return}
  el.innerHTML=keys.map(function(k){var sp=k.status==='active'?'pill-green':k.status==='revoked'?'pill-coral':'pill-amber';
    var ec=k.environment==='production'?'pill-green':k.environment==='staging'?'pill-amber':'pill-teal';
    return '<tr><td class=font-semibold>'+k.name+'</td><td class=cell-mono>'+(k.prefix||'')+'</td><td><span class="pill '+ec+'">'+(k.environment||'dev')+'</span></td><td><span class="pill '+sp+'">'+k.status+'</span></td><td>'+LH.fmt(k.requests||0)+'</td><td>'+LH.rel(k.last_used)+'</td></tr>'}).join('');
}
function renderChart(){
  var ctx=document.getElementById('reqChart');if(!ctx)return;
  var data=[28500,31200,29800,34100,36800,22500,18200];
  new Chart(ctx,{type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{data:data,borderColor:'#b8a9e8',backgroundColor:'rgba(184,169,232,.1)',fill:true,tension:.45,pointRadius:0,pointHoverRadius:6,pointHoverBackgroundColor:'#b8a9e8',borderWidth:2.5}]},options:{responsive:true,maintainAspectRatio:false,interaction:{intersect:false,mode:'index'},plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1a28',titleColor:'#f0f0f5',bodyColor:'#a0a0b0',borderColor:'rgba(255,255,255,.08)',borderWidth:1,padding:12,cornerRadius:10,displayColors:false}},scales:{x:{grid:{display:false},ticks:{color:'#606070',font:{size:10}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#606070',font:{size:10},callback:function(v){return v>=1000?(v/1000)+'k':v}}}}});
  document.getElementById('trendPill').innerHTML='<i class="fas fa-arrow-up text-[8px]"></i> +12.3% WoW';
}
LH.guardRole(['admin']).then(function(u){if(u)init()});
</script>
`)}`;export const keysPage = (ctx: PageCtx = ADMIN_CTX) => `${HEAD('API Keys — LogoHub', COMMON_JS)}
${shellWrap(ctxSidebar(ctx, 'keys'), `
${topbar(ctx.role === 'consumer' ? 'My API Keys' : 'API Keys', 'Manage authentication, tags, and associated files', ctx)}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-1400 mx-auto space-y-5 animate-fade-up">
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative flex-1 min-w-0">
      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[12px]" style="color:var(--text-mute)"></i>
      <input id="keySearch" placeholder="Search keys, descriptions, tags…" class="input input-pill" oninput="renderKeys()">
    </div>
    <select id="envFilter" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderKeys()">
      <option value="">All environments</option><option value="production">Production</option><option value="staging">Staging</option><option value="development">Development</option>
    </select>
    <select id="statusFilter" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderKeys()">
      <option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="revoked">Revoked</option>
    </select>
    <span id="keyCount" class="text-[11px] font-medium" style="color:var(--text-mute)">—</span>
    <button class="btn btn-primary ml-auto" onclick="openKeyModal()"><i class="fas fa-plus"></i> Create New Key</button>
  </div>

  <div class="card overflow-hidden">
    <div id="keysList" class="divide-y" style="border-color:var(--border)">
      ${renderRowSkeletons(4)}
    </div>
  </div>
</div>

<script>
let ALL_KEYS = [];
async function loadKeys() {
  try { const r = await LH.api('/api/admin/keys'); ALL_KEYS = r.data; renderKeys(); }
  catch (e) { LH.toast('error', 'Failed to load keys', e.message); }
}
function renderKeys() {
  const q = (document.getElementById('keySearch').value||'').toLowerCase();
  const env = document.getElementById('envFilter').value;
  const st = document.getElementById('statusFilter').value;
  const list = ALL_KEYS.filter(k =>
    (!env || k.environment===env) && (!st || k.status===st) &&
    (!q || (k.name+' '+k.description+' '+k.tags.join(' ')).toLowerCase().includes(q))
  );
  document.getElementById('keyCount').textContent = list.length + ' keys';
  if (!list.length) { document.getElementById('keysList').innerHTML = '<div class="empty-state"><i class="fas fa-key text-3xl mb-3 opacity-30 block"></i>No API keys match your filters</div>'; return; }
  document.getElementById('keysList').innerHTML = list.map(renderKeyRow).join('');
}
function renderKeyRow(k) {
  const envC = { production:'#4ade80', staging:'#f5a623', development:'#4ecdc4' }[k.environment] || '#b8a9e8';
  const stCls = { active:'pill-green', inactive:'pill-amber', revoked:'pill-coral' }[k.status] || 'pill-neutral';
  return '<div class="px-5 py-4">'+
    '<div class="flex items-center gap-3 flex-wrap">'+
      '<div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style="background:'+envC+'22;color:'+envC+'"><i class="fas fa-key text-[12px]"></i></div>'+
      '<div class="flex-1 min-w-0">'+
        '<div class="flex flex-wrap items-center gap-2 mb-1">'+
          '<p class="text-sm font-semibold truncate" style="color:var(--text)">'+k.name+'</p>'+
          '<span class="pill" style="background:'+envC+'22;color:'+envC+';border-color:'+envC+'55;">'+k.environment+'</span>'+
          '<span class="pill '+stCls+'">'+k.status+'</span>'+
          (k.tags||[]).slice(0,3).map(t => '<span class="pill pill-neutral">'+t+'</span>').join('')+
        '</div>'+
        '<div class="flex items-center gap-2">'+
          '<code class="text-[11px] font-mono truncate" style="color:var(--text-soft)" id="kc-'+k.id+'">'+k.prefix+'</code>'+
          '<button class="btn-icon-sm btn-ghost btn" title="Reveal" onclick="toggleReveal(\\'__ID__\\', this)"><i class="fas fa-eye"></i></button>'.replaceAll('__ID__', k.id)+
          '<button class="btn-icon-sm btn-ghost btn" title="Copy" onclick="LH.copy(\\'__K__\\')"><i class="fas fa-copy"></i></button>'.replaceAll('__K__', k.key)+
        '</div>'+
        (k.description?'<p class="text-[11px] mt-1 truncate" style="color:var(--text-mute)">'+k.description+'</p>':'')+
      '</div>'+
      '<div class="hidden lg:flex items-center gap-5 text-[11px]" style="color:var(--text-mute)">'+
        '<div class="text-right"><p class="font-semibold" style="color:var(--text)">'+LH.fmt(k.requests)+'</p><p>requests</p></div>'+
        '<div class="text-right"><p class="font-semibold" style="color:var(--text)">'+LH.fmt(k.rate_limit)+'/h</p><p>rate limit</p></div>'+
        '<div class="text-right min-w-[80px]"><p class="font-semibold" style="color:var(--text)">'+(k.last_used?LH.rel(k.last_used):'—')+'</p><p>last used</p></div>'+
      '</div>'+
      '<div class="flex items-center gap-1.5 shrink-0">'+
        '<button class="btn btn-ghost btn-icon-sm" title="Edit" onclick="openKeyModal(\\'__ID__\\')"><i class="fas fa-pen"></i></button>'.replaceAll('__ID__', k.id)+
        (k.status!=='revoked'?'<button class="btn btn-ghost btn-icon-sm" title="Revoke" onclick="revokeKey(\\'__ID__\\')"><i class="fas fa-undo"></i></button>'.replaceAll('__ID__', k.id):'')+
        '<button class="btn btn-danger btn-icon-sm" title="Delete" onclick="deleteKey(\\'__ID__\\')"><i class="fas fa-trash"></i></button>'.replaceAll('__ID__', k.id)+
      '</div>'+
    '</div>'+
    ((k.permissions||[]).length?'<div class="flex flex-wrap items-center gap-1.5 mt-2 ml-13"><span class="text-[10px] font-semibold uppercase tracking-wide" style="color:var(--text-mute)">Permissions:</span>'+
      k.permissions.map(p => '<span class="pill pill-teal">'+p+'</span>').join('')+'</div>':'')+
  '</div>';
}
function toggleReveal(id, btn) {
  const k = ALL_KEYS.find(x => x.id===id); if (!k) return;
  const el = document.getElementById('kc-'+id);
  if (el.dataset.revealed==='1') { el.textContent = k.prefix; el.dataset.revealed='0'; btn.innerHTML='<i class="fas fa-eye"></i>'; }
  else { el.textContent = k.key; el.dataset.revealed='1'; btn.innerHTML='<i class="fas fa-eye-slash"></i>'; }
}

// ============== MODAL: CREATE / EDIT API KEY ==============
function openKeyModal(id) {
  const k = id ? ALL_KEYS.find(x=>x.id===id) : null;
  const isEdit = !!k;
  const init = k || { name:'', description:'', permissions:['read'], environment:'development', rate_limit:1000, expires_at:'', status:'active', tags:[], notes:'' };
  const html = '<div class="modal-box"><div class="modal-head">'+
    '<div style="display:flex;align-items:center;gap:.75rem;">'+
      '<div style="width:38px;height:38px;border-radius:12px;background:#f5a62322;color:#f5a623;display:flex;align-items:center;justify-content:center;"><i class="fas fa-key"></i></div>'+
      '<div><h2 class="text-base font-bold" style="color:var(--text)">'+(isEdit?'Edit API Key':'Create New API Key')+'</h2>'+
      '<p class="text-[11px]" style="color:var(--text-mute)">'+(isEdit?init.name:'Configure permissions, environment, rate limits and metadata')+'</p></div>'+
    '</div>'+
    '<button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button>'+
  '</div>'+
  '<form id="keyForm" class="modal-body space-y-4">'+
    '<div class="grid grid-cols-2 gap-4">'+
      '<div><label class="field-label">Name *</label><input class="input" name="name" required placeholder="e.g. Production Key" value="'+esc(init.name)+'"></div>'+
      '<div><label class="field-label">Environment</label><select class="select" name="environment">'+envOpts(init.environment)+'</select></div>'+
    '</div>'+
    '<div><label class="field-label">Description</label><textarea class="textarea" name="description" rows="2" placeholder="What is this key used for?">'+esc(init.description)+'</textarea></div>'+
    '<div><label class="field-label">Permissions</label><div id="permsBox" class="flex flex-wrap gap-2">'+permChips(init.permissions)+'</div></div>'+
    '<div class="grid grid-cols-2 gap-4">'+
      '<div><label class="field-label">Rate limit (req/hour)</label><input class="input" type="number" name="rate_limit" value="'+(init.rate_limit||1000)+'"></div>'+
      '<div><label class="field-label">Expires at (optional)</label><input class="input" type="date" name="expires_at" value="'+(init.expires_at||'').slice(0,10)+'"></div>'+
    '</div>'+
    '<div class="grid grid-cols-2 gap-4">'+
      '<div><label class="field-label">Status</label><select class="select" name="status"><option value="active" '+(init.status==='active'?'selected':'')+'>Active</option><option value="inactive" '+(init.status==='inactive'?'selected':'')+'>Inactive</option></select></div>'+
      '<div><label class="field-label">Tags (comma-separated)</label><input class="input" name="tags" placeholder="prod,public,web" value="'+(init.tags||[]).join(', ')+'"></div>'+
    '</div>'+
    '<div><label class="field-label">Internal notes</label><textarea class="textarea" name="notes" rows="2" placeholder="Private notes visible only to your team.">'+esc(init.notes||'')+'</textarea></div>'+
  '</form>'+
  '<div class="modal-foot">'+
    '<button class="btn btn-ghost" data-close>Cancel</button>'+
    '<button class="btn btn-primary" type="submit" form="keyForm" id="saveBtn"><i class="fas fa-save"></i> '+(isEdit?'Save changes':'Create key')+'</button>'+
  '</div></div>';
  const modal = LH.openModal(html);
  modal.querySelectorAll('#permsBox button').forEach(b => b.onclick = (e) => { e.preventDefault(); b.classList.toggle('perm-on'); updatePermStyle(b); });
  modal.querySelector('#keyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const perms = [...modal.querySelectorAll('#permsBox button.perm-on')].map(b => b.dataset.value);
    const body = {
      name: fd.get('name'), description: fd.get('description'),
      permissions: perms, environment: fd.get('environment'),
      rate_limit: Number(fd.get('rate_limit')) || 1000,
      expires_at: fd.get('expires_at') || '',
      status: fd.get('status'),
      tags: String(fd.get('tags')||'').split(',').map(s=>s.trim()).filter(Boolean),
      notes: fd.get('notes'),
    };
    const btn = document.getElementById('saveBtn'); btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';
    try {
      let res;
      if (isEdit) res = await LH.api('/api/admin/keys/'+id, { method:'PATCH', body: JSON.stringify(body) });
      else res = await LH.api('/api/admin/keys', { method:'POST', body: JSON.stringify(body) });
      LH.toast('success', isEdit?'API key updated':'API key created', res.data.name);
      modal.remove();
      await loadKeys();
      if (!isEdit) showKeyReveal(res.data);
    } catch (err) { LH.toast('error', 'Save failed', err.message); btn.disabled=false; btn.innerHTML='<i class="fas fa-save"></i> '+(isEdit?'Save changes':'Create key'); }
  });
}
function envOpts(cur) {
  return ['development','staging','production'].map(v => '<option value="'+v+'" '+(cur===v?'selected':'')+'>'+v.charAt(0).toUpperCase()+v.slice(1)+'</option>').join('');
}
function permChips(on) {
  return ['read','write','admin','upload','delete'].map(p => '<button type="button" data-value="'+p+'" class="'+(on.includes(p)?'perm-on':'')+'" style="font-size:.75rem;font-weight:500;padding:.4rem .85rem;border-radius:9999px;border:1px solid var(--border-strong);background:'+(on.includes(p)?'rgba(184,169,232,.18)':'var(--panel)')+';color:'+(on.includes(p)?'#b8a9e8':'var(--text-soft)')+';">'+(on.includes(p)?'<i class="fas fa-check text-[10px] mr-1"></i>':'')+p+'</button>').join('');
}
function updatePermStyle(b) { const on = b.classList.contains('perm-on'); b.style.background = on?'rgba(184,169,232,.18)':'var(--panel)'; b.style.color = on?'#b8a9e8':'var(--text-soft)'; b.innerHTML = (on?'<i class="fas fa-check text-[10px] mr-1"></i>':'') + b.dataset.value; }
function esc(s) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

function showKeyReveal(k) {
  const html = '<div class="modal-box" style="max-width:500px"><div class="modal-head">'+
    '<div style="display:flex;align-items:center;gap:.75rem;"><div style="width:38px;height:38px;border-radius:12px;background:#4ade8022;color:#4ade80;display:flex;align-items:center;justify-content:center;"><i class="fas fa-check"></i></div>'+
    '<div><h2 class="text-base font-bold" style="color:var(--text)">Key created successfully</h2><p class="text-[11px]" style="color:var(--text-mute)">Copy it now — for security reasons you won\\'t see the full value again.</p></div></div>'+
    '<button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<div class="modal-body space-y-4">'+
      '<div style="padding:1rem;border-radius:12px;background:#0a0a0f;display:flex;gap:.5rem;align-items:center;">'+
        '<code class="text-xs font-mono flex-1 break-all" style="color:#b8a9e8">'+k.key+'</code>'+
        '<button class="btn btn-ghost btn-sm" onclick="LH.copy(\\'__K__\\')"><i class="fas fa-copy"></i> Copy</button>'.replaceAll('__K__', k.key)+
      '</div>'+
    '</div>'+
    '<div class="modal-foot"><button class="btn btn-primary" data-close>Done</button></div></div>';
  LH.openModal(html);
}

async function revokeKey(id) {
  const k = ALL_KEYS.find(x=>x.id===id);
  const yes = await LH.confirm({ title:'Revoke API key?', msg:k.name+' will be immediately disabled.', danger:true });
  if (!yes) return;
  try { await LH.api('/api/admin/keys/'+id+'/revoke', { method:'POST' }); LH.toast('success','Key revoked'); loadKeys(); }
  catch (e) { LH.toast('error','Revoke failed', e.message); }
}
async function deleteKey(id) {
  const k = ALL_KEYS.find(x=>x.id===id);
  const yes = await LH.confirm({ title:'Delete API key?', msg:k.name+' will be permanently removed.', danger:true });
  if (!yes) return;
  try { await LH.api('/api/admin/keys/'+id, { method:'DELETE' }); LH.toast('success','Key deleted'); loadKeys(); }
  catch (e) { LH.toast('error','Delete failed', e.message); }
}


// ============== FILES MANAGEMENT (v2) ==============
function openFilesModal(id) {
  const k = ALL_KEYS.find(x=>x.id===id); if (!k) return;
  const files = k.files || [];
  const html = '<div class="modal-box" style="max-width:600px"><div class="modal-head">'+
    '<div style="display:flex;align-items:center;gap:.75rem;"><div style="width:38px;height:38px;border-radius:12px;background:#4ecdc422;color:#4ecdc4;display:flex;align-items:center;justify-content:center;"><i class="fas fa-folder"></i></div><div><h2 class="text-base font-bold" style="color:var(--text)">Files — '+esc(k.name)+'</h2><p class="text-[11px]" style="color:var(--text-mute)">'+files.length+' file(s)</p></div></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<div class="modal-body space-y-3">'+
      (files.length===0?'<div class="empty-state"><i class="fas fa-file text-3xl mb-3 opacity-30 block"></i>No files yet</div>':
      files.map(f => '<div class="flex items-center gap-3 p-3 rounded-xl" style="background:var(--panel-2)"><div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#4ecdc422;color:#4ecdc4"><i class="fas fa-file text-[12px]"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate" style="color:var(--text)">'+f.name+'</p><div class="flex items-center gap-2 mt-0.5"><span class="pill pill-lilac">'+f.tag+'</span><span class="text-[10px]" style="color:var(--text-mute)">'+f.content_type+'</span></div></div><button class="btn btn-danger btn-icon-sm" onclick="deleteFile(\\''+k.id+'\\',\\''+f.id+'\\')"><i class="fas fa-trash text-[10px]"></i></button></div>').join(''))+
      '<div style="border-top:1px solid var(--border);padding-top:1rem"><p class="text-[11px] font-semibold mb-2" style="color:var(--text)">Add new file</p><div class="grid grid-cols-2 gap-3"><div><label class="field-label">File name</label><input class="input" id="newFileName_'+id+'" placeholder="ficheiro-home"></div><div><label class="field-label">Tag</label><input class="input" id="newFileTag_'+id+'" placeholder="home"></div></div><input class="input mt-2" id="newFileType_'+id+'" placeholder="content type" value="image/svg+xml"><button class="btn btn-primary btn-sm mt-3" onclick="addFile(\\''+id+'\\')"><i class="fas fa-plus"></i> Add file</button></div>'+
    '</div><div class="modal-foot"><button class="btn btn-ghost" data-close>Close</button></div></div>';
  LH.openModal(html);
}
async function addFile(keyId) {
  const name = document.getElementById('newFileName_'+keyId)?.value;
  const tag = document.getElementById('newFileTag_'+keyId)?.value;
  if (!name || !tag) { LH.toast('error','Name and tag are required'); return; }
  try { await LH.api('/api/admin/keys/'+keyId+'/files', { method:'POST', body: JSON.stringify({name,tag,content_type:'image/svg+xml'}) }); LH.toast('success','File added'); document.querySelectorAll('.modal-overlay').forEach(m=>m.remove()); loadKeys(); }
  catch(e) { LH.toast('error','Failed',e.message); }
}
async function deleteFile(keyId, fileId) {
  const yes = await LH.confirm({ title:'Remove file?', danger:true }); if (!yes) return;
  try { await LH.api('/api/admin/keys/'+keyId+'/files/'+fileId, { method:'DELETE' }); LH.toast('success','File removed'); loadKeys(); }
  catch(e) { LH.toast('error','Failed',e.message); }
}

LH.guardRole(['${ctx.role}']).then(function(u) {
  if (!u) return;
  loadKeys();
  if (new URLSearchParams(location.search).get('new')==='1') openKeyModal();
});
</script>
`)}
`;

function renderRowSkeletons(n: number) {
  return Array.from({ length: n }, () => '<div class="px-5 py-4 flex items-center gap-3"><div class="skeleton w-10 h-10 rounded-2xl"></div><div class="flex-1 space-y-2"><div class="skeleton h-3 w-1/3"></div><div class="skeleton h-3 w-1/2"></div></div></div>').join('');
}

export { renderRowSkeletons };
