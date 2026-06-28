import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap, creatorSidebar, consumerSidebar } from './layout';

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
load();

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
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">
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
  try { const r = await LH.api('/api/admin/users'); USERS = r.data; renderUsers(); }
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
    try { await LH.api('/api/admin/users/'+id, { method:'PATCH', body: JSON.stringify(body) }); LH.toast('success','User updated'); m.remove(); load(); }
    catch(e) { LH.toast('error','Save failed',e.message); }
  };
}
load();

</script>
`)}`;

// ============================================================
// /dashboard/creator  — Creator Dashboard
// ============================================================
export const creatorDashboardPage = () => `${HEAD('Creator Dashboard — LogoHub', COMMON_JS)}
${shellWrap(creatorSidebar('overview'), `
${topbar('Creator Dashboard', '')}
  <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
    <div style="position:relative;cursor:pointer" onclick="document.getElementById('profilePhotoInput').click()">
      <div id="creatorAvatar" style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#b8a9e8,#f5a623);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:#1a1a1a;overflow:hidden">
        <span id="creatorInitials">DC</span>
      </div>
      <div style="position:absolute;bottom:0;right:0;width:22px;height:22px;border-radius:50%;background:var(--lilac);display:flex;align-items:center;justify-content:center;font-size:10px;color:#1a1a1a"><i class="fas fa-camera"></i></div>
    </div>
    <div>
      <h2 class="text-lg font-bold" style="color:var(--text)">Your Creator Dashboard</h2>
      <p class="text-sm" style="color:var(--text-soft)">Earnings, content & analytics</p>
    </div>
    <input type="file" id="profilePhotoInput" accept="image/*" class="hidden" onchange="handleProfilePhoto(this)">
  </div>
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">
  
  <!-- Stats Cards -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="card p-5 card-hover">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#f5a62322;color:#f5a623"><i class="fas fa-dollar-sign text-[12px]"></i></div>
      <div class="text-2xl font-bold" style="color:var(--text)">$1,247.50</div>
      <p class="text-[11px]" style="color:var(--text-mute)">Total earnings</p>
      <p class="text-[10px] mt-1" style="color:#4ade80"><i class="fas fa-arrow-up text-[8px]"></i> +18.3% this month</p>
    </div>
    <div class="card p-5 card-hover">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#b8a9e822;color:#b8a9e8"><i class="fas fa-image text-[12px]"></i></div>
      <div class="text-2xl font-bold" style="color:var(--text)">34</div>
      <p class="text-[11px]" style="color:var(--text-mute)">Published assets</p>
      <p class="text-[10px] mt-1" style="color:var(--text-soft)">5 pending review</p>
    </div>
    <div class="card p-5 card-hover">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#4ecdc422;color:#4ecdc4"><i class="fas fa-download text-[12px]"></i></div>
      <div class="text-2xl font-bold" style="color:var(--text)">89.4K</div>
      <p class="text-[11px]" style="color:var(--text-mute)">Downloads (30d)</p>
      <p class="text-[10px] mt-1" style="color:#4ade80"><i class="fas fa-arrow-up text-[8px]"></i> +24.1%</p>
    </div>
    <div class="card p-5 card-hover">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#4ade8022;color:#4ade80"><i class="fas fa-star text-[12px]"></i></div>
      <div class="text-2xl font-bold" style="color:var(--text)">4.8</div>
      <p class="text-[11px]" style="color:var(--text-mute)">Avg rating</p>
      <p class="text-[10px] mt-1" style="color:var(--text-soft)">From 312 reviews</p>
    </div>
  </div>

  <!-- My Content -->
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold flex items-center gap-2" style="color:var(--text)">
        <span class="w-6 h-6 rounded-md flex items-center justify-center" style="background:#b8a9e822;color:#b8a9e8"><i class="fas fa-folder-open text-[11px]"></i></span>My Content
      </h3>
      <button class="btn btn-primary btn-sm" onclick="window.location.href='/dashboard/content'"><i class="fas fa-plus"></i> Upload new</button>
    </div>
    <div class="space-y-3">
      ${[
        { name:'Modern Dashboard UI Kit', downloads:12483, earnings:412.00, status:'published', color:'#4ade80' },
        { name:'Minimalist Logo Pack', downloads:8921, earnings:315.50, status:'published', color:'#4ade80' },
        { name:'SaaS Landing Page Icons', downloads:6742, earnings:220.00, status:'review', color:'#f5a623' },
        { name:'Premium Sport Icons v2', downloads:5341, earnings:185.00, status:'published', color:'#4ade80' },
        { name:'Dark Mode UI Assets', downloads:4231, earnings:115.00, status:'draft', color:'#71717a' },
      ].map(item => `
        <div class="flex items-center gap-3 p-3 rounded-xl" style="background:var(--panel-2)">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs" style="background:linear-gradient(135deg,#b8a9e8,#f5a623);color:#1a1a1a">${item.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold truncate" style="color:var(--text)">${item.name}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[10px]" style="color:var(--text-mute)">${LH.fmt(item.downloads)} downloads</span>
              <span class="text-[10px]" style="color:#f5a623">$${item.earnings.toFixed(2)} earned</span>
            </div>
          </div>
          <span class="pill" style="background:${item.color}22;color:${item.color};border-color:${item.color}55">${item.status}</span>
        </div>`).join('')}
    </div>
  </div>

  <!-- Earnings Chart -->
  <div class="card p-6">
    <h3 class="text-sm font-semibold mb-4 flex items-center gap-2" style="color:var(--text)">
      <span class="w-6 h-6 rounded-md flex items-center justify-center" style="background:#f5a62322;color:#f5a623"><i class="fas fa-chart-line text-[11px]"></i></span>Earnings · Last 6 months
    </h3>
    <canvas id="earningsChart" height="100"></canvas>
  </div>

