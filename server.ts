/**
 * Local Node.js dev server — no Wrangler/Cloudflare needed.
 * Run with: npx tsx server.ts
 */
import { serve } from '@hono/node-server'
import app from './src/index'
import { runMigrations, waitForDbConnection, isDbAvailable } from './src/data/db'

const port = Number(process.env.PORT) || 3000

try {
  await waitForDbConnection()
} catch (e: any) {
  console.warn('[server] DB connection error:', e.message)
  console.warn('[server] Continuing with in-memory fallback...')
}

if (isDbAvailable()) {
  try {
    await runMigrations()
  } catch (e: any) {
    console.warn('[server] Migration error:', e.message)
  }
}

console.log(`[server] LogoHub starting on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`[server] ✅ Ready — http://localhost:${info.port}`)
  console.log(`[server] Login: http://localhost:${info.port}/login`)
})
