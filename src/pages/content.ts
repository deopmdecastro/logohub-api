import { HEAD, COMMON_JS } from './shared';
import { ctxSidebar, topbar, shellWrap, PageCtx, ADMIN_CTX } from './layout';
import { renderRowSkeletons } from './dashboard';

// ============================================================
// /dashboard/content (admin) · /dashboard/creator/content — CMS-style
// content editor (grid + editor modal), scoped to the active role.
// ============================================================
export const contentPage = (ctx: PageCtx = ADMIN_CTX) => `${HEAD('Content — LogoHub', COMMON_JS)}
${shellWrap(ctxSidebar(ctx, 'content'), `
${topbar(ctx.role === 'creator' ? 'My Content' : 'Content', 'Drag & drop uploads · auto palette · live preview', ctx)}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative flex-1 min-w-[200px]">
      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[12px]" style="color:var(--text-mute)"></i>
      <input id="cQ" placeholder="Search by name, slug, tag…" class="input input-pill" oninput="renderContent()">
    </div>
    <select id="cCat" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderContent()"><option value="">All categories</option></select>
    <select id="cStatus" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderContent()">
      <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="review">Review</option><option value="rejected">Rejected</option>
    </select>
    <span id="cCount" class="text-[11px] font-medium" style="color:var(--text-mute)">—</span>
    <button class="btn btn-primary ml-auto" onclick="openContentEditor()"><i class="fas fa-plus"></i> New content</button>
  </div>

  <div id="cGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
</div>

<script>
let ALL_CONTENT = [];
let ALL_KEYS = [];
let CATS = [];

