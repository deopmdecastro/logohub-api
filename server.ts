/**
 * Local Node.js dev server — no Wrangler/Cloudflare needed.
 * Run with: npx tsx server.ts
 *
 * Docker: the container runs `node dist/server.js` (compiled from this file).
 */
import { serve } from '@hono/node-server'
import app from './src/index'
import { runMigrations, waitForDbConnection, isDbAvailable, isMemoryFallbackAllowed } from './src/data/db'

const port = Number(process.env.PORT) || 3000

console.log('[server] ========================================')
console.log('[server] LogoHub API Server')
console.log('[server] ========================================')
console.log('[server] NODE_ENV:', process.env.NODE_ENV || '(not set)')
console.log('[server] PORT:', port)
console.log('[server] DB_HOST:', process.env.DB_HOST || '(not set)')
console.log('[server] DB_NAME:', process.env.DB_NAME || '(not set)')
console.log('[server] DB_FALLBACK:', process.env.DB_ENABLE_FALLBACK || '(not set)')
console.log('[server] ========================================')

// Try connecting to PostgreSQL
try {
  const connected = await waitForDbConnection()
  if (connected) {
    console.log('[server] ✅ PostgreSQL connected successfully')
    try {
      await runMigrations()
      console.log('[server] ✅ Database migrations applied')
    } catch (e: any) {
      console.warn('[server] ⚠️  Migration warning:', e.message)
    }
  } else if (isMemoryFallbackAllowed()) {
    console.log('[server] ⚠️  Running with in-memory fallback (no persistence!)')
  } else {
    console.error('[server] ❌ PostgreSQL unavailable and fallback is disabled')
    console.error('[server]    Make sure PostgreSQL is running and reachable')
    process.exit(1)
  }
} catch (e: any) {
  console.error('[server] ❌ Fatal DB error:', e.message)
  if (!isMemoryFallbackAllowed()) {
    process.exit(1)
  }
  console.warn('[server] ⚠️  Continuing with in-memory fallback')
}

console.log(`[server] 🚀 Starting on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`[server] ✅ Ready — http://localhost:${info.port}`)
  console.log(`[server]    Login:   http://localhost:${info.port}/login`)
  console.log(`[server]    API:     http://localhost:${info.port}/api/v1/stats`)
  console.log(`[server]    Health:  http://localhost:${info.port}/api/v1/health`)
})
