import { HEAD, COMMON_JS } from './shared';

// ============================================================
// /login  — Login page
// ============================================================
export const loginPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login — LogoHub</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root {
      --bg: #0a0a0f;
      --surface: #111118;
      --panel: #16161f;
      --border: rgba(255,255,255,.06);
      --text: #f4f4f5;
      --text-soft: #a1a1aa;
      --text-mute: #71717a;
      --lilac: #b8a9e8;
      --lilac-glow: rgba(184,169,232,.15);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; }
    .input { width: 100%; padding: .75rem 1rem; background: var(--panel); border: 1px solid var(--border); border-radius: .75rem; color: var(--text); font-size: .875rem; outline: none; transition: all .2s; }
    .input:focus { border-color: var(--lilac); box-shadow: 0 0 0 3px var(--lilac-glow); }
    .btn { padding: .75rem 1.5rem; border-radius: .75rem; font-weight: 600; font-size: .875rem; border: none; cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: .5rem; justify-content: center; }
    .btn-primary { background: var(--lilac); color: #1a1a1a; }
    .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .btn-ghost { background: transparent; color: var(--text-soft); border: 1px solid var(--border); }
    .btn-ghost:hover { background: var(--panel); }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.25rem; }
    .toast { position: fixed; top: 1rem; right: 1rem; z-index: 9999; padding: 1rem 1.25rem; border-radius: .75rem; font-size: .875rem; display: flex; align-items: center; gap: .75rem; animation: slideIn .3s ease; max-width: 400px; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .toast-success { background: #065f46; color: #6ee7b7; border: 1px solid #059669; }
    .toast-error { background: #7f1d1d; color: #fca5a5; border: 1px solid #dc2626; }
    .link { color: var(--lilac); text-decoration: none; }
    .link:hover { text-decoration: underline; }
    .field-label { display: block; font-size: .75rem; font-weight: 600; margin-bottom: .35rem; color: var(--text-soft); text-transform: uppercase; letter-spacing: .05em; }
    .field-hint { font-size: .7rem; margin-top: .35rem; color: var(--text-mute); }
  </style>
</head>
<body class="w-full">
  <!-- Left: Brand -->
  <div class="hidden lg:flex flex-col justify-center p-16 w-[45%]" style="background:linear-gradient(135deg,#0a0a0f 0%,#111118 50%,rgba(184,169,232,.08) 100%)">
    <div class="max-w-md">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black" style="background:var(--lilac);color:#1a1a1a">L</div>
        <div><h1 class="text-2xl font-black" style="color:var(--text)">LogoHub</h1><p class="text-sm" style="color:var(--text-soft)">The World's Largest Visual Identity API</p></div>
      </div>
      <h2 class="text-3xl font-black mb-3" data-i18n="auth.welcome_back">Welcome back</h2>
      <p class="text-lg" style="color:var(--text-soft)" data-i18n="auth.access_platform">Access 50,000+ logos, icons, and visual assets.</p>
      <div class="grid grid-cols-2 gap-3 mt-8">
        <div class="p-4 rounded-xl" style="background:rgba(184,169,232,.06);border:1px solid rgba(184,169,232,.12)">
          <i class="fas fa-bolt text-xl mb-2" style="color:#b8a9e8"></i>
          <p class="text-sm font-semibold" data-i18n="auth.fast_api">Fast API</p>
          <p class="text-[11px]" style="color:var(--text-mute)" data-i18n="auth.fast_api.desc">Sub-20ms responses</p>
        </div>
        <div class="p-4 rounded-xl" style="background:rgba(78,205,196,.06);border:1px solid rgba(78,205,196,.12)">
          <i class="fas fa-shield-alt text-xl mb-2" style="color:#4ecdc4"></i>
          <p class="text-sm font-semibold" data-i18n="auth.secure">Secure</p>
          <p class="text-[11px]" style="color:var(--text-mute)" data-i18n="auth.secure.desc">API key auth</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Right: Login Form -->
  <div class="flex-1 flex items-center justify-center p-8">
    <div class="card p-8 w-full max-w-md" style="box-shadow:0 0 80px rgba(184,169,232,.04)">
      <div class="text-center mb-6 lg:hidden">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-3" style="background:var(--lilac);color:#1a1a1a">L</div>
        <h1 class="text-xl font-black">LogoHub</h1>
      </div>
      <h2 class="text-xl font-bold mb-1" data-i18n="auth.sign_in_btn">Sign in</h2>
      <p class="text-sm mb-6" style="color:var(--text-soft)" data-i18n="auth.credentials">Enter your credentials to continue</p>

      <!-- Quick Login Buttons — click fills credentials, does NOT auto-submit -->
      <div class="space-y-2 mb-4">
        <p class="text-[10px] uppercase tracking-wide font-semibold mb-2" style="color:var(--text-mute)">Quick fill demo accounts</p>
        <button data-email="admin@logohub.dev" onclick="quickLogin('admin@logohub.dev')" class="preset-btn btn btn-ghost w-full text-xs" style="justify-content:flex-start;padding:.65rem .85rem;border-color:rgba(184,169,232,.2);transition:all .2s">
          <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:rgba(184,169,232,.15);color:#b8a9e8"><i class="fas fa-shield-alt text-[12px]"></i></span>
          <div class="text-left flex-1 ml-2"><span class="font-semibold text-sm" style="color:var(--text)">Admin</span><span class="text-[10px] ml-1.5" style="color:var(--text-mute)">admin@logohub.dev</span></div>
          <i class="fas fa-chevron-right text-[9px]" style="color:var(--text-mute)"></i>
        </button>
        <button data-email="creator@logohub.dev" onclick="quickLogin('creator@logohub.dev')" class="preset-btn btn btn-ghost w-full text-xs" style="justify-content:flex-start;padding:.65rem .85rem;border-color:rgba(245,166,35,.2);transition:all .2s">
          <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:rgba(245,166,35,.12);color:#f5a623"><i class="fas fa-paint-brush text-[12px]"></i></span>
          <div class="text-left flex-1 ml-2"><span class="font-semibold text-sm" style="color:var(--text)">Creator</span><span class="text-[10px] ml-1.5" style="color:var(--text-mute)">creator@logohub.dev</span></div>
          <i class="fas fa-chevron-right text-[9px]" style="color:var(--text-mute)"></i>
        </button>
        <button data-email="consumer@logohub.dev" onclick="quickLogin('consumer@logohub.dev')" class="preset-btn btn btn-ghost w-full text-xs" style="justify-content:flex-start;padding:.65rem .85rem;border-color:rgba(78,205,196,.2);transition:all .2s">
          <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:rgba(78,205,196,.12);color:#4ecdc4"><i class="fas fa-user text-[12px]"></i></span>
          <div class="text-left flex-1 ml-2"><span class="font-semibold text-sm" style="color:var(--text)">Consumer</span><span class="text-[10px] ml-1.5" style="color:var(--text-mute)">consumer@logohub.dev</span></div>
          <i class="fas fa-chevron-right text-[9px]" style="color:var(--text-mute)"></i>
        </button>
      </div>

      <div class="flex items-center gap-3 mb-4">
        <div class="flex-1" style="border-top:1px solid var(--border)"></div>
        <span class="text-[10px]" style="color:var(--text-mute)">OR</span>
        <div class="flex-1" style="border-top:1px solid var(--border)"></div>
      </div>

      <form id="loginForm" class="space-y-4">
        <div>
          <label class="field-label">Email</label>
          <input type="email" class="input" id="loginEmail" placeholder="you@example.com" required autofocus>
        </div>
        <div>
          <label class="field-label">Password</label>
          <div style="position:relative">
            <input type="password" class="input" id="loginPassword" placeholder="••••••••" required>
            <button type="button" onclick="togglePassword('loginPassword')" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-mute);cursor:pointer"><i class="fas fa-eye"></i></button>
          </div>
          <p class="field-hint"><a href="/forgot-password" class="link" data-i18n="auth.forgot_password">Forgot password?</a></p>
        </div>
        <button type="submit" class="btn btn-primary w-full" id="loginBtn">
          <i class="fas fa-sign-in-alt"></i> Sign in
        </button>
      </form>

      <p class="text-sm text-center mt-4" style="color:var(--text-soft)">
        data-i18n="auth.no_account">Don't have an account? <a href="/register" class="link" data-i18n="auth.create_one">Create one</a>
      </p>
    </div>
  </div>

  <div id="toastContainer"></div>

  ${COMMON_JS}
  <script>
    var DEMO_PASSWORD = 'Demo@2026';
    function quickLogin(email) {
      document.getElementById('loginEmail').value = email;
      document.getElementById('loginPassword').value = DEMO_PASSWORD;
      // Flash green border
      var el = document.getElementById('loginEmail');
      el.style.borderColor = '#4ade80';
      el.style.boxShadow = '0 0 0 3px rgba(74,222,128,.18)';
      setTimeout(function(){ el.style.borderColor = ''; el.style.boxShadow = ''; }, 800);
      // Focus password so user just hits Enter
      document.getElementById('loginPassword').focus();
      // Highlight active preset
      document.querySelectorAll('.preset-btn').forEach(function(b){ b.style.background = ''; b.style.borderColor = ''; });
      var active = document.querySelector('.preset-btn[data-email="' + email + '"]');
      if (active) { active.style.background = 'rgba(184,169,232,.12)'; active.style.borderColor = 'rgba(184,169,232,.35)'; }
    }
    function togglePassword(id) {
      const el = document.getElementById(id);
      el.type = el.type === 'password' ? 'text' : 'password';
    }
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('loginBtn');
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
      try {
        const r = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'data-i18n="auth.login_failed">Login failed');
        localStorage.setItem('logohub_token', j.meta?.token || j.token || '');
        localStorage.setItem('logohub_user', JSON.stringify(j.data?.user || j.user || {}));
        showToast('success', 'Welcome back!', 'Redirecting...');
        const role = j.data?.user?.role || 'consumer';
        setTimeout(() => {
          if (role === 'admin') window.location.href = '/dashboard';
          else if (role === 'creator') window.location.href = '/dashboard/creator';
          else window.location.href = '/dashboard/consumer';
        }, 800);
      } catch (err) {
        showToast('error', 'Login failed', err.message);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign in';
      }
    });
    function showToast(type, title, msg) {
      const c = document.getElementById('toastContainer');
      if (!c) return;
      const d = document.createElement('div');
      d.className = 'toast toast-' + type;
      var icons = { success:'fa-check-circle', error:'fa-times-circle', info:'fa-info-circle' };
      var colors = { success:'#4ade80', error:'#ff6b6b', info:'#b8a9e8' };
      d.innerHTML = '<i class="fas '+icons[type]+'" style="color:'+colors[type]+'"></i><div><strong>'+title+'</strong>'+(msg?'<p class="text-sm mt-0.5" style="opacity:.8">'+msg+'</p>':'')+'</div>';
      c.appendChild(d);
      setTimeout(() => d.remove(), 4000);
    }
  </script>
