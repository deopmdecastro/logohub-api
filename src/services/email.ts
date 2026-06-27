export async function sendEmail(opts: any) { console.log('[EMAIL]', opts.subject, '->', opts.to); return { ok: true }; }
export function welcomeEmail(name: string, role: string) { return '<p>Welcome!</p>'; }
export function passwordResetEmail(name: string, token: string) { return '<p>Reset</p>'; }
export function notificationEmail(title: string, message: string, link?: string) { return '<p>'+title+'</p>'; }
