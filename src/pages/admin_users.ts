import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap } from './layout';

// ============================================================
// /dashboard/admin/users  — Admin User Management
// ============================================================
export const adminUsersPage = () => `${HEAD('User Management — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('users'), `
${topbar('User Management', 'Manage all users: ban, block, reset passwords')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">

  <!-- Toolbar -->
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative flex-1 min-w-[200px]">
      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[12px]" style="color:var(--text-mute)"></i>
      <input id="uSearch" placeholder="Search users..." class="input input-pill" style="padding-left:2.5rem" oninput="renderList()">
    </div>
    <select id="roleFilter" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderList()">
      <option value="">All roles</option><option value="admin">Admin</option><option value="creator">Creator</option><option value="consumer">Consumer</option>
    </select>
    <select id="statusFilter" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderList()">
      <option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option><option value="banned">Banned</option>
    </select>
    <select id="planFilter" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderList()">
      <option value="">All plans</option><option value="free">Free</option><option value="pro">Pro</option><option value="business">Business</option><option value="enterprise">Enterprise</option>
    </select>
    <span id="userCount" class="text-[11px] font-medium" style="color:var(--text-mute)">—</span>
  </div>

  <!-- Stats row -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="statsRow"></div>

  <!-- Users table -->
  <div class="card overflow-hidden">
    <div class="overflow-x-auto">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border);text-align:left">
            <th class="px-5 py-3 text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">User</th>
            <th class="px-5 py-3 text-[10px] uppercase tracking-wide font-semibold hidden md:table-cell" style="color:var(--text-mute)">Role</th>
            <th class="px-5 py-3 text-[10px] uppercase tracking-wide font-semibold hidden lg:table-cell" style="color:var(--text-mute)">Plan</th>
            <th class="px-5 py-3 text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Status</th>
            <th class="px-5 py-3 text-[10px] uppercase tracking-wide font-semibold hidden lg:table-cell" style="color:var(--text-mute)">Requests</th>
            <th class="px-5 py-3 text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Actions</th>
          </tr>
        </thead>
        <tbody id="usersTable"></tbody>
      </table>
    </div>
  </div>

</div>

<script>
var ALL_USERS = [];
var roleColors = { admin:'#b8a9e8', creator:'#f5a623', consumer:'#4ecdc4' };
var statusCls = { active:'pill-green', inactive:'pill-amber', suspended:'pill-coral', banned:'pill-red' };
var planCls = { free:'pill-neutral', pro:'pill-teal', business:'pill-lilac', enterprise:'pill-amber' };

async function loadUsers() {
  try {
    var r = await LH.api('/api/v1/admin/users');
    ALL_USERS = r.data || [];
    renderList();
  } catch (e) { LH.toast('error', 'Failed to load users', e.message); }
}

function getStats(users) {
  return {
    total: users.length,
    active: users.filter(function(u){return u.status==='active'}).length,
    creators: users.filter(function(u){return u.role==='creator'}).length,
    banned: users.filter(function(u){return u.status==='banned'||u.status==='suspended'}).length,
  };
}

