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
let PAGE_NOTIFS: any[] = [];
const typeIcon: Record<string,string> = { info:'fa-info-circle', success:'fa-check-circle', warning:'fa-exclamation-triangle', error:'fa-times-circle' };
const typeColor: Record<string,string> = { info:'#b8a9e8', success:'#4ade80', warning:'#f5a623', error:'#ff6b6b' };

async function loadPage() {
  try {
    const role = getCurrentRole();
    const r = await LH.api('/api/v1/notifications?limit=100' + (role ? '&role=' + role : ''));
    PAGE_NOTIFS = r.data || [];
    renderList();
  } catch (e) { LH.toast('error', 'Failed to load notifications', e.message); }
}

function getCurrentRole() {
  // Detect role from URL path
  if (window.location.pathname.includes('/dashboard/creator')) return 'creator';
  if (window.location.pathname.includes('/dashboard/consumer')) return 'consumer';
  // Default admin
  return 'admin';
}

function renderList() {
  const typeFilter = (document.getElementById('notifTypeFilter') as HTMLSelectElement)?.value || '';
  const unreadOnly = (document.getElementById('unreadOnly') as HTMLInputElement)?.checked || false;
  
  let list = [...PAGE_NOTIFS];
  if (typeFilter) list = list.filter(n => n.type === typeFilter);
  if (unreadOnly) list = list.filter(n => !n.read);
  
  const counter = document.getElementById('notifCounter');
  if (counter) counter.textContent = list.length + ' of ' + PAGE_NOTIFS.length + ' notifications';
  
  const container = document.getElementById('notifPageList');
  if (!container) return;
  
  if (!list.length) {
    container.innerHTML = '<div class="empty-state p-12"><i class="fas fa-bell-slash text-3xl mb-3 opacity-30 block"></i><p class="text-sm" style="color:var(--text-mute)">No notifications match your filters</p></div>';
    return;
  }
  
  container.innerHTML = list.map((n: any) => `
    <div class="flex items-start gap-4 px-5 py-4 ${n.read ? '' : 'highlight-row'}" 
         style="background:${n.read ? 'transparent' : 'rgba(184,169,232,.04)'};border-bottom:1px solid var(--border);cursor:${n.link ? 'pointer' : 'default'}"
         onclick="${n.link ? 'window.location.href=\\'' + n.link + '\\';' : ''} markAsRead('+n.id+')">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style="background:${typeColor[n.type]||'#b8a9e8'}22;color:${typeColor[n.type]||'#b8a9e8'}">
        <i class="fas ${typeIcon[n.type]||'fa-bell'} text-[14px]"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="pill" style="background:${typeColor[n.type]||'#b8a9e8'}22;color:${typeColor[n.type]||'#b8a9e8'};border-color:${typeColor[n.type]||'#b8a9e8'}55;font-size:.6rem">${n.type}</span>
          ${!n.read ? '<span class="w-2 h-2 rounded-full animate-pulse-dot" style="background:#b8a9e8"></span>' : ''}
        </div>
        <p class="text-sm font-semibold" style="color:var(--text)">${esc(n.title)}</p>
        <p class="text-[11px] mt-0.5" style="color:var(--text-soft)">${esc(n.message)}</p>
        <p class="text-[10px] mt-1.5" style="color:var(--text-mute)">${LH.rel(n.ts)}</p>
        ${n.link ? '<p class="text-[10px] mt-1" style="color:#b8a9e8"><i class="fas fa-arrow-right text-[8px] mr-1"></i>' + esc(n.link) + '</p>' : ''}
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <button class="btn btn-ghost btn-icon-sm" onclick="event.stopPropagation(); markAsRead('+n.id+')" title="Mark as read">
          <i class="fas fa-check text-[10px]"></i>
        </button>
        <button class="btn btn-danger btn-icon-sm" onclick="event.stopPropagation(); deleteNotif('+n.id+')" title="Delete">
          <i class="fas fa-trash text-[10px]"></i>
        </button>
      </div>
    </div>
  `).join('');
}

async function markAsRead(id: number) {
  try {
    await LH.api('/api/v1/notifications/' + id + '/read', { method: 'PATCH' });
    const n = PAGE_NOTIFS.find((x: any) => x.id === id);
    if (n) n.read = true;
    renderList();
    // Update badge
    if (typeof NOTIF_UNREAD !== 'undefined') {
      NOTIF_UNREAD = PAGE_NOTIFS.filter(x => !x.read).length;
      if (typeof updateBadge === 'function') updateBadge();
    }
  } catch {}
}

async function markAllReadPage() {
  try {
    await LH.api('/api/v1/notifications/read-all', { method: 'PATCH' });
    PAGE_NOTIFS.forEach(n => n.read = true);
    renderList();
    LH.toast('success', 'All notifications marked as read');
    if (typeof NOTIF_UNREAD !== 'undefined') { NOTIF_UNREAD = 0; if (typeof updateBadge === 'function') updateBadge(); }
  } catch (e) { LH.toast('error', 'Failed', (e as any).message); }
}

async function deleteNotif(id: number) {
  try {
    await LH.api('/api/v1/notifications/' + id, { method: 'DELETE' });
    PAGE_NOTIFS = PAGE_NOTIFS.filter(n => n.id !== id);
    renderList();
    LH.toast('success', 'Notification deleted');
  } catch (e) { LH.toast('error', 'Failed', (e as any).message); }
}

async function clearAll() {
  try {
    for (const n of [...PAGE_NOTIFS]) {
      await LH.api('/api/v1/notifications/' + n.id, { method: 'DELETE' });
    }
    PAGE_NOTIFS = [];
    renderList();
    LH.toast('success', 'All notifications cleared');
  } catch (e) { LH.toast('error', 'Failed', (e as any).message); }
}

function esc(s: string) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

// Kick off
loadPage();
</script>
`)}
`;
