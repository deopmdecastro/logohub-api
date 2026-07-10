// Shared layouts: sidebar + topbar for dashboard / admin
export type NavItem = { id: string; icon: string; label: string; href: string; color?: string };

// Role context — threads through every dashboard page so it renders the
// correct sidebar, scopes topbar links to the right environment, and lets
// each page enforce (client-side) that only the matching role can view it.
export type Role = 'admin' | 'creator' | 'consumer';
export type PageCtx = { role: Role; basePath: string };
export const ADMIN_CTX: PageCtx = { role: 'admin', basePath: '/dashboard' };
export const CREATOR_CTX: PageCtx = { role: 'creator', basePath: '/dashboard/creator' };
export const CONSUMER_CTX: PageCtx = { role: 'consumer', basePath: '/dashboard/consumer' };
export const homeForRole = (role: Role) => role === 'admin' ? '/dashboard' : role === 'creator' ? '/dashboard/creator' : '/dashboard/consumer';

export const DASH_NAV: NavItem[] = [
  { id: 'overview', icon: 'fa-chart-bar', label: 'Overview', href: '/dashboard', color: '#b8a9e8' },
  { id: 'users', icon: 'fa-users', label: 'Users', href: '/dashboard/admin/users', color: '#ff6b6b' },
  { id: 'keys', icon: 'fa-key', label: 'API Keys', href: '/dashboard/keys', color: '#f5a623' },
  { id: 'content', icon: 'fa-images', label: 'Content', href: '/dashboard/content', color: '#4ecdc4' },
  { id: 'blog', icon: 'fa-newspaper', label: 'Blog', href: '/dashboard/blog', color: '#a78bfa' },
  { id: 'faq', icon: 'fa-question-circle', label: 'FAQ', href: '/dashboard/faq', color: '#4ade80' },
  { id: 'support', icon: 'fa-headset', label: 'Support', href: '/dashboard/support', color: '#f5a623' },
  { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics', href: '/dashboard/analytics', color: '#b8a9e8' },
  { id: 'activity', icon: 'fa-history', label: 'Activity', href: '/dashboard/activity', color: '#f5a623' },
  { id: 'billing', icon: 'fa-file-invoice-dollar', label: 'Billing', href: '/dashboard/billing', color: '#4ecdc4' },
  { id: 'team', icon: 'fa-users', label: 'Team', href: '/dashboard/team', color: '#ff6b6b' },
  { id: 'settings', icon: 'fa-cog', label: 'Settings', href: '/dashboard/settings', color: '#4ade80' },
];

export const sidebar = (activeId: string, planName = 'Business', used = 248391, quota = 1000000) => {
  const items = DASH_NAV.map(n => `
    <a href="${n.href}" class="sidebar-item ${activeId === n.id ? 'active' : ''}">
      <span class="ic" style="background:${n.color}1F;color:${n.color};"><i class="fas ${n.icon}"></i></span>
      <span class="flex-1">${n.label}</span>
      ${activeId === n.id ? '<i class="fas fa-chevron-right text-[10px]" style="color:var(--text-mute)"></i>' : ''}
    </a>`).join('');
  const pct = Math.min(100, Math.round((used / quota) * 100));
  return `
<aside id="sidebar" class="fixed lg:sticky top-0 left-0 h-screen w-64 p-5 flex flex-col z-50 transition-transform duration-200 -translate-x-full lg:translate-x-0" style="background: var(--surface); border-right:1px solid var(--border)">
  <a href="/" class="flex items-center gap-3 mb-8">
    <div class="w-10 h-10 rounded-2xl flex items-center justify-center" style="background:#1a1a1a">
      <i class="fas fa-sparkles" style="color:#b8a9e8"></i>
    </div>
    <div>
      <p class="text-sm font-bold leading-tight tracking-tight" style="color:var(--text)">LogoHub <span style="color:var(--text-mute)">API</span></p>
      <p class="text-[10px]" style="color:var(--text-mute)" data-i18n="nav.admin_console">Admin Console · v1</p>
    </div>
  </a>
  <nav class="space-y-0.5 flex-1 overflow-y-auto -mx-1 px-1">${items}</nav>
  <div class="card p-4 mt-5">
    <div class="flex items-center justify-between mb-1.5">
      <p class="text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)" data-i18n="dashboard.admin_plan">Admin Plan</p>
      <span class="pill pill-lilac">${planName}</span>
    </div>
    <p class="text-[11px]" style="color:var(--text-soft)">${used.toLocaleString()} / ${quota.toLocaleString()} requests</p>
    <div class="mt-2 h-1.5 rounded-full overflow-hidden" style="background: var(--border)">
      <div class="h-full rounded-full" style="width:${pct}%; background:#b8a9e8;"></div>
    </div>
    <a href="/dashboard/billing" class="mt-3 block text-center text-[11px] font-medium py-1.5 rounded-full btn-primary"><span data-i18n="dashboard.manage_billing">Manage billing</span></a>
  </div>
  <div class="mt-3 pt-3" style="border-top:1px solid var(--border)">
    <a href="/dashboard/notifications" class="sidebar-item"><span class="ic" style="background:#4ecdc422;color:#4ecdc4"><i class="fas fa-bell text-[10px]"></i></span><span data-i18n="dashboard.notifications">Notifications</span></a>
    <a href="/dashboard/profile" class="sidebar-item"><span class="ic" style="background:#b8a9e822;color:#b8a9e8"><i class="fas fa-user-circle text-[10px]"></i></span><span data-i18n="dashboard.my_profile">My Profile</span></a>
    <a href="#" class="sidebar-item" onclick="event.preventDefault();LH.logout()" style="color:#ff6b6b"><span class="ic" style="background:#ff6b6b22;color:#ff6b6b"><i class="fas fa-sign-out-alt text-[10px]"></i></span><span data-i18n="nav.logout">Sign out</span></a>
  </div>
</aside>`;
};

export const topbar = (title: string, subtitle = '', ctx: PageCtx = ADMIN_CTX) => {
  const base = ctx.basePath;
  const billingItem = ctx.role === 'admin' ? `
        <a href="${base}/billing" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-[var(--panel-2)]" style="color:var(--text-soft);text-decoration:none">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#4ade8022;color:#4ade80"><i class="fas fa-file-invoice-dollar text-[13px]"></i></div>
          <span>Billing</span>
        </a>` : '';
  return `
<header class="sticky top-0 z-30 nav-blur px-5 lg:px-8 py-3.5 flex items-center justify-between" data-role-ctx="${ctx.role}">
  <div class="flex items-center gap-3 min-w-0">
    <button onclick="document.getElementById('sidebar').classList.toggle('-translate-x-full')" class="lg:hidden btn btn-ghost btn-icon"><i class="fas fa-bars"></i></button>
    <div class="min-w-0">
      <h1 class="text-base font-bold truncate tracking-tight" style="color:var(--text)">${title}</h1>
      ${subtitle ? '<p class="text-[11px] truncate" style="color:var(--text-mute)">' + subtitle + '</p>' : ''}
    </div>
  </div>
  <div class="flex items-center gap-1.5">
    <!-- Theme toggle -->
    <button id="langBtn" onclick="LH.toggleLang()" class="btn btn-ghost btn-icon" title="EN / PT"><span style="font-size:.65rem;font-weight:700">PT</span></button>
    <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon" title="Toggle theme"><i class="fas fa-sun"></i></button>

    <!-- Notification bell -->
    <a href="${base}/notifications" class="btn btn-ghost btn-icon relative" title="Notifications" style="text-decoration:none">
      <i class="fas fa-bell text-[16px]" style="color:var(--text-soft)"></i>
      <span id="notifBadge" class="absolute top-1.5 right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold px-1" style="background:#ff6b6b;color:#fff;display:none">0</span>
    </a>

    <!-- Avatar + dropdown -->
    <div class="relative" id="avatarDropdown">
      <button onclick="LH.toggleUserMenu()" class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer border-2 transition-all hover:scale-105" style="background:linear-gradient(135deg,#b8a9e8,#f5a623);color:#1a1a1a;border-color:rgba(255,255,255,.1)" id="avatarBtn">
        <span id="avatarInitials">A</span>
      </button>
      <!-- Dropdown menu -->
      <div id="userMenu" class="absolute right-0 top-full mt-2 w-64 card p-2 shadow-xl z-50" style="display:none;animation:fadeIn .15s ease-out">
        <!-- User info -->
        <div class="flex items-center gap-3 p-3 rounded-xl mb-1" style="background:var(--panel-2)">
          <div class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style="background:linear-gradient(135deg,#b8a9e8,#f5a623);color:#1a1a1a">
            <span id="menuInitials">A</span>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold truncate" style="color:var(--text)" id="menuName">Loading...</p>
            <p class="text-[11px] truncate" style="color:var(--text-mute)" id="menuEmail">—</p>
          </div>
        </div>
        <!-- Plan badge -->
        <div class="px-3 pb-1">
          <span class="pill pill-lilac" id="menuRole">—</span>
          <span class="pill pill-teal ml-1" id="menuPlan">—</span>
        </div>
        <hr style="border-color:var(--border);margin:.5rem 0">
        <!-- Menu items -->
        <a href="${base}/profile" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-[var(--panel-2)]" style="color:var(--text-soft);text-decoration:none">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#b8a9e822;color:#b8a9e8"><i class="fas fa-user-circle text-[13px]"></i></div>
          <span>My Profile</span>
        </a>
        <a href="${base}/settings" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-[var(--panel-2)]" style="color:var(--text-soft);text-decoration:none">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#f5a62322;color:#f5a623"><i class="fas fa-cog text-[13px]"></i></div>
          <span>Settings</span>
        </a>
        <a href="${base}/notifications" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-[var(--panel-2)]" style="color:var(--text-soft);text-decoration:none">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#4ecdc422;color:#4ecdc4"><i class="fas fa-bell text-[13px]"></i></div>
          <span>Notifications</span>
        </a>${billingItem}
        <hr style="border-color:var(--border);margin:.5rem 0">
        <a href="/api/v1/auth/logout" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-[var(--panel-2)]" style="color:#ff6b6b;text-decoration:none" onclick="event.preventDefault();LH.logout()">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#ff6b6b22;color:#ff6b6b"><i class="fas fa-sign-out-alt text-[13px]"></i></div>
          <span>Sign out</span>
        </a>
      </div>
    </div>
  </div>
</header>`;
};


// Creator-specific sidebar — every link stays inside /dashboard/creator/*
export const creatorSidebar = (activeId: string) => {
  const items = [
    { id: 'overview', icon: 'fa-chart-pie', label: 'Overview', href: '/dashboard/creator', color: '#b8a9e8' },
    { id: 'playground', icon: 'fa-code', label: 'Playground', href: '/playground', color: '#4ade80' },
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications', href: '/dashboard/creator/notifications', color: '#ff6b6b' },
    { id: 'content', icon: 'fa-folder-open', label: 'My APIs', href: '/dashboard/creator/content', color: '#f5a623' },
    { id: 'analytics', icon: 'fa-chart-bar', label: 'Analytics', href: '/dashboard/creator/analytics', color: '#4ecdc4' },
    { id: 'profile', icon: 'fa-user-circle', label: 'My Profile', href: '/dashboard/creator/profile', color: '#4ecdc4' },
    { id: 'settings', icon: 'fa-cog', label: 'Settings', href: '/dashboard/creator/settings', color: '#71717a' },
  ];
  return renderSidebar(activeId, 'Creator', items);
};

// Consumer-specific sidebar — every link stays inside /dashboard/consumer/*
export const consumerSidebar = (activeId: string) => {
  const items = [
    { id: 'overview', icon: 'fa-chart-pie', label: 'Overview', href: '/dashboard/consumer', color: '#b8a9e8' },
    { id: 'playground', icon: 'fa-code', label: 'Playground', href: '/playground', color: '#4ade80' },
    { id: 'notifications', icon: 'fa-bell', label: 'Notifications', href: '/dashboard/consumer/notifications', color: '#ff6b6b' },
    { id: 'keys', icon: 'fa-key', label: 'My Keys', href: '/dashboard/consumer/keys', color: '#f5a623' },
    { id: 'usage', icon: 'fa-bolt', label: 'Usage', href: '/dashboard/consumer/analytics', color: '#4ecdc4' },
    { id: 'profile', icon: 'fa-user-circle', label: 'My Profile', href: '/dashboard/consumer/profile', color: '#4ecdc4' },
    { id: 'settings', icon: 'fa-cog', label: 'Settings', href: '/dashboard/consumer/settings', color: '#71717a' },
  ];
  return renderSidebar(activeId, 'Consumer', items);
};

// Returns the sidebar matching a role — used by shared pages (notifications,
// profile, settings, analytics, content/keys) that render for more than one role.
export const ctxSidebar = (ctx: PageCtx, activeId: string) => {
  if (ctx.role === 'creator') return creatorSidebar(activeId);
  if (ctx.role === 'consumer') return consumerSidebar(activeId);
  return sidebar(activeId);
};

// Reusable sidebar renderer
function renderSidebar(activeId: string, roleLabel: string, items: {id:string,icon:string,label:string,href:string,color:string}[]) {
  const navHtml = items.map(n => `
    <a href="${n.href}" class="sidebar-item ${activeId === n.id ? 'active' : ''}">
      <div class="ic" style="background:${n.color}22;color:${n.color}"><i class="fas ${n.icon} text-[10px]"></i></div>
      ${n.label}
    </a>`).join('');
  return `<aside id="sidebar" class="fixed lg:sticky top-0 left-0 h-screen w-64 p-5 flex flex-col z-50 transition-transform duration-200 -translate-x-full lg:translate-x-0" style="background: var(--surface); border-right:1px solid var(--border)">
    <div class="mb-6">
      <a href="/" class="flex items-center gap-2 font-bold text-lg mb-1" style="color:var(--text)">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black" style="background:var(--lilac);color:#1a1a1a">L</span>LogoHub
      </a>
      <span class="pill pill-lilac" style="font-size:.6rem">${roleLabel}</span>
    </div>
    <nav class="flex-1 space-y-1">${navHtml}</nav>
    <div class="pt-4" style="border-top:1px solid var(--border)">
      <a href="/" class="sidebar-item"><div class="ic" style="background:#71717a22;color:#71717a"><i class="fas fa-home text-[10px]"></i></div>Back to site</a>
      <a href="#" class="sidebar-item" onclick="event.preventDefault();LH.logout()"><div class="ic" style="background:#ff6b6b22;color:#ff6b6b"><i class="fas fa-sign-out-alt text-[10px]"></i></div>Sign out</a>
    </div>
  </aside>`;
}

export const shellWrap = (sidebarHtml: string, mainHtml: string) => `
<body class="font-sans">
<div class="flex min-h-screen">
  ${sidebarHtml}
  <main class="flex-1 min-w-0">
    ${mainHtml}
  </main>
</div>
</body>
</html>`;