</body>
</html>`;

// ============================================================
// /register  — Create Account page
// ============================================================
export const registerPage = () => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Account — LogoHub</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root {
      --bg: #0a0a0f;
      --surface: #111118;
      --panel: #16161f;
      --border: rgba(255,255,255,.06);
      --text: #f4f4f5;
      --text-soft: #a1a1aa;
      --text-mute: #71717a;
      --lilac: #b8a9e8;
      --lilac-glow: rgba(184,169,232,.15);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; }
    .input { width: 100%; padding: .75rem 1rem; background: var(--panel); border: 1px solid var(--border); border-radius: .75rem; color: var(--text); font-size: .875rem; outline: none; transition: all .2s; }
    .input:focus { border-color: var(--lilac); box-shadow: 0 0 0 3px var(--lilac-glow); }
    .select { width: 100%; padding: .75rem 1rem; background: var(--panel); border: 1px solid var(--border); border-radius: .75rem; color: var(--text); font-size: .875rem; outline: none; cursor: pointer; }
    .btn { padding: .75rem 1.5rem; border-radius: .75rem; font-weight: 600; font-size: .875rem; border: none; cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: .5rem; justify-content: center; }
    .btn-primary { background: var(--lilac); color: #1a1a1a; }
    .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 1.25rem; }
    .toast { position: fixed; top: 1rem; right: 1rem; z-index: 9999; padding: 1rem 1.25rem; border-radius: .75rem; font-size: .875rem; display: flex; align-items: center; gap: .75rem; animation: slideIn .3s ease; max-width: 400px; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .toast-success { background: #065f46; color: #6ee7b7; border: 1px solid #059669; }
    .toast-error { background: #7f1d1d; color: #fca5a5; border: 1px solid #dc2626; }
    .link { color: var(--lilac); text-decoration: none; }
    .link:hover { text-decoration: underline; }
    .field-label { display: block; font-size: .75rem; font-weight: 600; margin-bottom: .35rem; color: var(--text-soft); text-transform: uppercase; letter-spacing: .05em; }
    .field-hint { font-size: .7rem; margin-top: .35rem; color: var(--text-mute); }
  </style>
</head>
<body class="w-full">
  <!-- Left: Form -->
  <div class="flex-1 flex items-center justify-center p-8">
    <div class="card p-8 w-full max-w-md" style="box-shadow:0 0 80px rgba(184,169,232,.04)">
      <div class="text-center mb-6">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-3" style="background:var(--lilac);color:#1a1a1a">L</div>
        <h1 class="text-xl font-black">Create your account</h1>
        <p class="text-sm mt-1" style="color:var(--text-soft)">Join the world's largest visual identity API</p>
      </div>

      <form id="registerForm" class="space-y-4">
        <div>
          <label class="field-label">Full Name</label>
          <input type="text" class="input" id="regName" placeholder="Zana Acessórios" required>
        </div>
        <div>
          <label class="field-label">Email</label>
          <input type="email" class="input" id="regEmail" placeholder="you@example.com" required>
        </div>
        <div>
          <label class="field-label">Password</label>
          <div style="position:relative">
            <input type="password" class="input" id="regPassword" placeholder="Min. 8 characters" required minlength="8">
            <button type="button" onclick="togglePassword('regPassword')" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-mute);cursor:pointer"><i class="fas fa-eye"></i></button>
          </div>
          <p class="field-hint">At least 8 characters with letters, numbers & symbols</p>
        </div>
        <div>
          <label class="field-label">I want to</label>
          <select class="select" id="regRole">
            <option value="consumer">🔑 Consume APIs (Consumer)</option>
            <option value="creator">🎨 Upload & sell assets (Creator)</option>
          </select>
        </div>
        <label class="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" required style="accent-color:var(--lilac);margin-top:.2rem">
          <span class="text-xs" style="color:var(--text-soft)">I agree to the <a href="/terms" class="link" target="_blank">Terms of Service</a> and <a href="/privacy" class="link" target="_blank">Privacy Policy</a></span>
        </label>
        <button type="submit" class="btn btn-primary w-full" id="regBtn">
          <i class="fas fa-user-plus"></i> data-i18n="auth.register_btn">Create account
        </button>
      </form>

      <p class="text-sm text-center mt-4" style="color:var(--text-soft)">
        data-i18n="auth.have_account">Already have an account? <a href="/login" class="link">Sign in</a>
      </p>
    </div>
  </div>

  <!-- Right: Info -->
  <div class="hidden lg:flex flex-col justify-center p-16 w-[45%]" style="background:linear-gradient(135deg,rgba(184,169,232,.08) 0%,#111118 50%,#0a0a0f 100%)">
    <div class="max-w-md ml-auto">
      <h2 class="text-3xl font-black mb-3">Start building</h2>
      <p class="text-lg mb-8" style="color:var(--text-soft)">Everything you need to integrate visual identities into your app.</p>
      <div class="grid grid-cols-2 gap-3">
        <div class="p-4 rounded-xl" style="background:rgba(184,169,232,.06);border:1px solid rgba(184,169,232,.12)">
          <i class="fas fa-database text-xl mb-2" style="color:#b8a9e8"></i>
          <p class="text-sm font-semibold">50K+ Assets</p>
          <p class="text-[11px]" style="color:var(--text-mute)">Logos, icons, flags</p>
        </div>
        <div class="p-4 rounded-xl" style="background:rgba(245,166,35,.06);border:1px solid rgba(245,166,35,.12)">
          <i class="fas fa-dollar-sign text-xl mb-2" style="color:#f5a623"></i>
          <p class="text-sm font-semibold">Monetize</p>
          <p class="text-[11px]" style="color:var(--text-mute)">Earn as a Creator</p>
        </div>
        <div class="p-4 rounded-xl" style="background:rgba(74,222,128,.06);border:1px solid rgba(74,222,128,.12)">
          <i class="fas fa-rocket text-xl mb-2" style="color:#4ade80"></i>
          <p class="text-sm font-semibold">Free Tier</p>
          <p class="text-[11px]" style="color:var(--text-mute)">1,000 req/day</p>
        </div>
        <div class="p-4 rounded-xl" style="background:rgba(78,205,196,.06);border:1px solid rgba(78,205,196,.12)">
          <i class="fas fa-code text-xl mb-2" style="color:#4ecdc4"></i>
          <p class="text-sm font-semibold">REST API</p>
          <p class="text-[11px]" style="color:var(--text-mute)">Simple & fast</p>
        </div>
      </div>
    </div>
  </div>

  <div id="toastContainer"></div>

  ${COMMON_JS}
  <script>
    function togglePassword(id) {
      const el = document.getElementById(id);
      if (el) el.type = el.type === 'password' ? 'text' : 'password';
    }
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('regBtn');
      const name = (document.getElementById('regName')).value;
      const email = (document.getElementById('regEmail')).value;
      const password = (document.getElementById('regPassword')).value;
      const role = (document.getElementById('regRole')).value;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
      try {
        const r = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'data-i18n="auth.register_failed">Registration failed');
        showToast('success', 'Account created!', 'Redirecting to login...');
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      } catch (err) {
        showToast('error', 'Registration failed', err.message);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Create account';
      }
    });
    function showToast(type, title, msg) {
      const c = document.getElementById('toastContainer');
      if (!c) return;
      const d = document.createElement('div');
      d.className = 'toast toast-' + type;
      var icons = { success:'fa-check-circle', error:'fa-times-circle', info:'fa-info-circle' };
      var colors = { success:'#4ade80', error:'#ff6b6b', info:'#b8a9e8' };
      d.innerHTML = '<i class="fas '+icons[type]+'" style="color:'+colors[type]+'"></i><div><strong>'+title+'</strong>'+(msg?'<p class="text-sm mt-0.5" style="opacity:.8">'+msg+'</p>':'')+'</div>';
      c.appendChild(d);
      setTimeout(() => d.remove(), 4000);
    }
  </script>
</body>
</html>`;
