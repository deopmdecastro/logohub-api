// Admin Support Tickets page
import { HEAD, COMMON_JS } from './shared';
import { sidebar, topbar, shellWrap } from './layout';

export const supportAdminPage = () => `${HEAD('Support — LogoHub Admin', COMMON_JS)}
${shellWrap(sidebar('support'), `
${topbar('Support', 'Manage support tickets and customer inquiries')}
<div class="px-5 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto space-y-5 animate-fade-up">
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative flex-1 min-w-[200px]">
      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[12px]" style="color:var(--text-mute)"></i>
      <input id="sQ" placeholder="Search tickets…" class="input input-pill" oninput="renderTickets()">
    </div>
    <select id="sStatus" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderTickets()">
      <option value="">All statuses</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
    </select>
    <select id="sPriority" class="select" style="border-radius:9999px;padding:.55rem 1rem;width:auto" onchange="renderTickets()">
      <option value="">All priorities</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
    </select>
    <span id="sCount" class="text-[11px] font-medium" style="color:var(--text-mute)">—</span>
    <button class="btn btn-primary ml-auto" onclick="openTicketEditor()"><i class="fas fa-plus"></i> New Ticket</button>
  </div>

  <!-- Stats cards -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="ticketStats"></div>

  <div id="ticketList" class="space-y-3"></div>
</div>

<script>
let TICKETS = [];
const STATUS_ICONS = { open:'fa-circle text-[#4ade80]', in_progress:'fa-spinner fa-spin text-[#f5a623]', resolved:'fa-check-circle text-[#4ecdc4]', closed:'fa-times-circle text-[var(--text-mute)]' };
const PRIORITY_CLASS = { low:'pill-teal', medium:'pill-amber', high:'pill-coral', urgent:'pill-coral' };

async function load() {
  try { const r = await LH.api('/api/admin/support'); TICKETS = r.data||[]; renderStats(); renderTickets(); }
  catch(e) { LH.toast('error','Failed to load tickets', e.message); }
}

function renderStats() {
  const open = TICKETS.filter(t => t.status==='open').length;
  const inProgress = TICKETS.filter(t => t.status==='in_progress').length;
  const resolved = TICKETS.filter(t => t.status==='resolved').length;
  const urgent = TICKETS.filter(t => t.priority==='urgent' && t.status!=='closed' && t.status!=='resolved').length;
  document.getElementById('ticketStats').innerHTML = [
    { label:'Open', value:open, icon:'fa-envelope-open-text', color:'#4ade80' },
    { label:'In Progress', value:inProgress, icon:'fa-spinner', color:'#f5a623' },
    { label:'Resolved', value:resolved, icon:'fa-check-circle', color:'#4ecdc4' },
    { label:'Urgent', value:urgent, icon:'fa-exclamation-triangle', color:'#ff6b6b' },
  ].map(s => '<div class="card p-4 flex items-center gap-3"><div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:'+s.color+'22;color:'+s.color+'"><i class="fas '+s.icon+'"></i></div><div><p class="text-2xl font-black" style="color:var(--text)">'+s.value+'</p><p class="text-[10px] uppercase tracking-wide" style="color:var(--text-mute)">'+s.label+'</p></div></div>').join('');
}

