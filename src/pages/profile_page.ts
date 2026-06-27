import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap } from './layout';

// ============================================================
// /dashboard/profile  — User Profile page
// ============================================================
export const profilePage = () => `${HEAD('My Profile — LogoHub', COMMON_JS)}
${shellWrap(sidebar('profile'), `
${topbar('My Profile', 'Manage your account, security, and preferences')}
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
let PROFILE_USER: any = null;

async function loadProfile() {
  try {
    const token = localStorage.getItem('logohub_token');
    if (!token) { window.location.href = '/login'; return; }
    const r = await fetch('/api/v1/auth/me', { headers: { Authorization: 'Bearer ' + token } });
    const j = await r.json();
    if (!r.ok) { window.location.href = '/login'; return; }
    PROFILE_USER = j.data || j.user || j;
    renderProfile();
  } catch (e) { LH.toast('error', 'Failed to load profile', (e as any).message); }
}

function renderProfile() {
  const u = PROFILE_USER;
  if (!u) return;
  (document.getElementById('profileName') as HTMLElement).textContent = u.name || '—';
  (document.getElementById('profileEmail') as HTMLElement).textContent = u.email || '—';
  (document.getElementById('profileRole') as HTMLElement).textContent = u.role || 'consumer';
  (document.getElementById('profilePlan') as HTMLElement).textContent = u.plan || 'free';

  const initials = (u.name || '?').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase();
  const initialsEl = document.getElementById('profileInitials');
  if (initialsEl) initialsEl.textContent = initials;

  if (u.avatar_url) {
    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
      avatar.innerHTML = '<img src="' + u.avatar_url + '" style="width:100%;height:100%;object-fit:cover">';
    }
  }

  (document.getElementById('pfName') as HTMLInputElement).value = u.name || '';
  (document.getElementById('pfEmail') as HTMLInputElement).value = u.email || '';
  (document.getElementById('pfCompany') as HTMLInputElement).value = u.company || '';
  (document.getElementById('pfWebsite') as HTMLInputElement).value = u.website || '';
  (document.getElementById('pfBio') as HTMLTextAreaElement).value = u.bio || '';
}

async function saveProfile() {
  const data: any = {
    name: (document.getElementById('pfName') as HTMLInputElement).value,
    email: (document.getElementById('pfEmail') as HTMLInputElement).value,
    company: (document.getElementById('pfCompany') as HTMLInputElement).value,
    website: (document.getElementById('pfWebsite') as HTMLInputElement).value,
    bio: (document.getElementById('pfBio') as HTMLTextAreaElement).value,
  };
  try {
    const token = localStorage.getItem('logohub_token');
    const r = await fetch('/api/v1/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify(data),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Failed');
    PROFILE_USER = j.data || j;
    renderProfile();
    LH.toast('success', 'Profile updated');
  } catch (e) { LH.toast('error', 'Save failed', (e as Error).message); }
}

async function changePassword() {
  const current = (document.getElementById('pfCurrentPass') as HTMLInputElement).value;
  const newPass = (document.getElementById('pfNewPass') as HTMLInputElement).value;
  const confirm = (document.getElementById('pfConfirmPass') as HTMLInputElement).value;
  
  if (!current || !newPass) return LH.toast('error', 'All fields are required');
  if (newPass.length < 8) return LH.toast('error', 'Password must be at least 8 characters');
  if (newPass !== confirm) return LH.toast('error', 'Passwords do not match');

  try {
    const token = localStorage.getItem('logohub_token');
    const r = await fetch('/api/v1/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ current_password: current, new_password: newPass }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Failed');
    (document.getElementById('pfCurrentPass') as HTMLInputElement).value = '';
    (document.getElementById('pfNewPass') as HTMLInputElement).value = '';
    (document.getElementById('pfConfirmPass') as HTMLInputElement).value = '';
    LH.toast('success', 'Password updated');
  } catch (e) { LH.toast('error', 'Password change failed', (e as Error).message); }
}

async function deleteAccount() {
  const yes = await LH.confirm({ title: 'Delete your account?', msg: 'All your data will be permanently removed. This cannot be undone.', danger: true });
  if (!yes) return;
  try {
    const token = localStorage.getItem('logohub_token');
    const r = await fetch('/api/v1/auth/me', { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) throw new Error('Failed');
    localStorage.clear();
    LH.toast('success', 'Account deleted');
    setTimeout(() => window.location.href = '/', 1500);
  } catch (e) { LH.toast('error', 'Delete failed', (e as Error).message); }
}

async function handleAvatarUpload(input: HTMLInputElement) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async function(e) {
    const url = e.target?.result as string;
    // Update preview
    const avatar = document.getElementById('profileAvatar');
    if (avatar) avatar.innerHTML = '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover">';
    // Save
    try {
      const token = localStorage.getItem('logohub_token');
      await fetch('/api/v1/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ avatar_url: url }),
      });
      LH.toast('success', 'Photo updated');
    } catch (e) { LH.toast('error', 'Failed to save photo', (e as Error).message); }
  };
  reader.readAsDataURL(file);
}

loadProfile();
</script>
`)}
`;
