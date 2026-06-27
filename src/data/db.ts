// Database client — PostgreSQL via HTTP-compatible REST proxy
// No direct pg dependency; uses fetch() to talk to a DB proxy
// In dev: falls back to in-memory store

// Check if DB is available via fetch to a DB proxy
let dbAvailable = false;
export async function checkDbConnection(): Promise<boolean> {
  try {
    const dbUrl = getDbUrl();
    if (!dbUrl) return false;
    // Test connection
    const r = await fetch(dbUrl + '/health');
    dbAvailable = r.ok;
    return r.ok;
  } catch {
    dbAvailable = false;
    return false;
  }
}

function getDbUrl(): string {
  return (globalThis as any).process?.env?.DB_PROXY_URL || '';
}

async function query(sql: string, params?: any[]): Promise<{ rows: any[]; rowCount?: number }> {
  const dbUrl = getDbUrl();
  if (!dbUrl) return { rows: [] };
  try {
    const r = await fetch(dbUrl + '/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params }),
    });
    if (!r.ok) return { rows: [] };
    return await r.json();
  } catch {
    return { rows: [] };
  }
}

// Stubs — used when DB is not available
function q(sql: string, params?: any[]) {
  if (!dbAvailable || !getDbUrl()) return { rows: [] };
  return query(sql, params);
}

