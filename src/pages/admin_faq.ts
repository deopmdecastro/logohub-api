// Admin FAQ management page
import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap } from './layout';

export const faqAdminPage = () => `${HEAD('FAQ — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('faq'), `
${topbar('FAQ', 'Manage frequently asked questions')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative flex-1 min-w-[200px]">
      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[12px]" style="color:var(--text-mute)"></i>
      <input id="fQ" placeholder="Search questions…" class="input input-pill" oninput="renderFAQ()">
    </div>
    <select id="fCat" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderFAQ()"><option value="">All categories</option></select>
    <select id="fStatus" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderFAQ()">
      <option value="">All</option><option value="published">Published</option><option value="draft">Draft</option>
    </select>
    <span id="fCount" class="text-[11px] font-medium" style="color:var(--text-mute)">—</span>
    <button class="btn btn-primary ml-auto" onclick="openFAQEditor()"><i class="fas fa-plus"></i> Add Question</button>
  </div>

  <div id="fList" class="space-y-3"></div>
</div>

<script>
let FAQ = [];
const FAQ_CATS = ['Getting Started','API Keys','Pricing & Plans','Logos & Assets','Technical','Account & Billing','Integrations'];

async function load() {
  try { const r = await LH.api('/api/admin/faq'); FAQ = r.data||[]; renderFilters(); renderFAQ(); }
  catch(e) { LH.toast('error','Failed to load FAQ', e.message); }
}
function renderFilters() {
  document.getElementById('fCat').innerHTML = '<option value="">All categories</option>' +
    FAQ_CATS.map(c => '<option value="'+c+'">'+c+'</option>').join('');
}
function renderFAQ() {
  const q = (document.getElementById('fQ').value||'').toLowerCase();
  const cat = document.getElementById('fCat').value;
  const st = document.getElementById('fStatus').value;
  let list = FAQ;
  if (cat) list = list.filter(f => f.category === cat);
  if (st) list = list.filter(f => f.status === st);
  if (q) list = list.filter(f => (f.question+' '+f.answer).toLowerCase().includes(q));
  document.getElementById('fCount').textContent = list.length + ' questions';

  if (!list.length) { document.getElementById('fList').innerHTML = '<div class="empty-state"><i class="fas fa-question-circle text-3xl mb-3 opacity-30 block"></i>No questions yet</div>'; return; }

  document.getElementById('fList').innerHTML = list.map(f => {
    const stCls = f.status==='published'?'pill-green':'pill-amber';
    return '<div class="card p-4 flex items-start gap-4">'+
      '<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:var(--lilac);color:#1a1a1a"><i class="fas fa-question"></i></div>'+
      '<div class="flex-1 min-w-0">'+
        '<div class="flex items-center gap-2 mb-1">'+
          '<h3 class="text-sm font-semibold" style="color:var(--text)">'+esc(f.question)+'</h3>'+
          '<span class="pill '+stCls+' ml-2">'+f.status+'</span>'+
          (f.category ? '<span class="pill pill-teal">'+esc(f.category)+'</span>' : '')+
        '</div>'+
        '<p class="text-xs mb-2" style="color:var(--text-soft);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">'+esc(f.answer||'')+'</p>'+
        '<div class="flex items-center gap-1">'+
          (f.tags||[]).slice(0,4).map(t => '<span class="pill pill-neutral" style="font-size:9px">'+esc(t)+'</span>').join('')+
        '</div>'+
      '</div>'+
      '<div class="flex items-center gap-1 shrink-0">'+
        '<button class="btn btn-ghost btn-icon-sm" onclick="openFAQEditor(\\''+f.id+'\\')"><i class="fas fa-pen text-[10px]"></i></button>'+
        '<button class="btn btn-danger btn-icon-sm" onclick="deleteFAQ(\\''+f.id+'\\',\\''+escAttr(f.question)+'\\')"><i class="fas fa-trash text-[10px]"></i></button>'+
      '</div>'+
    '</div>';
  }).join('');
}

function openFAQEditor(id) {
  const item = id ? FAQ.find(f => f.id===id) : null;
  const isEdit = !!item;
  const f = item || { question:'', answer:'', category:'Getting Started', tags:[], status:'published' };

  const html = '<div class="modal-box" style="max-width:650px"><div class="modal-head">'+
    '<h2 class="text-base font-bold" style="color:var(--text)">'+(isEdit?'Edit Question':'New FAQ')+'</h2>'+
    '<button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<div class="modal-body space-y-4">'+
      '<div><label class="field-label">Question *</label><input class="input" name="question" value="'+escAttr(f.question)+'" placeholder="e.g. How do I get an API key?"></div>'+
      '<div><label class="field-label">Answer *</label><textarea class="textarea" name="answer" rows="6" placeholder="Detailed answer…">'+esc(f.answer||'')+'</textarea></div>'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Category</label><select class="select" name="category">'+FAQ_CATS.map(c => '<option '+(f.category===c?'selected':'')+'>'+c+'</option>').join('')+'</select></div><div><label class="field-label">Status</label><select class="select" name="status"><option value="draft" '+(f.status==='draft'?'selected':'')+'>Draft</option><option value="published" '+(f.status==='published'?'selected':'')+'>Published</option></select></div></div>'+
      '<div><label class="field-label">Tags (comma-separated)</label><input class="input" name="tags" value="'+(f.tags||[]).join(', ')+'" placeholder="api, getting-started"></div>'+
    '</div>'+
    '<div class="modal-foot">'+
      '<button class="btn btn-ghost" data-close>Cancel</button>'+
      '<button id="saveBtn" class="btn btn-primary"><i class="fas fa-save"></i> '+(isEdit?'Save changes':'Add question')+'</button>'+
    '</div></div>';

  const modal = LH.openModal(html);
  const $ = s => modal.querySelector(s);

  $('#saveBtn').onclick = async () => {
    const data = {
      question: $('[name=question]').value.trim(),
      answer: $('[name=answer]').value.trim(),
      category: $('[name=category]').value,
      status: $('[name=status]').value,
      tags: $('[name=tags]').value.split(',').map(s=>s.trim()).filter(Boolean),
    };
    if (!data.question || !data.answer) { LH.toast('error','Question and answer are required'); return; }
    try {
      const url = isEdit ? '/api/admin/faq/'+id : '/api/admin/faq';
      const method = isEdit ? 'PATCH' : 'POST';
      const r = await LH.api(url, { method, body: JSON.stringify(data) });
      LH.toast('success', isEdit?'FAQ updated':'FAQ added', r.data.question);
      modal.remove(); load();
    } catch(e) { LH.toast('error','Save failed', e.message); }
  };
}

async function deleteFAQ(id, question) {
  if (!await LH.confirm({ title:'Delete this question?', msg:'"'+question+'" will be permanently deleted.', danger:true })) return;
  try { await LH.api('/api/admin/faq/'+id, { method:'DELETE' }); LH.toast('success','Deleted'); load(); }
  catch(e) { LH.toast('error','Delete failed', e.message); }
}

function esc(s) { return String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return String(s||'').replace(/'/g,"\\\\'").replace(/"/g,'&quot;'); }

LH.guardRole(['admin']).then(function(u) { if (u) load(); });
</script>
`)}`;