</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
new Chart(document.getElementById('earningsChart'),{
  type:'bar',
  data:{
    labels:['Jan','Feb','Mar','Apr','May','Jun'],
    datasets:[{
      label:'Earnings (USD)',
      data:[180,245,310,198,412,247],
      backgroundColor:'rgba(245,166,35,.3)',
      borderColor:'#f5a623',
      borderWidth:2,
      borderRadius:8
    }]
  },
  options:{
    responsive:true,
    plugins:{legend:{labels:{color:'#a1a1aa',font:{size:11}}}},
    scales:{
      x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#71717a',font:{size:11}}},
      y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#71717a',font:{size:11},callback:v=>'$'+v}}
    }
  }
});
</script>
<script>
function handleProfilePhoto(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
    const avatar = document.getElementById('creatorAvatar');
    const initials = document.getElementById('creatorInitials');
    if (initials) initials.style.display = 'none';
    avatar.appendChild(img);
    // Save to backend
    LH.api('/api/v1/auth/me', { method:'PATCH', body: JSON.stringify({ avatar_url: e.target.result }) })
      .then(() => LH.toast('success', 'Profile photo updated'))
      .catch(e => LH.toast('error', 'Failed to save photo', e.message));
  };
  reader.readAsDataURL(file);
}
</script>
`)}`;

