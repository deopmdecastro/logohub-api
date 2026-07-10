import { HEAD, COMMON_JS } from './shared';
import { ctxSidebar, topbar, shellWrap, PageCtx, ADMIN_CTX } from './layout';

// ============================================================
// /dashboard/profile · /dashboard/creator/profile · /dashboard/consumer/profile
// — User Profile page, scoped to the active role's environment.
// ============================================================
export const profilePage = (ctx: PageCtx = ADMIN_CTX) => `${HEAD('My Profile — LogoHub', COMMON_JS)}
${shellWrap(ctxSidebar(ctx, 'profile'), `
${topbar('My Profile', 'Manage your account, security, and preferences', ctx)}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-6 animate-fade-up">
  
  <!-- Profile Header -->
  <div class="card p-6">
    <div class="flex flex-col sm:flex-row items-start gap-6">
      <div style="position:relative;cursor:pointer" onclick="document.getElementById('profileAvatarInput').click()">
        <div id="profileAvatar" style="width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,#b8a9e8,#f5a623);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:#1a1a1a;overflow:hidden">
          <span id="profileInitials">?</span>
        </div>
        <div style="position:absolute;bottom:0;right:0;width:28px;height:28px;border-radius:50%;background:var(--lilac);display:flex;align-items:center;justify-content:center;font-size:12px;color:#1a1a1a;border:3px solid var(--surface)"><i class="fas fa-camera"></i></div>
        <input type="file" id="profileAvatarInput" accept="image/*" class="hidden" onchange="handleAvatarUpload(this)">
      </div>
      <div class="flex-1">
        <h2 class="text-xl font-bold" style="color:var(--text)" id="profileName">—</h2>
        <p class="text-sm mb-2" style="color:var(--text-soft)" id="profileEmail">—</p>
        <span class="pill pill-lilac" id="profileRole">—</span>
        <span class="pill" style="background:rgba(78,205,196,.1);color:#4ecdc4;border-color:rgba(78,205,196,.3);margin-left:.5rem" id="profilePlan">—</span>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- General Info -->
    <div class="card p-6 lg:col-span-2 space-y-4">
      <h3 class="text-sm font-semibold flex items-center gap-2" style="color:var(--text)">
        <i class="fas fa-user-edit text-[#b8a9e8]"></i> General Info
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label class="field-label">Full Name</label><input class="input" id="pfName"></div>
        <div><label class="field-label">Email</label><input class="input" id="pfEmail" type="email"></div>
        <div><label class="field-label">Company</label><input class="input" id="pfCompany" placeholder="Optional"></div>
        <div><label class="field-label">Website</label><input class="input" id="pfWebsite" placeholder="https://" type="url"></div>
      </div>
      <div>
        <label class="field-label">Bio</label>
        <textarea class="textarea" id="pfBio" rows="3" placeholder="Tell us about yourself..."></textarea>
      </div>
      <button class="btn btn-primary" onclick="saveProfile()"><i class="fas fa-save"></i> Save changes</button>
    </div>

    <!-- Security -->
    <div class="space-y-6">
      <div class="card p-6 space-y-4">
        <h3 class="text-sm font-semibold flex items-center gap-2" style="color:var(--text)">
          <i class="fas fa-lock text-[#ff6b6b]"></i> Change Password
        </h3>
        <div>
          <label class="field-label">Current Password</label>
          <input type="password" class="input" id="pfCurrentPass" placeholder="Current password">
        </div>
        <div>
          <label class="field-label">New Password</label>
          <input type="password" class="input" id="pfNewPass" placeholder="Min. 8 characters">
        </div>
        <div>
          <label class="field-label">Confirm New Password</label>
          <input type="password" class="input" id="pfConfirmPass" placeholder="Repeat new password">
        </div>
        <button class="btn btn-danger" onclick="changePassword()"><i class="fas fa-key"></i> Update password</button>
      </div>

      <!-- Danger Zone -->
      <div class="card p-6" style="border-color:rgba(255,107,107,.2)">
        <h3 class="text-sm font-semibold flex items-center gap-2" style="color:#ff6b6b">
          <i class="fas fa-exclamation-triangle"></i> Danger Zone
        </h3>
        <p class="text-[11px] mb-4" style="color:var(--text-mute)">Once you delete your account, there is no going back.</p>
        <button class="btn btn-danger" onclick="deleteAccount()"><i class="fas fa-trash"></i> Delete my account</button>
      </div>
    </div>
  </div>
