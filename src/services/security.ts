// Security service — 2FA (TOTP), sessions, trusted devices
// RFC 6238 TOTP implementation + session management

// ============================================================
// Types
// ============================================================
export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface Session {
  id: string;
  user_id: string;
  device_info: string;
  ip_address: string;
  location: string;
  user_agent: string;
  created_at: string;
  last_active_at: string;
}

export interface TrustedDevice {
  id: string;
  user_id: string;
  device_fingerprint: string;
  device_name: string;
  trusted_at: string;
  expires_at: string;
}

export interface SecurityLog {
  id: string;
  user_id: string;
  event: string;
  ip_address: string;
  details: string;
  created_at: string;
}

// ============================================================
// TOTP Implementation (RFC 6238)
// ============================================================

// Base32 encoding/decoding
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Decode(str: string): Uint8Array {
  str = str.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  const bits: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const val = BASE32_ALPHABET.indexOf(str[i]);
    if (val === -1) continue;
    bits.push(...val.toString(2).padStart(5, '0').split('').map(Number));
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8).join(''), 2);
  }
  return bytes;
}

function base32Encode(bytes: Uint8Array): string {
  let bits = '';
  for (let i = 0; i < bytes.length; i++) {
    bits += bytes[i].toString(2).padStart(8, '0');
  }
  let result = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, '0');
    result += BASE32_ALPHABET[parseInt(chunk, 2)];
  }
  return result;
}

// HMAC-SHA1 (simplified — in production use Web Crypto API or crypto-js)
async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  // Using Node.js crypto
  const crypto = await import('crypto');
  const hmac = crypto.createHmac('sha1', Buffer.from(key));
  hmac.update(Buffer.from(message));
  return new Uint8Array(hmac.digest());
}

function generateRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

// Dynamic truncation per RFC 4226
function dynamicTruncation(hmac: Uint8Array): number {
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return binary % 1000000;
}

// ============================================================
// Security Service API
// ============================================================
const totpSecrets: Map<string, { secret: string; backup_codes: string[] }> = new Map();
const sessions: Session[] = [];
const trustedDevices: TrustedDevice[] = [];
const securityLogs: SecurityLog[] = [];