function renderTickets() {
  const q = (document.getElementById('sQ').value||'').toLowerCase();
  const st = document.getElementById('sStatus').value;
  const pr = document.getElementById('sPriority').value;
  let list = TICKETS;
  if (st) list = list.filter(t => t.status === st);
  if (pr) list = list.filter(t => t.priority === pr);
  if (q) list = list.filter(t => (t.subject+' '+t.description+' '+t.email).toLowerCase().includes(q));
  document.getElementById('sCount').textContent = list.length + ' tickets';

  if (!list.length) { document.getElementById('ticketList').innerHTML = '<div class="empty-state"><i class="fas fa-headset text-3xl mb-3 opacity-30 block"></i>No tickets found</div>'; return; }

  document.getElementById('ticketList').innerHTML = list.map(t => {
    const stIcon = STATUS_ICONS[t.status] || 'fa-circle';
    const prClass = PRIORITY_CLASS[t.priority] || 'pill-teal';
    return '<div class="card p-4 flex items-start gap-4 hover:bg-[var(--panel-2)] transition-colors cursor-pointer" onclick="openTicket(\\''+t.id+'\\')">'+
      '<i class="fas '+stIcon+' mt-1"></i>'+
      '<div class="flex-1 min-w-0">'+
        '<div class="flex items-center gap-2 mb-1">'+
          '<h3 class="text-sm font-semibold" style="color:var(--text)">'+esc(t.subject)+'</h3>'+
          '<span class="pill '+prClass+' ml-auto">'+t.priority+'</span>'+
        '</div>'+
        '<p class="text-xs mb-2" style="color:var(--text-soft)">'+esc(t.description||'')+'</p>'+
        '<div class="flex items-center gap-3 text-[10px]" style="color:var(--text-mute)">'+
          '<span><i class="fas fa-user"></i> '+esc(t.name||'Anonymous')+'</span>'+
          '<span><i class="fas fa-envelope"></i> '+esc(t.email||'')+'</span>'+
          '<span>'+fmtDate(t.created_at)+'</span>'+
          '<span class="pill pill-neutral">#'+t.id+'</span>'+
        '</div>'+
      '</div>'+
      '<div class="flex items-center gap-1 shrink-0">'+
        '<button class="btn btn-ghost btn-icon-sm" onclick="event.stopPropagation();openTicketEditor(\\''+t.id+'\\')"><i class="fas fa-pen text-[10px]"></i></button>'+
        '<button class="btn btn-danger btn-icon-sm" onclick="event.stopPropagation();deleteTicket(\\''+t.id+'\\',\\''+escAttr(t.subject)+'\\')"><i class="fas fa-trash text-[10px]"></i></button>'+
      '</div>'+
    '</div>';
  }).join('');
}

function openTicket(id) {
  const t = TICKETS.find(x => x.id===id);
  if (!t) return;
  const stCls = { open:'pill-green', in_progress:'pill-amber', resolved:'pill-teal', closed:'pill-neutral' }[t.status] || 'pill-neutral';

  const html = '<div class="modal-box" style="max-width:700px"><div class="modal-head">'+
    '<h2 class="text-base font-bold" style="color:var(--text)">#'+t.id+' — '+esc(t.subject)+'</h2>'+
    '<button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<div class="modal-body space-y-4">'+
      '<div class="flex items-center gap-3">'+
        '<span class="pill '+stCls+'">'+t.status+'</span>'+
        '<span class="pill '+(PRIORITY_CLASS[t.priority]||'pill-teal')+'">'+t.priority+'</span>'+
        '<span class="text-xs" style="color:var(--text-mute)">Created '+fmtDate(t.created_at)+'</span>'+
      '</div>'+
      '<div class="grid grid-cols-2 gap-3"><div><label class="field-label">Name</label><p class="text-sm" style="color:var(--text)">'+esc(t.name||'—')+'</p></div><div><label class="field-label">Email</label><p class="text-sm" style="color:var(--text)">'+esc(t.email||'—')+'</p></div></div>'+
      '<div><label class="field-label">Description</label><div class="card p-4 mt-1" style="background:var(--panel-2);color:var(--text-soft);white-space:pre-wrap;font-size:.85rem">'+esc(t.description||'No description')+'</div></div>'+
      '<div><label class="field-label">Internal Notes</label><textarea class="textarea" id="ticketNotes" rows="3" placeholder="Add internal notes…">'+esc(t.notes||'')+'</textarea></div>'+
    '</div>'+
    '<div class="modal-foot">'+
      '<div class="flex items-center gap-2 mr-auto">'+
        '<select class="select" id="ticketStatus" style="font-size:.8rem">'+
          '<option value="open" '+(t.status==='open'?'selected':'')+'>Open</option>'+
          '<option value="in_progress" '+(t.status==='in_progress'?'selected':'')+'>In Progress</option>'+
          '<option value="resolved" '+(t.status==='resolved'?'selected':'')+'>Resolved</option>'+
          '<option value="closed" '+(t.status==='closed'?'selected':'')+'>Closed</option>'+
        '</select>'+
        '<select class="select" id="ticketPriority" style="font-size:.8rem">'+
          ['low','medium','high','urgent'].map(p => '<option value="'+p+'" '+(t.priority===p?'selected':'')+'>'+p.charAt(0).toUpperCase()+p.slice(1)+'</option>').join('')+
        '</select>'+
      '</div>'+
      '<button class="btn btn-ghost" data-close>Close</button>'+
      '<button id="saveTicketBtn" class="btn btn-primary"><i class="fas fa-save"></i> Save</button>'+
    '</div></div>';

  const modal = LH.openModal(html);
  modal.querySelector('#saveTicketBtn').onclick = async () => {
    const data = {
      status: modal.querySelector('#ticketStatus').value,
      priority: modal.querySelector('#ticketPriority').value,
      notes: modal.querySelector('#ticketNotes').value.trim(),
    };
    try {
      await LH.api('/api/admin/support/'+id, { method:'PATCH', body: JSON.stringify(data) });
      LH.toast('success','Ticket updated');
      modal.remove(); load();
    } catch(e) { LH.toast('error','Update failed', e.message); }
  };
}

