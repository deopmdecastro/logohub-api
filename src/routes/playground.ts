// Playground routes — online code editor / compiler for HTML, CSS, JS, TS
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const playground = new Hono();
playground.use('/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }));

const ok = (c: any, data: any) => c.json({ data, meta: { version: 'v2', timestamp: new Date().toISOString() } });
const bad = (c: any, msg: string, code = 400) => c.json({ error: msg, code }, code as any);

// ============================================================
// POST /api/v1/playground/compile
// ============================================================
playground.post('/compile', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { html = '', css = '', js = '', ts = '' } = body;

  // Basic TypeScript → JavaScript transpilation (simple)
  let compiledJs = js;
  if (ts && !js) {
    // Simple TS→JS conversion (strip type annotations, interfaces, etc.)
    compiledJs = ts
      .replace(/:\s*\w+(\[\])?(\s*[=;,)\]\}])/g, '$1')  // type annotations
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')        // interfaces
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')            // type aliases
      .replace(/as\s+\w+/g, '')                            // type assertions
      .replace(/<[^>]+>/g, (match: string) => {
        // Keep JSX tags, remove generic type params
        if (/<\/?[a-z]/.test(match)) return match;
        return '';
      })
      .replace(/:\s*Readonly<[^>]+>/g, '')
      .replace(/:\s*Partial<[^>]+>/g, '')
      .replace(/:\s*Promise<[^>]+>/g, '')
      .replace(/:\s*Array<[^>]+>/g, '')
      .replace(/:\s*Record<[^>]+>/g, '')
      .replace(/export\s+(default\s+)?/g, '')
      .replace(/import\s+.*?from\s+['"][^'"]+['"];?/g, '')
      .replace(/export\s*\{[^}]*\};?/g, '');
  }

  // Generate the complete HTML document for preview
  const preview = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LogoHub Playground Preview</title>
<style>${css}</style>
</head>
<body>
${html}
<script>${compiledJs}<\/script>
</body>
</html>`;

  // Generate a unique ID for this session
  const id = Math.random().toString(36).slice(2, 10);
  const encodedPreview = btoa(preview);

  return ok(c, {
    id,
    html,
    css,
    js: compiledJs,
    preview_html: preview,
    // The preview can be accessed as a data URL or served directly
    preview_url: `/api/v1/playground/preview/${id}`,
    preview_data_url: `data:text/html;base64,${encodedPreview}`,
    compiled_at: new Date().toISOString(),
  });
});

// ============================================================
// GET /api/v1/playground/preview/:id
// ============================================================
// Store compiled previews (in-memory, TTL 1 hour)
const previewCache = new Map<string, { html: string; expires: number }>();

// Middleware for storing previews from compile endpoint
playground.post('/store', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { id, html } = body;
  if (!id || !html) return bad(c, 'id and html are required');
  previewCache.set(id, { html, expires: Date.now() + 3600000 });
  return ok(c, { stored: true });
});

playground.get('/preview/:id', (c) => {
  const id = c.req.param('id');
  const cached = previewCache.get(id);

  if (cached && cached.expires > Date.now()) {
    return new Response(cached.html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  // If not found, return a default playground
  return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Preview</title></head><body><p style="color:#888;text-align:center;margin-top:40vh;">Preview expired. Please re-compile.</p></body></html>`, {
    headers: { 'Content-Type': 'text/html' },
  });
});

export default playground;
