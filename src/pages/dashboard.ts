import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap, ctxSidebar, PageCtx, ADMIN_CTX, DASH_NAV } from './layout';

// ============================================================
// /dashboard  — Overview (admin only)
// ============================================================
export const overviewPage = () => `${HEAD('Dashboard — LogoHub API', COMMON_JS)}
${shellWrap(sidebar('overview'), `
${topbar('Overview', 'Welcome back, Admin!')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-6 animate-fade-up">
  <div id="statGrid" class="grid grid-cols-2 lg:grid-cols-4 gap-4">${renderStatSkeletons(4)}</div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="card p-6 lg:col-span-2">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-sm font-semibold flex items-center gap-2"><span class="w-6 h-6 rounded-md flex items-center justify-center" style="background:#b8a9e822;color:#b8a9e8"><i class="fas fa-chart-line text-[11px]"></i></span>Requests · Last 7 days</h3>
        <span class="pill pill-green">+12.3% WoW</span>
      </div>
      <canvas id="reqChart" height="120"></canvas>
    </div>
    <div class="card p-6">
      <h3 class="text-sm font-semibold mb-5 flex items-center gap-2"><span class="w-6 h-6 rounded-md flex items-center justify-center" style="background:#f5a62322;color:#f5a623"><i class="fas fa-code text-[10px]"></i></span>Top endpoints</h3>
      <div class="space-y-3.5">
        ${[
          ['/api/v1/logo/*', 45, '#b8a9e8'],
          ['/api/v1/search', 28, '#f5a623'],
          ['/api/v1/flags/*', 14, '#4ecdc4'],
          ['/api/v1/crypto/*', 9, '#ff6b6b'],
          ['/api/v1/football/*', 4, '#4ade80'],
        ].map(([ep, pct, color]) => `
          <div>
            <div class="flex items-center justify-between mb-1">
              <code class="text-[11px] font-mono" style="color:var(--text-soft)">${ep}</code>
              <span class="text-[11px] font-semibold" style="color:var(--text)">${pct}%</span>
            </div>
            <div class="h-1.5 rounded-full overflow-hidden" style="background:var(--border)">
              <div class="h-full rounded-full transition-all duration-500" style="width:${pct}%;background:${color};"></div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="card p-6">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-sm font-semibold flex items-center gap-2"><span class="w-6 h-6 rounded-md flex items-center justify-center" style="background:#4ecdc422;color:#4ecdc4"><i class="fas fa-history text-[11px]"></i></span>Recent activity</h3>
      <a href="/dashboard/activity" class="text-[11px] font-medium" style="color:#b8a9e8">View all →</a>
    </div>
    <div id="recentActivity" class="divide-y" style="border-color:var(--border)"></div>
  </div>

  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold flex items-center gap-2"><span class="w-6 h-6 rounded-md flex items-center justify-center" style="background:#f5a62322;color:#f5a623"><i class="fas fa-key text-[10px]"></i></span>API Keys</h3>
      <div class="flex gap-2">
        <a href="/dashboard/keys" class="btn btn-ghost btn-sm">Manage</a>
        <button class="btn btn-primary btn-sm" onclick="window.location.href='/dashboard/keys?new=1'"><i class="fas fa-plus"></i> Create New Key</button>
      </div>
    </div>
    <div id="recentKeys" class="space-y-2"></div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
async function init() {
  try {
    const [stats, activity, keys] = await Promise.all([
      LH.api('/api/admin/stats'),
      LH.api('/api/admin/activity'),
      LH.api('/api/admin/keys'),
    ]);
    renderStats(stats.data);
    renderActivity(activity.data.slice(0,6));
    renderKeysPreview(keys.data.slice(0,3));
    renderChart();
  } catch (e) {
    LH.toast('error', 'Failed to load dashboard', String(e.message||e));
  }
}
function statCard(label, value, icon, color, trend, sub) {
  const t = trend!=null ? '<span class="text-[10px] font-semibold inline-flex items-center gap-0.5" style="color:'+(trend>=0?'#4ade80':'#ff6b6b')+'"><i class="fas fa-arrow-'+(trend>=0?'up':'down')+'-right text-[8px]"></i>'+Math.abs(trend)+'%</span>' : '';
  return '<div class="card card-hover p-5">'+
    '<div class="flex items-center justify-between mb-3">'+
      '<div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:'+color+'22;color:'+color+'"><i class="fas '+icon+' text-[12px]"></i></div>'+
      t +
    '</div>'+
    '<div class="text-2xl font-bold tracking-tight" style="color:var(--text)">'+value+'</div>'+
    '<p class="text-[11px] font-medium mt-0.5" style="color:var(--text-mute)">'+label+'</p>'+
    (sub?'<p class="text-[10px] mt-1" style="color:var(--text-soft)">'+sub+'</p>':'')+
  '</div>';
}
function renderStats(s) {
  document.getElementById('statGrid').innerHTML =
    statCard('Total Requests (24h)', LH.fmt(s.total_requests), 'fa-bolt', '#b8a9e8', 12.3) +
    statCard('Avg Latency', s.avg_latency_ms+'ms', 'fa-bolt', '#f5a623', -2, '2ms faster than yesterday') +
    statCard('Success Rate', s.success_rate+'%', 'fa-check-circle', '#4ade80', 0.1) +
    statCard('Errors (24h)', LH.fmt(s.errors_24h), 'fa-exclamation-triangle', '#ff6b6b', -67);
}
function renderActivity(items) {
  const colorMap = { create:'#4ade80', delete:'#ff6b6b', update:'#f5a623', upload:'#4ecdc4', key:'#b8a9e8', publish:'#4ade80', login:'#b8a9e8', billing:'#ff6b6b' };
  const iconMap = { create:'fa-plus', delete:'fa-trash', update:'fa-pen', upload:'fa-upload', key:'fa-key', publish:'fa-rocket', login:'fa-shield', billing:'fa-credit-card' };
  document.getElementById('recentActivity').innerHTML = items.map(a => {
    const c = colorMap[a.type] || '#b8a9e8';
    const icon = iconMap[a.type] || 'fa-history';
    return '<div class="flex items-center gap-3 py-3">'+
      '<div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background:'+c+'22;color:'+c+'"><i class="fas '+icon+' text-[11px]"></i></div>'+
      '<div class="flex-1 min-w-0"><p class="text-sm truncate"><span class="font-semibold" style="color:var(--text)">'+a.actor+'</span> <span style="color:var(--text-soft)">· '+a.action+'</span> <code class="text-[11px] font-mono" style="color:var(--text-mute)">'+a.target+'</code></p>'+
      (a.details?'<p class="text-[11px] truncate" style="color:var(--text-mute)">'+a.details+'</p>':'')+'</div>'+
      '<span class="text-[11px] shrink-0" style="color:var(--text-mute)">'+LH.rel(a.ts)+'</span>'+
    '</div>';
  }).join('');
}
function renderKeysPreview(keys) {
  const envC = { production:'#4ade80', staging:'#f5a623', development:'#4ecdc4' };
  document.getElementById('recentKeys').innerHTML = keys.map(k => {
    const c = envC[k.environment] || '#b8a9e8';
    return '<div class="flex items-center gap-3 p-3 rounded-xl" style="background:var(--panel-2)">'+
      '<div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:'+c+'22;color:'+c+'"><i class="fas fa-key text-[12px]"></i></div>'+
      '<div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate" style="color:var(--text)">'+k.name+'</p>'+
      '<code class="text-[11px] font-mono" style="color:var(--text-soft)">'+k.prefix+'</code></div>'+
      '<span class="pill pill-'+(k.status==='active'?'green':k.status==='inactive'?'amber':'coral')+'">'+k.status+'</span>'+
      '<span class="text-[11px] hidden sm:inline" style="color:var(--text-mute)">'+LH.fmt(k.requests)+' reqs</span>'+
    '</div>';
  }).join('') || '<div class="empty-state">No API keys yet — create one to get started.</div>';
}
function renderChart() {
  new Chart(document.getElementById('reqChart'), {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        data: [18234, 24561, 19823, 35621, 42183, 28934, 38291],
        borderColor: '#b8a9e8', backgroundColor: 'rgba(184,169,232,.15)',
        fill: true, tension: 0.4, pointBackgroundColor: '#b8a9e8', pointRadius: 4,
        borderWidth: 2.5,
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } },
      scales: { x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#71717a', font: { size: 11 } } }, y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#71717a', font: { size: 11 } } } }
    }
  });
}
LH.guardRole(['admin']).then(function(u) { if (u) init(); });
</script>
`)}
`;

function renderStatSkeletons(n: number) {
  return Array.from({ length: n }, () => '<div class="card p-5"><div class="skeleton h-8 w-8 rounded-xl mb-3"></div><div class="skeleton h-7 w-24"></div><div class="skeleton h-3 w-32 mt-2"></div></div>').join('');
}

// ============================================================
// /dashboard/keys (admin) · /dashboard/consumer/keys — API Keys CRUD,
// scoped to the active role's environment.
// ============================================================
export const keysPage = (ctx: PageCtx = ADMIN_CTX) => `${HEAD('API Keys — LogoHub', COMMON_JS)}
${shellWrap(ctxSidebar(ctx, 'keys'), `
${topbar(ctx.role === 'consumer' ? 'My API Keys' : 'API Keys', 'Manage authentication, tags, and associated files', ctx)}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative flex-1 min-w-[200px]">
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