// ============================================================
// USERS
// ============================================================
export async function findUserByEmail(email: string) {
  const { rows } = await q('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  return rows[0] || null;
}
export async function findUserById(id: string) {
  const { rows } = await q('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}
export async function createUser(data: any) {
  const { rows } = await q(
    'INSERT INTO users (name, email, password, role, plan) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [data.name, data.email.toLowerCase(), data.password, data.role||'consumer', data.plan||'free']
  );
  return rows[0] || null;
}
export async function updateUser(id: string, data: any) {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  const allowed = ['name','email','role','plan','status','avatar_url','bio','website','company','password','earnings_balance','requests_today'];
  for (const [k, v] of Object.entries(data)) {
    if (allowed.includes(k) && v !== undefined) {
      fields.push(`${k} = $${idx}`);
      values.push(k === 'email' ? String(v).toLowerCase() : v);
      idx++;
    }
  }
  if (!fields.length) return null;
  fields.push('updated_at = NOW()');
  values.push(id);
  const { rows } = await q(`UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
  return rows[0] || null;
}
export async function deleteUser(id: string) {
  const { rowCount } = await q('DELETE FROM users WHERE id = $1', [id]);
  return (rowCount || 0) > 0;
}
export async function listUsers(filters?: any) {
  let sql = 'SELECT * FROM users WHERE 1=1';
  const vals: any[] = [];
  let i = 1;
  if (filters?.role) { sql += ` AND role = $${i}`; vals.push(filters.role); i++; }
  if (filters?.plan) { sql += ` AND plan = $${i}`; vals.push(filters.plan); i++; }
  if (filters?.status) { sql += ` AND status = $${i}`; vals.push(filters.status); i++; }
  sql += ' ORDER BY created_at DESC LIMIT 100';
  const { rows } = await q(sql, vals);
  return rows;
}

// ============================================================
// API KEYS
// ============================================================
export async function findApiKey(key: string) {
  const { rows } = await q('SELECT * FROM api_keys WHERE key = $1', [key]);
  return rows[0] || null;
}
export async function listApiKeys(userId?: string) {
  const { rows } = await q(
    userId ? 'SELECT * FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC' : 'SELECT * FROM api_keys ORDER BY created_at DESC',
    userId ? [userId] : []
  );
  return rows;
}
export async function createApiKey(data: any) {
  const { rows } = await q(
    'INSERT INTO api_keys (user_id, name, key, prefix, permissions, tags) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [data.user_id||null, data.name, data.key, data.prefix, JSON.stringify(data.permissions||[]), JSON.stringify(data.tags||[])]
  );
  return rows[0] || null;
}
export async function updateApiKey(id: string, data: any) {
  const fields: string[] = [];
  const vals: any[] = [];
  let idx = 1;
  for (const [k, v] of Object.entries(data)) {
    if (['name','status','requests','last_used','expires_at','plan_override','permissions','tags'].includes(k) && v !== undefined) {
      fields.push(`${k} = $${idx}`);
      vals.push(['permissions','tags'].includes(k) ? JSON.stringify(v) : v);
      idx++;
    }
  }
  if (!fields.length) return null;
  fields.push('updated_at = NOW()');
  vals.push(id);
  const { rows } = await q(`UPDATE api_keys SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, vals);
  return rows[0] || null;
}
export async function deleteApiKey(id: string) {
  const { rowCount } = await q('DELETE FROM api_keys WHERE id = $1', [id]);
  return (rowCount || 0) > 0;
}

// ============================================================
// CONTENT
// ============================================================
export async function listContent(filters?: any) {
  let sql = 'SELECT * FROM content WHERE 1=1';
  const vals: any[] = [];
  let i = 1;
  if (filters?.category) { sql += ` AND category = $${i}`; vals.push(filters.category); i++; }
  if (filters?.status) { sql += ` AND status = $${i}`; vals.push(filters.status); i++; }
  if (filters?.ownerId) { sql += ` AND owner_id = $${i}`; vals.push(filters.ownerId); i++; }
  if (filters?.q) { sql += ` AND (LOWER(name) LIKE $${i} OR LOWER(slug) LIKE $${i})`; vals.push('%'+filters.q.toLowerCase()+'%'); i++; }
  sql += ' ORDER BY created_at DESC LIMIT 200';
  const { rows } = await q(sql, vals);
  return rows;
}
export async function getContentBySlug(slug: string) { const { rows } = await q('SELECT * FROM content WHERE slug = $1', [slug]); return rows[0] || null; }
export async function getContentById(id: string) { const { rows } = await q('SELECT * FROM content WHERE id = $1', [id]); return rows[0] || null; }
export async function createContent(data: any) {
  const cols = ['name','slug','description','category','status','owner_id','tags'];
  const vals: any[] = [data.name, data.slug, data.description||'', data.category||'', data.status||'draft', data.owner_id||null, JSON.stringify(data.tags||[])];
  const placeholders = cols.map((_,i) => '$'+(i+1)).join(',');
  const { rows } = await q(`INSERT INTO content (${cols.join(',')}) VALUES (${placeholders}) RETURNING *`, vals);
  return rows[0] || null;
}
export async function updateContent(id: string, data: any) {
  const fields: string[] = [];
  const vals: any[] = [];
  let idx = 1;
  const allowed = ['name','slug','description','category','status','verified','owner_id','tags'];
  for (const k of allowed) {
    if (k in data) {
      fields.push(`${k} = $${idx}`);
      vals.push(k === 'tags' ? JSON.stringify(data[k]) : data[k]);
      idx++;
    }
  }
  if (!fields.length) return null;
  fields.push('updated_at = NOW()');
  vals.push(id);
  const { rows } = await q(`UPDATE content SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, vals);
  return rows[0] || null;
}
export async function deleteContent(id: string) {
  const { rowCount } = await q('DELETE FROM content WHERE id = $1', [id]);
  return (rowCount || 0) > 0;
}

// ============================================================
// NOTIFICATIONS
// ============================================================
export async function listNotifications(filters?: any) {
  let sql = 'SELECT * FROM notifications WHERE 1=1';
  const vals: any[] = [];
  let i = 1;
  if (filters?.userId) { sql += ` AND (user_id = $${i} OR user_id IS NULL)`; vals.push(filters.userId); i++; }
  if (filters?.role) { sql += ` AND (role = $${i} OR role IS NULL)`; vals.push(filters.role); i++; }
  if (filters?.unread) { sql += ' AND read = FALSE'; }
  sql += ' ORDER BY created_at DESC LIMIT ' + (filters?.limit || 100);
  const { rows } = await q(sql, vals);
  return rows;
}
export async function createNotification(data: any) {
  const { rows } = await q(
    'INSERT INTO notifications (type, title, message, user_id, role, link) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [data.type||'info', data.title, data.message||'', data.user_id||null, data.role||null, data.link||null]
  );
  return rows[0] || null;
}
export async function markNotificationRead(id: number) {
  const { rows } = await q('UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING *', [id]);
  return rows[0] || null;
}
export async function markAllNotificationsRead(userId?: string) {
  await q(userId ? 'UPDATE notifications SET read = TRUE WHERE (user_id = $1 OR user_id IS NULL)' : 'UPDATE notifications SET read = TRUE', userId ? [userId] : []);
}
export async function deleteNotification(id: number) {
  const { rowCount } = await q('DELETE FROM notifications WHERE id = $1', [id]);
  return (rowCount || 0) > 0;
}
export async function getUnreadCount(userId?: string) {
  const [r1, r2] = await Promise.all([
    q(userId ? 'SELECT COUNT(*) as c FROM notifications WHERE read = FALSE AND (user_id = $1 OR user_id IS NULL)' : 'SELECT COUNT(*) as c FROM notifications WHERE read = FALSE', userId ? [userId] : []),
    q('SELECT COUNT(*) as c FROM notifications'),
  ]);
  return { unread: parseInt(r1.rows[0]?.c || '0'), total: parseInt(r2.rows[0]?.c || '0') };
}

// ============================================================
// SETTINGS
// ============================================================
export async function listSettings(group?: string) {
  const { rows } = await q(group ? 'SELECT * FROM settings WHERE group_name = $1 ORDER BY id' : 'SELECT * FROM settings ORDER BY group_name, id', group ? [group] : []);
  return rows;
}
export async function getSetting(key: string) {
  const { rows } = await q('SELECT * FROM settings WHERE key = $1', [key]);
  return rows[0] || null;
}
export async function updateSetting(key: string, value: string) {
  const { rows } = await q('UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2 RETURNING *', [value, key]);
  return rows[0] || null;
}

// ============================================================
// TEAM
// ============================================================
export async function listTeam() { const { rows } = await q('SELECT * FROM team_members ORDER BY created_at DESC'); return rows; }
export async function saveTeamMember(data: any) {
  if (data.id) {
    const { rows } = await q('UPDATE team_members SET name=$1, email=$2, role=$3, plan=$4, status=$5, updated_at=NOW() WHERE id=$6 RETURNING *', [data.name, data.email, data.role, data.plan, data.status, data.id]);
    return rows[0];
  }
  const { rows } = await q('INSERT INTO team_members (name, email, role, plan, status) VALUES ($1,$2,$3,$4,$5) RETURNING *', [data.name, data.email, data.role||'viewer', data.plan||'free', data.status||'invited']);
  return rows[0];
}
export async function deleteTeamMember(id: number) {
  const { rowCount } = await q('DELETE FROM team_members WHERE id = $1', [id]);
  return (rowCount || 0) > 0;
}

// ============================================================
// ACTIVITY
// ============================================================
export async function listActivity(limit = 50) { const { rows } = await q('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT $1', [limit]); return rows; }
export async function logActivity(entry: any) {
  await q('INSERT INTO activity_log (actor, action, target, type, details) VALUES ($1,$2,$3,$4,$5)', [entry.actor, entry.action, entry.target, entry.type, entry.details||null]);
}

// ============================================================
// PASSWORD RESET
// ============================================================
export async function createPasswordReset(userId: string, token: string, expiresAt: Date) {
  const { rows } = await q('INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1,$2,$3) RETURNING *', [userId, token, expiresAt]);
  return rows[0] || null;
}
export async function findPasswordReset(token: string) {
  const { rows } = await q('SELECT * FROM password_resets WHERE token = $1 AND used = FALSE AND expires_at > NOW()', [token]);
  return rows[0] || null;
}
export async function usePasswordReset(token: string) { await q('UPDATE password_resets SET used = TRUE WHERE token = $1', [token]); }

// Init
checkDbConnection().then(ok => { console.log(ok ? '[DB] PostgreSQL connected' : '[DB] PostgreSQL not available — using in-memory fallback'); });
