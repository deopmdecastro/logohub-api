// Dashboard admin pages — Blog, FAQ, Support tabs
import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap } from './layout';

// ============================================================
// /dashboard/blog  — Blog post management
// ============================================================
export const blogAdminPage = () => `${HEAD('Blog — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('blog'), `
${topbar('Blog', 'Manage articles, categories and publishing')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative flex-1 min-w-[200px]">
      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[12px]" style="color:var(--text-mute)"></i>
      <input id="bQ" placeholder="Search posts…" class="input input-pill" oninput="renderPosts()">
    </div>
    <select id="bCat" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderPosts()"><option value="">All categories</option></select>
    <select id="bStatus" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderPosts()">
      <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option>
    </select>
    <span id="bCount" class="text-[11px] font-medium" style="color:var(--text-mute)">—</span>
    <button class="btn btn-primary ml-auto" onclick="openBlogEditor()"><i class="fas fa-plus"></i> New Post</button>
  </div>

  <div id="bGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
</div>

<script>
let BLOG_POSTS = [];
const BLOG_CATS = ['API Updates','Tutorials','Case Studies','Product','Engineering','Community'];

async function load() {
  try { const r = await LH.api('/api/admin/blog'); BLOG_POSTS = r.data||[]; renderFilters(); renderPosts(); }
  catch(e) { LH.toast('error','Failed to load posts', e.message); }
}
function renderFilters() {
  document.getElementById('bCat').innerHTML = '<option value="">All categories</option>' +
    BLOG_CATS.map(c => '<option value="'+c+'">'+c+'</option>').join('');
}
function renderPosts() {
  const q = (document.getElementById('bQ').value||'').toLowerCase();
  const cat = document.getElementById('bCat').value;
  const st = document.getElementById('bStatus').value;
  let list = BLOG_POSTS;
  if (cat) list = list.filter(p => p.category === cat);
  if (st) list = list.filter(p => p.status === st);
  if (q) list = list.filter(p => (p.title+' '+p.excerpt+' '+(p.tags||[]).join(' ')).toLowerCase().includes(q));
  document.getElementById('bCount').textContent = list.length + ' posts';

  if (!list.length) { document.getElementById('bGrid').innerHTML = '<div class="col-span-full empty-state"><i class="fas fa-newspaper text-3xl mb-3 opacity-30 block"></i>No posts found</div>'; return; }

  document.getElementById('bGrid').innerHTML = list.map(p => {
    const stCls = p.status==='published'?'pill-green':'pill-amber';
    return '<div class="card overflow-hidden flex flex-col">'+
      '<div class="h-36 flex items-center justify-center" style="background:linear-gradient(135deg,var(--lilac))">'+
        '<i class="fas fa-newspaper text-3xl" style="color:rgba(255,255,255,.6)"></i>'+
        '<span class="pill '+stCls+' absolute top-2 right-2">'+p.status+'</span>'+
      '</div>'+
      '<div class="p-4 flex-1 flex flex-col">'+
        '<span class="pill pill-teal mb-2" style="font-size:10px">'+(p.category||'General')+'</span>'+
        '<h3 class="text-sm font-bold mb-1" style="color:var(--text)">'+esc(p.title)+'</h3>'+
        '<p class="text-xs flex-1" style="color:var(--text-soft);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">'+esc(p.excerpt||'')+'</p>'+
        '<div class="flex items-center gap-2 mt-3 pt-3" style="border-top:1px solid var(--border)">'+
          '<span class="text-[10px]" style="color:var(--text-mute)">/'+p.slug+'</span>'+
          '<span class="text-[10px] ml-auto" style="color:var(--text-mute)">'+fmtDate(p.created_at)+'</span>'+
          '<button class="btn btn-ghost btn-icon-sm" onclick="openBlogEditor(\\''+p.id+'\\')"><i class="fas fa-pen text-[10px]"></i></button>'+
          '<button class="btn btn-danger btn-icon-sm" onclick="deletePost(\\''+p.id+'\\',\\''+escAttr(p.title)+'\\')"><i class="fas fa-trash text-[10px]"></i></button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
}

async function openBlogEditor(id) {
  const post = id ? BLOG_POSTS.find(p => p.id===id) : null;
  const isEdit = !!post;
  const f = post || { title:'', slug:'', content:'', excerpt:'', category:'API Updates', tags:[], cover_url:'', status:'draft', author:'LogoHub Team' };

  const html = '<div class="modal-box" style="max-width:800px;height:90vh"><div class="modal-head">'+
    '<h2 class="text-base font-bold" style="color:var(--text)">'+(isEdit?'Edit Post':'New Blog Post')+'</h2>'+
    '<button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<div class="modal-body space-y-4">'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Title *</label><input class="input" name="title" value="'+escAttr(f.title)+'"></div><div><label class="field-label">Slug *</label><input class="input" name="slug" value="'+escAttr(f.slug)+'" placeholder="my-article"></div></div>'+
      '<div class="grid grid-cols-3 gap-4"><div><label class="field-label">Category</label><select class="select" name="category">'+BLOG_CATS.map(c => '<option '+(f.category===c?'selected':'')+'>'+c+'</option>').join('')+'</select></div><div><label class="field-label">Status</label><select class="select" name="status"><option value="draft" '+(f.status==='draft'?'selected':'')+'>Draft</option><option value="published" '+(f.status==='published'?'selected':'')+'>Published</option></select></div><div><label class="field-label">Author</label><input class="input" name="author" value="'+escAttr(f.author||'')+'"></div></div>'+
      '<div><label class="field-label">Excerpt</label><textarea class="textarea" name="excerpt" rows="2">'+esc(f.excerpt||'')+'</textarea></div>'+
      '<div><label class="field-label">Tags (comma-separated)</label><input class="input" name="tags" value="'+(f.tags||[]).join(', ')+'"></div>'+
      '<div><label class="field-label">Cover Image URL</label><input class="input" name="cover_url" value="'+escAttr(f.cover_url||'')+'" placeholder="https://"></div>'+
      '<div><label class="field-label">Content (Markdown)</label><textarea class="textarea font-mono" name="content" rows="12" style="font-size:.82rem;line-height:1.6">'+esc(f.content||'')+'</textarea></div>'+
    '</div>'+
    '<div class="modal-foot"><div class="text-[11px] mr-auto" style="color:var(--text-mute)">'+(isEdit?'Editing /blog/'+f.slug:'New post')+'</div>'+
      '<button class="btn btn-ghost" data-close>Cancel</button>'+
      '<button id="saveBtn" class="btn btn-primary"><i class="fas fa-save"></i> '+(isEdit?'Save changes':'Publish')+'</button>'+
    '</div></div>';

  const modal = LH.openModal(html);
  const $ = s => modal.querySelector(s);

  $('[name=title]').addEventListener('input', e => {
    if (!isEdit || !$('[name=slug]').value) {
      $('[name=slug]').value = LH.slugify(e.target.value);
    }
  });

  $('#saveBtn').onclick = async () => {
    const data = {
      title: $('[name=title]').value.trim(),
      slug: $('[name=slug]').value.trim(),
      category: $('[name=category]').value,
      status: $('[name=status]').value,
      author: $('[name=author]').value.trim(),
      excerpt: $('[name=excerpt]').value.trim(),
      tags: $('[name=tags]').value.split(',').map(s=>s.trim()).filter(Boolean),
      cover_url: $('[name=cover_url]').value.trim(),
      content: $('[name=content]').value.trim()
    };
    if (!data.title || !data.slug) { LH.toast('error','Title and slug are required'); return; }
    try {
      const url = isEdit ? '/api/admin/blog/'+id : '/api/admin/blog';
      const method = isEdit ? 'PATCH' : 'POST';
      const r = await LH.api(url, { method, body: JSON.stringify(data) });
      LH.toast('success', isEdit?'Post updated':'Post created', r.data.title);
      modal.remove(); load();
    } catch(e) { LH.toast('error','Save failed', e.message); }
  };
}

async function deletePost(id, title) {
  if (!await LH.confirm({ title:'Delete this post?', msg:'"'+title+'" will be permanently deleted.', danger:true })) return;
  try { await LH.api('/api/admin/blog/'+id, { method:'DELETE' }); LH.toast('success','Deleted'); load(); }
  catch(e) { LH.toast('error','Delete failed', e.message); }
}

function fmtDate(d) { try { return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'}); } catch { return d||''; } }
function esc(s) { return String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return String(s||'').replace(/'/g,"\\\\'").replace(/"/g,'&quot;'); }

LH.guardRole(['admin']).then(function(u) { if (u) load(); });
</script>
`)}`;