function openTicketEditor(id) {
  const t = id ? TICKETS.find(x => x.id===id) : null;
  const isEdit = !!t;
  const f = t || { subject:'', description:'', name:'', email:'', priority:'medium', status:'open', notes:'' };

  const html = '<div class="modal-box" style="max-width:550px"><div class="modal-head">'+
    '<h2 class="text-base font-bold" style="color:var(--text)">'+(isEdit?'Edit Ticket':'New Support Ticket')+'</h2>'+
    '<button class="btn btn-ghost btn-icon" data-close><i class="fas fa-times"></i></button></div>'+
    '<div class="modal-body space-y-4">'+
      '<div><label class="field-label">Subject *</label><input class="input" name="subject" value="'+escAttr(f.subject)+'" placeholder="Brief description"></div>'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Customer Name</label><input class="input" name="name" value="'+escAttr(f.name||'')+'"></div><div><label class="field-label">Email</label><input class="input" name="email" value="'+escAttr(f.email||'')+'"></div></div>'+
      '<div class="grid grid-cols-2 gap-4"><div><label class="field-label">Priority</label><select class="select" name="priority">'+['low','medium','high','urgent'].map(p => '<option value="'+p+'" '+(f.priority===p?'selected':'')+'>'+p.charAt(0).toUpperCase()+p.slice(1)+'</option>').join('')+'</select></div><div><label class="field-label">Status</label><select class="select" name="status">'+['open','in_progress','resolved','closed'].map(s => '<option value="'+s+'" '+(f.status===s?'selected':'')+'>'+s.replace('_',' ').replace(/\\b\\w/g,l=>l.toUpperCase())+'</option>').join('')+'</select></div></div>'+
      '<div><label class="field-label">Description</label><textarea class="textarea" name="description" rows="4" placeholder="Detailed issue description…">'+esc(f.description||'')+'</textarea></div>'+
    '</div>'+
    '<div class="modal-foot">'+
      '<button class="btn btn-ghost" data-close>Cancel</button>'+
      '<button id="saveBtn" class="btn btn-primary"><i class="fas fa-save"></i> '+(isEdit?'Save changes':'Create ticket')+'</button>'+
    '</div></div>';

  const modal = LH.openModal(html);
  const $ = s => modal.querySelector(s);
  $('#saveBtn').onclick = async () => {
    const data = {
      subject: $('[name=subject]').value.trim(),
      description: $('[name=description]').value.trim(),
      name: $('[name=name]').value.trim(),
      email: $('[name=email]').value.trim(),
      priority: $('[name=priority]').value,
      status: $('[name=status]').value,
    };
    if (!data.subject) { LH.toast('error','Subject is required'); return; }
    try {
      const url = isEdit ? '/api/admin/support/'+id : '/api/admin/support';
      const method = isEdit ? 'PATCH' : 'POST';
      const r = await LH.api(url, { method, body: JSON.stringify(data) });
      LH.toast('success', isEdit?'Ticket updated':'Ticket created', r.data.subject);
      modal.remove(); load();
    } catch(e) { LH.toast('error','Save failed', e.message); }
  };
}

async function deleteTicket(id, subject) {
  if (!await LH.confirm({ title:'Delete this ticket?', msg:'"'+subject+'" will be permanently deleted.', danger:true })) return;
  try { await LH.api('/api/admin/support/'+id, { method:'DELETE' }); LH.toast('success','Deleted'); load(); }
  catch(e) { LH.toast('error','Delete failed', e.message); }
}

function fmtDate(d) { try { return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}); } catch { return d||''; } }
function esc(s) { return String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return String(s||'').replace(/'/g,"\\\\'").replace(/"/g,'&quot;'); }

load();
</script>
`)}`;