// ============================================================
// /dashboard/consumer  — Consumer Dashboard
// ============================================================
export const consumerDashboardPage = () => `${HEAD('Consumer Dashboard — LogoHub', COMMON_JS)}
${shellWrap(consumerSidebar('overview'), `
${topbar('Consumer Dashboard', '')}
  <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
    <div style="position:relative;cursor:pointer" onclick="document.getElementById('profilePhotoInputCons').click()">
      <div id="consumerAvatar" style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#4ecdc4,#b8a9e8);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:#1a1a1a;overflow:hidden">
        <span id="consumerInitials">JD</span>
      </div>
      <div style="position:absolute;bottom:0;right:0;width:22px;height:22px;border-radius:50%;background:var(--lilac);display:flex;align-items:center;justify-content:center;font-size:10px;color:#1a1a1a"><i class="fas fa-camera"></i></div>
    </div>
    <div>
      <h2 class="text-lg font-bold" style="color:var(--text)">Your Consumer Dashboard</h2>
      <p class="text-sm" style="color:var(--text-soft)">Usage, API keys & plan</p>
    </div>
    <input type="file" id="profilePhotoInputCons" accept="image/*" class="hidden" onchange="handleProfilePhotoCons(this)">
  </div>
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">

  <!-- Plan Status -->
  <div class="card p-5" style="border-color:#b8a9e8;background:linear-gradient(135deg,rgba(184,169,232,.08),transparent)">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="pill pill-lilac">Free Plan</span>
          <span class="text-[11px]" style="color:var(--text-soft)">1,000 requests/day</span>
        </div>
        <p class="text-sm" style="color:var(--text-mute)">You've used <strong style="color:var(--text)">247</strong> of 1,000 requests today</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="window.location.href='/#pricing'"><i class="fas fa-arrow-up"></i> Upgrade plan</button>
    </div>
    <div class="h-2 rounded-full overflow-hidden mt-3" style="background:var(--border)">
      <div class="h-full rounded-full transition-all duration-500" style="width:24.7%;background:#b8a9e8"></div>
    </div>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="card p-5 card-hover">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#b8a9e822;color:#b8a9e8"><i class="fas fa-bolt text-[12px]"></i></div>
      <div class="text-2xl font-bold" style="color:var(--text)">247</div>
      <p class="text-[11px]" style="color:var(--text-mute)">Requests today</p>
    </div>
    <div class="card p-5 card-hover">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#4ecdc422;color:#4ecdc4"><i class="fas fa-key text-[12px]"></i></div>
      <div class="text-2xl font-bold" style="color:var(--text)">1</div>
      <p class="text-[11px]" style="color:var(--text-mute)">Active API keys</p>
    </div>
    <div class="card p-5 card-hover">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#f5a62322;color:#f5a623"><i class="fas fa-download text-[12px]"></i></div>
      <div class="text-2xl font-bold" style="color:var(--text)">8.2K</div>
      <p class="text-[11px]" style="color:var(--text-mute)">Downloads (30d)</p>
    </div>
    <div class="card p-5 card-hover">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style="background:#4ade8022;color:#4ade80"><i class="fas fa-check-circle text-[12px]"></i></div>
      <div class="text-2xl font-bold" style="color:var(--text)">99.8%</div>
      <p class="text-[11px]" style="color:var(--text-mute)">Success rate</p>
    </div>
  </div>

  <!-- My API Keys -->
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold flex items-center gap-2" style="color:var(--text)">
        <span class="w-6 h-6 rounded-md flex items-center justify-center" style="background:#f5a62322;color:#f5a623"><i class="fas fa-key text-[11px]"></i></span>My API Keys
      </h3>
      <button class="btn btn-primary btn-sm" onclick="LH.toast('info','Upgrade to Pro','Create unlimited keys with the Pro plan')"><i class="fas fa-plus"></i> New Key</button>
    </div>
    <div class="space-y-3">
      <div class="flex items-center gap-3 p-3 rounded-xl" style="background:var(--panel-2)">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style="background:#4ecdc422;color:#4ecdc4"><i class="fas fa-key text-[12px]"></i></div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold" style="color:var(--text)">Default Key</p>
          <code class="text-[11px] font-mono truncate block" style="color:var(--text-soft)">lh_test_sk_xxxx...</code>
        </div>
        <span class="pill pill-green">Active</span>
        <span class="text-[11px] hidden sm:inline" style="color:var(--text-mute)">247 reqs</span>
        <div class="flex items-center gap-1">
          <button class="btn btn-ghost btn-icon-sm" title="Copy" onclick="LH.copy('lh_test_sk_example_key')"><i class="fas fa-copy"></i></button>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent Downloads -->
  <div class="card p-6">
    <h3 class="text-sm font-semibold mb-4 flex items-center gap-2" style="color:var(--text)">
      <span class="w-6 h-6 rounded-md flex items-center justify-center" style="background:#4ecdc422;color:#4ecdc4"><i class="fas fa-history text-[11px]"></i></span>Recent downloads
    </h3>
    <div class="space-y-2">
      ${[
        { asset:'google-logo', type:'SVG', time:'2 min ago' },
        { asset:'spotify-icon', type:'PNG', size:'128x128', time:'15 min ago' },
        { asset:'apple-logo', type:'WebP', size:'256x256', time:'1 hour ago' },
        { asset:'react-framework', type:'SVG', time:'2 hours ago' },
        { asset:'portugal-flag', type:'PNG', time:'3 hours ago' },
      ].map(d => `
        <div class="flex items-center gap-3 py-2">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:var(--panel-2)"><i class="fas fa-arrow-down text-[10px]" style="color:var(--text-soft)"></i></div>
          <code class="text-xs font-mono flex-1" style="color:var(--text)">${d.asset}</code>
          <span class="text-[10px]" style="color:var(--text-mute)">${d.type}${d.size?' · '+d.size:''}</span>
          <span class="text-[10px]" style="color:var(--text-mute)">${d.time}</span>
        </div>`).join('')}
    </div>
  </div>

</div>
`)}`;
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
