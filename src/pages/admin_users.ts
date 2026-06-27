import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap } from './layout';

// ============================================================
// /dashboard/admin/users  — Admin User Management
// ============================================================
export const adminUsersPage = () => `${HEAD('User Management — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('users'), `
${topbar('User Management', 'Manage all users: ban, block, reset passwords')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">

  <!-- Stats Row — 4 gradient cards -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4" id="statsRow">
    <div class="card p-5 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10" style="background:#b8a9e8"></div>
      <div class="flex items-center gap-3 relative z-10">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,#b8a9e822,#b8a9e844);color:#b8a9e8"><i class="fas fa-users text-[14px]"></i></div>
        <div><div class="text-xl font-bold" style="color:var(--text)" id="statTotal">—</div><p class="text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Total Users</p></div>
      </div>
    </div>
    <div class="card p-5 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10" style="background:#4ade80"></div>
      <div class="flex items-center gap-3 relative z-10">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,#4ade8022,#4ade8044);color:#4ade80"><i class="fas fa-check-circle text-[14px]"></i></div>
        <div><div class="text-xl font-bold" style="color:var(--text)" id="statActive">—</div><p class="text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Active</p></div>
      </div>
    </div>
    <div class="card p-5 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10" style="background:#f5a623"></div>
      <div class="flex items-center gap-3 relative z-10">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,#f5a62322,#f5a62344);color:#f5a623"><i class="fas fa-paint-brush text-[14px]"></i></div>
        <div><div class="text-xl font-bold" style="color:var(--text)" id="statCreators">—</div><p class="text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Creators</p></div>
      </div>
    </div>
    <div class="card p-5 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10" style="background:#ff6b6b"></div>
      <div class="flex items-center gap-3 relative z-10">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,#ff6b6b22,#ff6b6b44);color:#ff6b6b"><i class="fas fa-ban text-[14px]"></i></div>
        <div><div class="text-xl font-bold" style="color:var(--text)" id="statBanned">—</div><p class="text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Banned</p></div>
      </div>
    </div>
  </div>

  <!-- Toolbar — elegant pill-style filters -->
  <div class="card p-4">
    <div class="flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[220px]">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[13px]" style="color:var(--text-mute)"></i>
        <input id="uSearch" placeholder="Search by name or email..." class="input input-pill" style="padding-left:2.75rem;background:var(--panel);border-color:var(--border)" oninput="renderList()">
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <div class="relative">
          <select id="roleFilter" class="input input-pill" style="padding-right:2rem;background:var(--panel);border-color:var(--border);cursor:pointer;width:auto" onchange="renderList()">
            <option value="">🔰 All roles</option><option value="admin">👑 Admin</option><option value="creator">🎨 Creator</option><option value="consumer">🔑 Consumer</option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none" style="color:var(--text-mute)"></i>
        </div>
        <div class="relative">
          <select id="statusFilter" class="input input-pill" style="padding-right:2rem;background:var(--panel);border-color:var(--border);cursor:pointer;width:auto" onchange="renderList()">
            <option value="">📋 All statuses</option><option value="active">✅ Active</option><option value="inactive">⏸️ Inactive</option><option value="suspended">⚠️ Suspended</option><option value="banned">🚫 Banned</option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none" style="color:var(--text-mute)"></i>
        </div>
        <div class="relative">
          <select id="planFilter" class="input input-pill" style="padding-right:2rem;background:var(--panel);border-color:var(--border);cursor:pointer;width:auto" onchange="renderList()">
            <option value="">💳 All plans</option><option value="free">🆓 Free</option><option value="pro">⭐ Pro</option><option value="business">💼 Business</option><option value="enterprise">🏢 Enterprise</option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none" style="color:var(--text-mute)"></i>
        </div>
      </div>
      <div class="ml-auto flex items-center gap-3">
        <span id="userCount" class="text-[12px] font-medium px-3 py-1 rounded-full" style="background:var(--panel);color:var(--text-soft)">0 / 0</span>
        <button class="btn btn-ghost btn-sm" onclick="loadUsers()" title="Refresh"><i class="fas fa-sync-alt"></i></button>
      </div>
    </div>
  </div>

  <!-- Users table — modern card style -->
  <div class="card overflow-hidden" style="border-radius:1.25rem">
    <div class="overflow-x-auto">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:rgba(255,255,255,.015);border-bottom:2px solid var(--border)">
            <th class="px-5 py-3.5 text-[11px] uppercase tracking-wider font-bold" style="color:var(--text-soft)">User</th>
            <th class="px-5 py-3.5 text-[11px] uppercase tracking-wider font-bold hidden md:table-cell" style="color:var(--text-soft)">Role</th>
            <th class="px-5 py-3.5 text-[11px] uppercase tracking-wider font-bold hidden lg:table-cell" style="color:var(--text-soft)">Plan</th>
            <th class="px-5 py-3.5 text-[11px] uppercase tracking-wider font-bold" style="color:var(--text-soft)">Status</th>
            <th class="px-5 py-3.5 text-[11px] uppercase tracking-wider font-bold hidden lg:table-cell" style="color:var(--text-soft)">Requests</th>
            <th class="px-5 py-3.5 text-[11px] uppercase tracking-wider font-bold" style="color:var(--text-soft)">Actions</th>
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
var roleIcons = { admin:'👑', creator:'🎨', consumer:'🔑' };
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

  // Update stats
  var stats = getStats(ALL_USERS);
  var st = document.getElementById('statTotal'); if (st) st.textContent = stats.total;
  var sa = document.getElementById('statActive'); if (sa) sa.textContent = stats.active;
  var sc = document.getElementById('statCreators'); if (sc) sc.textContent = stats.creators;
  var sb = document.getElementById('statBanned'); if (sb) sb.textContent = stats.banned;

  // Update count badge
  var uc = document.getElementById('userCount');
  if (uc) uc.textContent = list.length + ' / ' + ALL_USERS.length;

  // Table
  var table = document.getElementById('usersTable');
  if (!table) return;

  if (!list.length) {
    table.innerHTML = '<tr><td colspan="6" class="px-5 py-16 text-center"><div class="empty-state"><div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style="background:rgba(255,255,255,.02)"><i class="fas fa-user-slash text-2xl opacity-25" style="color:var(--text-mute)"></i></div><p class="text-sm font-semibold" style="color:var(--text-soft)">No users found</p><p class="text-[11px] mt-1" style="color:var(--text-mute)">Try adjusting the filters</p></div></td></tr>';
    return;
  }

  var html = '';
  list.forEach(function(u) {
    var initials = (u.name || '?').split(' ').map(function(p){return (p||'')[0];}).slice(0,2).join('').toUpperCase();
    var color = roleColors[u.role] || '#b8a9e8';
    var isBanned = u.status === 'banned' || u.status === 'suspended';
    var cls = statusCls[u.status] || 'pill-neutral';
    var pCls = planCls[u.plan] || 'pill-neutral';
    var roleIcon = roleIcons[u.role] || '';
    var avatarHtml = u.avatar_url ? '<img src=\"'+u.avatar_url+'\" style=\"width:100%;height:100%;object-fit:cover;border-radius:50%\">' : initials;
    var rowStyle = isBanned ? 'opacity:.45;text-decoration:line-through;text-decoration-color:rgba(255,107,107,.15)' : '';

    var actionsHtml = '';
    // Edit button
    actionsHtml += '<button class="btn btn-ghost btn-icon-sm" onclick="openEditUser(\\''+u.id+'\\')" title="Edit user" style="color:var(--text-soft)"><i class="fas fa-pen-to-square text-[12px]"></i></button>';
    // Reset password
    actionsHtml += '<button class="btn btn-ghost btn-icon-sm" onclick="resetUserPassword(\\''+u.id+'\\')" title="Reset password" style="color:#f5a623"><i class="fas fa-key text-[12px]"></i></button>';
    // Ban / Unban
    if (u.status !== 'banned') {
      actionsHtml += '<button class="btn btn-ghost btn-icon-sm" onclick="banUser(\\''+u.id+'\\')" title="Ban user" style="color:#ff6b6b"><i class="fas fa-ban text-[12px]"></i></button>';
    } else {
      actionsHtml += '<button class="btn btn-ghost btn-icon-sm" onclick="unbanUser(\\''+u.id+'\\')" title="Unban user" style="color:#4ade80"><i class="fas fa-undo text-[12px]"></i></button>';
    }
    // Delete
    actionsHtml += '<button class="btn btn-ghost btn-icon-sm" onclick="deleteUser(\\''+u.id+'\\')" title="Delete user" style="color:#ff6b6b;opacity:.7"><i class="fas fa-trash-can text-[12px]"></i></button>';

    html += '<tr class="hover-row" style="border-bottom:1px solid var(--border);'+rowStyle+'">' +
      // User cell
      '<td class="px-5 py-3.5">' +
        '<div class="flex items-center gap-3.5">' +
          '<div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 relative" style="background:linear-gradient(135deg,'+color+'33,'+color+'11);color:'+color+';overflow:hidden">' +
            avatarHtml +
            '<div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 flex items-center justify-center" style="border-color:var(--surface);background:'+color+';font-size:6px;color:#1a1a1a">' + roleIcon + '</div>' +
          '</div>' +
          '<div class="min-w-0">' +
            '<p class="text-sm font-semibold truncate" style="color:var(--text)">'+esc(u.name)+'</p>' +
            '<p class="text-[11px] truncate mt-0.5" style="color:var(--text-mute)">'+esc(u.email)+'</p>' +
          '</div>' +
        '</div>' +
      '</td>' +
      // Role
      '<td class="px-5 py-3.5 hidden md:table-cell">' +
        '<span class="pill text-[11px]" style="background:'+color+'18;color:'+color+';border-color:'+color+'33;font-weight:600">'+u.role+'</span>' +
      '</td>' +
      // Plan
      '<td class="px-5 py-3.5 hidden lg:table-cell">' +
        '<span class="pill text-[11px] '+pCls+'">'+u.plan+'</span>' +
      '</td>' +
      // Status
      '<td class="px-5 py-3.5">' +
        '<span class="pill text-[11px] '+cls+'">'+u.status+'</span>' +
      '</td>' +
      // Requests
      '<td class="px-5 py-3.5 hidden lg:table-cell">' +
        '<div class="text-[12px] font-semibold" style="color:var(--text)">' + LH.fmt(u.requests_today||0) + '</div>' +
        '<p class="text-[10px] mt-0.5" style="color:var(--text-mute)">' + LH.fmt(u.requests_30d||0) + ' this month</p>' +
      '</td>' +
      // Actions
      '<td class="px-5 py-3.5">' +
        '<div class="flex items-center gap-0.5">'+actionsHtml+'</div>' +
      '</td>' +
    '</tr>';
  });
  table.innerHTML = html;
}