</div>

<script>
var PROFILE_USER = null;

async function loadProfile() {
  var u = await LH.guardRole(['${ctx.role}']);
  if (!u) return;
  try {
    var r = await LH.api('/api/v1/auth/me');
    PROFILE_USER = r.data || r.user || r;
    renderProfile();
  } catch(e) {
    LH.toast('error', 'Session expired', 'Please log in again.');
    localStorage.removeItem('logohub_token');
    setTimeout(function(){ window.location.href = '/login'; }, 1500);
  }
}

function renderProfile() {
  var u = PROFILE_USER;
  if (!u) return;
  document.getElementById('profileName').textContent = u.name || '—';
  document.getElementById('profileEmail').textContent = u.email || '—';
  document.getElementById('profileRole').textContent = u.role || 'consumer';
  document.getElementById('profilePlan').textContent = u.plan || 'free';

  var parts = (u.name || '?').split(' ');
  var initials = parts.map(function(p){ return p[0]; }).slice(0, 2).join('').toUpperCase();
  document.getElementById('profileInitials').textContent = initials;

  if (u.avatar_url) {
    document.getElementById('profileAvatar').innerHTML = '<img src="'+u.avatar_url+'" style="width:100%;height:100%;object-fit:cover">';
  }

  document.getElementById('pfName').value = u.name || '';
  document.getElementById('pfEmail').value = u.email || '';
  document.getElementById('pfCompany').value = u.company || '';
  document.getElementById('pfWebsite').value = u.website || '';
  document.getElementById('pfBio').value = u.bio || '';
}

async function saveProfile() {
  try {
    var data = {
      name: document.getElementById('pfName').value,
      email: document.getElementById('pfEmail').value,
      company: document.getElementById('pfCompany').value,
      website: document.getElementById('pfWebsite').value,
      bio: document.getElementById('pfBio').value
    };
    var r = await LH.api('/api/v1/auth/me', { method: 'PATCH', body: JSON.stringify(data) });
    PROFILE_USER = r.data || r;
    renderProfile();
    LH.toast('success', 'Profile updated');
  } catch(e) { LH.toast('error', 'Save failed', e.message); }
}

async function changePassword() {
  var cur = document.getElementById('pfCurrentPass').value;
  var newP = document.getElementById('pfNewPass').value;
  var conf = document.getElementById('pfConfirmPass').value;
  
  if (!cur || !newP) return LH.toast('error', 'All fields are required');
  if (newP.length < 8) return LH.toast('error', 'Password must be at least 8 characters');
  if (newP !== conf) return LH.toast('error', 'Passwords do not match');

  try {
    await LH.api('/api/v1/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: cur, new_password: newP })
    });
    document.getElementById('pfCurrentPass').value = '';
    document.getElementById('pfNewPass').value = '';
    document.getElementById('pfConfirmPass').value = '';
    LH.toast('success', 'Password updated');
  } catch(e) { LH.toast('error', 'Password change failed', e.message); }
}

async function deleteAccount() {
  var yes = await LH.confirm({ title: 'Delete your account?', msg: 'All your data will be permanently removed. This cannot be undone.', danger: true });
  if (!yes) return;
  try {
    await LH.api('/api/v1/auth/me', { method: 'DELETE' });
    localStorage.clear();
    LH.toast('success', 'Account deleted');
    setTimeout(function(){ window.location.href = '/'; }, 1500);
  } catch(e) { LH.toast('error', 'Delete failed', e.message); }
}

function handleAvatarUpload(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = async function(e) {
    var url = e.target.result;
    document.getElementById('profileAvatar').innerHTML = '<img src="'+url+'" style="width:100%;height:100%;object-fit:cover">';
    try {
      await LH.api('/api/v1/auth/me', { method: 'PATCH', body: JSON.stringify({ avatar_url: url }) });
      LH.toast('success', 'Photo updated');
    } catch(err) { LH.toast('error', 'Failed to save photo', err.message); }
  };
  reader.readAsDataURL(file);
}

loadProfile();
</script>
`)}
`;