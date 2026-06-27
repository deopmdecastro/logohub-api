import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap } from './layout';

// ============================================================
// /dashboard/settings  — including Git
// ============================================================
export const settingsPage = () => `${HEAD('Settings — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('settings'), `
${topbar('Settings', 'Platform, Git integration, branding and stats')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">
  <div class="tab-pill-group" id="settingsTabs">
    <button class="tab-pill active" data-tab="general"><i class="fas fa-cog text-[#b8a9e8]"></i> General</button>
    <button class="tab-pill" data-tab="git"><i class="fas fa-code-branch text-[#f5a623]"></i> Git</button>
    <button class="tab-pill" data-tab="brand"><i class="fas fa-palette text-[#4ecdc4]"></i> Brand</button>
    <button class="tab-pill" data-tab="stats"><i class="fas fa-chart-bar text-[#4ade80]"></i> Stats</button>
  </div>

  <div id="panel-general" class="space-y-4 animate-fade-up"></div>
  <div id="panel-git" class="space-y-4 hidden animate-fade-up"></div>
  <div id="panel-brand" class="space-y-4 hidden animate-fade-up"></div>
  <div id="panel-stats" class="space-y-4 hidden animate-fade-up"></div>
</div>

<script>
let SETTINGS = [];
async function load() {
  try { const r = await LH.api('/api/admin/settings'); SETTINGS = r.data; renderAll(); }
  catch (e) { LH.toast('error','Failed to load settings', e.message); }
}
function renderAll() { renderGeneral(); renderGit(); renderBrand(); renderStats(); }
function group(g) { return SETTINGS.filter(s => s.group===g); }
function settingRow(s) {
  const val = s.type==='secret' ? (s.value?'••••••••••':'(not set)') : s.value;
  const swatch = s.type==='color' ? '<span class="color-swatch mr-2" style="background:'+s.value+'"></span>' : '';
  return '<div class="flex items-center gap-3 py-3 border-b" style="border-color:var(--border)">'+
    '<div class="flex-1 min-w-0"><p class="text-sm font-medium truncate" style="color:var(--text)">'+s.label+'</p>'+
    '<code class="text-[10px] font-mono" style="color:var(--text-mute)">'+s.key+'</code></div>'+
    '<div class="flex items-center gap-2">'+swatch+'<code class="text-xs max-w-[220px] truncate" style="color:var(--text-soft)">'+val+'</code>'+
    '<button class="btn btn-ghost btn-icon-sm" onclick="editSetting(\\'__K__\\')"><i class="fas fa-pen text-[10px]"></i></button>'.replaceAll('__K__', s.key)+
    '</div>'+
  '</div>';
}
function renderGeneral() {
  document.getElementById('panel-general').innerHTML = '<div class="card p-6"><h3 class="text-sm font-semibold mb-2 flex items-center gap-2" style="color:var(--text)"><i class="fas fa-cog text-[#b8a9e8]"></i>Platform</h3><p class="text-[11px] mb-3" style="color:var(--text-mute)">Public-facing metadata of your LogoHub deployment.</p>'+ group('platform').map(settingRow).join('') +'</div>'+
    '<div class="card p-6"><h3 class="text-sm font-semibold mb-2 flex items-center gap-2" style="color:var(--text)"><i class="fas fa-credit-card text-[#4ecdc4]"></i>Billing</h3>'+ group('billing').map(settingRow).join('') +'</div>';
}
function renderBrand() {
  document.getElementById('panel-brand').innerHTML = '<div class="card p-6"><h3 class="text-sm font-semibold mb-3 flex items-center gap-2" style="color:var(--text)"><i class="fas fa-palette text-[#4ecdc4]"></i>Brand colors</h3>'+
    '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">'+ group('brand').map(s => '<div class="card p-4"><p class="text-[11px] font-semibold uppercase tracking-wide mb-2" style="color:var(--text-mute)">'+s.label+'</p><div class="color-input"><input type="color" value="'+s.value+'" onchange="saveSetting(\\'__K__\\', this.value)"><code class="text-xs" style="color:var(--text)">'+s.value+'</code></div></div>'.replaceAll('__K__', s.key)).join('') +'</div></div>';
}
function renderStats() {
  document.getElementById('panel-stats').innerHTML = '<div class="card p-6"><h3 class="text-sm font-semibold mb-2 flex items-center gap-2" style="color:var(--text)"><i class="fas fa-chart-bar text-[#4ade80]"></i>Editable statistics</h3><p class="text-[11px] mb-3" style="color:var(--text-mute)">Override the metrics shown on the dashboard.</p>'+ group('stats').map(settingRow).join('') +'</div>';
}
function renderGit() {
  const g = (key) => SETTINGS.find(s => s.key===key) || { value:'' };
  const status = g('git_connection_status').value || 'unknown';
  const statusColor = status==='connected'?'#4ade80':status==='error'?'#ff6b6b':'#f5a623';
  document.getElementById('panel-git').innerHTML =
  '<div class="card p-6">'+
    '<div class="flex items-center justify-between mb-2">'+
      '<h3 class="text-sm font-semibold flex items-center gap-2" style="color:var(--text)"><i class="fas fa-code-branch text-[#f5a623]"></i>Git integration</h3>'+
      '<span class="pill" style="background:'+statusColor+'22;color:'+statusColor+';border-color:'+statusColor+'55;"><span class="w-1.5 h-1.5 rounded-full animate-pulse-dot" style="background:'+statusColor+'"></span>'+status+'</span>'+
    '</div>'+
    '<p class="text-[11px] mb-4" style="color:var(--text-mute)">Configure how the platform syncs with your GitHub repository. Last push: '+(g('git_last_push').value?LH.rel(g('git_last_push').value):'never')+'</p>'+
    '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'+
      gitField('git_repo_url','Repository URL','https://github.com/user/repo') +
      gitField('git_branch','Main branch','main') +
      gitField('git_user_name','Git user name','') +
      gitField('git_user_email','Git email','') +
    '</div>'+
    '<div class="mt-4"><label class="field-label">Personal Access Token (PAT)</label>'+
      '<div style="position:relative"><input id="gitPat" class="input" type="password" value="'+esc(g('git_pat').value)+'" placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx">'+
        '<button type="button" class="btn btn-ghost btn-icon-sm" style="position:absolute;right:.5rem;top:50%;transform:translateY(-50%)" onclick="togglePat()"><i id="patEye" class="fas fa-eye"></i></button>'+
      '</div><p class="field-hint">Stored encrypted. Required to push commits to GitHub.</p></div>'+
    '<div class="flex items-center gap-2 pt-4 mt-4" style="border-top:1px solid var(--border)">'+
      '<button class="btn btn-ghost" id="testGitBtn" onclick="testGit()"><i class="fas fa-plug"></i> Test connection</button>'+
      '<button class="btn btn-primary ml-auto" onclick="saveGit()"><i class="fas fa-save"></i> Save git settings</button>'+
    '</div>'+
  '</div>';
}
function gitField(key, label, placeholder) {
  const v = SETTINGS.find(s => s.key===key)?.value || '';
  return '<div><label class="field-label">'+label+'</label><input class="input" id="f-'+key+'" value="'+esc(v)+'" placeholder="'+placeholder+'"></div>';
}
function esc(s) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
function togglePat() { const e = document.getElementById('gitPat'); const i = document.getElementById('patEye'); if (e.type==='password'){ e.type='text'; i.className='fas fa-eye-slash'; } else { e.type='password'; i.className='fas fa-eye'; } }
async function saveGit() {
  const fields = ['git_repo_url','git_branch','git_user_name','git_user_email'];
  try {
    for (const k of fields) { await LH.api('/api/admin/settings/'+k, { method:'PATCH', body: JSON.stringify({ value: document.getElementById('f-'+k).value }) }); }
    const pat = document.getElementById('gitPat').value;
    if (pat && pat.indexOf('•')===-1) await LH.api('/api/admin/settings/git_pat', { method:'PATCH', body: JSON.stringify({ value: pat }) });
    LH.toast('success', 'Git settings saved');
    await load();
  } catch (e) { LH.toast('error','Save failed', e.message); }
}
async function testGit() {
  const btn = document.getElementById('testGitBtn'); btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Testing…';
  try { await saveGit(); const r = await fetch('/api/admin/git/test', { method:'POST' }); const j = await r.json();
    if (j.data && j.data.ok) LH.toast('success','Git connection OK', j.data.detail || '');
    else LH.toast('error','Connection failed', (j.data && (j.data.errors||[]).join(', ')) || j.error || j.data?.detail || 'Unknown error');
    await load();
  } catch (e) { LH.toast('error','Test failed', e.message); }
  finally { btn.disabled=false; btn.innerHTML='<i class="fas fa-plug"></i> Test connection'; }
}
async function saveSetting(key, value) {
  try { await LH.api('/api/admin/settings/'+key, { method:'PATCH', body: JSON.stringify({ value }) }); LH.toast('success','Saved'); await load(); }
  catch (e) { LH.toast('error','Save failed', e.message); }
}
function editSetting(key) {
  const s = SETTINGS.find(x => x.key===key); if (!s) return;
  const inputType = s.type==='number' ? 'number' : s.type==='secret' ? 'password' : 'text';
  const html = '<div class="modal-box" style="max-width:480px"><div class="modal-head"><div style="display:flex;align-items:center;gap:.7rem;"><div style="width:36px;height:36px;border-radius:12px;background:#b8a9e822;color:#b8a9e8;display:flex;align-items:center;justify-content:center;"><i class="fas fa-pen"></i></div><div><h2 class="text-base font-bold" style="color:var(--text)">Edit setting</h2><p class="text-[11px]" style="color:var(--text-mute)">'+s.label+'</p></div></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="sf" class="modal-body space-y-3"><div><label class="field-label">'+s.label+'</label>'+(s.type==='color'?'<div class="color-input"><input type="color" id="sv-color" value="'+s.value+'"><input class="input" id="sv" value="'+esc(s.value)+'"></div>':'<input class="input" type="'+inputType+'" id="sv" value="'+esc(s.value)+'">')+'</div></form>'+
    '<div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button id="sbtn" class="btn btn-primary"><i class="fas fa-save"></i> Save</button></div></div>';
  const m = LH.openModal(html);
  if (s.type==='color') { m.querySelector('#sv-color').oninput = e => m.querySelector('#sv').value = e.target.value.toUpperCase(); m.querySelector('#sv').oninput = e => m.querySelector('#sv-color').value = e.target.value; }
  m.querySelector('#sbtn').onclick = async () => { await saveSetting(key, m.querySelector('#sv').value); m.remove(); };
}

document.querySelectorAll('#settingsTabs .tab-pill').forEach(b => b.onclick = () => {
  document.querySelectorAll('#settingsTabs .tab-pill').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  ['general','git','brand','stats'].forEach(t => document.getElementById('panel-'+t).classList.toggle('hidden', t!==b.dataset.tab));
});

load();
</script>
`)}
`;

// ============================================================
// /dashboard/team
// ============================================================
export const teamPage = () => `${HEAD('Team — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('team'), `
${topbar('Team', 'Invite and manage members')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">
  <div class="flex items-center gap-3">
    <h3 class="text-sm font-semibold" style="color:var(--text)">Team members</h3>
    <span id="tCount" class="text-[11px]" style="color:var(--text-mute)">—</span>
    <button class="btn btn-primary ml-auto" onclick="openMember()"><i class="fas fa-plus"></i> Invite user</button>
  </div>
  <div class="card overflow-hidden"><div id="tList" class="divide-y" style="border-color:var(--border)"></div></div>
</div>
<script>
let TEAM = [];
async function load() { try { const r = await LH.api('/api/admin/team'); TEAM = r.data; render(); } catch(e) { LH.toast('error','Load failed', e.message); } }
function render() {
  document.getElementById('tCount').textContent = TEAM.length + ' members';
  const roleC = { admin:'#b8a9e8', editor:'#f5a623', viewer:'#4ecdc4', billing:'#ff6b6b' };
  const stCls = { active:'pill-green', invited:'pill-lilac', suspended:'pill-coral' };
  const planC = { free:'pill-neutral', pro:'pill-teal', business:'pill-lilac', enterprise:'pill-amber' };
  document.getElementById('tList').innerHTML = TEAM.map(u => {
    const initials = (u.name||'').split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
    return '<div class="flex items-center gap-3 px-5 py-3.5">'+
      '<div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style="background:linear-gradient(135deg,#b8a9e8,#f5a623);color:#1a1a1a">'+initials+'</div>'+
      '<div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate" style="color:var(--text)">'+esc(u.name)+'</p><p class="text-[11px] truncate" style="color:var(--text-mute)">'+esc(u.email)+'</p></div>'+
      '<div class="hidden md:flex items-center gap-2">'+
        '<span class="pill" style="background:'+roleC[u.role]+'22;color:'+roleC[u.role]+';border-color:'+roleC[u.role]+'55">'+u.role+'</span>'+
        '<span class="pill '+(planC[u.plan]||'pill-neutral')+'">'+u.plan+'</span>'+
        '<span class="pill '+(stCls[u.status]||'pill-neutral')+'">'+u.status+'</span>'+
      '</div>'+
      '<span class="hidden lg:inline text-[11px] min-w-[80px] text-right" style="color:var(--text-mute)">'+LH.fmt(u.requests_30d)+' req/30d</span>'+
      '<button class="btn btn-ghost btn-icon-sm" onclick="openMember('+u.id+')"><i class="fas fa-pen text-[10px]"></i></button>'+
      '<button class="btn btn-danger btn-icon-sm" onclick="delMember('+u.id+')"><i class="fas fa-trash text-[10px]"></i></button>'+
    '</div>';
  }).join('') || '<div class="empty-state"><i class="fas fa-users text-3xl mb-3 opacity-30 block"></i>No team members yet</div>';
}
function esc(s) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
function openMember(id) {
  const u = id ? TEAM.find(x=>x.id===id) : null;
  const isEdit = !!u;
  const f = u || { name:'', email:'', role:'viewer', plan:'free', status:'invited' };
  const html = '<div class="modal-box" style="max-width:480px"><div class="modal-head"><div style="display:flex;align-items:center;gap:.7rem;"><div style="width:36px;height:36px;border-radius:12px;background:#ff6b6b22;color:#ff6b6b;display:flex;align-items:center;justify-content:center;"><i class="fas fa-user-plus"></i></div><div><h2 class="text-base font-bold" style="color:var(--text)">'+(isEdit?'Edit member':'Invite user')+'</h2></div></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="mf" class="modal-body space-y-4">'+
      '<div><label class="field-label">Name</label><input class="input" name="name" value="'+esc(f.name)+'"></div>'+
      '<div><label class="field-label">Email</label><input class="input" name="email" value="'+esc(f.email)+'"></div>'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Role</label><select class="select" name="role">'+['admin','editor','viewer','billing'].map(r=>'<option value="'+r+'" '+(f.role===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div>'+
      '<div><label class="field-label">Plan</label><select class="select" name="plan">'+['free','pro','business','enterprise'].map(r=>'<option value="'+r+'" '+(f.plan===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div></div>'+
      '<div><label class="field-label">Status</label><select class="select" name="status">'+['active','invited','suspended'].map(r=>'<option value="'+r+'" '+(f.status===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div>'+
    '</form>'+
    '<div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button id="ms" class="btn btn-primary"><i class="fas fa-save"></i> '+(isEdit?'Save':'Invite')+'</button></div></div>';
  const m = LH.openModal(html);
  m.querySelector('#ms').onclick = async () => {
    const fd = new FormData(m.querySelector('#mf'));
    const body = Object.fromEntries(fd); if (isEdit) body.id = id;
    try { await LH.api('/api/admin/team', { method:'POST', body: JSON.stringify(body) }); LH.toast('success', isEdit?'Updated':'Invited'); m.remove(); load(); }
    catch (e) { LH.toast('error', 'Save failed', e.message); }
  };
}
async function delMember(id) {
  const yes = await LH.confirm({ title:'Remove member?', danger:true });
  if (!yes) return;
  await LH.api('/api/admin/team/'+id, { method:'DELETE' }); LH.toast('success','Removed'); load();
}
load();
</script>
`)}
`;

// ============================================================
// /dashboard/billing
// ============================================================
export const billingPage = () => `${HEAD('Billing — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('billing'), `
${topbar('Billing', 'Manage your plan and payment method')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-6 animate-fade-up">
  <div id="planBox" class="grid grid-cols-1 lg:grid-cols-3 gap-4"></div>
  <div>
    <h3 class="text-sm font-semibold mb-3" style="color:var(--text)">Plans</h3>
    <div id="plansGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"></div>
  </div>
</div>
<script>
const PLANS = [
  { id:'free', name:'Free', price:0, quota:1000, color:'#71717a' },
  { id:'pro', name:'Pro', price:19, quota:100000, color:'#4ecdc4' },
  { id:'business', name:'Business', price:79, quota:1000000, color:'#b8a9e8', popular:true },
  { id:'enterprise', name:'Enterprise', price:-1, quota:-1, color:'#f5a623' },
];
let SETTINGS = [];
async function load() { const r = await LH.api('/api/admin/settings?group=billing'); SETTINGS = r.data; render(); }
function val(k) { return SETTINGS.find(s=>s.key===k)?.value || ''; }
function render() {
  const used = Number(val('plan_used_today')) || 0; const quota = Number(val('plan_quota_daily')) || 1;
  const pct = Math.min(100, Math.round(used/quota*100));
  document.getElementById('planBox').innerHTML =
    '<div class="card p-6 lg:col-span-2"><div class="flex items-center justify-between mb-4"><div><p class="text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Current plan</p>'+
    '<h3 class="text-2xl font-bold mt-1" style="color:var(--text)">'+val('current_plan')+'</h3><p class="text-sm" style="color:var(--text-soft)">$'+val('plan_price_usd')+'/month · Next invoice '+val('next_invoice_date')+'</p></div>'+
    '<div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background:#b8a9e822;color:#b8a9e8"><i class="fas fa-credit-card text-lg"></i></div></div>'+
    '<div class="h-2 rounded-full overflow-hidden" style="background:var(--border)"><div class="h-full rounded-full" style="width:'+pct+'%;background:#b8a9e8;transition:all .5s ease"></div></div>'+
    '<p class="text-[11px] mt-2" style="color:var(--text-mute)">'+LH.fmt(used)+' of '+LH.fmt(quota)+' requests used today · '+pct+'%</p></div>'+
    '<div class="card p-6"><p class="text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Payment method</p>'+
    '<p class="text-sm font-semibold mt-2" style="color:var(--text)">'+val('payment_method')+'</p><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">Auto-renew on '+val('next_invoice_date')+'</p>'+
    '<button class="btn btn-ghost btn-sm mt-4" onclick="LH.toast(\\'info\\', \\'Stripe integration\\', \\'Connect Stripe in Settings to enable payment updates.\\')"><i class="fas fa-pen text-[10px]"></i> Update card</button></div>';
  const cur = val('current_plan').toLowerCase();
  document.getElementById('plansGrid').innerHTML = PLANS.map(p => {
    const isCur = cur===p.id;
    return '<div class="card '+(p.popular?'':'')+' p-5 relative" '+(p.popular?'style="border-color:#b8a9e8"':'')+'>'+
      (p.popular?'<span class="pill pill-lilac" style="position:absolute;top:-10px;left:1.2rem">Popular</span>':'')+
      '<p class="text-sm font-bold mt-2" style="color:'+p.color+'">'+p.name+'</p>'+
      '<p class="text-2xl font-bold mt-2" style="color:var(--text)">'+(p.price===-1?'Custom':'$'+p.price)+'</p>'+
      '<p class="text-[11px]" style="color:var(--text-mute)">'+(p.price===-1?'contact us':'/ month')+'</p>'+
      '<p class="text-[11px] mt-3" style="color:var(--text-soft)">'+(p.quota===-1?'Unlimited':LH.fmt(p.quota)+' req/day')+'</p>'+
      '<button class="btn '+(isCur?'btn-ghost':'btn-ink')+' btn-sm w-full mt-4" '+(isCur?'disabled':'')+' onclick="switchPlan(\\'__P__\\','+p.price+','+p.quota+')">'+(isCur?'Current plan':'Switch plan')+'</button>'.replaceAll('__P__', p.name)+
    '</div>';
  }).join('');
}
async function switchPlan(name, price, quota) {
  try {
    await LH.api('/api/admin/settings/current_plan', { method:'PATCH', body: JSON.stringify({ value: name }) });
    await LH.api('/api/admin/settings/plan_price_usd', { method:'PATCH', body: JSON.stringify({ value: String(price===-1?0:price) }) });
    await LH.api('/api/admin/settings/plan_quota_daily', { method:'PATCH', body: JSON.stringify({ value: String(quota===-1?10000000:quota) }) });
    LH.toast('success','Plan switched','You are now on '+name); load();
  } catch (e) { LH.toast('error','Switch failed', e.message); }
}
load();
</script>
`)}
`;

// ============================================================
// /dashboard/analytics
// ============================================================
export const analyticsPage = () => `${HEAD('Analytics — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('analytics'), `
${topbar('Analytics', 'Performance and usage insights')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-6 animate-fade-up">
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="card p-5"><div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#b8a9e822;color:#b8a9e8"><i class="fas fa-bolt text-[12px]"></i></div><div class="text-2xl font-bold" style="color:var(--text)">208K</div><p class="text-[11px]" style="color:var(--text-mute)">Total requests · 7d</p></div>
    <div class="card p-5"><div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#ff6b6b22;color:#ff6b6b"><i class="fas fa-exclamation-triangle text-[12px]"></i></div><div class="text-2xl font-bold" style="color:var(--text)">64</div><p class="text-[11px]" style="color:var(--text-mute)">Errors · 7d</p></div>
    <div class="card p-5"><div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#f5a62322;color:#f5a623"><i class="fas fa-tachometer-alt text-[12px]"></i></div><div class="text-2xl font-bold" style="color:var(--text)">18ms</div><p class="text-[11px]" style="color:var(--text-mute)">Avg latency</p></div>
    <div class="card p-5"><div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#4ecdc422;color:#4ecdc4"><i class="fas fa-key text-[12px]"></i></div><div class="text-2xl font-bold" style="color:var(--text)">25</div><p class="text-[11px]" style="color:var(--text-mute)">Unique keys</p></div>
  </div>
  <div class="card p-6"><h3 class="text-sm font-semibold mb-5" style="color:var(--text)"><i class="fas fa-chart-bar text-[#b8a9e8] mr-2"></i>Requests vs Errors</h3><canvas id="c1" height="100"></canvas></div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div class="card p-6"><h3 class="text-sm font-semibold mb-5" style="color:var(--text)"><i class="fas fa-tachometer-alt text-[#f5a623] mr-2"></i>Latency trend</h3><canvas id="c2" height="120"></canvas></div>
    <div class="card p-6"><h3 class="text-sm font-semibold mb-5" style="color:var(--text)"><i class="fas fa-chart-pie text-[#4ecdc4] mr-2"></i>Endpoint share</h3><canvas id="c3" height="120"></canvas></div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const data = [
  { d:'Mon', req:18234, err:12, lat:19 },{ d:'Tue', req:24561, err:9, lat:18 },{ d:'Wed', req:19823, err:6, lat:17 },
  { d:'Thu', req:35621, err:14, lat:20 },{ d:'Fri', req:42183, err:11, lat:18 },{ d:'Sat', req:28934, err:5, lat:16 },{ d:'Sun', req:38291, err:7, lat:17 }
];
new Chart(document.getElementById('c1'), { type:'bar', data:{ labels: data.map(d=>d.d), datasets:[
  { label:'Requests', data: data.map(d=>d.req), backgroundColor:'#b8a9e8', borderRadius:6 },
  { label:'Errors x 1k', data: data.map(d=>d.err*1000), backgroundColor:'#ff6b6b', borderRadius:6 }
]}, options:{ responsive:true, plugins:{ legend:{ labels:{ color:'#a1a1aa', font:{ size:11 } } } }, scales: chartScales() } });
new Chart(document.getElementById('c2'), { type:'line', data:{ labels: data.map(d=>d.d), datasets:[{ data: data.map(d=>d.lat), borderColor:'#f5a623', backgroundColor:'rgba(245,166,35,.1)', tension:.4, fill:true, pointRadius:4, pointBackgroundColor:'#f5a623' }]}, options:{ responsive:true, plugins:{ legend:{ display:false } }, scales: chartScales() } });
new Chart(document.getElementById('c3'), { type:'doughnut', data:{ labels:['/logo/*','/search','/flags/*','/crypto/*','/football/*'], datasets:[{ data:[45,28,14,9,4], backgroundColor:['#b8a9e8','#f5a623','#4ecdc4','#ff6b6b','#4ade80'], borderWidth:0 }]}, options:{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{ color:'#a1a1aa', font:{ size:11 }, padding:12 } } } } });
function chartScales() { return { x:{ grid:{ color:'rgba(255,255,255,.04)' }, ticks:{ color:'#71717a', font:{ size:11 } } }, y:{ grid:{ color:'rgba(255,255,255,.04)' }, ticks:{ color:'#71717a', font:{ size:11 } } } }; }
</script>
`)}
`;

// ============================================================
// /dashboard/activity
// ============================================================
export const activityPage = () => `${HEAD('Activity — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('activity'), `
${topbar('Activity', 'Complete audit log of every change')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto animate-fade-up">
  <div class="card overflow-hidden"><div id="aList" class="divide-y" style="border-color:var(--border)"></div></div>
</div>
<script>
async function load() {
  try { const r = await LH.api('/api/admin/activity');
    const colorMap = { create:'#4ade80', delete:'#ff6b6b', update:'#f5a623', upload:'#4ecdc4', key:'#b8a9e8', publish:'#4ade80', login:'#b8a9e8', billing:'#ff6b6b' };
    const iconMap = { create:'fa-plus', delete:'fa-trash', update:'fa-pen', upload:'fa-upload', key:'fa-key', publish:'fa-rocket', login:'fa-shield', billing:'fa-credit-card' };
    document.getElementById('aList').innerHTML = r.data.map(a => {
      const c = colorMap[a.type] || '#b8a9e8';
      return '<div class="px-5 py-3.5 flex items-start gap-3">'+
        '<div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background:'+c+'22;color:'+c+'"><i class="fas '+(iconMap[a.type]||'fa-history')+' text-[12px]"></i></div>'+
        '<div class="flex-1 min-w-0">'+
          '<div class="flex flex-wrap items-center gap-2"><p class="text-sm font-semibold" style="color:var(--text)">'+a.actor+'</p>'+
          '<span class="text-sm" style="color:var(--text-soft)">'+a.action+'</span><span style="color:var(--text-soft)">·</span>'+
          '<code class="text-xs font-mono" style="color:var(--text)">'+a.target+'</code>'+
          '<span class="pill" style="background:'+c+'22;color:'+c+';border-color:'+c+'55">'+a.type+'</span></div>'+
          (a.details?'<p class="text-[11px] mt-1" style="color:var(--text-mute)">'+a.details+'</p>':'')+
        '</div>'+
        '<span class="text-[11px] shrink-0 whitespace-nowrap" style="color:var(--text-mute)">'+LH.rel(a.ts)+'</span>'+
      '</div>';
    }).join('');
  } catch (e) { LH.toast('error','Load failed', e.message); }
}
load();
</script>
`)}
`;
