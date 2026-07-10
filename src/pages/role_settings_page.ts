import { HEAD, COMMON_JS } from './shared';
import { ctxSidebar, topbar, shellWrap, PageCtx } from './layout';

// ============================================================
// /dashboard/creator/settings · /dashboard/consumer/settings
// Lightweight, role-scoped settings — appearance + notification
// preferences + quick links. Deliberately separate from the admin
// platform settings page (/dashboard/settings), which holds sensitive
// platform config (Git PAT, branding, plan management) that creators
// and consumers should never see.
// ============================================================
export const roleSettingsPage = (ctx: PageCtx) => `${HEAD('Settings — LogoHub', COMMON_JS)}
${shellWrap(ctxSidebar(ctx, 'settings'), `
${topbar('Settings', 'Preferences for your ' + (ctx.role === 'creator' ? 'Creator' : 'Consumer') + ' account', ctx)}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[900px] mx-auto space-y-5 animate-fade-up">

  <div class="card p-6">
    <h3 class="text-sm font-semibold mb-1 flex items-center gap-2" style="color:var(--text)"><i class="fas fa-palette text-[#4ecdc4]"></i> Appearance</h3>
    <p class="text-[11px] mb-4" style="color:var(--text-mute)">Theme and language apply across your whole account.</p>
    <div class="flex items-center gap-3">
      <button class="btn btn-ghost btn-sm" onclick="LH.toggleTheme()"><i class="fas fa-moon"></i> Toggle theme</button>
      <button class="btn btn-ghost btn-sm" onclick="LH.toggleLang()"><i class="fas fa-language"></i> EN / PT</button>
    </div>
  </div>

  <div class="card p-6">
    <h3 class="text-sm font-semibold mb-1 flex items-center gap-2" style="color:var(--text)"><i class="fas fa-bell text-[#f5a623]"></i> Notification preferences</h3>
    <p class="text-[11px] mb-4" style="color:var(--text-mute)">Choose what you hear about in this environment. Only affects notifications for your ${ctx.role} account.</p>
    <div class="space-y-3" id="notifPrefs"></div>
  </div>

  <div class="card p-6">
    <h3 class="text-sm font-semibold mb-1 flex items-center gap-2" style="color:var(--text)"><i class="fas fa-user-circle text-[#b8a9e8]"></i> Account</h3>
    <p class="text-[11px] mb-4" style="color:var(--text-mute)">Name, email, password, and account deletion live on your profile page.</p>
    <a href="${ctx.basePath}/profile" class="btn btn-primary btn-sm"><i class="fas fa-arrow-right"></i> Go to My Profile</a>
  </div>

</div>
<script>
var PREF_KEY = 'logohub_notif_prefs_${ctx.role}';
var PREFS_DEFAULT = ${ctx.role === 'creator'
    ? `[
    { id:'content', label:'Content status changes (published, review, rejected)', on:true },
    { id:'earnings', label:'Earnings and payout updates', on:true },
    { id:'milestones', label:'Download milestones', on:true },
  ]`
    : `[
    { id:'usage', label:'Usage and quota alerts', on:true },
    { id:'keys', label:'API key expiration warnings', on:true },
    { id:'product', label:'New assets and product updates', on:false },
  ]`};

function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(PREF_KEY)) || PREFS_DEFAULT; }
  catch (e) { return PREFS_DEFAULT; }
}
function savePrefs(prefs) { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); }

function renderPrefs() {
  var prefs = loadPrefs();
  var host = document.getElementById('notifPrefs');
  host.innerHTML = prefs.map(function(p, i) {
    return '<div class="flex items-center justify-between py-2 border-b" style="border-color:var(--border)">' +
      '<span class="text-sm" style="color:var(--text)">' + p.label + '</span>' +
      '<div class="switch ' + (p.on ? 'on' : '') + '" onclick="togglePref(' + i + ')"><div class="knob"></div></div>' +
    '</div>';
  }).join('');
}
function togglePref(i) {
  var prefs = loadPrefs();
  prefs[i].on = !prefs[i].on;
  savePrefs(prefs);
  renderPrefs();
  LH.toast('success', 'Preference saved');
}

LH.guardRole(['${ctx.role}']).then(function(u) { if (u) renderPrefs(); });
</script>
`)}
`;
