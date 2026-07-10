// LogoHub Playground — standalone full-screen API explorer + live code editor
import { HEAD, COMMON_JS } from './shared';

export function playgroundPage() {
  return `${HEAD('Playground — LogoHub', `
<style>
.pg-root { display:flex; height:100vh; overflow:hidden; }
/* ── Sidebar (optional, hidden by default) ── */
.pg-sidebar { width:0; overflow:hidden; transition:width .25s ease; background:var(--surface); border-right:1px solid var(--border); flex-shrink:0; display:flex; flex-direction:column; }
.pg-sidebar.open { width:280px; }
.pg-sidebar-inner { width:280px; padding:1rem; overflow-y:auto; }
.pg-sidebar h3 { font-size:.8rem; text-transform:uppercase; letter-spacing:.06em; color:var(--text-mute); margin-bottom:.75rem; font-weight:700; }
.pg-history-item { padding:.55rem .75rem; border-radius:var(--radius); font-size:.78rem; cursor:pointer; color:var(--text-soft); transition:all .15s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:2px; }
.pg-history-item:hover { background:var(--panel-2); color:var(--text); }
.pg-history-item i { margin-right:.4rem; font-size:.7rem; opacity:.5; }
/* ── Main area ── */
.pg-main { flex:1; display:flex; flex-direction:column; min-width:0; }
/* ── Topbar ── */
.pg-topbar { height:52px; display:flex; align-items:center; padding:0 1rem; gap:.5rem; border-bottom:1px solid var(--border); background:var(--surface); flex-shrink:0; }
.pg-topbar .pg-logo { font-weight:800; font-size:.95rem; display:flex; align-items:center; gap:.5rem; color:var(--text); text-decoration:none; white-space:nowrap; }
.pg-topbar .pg-logo span { width:28px;height:28px;border-radius:.5rem;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:900;background:linear-gradient(135deg,var(--lilac),var(--amber));color:#12121a; }
.pg-topbar-spacer { flex:1; }
.pg-topbar .btn { font-size:.75rem; }
/* ── Panels ── */
.pg-panels { flex:1; display:flex; overflow:hidden; }
.pg-editor { width:50%; display:flex; flex-direction:column; border-right:1px solid var(--border); min-width:0; }
.pg-preview { width:50%; display:flex; flex-direction:column; min-width:0; }
/* ── Tabs ── */
.pg-tabs { display:flex; border-bottom:1px solid var(--border); background:var(--panel); overflow-x:auto; flex-shrink:0; }
.pg-tab { padding:.45rem .9rem; font-size:.72rem; font-weight:600; cursor:pointer; border-bottom:2px solid transparent; color:var(--text-mute); transition:all .15s; white-space:nowrap; display:flex; align-items:center; gap:.35rem; }
.pg-tab.active { color:var(--text); border-bottom-color:var(--lilac); }
.pg-tab:hover:not(.active) { color:var(--text-soft); background:rgba(255,255,255,.02); }
/* ── Editor ── */
.pg-editor-body { flex:1; overflow:hidden; position:relative; }
.pg-editor-body textarea { width:100%;height:100%;background:var(--panel);color:var(--text);border:none;resize:none;padding:1rem 1.2rem;font-family:'JetBrains Mono',monospace;font-size:.78rem;line-height:1.65;outline:none;tab-size:2; }
.pg-editor-body textarea::placeholder { color:var(--text-mute); }
/* ── Preview ── */
.pg-preview-header { display:flex;align-items:center;gap:.5rem;padding:.35rem .75rem;background:var(--panel);border-bottom:1px solid var(--border);flex-shrink:0; }
.pg-url { flex:1; font-size:.7rem; padding:.25rem .6rem; border-radius:9999px; background:var(--panel-2); color:var(--text-soft); font-family:var(--font-mono); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pg-preview-frame { flex:1; border:none; background:#fff; }
/* ── API Demo Panel (replaces editor when active) ── */
.pg-api-demo { display:none; flex:1; overflow-y:auto; padding:1.5rem; background:linear-gradient(135deg,#12121f 0%,#1a1a2e 50%,#16213e 100%); }
.pg-api-demo.visible { display:block; }
.pg-api-card { max-width:640px; margin:0 auto; background:rgba(255,255,255,.05); backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px); border-radius:20px; padding:1.75rem; color:#f0f0f5; box-shadow:0 12px 40px rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.08); }
.pg-api-card h2 { font-size:1.5rem; margin-bottom:.5rem; }
.pg-api-search { display:flex; gap:.5rem; margin-bottom:1rem; }
.pg-api-search input { flex:1; padding:.65rem 1rem; border-radius:12px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.06); color:#fff; font-size:.85rem; outline:none; transition:border .2s; }
.pg-api-search input:focus { border-color:rgba(184,169,232,.5); background:rgba(255,255,255,.1); }
.pg-api-search input::placeholder { color:rgba(255,255,255,.3); }
.pg-api-search button { padding:.65rem 1.2rem; border-radius:12px; border:none; background:var(--lilac); color:#12121a; font-weight:700; font-size:.8rem; cursor:pointer; transition:all .15s; white-space:nowrap; }
.pg-api-search button:hover { filter:brightness(1.1); }
.pg-api-search button:disabled { opacity:.5; cursor:not-allowed; }
.pg-api-suggestions { display:flex; flex-wrap:wrap; gap:.35rem; margin-bottom:1.25rem; }
.pg-api-suggestion { padding:.3rem .7rem; border-radius:9999px; background:rgba(255,255,255,.06); color:rgba(255,255,255,.55); font-size:.7rem; cursor:pointer; border:1px solid rgba(255,255,255,.06); transition:all .15s; }
.pg-api-suggestion:hover { background:rgba(255,255,255,.12); color:#fff; border-color:rgba(255,255,255,.15); }
.pg-api-hint { font-size:.7rem; color:rgba(255,255,255,.3); margin-top:-.5rem; margin-bottom:1rem; }
.pg-api-result { display:none; }
.pg-api-error { color:#ff6b6b; font-size:.8rem; padding:.5rem 0; display:none; }
.pg-api-loading { text-align:center; padding:2rem; color:rgba(255,255,255,.35); font-size:.85rem; }
.pg-api-row { display:flex; gap:.75rem; margin-bottom:1rem; flex-wrap:wrap; }
.pg-api-item { flex:1; min-width:120px; background:rgba(255,255,255,.04); padding:.65rem .85rem; border-radius:10px; }
.pg-api-item .lbl { font-size:.62rem; color:rgba(255,255,255,.35); text-transform:uppercase; letter-spacing:.05em; margin-bottom:.2rem; }
.pg-api-item .val { font-size:.82rem; font-weight:600; }
.pg-api-colors { display:flex; gap:.5rem; flex-wrap:wrap; margin:.75rem 0; }
.pg-api-color { width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.15);cursor:pointer;transition:transform .15s; }
.pg-api-color:hover { transform:scale(1.2); }
.pg-api-tags { display:flex;flex-wrap:wrap;gap:.35rem;margin:.5rem 0; }
.pg-api-tag { background:rgba(255,255,255,.08);padding:.25rem .65rem;border-radius:9999px;font-size:.7rem; }
.pg-api-code { background:rgba(0,0,0,.25);padding:.75rem 1rem;border-radius:10px;font-family:var(--font-mono);font-size:.7rem;color:#a78bfa;overflow-x:auto;line-height:1.6;cursor:pointer;transition:background .15s;margin:.5rem 0; }
.pg-api-code:hover { background:rgba(0,0,0,.4); }
.pg-api-link { display:inline-flex;align-items:center;gap:.3rem;color:rgba(255,255,255,.6);text-decoration:none;font-size:.78rem;transition:color .15s; }
.pg-api-link:hover { color:#fff; }
.pg-api-logo { width:64px;height:64px;border-radius:14px;object-fit:contain;background:#fff;padding:8px; }
/* ── Responsive ── */
@media(max-width:850px){ .pg-panels{flex-direction:column} .pg-editor,.pg-preview{width:100%;height:50%} .pg-sidebar.open{width:260px} }
</style>`)}
<body style="margin:0;overflow:hidden;background:var(--bg);color:var(--text);font-family:var(--font)">
<div class="pg-root">

  <!-- Sidebar (hidden by default, toggled via hamburger) -->
  <aside class="pg-sidebar" id="pgSidebar">
    <div class="pg-sidebar-inner">
      <h3><i class="fas fa-history"></i> Recent Searches</h3>
      <div id="pgHistory"></div>
      <div style="margin-top:1.5rem">
        <h3><i class="fas fa-book"></i> API Reference</h3>
        <a href="/docs" target="_blank" class="pg-history-item"><i class="fas fa-external-link-alt"></i> Full Documentation</a>
        <a href="/api/v1/catalog" target="_blank" class="pg-history-item"><i class="fas fa-list"></i> API Catalog</a>
      </div>
      <div style="margin-top:1.5rem">
        <h3><i class="fas fa-terminal"></i> Keyboard Shortcuts</h3>
        <div style="font-size:.7rem;color:var(--text-mute);line-height:1.8">
          <div><kbd style="background:var(--panel-2);padding:0 .3rem;border-radius:3px">Ctrl+Enter</kbd> Run / Search</div>
          <div><kbd style="background:var(--panel-2);padding:0 .3rem;border-radius:3px">Ctrl+S</kbd> Save snippet</div>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main -->
  <div class="pg-main">
    <!-- Topbar -->
    <header class="pg-topbar">
      <button id="pgMenuToggle" class="btn btn-ghost btn-icon-sm" onclick="toggleSidebar()" title="Toggle sidebar"><i class="fas fa-bars"></i></button>
      <a href="/" class="pg-logo"><span>L</span>LogoHub Playground</a>
      <div class="pg-topbar-spacer"></div>
      <div id="pgApiActions" style="display:none"><button onclick="pgSearch()" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> Search</button></div>
      <div id="pgEditorActions"><button onclick="pgRun()" class="btn btn-primary btn-sm"><i class="fas fa-play text-[10px]"></i> Run</button></div>
      <button onclick="pgClear()" class="btn btn-ghost btn-sm"><i class="fas fa-eraser text-[10px]"></i> Clear</button>
      <button onclick="LH.toggleTheme()" id="themeBtn" class="btn btn-ghost btn-icon-sm" title="Theme"><i class="fas fa-moon"></i></button>
      <a href="/" class="btn btn-ghost btn-icon-sm" title="Dashboard"><i class="fas fa-home"></i></a>
    </header>

    <!-- Panels -->
    <div class="pg-panels">
      <!-- Editor / API Demo -->
      <div class="pg-editor" id="pgEditorPanel">
        <!-- Tabs -->
        <div class="pg-tabs">
          <div class="pg-tab active" data-panel="code" onclick="pgSwitchPanel('code')"><i class="fas fa-code text-[10px]"></i> Editor</div>
          <div class="pg-tab" data-panel="api" onclick="pgSwitchPanel('api')"><i class="fas fa-plug text-[10px]"></i> API Demo</div>
        </div>
        <!-- Code editors -->
        <div class="pg-editor-body" id="pgEditorBody">
          <div class="pg-tabs" id="pgEditorTabs" style="border-bottom:none;padding:0 .5rem">
            <div class="pg-tab active" data-lang="html" onclick="pgSwitchLang('html')"><i class="fab fa-html5" style="color:#e44d26"></i> HTML</div>
            <div class="pg-tab" data-lang="css" onclick="pgSwitchLang('css')"><i class="fab fa-css3-alt" style="color:#264de4"></i> CSS</div>
            <div class="pg-tab" data-lang="js" onclick="pgSwitchLang('js')"><i class="fab fa-js" style="color:#f7df1e"></i> JS</div>
          </div>
          <textarea id="pgHtml" placeholder="<!-- HTML -->"><h1>Hello, LogoHub!</h1>
<p>Edit code on the left, see preview on the right.</p>
<button onclick="alert('Clicked!')">Click Me</button></textarea>
          <textarea id="pgCss" placeholder="/* CSS */" style="display:none">body{font-family:system-ui,sans-serif;max-width:600px;margin:2rem auto;padding:1rem}h1{color:#4f46e5}button{padding:.5rem 1.2rem;background:#4f46e5;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:1rem}button:hover{background:#4338ca}</textarea>
          <textarea id="pgJs" placeholder="// JavaScript" style="display:none">console.log('Hello from Playground!');</textarea>
        </div>
        <!-- API Demo -->
        <div class="pg-api-demo" id="pgApiPanel">
          <div class="pg-api-card">
            <div class="pg-api-search">
              <input type="text" id="pgSearchInput" placeholder="Search logos... e.g. google, spotify, bitcoin" onkeydown="if(event.key==='Enter')pgSearch()">
              <button id="pgSearchBtn" onclick="pgSearch()">🔍 Search</button>
            </div>
            <div class="pg-api-hint">Try: google, apple, spotify, bitcoin, react, python, aws, nike, stripe</div>
            <div class="pg-api-suggestions" id="pgSuggestions">
              <span class="pg-api-suggestion" onclick="pgQuickSearch('google')">Google</span>
              <span class="pg-api-suggestion" onclick="pgQuickSearch('netflix')">Netflix</span>
              <span class="pg-api-suggestion" onclick="pgQuickSearch('bitcoin')">Bitcoin</span>
              <span class="pg-api-suggestion" onclick="pgQuickSearch('react')">React</span>
              <span class="pg-api-suggestion" onclick="pgQuickSearch('python')">Python</span>
              <span class="pg-api-suggestion" onclick="pgQuickSearch('stripe')">Stripe</span>
              <span class="pg-api-suggestion" onclick="pgQuickSearch('aws')">AWS</span>
              <span class="pg-api-suggestion" onclick="pgQuickSearch('nike')">Nike</span>
            </div>
            <div class="pg-api-loading" id="pgApiLoading" style="display:none">🌀 Searching...</div>
            <div class="pg-api-error" id="pgApiError"></div>
            <div class="pg-api-result" id="pgApiResult"></div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="pg-preview" id="pgPreviewPanel">
        <div class="pg-preview-header">
          <div class="pg-url" id="pgUrl" title="Preview">Playground Preview</div>
          <button onclick="pgRefresh()" class="btn btn-ghost btn-icon-sm" title="Refresh"><i class="fas fa-sync-alt text-[10px]"></i></button>
          <button onclick="pgOpenTab()" class="btn btn-ghost btn-icon-sm" title="Open in new tab"><i class="fas fa-external-link-alt text-[10px]"></i></button>
          <button onclick="pgDownload()" class="btn btn-ghost btn-icon-sm" title="Download"><i class="fas fa-download text-[10px]"></i></button>
        </div>
        <iframe id="pgFrame" class="pg-preview-frame" sandbox="allow-scripts allow-modals allow-popups allow-same-origin"></iframe>
      </div>
    </div>
  </div>
</div>

<script>
var pgActivePanel='code',pgActiveLang='html',pgHistory=[];

// ── Sidebar toggle ──
function toggleSidebar(){ document.getElementById('pgSidebar').classList.toggle('open'); }
function addHistory(slug){ if(!pgHistory.includes(slug)){pgHistory.unshift(slug);if(pgHistory.length>20)pgHistory.pop();renderHistory()} }
function renderHistory(){ document.getElementById('pgHistory').innerHTML=pgHistory.map(function(s,i){return '<div class="pg-history-item" onclick="pgQuickSearch(\''+s+'\')"><i class="fas fa-search"></i>'+s+'</div>'}).join('')||'<div style="font-size:.7rem;color:var(--text-mute)">No searches yet</div>'; }

// ── Panel switching ──
function pgSwitchPanel(panel){
  pgActivePanel=panel;
  document.querySelectorAll('.pg-tab[data-panel]').forEach(function(t){t.classList.toggle('active',t.dataset.panel===panel)});
  document.getElementById('pgEditorBody').style.display=panel==='code'?'block':'none';
  document.getElementById('pgApiPanel').classList.toggle('visible',panel==='api');
  document.getElementById('pgEditorActions').style.display=panel==='code'?'':'none';
  document.getElementById('pgApiActions').style.display=panel==='api'?'':'none';
}

function pgSwitchLang(lang){
  pgActiveLang=lang;
  ['pgHtml','pgCss','pgJs'].forEach(function(id){document.getElementById(id).style.display=id==='pg'+lang.charAt(0).toUpperCase()+lang.slice(1)?'block':'none'});
  document.querySelectorAll('#pgEditorTabs .pg-tab').forEach(function(t){t.classList.toggle('active',t.dataset.lang===lang)});
}

// ── Run code ──
function pgRun(){
  var h=document.getElementById('pgHtml').value,c=document.getElementById('pgCss').value,j=document.getElementById('pgJs').value;
  var full='<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+c+'</style></head><body>'+h+'<script>'+j+'<'+'/script></body></html>';
  document.getElementById('pgFrame').srcdoc=full;
  document.getElementById('pgUrl').textContent='Preview · '+new Date().toLocaleTimeString();
}
function pgRefresh(){pgRun()}
function pgOpenTab(){var w=window.open('','_blank');w.document.write(document.getElementById('pgFrame').srcdoc||'<p>Run first</p>');w.document.close()}
function pgDownload(){var b=new Blob([document.getElementById('pgFrame').srcdoc||'<html></html>'],{type:'text/html'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='playground.html';a.click()}
function pgClear(){if(!confirm('Clear all editors?'))return;['pgHtml','pgCss','pgJs'].forEach(function(id){document.getElementById(id).value=''});document.getElementById('pgFrame').srcdoc=''}

// ── API Demo ──
async function pgSearch(){
  var slug=document.getElementById('pgSearchInput').value.trim().toLowerCase();if(!slug)return;
  var resDiv=document.getElementById('pgApiResult'),errDiv=document.getElementById('pgApiError'),loadDiv=document.getElementById('pgApiLoading'),btn=document.getElementById('pgSearchBtn');
  resDiv.style.display='none';errDiv.style.display='none';loadDiv.style.display='block';btn.disabled=true;btn.textContent='...';
  addHistory(slug);
  try{
    var r=await fetch('/api/v1/logo/'+encodeURIComponent(slug));var j=await r.json();
    if(!r.ok||j.error){errDiv.textContent='❌ '+(j.error||'Not found');errDiv.style.display='block';loadDiv.style.display='none'}
    else{resDiv.innerHTML=pgRenderLogo(j.data,j.meta);resDiv.style.display='block';loadDiv.style.display='none';document.getElementById('pgUrl').textContent='GET /api/v1/logo/'+slug+' → 200 OK'}
  }catch(e){errDiv.textContent='⚠️ Network error';errDiv.style.display='block';loadDiv.style.display='none'}
  btn.disabled=false;btn.textContent='🔍 Search';
}
function pgQuickSearch(slug){document.getElementById('pgSearchInput').value=slug;pgSearch()}

function pgRenderLogo(logo,meta){
  var colors=logo.colors&&logo.colors.length?logo.colors.map(function(c){return '<div class="pg-api-color" style="background:'+c+'" title="'+c+'" onclick="navigator.clipboard.writeText(\''+c+'\')"></div>'}).join(''):'';
  var tags=logo.tags&&logo.tags.length?logo.tags.map(function(t){return '<span class="pg-api-tag">'+t+'</span>'}).join(''):'';
  return '<div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem"><img src="'+(logo.svg||logo.png)+'" class="pg-api-logo" onerror="this.style.display=\\'none\\'" alt="'+logo.name+'"><div><h2>'+logo.name+' '+(logo.verified?'✅':'')+'</h2><div style="font-size:.8rem;opacity:.5">@'+logo.slug+' · '+(logo.industry||logo.category||'')+'</div></div></div>'+
    (logo.description?'<p style="opacity:.8;line-height:1.6;margin-bottom:1rem;font-size:.85rem">'+logo.description+'</p>':'')+
    '<div class="pg-api-row"><div class="pg-api-item"><div class="lbl">Category</div><div class="val">'+logo.category+'</div></div><div class="pg-api-item"><div class="lbl">Country</div><div class="val">'+(logo.country||'—')+'</div></div><div class="pg-api-item"><div class="lbl">Industry</div><div class="val">'+(logo.industry||'—')+'</div></div></div>'+
    (colors?'<div class="lbl" style="margin-top:.5rem">Colors</div><div class="pg-api-colors">'+colors+'</div>':'')+
    (tags?'<div class="lbl" style="margin-top:.5rem">Tags</div><div class="pg-api-tags">'+tags+'</div>':'')+
    (logo.website?'<a href="'+logo.website+'" target="_blank" class="pg-api-link">🌐 '+logo.website+'</a>':'')+
    '<div style="margin-top:1rem;padding-top:.75rem;border-top:1px solid rgba(255,255,255,.06)"><div class="lbl">API Response</div><div class="pg-api-code" onclick="navigator.clipboard.writeText(JSON.stringify('+JSON.stringify({data:logo,meta:meta||{version:'v1'}}).replace(/"/g,'&quot;')+',null,2))" title="Click to copy JSON">{<br>  "data": { "id": "'+logo.id+'", "slug": "'+logo.slug+'", "name": "'+logo.name+'", ... },<br>  "meta": { "version": "'+(meta&&meta.version||'v1')+'" }<br>}</div></div>';
}

// ── Init ──
document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();pgActivePanel==='api'?pgSearch():pgRun()}});
setTimeout(pgRun,300);
renderHistory();
</script>
${COMMON_JS}
</body></html>`;
}
