// DB stub
export async function checkDbConnection() { return false; }
export async function findUserByEmail(e: string) { return null; }
export async function findUserById(id: string) { return null; }
export async function createUser(d: any) { return null; }
export async function updateUser(id: string, d: any) { return null; }
export async function deleteUser(id: string) { return false; }
export async function listUsers(f?: any) { return []; }
export async function findApiKey(k: string) { return null; }
export async function listApiKeys(u?: string) { return []; }
export async function createApiKey(d: any) { return null; }
export async function updateApiKey(id: string, d: any) { return null; }
export async function deleteApiKey(id: string) { return false; }
export async function listContent(f?: any) { return []; }
export async function getContentBySlug(s: string) { return null; }
export async function getContentById(id: string) { return null; }
export async function createContent(d: any) { return null; }
export async function updateContent(id: string, d: any) { return null; }
export async function deleteContent(id: string) { return false; }
export async function listNotifications(f?: any) { return []; }
export async function createNotification(d: any) { return null; }
export async function markNotificationRead(id: number) { return null; }
export async function markAllNotificationsRead(u?: string) { }
export async function deleteNotification(id: number) { return false; }
export async function getUnreadCount(u?: string) { return { unread: 0, total: 0 }; }
export async function listSettings(g?: string) { return []; }
export async function getSetting(k: string) { return null; }
export async function updateSetting(k: string, v: string) { return null; }
export async function listTeam() { return []; }
export async function saveTeamMember(d: any) { return null; }
export async function deleteTeamMember(id: number) { return false; }
export async function listActivity(l?: number) { return []; }
export async function logActivity(e: any) { }
export async function createPasswordReset(u: string, t: string, d: Date) { return null; }
export async function findPasswordReset(t: string) { return null; }
export async function usePasswordReset(t: string) { }
