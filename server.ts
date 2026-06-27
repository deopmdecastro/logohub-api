/**
 * Local Node.js dev server â€” no Wrangler/Cloudflare needed.
 * Run with: npx tsx server.ts
 */
import { serve } from '@hono/node-server'
import app from './src/index'
import { runMigrations, waitForDbConnection } from './src/data/db'

const port = Number(process.env.PORT) || 3000

await waitForDbConnection()
await runMigrations()

console.log(`[server] LogoHub starting on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`[server] âœ… Ready â€” http://localhost:${info.port}`)
  console.log(`[server] Login: http://localhost:${info.port}/login`)
})



