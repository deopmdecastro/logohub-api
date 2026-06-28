// Shared head, css and helpers for all pages — premium SaaS look.
export const HEAD = (title: string, extraScripts: string = '') => `<!DOCTYPE html>
<html lang="en" class="" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<meta name="theme-color" content="#0a0a0f">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap">
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<script>
  // Theme bootstrap (before paint to avoid flash)
  (function(){
    var t = localStorage.getItem('theme') || 'dark';
    document.documentElement.dataset.theme = t;
    document.documentElement.classList.toggle('dark', t === 'dark');
  })();
  tailwind.config = {
    darkMode: ['class'],
    theme: {
      extend: {
        fontFamily: { sans: ['Inter','system-ui','sans-serif'], mono: ['JetBrains Mono','monospace'] },
        colors: {
          brand: { 50:'#f0f4ff', 100:'#e0e9ff', 400:'#818cf8', 500:'#6366f1', 600:'#4f46e5', 700:'#4338ca', 900:'#1e1b4b' },
          lilac: { 50:'#f3f1fb', 100:'#e7e3f6', 300:'#c8bdee', 500:'#b8a9e8', 700:'#7e6bc4' },
          ink: { 900:'#0a0a0f', 800:'#111118', 700:'#18181f', 600:'#23232b', 500:'#2f2f3a' },
        },
        animation: {
          'fade-up': 'fadeUp .35s ease-out',
          'fade-in': 'fadeIn .25s ease-out',
          'slide-in-right': 'slideInRight .25s ease-out',
          'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        },
        keyframes: {
          fadeUp: { '0%':{opacity:0,transform:'translateY(8px)'}, '100%':{opacity:1,transform:'translateY(0)'} },
          fadeIn: { '0%':{opacity:0}, '100%':{opacity:1} },
          slideInRight: { '0%':{opacity:0,transform:'translateX(24px)'}, '100%':{opacity:1,transform:'translateX(0)'} },
          pulseDot: { '0%,100%':{boxShadow:'0 0 0 0 rgba(74,222,128,.45)'}, '50%':{boxShadow:'0 0 0 6px rgba(74,222,128,0)'} },
        }
      }
    }
  }
</script>
<style>
  :root {
    --bg: #0a0a0f; --surface: #11111a; --panel: #15151f; --panel-2: #1a1a24;
    --border: rgba(255,255,255,.07); --border-strong: rgba(255,255,255,.12);
    --text: #f5f5f7; --text-soft: #a1a1aa; --text-mute: #71717a;
    --lilac: #b8a9e8; --amber: #f5a623; --teal: #4ecdc4; --coral: #ff6b6b; --green: #4ade80;
  }
  :root[data-theme="light"] {
    --bg: #fafaf8; --surface: #ffffff; --panel: #ffffff; --panel-2: #fafaf8;
    --border: #f0f0f0; --border-strong: #e5e5e5;
    --text: #1a1a1a; --text-soft: #6b6b6b; --text-mute: #9b9b9b;
  }
  * { box-sizing: border-box; }
  html, body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  body { background: var(--bg); color: var(--text); }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(184,169,232,.4); }

  /* Glass panels */
  .glass { background: var(--panel); border: 1px solid var(--border); }
  .glass-strong { background: var(--surface); border: 1px solid var(--border-strong); }
  .glass-hover { transition: all .2s ease; }
  .glass-hover:hover { background: var(--panel-2); border-color: rgba(184,169,232,.35); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }

  /* Premium gradient text */
  .gradient-text { background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .gradient-text-lilac { background: linear-gradient(135deg, #b8a9e8 0%, #f5a623 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-glow { background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(184,169,232,.22) 0%, transparent 60%); }
  .nav-blur { background: color-mix(in srgb, var(--bg) 78%, transparent); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }

  /* Buttons */
  .btn { display:inline-flex; align-items:center; gap:.5rem; font-weight:500; font-size:.875rem; padding:.5rem 1rem; border-radius:9999px; transition:all .2s ease; cursor:pointer; border: 1px solid transparent; }
  .btn-primary { background: var(--lilac); color:#1a1a1a; box-shadow: 0 2px 6px rgba(184,169,232,.25); }
  .btn-primary:hover { background:#a89ad8; box-shadow:0 4px 12px rgba(184,169,232,.4); transform: translateY(-1px); }
  .btn-ink { background:#1a1a1a; color:white; }
  .btn-ink:hover { background:#333; }
  .btn-ghost { background: var(--panel); border-color: var(--border-strong); color: var(--text); }
  .btn-ghost:hover { background: var(--panel-2); }
  .btn-danger { background: rgba(255,107,107,.1); color:#ff6b6b; border-color: rgba(255,107,107,.25); }
  .btn-danger:hover { background: rgba(255,107,107,.18); }
  .btn-sm { padding:.35rem .75rem; font-size:.78rem; }
  .btn-icon { width:34px; height:34px; padding:0; justify-content:center; }
  .btn-icon-sm { width:28px; height:28px; padding:0; justify-content:center; font-size:.7rem; }

  /* Pills / badges */
  .pill { display:inline-flex; align-items:center; gap:.3rem; font-size:.66rem; font-weight:600; padding:.15rem .55rem; border-radius:9999px; text-transform:uppercase; letter-spacing:.04em; border:1px solid transparent; }
  .pill-lilac { background:rgba(184,169,232,.15); color:#9d8de0; border-color:rgba(184,169,232,.3); }
  .pill-amber { background:rgba(245,166,35,.12); color:#f5a623; border-color:rgba(245,166,35,.28); }
  .pill-teal  { background:rgba(78,205,196,.12); color:#4ecdc4; border-color:rgba(78,205,196,.3); }
  .pill-coral { background:rgba(255,107,107,.12); color:#ff6b6b; border-color:rgba(255,107,107,.3); }
  .pill-green { background:rgba(74,222,128,.12); color:#4ade80; border-color:rgba(74,222,128,.3); }
  .pill-neutral { background: var(--panel-2); color: var(--text-soft); border-color: var(--border); }

  /* Inputs */
  .input, .select, .textarea { width:100%; padding:.6rem .9rem; font-size:.875rem; border-radius:.75rem; background: var(--surface); color: var(--text); border:1px solid var(--border-strong); transition: all .2s ease; outline:none; }
  .select {
    appearance: none; -webkit-appearance: none; -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23b8a9e8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right .75rem center;
    padding-right: 2.2rem; cursor: pointer;
  }
  .select option {
    background: var(--surface); color: var(--text); padding: .5rem .75rem;
  }
  .select option:checked { background: rgba(184,169,232,.15); color: #b8a9e8; }
  .select option:hover { background: var(--panel-2); }
  .input:focus, .select:focus, .textarea:focus { border-color:#b8a9e8; box-shadow: 0 0 0 3px rgba(184,169,232,.18); }
  .input::placeholder, .textarea::placeholder { color: var(--text-mute); }
  .input-pill { border-radius: 9999px; padding:.55rem 1rem .55rem 2.4rem; }
  .field-label { font-size: .68rem; font-weight: 600; color: var(--text-soft); text-transform: uppercase; letter-spacing: .05em; margin-bottom: .35rem; display: block; }
  .field-hint { font-size: .68rem; color: var(--text-mute); margin-top: .25rem; }

  /* Cards */
  .card { background: var(--panel); border:1px solid var(--border); border-radius:16px; transition: all .2s ease; }
  .card-hover:hover { border-color: var(--border-strong); box-shadow: 0 8px 24px rgba(0,0,0,.06); transform: translateY(-2px); }

  /* Sidebar */
  .sidebar-item { display:flex; align-items:center; gap:.6rem; padding:.55rem .85rem; border-radius:.75rem; font-size:.875rem; color: var(--text-soft); transition:all .15s ease; cursor:pointer; }
  .sidebar-item:hover { background: var(--panel-2); color: var(--text); }
  .sidebar-item.active { background: rgba(184,169,232,.12); color: var(--text); }
  .sidebar-item .ic { width:24px; height:24px; border-radius:.5rem; display:flex; align-items:center; justify-content:center; font-size:.66rem; }

  /* Tab nav */
  .tab-pill-group { display:inline-flex; gap:.15rem; padding:.2rem; background: var(--panel-2); border-radius:9999px; border:1px solid var(--border); }
  .tab-pill { padding:.4rem 1rem; font-size:.8rem; font-weight:500; border-radius:9999px; color: var(--text-soft); cursor:pointer; transition:all .2s ease; display:inline-flex; align-items:center; gap:.4rem; }
  .tab-pill.active { background: var(--surface); color: var(--text); box-shadow:0 1px 2px rgba(0,0,0,.06); }
  .tab-pill:hover:not(.active) { color: var(--text); }

  /* Tables */
  table.lh-table { width:100%; border-collapse:collapse; }
  table.lh-table th { text-align:left; font-size:.66rem; font-weight:600; color: var(--text-mute); text-transform:uppercase; letter-spacing:.04em; padding:.85rem 1rem; border-bottom:1px solid var(--border); }
  table.lh-table td { padding:.85rem 1rem; font-size:.85rem; border-bottom:1px solid var(--border); }
  table.lh-table tbody tr:last-child td { border-bottom:none; }
  table.lh-table tbody tr:hover { background: var(--panel-2); }

  /* Modal */
  .modal-overlay { position:fixed; inset:0; z-index:90; background: rgba(10,10,15,.55); backdrop-filter: blur(6px); display:flex; align-items:center; justify-content:center; padding:1rem; animation: fadeIn .18s ease-out; }
  .modal-box { background: var(--surface); border:1px solid var(--border-strong); border-radius:20px; max-width: 720px; width:100%; max-height: 90vh; overflow:hidden; display:flex; flex-direction:column; animation: fadeUp .22s ease-out; }
  .modal-head { padding: 1.1rem 1.4rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:1rem; }
  .modal-body { padding: 1.4rem; overflow-y:auto; }
  .modal-foot { padding: 1rem 1.4rem; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:flex-end; gap:.5rem; background: var(--panel-2); }

  /* Toasts */
  .toast { position: fixed; top:1rem; right:1rem; z-index:120; }
  .toast-item { display:flex; align-items:flex-start; gap:.75rem; padding:.85rem 1rem; border-radius:14px; min-width:280px; max-width:380px; background: var(--surface); border:1px solid var(--border-strong); box-shadow:0 10px 30px rgba(0,0,0,.18); animation: slideInRight .22s ease-out; margin-bottom:.5rem; }

  /* Drag & drop */
  .dropzone { border: 2px dashed var(--border-strong); border-radius:18px; padding: 2.2rem 1.2rem; text-align:center; transition:all .2s ease; background: var(--panel-2); }
  .dropzone.dragover { border-color:#b8a9e8; background: rgba(184,169,232,.06); }

  /* Logo card preview */
  .logo-thumb { width:64px; height:64px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:1.75rem; font-weight:800; }

  /* Skeleton */
  .skeleton { background: linear-gradient(90deg, var(--panel) 25%, var(--panel-2) 50%, var(--panel) 75%); background-size:200% 100%; animation: shimmer 1.2s linear infinite; border-radius: .75rem; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* Switch */
  .switch { position:relative; width:36px; height:20px; background: var(--border-strong); border-radius:9999px; cursor:pointer; transition: all .2s ease; }
  .switch.on { background: #b8a9e8; }
  .switch .knob { position:absolute; top:2px; left:2px; width:16px; height:16px; background:white; border-radius:9999px; transition:all .2s ease; }
  .switch.on .knob { left:18px; }

  /* Color swatch */
  .color-swatch { width:22px; height:22px; border-radius:9999px; border:2px solid var(--surface); box-shadow: 0 0 0 1px var(--border-strong); }
  .color-input { display:flex; align-items:center; gap:.5rem; }
  .color-input input[type="color"] { width:42px; height:38px; border-radius:.6rem; padding:0; border:1px solid var(--border-strong); cursor:pointer; background:transparent; }

  /* Responsive helpers */
  @media (max-width: 1023px) { .lg-show { display:none !important; } .mobile-only { display:block !important; } }
  @media (min-width: 1024px) { .mobile-only { display:none !important; } }

  /* Code block */
  pre.code-block { background:#0a0a0f; border:1px solid var(--border); border-radius:14px; padding:1rem 1.2rem; font-family:'JetBrains Mono', monospace; font-size:.78rem; color:#cbd5e1; overflow-x:auto; }

  /* Hide scrollbar utility for tab strips */
  .no-scrollbar::-webkit-scrollbar { display:none; }
  .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }

  /* Empty state */
  .empty-state { text-align:center; padding: 3rem 1rem; color: var(--text-mute); }
</style>
${extraScripts}
</head>`;