async function loadContent() {
  try {
    const [c, cats, keys] = await Promise.all([
      LH.api('/api/admin/content'),
      LH.api('/api/v1/categories'),
      LH.api('/api/admin/keys'),
    ]);
    ALL_CONTENT = c.data; CATS = cats.data; ALL_KEYS = keys.data;
    const catSel = document.getElementById('cCat');
    catSel.innerHTML = '<option value="">All categories</option>' + CATS.map(c => '<option value="'+c.slug+'">'+c.icon+' '+c.name+'</option>').join('');
    renderContent();
  } catch (e) { LH.toast('error', 'Failed to load content', e.message); }
}
function renderContent() {
  const q = (document.getElementById('cQ').value||'').toLowerCase();
  const cat = document.getElementById('cCat').value;
  const st = document.getElementById('cStatus').value;
  const list = ALL_CONTENT.filter(i =>
    (!cat || i.category===cat) && (!st || i.status===st) &&
    (!q || (i.name+' '+i.slug+' '+i.description+' '+(i.tags||[]).join(' ')).toLowerCase().includes(q))
  );
  document.getElementById('cCount').textContent = list.length + ' of ' + ALL_CONTENT.length;
  if (!list.length) { document.getElementById('cGrid').innerHTML = '<div class="col-span-full empty-state"><i class="fas fa-images text-3xl mb-3 opacity-30 block"></i>No content matches your filters</div>'; return; }
  document.getElementById('cGrid').innerHTML = list.map(renderCard).join('');
}
function renderCard(l) {
  const stCls = { published:'pill-green', draft:'pill-teal', review:'pill-amber', rejected:'pill-coral' }[l.status] || 'pill-neutral';
  const vCol = { yes:'#4ade80', no:'#ff6b6b', pending:'#f5a623' }[l.verified] || '#b8a9e8';
  const pc = l.primary_color || '#b8a9e8';
  const bg = l.background_color || '#FFFFFF';
  const hasImage = l.svg_url || l.png_url || l.webp_url;
  return '<div class="card card-hover overflow-hidden flex flex-col">'+
    '<div class="h-32 flex items-center justify-center relative" style="background:'+bg+'">'+
      (hasImage ?
        '<img src="'+(l.svg_url||l.png_url||l.webp_url)+'" style="max-height:70%;max-width:60%;object-fit:contain" onerror="this.style.display=\\'none\\';this.nextElementSibling.style.display=\\'flex\\'">'+
        '<div class="logo-thumb" style="display:none;background:'+pc+'22;color:'+pc+'">'+esc((l.name||'?')[0])+'</div>'
        : '<div class="logo-thumb" style="background:'+pc+'22;color:'+pc+'">'+esc((l.name||'?')[0])+'</div>'
      )+
      '<span class="pill '+stCls+' absolute top-2 right-2">'+l.status+'</span>'+
      '<span class="absolute top-2 left-2 pill" style="background:rgba(255,255,255,.85);color:'+vCol+';border-color:'+vCol+'55;backdrop-filter:blur(8px)"><i class="fas fa-shield-alt text-[9px]"></i>'+l.verified+'</span>'+
    '</div>'+
    '<div class="p-4 flex-1 flex flex-col">'+
      '<div class="flex items-start justify-between gap-2">'+
        '<div class="min-w-0"><p class="text-sm font-semibold truncate" style="color:var(--text)">'+esc(l.name)+'</p>'+
        '<code class="text-[10px]" style="color:var(--text-mute)">/'+l.slug+'</code></div>'+
        '<span class="pill pill-teal">'+l.category+'</span>'+
      '</div>'+
      '<p class="text-[11px] mt-2 flex-1" style="color:var(--text-soft);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">'+esc(l.description||'')+'</p>'+
      '<div class="flex items-center gap-1 mt-3">'+
        [l.primary_color, l.secondary_color, l.background_color].filter(Boolean).slice(0,4).map(c => '<span class="color-swatch" style="background:'+c+'" title="'+c+'"></span>').join('')+
        '<span class="text-[10px] ml-1" style="color:var(--text-mute)">'+LH.fmt(l.requests||0)+' req</span>'+
        '<div class="ml-auto flex items-center gap-1">'+
          '<button class="btn btn-ghost btn-icon-sm" title="Edit" onclick="openContentEditor(\\'__ID__\\')"><i class="fas fa-pen text-[10px]"></i></button>'.replaceAll('__ID__', l.id)+
          '<button class="btn btn-danger btn-icon-sm" title="Delete" onclick="deleteContent(\\'__ID__\\')"><i class="fas fa-trash text-[10px]"></i></button>'.replaceAll('__ID__', l.id)+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>';
}
function esc(s) { return String(s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

// =================== CONTENT EDITOR MODAL ===================
function openContentEditor(id) {
  const item = id ? ALL_CONTENT.find(x=>x.id===id) : null;
  const isEdit = !!item;
  const f = item || {
    name:'', slug:'', description:'', category: CATS[0]?.slug||'technology', subcategory:'',
    website:'', country:'', industry:'', tags:[],
    primary_color:'#b8a9e8', secondary_color:'#f5a623', background_color:'#FFFFFF', text_color:'#1A1A1A',
    svg_url:'', png_url:'', webp_url:'', ico_url:'', favicon_url:'', cover_url:'', thumbnail_url:'',
    verified:'pending', status:'draft', history:[], owner_key:''
  };
  const form = JSON.parse(JSON.stringify(f));

  const html = '<div class="modal-box" style="max-width:1100px;height:90vh"><div class="modal-head">'+
    '<div style="display:flex;align-items:center;gap:.75rem;"><div style="width:38px;height:38px;border-radius:12px;background:#4ecdc422;color:#4ecdc4;display:flex;align-items:center;justify-content:center;"><i class="fas fa-image"></i></div>'+
    '<div><h2 class="text-base font-bold" style="color:var(--text)">'+(isEdit?'Edit content':'New content')+'</h2><p class="text-[11px]" style="color:var(--text-mute)">Drag & drop assets, auto-extract palette, generate favicon</p></div></div>'+
    '<button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+

    '<div class="flex flex-col lg:flex-row" style="flex:1;overflow:hidden;">'+
      // sidebar
      '<div style="width:200px;background:var(--panel-2);border-right:1px solid var(--border);padding:1rem;">'+
        '<div class="flex lg:flex-col gap-1" id="editTabs">'+
          tabBtn('info','Info','fa-file-alt',true) + tabBtn('assets','Assets','fa-cloud-upload-alt') +
          tabBtn('colors','Colors','fa-palette') + tabBtn('seo','Metadata','fa-tags') +
          tabBtn('history','History','fa-history')+
        '</div>'+
      '</div>'+

      // Main + preview
      '<div class="flex-1 flex flex-col lg:flex-row" style="overflow:hidden;">'+
        '<div class="flex-1 modal-body" style="max-height:calc(90vh - 130px)">'+
          panelInfo() + panelAssets() + panelColors() + panelSeo() + panelHistory()+
        '</div>'+
        '<div style="width:280px;background:var(--panel-2);border-left:1px solid var(--border);padding:1.2rem;">'+
          '<p class="text-[10px] uppercase tracking-wide font-semibold mb-3" style="color:var(--text-mute)">Live preview</p>'+
          '<div id="livePreview" class="rounded-2xl p-7 flex flex-col items-center justify-center text-center" style="min-height:200px;transition:all .25s ease"></div>'+
          '<p class="text-[10px] uppercase tracking-wide font-semibold mt-4 mb-2" style="color:var(--text-mute)">Palette</p>'+
          '<div id="livePalette" class="grid grid-cols-4 gap-1.5"></div>'+
          '<div id="liveLinks" class="mt-4 space-y-1"></div>'+
        '</div>'+
      '</div>'+
    '</div>'+

    '<div class="modal-foot"><div class="text-[11px] mr-auto" style="color:var(--text-mute)">'+(isEdit?'Editing /'+f.slug:'New content')+'</div>'+
      '<button class="btn btn-ghost" data-close>Cancel</button>'+
      '<button id="saveContentBtn" class="btn btn-primary"><i class="fas fa-save"></i> '+(isEdit?'Save changes':'Create')+'</button>'+
    '</div></div>';

  const modal = LH.openModal(html);

  // wire tabs
  modal.querySelectorAll('#editTabs > button').forEach(b => b.onclick = () => {
    modal.querySelectorAll('#editTabs > button').forEach(x => x.classList.remove('tab-active'));
    b.classList.add('tab-active'); b.style.background='var(--surface)'; b.style.color='var(--text)';
    modal.querySelectorAll('[data-panel]').forEach(p => p.classList.add('hidden'));
    modal.querySelector('[data-panel="'+b.dataset.tab+'"]').classList.remove('hidden');
    modal.querySelectorAll('#editTabs > button').forEach(x => { if (x!==b) { x.style.background='transparent'; x.style.color='var(--text-soft)'; } });
  });

  // populate fields
  const $ = (s) => modal.querySelector(s);
  const fields = ['name','slug','description','category','subcategory','website','country','industry','primary_color','secondary_color','background_color','text_color','svg_url','png_url','webp_url','ico_url','avatar_url','favicon_url','cover_url','thumbnail_url','verified','status','owner_key'];
  // Category options
  $('[name=category]').innerHTML = CATS.map(c => '<option value="'+c.slug+'" '+(c.slug===form.category?'selected':'')+'>'+c.icon+' '+c.name+'</option>').join('');
  // Owner key options
  $('[name=owner_key]').innerHTML = '<option value="">— none —</option>' + ALL_KEYS.map(k => '<option value="'+k.id+'" '+(k.id===form.owner_key?'selected':'')+'>'+k.name+'</option>').join('');
  fields.forEach(k => { const el = $('[name='+k+']'); if (el) el.value = form[k] || ''; });
  $('[name=tags]').value = (form.tags||[]).join(', ');

  // sync helpers
  const sync = (k, v) => { form[k] = v; updatePreview(); };
  fields.forEach(k => { const el = $('[name='+k+']'); if (el) el.addEventListener('input', e => sync(k, e.target.value)); });
  $('[name=tags]').addEventListener('input', e => { form.tags = e.target.value.split(',').map(s=>s.trim()).filter(Boolean); });
  $('[name=name]').addEventListener('input', e => { if (!isEdit || !$('[name=slug]').value) { const s = LH.slugify(e.target.value); $('[name=slug]').value = s; sync('slug', s); } });

  // color inputs sync hex<->picker
  ['primary_color','secondary_color','background_color','text_color'].forEach(k => {
    const text = $('[name='+k+']'); const pick = $('[name='+k+'_pick]');
    text.addEventListener('input', e => { pick.value = e.target.value; sync(k, e.target.value); });
    pick.addEventListener('input', e => { text.value = e.target.value.toUpperCase(); sync(k, text.value); });
    pick.value = form[k];
  });

  // Drag & drop
  const drop = $('#dropzone');
  ;['dragover','dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('dragover'); }));
  ;['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
  drop.addEventListener('drop', e => { e.preventDefault(); [...e.dataTransfer.files].forEach(f => handleFile(f)); });
  $('#dropBrowse').addEventListener('change', e => { [...e.target.files].forEach(f => handleFile(f)); });

  // Asset row uploads
  modal.querySelectorAll('[data-upload]').forEach(input => {
    input.addEventListener('change', e => { const f = e.target.files[0]; if (f) handleFile(f, input.dataset.upload); });
  });

  async function handleFile(file, forceKey) {
    const ext = (file.name.split('.').pop()||'').toLowerCase();
    const key = forceKey || (ext==='svg'?'svg_url' : ext==='png'?'png_url' : ext==='webp'?'webp_url' : ext==='ico'?'ico_url' : 'png_url');
    try {
      const url = await LH.fileToDataUrl(file);
      form[key] = url; const el = $('[name='+key+']'); if (el) el.value = url;
      // auto favicon if missing
      if (!form.avatar_url && ['png','jpg','jpeg','webp'].includes(ext)) { form.avatar_url = url; $('[name=avatar_url]').value = url; }
        if (!form.favicon_url && ['png','jpg','jpeg','webp'].includes(ext)) { form.favicon_url = url; $('[name=favicon_url]').value = url; }
      // auto palette
      if (['png','jpg','jpeg','webp'].includes(ext)) {
        const palette = await LH.extractPalette(file);
        if (palette.length) {
          form.primary_color = palette[0]; $('[name=primary_color]').value = palette[0]; $('[name=primary_color_pick]').value = palette[0];
          if (palette[1]) { form.secondary_color = palette[1]; $('[name=secondary_color]').value = palette[1]; $('[name=secondary_color_pick]').value = palette[1]; }
          LH.toast('success', 'Palette extracted', 'Detected ' + palette.length + ' dominant colors.');
        }
      }
      LH.toast('success', 'Asset uploaded', file.name);
      updatePreview();
    } catch (err) { LH.toast('error', 'Upload failed', err.message); }
  }

  function updatePreview() {
    const p = $('#livePreview');
    p.style.background = form.background_color || '#FFFFFF';
    p.style.color = form.text_color || '#1A1A1A';
    const hasImage = form.svg_url || form.png_url || form.webp_url;
    p.innerHTML = (hasImage
      ? '<img src="'+(form.svg_url||form.png_url||form.webp_url)+'" style="max-height:80px;margin-bottom:.75rem" onerror="this.replaceWith(Object.assign(document.createElement(\\'div\\'),{className:\\'logo-thumb\\',style:\\'background:'+(form.primary_color||'#b8a9e8')+'33;color:'+(form.primary_color||'#b8a9e8')+'\\',innerText:\\''+((form.name||'?')[0])+'\\'}))">'
      : '<div class="logo-thumb" style="background:'+(form.primary_color||'#b8a9e8')+'33;color:'+(form.primary_color||'#b8a9e8')+'">'+(form.name||'?')[0]+'</div>'
    ) + '<p class="text-sm font-bold">'+(form.name||'Logo name')+'</p>' +
        '<code class="text-[10px] opacity-60">/'+(form.slug||'slug')+'</code>';
    $('#livePalette').innerHTML = [form.primary_color,form.secondary_color,form.background_color,form.text_color].map(c => '<div style="aspect-ratio:1;border-radius:.5rem;border:1px solid var(--border);background:'+c+'" title="'+c+'"></div>').join('');
    $('#liveLinks').innerHTML = ['svg_url','png_url','webp_url','ico_url','avatar_url','favicon_url'].filter(k => form[k]).map(k => '<div class="text-[10px] flex items-center gap-1.5" style="color:var(--text-mute)"><i class="fas fa-check text-[#4ade80] text-[8px]"></i>'+k.replace('_url','').toUpperCase()+'</div>').join('') || '<p class="text-[10px]" style="color:var(--text-mute)">No assets uploaded yet</p>';
  }
  updatePreview();

  // Save
  $('#saveContentBtn').onclick = async () => {
    if (!form.name?.trim() || !form.slug?.trim()) { LH.toast('error','Name and slug are required'); return; }
    const btn = $('#saveContentBtn'); btn.disabled = true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving…';
    try {
      const url = isEdit ? '/api/admin/content/'+id : '/api/admin/content';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await LH.api(url, { method, body: JSON.stringify(form) });
      LH.toast('success', isEdit?'Content updated':'Content created', res.data.name);
      modal.remove();
      loadContent();
    } catch (e) { LH.toast('error', 'Save failed', e.message); btn.disabled=false; btn.innerHTML='<i class="fas fa-save"></i> '+(isEdit?'Save changes':'Create'); }
  };

  // panel HTML factories
  function tabBtn(t, label, icon, active) {
    return '<button data-tab="'+t+'" class="'+(active?'tab-active':'')+'" style="display:flex;align-items:center;gap:.5rem;padding:.5rem .75rem;border-radius:.75rem;font-size:.85rem;font-weight:500;background:'+(active?'var(--surface)':'transparent')+';color:'+(active?'var(--text)':'var(--text-soft)')+';text-align:left;width:100%"><i class="fas '+icon+' text-[12px]"></i>'+label+'</button>';
  }
  function panelInfo() {
    return '<div data-panel="info" class="space-y-4">'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Name *</label><input class="input" name="name"></div><div><label class="field-label">Slug *</label><input class="input" name="slug"></div></div>'+
      '<div><label class="field-label">Description</label><textarea class="textarea" name="description" rows="2"></textarea></div>'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Category</label><select class="select" name="category"></select></div><div><label class="field-label">Subcategory</label><input class="input" name="subcategory"></div></div>'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Website</label><input class="input" name="website" placeholder="https://"></div><div><label class="field-label">Country (ISO)</label><input class="input" name="country" placeholder="US, PT, ES…"></div></div>'+
      '<div><label class="field-label">Industry</label><input class="input" name="industry"></div>'+
      '<div><label class="field-label">Tags (comma-separated)</label><input class="input" name="tags" placeholder="search, tech, cloud"></div>'+
      '<div class="grid grid-cols-2 gap-4">'+
        '<div><label class="field-label">Verification</label><select class="select" name="verified"><option value="pending">Pending review</option><option value="yes">Verified</option><option value="no">Not verified</option></select></div>'+
        '<div><label class="field-label">Status</label><select class="select" name="status"><option value="draft">Draft</option><option value="review">In review</option><option value="published">Published</option><option value="rejected">Rejected</option></select></div>'+
      '</div>'+
      '<div><label class="field-label">Owner API Key (optional)</label><select class="select" name="owner_key"></select></div>'+
    '</div>';
  }
  function panelAssets() {
    return '<div data-panel="assets" class="hidden space-y-4">'+
      '<div id="dropzone" class="dropzone">'+
        '<i class="fas fa-cloud-upload-alt text-2xl mb-2 opacity-50"></i>'+
        '<p class="text-sm font-semibold" style="color:var(--text)">Drop SVG, PNG, WEBP or ICO here</p>'+
        '<p class="text-[11px]" style="color:var(--text-mute)">Auto-detects format, extracts palette, generates favicon</p>'+
        '<label class="btn btn-primary btn-sm mt-3 inline-flex" style="cursor:pointer"><i class="fas fa-upload"></i> Browse files<input id="dropBrowse" type="file" multiple accept=".svg,.png,.webp,.ico,.jpg,.jpeg" class="hidden"></label>'+
      '</div>'+
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">'+
        assetRow('svg_url','SVG','fa-file-code','#b8a9e8') + assetRow('png_url','PNG','fa-image','#f5a623') +
        assetRow('webp_url','WEBP','fa-image','#4ecdc4') + assetRow('ico_url','ICO','fa-file-image','#ff6b6b') +
        assetRow('avatar_url','Avatar / Logo','fa-user-circle','#ff6b6b') + assetRow('favicon_url','Favicon','fa-star','#4ade80') + assetRow('cover_url','Cover image','fa-image','#b8a9e8') +
        assetRow('thumbnail_url','Thumbnail','fa-image','#f5a623')+
      '</div>'+
    '</div>';
  }
  function assetRow(key, label, icon, color) {
    return '<div class="card p-3 flex items-center gap-3"><div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style="background:'+color+'22;color:'+color+'"><i class="fas '+icon+' text-[12px]"></i></div>'+
      '<div class="flex-1 min-w-0"><p class="text-xs font-semibold" style="color:var(--text)">'+label+'</p><input type="hidden" name="'+key+'"><code class="text-[10px] truncate block" style="color:var(--text-mute)" id="lbl-'+key+'"></code></div>'+
      '<label class="btn btn-ghost btn-icon-sm" style="cursor:pointer"><i class="fas fa-upload text-[10px]"></i><input type="file" class="hidden" data-upload="'+key+'"></label>'+
      '<button class="btn btn-danger btn-icon-sm" type="button" onclick="document.querySelector(\\'[name='+key+']\\').value=\\'\\';document.getElementById(\\'lbl-'+key+'\\').textContent=\\'not uploaded\\'"><i class="fas fa-trash text-[10px]"></i></button>'+
    '</div>';
  }
  function panelColors() {
    return '<div data-panel="colors" class="hidden space-y-4">'+
      '<div class="grid grid-cols-2 gap-4">'+
        colorField('primary_color','Primary color') + colorField('secondary_color','Secondary color') +
        colorField('background_color','Background') + colorField('text_color','Text color')+
      '</div>'+
      '<button type="button" id="rePalette" class="btn btn-ghost btn-sm"><i class="fas fa-magic"></i> Re-extract from uploaded image</button>'+
    '</div>';
  }
  function colorField(k, label) {
    return '<div><label class="field-label">'+label+'</label><div class="color-input"><input type="color" name="'+k+'_pick"><input class="input" name="'+k+'" placeholder="#000000"></div></div>';
  }
  function panelSeo() {
    return '<div data-panel="seo" class="hidden space-y-4">'+
      '<p class="text-[11px]" style="color:var(--text-mute)">Metadata used by search and the public API.</p>'+
      '<div><label class="field-label">Search aliases (comma-separated)</label><input class="input" placeholder="e.g. alphabet, googl" disabled value=""></div>'+
      '<div class="card p-4"><p class="text-[11px] font-semibold mb-2" style="color:var(--text-soft)">API preview</p><pre class="code-block" id="apiPreview"></pre></div>'+
    '</div>';
  }
  function panelHistory() {
    const items = (form.history||[]);
    return '<div data-panel="history" class="hidden space-y-2">'+
      (items.length ? items.slice().reverse().map(h => '<div class="card p-3 flex items-center gap-3"><div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:#f5a62322;color:#f5a623"><i class="fas fa-history text-[11px]"></i></div><div class="flex-1 min-w-0"><p class="text-sm font-semibold" style="color:var(--text)">'+h.action+'</p><p class="text-[11px]" style="color:var(--text-mute)">'+(h.actor||'system')+(h.details?' · '+h.details:'')+'</p></div><span class="text-[11px]" style="color:var(--text-mute)">'+LH.rel(h.ts)+'</span></div>').join('')
        : '<div class="empty-state"><i class="fas fa-history text-3xl mb-3 opacity-30 block"></i>No history yet</div>')+
    '</div>';
  }

  // Populate asset labels after html injected
  ['svg_url','png_url','webp_url','ico_url','avatar_url','favicon_url','cover_url','thumbnail_url'].forEach(k => {
    const el = modal.querySelector('#lbl-'+k);
    if (el) el.textContent = form[k] ? (String(form[k]).startsWith('data:')?'(uploaded file)':form[k]) : 'not uploaded';
  });

  // Re-palette button
  modal.querySelector('#rePalette').onclick = async () => {
    if (!form.png_url) { LH.toast('error','Upload PNG first'); return; }
    try { const r = await fetch(form.png_url); const blob = await r.blob(); const p = await LH.extractPalette(blob);
      if (p[0]) { form.primary_color=p[0]; $('[name=primary_color]').value=p[0]; $('[name=primary_color_pick]').value=p[0]; }
      if (p[1]) { form.secondary_color=p[1]; $('[name=secondary_color]').value=p[1]; $('[name=secondary_color_pick]').value=p[1]; }
      updatePreview(); LH.toast('success','Palette refreshed');
    } catch { LH.toast('error','Extraction failed'); }
  };

  // API preview
  const apiP = modal.querySelector('#apiPreview');
  setInterval(() => { if (apiP) apiP.textContent = JSON.stringify({ name: form.name, slug: form.slug, category: form.category, colors: [form.primary_color, form.secondary_color], svg: form.svg_url ? '...' : null }, null, 2); }, 500);
}

async function deleteContent(id) {
  const item = ALL_CONTENT.find(x=>x.id===id);
  const yes = await LH.confirm({ title:'Delete this logo?', msg:item.name+' will be permanently removed.', danger:true });
  if (!yes) return;
  try { await LH.api('/api/admin/content/'+id, { method:'DELETE' }); LH.toast('success','Deleted'); loadContent(); }
  catch (e) { LH.toast('error','Delete failed', e.message); }
}

LH.guardRole(['${ctx.role}']).then(function(u) { if (u) loadContent(); });
</script>
`)}
`;
