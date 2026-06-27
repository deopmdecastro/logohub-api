// Playground page — online code editor / compiler + LogoHub API Demo
import { HEAD, COMMON_JS } from './shared';

export function playgroundPage() {
  return `${HEAD('Playground — LogoHub', `
<style>
.playground-container { display: flex; height: calc(100vh - 64px); }
.editor-panel { width: 50%; display: flex; flex-direction: column; border-right: 1px solid var(--border); }
.preview-panel { width: 50%; display: flex; flex-direction: column; }
.editor-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); background: var(--panel); overflow-x: auto; }
.editor-tab { padding: .55rem 1rem; font-size: .78rem; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; color: var(--text-soft); transition: all .15s; white-space: nowrap; }
.editor-tab.active { color: var(--text); border-bottom-color: var(--lilac); background: var(--panel-2); }
.editor-tab:hover:not(.active) { color: var(--text); }
.editor-body { flex: 1; overflow: hidden; position: relative; }
.editor-body textarea { width: 100%; height: 100%; background: var(--panel-2); color: var(--text); border: none; resize: none; padding: 1rem; font-family: 'JetBrains Mono', monospace; font-size: .82rem; line-height: 1.6; outline: none; tab-size: 2; }
.preview-header { display: flex; align-items: center; justify-content: space-between; padding: .5rem 1rem; background: var(--panel); border-bottom:1px solid var(--border); }
.preview-header .url-bar { flex:1; font-size: .75rem; padding: .3rem .7rem; border-radius: 9999px; background: var(--panel-2); color: var(--text-soft); font-family: monospace; margin-right: .5rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.preview-frame { flex: 1; border: none; background: white; }
@media (max-width: 900px) { .playground-container { flex-direction: column; } .editor-panel, .preview-panel { width: 100%; height: 50%; } }

/* ── API Demo Panel ── */
.api-demo-panel { display: none; flex: 1; overflow-y: auto; padding: 2rem; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); }
.api-demo-panel.visible { display: block; }
.api-demo-card { max-width: 620px; margin: 0 auto; background: rgba(255,255,255,.06); backdrop-filter: blur(16px); border-radius: 20px; padding: 30px; color: #fff; box-shadow: 0 15px 40px rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.08); }
.api-demo-search { display: flex; gap: 10px; margin-bottom: 24px; }
.api-demo-search input { flex: 1; padding: 12px 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,.15); background: rgba(255,255,255,.07); color: #fff; font-size: 15px; outline: none; transition: border .2s; }
.api-demo-search input:focus { border-color: rgba(255,255,255,.4); background: rgba(255,255,255,.1); }
.api-demo-search input::placeholder { color: rgba(255,255,255,.35); }
.api-demo-search button { padding: 12px 22px; border-radius: 14px; border: none; background: #7c3aed; color: #fff; font-weight: 600; font-size: 14px; cursor: pointer; transition: background .2s; white-space: nowrap; }
.api-demo-search button:hover { background: #6d28d9; }
.api-demo-search button:disabled { opacity: .5; cursor: not-allowed; }
.api-demo-hint { font-size: .78rem; color: rgba(255,255,255,.35); margin-top: -18px; margin-bottom: 20px; }
.api-demo-header { display: flex; align-items: center; gap: 18px; margin-bottom: 22px; }
.api-demo-header img { width: 72px; height: 72px; background: #fff; padding: 10px; border-radius: 16px; object-fit: contain; }
.api-demo-header h2 { font-size: 28px; margin: 0; }
.api-demo-slug { color: rgba(255,255,255,.55); font-size: 14px; }
.api-demo-desc { margin: 18px 0; color: rgba(255,255,255,.8); line-height: 1.65; font-size: 15px; }
.api-demo-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-bottom: 22px; }
.api-demo-item { background: rgba(255,255,255,.06); padding: 12px 14px; border-radius: 12px; }
.api-demo-label { font-size: 11px; color: rgba(255,255,255,.45); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .5px; }
.api-demo-value { font-weight: 600; font-size: 14px; }
.api-demo-colors { display: flex; gap: 10px; margin: 18px 0; flex-wrap: wrap; }
.api-demo-color { width: 40px; height: 40px; border-radius: 10px; border: 2px solid rgba(255,255,255,.2); cursor: pointer; transition: transform .15s; }
.api-demo-color:hover { transform: scale(1.15); }
.api-demo-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
.api-demo-tag { background: rgba(255,255,255,.12); padding: 6px 14px; border-radius: 20px; font-size: 13px; }
.api-demo-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; color: rgba(255,255,255,.7); text-decoration: none; font-size: 14px; transition: color .2s; }
.api-demo-link:hover { color: #fff; }
.api-demo-error { color: #f87171; font-size: 14px; margin-top: 8px; }
.api-demo-loading { text-align: center; padding: 40px; color: rgba(255,255,255,.5); font-size: 15px; }
.api-demo-subtitle { font-size: 13px; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.api-demo-suggestions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.api-demo-suggestion { padding: 5px 12px; border-radius: 12px; background: rgba(255,255,255,.08); color: rgba(255,255,255,.6); font-size: 12px; cursor: pointer; border: none; transition: all .15s; }
.api-demo-suggestion:hover { background: rgba(255,255,255,.16); color: #fff; }
.api-demo-section { margin: 20px 0; }
.api-demo-code { background: rgba(0,0,0,.3); padding: 14px 18px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #a78bfa; overflow-x: auto; line-height: 1.7; cursor: pointer; transition: background .15s; }
.api-demo-code:hover { background: rgba(0,0,0,.45); }
</style>`)}
<body style="margin:0;overflow:hidden;background:var(--bg);color:var(--text)">
  <nav class="nav-blur" style="height:56px;display:flex;align-items:center;padding:0 1rem;position:sticky;top:0;z-index:10">
    <a href="/" style="display:flex;align-items:center;gap:.5rem;font-weight:700;font-size:1.1rem;text-decoration:none;color:var(--text)">
      <span style="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;background:var(--lilac);color:#1a1a1a">L</span>LogoHub Playground
    </a>
    <div style="margin-left:auto;display:flex;align-items:center;gap:.5rem">
      <button id="apiDemoRunBtn" style="display:none" onclick="searchLogo()" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> Search</button>
      <button id="editorRunBtn" onclick="runCode()" class="btn btn-primary btn-sm"><i class="fas fa-play"></i> Run</button>
      <button id="clearAllBtn" onclick="handleClear()" class="btn btn-ghost btn-sm"><i class="fas fa-eraser"></i> Clear</button>
      <button onclick="LH.toggleTheme()" id="themeBtn" class="btn btn-ghost btn-icon-sm"><i class="fas fa-sun"></i></button>
    </div>
  </nav>

  <div class="playground-container">
    <!-- Editor -->
    <div class="editor-panel" id="editorPanel">
      <!-- Tabs: Code Editor vs API Demo -->
      <div class="editor-tabs" id="tabs">
        <div class="editor-tab active" data-panel="code"><i class="fas fa-code"></i> Code Editor</div>
        <div class="editor-tab" data-panel="api"><i class="fas fa-plug"></i> API Demo</div>
        <div class="editor-tab" data-panel="html" style="display:none"><i class="fab fa-html5" style="color:#e44d26"></i> HTML</div>
        <div class="editor-tab" data-panel="css" style="display:none"><i class="fab fa-css3-alt" style="color:#264de4"></i> CSS</div>
        <div class="editor-tab" data-panel="js" style="display:none"><i class="fab fa-js-square" style="color:#f7df1e"></i> JavaScript</div>
        <div class="editor-tab" data-panel="ts" style="display:none"><i class="fas fa-code" style="color:#3178c6"></i> TypeScript</div>
      </div>

      <!-- Code editors body -->
      <div class="editor-body" id="editorBody">
        <textarea id="htmlEditor" placeholder="<!-- Write your HTML here -->"><h1>Hello, LogoHub!</h1>
<p>Edit the code on the left to see the preview on the right.</p>
<button onclick="alert('Button clicked!')">Click Me</button></textarea>
        <textarea id="cssEditor" placeholder="/* Write your CSS here */" style="display:none">body {
  font-family: system-ui, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}
h1 { color: #4f46e5; }
button {
  padding: .5rem 1.2rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
button:hover { background: #4338ca; }</textarea>
        <textarea id="jsEditor" placeholder="// Write your JavaScript here" style="display:none">console.log('Hello from JavaScript!');</textarea>
        <textarea id="tsEditor" placeholder="// Write your TypeScript here (will be transpiled to JS)" style="display:none">// TypeScript gets transpiled to JavaScript automatically
const message: string = 'Hello from TypeScript!';
console.log(message);</textarea>
      </div>

      <!-- API Demo body -->
      <div class="api-demo-panel" id="apiDemoPanel">
        <div class="api-demo-card" id="apiDemoCard">
          <div class="api-demo-search">
            <input type="text" id="logoSearchInput" placeholder="Search for a logo... e.g. google, netflix, bitcoin"
              onkeydown="if(event.key==='Enter')searchLogo()">
            <button id="searchBtn" onclick="searchLogo()">🔍 Search</button>
          </div>
          <div class="api-demo-hint">Try: google, apple, spotify, bitcoin, react, python, aws, nike, stripe, discord</div>

          <div class="api-demo-suggestions">
            <button class="api-demo-suggestion" onclick="quickSearch('google')">Google</button>
            <button class="api-demo-suggestion" onclick="quickSearch('netflix')">Netflix</button>
            <button class="api-demo-suggestion" onclick="quickSearch('bitcoin')">Bitcoin</button>
            <button class="api-demo-suggestion" onclick="quickSearch('react')">React</button>
            <button class="api-demo-suggestion" onclick="quickSearch('python')">Python</button>
            <button class="api-demo-suggestion" onclick="quickSearch('stripe')">Stripe</button>
            <button class="api-demo-suggestion" onclick="quickSearch('aws')">AWS</button>
            <button class="api-demo-suggestion" onclick="quickSearch('nike')">Nike</button>
          </div>

          <!-- API endpoint info -->
          <div class="api-demo-section" style="margin-top:24px">
            <div class="api-demo-subtitle">API Endpoint</div>
            <div class="api-demo-code" id="apiUrlDisplay" title="Click to copy">GET /api/v1/logo/:slug</div>
          </div>

          <div id="apiResult" style="display:none"></div>
          <div id="apiError" class="api-demo-error" style="display:none"></div>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div class="preview-panel" id="previewPanel">
      <div class="preview-header">
        <div class="url-bar" id="urlBar">Playground Preview</div>
        <div style="display:flex;gap:.35rem">
          <button onclick="refreshPreview()" class="btn btn-ghost btn-icon-sm" title="Refresh"><i class="fas fa-sync-alt"></i></button>
          <button onclick="openInNewTab()" class="btn btn-ghost btn-icon-sm" title="Open in new tab"><i class="fas fa-external-link-alt"></i></button>
          <button onclick="downloadHTML()" class="btn btn-ghost btn-icon-sm" title="Download HTML"><i class="fas fa-download"></i></button>
        </div>
      </div>
      <iframe id="previewFrame" class="preview-frame" sandbox="allow-scripts allow-modals allow-popups allow-same-origin"></iframe>
    </div>
  </div>

  <script>
    let activePanel = 'code';
    let activeEditor = 'html';

    // ── Panel switching (Code vs API Demo) ──
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const panel = tab.dataset.panel;
        if (panel === 'code' || panel === 'api') {
          // Top-level: switch between Code & API
          document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          activePanel = panel;

          if (panel === 'code') {
            document.getElementById('editorBody').style.display = 'block';
            document.getElementById('apiDemoPanel').classList.remove('visible');
            document.getElementById('editorRunBtn').style.display = '';
            document.getElementById('apiDemoRunBtn').style.display = 'none';
            document.getElementById('clearAllBtn').style.display = '';
            // Show lang tabs, hide code/api tabs except active
            showCodeTabs();
          } else {
            document.getElementById('editorBody').style.display = 'none';
            document.getElementById('apiDemoPanel').classList.add('visible');
            document.getElementById('editorRunBtn').style.display = 'none';
            document.getElementById('apiDemoRunBtn').style.display = '';
            document.getElementById('clearAllBtn').style.display = 'none';
            hideCodeTabs();
          }
        } else {
          // Sub-tab: HTML/CSS/JS/TS
          activeEditor = panel;
          showEditor(panel);
        }
      });
    });

    function showCodeTabs() {
      document.querySelectorAll('.editor-tab[data-panel="html"], .editor-tab[data-panel="css"], .editor-tab[data-panel="js"], .editor-tab[data-panel="ts"]').forEach(t => t.style.display = '');
      document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
      const codeTab = document.querySelector('.editor-tab[data-panel="code"]');
      const editorTab = document.querySelector('.editor-tab[data-panel="'+activeEditor+'"]');
      if (codeTab) codeTab.classList.add('active');
      if (editorTab) editorTab.classList.add('active');
      showEditor(activeEditor);
    }

    function hideCodeTabs() {
      document.querySelectorAll('.editor-tab[data-panel="html"], .editor-tab[data-panel="css"], .editor-tab[data-panel="js"], .editor-tab[data-panel="ts"]').forEach(t => t.style.display = 'none');
    }

    function showEditor(type) {
      ['html', 'css', 'js', 'ts'].forEach(t => {
        const el = document.getElementById(t + 'Editor');
        if (el) el.style.display = t === type ? 'block' : 'none';
      });
      document.querySelectorAll('.editor-tab[data-panel="html"], .editor-tab[data-panel="css"], .editor-tab[data-panel="js"], .editor-tab[data-panel="ts"]').forEach(t => {
        t.classList.toggle('active', t.dataset.panel === type);
      });
    }

    // ── API Demo ──
    async function searchLogo() {
      const input = document.getElementById('logoSearchInput');
      const slug = input.value.trim().toLowerCase();
      if (!slug) return;

      const resultDiv = document.getElementById('apiResult');
      const errorDiv = document.getElementById('apiError');
      const searchBtn = document.getElementById('searchBtn');
      const urlDisplay = document.getElementById('apiUrlDisplay');

      urlDisplay.textContent = 'GET /api/v1/logo/' + slug;
      resultDiv.style.display = 'none';
      errorDiv.style.display = 'none';
      searchBtn.disabled = true;
      searchBtn.textContent = '⏳ Loading...';

      // Show loading
      resultDiv.innerHTML = '<div class="api-demo-loading">🌀 Searching for <strong>' + slug + '</strong>...</div>';
      resultDiv.style.display = 'block';

      try {
        const res = await fetch('/api/v1/logo/' + encodeURIComponent(slug));
        const json = await res.json();

        if (!res.ok || json.error) {
          errorDiv.textContent = '❌ ' + (json.error || 'Logo not found') + ' — try a different search term';
          errorDiv.style.display = 'block';
          resultDiv.innerHTML = '';
          resultDiv.style.display = 'none';
        } else {
          const logo = json.data;
          errorDiv.style.display = 'none';
          resultDiv.innerHTML = renderLogo(logo, json.meta);
          resultDiv.style.display = 'block';

          // Update URL bar
          document.getElementById('urlBar').textContent = 'GET /api/v1/logo/' + slug + ' → 200 OK';
        }
      } catch (e) {
        errorDiv.textContent = '⚠️ Network error — is the API server running?';
        errorDiv.style.display = 'block';
        resultDiv.style.display = 'none';
      } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
      }
    }

    function quickSearch(slug) {
      document.getElementById('logoSearchInput').value = slug;
      searchLogo();
    }

    function renderLogo(logo, meta) {
      return \`
        <div class="api-demo-header">
          <img src="\${logo.svg || logo.png}" alt="\${logo.name}" onerror="this.style.display='none'">
          <div>
            <h2>\${logo.name} \${logo.verified ? '✅' : ''}</h2>
            <div class="api-demo-slug">@\${logo.slug} · \${logo.industry || logo.category}</div>
          </div>
        </div>

        <p class="api-demo-desc">\${logo.description || 'No description available.'}</p>

        <div class="api-demo-grid">
          <div class="api-demo-item">
            <div class="api-demo-label">Category</div>
            <div class="api-demo-value">\${logo.category}</div>
          </div>
          <div class="api-demo-item">
            <div class="api-demo-label">Subcategory</div>
            <div class="api-demo-value">\${logo.subcategory || '—'}</div>
          </div>
          <div class="api-demo-item">
            <div class="api-demo-label">Country</div>
            <div class="api-demo-value">\${logo.country || '—'}</div>
          </div>
          <div class="api-demo-item">
            <div class="api-demo-label">Industry</div>
            <div class="api-demo-value">\${logo.industry || '—'}</div>
          </div>
        </div>

        \${logo.colors && logo.colors.length ? \`
          <div class="api-demo-subtitle">Brand Colors</div>
          <div class="api-demo-colors">
            \${logo.colors.map(c => \`
              <div class="api-demo-color" style="background:\${c}" title="\${c}" onclick="navigator.clipboard.writeText('\${c}').then(()=>alert('Copied: \${c}'))"></div>
            \`).join('')}
          </div>
        \` : ''}

        \${logo.tags && logo.tags.length ? \`
          <div class="api-demo-subtitle">Tags</div>
          <div class="api-demo-tags">
            \${logo.tags.map(t => \`<div class="api-demo-tag">\${t}</div>\`).join('')}
          </div>
        \` : ''}

        \${logo.aliases && logo.aliases.length ? \`
          <p style="margin-top:16px;font-size:.85rem;color:rgba(255,255,255,.55)">
            <strong>Aliases:</strong> \${logo.aliases.join(', ')}
          </p>
        \` : ''}

        \${logo.website ? \`
          <a href="\${logo.website}" target="_blank" class="api-demo-link">🌐 \${logo.website}</a>
        \` : ''}

        <!-- API Response metadata -->
        <div class="api-demo-section" style="margin-top:20px; border-top: 1px solid rgba(255,255,255,.1); padding-top:16px">
          <div class="api-demo-subtitle">API Response</div>
          <div class="api-demo-code" onclick="copyApiResponse()" title="Click to copy full JSON">
{<br>
  &nbsp;&nbsp;"data": {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"id": "\${logo.id}",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"slug": "\${logo.slug}",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"name": "\${logo.name}",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"category": "\${logo.category}",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"verified": \${logo.verified},<br>
  &nbsp;&nbsp;&nbsp;&nbsp;...<br>
  &nbsp;&nbsp;},<br>
  &nbsp;&nbsp;"meta": {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"version": "\${meta?.version || 'v1'}"<br>
  &nbsp;&nbsp;}<br>
}
          </div>
        </div>
      \`;
    }

    window._lastLogoResponse = null;
    async function copyApiResponse() {
      try {
        const slug = document.getElementById('logoSearchInput').value.trim();
        const res = await fetch('/api/v1/logo/' + encodeURIComponent(slug));
        const json = await res.json();
        await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
        alert('📋 Full API response copied to clipboard!');
      } catch(e) {
        alert('⚠️ Could not copy. Try again.');
      }
    }

    function handleClear() {
      if (activePanel === 'api') return;
      if (!confirm('Clear all editors?')) return;
      document.getElementById('htmlEditor').value = '';
      document.getElementById('cssEditor').value = '';
      document.getElementById('jsEditor').value = '';
      document.getElementById('tsEditor').value = '';
      document.getElementById('previewFrame').srcdoc = '';
    }

    // ── Code Editor ──
    function runCode() {
      const html = document.getElementById('htmlEditor').value;
      const css = document.getElementById('cssEditor').value;
      let js = document.getElementById('jsEditor').value;
      const ts = document.getElementById('tsEditor').value;

      if (ts.trim() && !js.trim()) {
        js = ts
          .replace(/:\\s*\\w+(\\[\\])?(?=\\s*[=;,)\\]\\}])/g, '')
          .replace(/interface\\s+\\w+\\s*\\{[^}]*\\}/g, '')
          .replace(/type\\s+\\w+\\s*=\\s*[^;]+;/g, '')
          .replace(/export\\s+(default\\s+)?/g, '')
          .replace(/import\\s+.*?from\\s+['"][^'"]+['"];?/g, '');
      }

      const fullHTML = \`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>\${css}</style></head>
<body>\${html}
<script>\${js}<\\/script></body></html>\`;

      const frame = document.getElementById('previewFrame');
      frame.srcdoc = fullHTML;
      document.getElementById('urlBar').textContent = 'Preview updated at ' + new Date().toLocaleTimeString();
    }

    function refreshPreview() { runCode(); }

    function openInNewTab() {
      const html = document.getElementById('htmlEditor').value;
      const css = document.getElementById('cssEditor').value;
      let js = document.getElementById('jsEditor').value;
      const ts = document.getElementById('tsEditor').value;
      if (ts.trim() && !js.trim()) {
        js = ts.replace(/:\\s*\\w+(\\[\\])?(?=\\s*[=;,)\\]\\}])/g, '');
      }
      const full = \`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>\${css}</style></head><body>\${html}<script>\${js}<\\/script></body></html>\`;
      const win = window.open('', '_blank');
      win.document.write(full);
      win.document.close();
    }

    function downloadHTML() {
      const frame = document.getElementById('previewFrame');
      const html = frame.srcdoc || '<html><body><p>No content yet</p></body></html>';
      const blob = new Blob([html], { type: 'text/html' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'playground.html';
      a.click();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (activePanel === 'api') searchLogo();
        else runCode();
      }
    });

    // Auto-load Google on API Demo open
    setTimeout(() => {
      if (activePanel === 'code') runCode();
    }, 300);
  </script>
  ${COMMON_JS}
</body></html>`;
}