// Shared toolkit script — toasts, theme toggle, fetch helpers, format helpers
export const COMMON_JS = `
<script>
window.LH = window.LH || {};
LH.fmt = (n) => Number(n||0).toLocaleString();
LH.rel = (s) => {
  const d = new Date(s); if (isNaN(d.getTime())) return '—';
  const m = Math.floor((Date.now() - d.getTime())/60000);
  if (m < 1) return 'just now'; if (m < 60) return m+'m ago';
  const h = Math.floor(m/60); if (h < 24) return h+'h ago';
  const day = Math.floor(h/24); if (day < 30) return day+'d ago';
  return d.toLocaleDateString();
};
LH.toast = (kind, title, msg) => {
  let host = document.getElementById('lh-toast-host');
  if (!host) { host = document.createElement('div'); host.id='lh-toast-host'; host.className='toast'; document.body.appendChild(host); }
  const c = kind==='success'?'#4ade80':kind==='error'?'#ff6b6b':'#b8a9e8';
  const icon = kind==='success'?'check-circle':kind==='error'?'exclamation-circle':'sparkles';
  const div = document.createElement('div');
  div.className='toast-item';
  div.innerHTML = '<div style="width:34px;height:34px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:'+c+'22;color:'+c+';flex-shrink:0;"><i class="fas fa-'+icon+'"></i></div>' +
                  '<div style="flex:1;min-width:0;"><div style="font-size:.85rem;font-weight:600;color:var(--text)">'+title+'</div>'+ (msg?'<div style="font-size:.7rem;color:var(--text-mute);margin-top:2px">'+msg+'</div>':'') +'</div>';
  host.appendChild(div);
  setTimeout(()=>{ div.style.opacity='0'; div.style.transform='translateX(20px)'; div.style.transition='all .2s'; setTimeout(()=>div.remove(),200); }, 3800);
};
LH.confirm = (opts) => new Promise(res => {
  const o = document.createElement('div'); o.className='modal-overlay';
  o.innerHTML = '<div class="modal-box" style="max-width:420px"><div class="modal-head"><div style="display:flex;align-items:center;gap:.7rem;"><div style="width:36px;height:36px;border-radius:12px;background:'+(opts.danger?'#ff6b6b22':'#b8a9e822')+';color:'+(opts.danger?'#ff6b6b':'#b8a9e8')+';display:flex;align-items:center;justify-content:center;"><i class="fas fa-'+(opts.danger?'exclamation-triangle':'info-circle')+'"></i></div><div><div style="font-weight:700;font-size:.95rem;">'+opts.title+'</div>'+(opts.msg?'<div style="font-size:.75rem;color:var(--text-soft);margin-top:2px;">'+opts.msg+'</div>':'')+'</div></div></div><div class="modal-foot"><button class="btn btn-ghost btn-sm" data-act="no">Cancel</button><button class="btn '+(opts.danger?'btn-danger':'btn-primary')+' btn-sm" data-act="yes">'+(opts.yes||'Confirm')+'</button></div></div>';
  document.body.appendChild(o);
  const close = (v) => { o.remove(); res(v); };
  o.addEventListener('click', (e) => { if (e.target===o) close(false); const a = e.target.closest('[data-act]'); if (a) close(a.dataset.act==='yes'); });
});
LH.openModal = (innerHtml) => {
  const o = document.createElement('div'); o.className='modal-overlay';
  o.innerHTML = innerHtml; document.body.appendChild(o);
  o.addEventListener('click', (e) => { if (e.target===o || e.target.closest('[data-close]')) o.remove(); });
  return o;
};
LH.toggleTheme = () => {
  const cur = document.documentElement.dataset.theme || 'dark';
  const next = cur==='dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  document.documentElement.classList.toggle('dark', next==='dark');
  localStorage.setItem('theme', next);
  const btn = document.getElementById('themeBtn'); if (btn) btn.innerHTML = next==='dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};
LH.copy = async (t) => { try { await navigator.clipboard.writeText(t); LH.toast('success','Copied to clipboard'); } catch { LH.toast('error','Copy failed'); } };
LH.api = async (path, opts={}) => {
  const r = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!r.ok) throw new Error((await r.json().catch(()=>({}))).error || r.statusText);
  return r.json();
};
LH.extractPalette = (file) => new Promise((res) => {
  const img = new Image(); img.crossOrigin='anonymous';
  img.onload = () => {
    const c = document.createElement('canvas'); const size=48; c.width=size; c.height=size;
    const ctx = c.getContext('2d'); ctx.drawImage(img,0,0,size,size);
    const px = ctx.getImageData(0,0,size,size).data;
    const buckets = {};
    for (let i=0;i<px.length;i+=4) {
      if (px[i+3]<128) continue;
      const r = Math.round(px[i]/32)*32, g = Math.round(px[i+1]/32)*32, b = Math.round(px[i+2]/32)*32;
      const sum = r+g+b; if (sum>720 || sum<40) continue;
      const k = r+','+g+','+b; buckets[k] = (buckets[k]||0)+1;
    }
    const sorted = Object.entries(buckets).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const hex = sorted.map(([k]) => { const [r,g,b]=k.split(',').map(Number); return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase(); });
    res(hex);
  };
  img.onerror = () => res([]);
  img.src = URL.createObjectURL(file);
});
LH.fileToDataUrl = (f) => new Promise((res,rej) => { const r = new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(f); });
LH.slugify = (s) => String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

LH.authHeader = () => {
  var t = localStorage.getItem('logohub_token');
  return t ? { 'Authorization': 'Bearer ' + t } : {};
};

LH.loadUser = async () => {
  try {
    var r = await fetch('/api/v1/auth/me', { headers: LH.authHeader() });
    if (!r.ok) return null;
    var data = await r.json();
    var u = data.data || {};
    window.__USER = u;
    // Update avatar
    var initials = (u.name || '?').split(' ').map(function(p){return (p||'')[0];}).slice(0,2).join('').toUpperCase();
    var el = document.getElementById('avatarInitials');
    if (el) el.textContent = initials;
    var mel = document.getElementById('menuInitials');
    if (mel) mel.textContent = initials;
    var mn = document.getElementById('menuName');
    if (mn) mn.textContent = u.name || 'User';
    var me = document.getElementById('menuEmail');
    if (me) me.textContent = u.email || '';
    var mr = document.getElementById('menuRole');
    if (mr) { mr.textContent = u.role || '—'; mr.className = 'pill ' + ((u.role==='admin')?'pill-lilac':(u.role==='creator')?'pill-amber':'pill-teal'); }
    var mp = document.getElementById('menuPlan');
    if (mp) { mp.textContent = u.plan || '—'; mp.className = 'pill ' + ((u.plan==='business')?'pill-lilac':(u.plan==='pro')?'pill-teal':(u.plan==='enterprise')?'pill-amber':'pill-neutral'); }
    return u;
  } catch(e) { return null; }
};

LH.toggleUserMenu = function() {
  var m = document.getElementById('userMenu');
  if (!m) return;
  var isOpen = m.style.display === 'block';
  m.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    LH.loadUser();
    // Close on outside click
    setTimeout(function() {
      document.addEventListener('click', function closeMenu(e) {
        var dd = document.getElementById('avatarDropdown');
        if (dd && !dd.contains(e.target)) {
          m.style.display = 'none';
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 50);
  }
};

LH.logout = function() {
  localStorage.removeItem('logohub_token');
  fetch('/api/v1/auth/logout', { method: 'POST', headers: LH.authHeader() }).catch(function(){});
  window.location.href = '/login';
};

LH.loadNotifUnread = async function() {
  try {
    var r = await fetch('/api/v1/notifications/unread-count', { headers: LH.authHeader() });
    var data = await r.json();
    var count = (data.data && data.data.unread) || 0;
    var badge = document.getElementById('notifBadge');
    if (badge) {
      if (count > 0) {
        badge.style.display = 'flex';
        badge.textContent = count > 99 ? '99+' : count;
      } else {
        badge.style.display = 'none';
      }
    }
    window.NOTIF_UNREAD = count;
    return count;
  } catch(e) { return 0; }
};

// On page load — fetch unread count + user
(function() {
  LH.loadNotifUnread();
  // Only load user if we have a token (not on login/register pages)
  if (localStorage.getItem('logohub_token')) {
    LH.loadUser();
  }
})();

// Shared image upload helpers for Logo & Favicon (used in settings, team, users, billing pages)
LH.handleLogoUpload = function(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'contain';
    const preview = document.getElementById('logoPreview');
    if (preview) {
      preview.innerHTML = '';
      preview.appendChild(img);
    }
    if (typeof saveSetting === 'function') saveSetting('brand_logo_url', e.target.result);
    LH.toast('success', 'Logo updated');
  };
  reader.readAsDataURL(file);
};

LH.handleFaviconUpload = function(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'contain';
    const preview = document.getElementById('faviconPreview');
    if (preview) {
      preview.innerHTML = '';
      preview.appendChild(img);
    }
    if (typeof saveSetting === 'function') saveSetting('brand_favicon_url', e.target.result);
    LH.toast('success', 'Favicon updated');
  };
  reader.readAsDataURL(file);
};

</script>
`;
