import { HEAD, COMMON_JS, renderStatSkeletons } from './shared';
import { sidebar, topbar, shellWrap, creatorSidebar, consumerSidebar, ctxSidebar, PageCtx, ADMIN_CTX, CREATOR_CTX, CONSUMER_CTX } from './layout';

// ============================================================
// /dashboard/settings  — including Git
// ============================================================
export const settingsPage = () => `${HEAD('Settings — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('settings'), `
${topbar('Settings', 'Platform, Git integration, branding and stats')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-1400 mx-auto space-y-5 animate-fade-up">
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
function group(g) { return SETTINGS.filter(function(s){ return s.group===g || s.group_name===g; }); }
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
    '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">'+ group('brand').map(s => '<div class="card p-4"><p class="text-[11px] font-semibold uppercase tracking-wide mb-2" style="color:var(--text-mute)">'+s.label+'</p><div class="color-input"><input type="color" value="'+s.value+'" onchange="saveSetting(\\'__K__\\', this.value)"><code class="text-xs" style="color:var(--text)">'+s.value+'</code></div></div>'.replaceAll('__K__', s.key)).join('') +'</div>'+
    '<div style="border-top:1px solid var(--border);margin-top:1rem;padding-top:1rem">'+
      '<p class="text-[11px] font-semibold uppercase tracking-wide mb-3" style="color:var(--text-mute)">Logo & Favicon</p>'+
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">'+
        '<div class="card p-4"><p class="text-[10px] font-semibold mb-2" style="color:var(--text-mute)">LOGO</p>'+
          '<div style="display:flex;align-items:center;gap:1rem">'+
            '<div id="logoPreview" style="width:64px;height:64px;border-radius:16px;background:var(--lilac);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:#1a1a1a;overflow:hidden">L</div>'+
            '<div><label class="btn btn-ghost btn-sm" style="cursor:pointer"><i class="fas fa-upload text-[10px] mr-1"></i> Upload logo<input type="file" class="hidden" accept="image/*" onchange="LH.handleLogoUpload(this)"></label><p class="text-[9px] mt-1" style="color:var(--text-mute)">Recommended: SVG or PNG, 128x128px</p></div>'+
          '</div>'+
        '</div>'+
        '<div class="card p-4"><p class="text-[10px] font-semibold mb-2" style="color:var(--text-mute)">FAVICON</p>'+
          '<div style="display:flex;align-items:center;gap:1rem">'+
            '<div id="faviconPreview" style="width:32px;height:32px;border-radius:8px;background:var(--lilac);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;color:#1a1a1a;overflow:hidden">L</div>'+
            '<div><label class="btn btn-ghost btn-sm" style="cursor:pointer"><i class="fas fa-upload text-[10px] mr-1"></i> Upload favicon<input type="file" class="hidden" accept="image/*,.ico" onchange="LH.handleFaviconUpload(this)"></label><p class="text-[9px] mt-1" style="color:var(--text-mute)">Recommended: ICO or PNG, 32x32px</p></div>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div></div>';
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

LH.guardRole(['admin']).then(function(u) { if (u) load(); });

</script>
`)}
`;

// ============================================================
// /dashboard/team
// ============================================================
export const teamPage = () => `${HEAD('Team — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('team'), `
${topbar('Team', 'Invite and manage members')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-1400 mx-auto space-y-5 animate-fade-up">
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
  const html = '<div class="modal-box" style="max-width:520px"><div class="modal-head"><div style="display:flex;align-items:center;gap:.7rem;"><div style="width:36px;height:36px;border-radius:12px;background:'+(isEdit?'#f5a62322':'#4ecdc422')+';color:'+(isEdit?'#f5a623':'#4ecdc4')+';display:flex;align-items:center;justify-content:center;"><i class="fas '+(isEdit?'fa-user-pen':'fa-envelope')+'"></i></div><div><h2 class="text-base font-bold" style="color:var(--text)">'+(isEdit?'Edit member':'Invite team member')+'</h2><p class="text-[11px]" style="color:var(--text-mute)">'+(isEdit?'Update role, plan, or status':'Send an email invitation to join your team')+'</p></div></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="mf" class="modal-body space-y-4">'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Full Name</label><input class="input" name="name" value="'+esc(f.name)+'" placeholder="e.g. Ana Costa"></div>'+
      '<div><label class="field-label">Email</label><input class="input" name="email" type="email" value="'+esc(f.email)+'" placeholder="ana@company.com"></div></div>'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Role</label><select class="select" name="role">'+['admin','editor','viewer','billing'].map(r=>'<option value="'+r+'" '+(f.role===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div>'+
      '<div><label class="field-label">Plan</label><select class="select" name="plan">'+['free','pro','business','enterprise'].map(r=>'<option value="'+r+'" '+(f.plan===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div></div>'+
      '<div><label class="field-label">Status</label><select class="select" name="status">'+['active','invited','suspended'].map(r=>'<option value="'+r+'" '+(f.status===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div>'+
      (!isEdit ? '<div class="p-4 rounded-xl" style="background:rgba(78,205,196,.04);border:1px solid rgba(78,205,196,.12)"><div class="flex items-start gap-3"><div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:rgba(78,205,196,.15);color:#4ecdc4"><i class="fas fa-paper-plane text-[11px]"></i></div><div><p class="text-sm font-semibold" style="color:var(--text)">Send invitation email</p><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">'+(esc(f.email||'')||'The member')+' will receive an email with a link to create their account and join your team.</p><label class="flex items-center gap-2 mt-2 cursor-pointer"><input type="checkbox" name="sendInviteEmail" checked style="accent-color:#4ecdc4"><span class="text-[11px]" style="color:var(--text-soft)">Send invitation now</span></label></div></div></div>' : '')+
    '</form>'+
    '<div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button id="ms" class="btn btn-primary"><i class="fas fa-'+(isEdit?'save':'paper-plane')+'"></i> '+(isEdit?'Save changes':'Send invite')+'</button></div></div>';
  const m = LH.openModal(html);
  m.querySelector('#ms').onclick = async () => {
    const fd = new FormData(m.querySelector('#mf'));
    const body = Object.fromEntries(fd); if (isEdit) body.id = id;
    const sendInvite = body.sendInviteEmail === 'on'; delete body.sendInviteEmail;
    try { 
      await LH.api('/api/admin/team', { method:'POST', body: JSON.stringify(body) }); 
      if (!isEdit && sendInvite && body.email) {
        // Call invite endpoint
        await fetch('/api/admin/team/invite', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: body.email, name: body.name, role: body.role, plan: body.plan }) }).catch(function(){});
      }
      LH.toast('success', isEdit?'Member updated':'Invitation sent!', body.email);
      m.remove(); load(); 
    }
    catch (e) { LH.toast('error', 'Save failed', e.message); }
  };
}
async function delMember(id) {
  const yes = await LH.confirm({ title:'Remove member?', danger:true });
  if (!yes) return;
  await LH.api('/api/admin/team/'+id, { method:'DELETE' }); LH.toast('success','Removed'); load();
}
LH.guardRole(['admin']).then(function(u) { if (u) load(); });

</script>
`)}
`;

// ============================================================
// /dashboard/billing
// ============================================================

// ============================================================
// /dashboard/users  — User Management (Admin)
// ============================================================
export const usersPage = () => `${HEAD('Users — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('users'), `
${topbar('Users', 'Manage all users: Admin, Creator, Consumer')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-1400 mx-auto space-y-5 animate-fade-up">
  <div class="flex items-center gap-3">
    <h3 class="text-sm font-semibold" style="color:var(--text)">All Users</h3>
    <span id="uCount" class="text-[11px]" style="color:var(--text-mute)">—</span>
    <div class="flex gap-2 ml-auto">
      <select id="roleFilter" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderUsers()">
        <option value="">All roles</option><option value="admin">Admin</option><option value="creator">Creator</option><option value="consumer">Consumer</option>
      </select>
      <select id="planFilter" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderUsers()">
        <option value="">All plans</option><option value="free">Free</option><option value="pro">Pro</option><option value="business">Business</option><option value="enterprise">Enterprise</option>
      </select>
    </div>
  </div>
  <div class="card overflow-hidden"><div id="uList" class="divide-y" style="border-color:var(--border)"></div></div>
</div>
<script>
let USERS = [];
async function load() {
  try { const r = await LH.api('/api/v1/auth/admin/users'); USERS = r.data; renderUsers(); }
  catch(e) { LH.toast('error','Failed to load users',e.message); }
}
function renderUsers() {
  const role = document.getElementById('roleFilter')?.value || '';
  const plan = document.getElementById('planFilter')?.value || '';
  const list = USERS.filter(u => (!role || u.role===role) && (!plan || u.plan===plan));
  document.getElementById('uCount').textContent = list.length + ' users';
  const roleC = { admin:'#b8a9e8', creator:'#f5a623', consumer:'#4ecdc4' };
  const stCls = { active:'pill-green', inactive:'pill-amber', suspended:'pill-coral' };
  const planCls = { free:'pill-neutral', pro:'pill-teal', business:'pill-lilac', enterprise:'pill-amber' };
  document.getElementById('uList').innerHTML = list.map(u => {
    const initials = (u.name||'').split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
    return '<div class="flex items-center gap-3 px-5 py-3.5">'+
      '<div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style="background:linear-gradient(135deg,'+(roleC[u.role]||'#b8a9e8')+','+(roleC[u.role]||'#f5a623')+');color:#1a1a1a">'+initials+'</div>'+
      '<div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate" style="color:var(--text)">'+esc(u.name)+'</p><p class="text-[11px] truncate" style="color:var(--text-mute)">'+esc(u.email)+'</p></div>'+
      '<div class="hidden md:flex items-center gap-2">'+
        '<span class="pill" style="background:'+(roleC[u.role]||'#b8a9e8')+'22;color:'+(roleC[u.role]||'#b8a9e8')+';border-color:'+(roleC[u.role]||'#b8a9e8')+'55">'+u.role+'</span>'+
        '<span class="pill '+(planCls[u.plan]||'pill-neutral')+'">'+u.plan+'</span>'+
        '<span class="pill '+(stCls[u.status]||'pill-neutral')+'">'+u.status+'</span>'+
      '</div>'+
      (u.role==='creator'?'<span class="text-[11px] hidden lg:inline min-w-[80px] text-right" style="color:#f5a623">$'+(u.earnings_balance||0).toFixed(2)+' earned</span>':'')+
      '<span class="text-[11px] hidden lg:inline min-w-[80px] text-right" style="color:var(--text-mute)">'+LH.fmt(u.requests_today||0)+' reqs</span>'+
      '<button class="btn btn-ghost btn-icon-sm" onclick="editUser(\''+u.id+'\')"><i class="fas fa-pen text-[10px]"></i></button>'+
    '</div>';
  }).join('') || '<div class="empty-state"><i class="fas fa-users text-3xl mb-3 opacity-30 block"></i>No users found</div>';
}
function esc(s) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
function editUser(id) {
  const u = USERS.find(x=>x.id===id); if(!u)return;
  const html = '<div class="modal-box" style="max-width:480px"><div class="modal-head"><div style="display:flex;align-items:center;gap:.7rem;"><div style="width:36px;height:36px;border-radius:12px;background:#ff6b6b22;color:#ff6b6b;display:flex;align-items:center;justify-content:center;"><i class="fas fa-user-edit"></i></div><div><h2 class="text-base font-bold" style="color:var(--text)">Edit User</h2><p class="text-[11px]" style="color:var(--text-mute)">'+esc(u.name)+'</p></div></div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<form id="uf" class="modal-body space-y-4">'+
      '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:.5rem">'+
        '<div style="position:relative;cursor:pointer" onclick="document.getElementById(\\'avatarUpload_'+u.id+'\\').click()">'+
          '<div id="userAvatar_'+u.id+'" style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#b8a9e8,#f5a623);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:800;color:#1a1a1a;overflow:hidden">'+
            (u.avatar_url ? '<img src="'+u.avatar_url+'" style="width:100%;height:100%;object-fit:cover">' : '<span>'+esc(u.name).split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()+'</span>')+
          '</div>'+
          '<div style="position:absolute;bottom:0;right:0;width:18px;height:18px;border-radius:50%;background:var(--lilac);display:flex;align-items:center;justify-content:center;font-size:8px;color:#1a1a1a"><i class="fas fa-camera"></i></div>'+
        '</div>'+
        '<div><p class="text-sm font-semibold" style="color:var(--text)">Profile photo</p><p class="text-[10px]" style="color:var(--text-mute)">Click to upload</p></div>'+
        '<input type="file" id="avatarUpload_'+u.id+'" accept="image/*" class="hidden">'+
      '</div>'+
      '<div><label class="field-label">Name</label><input class="input" name="name" value="'+esc(u.name)+'"></div>'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Role</label><select class="select" name="role">'+['admin','creator','consumer'].map(r=>'<option value="'+r+'" '+(u.role===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div>'+
      '<div><label class="field-label">Plan</label><select class="select" name="plan">'+['free','pro','business','enterprise'].map(r=>'<option value="'+r+'" '+(u.plan===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div></div>'+
      '<div><label class="field-label">Status</label><select class="select" name="status">'+['active','inactive','suspended'].map(r=>'<option value="'+r+'" '+(u.status===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div>'+
    '</form>'+
    '<div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button id="us" class="btn btn-primary"><i class="fas fa-save"></i> Save</button></div></div>';
  const m = LH.openModal(html);
  m.querySelector('#us').onclick = async () => {
    const fd = new FormData(m.querySelector('#uf'));
    const body = Object.fromEntries(fd);
    try { await LH.api('/api/v1/auth/admin/users/'+id, { method:'PATCH', body: JSON.stringify(body) }); LH.toast('success','User updated'); m.remove(); load(); }
    catch(e) { LH.toast('error','Save failed',e.message); }
  };
}
load();

</script>
`)}`;

// ============================================================
// /dashboard/creator  — Creator Dashboard
// ============================================================
export const creatorDashboardPage = () => `${HEAD('Creator Dashboard \u2014 LogoHub', COMMON_JS)}
${shellWrap(creatorSidebar('overview'), topbar('Creator Dashboard', 'Your earnings, APIs & analytics', CREATOR_CTX) + `
<div class="px-4 lg:px-6 py-5 lg:py-7 max-w-1440 mx-auto space-y-5 anim-fade-up">

  <!-- Welcome + avatar -->
  <div class="flex items-center gap-4 flex-wrap">
    <div class="relative cursor-pointer" onclick="document.getElementById('pfpCreator').click()">
      <div id="creatorAvatar" class="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black overflow-hidden transition-transform hover:scale-105" style="background:linear-gradient(135deg,var(--lilac),var(--amber));color:#12121a">
        <span id="creatorInitials">CD</span>
      </div>
      <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center text-[9px] shadow-lg" style="background:var(--lilac);color:#12121a"><i class="fas fa-camera"></i></div>
    </div>
    <div>
      <h2 class="text-lg font-extrabold tracking-tight" id="creatorGreeting">Creator Dashboard</h2>
      <p class="text-xs" style="color:var(--text-mute)">Earnings, content performance & analytics</p>
    </div>
    <input type="file" id="pfpCreator" accept="image/*" class="hidden" onchange="handleCreatorAvatar(this)">
    <div class="ml-auto flex gap-2">
      <a href="/dashboard/creator/content" class="btn btn-primary btn-sm"><i class="fas fa-plus text-[10px]"></i> New API</a>
      <a href="/dashboard/creator/analytics" class="btn btn-ghost btn-sm"><i class="fas fa-chart-bar text-[10px]"></i> Analytics</a>
    </div>
  </div>

  <!-- Stats grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 anim-stagger" id="creatorStats">
    <div class="card card-stats card-hover"><div class="stat-icon" style="background:rgba(245,166,35,.12);color:var(--amber)"><i class="fas fa-coins"></i></div><div class="stat-value" id="crEarnings">$0</div><div class="stat-label">Total earnings</div><div class="stat-trend" style="color:var(--text-mute)">Loading...</div></div>
    <div class="card card-stats card-hover"><div class="stat-icon" style="background:rgba(184,169,232,.12);color:var(--lilac)"><i class="fas fa-cube"></i></div><div class="stat-value" id="crTotalApis">0</div><div class="stat-label">Total APIs</div><div class="stat-trend" style="color:var(--text-mute)" id="crPublished">—</div></div>
    <div class="card card-stats card-hover"><div class="stat-icon" style="background:rgba(78,205,196,.12);color:var(--teal)"><i class="fas fa-bolt"></i></div><div class="stat-value" id="crRequests">0</div><div class="stat-label">Requests (30d)</div><div class="stat-trend" style="color:var(--text-mute)">—</div></div>
    <div class="card card-stats card-hover"><div class="stat-icon" style="background:rgba(52,211,153,.12);color:var(--green)"><i class="fas fa-star"></i></div><div class="stat-value" id="crRating">—</div><div class="stat-label">Avg rating</div><div class="stat-trend" style="color:var(--text-mute)">—</div></div>
  </div>

  <!-- My APIs + chart row -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-4">
    <div class="card p-5 lg:col-span-3">
      <div class="flex items-center justify-between mb-4">
        <div><h3 class="text-sm font-bold flex items-center gap-2"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:rgba(184,169,232,.12);color:var(--lilac)"><i class="fas fa-folder-open text-[11px]"></i></span>My APIs</h3><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">APIs you own or collaborate on</p></div>
        <a href="/dashboard/creator/content" class="btn btn-ghost btn-sm">View all</a>
      </div>
      <div class="overflow-x-auto"><table class="data-table">
        <thead><tr><th>API Name</th><th class="hidden sm:table-cell">Category</th><th>Status</th><th class="hidden md:table-cell">Updated</th></tr></thead>
        <tbody id="creatorApis"><tr><td colspan=4 style=text-align:center;color:var(--text-mute);padding:2rem>Loading APIs...</td></tr></tbody>
      </table></div>
    </div>
    <div class="card p-5 lg:col-span-2">
      <div class="mb-4"><h3 class="text-sm font-bold flex items-center gap-2"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:rgba(245,166,35,.12);color:var(--amber)"><i class="fas fa-chart-line text-[11px]"></i></span>Earnings &middot; 6 months</h3><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">Revenue breakdown</p></div>
      <div style="height:200px"><canvas id="earningsChart"></canvas></div>
    </div>
  </div>

  <!-- Tips -->
  <div class="card p-5" style="background:linear-gradient(135deg,rgba(184,169,232,.06),rgba(245,166,35,.04))">
    <div class="flex items-center gap-3 flex-wrap">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style="background:rgba(245,166,35,.15);color:var(--amber)">💡</div>
      <div class="flex-1">
        <p class="text-sm font-bold">Grow your API business</p>
        <p class="text-[11px]" style="color:var(--text-mute)">Complete your API documentation, add code examples, and respond to reviews — APIs with full docs get 3x more adoption.</p>
      </div>
      <a href="/dashboard/creator/content" class="btn btn-primary btn-sm">Optimize APIs</a>
    </div>
  </div>

</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
LH.guardRole(['creator']).then(function(u){if(u)initCreator()});

async function initCreator(){
  // Load user for avatar
  var me=LH.me();
  if(me){
    var initials=(me.name||'C').split(' ').map(function(s){return s[0]}).join('').slice(0,2).toUpperCase();
    document.getElementById('creatorInitials').textContent=initials;
    document.getElementById('creatorGreeting').textContent='Welcome, '+me.name.split(' ')[0]+'!';
    if(me.avatar_url){var img=document.createElement('img');img.src=me.avatar_url;img.style.cssText='width:100%;height:100%;object-fit:cover';var a=document.getElementById('creatorAvatar');a.innerHTML='';a.appendChild(img)}
  }
  // Load creator stats
  try{
    var sr=await LH.api('/api/v1/creator/dashboard/summary');
    var apis=await LH.api('/api/v1/creator/apis');
    renderCreatorStats(sr.data);
    renderCreatorApis(apis.data);
  }catch(e){console.warn('Creator stats:',e.message)}
  renderEarningsChart();
}

function renderCreatorStats(d){
  document.getElementById('crEarnings').textContent='$'+LH.fmt(d.revenue_month||0);
  document.getElementById('crTotalApis').textContent=d.total_apis||0;
  document.getElementById('crPublished').innerHTML='<span style=color:var(--green)>'+LH.fmt(d.published_apis||0)+'</span> published';
  document.getElementById('crRequests').textContent=LH.fmt(d.total_requests_30d||0);
  document.getElementById('crRating').textContent=d.avg_rating||'—';
  // Update trend indicators
  var earnCard=document.getElementById('crEarnings').closest('.card-stats');
  if(earnCard){var t=earnCard.querySelector('.stat-trend');t.innerHTML='<i class="fas fa-arrow-up text-[9px]"></i> +18%';t.style.color='var(--green)'}
}

function renderCreatorApis(apis){
  var el=document.getElementById('creatorApis');
  if(!apis||!apis.length){el.innerHTML='<tr><td colspan=4 style=text-align:center;padding:2rem;color:var(--text-mute)>No APIs yet — <a href=/dashboard/creator/content style=color:var(--lilac)>create one</a></td></tr>';return}
  el.innerHTML=apis.slice(0,8).map(function(a){
    var sp={Draft:'pill-neutral',Beta:'pill-blue','Public':'pill-green',Deprecated:'pill-amber',Archived:'pill-coral'}[a.status]||'pill-neutral';
    return '<tr><td class=font-semibold>'+a.name+'</td><td class="hidden sm:table-cell cell-mono">'+a.category+'</td><td><span class="pill '+sp+'">'+a.status+'</span></td><td class="hidden md:table-cell">'+LH.rel(a.updated_at)+'</td></tr>'}).join('');
}

function renderEarningsChart(){
  var ctx=document.getElementById('earningsChart');if(!ctx)return;
  new Chart(ctx,{type:'bar',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{data:[180,245,310,198,412,247],backgroundColor:['rgba(184,169,232,.4)','rgba(184,169,232,.5)','rgba(245,166,35,.4)','rgba(184,169,232,.4)','rgba(245,166,35,.5)','rgba(184,169,232,.4)'],borderColor:'var(--lilac)',borderWidth:1,borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:'var(--text-mute)',font:{size:10}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'var(--text-mute)',font:{size:10},callback:function(v){return '$'+v}}}}});
}

function handleCreatorAvatar(input){
  var f=input.files[0];if(!f)return;var r=new FileReader();
  r.onload=function(e){var img=document.createElement('img');img.src=e.target.result;img.style.cssText='width:100%;height:100%;object-fit:cover';var a=document.getElementById('creatorAvatar');a.innerHTML='';a.appendChild(img);LH.api('/api/v1/auth/me',{method:'PATCH',body:JSON.stringify({avatar_url:e.target.result})}).catch(function(){})};
  r.readAsDataURL(f);
}
</script>
`)})`;export const consumerDashboardPage = () => `${HEAD('Consumer Dashboard \u2014 LogoHub', COMMON_JS)}
${shellWrap(consumerSidebar('overview'), topbar('Consumer Dashboard', 'Your usage, keys & plan', CONSUMER_CTX) + `
<div class="px-4 lg:px-6 py-5 lg:py-7 max-w-1440 mx-auto space-y-5 anim-fade-up">

  <!-- Plan banner -->
  <div class="card p-5" style="border-color:rgba(184,169,232,.25);background:linear-gradient(135deg,rgba(184,169,232,.06),transparent 60%)">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm" style="background:rgba(184,169,232,.15);color:var(--lilac)"><i class="fas fa-crown"></i></div>
        <div>
          <div class="flex items-center gap-2">
            <span id="planPill" class="pill pill-lilac">Loading...</span>
            <span class="text-[11px]" style="color:var(--text-soft)" id="planQuotaLabel">—</span>
          </div>
          <p class="text-[11px] mt-1" style="color:var(--text-mute)" id="planUsageLine">Loading usage data...</p>
        </div>
      </div>
      <a href="/#pricing" class="btn btn-primary btn-sm"><i class="fas fa-arrow-up text-[10px]"></i> Upgrade</a>
    </div>
    <div class="progress mt-3"><div class="progress-bar lilac" id="planQuotaBar" style="width:0%"></div></div>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 anim-stagger" id="consumerStats">
    ${renderStatSkeletons(4)}
  </div>

  <!-- Keys + usage row -->
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-4">
    <div class="card p-5 lg:col-span-3">
      <div class="flex items-center justify-between mb-4">
        <div><h3 class="text-sm font-bold flex items-center gap-2"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:rgba(245,166,35,.12);color:var(--amber)"><i class="fas fa-key text-[11px]"></i></span>My API Keys</h3><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">Quick access to your keys</p></div>
        <a href="/dashboard/consumer/keys" class="btn btn-primary btn-sm"><i class="fas fa-plus text-[10px]"></i> New Key</a>
      </div>
      <div class="overflow-x-auto"><table class="data-table">
        <thead><tr><th>Name</th><th>Key preview</th><th>Status</th><th class="hidden sm:table-cell">Requests</th><th class="hidden sm:table-cell">Last used</th><th></th></tr></thead>
        <tbody id="consumerKeys"><tr><td colspan=6 style=text-align:center;color:var(--text-mute);padding:2rem>Loading...</td></tr></tbody>
      </table></div>
    </div>
    <div class="card p-5 lg:col-span-2">
      <div class="mb-4"><h3 class="text-sm font-bold flex items-center gap-2"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:rgba(78,205,196,.12);color:var(--teal)"><i class="fas fa-chart-bar text-[11px]"></i></span>Usage by key</h3><p class="text-[11px] mt-0.5" style="color:var(--text-mute)">Request distribution</p></div>
      <div class="space-y-3" id="usageByKey"><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text" style="width:80%"></div></div>
    </div>
  </div>

  <!-- Catalog CTA -->
  <div class="card p-5" style="background:linear-gradient(135deg,rgba(78,205,196,.06),rgba(184,169,232,.04))">
    <div class="flex items-center gap-3 flex-wrap">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style="background:rgba(78,205,196,.15);color:var(--teal)">🔍</div>
      <div class="flex-1">
        <p class="text-sm font-bold">Explore the API catalog</p>
        <p class="text-[11px]" style="color:var(--text-mute)">Browse 50,000+ logos, icons, flags and brand assets ready to integrate.</p>
      </div>
      <a href="/explorer" class="btn btn-ghost btn-sm">Browse catalog <i class="fas fa-arrow-right text-[10px]"></i></a>
    </div>
  </div>

</div>
<script>
LH.guardRole(['consumer']).then(function(u){if(u)initConsumer()});

async function initConsumer(){
  var me=LH.me();
  try{
    var qr=await LH.api('/api/v1/usage/quota');
    var sr=await LH.api('/api/v1/usage/summary');
    var kr=await LH.api('/api/v1/keys');
    renderPlan(qr.data);
    renderStats(qr.data,sr.data);
    renderKeys(kr.data);
    renderUsage(sr.data.by_key||[]);
  }catch(e){LH.toast('error','Failed to load dashboard',e.message)}
}

function renderPlan(q){
  var plan=(q.plan||'free'),name=plan.charAt(0).toUpperCase()+plan.slice(1);
  var pil=document.getElementById('planPill');pil.textContent=name+' Plan';
  pil.className='pill pill-'+(plan==='enterprise'?'amber':plan==='business'?'lilac':plan==='pro'?'teal':'neutral');
  document.getElementById('planQuotaLabel').textContent=q.quota_daily===-1?'Unlimited requests':LH.fmt(q.quota_daily)+' req/day';
  document.getElementById('planUsageLine').innerHTML='Used <strong style=color:var(--text)>'+LH.fmt(q.used_today||0)+'</strong> of '+(q.quota_daily===-1?'unlimited':LH.fmt(q.quota_daily))+' today ('+(q.quota_daily===-1?'—':LH.fmt(Math.max(q.quota_daily-(q.used_today||0),0))+' remaining')+')';
  document.getElementById('planQuotaBar').style.width=q.quota_daily===-1?'4%':Math.min(q.percent_used||0,100)+'%';
  if(q.percent_used>=90){document.getElementById('planQuotaBar').className='progress-bar coral'}
  else if(q.percent_used>=80){document.getElementById('planQuotaBar').className='progress-bar amber'}
  else{document.getElementById('planQuotaBar').className='progress-bar lilac'}
}

function renderStats(q,s){
  var errRate=s.total_requests>0?Math.max(0,100-((s.revoked_keys||0)/Math.max(1,s.active_keys+(s.revoked_keys||0))*100)).toFixed(1):'100.0';
  var cards=[
    {icon:'fa-bolt',bg:'rgba(184,169,232,.12)',fg:'var(--lilac)',val:LH.fmt(q.used_today||0),lbl:'Requests today'},
    {icon:'fa-key',bg:'rgba(245,166,35,.12)',fg:'var(--amber)',val:LH.fmt(s.active_keys||0),lbl:'Active keys'},
    {icon:'fa-chart-line',bg:'rgba(78,205,196,.12)',fg:'var(--teal)',val:LH.fmt(q.used_30d||0),lbl:'Requests (30d)'},
    {icon:'fa-shield-check',bg:'rgba(52,211,153,.12)',fg:'var(--green)',val:errRate+'%',lbl:'Key health'}
  ];
  document.getElementById('consumerStats').innerHTML=cards.map(function(c){
    return '<div class="card card-stats card-hover"><div class=stat-icon style=background:'+c.bg+';color:'+c.fg+'><i class="fas '+c.icon+'"></i></div><div class=stat-value>'+c.val+'</div><div class=stat-label>'+c.lbl+'</div></div>'}).join('');
}

function renderKeys(keys){
  var el=document.getElementById('consumerKeys');
  if(!keys.length){el.innerHTML='<tr><td colspan=6 style=text-align:center;padding:2rem;color:var(--text-mute)>No API keys yet — <a href=/dashboard/consumer/keys style=color:var(--lilac)>create one</a></td></tr>';return}
  el.innerHTML=keys.slice(0,8).map(function(k){
    var sp=k.status==='active'?'pill-green':k.status==='revoked'?'pill-coral':'pill-amber';
    return '<tr><td class=font-semibold>'+k.name+'</td><td class=cell-mono>'+(k.key_preview||k.prefix||'••••')+'</td><td><span class="pill '+sp+'">'+k.status+'</span></td><td class="hidden sm:table-cell">'+LH.fmt(k.requests||0)+'</td><td class="hidden sm:table-cell">'+LH.rel(k.last_used)+'</td><td><button class="btn btn-ghost btn-icon-sm" onclick="LH.copy(\''+(k.key||'')+'\',\'Copied!\')" title=Copy><i class="fas fa-copy text-[10px]"></i></button></td></tr>'}).join('');
}

function renderUsage(byKey){
  var el=document.getElementById('usageByKey');
  if(!byKey||!byKey.length){el.innerHTML='<div class=empty-state style=padding:2rem><div class=empty-icon><i class="fas fa-chart-bar"></i></div><h3>No data yet</h3><p>Requests will appear here</p></div>';return}
  var max=Math.max(1,byKey.reduce(function(s,k){return Math.max(s,k.requests||0)},0));
  var colors=['var(--lilac)','var(--teal)','var(--amber)','var(--green)','var(--blue)'];
  el.innerHTML=byKey.map(function(k,i){
    var pct=max?Math.round((k.requests||0)/max*100):0;
    var color=colors[i%colors.length];
    return '<div><div style=display:flex;justify-content:space-between;margin-bottom:.35rem><span style=font-size:.78rem;font-weight:500;color:var(--text)>'+k.name+'</span><span style=font-size:.7rem;color:var(--text-mute)>'+LH.fmt(k.requests||0)+' reqs</span></div><div class=progress><div class=progress-bar style=width:'+pct+'%;background:'+color+'></div></div></div>'}).join('');
}
</script>
`)})`;export const billingPage = () => `${HEAD('Billing — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('billing'), `
${topbar('Billing', 'Manage your plan and payment method')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-1400 mx-auto space-y-6 animate-fade-up">

  <!-- TOP ROW: CURRENT PLAN + PAYMENT -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4" id="planBox"></div>

  <!-- PLANS HEADER + MONTHLY/YEARLY -->
  <div class="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h2 class="text-lg font-bold flex items-center gap-2" style="color:var(--text)">
        <span class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:#b8a9e822;color:#b8a9e8"><i class="fas fa-layer-group text-[13px]"></i></span>
        Plans
      </h2>
      <p class="text-[12px] mt-1" style="color:var(--text-mute)">Change anytime. No hidden fees.</p>
    </div>
    <div class="flex rounded-xl p-1" style="background:var(--panel);border:1px solid var(--border)">
      <button id="btnMonthly" class="px-4 py-2 rounded-lg text-[12px] font-bold transition-all" style="background:var(--lilac);color:#1a1a1a">Monthly</button>
      <button id="btnYearly" class="px-4 py-2 rounded-lg text-[12px] font-bold transition-all" style="color:var(--text-soft)">Yearly <span class="pill pill-green" style="font-size:9px;margin-left:4px">-17%</span></button>
    </div>
  </div>

  <!-- PLANS GRID -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="plansGrid"></div>

  <!-- USAGE -->
  <div id="usageSection" class="card p-6"></div>

</div>

<script>
var PLANS = [
  { id:'free',name:'Free',price:0,priceYr:0,quota:1000,color:'#71717a',icon:'fa-seedling',feats:['1K req/day','10 req/min','Community','1 API key'] },
  { id:'pro',name:'Pro',price:19,priceYr:189,quota:100000,color:'#4ecdc4',icon:'fa-rocket',feats:['100K req/day','100 req/min','Priority email','10 API keys','Custom CORS'] },
  { id:'business',name:'Business',price:79,priceYr:789,quota:1000000,color:'#b8a9e8',icon:'fa-briefcase',popular:true,feats:['1M req/day','500 req/min','24h support','Unlimited keys','White-label','SLA 99.9%'] },
  { id:'enterprise',name:'Enterprise',price:-1,priceYr:-1,quota:-1,color:'#f5a623',icon:'fa-building',feats:['Unlimited','Custom limits','Dedicated support','SSO / SAML','On-prem','Custom SLA'] }
];
var SETS = [];
var yearly = false;

async function load() {
  try { var r = await LH.api('/api/admin/settings?group=billing'); SETS = r.data; render(); }
  catch(e) { LH.toast('error','Load failed',e.message); }
}
function g(k) { return (SETS.find(function(s){return s.key===k})||{}).value || ''; }

function render() {
  var used = Number(g('plan_used_today')) || 0;
  var quota = Number(g('plan_quota_daily')) || 1;
  var pct = Math.min(100, Math.round(used/quota*100));
  var cur = g('current_plan').toLowerCase();
  var cp = PLANS.find(function(p){return p.id===cur}) || {color:'#b8a9e8',icon:'fa-credit-card'};

  // --- CURRENT PLAN CARD ---
  document.getElementById('planBox').innerHTML =
    '<div class="card p-6 lg:col-span-2 relative overflow-hidden">' +
      '<div style="position:absolute;top:-40px;right:-40px;width:140px;height:140px;border-radius:50%;opacity:.05;background:'+cp.color+'"></div>' +
      '<div class="flex items-center justify-between mb-5 relative z-10">' +
        '<div>' +
          '<p class="text-[10px] uppercase tracking-widest font-bold" style="color:var(--text-mute)">Current Plan</p>' +
          '<div class="flex items-center gap-3 mt-2">' +
            '<div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background:'+cp.color+'22;color:'+cp.color+'"><i class="fas '+cp.icon+' text-lg"></i></div>' +
            '<div>' +
              '<h3 class="text-xl font-black" style="color:var(--text)">'+g('current_plan')+'</h3>' +
              '<p class="text-[12px]" style="color:var(--text-soft)"><b>$'+g('plan_price_usd')+'</b>/month &middot; Next invoice <b style="color:var(--text)">'+g('next_invoice_date')+'</b></p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="text-right"><div class="text-3xl font-black" style="color:var(--text)">'+pct+'%</div><p class="text-[10px]" style="color:var(--text-mute)">used</p></div>' +
      '</div>' +
      '<div class="h-3 rounded-full overflow-hidden relative z-10" style="background:var(--border)">' +
        '<div class="h-full rounded-full transition-all duration-700" style="width:'+pct+'%;background:linear-gradient(90deg,'+cp.color+','+cp.color+'cc)"></div>' +
      '</div>' +
      '<p class="text-[11px] mt-2 relative z-10" style="color:var(--text-mute)"><b style="color:var(--text)">'+LH.fmt(used)+'</b> of <b style="color:var(--text)">'+LH.fmt(quota)+'</b> requests today</p>' +
    '</div>' +
    '<div class="card p-6">' +
      '<p class="text-[10px] uppercase tracking-widest font-bold mb-3" style="color:var(--text-mute)">Payment</p>' +
      '<div class="flex items-center gap-3 mb-4">' +
        '<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:rgba(74,222,128,.1);color:#4ade80"><i class="fas fa-credit-card"></i></div>' +
        '<div><p class="text-sm font-bold" style="color:var(--text)">'+g('payment_method')+'</p><p class="text-[11px]" style="color:var(--text-mute)">Auto-renew on '+g('next_invoice_date')+'</p></div>' +
      '</div>' +
      '<div class="flex gap-2">' +
        '<button class="btn btn-ghost btn-sm flex-1" onclick="LH.toast(\'info\',\'Coming soon\',\'Stripe integration for payment updates.\')"><i class="fas fa-pen text-[10px]"></i> Update</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="LH.toast(\'info\',\'Coming soon\',\'Invoice history will be available soon.\')"><i class="fas fa-file-invoice text-[10px]"></i> Invoices</button>' +
      '</div>' +
    '</div>';

  // --- PLANS ---
  document.getElementById('plansGrid').innerHTML = PLANS.map(function(p) {
    var isCur = cur===p.id;
    var price = yearly ? p.priceYr : p.price;
    var dispPrice = price===-1 ? 'Custom' : '$'+price;
    var period = price===-1 ? '' : (yearly ? '/yr' : '/mo');
    return '<div class="card p-5 relative transition-all duration-200 hover:scale-[1.02] group'+(p.popular?' ring-2':'')+'" style="'+(p.popular?'border-color:#b8a9e8;box-shadow:0 0 30px rgba(184,169,232,.08)':'')+'">' +
      (p.popular?'<span class="pill pill-lilac text-[10px] font-bold" style="position:absolute;top:-11px;left:50%;transform:translateX(-50%);z-index:2">⭐ POPULAR</span>':'') +
      '<div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style="background:'+p.color+'22;color:'+p.color+'"><i class="fas '+p.icon+'"></i></div>' +
      '<p class="text-sm font-bold" style="color:var(--text)">'+p.name+'</p>' +
      '<div class="flex items-baseline gap-1 mt-1.5"><span class="text-2xl font-black" style="color:var(--text)">'+dispPrice+'</span><span class="text-[11px]" style="color:var(--text-mute)">'+period+'</span></div>' +
      '<p class="text-[11px] mt-1 font-semibold" style="color:'+p.color+'">'+(p.quota===-1?'Unlimited':LH.fmt(p.quota)+' req/day')+'</p>' +
      '<div class="my-4 space-y-2">' + p.feats.map(function(f){ return '<div class="flex items-center gap-2 text-[11px]" style="color:var(--text-soft)"><i class="fas fa-check text-[9px]" style="color:'+p.color+'"></i>'+f+'</div>'; }).join('') + '</div>' +
      '<button class="btn w-full text-sm font-bold '+(isCur?'btn-ghost cursor-default':'')+'" '+(isCur?'disabled':'onclick="switchPlan(\''+p.id+'\','+p.price+','+p.quota+')"')+' style="'+(isCur?'':('background:'+p.color+'18;color:'+p.color+';border:1px solid '+p.color+'33'))+'">'+(isCur?'<i class="fas fa-check-circle mr-1"></i>Current plan':'<i class="fas fa-arrow-right mr-1"></i>Switch to '+p.name)+'</button>' +
    '</div>';
  }).join('');

  // --- USAGE ---
  document.getElementById('usageSection').innerHTML =
    '<h3 class="text-sm font-bold mb-4 flex items-center gap-2" style="color:var(--text)"><span class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:#4ade8022;color:#4ade80"><i class="fas fa-chart-line text-[11px]"></i></span>Usage Overview</h3>' +
    '<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">' +
      statBox('Today', LH.fmt(used), 'of '+LH.fmt(quota), '#b8a9e8') +
      statBox('Rate Limit', Math.round(quota/1440), 'req/min', '#4ecdc4') +
      statBox('Success Rate', '99.7%', 'last 30d', '#4ade80') +
      statBox('Latency', '18ms', 'p95: 42ms', '#f5a623') +
    '</div>';
}

function statBox(label, value, sub, color) {
  return '<div class="p-4 rounded-xl" style="background:var(--panel);border:1px solid var(--border)"><p class="text-[10px] uppercase tracking-wide font-bold" style="color:var(--text-mute)">'+label+'</p><p class="text-xl font-black mt-1" style="color:'+color+'">'+value+'</p><p class="text-[10px] mt-0.5" style="color:var(--text-mute)">'+sub+'</p></div>';
}

async function switchPlan(id, price, quota) {
  var p = PLANS.find(function(x){return x.id===id}); if (!p) return;
  try {
    await LH.api('/api/admin/settings/current_plan', { method:'PATCH', body: JSON.stringify({ value: p.name }) });
    await LH.api('/api/admin/settings/plan_price_usd', { method:'PATCH', body: JSON.stringify({ value: String(price===-1?0:price) }) });
    await LH.api('/api/admin/settings/plan_quota_daily', { method:'PATCH', body: JSON.stringify({ value: String(quota===-1?10000000:quota) }) });
    LH.toast('success','Plan upgraded! 🎉','You are now on <strong>'+p.name+'</strong>.');
    load();
  } catch(e) { LH.toast('error','Switch failed',e.message); }
}

// Toggle
document.getElementById('btnMonthly').onclick = function(){ yearly=false; this.style.background='var(--lilac)'; this.style.color='#1a1a1a'; document.getElementById('btnYearly').style.background='transparent'; document.getElementById('btnYearly').style.color='var(--text-soft)'; render(); };
document.getElementById('btnYearly').onclick = function(){ yearly=true; this.style.background='var(--lilac)'; this.style.color='#1a1a1a'; document.getElementById('btnMonthly').style.background='transparent'; document.getElementById('btnMonthly').style.color='var(--text-soft)'; render(); };

LH.guardRole(['admin']).then(function(u) { if (u) load(); });
</script>
`)}
`;
// ============================================================
// /dashboard/analytics · /dashboard/creator/analytics · /dashboard/consumer/analytics
// ============================================================
export const analyticsPage = (ctx: PageCtx = ADMIN_CTX) => `${HEAD('Analytics — LogoHub', COMMON_JS)}
${shellWrap(ctxSidebar(ctx, ctx.role === 'consumer' ? 'usage' : 'analytics'), `
${topbar(ctx.role === 'admin' ? 'Analytics' : 'Usage', ctx.role === 'admin' ? 'Performance and usage insights' : 'Your requests, errors, and endpoint usage', ctx)}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-1400 mx-auto space-y-6 animate-fade-up">
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
LH.guardRole(['${ctx.role}']);
</script>
`)}
`;

// ============================================================
// /dashboard/activity  (admin only)
// ============================================================
export const activityPage = () => `${HEAD('Activity — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('activity'), `
${topbar('Activity', 'Complete audit log of every change')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-1400 mx-auto animate-fade-up">
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
LH.guardRole(['admin']).then(function(u) { if (u) load(); });

</script>
`)}
`;
