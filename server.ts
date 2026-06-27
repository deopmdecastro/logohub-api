/**
 * Local Node.js dev server — no Wrangler/Cloudflare needed.
 * Run with: npx tsx server.ts
 */
import { serve } from '@hono/node-server'
import app from './src/index'

const port = Number(process.env.PORT) || 3000

console.log(`[server] LogoHub starting on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`[server] ✅ Ready — http://localhost:${info.port}`)
  console.log(`[server] Login: http://localhost:${info.port}/login`)
})