function renderList() {
  var searchEl = document.getElementById('uSearch');
  var roleEl = document.getElementById('roleFilter');
  var statusEl = document.getElementById('statusFilter');
  var planEl = document.getElementById('planFilter');
  var search = (searchEl ? searchEl.value : '').toLowerCase();
  var role = roleEl ? roleEl.value : '';
  var status = statusEl ? statusEl.value : '';
  var plan = planEl ? planEl.value : '';

  var list = ALL_USERS.slice();
  if (role) list = list.filter(function(u){return u.role===role;});
  if (status) list = list.filter(function(u){return u.status===status;});
  if (plan) list = list.filter(function(u){return u.plan===plan;});
  if (search) list = list.filter(function(u){return (u.name+' '+u.email).toLowerCase().indexOf(search)>=0;});

  var stats = getStats(ALL_USERS);
  var uc = document.getElementById('userCount');
  if (uc) uc.textContent = list.length + ' of ' + ALL_USERS.length + ' users';

  // Stats row
  var statsRow = document.getElementById('statsRow');
  if (statsRow) {
    var sItems = [
      { label: 'Total', value: stats.total, color: '#b8a9e8', icon: 'fa-users' },
      { label: 'Active', value: stats.active, color: '#4ade80', icon: 'fa-check-circle' },
      { label: 'Creators', value: stats.creators, color: '#f5a623', icon: 'fa-paint-brush' },
      { label: 'Banned/Suspended', value: stats.banned, color: '#ff6b6b', icon: 'fa-ban' },
    ];
    var statsHtml = '';
    sItems.forEach(function(s) {
      statsHtml += '<div class="card p-4"><div class="flex items-center gap-3">' +
        '<div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:'+s.color+'22;color:'+s.color+'"><i class="fas '+s.icon+' text-[12px]"></i></div>' +
        '<div><div class="text-lg font-bold" style="color:var(--text)">'+s.value+'</div><p class="text-[10px]" style="color:var(--text-mute)">'+s.label+'</p></div>' +
      '</div></div>';
    });
    statsRow.innerHTML = statsHtml;
  }

  // Table
  var table = document.getElementById('usersTable');
  if (!table) return;

  if (!list.length) {
    table.innerHTML = '<tr><td colspan="6" class="px-5 py-12 text-center"><div class="empty-state"><i class="fas fa-users text-3xl mb-3 opacity-30 block"></i><p class="text-sm" style="color:var(--text-mute)">No users match your filters</p></div></td></tr>';
    return;
  }

  var html = '';
  list.forEach(function(u) {
    var initials = (u.name || '?').split(' ').map(function(p){return p[0];}).slice(0,2).join('').toUpperCase();
    var color = roleColors[u.role] || '#b8a9e8';
    var isBanned = u.status === 'banned';
    var cls = statusCls[u.status] || 'pill-neutral';
    var pCls = planCls[u.plan] || 'pill-neutral';
    var avatarHtml = u.avatar_url ? '<img src=\"'+u.avatar_url+'\" style=\"width:100%;height:100%;object-fit:cover\">' : initials;

    var actionsHtml = '<button class="btn btn-ghost btn-icon-sm" onclick="openEditUser(\\''+u.id+'\\')" title="Edit"><i class="fas fa-pen text-[10px]"></i></button>' +
      '<button class="btn btn-ghost btn-icon-sm" onclick="resetUserPassword(\\''+u.id+'\\')" title="Reset password" style="color:#f5a623"><i class="fas fa-key text-[10px]"></i></button>';
    
    if (u.status !== 'banned') {
      actionsHtml += '<button class="btn btn-ghost btn-icon-sm" onclick="banUser(\\''+u.id+'\\')" title="Ban user" style="color:#ff6b6b"><i class="fas fa-ban text-[10px]"></i></button>';
    } else {
      actionsHtml += '<button class="btn btn-ghost btn-icon-sm" onclick="unbanUser(\\''+u.id+'\\')" title="Unban user" style="color:#4ade80"><i class="fas fa-check-circle text-[10px]"></i></button>';
    }
    actionsHtml += '<button class="btn btn-danger btn-icon-sm" onclick="deleteUser(\\''+u.id+'\\')" title="Delete"><i class="fas fa-trash text-[10px]"></i></button>';

    html += '<tr class="hover-row" style="border-bottom:1px solid var(--border);opacity:'+(isBanned?'.5':'1')+'">' +
      '<td class="px-5 py-3"><div class="flex items-center gap-3">' +
        '<div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style="background:linear-gradient(135deg,'+color+','+color+'88);color:#1a1a1a;overflow:hidden">'+avatarHtml+'</div>' +
        '<div><p class="text-sm font-semibold truncate" style="color:var(--text)">'+esc(u.name)+'</p><p class="text-[11px] truncate" style="color:var(--text-mute)">'+esc(u.email)+'</p></div>' +
      '</div></td>' +
      '<td class="px-5 py-3 hidden md:table-cell"><span class="pill" style="background:'+color+'22;color:'+color+';border-color:'+color+'55">'+u.role+'</span></td>' +
      '<td class="px-5 py-3 hidden lg:table-cell"><span class="pill '+pCls+'">'+u.plan+'</span></td>' +
      '<td class="px-5 py-3"><span class="pill '+cls+'">'+u.status+'</span></td>' +
      '<td class="px-5 py-3 hidden lg:table-cell"><span class="text-[11px]" style="color:var(--text-mute)">'+LH.fmt(u.requests_today||0)+'/day · '+LH.fmt(u.requests_30d||0)+'/mo</span></td>' +
      '<td class="px-5 py-3"><div class="flex items-center gap-1">'+actionsHtml+'</div></td>' +
    '</tr>';
  });
  table.innerHTML = html;
}

