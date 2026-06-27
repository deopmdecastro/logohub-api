import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap } from './layout';

// ============================================================
// /dashboard/notifications  — Full Notifications Inbox
// ============================================================
export const notificationsPage = () => `${HEAD('Notifications — LogoHub', COMMON_JS)}
${shellWrap(sidebar('notifications'), `
${topbar('Notifications', 'All updates, alerts, and messages')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto animate-fade-up">
  
  <!-- Toolbar -->
  <div class="flex items-center gap-3 mb-4">
    <select id="notifTypeFilter" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderList()">
      <option value="">All types</option>
      <option value="info">Info</option>
      <option value="success">Success</option>
      <option value="warning">Warning</option>
      <option value="error">Error</option>
    </select>
    <label class="flex items-center gap-2 text-sm cursor-pointer" style="color:var(--text-soft)">
      <input type="checkbox" id="unreadOnly" onchange="renderList()" style="accent-color:#b8a9e8"> Unread only
    </label>
    <span id="notifCounter" class="text-[11px] ml-auto" style="color:var(--text-mute)"></span>
    <button class="btn btn-ghost btn-sm" onclick="markAllReadPage()"><i class="fas fa-check-double mr-1"></i> Mark all read</button>
    <button class="btn btn-ghost btn-sm" onclick="clearAll()"><i class="fas fa-trash mr-1"></i> Clear all</button>
  </div>

  <!-- Notifications List -->
  <div class="card overflow-hidden"><div id="notifPageList" class="divide-y" style="border-color:var(--border)"></div></div>

</div>

<script>
var PAGE_NOTIFS = [];
var typeIcon = { info:'fa-info-circle', success:'fa-check-circle', warning:'fa-exclamation-triangle', error:'fa-times-circle' };
var typeColor = { info:'#b8a9e8', success:'#4ade80', warning:'#f5a623', error:'#ff6b6b' };

async function loadPage() {
  try {
    var role = getCurrentRole();
    var r = await LH.api('/api/v1/notifications?limit=100' + (role ? '&role=' + role : ''));
    PAGE_NOTIFS = r.data || [];
    renderList();
  } catch (e) { LH.toast('error', 'Failed to load notifications', e.message); }
}

function getCurrentRole() {
  if (window.location.pathname.indexOf('/dashboard/creator') >= 0) return 'creator';
  if (window.location.pathname.indexOf('/dashboard/consumer') >= 0) return 'consumer';
  return 'admin';
}

function renderList() {
  var typeFilter = document.getElementById('notifTypeFilter');
  var unreadOnly = document.getElementById('unreadOnly');
  var filterVal = typeFilter ? typeFilter.value : '';
  var onlyUnread = unreadOnly ? unreadOnly.checked : false;
  
  var list = PAGE_NOTIFS.slice();
  if (filterVal) list = list.filter(function(n) { return n.type === filterVal; });
  if (onlyUnread) list = list.filter(function(n) { return !n.read; });
  
  var counter = document.getElementById('notifCounter');
  if (counter) counter.textContent = list.length + ' of ' + PAGE_NOTIFS.length + ' notifications';
  
  var container = document.getElementById('notifPageList');
  if (!container) return;
  
  if (!list.length) {
    container.innerHTML = '<div class="empty-state p-12"><i class="fas fa-bell-slash text-3xl mb-3 opacity-30 block"></i><p class="text-sm" style="color:var(--text-mute)">No notifications match your filters</p></div>';
    return;
  }
  
  var html = '';
  list.forEach(function(n) {
    var bg = n.read ? 'transparent' : 'rgba(184,169,232,.04)';
    var cur = n.link ? 'pointer' : 'default';
    var onclick = n.link ? ("window.location.href='" + n.link + "';") : '';
    var pillBg = (typeColor[n.type] || '#b8a9e8') + '22';
    var pillColor = typeColor[n.type] || '#b8a9e8';
    var iconClass = typeIcon[n.type] || 'fa-bell';
    var unreadDot = !n.read ? '<span class="w-2 h-2 rounded-full animate-pulse-dot" style="background:#b8a9e8"></span>' : '';
    var linkArrow = n.link ? '<p class="text-[10px] mt-1" style="color:#b8a9e8"><i class="fas fa-arrow-right text-[8px] mr-1"></i>' + esc(n.link) + '</p>' : '';
    
    html += '<div class="flex items-start gap-4 px-5 py-4 ' + (n.read ? '' : 'highlight-row') + '" ' +
         'style="background:' + bg + ';border-bottom:1px solid var(--border);cursor:' + cur + '" ' +
         'onclick="' + onclick + ' markAsRead(' + n.id + ')">' +
      '<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style="background:' + pillBg + ';color:' + pillColor + '">' +
        '<i class="fas ' + iconClass + ' text-[14px]"></i>' +
      '</div>' +
      '<div class="flex-1 min-w-0">' +
        '<div class="flex items-center gap-2 mb-1">' +
          '<span class="pill" style="background:' + pillBg + ';color:' + pillColor + ';border-color:' + pillColor + '55;font-size:.6rem">' + (n.type || '') + '</span>' +
          unreadDot +
        '</div>' +
        '<p class="text-sm font-semibold" style="color:var(--text)">' + esc(n.title) + '</p>' +
        '<p class="text-[11px] mt-0.5" style="color:var(--text-soft)">' + esc(n.message) + '</p>' +
        '<p class="text-[10px] mt-1.5" style="color:var(--text-mute)">' + LH.rel(n.ts) + '</p>' +
        linkArrow +
      '</div>' +
      '<div class="flex items-center gap-1 shrink-0">' +
        '<button class="btn btn-ghost btn-icon-sm" onclick="event.stopPropagation(); markAsRead(' + n.id + ')" title="Mark as read">' +
          '<i class="fas fa-check text-[10px]"></i>' +
        '</button>' +
        '<button class="btn btn-danger btn-icon-sm" onclick="event.stopPropagation(); deleteNotif(' + n.id + ')" title="Delete">' +
          '<i class="fas fa-trash text-[10px]"></i>' +
        '</button>' +
      '</div>' +
    '</div>';
  });
  container.innerHTML = html;
}

async function markAsRead(id) {
  try {
    await LH.api('/api/v1/notifications/' + id + '/read', { method: 'PATCH' });
    var n = PAGE_NOTIFS.find(function(x) { return x.id === id; });
    if (n) n.read = true;
    renderList();
    if (typeof NOTIF_UNREAD !== 'undefined') {
      NOTIF_UNREAD = PAGE_NOTIFS.filter(function(x) { return !x.read; }).length;
      if (typeof updateBadge === 'function') updateBadge();
    }
  } catch (e) {}
}

async function markAllReadPage() {
  try {
    await LH.api('/api/v1/notifications/read-all', { method: 'PATCH' });
    PAGE_NOTIFS.forEach(function(n) { n.read = true; });
    renderList();
    LH.toast('success', 'All notifications marked as read');
    if (typeof NOTIF_UNREAD !== 'undefined') { NOTIF_UNREAD = 0; if (typeof updateBadge === 'function') updateBadge(); }
  } catch (e) { LH.toast('error', 'Failed', e.message); }
}

async function deleteNotif(id) {
  try {
    await LH.api('/api/v1/notifications/' + id, { method: 'DELETE' });
    PAGE_NOTIFS = PAGE_NOTIFS.filter(function(n) { return n.id !== id; });
    renderList();
    LH.toast('success', 'Notification deleted');
  } catch (e) { LH.toast('error', 'Failed', e.message); }
}

async function clearAll() {
  try {
    var toDelete = PAGE_NOTIFS.slice();
    for (var i = 0; i < toDelete.length; i++) {
      await LH.api('/api/v1/notifications/' + toDelete[i].id, { method: 'DELETE' });
    }
    PAGE_NOTIFS = [];
    renderList();
    LH.toast('success', 'All notifications cleared');
  } catch (e) { LH.toast('error', 'Failed', e.message); }
}

function esc(s) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

loadPage();
</script>
`)}
`;
