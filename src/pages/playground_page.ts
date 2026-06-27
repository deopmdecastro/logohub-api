// Playground page — online code editor / compiler
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
</style>`)}
<body style="margin:0;overflow:hidden;background:var(--bg);color:var(--text)">
  <nav class="nav-blur" style="height:56px;display:flex;align-items:center;padding:0 1rem;position:sticky;top:0;z-index:10">
    <a href="/" style="display:flex;align-items:center;gap:.5rem;font-weight:700;font-size:1.1rem;text-decoration:none;color:var(--text)">
      <span style="width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;background:var(--lilac);color:#1a1a1a">L</span>LogoHub Playground
    </a>
    <div style="margin-left:auto;display:flex;align-items:center;gap:.5rem">
      <button onclick="runCode()" class="btn btn-primary btn-sm"><i class="fas fa-play"></i> Run</button>
      <button onclick="clearAll()" class="btn btn-ghost btn-sm"><i class="fas fa-eraser"></i> Clear</button>
      <button onclick="LH.toggleTheme()" id="themeBtn" class="btn btn-ghost btn-icon-sm"><i class="fas fa-sun"></i></button>
    </div>
  </nav>

  <div class="playground-container">
    <!-- Editor -->
    <div class="editor-panel">
      <div class="editor-tabs" id="tabs">
        <div class="editor-tab active" data-tab="html"><i class="fab fa-html5" style="color:#e44d26"></i> HTML</div>
        <div class="editor-tab" data-tab="css"><i class="fab fa-css3-alt" style="color:#264de4"></i> CSS</div>
        <div class="editor-tab" data-tab="js"><i class="fab fa-js-square" style="color:#f7df1e"></i> JavaScript</div>
        <div class="editor-tab" data-tab="ts"><i class="fas fa-code" style="color:#3178c6"></i> TypeScript</div>
      </div>
      <div class="editor-body">
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
    </div>

    <!-- Preview -->
    <div class="preview-panel">
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
    // Tab switching
    document.querySelectorAll('.editor-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const type = tab.dataset.tab;
        ['html', 'css', 'js', 'ts'].forEach(t => {
          document.getElementById(t + 'Editor').style.display = t === type ? 'block' : 'none';
        });
      });
    });

    // Run code
    function runCode() {
      const html = document.getElementById('htmlEditor').value;
      const css = document.getElementById('cssEditor').value;
      let js = document.getElementById('jsEditor').value;
      const ts = document.getElementById('tsEditor').value;

      // If TypeScript tab has content and JS is empty, do simple transpile
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
    function clearAll() {
      if (!confirm('Clear all editors?')) return;
      document.getElementById('htmlEditor').value = '';
      document.getElementById('cssEditor').value = '';
      document.getElementById('jsEditor').value = '';
      document.getElementById('tsEditor').value = '';
      document.getElementById('previewFrame').srcdoc = '';
    }

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

    // Keyboard shortcut: Ctrl+Enter to run
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
    });

    // Auto-run on load
    setTimeout(runCode, 300);
  </script>
  ${COMMON_JS}
</body></html>`;
}