function esc(s) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function openEditUser(id) {
  var u = ALL_USERS.find(function(x){return x.id===id;});
  if (!u) return;
  var initials = (u.name||'?').split(' ').map(function(p){return p[0];}).slice(0,2).join('').toUpperCase();
  var avatarHtml = u.avatar_url ? '<img src=\"'+u.avatar_url+'\" style=\"width:100%;height:100%;object-fit:cover\">' : initials;

  var roleOpts = ['admin','creator','consumer'].map(function(r){return '<option value=\"'+r+'\" '+(u.role===r?'selected':'')+'>'+r+'</option>';}).join('');
  var planOpts = ['free','pro','business','enterprise'].map(function(r){return '<option value=\"'+r+'\" '+(u.plan===r?'selected':'')+'>'+r+'</option>';}).join('');
  var statusOpts = ['active','inactive','suspended','banned'].map(function(r){return '<option value=\"'+r+'\" '+(u.status===r?'selected':'')+'>'+r+'</option>';}).join('');

  var modalHtml = '<div class="modal-box" style="max-width:550px">' +
    '<div class="modal-head"><div style="display:flex;align-items:center;gap:.75rem">' +
      '<div style="width:38px;height:38px;border-radius:12px;background:#ff6b6b22;color:#ff6b6b;display:flex;align-items:center;justify-content:center"><i class="fas fa-user-edit"></i></div>' +
      '<div><h2 class="text-base font-bold" style="color:var(--text)">Edit User</h2><p class="text-[11px]" style="color:var(--text-mute)">'+esc(u.name)+' · '+esc(u.email)+'</p></div>' +
    '</div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>' +
    '<form id="editUserForm" class="modal-body space-y-4">' +
      '<div class="flex items-center gap-4 p-3 rounded-xl" style="background:var(--panel-2)">' +
        '<div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm" style="background:linear-gradient(135deg,#b8a9e8,#f5a623);color:#1a1a1a;overflow:hidden">'+avatarHtml+'</div>' +
        '<div><p class="text-sm font-semibold" style="color:var(--text)">'+esc(u.name)+'</p><p class="text-[10px]" style="color:var(--text-mute)">'+esc(u.email)+' · ID: '+(u.id||'').slice(0,8)+'...</p></div>' +
      '</div>' +
      '<div><label class="field-label">Name</label><input class="input" name="name" value="'+esc(u.name||'')+'"></div>' +
      '<div class="grid grid-cols-2 gap-4">' +
        '<div><label class="field-label">Role</label><select class="select" name="role">'+roleOpts+'</select></div>' +
        '<div><label class="field-label">Plan</label><select class="select" name="plan">'+planOpts+'</select></div>' +
      '</div>' +
      '<div><label class="field-label">Status</label><select class="select" name="status">'+statusOpts+'</select></div>' +
      '<div class="grid grid-cols-2 gap-4">' +
        '<div><label class="field-label">Bio</label><input class="input" name="bio" value="'+esc(u.bio||'')+'" placeholder="Optional"></div>' +
        '<div><label class="field-label">Company</label><input class="input" name="company" value="'+esc(u.company||'')+'" placeholder="Optional"></div>' +
      '</div>' +
      '<div class="p-3 rounded-xl" style="background:rgba(255,166,35,.06);border:1px solid rgba(245,166,35,.15)">' +
        '<p class="text-[11px] font-semibold mb-2" style="color:#f5a623"><i class="fas fa-key mr-1"></i> Reset Password</p>' +
        '<div style="display:flex;gap:.5rem"><input class="input input-sm" id="newUserPass" type="text" placeholder="New password or leave empty" style="font-size:.8rem">' +
        '<button type="button" class="btn btn-ghost btn-sm inline-flex items-center gap-1" onclick="resetPasswordNow(\\''+u.id+'\\')" style="white-space:nowrap;font-size:.75rem;color:#f5a623"><i class="fas fa-sync-alt"></i> Reset</button></div>' +
      '</div>' +
    '</form>' +
    '<div class="modal-foot"><button class="btn btn-ghost" data-close>Cancel</button><button id="saveUserBtn" class="btn btn-primary"><i class="fas fa-save"></i> Save changes</button></div>' +
    '</div>';

  var modal = LH.openModal(modalHtml);
  var saveBtn = modal.querySelector('#saveUserBtn');
  if (saveBtn) saveBtn.onclick = async function() {
    try {
      var form = modal.querySelector('#editUserForm');
      var fd = new FormData(form);
      var body = Object.fromEntries(fd);
      await LH.api('/api/v1/admin/users/' + id, { method: 'PATCH', body: JSON.stringify(body) });
      LH.toast('success', 'User updated');
      modal.remove();
      loadUsers();
    } catch (e) { LH.toast('error', 'Failed', e.message); }
  };
}