function esc(s) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ============ ACTIONS (same as before) ============
function openEditUser(id) {
  var u = ALL_USERS.find(function(x){return x.id===id;});
  if (!u) return;
  var initials = (u.name||'?').split(' ').map(function(p){return (p||'')[0];}).slice(0,2).join('').toUpperCase();
  var avatarHtml = u.avatar_url ? '<img src=\"'+u.avatar_url+'\" style=\"width:100%;height:100%;object-fit:cover\">' : initials;
  var roleOpts = ['admin','creator','consumer'].map(function(r){return '<option value=\"'+r+'\" '+(u.role===r?'selected':'')+'>'+r+'</option>';}).join('');
  var planOpts = ['free','pro','business','enterprise'].map(function(r){return '<option value=\"'+r+'\" '+(u.plan===r?'selected':'')+'>'+r+'</option>';}).join('');
  var statusOpts = ['active','inactive','suspended','banned'].map(function(r){return '<option value=\"'+r+'\" '+(u.status===r?'selected':'')+'>'+r+'</option>';}).join('');

  var modalHtml = '<div class="modal-box" style="max-width:550px">' +
    '<div class="modal-head"><div style="display:flex;align-items:center;gap:.75rem">' +
      '<div style="width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,#ff6b6b22,#f5a62322);color:#f5a623;display:flex;align-items:center;justify-content:center;font-size:16px"><i class="fas fa-user-pen"></i></div>' +
      '<div><h2 class="text-base font-bold" style="color:var(--text)">Edit User</h2><p class="text-[11px]" style="color:var(--text-mute)">'+esc(u.name)+' · '+esc(u.email)+'</p></div>' +
    '</div><button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>' +
    '<form id="editUserForm" class="modal-body space-y-4">' +
      '<div class="flex items-center gap-4 p-4 rounded-xl" style="background:var(--panel)">' +
        '<div class="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base shrink-0" style="background:linear-gradient(135deg,#b8a9e8,#f5a623);color:#1a1a1a;overflow:hidden">'+avatarHtml+'</div>' +
        '<div><p class="text-sm font-bold" style="color:var(--text)">'+esc(u.name)+'</p><p class="text-[10px]" style="color:var(--text-mute)">'+esc(u.email)+'</p><p class="text-[9px] mt-0.5 font-mono" style="color:var(--text-mute)">#'+(u.id||'').slice(0,12)+'</p></div>' +
      '</div>' +
      '<div><label class="field-label">Full Name</label><input class="input" name="name" value="'+esc(u.name||'')+'"></div>' +
      '<div class="grid grid-cols-2 gap-4">' +
        '<div><label class="field-label">Role</label><select class="input" name="role" style="cursor:pointer">'+roleOpts+'</select></div>' +
        '<div><label class="field-label">Plan</label><select class="input" name="plan" style="cursor:pointer">'+planOpts+'</select></div>' +
      '</div>' +
      '<div><label class="field-label">Status</label><select class="input" name="status" style="cursor:pointer">'+statusOpts+'</select></div>' +
      '<div class="grid grid-cols-2 gap-4">' +
        '<div><label class="field-label">Bio</label><input class="input" name="bio" value="'+esc(u.bio||'')+'" placeholder="Optional"></div>' +
        '<div><label class="field-label">Company</label><input class="input" name="company" value="'+esc(u.company||'')+'" placeholder="Optional"></div>' +
      '</div>' +
      '<div class="p-3 rounded-xl" style="background:rgba(245,166,35,.04);border:1px solid rgba(245,166,35,.1)">' +
        '<p class="text-[11px] font-semibold mb-2 flex items-center gap-1.5" style="color:#f5a623"><i class="fas fa-key"></i> Reset Password</p>' +
        '<div style="display:flex;gap:.5rem"><input class="input" id="newUserPass" type="text" placeholder="Enter new password..." style="font-size:.8rem;flex:1">' +
        '<button type="button" class="btn btn-ghost btn-sm" onclick="resetPasswordNow(\\''+u.id+'\\')" style="white-space:nowrap;color:#f5a623;font-weight:600"><i class="fas fa-sync-alt"></i> Reset</button></div>' +
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
    LH.toast('success', 'Password reset', 'New: ' + newPass);
    input.value = '';
  } catch (e) { LH.toast('error', 'Failed', e.message); }
}

async function banUser(id) {
  var yes = await LH.confirm({ title: 'Ban this user?', msg: 'They will not be able to log in and their keys will be revoked.', danger: true });
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
  var yes = await LH.confirm({ title: 'Delete this user?', msg: 'All their data will be permanently removed. This action is irreversible.', danger: true });
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
