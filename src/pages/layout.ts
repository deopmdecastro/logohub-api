// Shared layouts: sidebar + topbar for dashboard / admin
export type NavItem = { id: string; icon: string; label: string; href: string; color?: string };

export const DASH_NAV: NavItem[] = [
  { id: 'overview', icon: 'fa-chart-bar', label: 'Overview', href: '/dashboard', color: '#b8a9e8' },
  { id: 'users', icon: 'fa-users', label: 'Users', href: '/dashboard/users', color: '#ff6b6b' },
  { id: 'keys', icon: 'fa-key', label: 'API Keys', href: '/dashboard/keys', color: '#f5a623' },
  { id: 'content', icon: 'fa-images', label: 'Content', href: '/dashboard/content', color: '#4ecdc4' },
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
      <p class="text-[10px]" style="color:var(--text-mute)">Admin Console · v1</p>
    </div>
  </a>
  <nav class="space-y-0.5 flex-1 overflow-y-auto -mx-1 px-1">${items}</nav>
  <div class="card p-4 mt-5">
    <div class="flex items-center justify-between mb-1.5">
      <p class="text-[10px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Plan</p>
      <span class="pill pill-lilac">${planName}</span>
    </div>
    <p class="text-[11px]" style="color:var(--text-soft)">${used.toLocaleString()} / ${quota.toLocaleString()}</p>
    <div class="mt-2 h-1.5 rounded-full overflow-hidden" style="background: var(--border)">
      <div class="h-full rounded-full" style="width:${pct}%; background:#b8a9e8;"></div>
    </div>
    <a href="/dashboard/billing" class="mt-3 block text-center text-[11px] font-medium py-1.5 rounded-full btn-primary">Manage plan</a>
  </div>
</aside>`;
};

export const topbar = (title: string, subtitle = '') => `
<header class="sticky top-0 z-30 nav-blur px-5 lg:px-8 py-3.5 flex items-center justify-between">
  <div class="flex items-center gap-3 min-w-0">
    <button onclick="document.getElementById('sidebar').classList.toggle('-translate-x-full')" class="lg:hidden btn btn-ghost btn-icon"><i class="fas fa-bars"></i></button>
    <div class="min-w-0">
      <h1 class="text-base font-bold truncate tracking-tight" style="color:var(--text)">${title}</h1>
      ${subtitle ? `<p class="text-[11px] truncate" style="color:var(--text-mute)">${subtitle}</p>` : ''}
    </div>
  </div>
  <div class="flex items-center gap-1.5">
    <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon" title="Toggle theme"><i class="fas fa-sun"></i></button>
    <button class="btn btn-ghost btn-icon relative" title="Notifications"><i class="fas fa-bell"></i><span class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style="background:#f5a623"></span></button>
    <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer" style="background: linear-gradient(135deg,#b8a9e8,#f5a623); color:#1a1a1a;">A</div>
  </div>
</header>`;


// Creator-specific sidebar
export const creatorSidebar = (activeId: string) => {
  const items = [
    { id: 'overview', icon: 'fa-chart-pie', label: 'Overview', href: '/dashboard/creator', color: '#b8a9e8' },
    { id: 'content', icon: 'fa-folder-open', label: 'My Content', href: '/dashboard/content', color: '#f5a623' },
    { id: 'earnings', icon: 'fa-dollar-sign', label: 'Earnings', href: '/dashboard/creator/earnings', color: '#4ade80' },
    { id: 'analytics', icon: 'fa-chart-bar', label: 'Analytics', href: '/dashboard/analytics', color: '#4ecdc4' },
    { id: 'settings', icon: 'fa-cog', label: 'Settings', href: '/dashboard/settings', color: '#71717a' },
  ];
  return renderSidebar(activeId, 'Creator', items);
};

// Consumer-specific sidebar
export const consumerSidebar = (activeId: string) => {
  const items = [
    { id: 'overview', icon: 'fa-chart-pie', label: 'Overview', href: '/dashboard/consumer', color: '#b8a9e8' },
    { id: 'keys', icon: 'fa-key', label: 'My Keys', href: '/dashboard/keys', color: '#f5a623' },
    { id: 'usage', icon: 'fa-bolt', label: 'Usage', href: '/dashboard/analytics', color: '#4ecdc4' },
    { id: 'settings', icon: 'fa-cog', label: 'Settings', href: '/dashboard/settings', color: '#71717a' },
  ];
  return renderSidebar(activeId, 'Consumer', items);
};

// Reusable sidebar renderer
function renderSidebar(activeId: string, roleLabel: string, items: {id:string,icon:string,label:string,href:string,color:string}[]) {
  const navHtml = items.map(n => `
    <a href="\${n.href}" class="sidebar-item \${activeId === n.id ? 'active' : ''}">
      <div class="ic" style="background:\${n.color}22;color:\${n.color}"><i class="fas \${n.icon} text-[10px]"></i></div>
      \${n.label}
    </a>`).join('');
  return `<aside id="sidebar" class="fixed lg:sticky top-0 left-0 h-screen w-64 p-5 flex flex-col z-50 transition-transform duration-200 -translate-x-full lg:translate-x-0" style="background: var(--surface); border-right:1px solid var(--border)">
    <div class="mb-6">
      <a href="/" class="flex items-center gap-2 font-bold text-lg mb-1" style="color:var(--text)">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black" style="background:var(--lilac);color:#1a1a1a">L</span>LogoHub
      </a>
      <span class="pill pill-lilac" style="font-size:.6rem">\${roleLabel}</span>
    </div>
    <nav class="flex-1 space-y-1">\${navHtml}</nav>
    <div class="pt-4" style="border-top:1px solid var(--border)">
      <a href="/" class="sidebar-item"><div class="ic" style="background:#71717a22;color:#71717a"><i class="fas fa-home text-[10px]"></i></div>Back to site</a>
      <a href="/api/v1/auth/logout" class="sidebar-item"><div class="ic" style="background:#ff6b6b22;color:#ff6b6b"><i class="fas fa-sign-out-alt text-[10px]"></i></div>Sign out</a>
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