export const security = {
  // --- Two-Factor Auth (TOTP) ---
  async generateTOTPSecret(userId: string, accountName: string): Promise<TwoFactorSetup> {
    const secretBytes = generateRandomBytes(20);
    const secret = base32Encode(secretBytes);
    const issuer = 'LogoHub';

    // Backup codes (8 codes, 8 chars each)
    const backupCodes = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('')
    );

    // QR code URL (otpauth://)
    const qrCodeUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

    totpSecrets.set(userId, { secret, backup_codes: backupCodes });

    await this.logSecurityEvent(userId, '2fa_secret_generated', '127.0.0.1', 'Generated new 2FA secret');

    return { secret, qrCodeUrl, backupCodes };
  },

  async verifyTOTP(userId: string, code: string): Promise<boolean> {
    const entry = totpSecrets.get(userId);
    if (!entry) return false;

    // Allow 1 step before/after for clock drift
    const now = Math.floor(Date.now() / 1000);
    const timeSteps = [Math.floor(now / 30), Math.floor(now / 30) - 1, Math.floor(now / 30) + 1];

    for (const step of timeSteps) {
      const counter = new Uint8Array(8);
      let val = step;
      for (let i = 7; i >= 0; i--) {
        counter[i] = val & 0xff;
        val = Math.floor(val / 256);
      }

      try {
        const secretBytes = base32Decode(entry.secret);
        const hmac = await hmacSha1(secretBytes, counter);
        const otp = dynamicTruncation(hmac);
        const otpStr = otp.toString().padStart(6, '0');

        if (otpStr === code) {
          await this.logSecurityEvent(userId, '2fa_verified', '127.0.0.1', 'TOTP code verified successfully');
          return true;
        }
      } catch {
        continue;
      }
    }
    return false;
  },

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const entry = totpSecrets.get(userId);
    if (!entry) return false;

    const idx = entry.backup_codes.indexOf(code.toUpperCase());
    if (idx === -1) return false;

    // Remove used backup code
    entry.backup_codes.splice(idx, 1);
    totpSecrets.set(userId, entry);

    await this.logSecurityEvent(userId, 'backup_code_used', '127.0.0.1', 'Backup code used for 2FA');
    return true;
  },

  async disable2FA(userId: string): Promise<boolean> {
    totpSecrets.delete(userId);
    await this.logSecurityEvent(userId, '2fa_disabled', '127.0.0.1', '2FA disabled');
    return true;
  },

  is2FAEnabled(userId: string): boolean {
    return totpSecrets.has(userId);
  },

  getBackupCodesRemaining(userId: string): number {
    return totpSecrets.get(userId)?.backup_codes.length || 0;
  },

  // --- Sessions ---
  listSessions(userId: string): Session[] {
    return sessions
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.last_active_at).getTime() - new Date(a.last_active_at).getTime());
  },

  createSession(userId: string, deviceInfo: string, ip: string, ua: string): Session {
    const session: Session = {
      id: 'sess-' + crypto.randomUUID().slice(0, 8),
      user_id: userId,
      device_info: deviceInfo,
      ip_address: ip,
      location: 'Unknown', // Would use GeoIP in production
      user_agent: ua,
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
    };
    sessions.push(session);
    return session;
  },

  touchSession(sessionId: string): void {
    const s = sessions.find(s => s.id === sessionId);
    if (s) s.last_active_at = new Date().toISOString();
  },

  terminateSession(sessionId: string, userId: string): boolean {
    const idx = sessions.findIndex(s => s.id === sessionId && s.user_id === userId);
    if (idx === -1) return false;
    sessions.splice(idx, 1);
    return true;
  },

  terminateAllOtherSessions(userId: string, currentSessionId: string): number {
    const toRemove = sessions.filter(s => s.user_id === userId && s.id !== currentSessionId);
    for (const s of toRemove) {
      const idx = sessions.findIndex(x => x.id === s.id);
      if (idx !== -1) sessions.splice(idx, 1);
    }
    return toRemove.length;
  },

  // --- Trusted Devices ---
  listTrustedDevices(userId: string): TrustedDevice[] {
    return trustedDevices.filter(d => d.user_id === userId && new Date(d.expires_at) > new Date());
  },

  addTrustedDevice(userId: string, fingerprint: string, name: string): TrustedDevice {
    const device: TrustedDevice = {
      id: 'dev-' + crypto.randomUUID().slice(0, 8),
      user_id: userId,
      device_fingerprint: fingerprint,
      device_name: name,
      trusted_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString(), // 30 days
    };
    trustedDevices.push(device);
    return device;
  },

  removeTrustedDevice(deviceId: string, userId: string): boolean {
    const idx = trustedDevices.findIndex(d => d.id === deviceId && d.user_id === userId);
    if (idx === -1) return false;
    trustedDevices.splice(idx, 1);
    return true;
  },

  isDeviceTrusted(userId: string, fingerprint: string): boolean {
    return trustedDevices.some(
      d => d.user_id === userId && d.device_fingerprint === fingerprint && new Date(d.expires_at) > new Date()
    );
  },

  // --- Security Log ---
  listSecurityLogs(userId: string, limit = 50): SecurityLog[] {
    return securityLogs
      .filter(l => l.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  async logSecurityEvent(userId: string, event: string, ip: string, details: string): Promise<void> {
    const log: SecurityLog = {
      id: 'seclog-' + crypto.randomUUID().slice(0, 8),
      user_id: userId,
      event,
      ip_address: ip,
      details,
      created_at: new Date().toISOString(),
    };
    securityLogs.push(log);
  },
};

export default security;