async function resetUserPassword(id) {
  var newPass = prompt('Enter new password (min. 8 characters):');
  if (!newPass) return;
  if (newPass.length < 8) { LH.toast('error', 'Password must be at least 8 characters'); return; }
  try {
    await LH.api('/api/v1/admin/users/' + id, { method: 'PATCH', body: JSON.stringify({ password_hash: newPass }) });
    LH.toast('success', 'Password reset', 'New password: ' + newPass);
  } catch (e) { LH.toast('error', 'Failed', e.message); }
}

async function resetPasswordNow(id) {
  var input = document.getElementById('newUserPass');
  var newPass = input ? input.value : '';
  if (!newPass || newPass.length < 8) { LH.toast('error', 'Enter a valid password (min. 8 chars)'); return; }
  try {
    await LH.api('/api/v1/admin/users/' + id, { method: 'PATCH', body: JSON.stringify({ password_hash: newPass }) });
    LH.toast('success', 'Password reset for this user', 'New: ' + newPass);
    input.value = '';
  } catch (e) { LH.toast('error', 'Failed', e.message); }
}

async function banUser(id) {
  var yes = await LH.confirm({ title: 'Ban this user?', msg: 'They will not be able to log in.', danger: true });
  if (!yes) return;
  try {
    await LH.api('/api/v1/admin/users/' + id, { method: 'PATCH', body: JSON.stringify({ status: 'banned' }) });
    LH.toast('success', 'User banned');
    loadUsers();
  } catch (e) { LH.toast('error', 'Failed', e.message); }
}

async function unbanUser(id) {
  try {
    await LH.api('/api/v1/admin/users/' + id, { method: 'PATCH', body: JSON.stringify({ status: 'active' }) });
    LH.toast('success', 'User unbanned');
    loadUsers();
  } catch (e) { LH.toast('error', 'Failed', e.message); }
}

async function deleteUser(id) {
  var yes = await LH.confirm({ title: 'Delete this user?', msg: 'All their data will be permanently removed.', danger: true });
  if (!yes) return;
  try {
    await LH.api('/api/v1/admin/users/' + id, { method: 'DELETE' });
    LH.toast('success', 'User deleted');
    loadUsers();
  } catch (e) { LH.toast('error', 'Failed', e.message); }
}

loadUsers();
</script>
`)}
`;
