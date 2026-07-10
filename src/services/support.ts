// Support service — tickets, FAQ, live chat (spec 1.16)
export interface FaqEntry { id: string; category: string; question: string; answer: string; order: number; created_at: string; }
export interface Ticket { id: string; org_id: string; user_id: string; user_name: string; subject: string; category: string; priority: 'low'|'medium'|'high'|'urgent'; status: 'open'|'in_progress'|'resolved'|'closed'; sla_response_by: string|null; created_at: string; updated_at: string; resolved_at: string|null; }
export interface TicketMessage { id: string; ticket_id: string; author_id: string; author_name: string; body: string; attachments: string[]; is_staff: boolean; created_at: string; }

const PLAN_SLA: Record<string,number> = { free:48, pro:8, business:4, enterprise:1 };

const faqs: FaqEntry[] = [
  { id:'faq-001', category:'getting-started', question:'What is LogoHub API?', answer:'LogoHub is the world\'s largest visual identity API platform, providing access to 100,000+ logos, icons, flags, and brand assets through a simple REST API.', order:1, created_at:new Date().toISOString() },
  { id:'faq-002', category:'getting-started', question:'How do I get an API key?', answer:'Sign up for a free account, go to Dashboard → API Keys, click Create API Key. Your key is shown once — save it!', order:2, created_at:new Date().toISOString() },
  { id:'faq-003', category:'api-usage', question:'How do I authenticate requests?', answer:'Include your key in the Authorization header: Authorization: Bearer lh_live_sk_... or as ?api_key= query param.', order:3, created_at:new Date().toISOString() },
  { id:'faq-004', category:'api-usage', question:'What formats are available?', answer:'SVG (vector), PNG (raster), and WebP (optimized). Use the Accept header or ?format= query param.', order:4, created_at:new Date().toISOString() },
  { id:'faq-005', category:'pricing', question:'What are the rate limits?', answer:'Free:1K/mo, Pro:100K/mo, Business:1M/mo, Enterprise:unlimited. Enforced per API key.', order:5, created_at:new Date().toISOString() },
  { id:'faq-006', category:'pricing', question:'Can I upgrade later?', answer:'Yes! Go to Dashboard → Billing. Upgrades are immediate with prorated charges.', order:6, created_at:new Date().toISOString() },
  { id:'faq-007', category:'security', question:'How do I keep my key secure?', answer:'Use env vars, never commit to git, rotate regularly, use scoped keys per environment.', order:7, created_at:new Date().toISOString() },
  { id:'faq-008', category:'creators', question:'How do I publish my own API?', answer:'Switch to Creator mode, define your API, add endpoints/docs, then publish to the marketplace!', order:8, created_at:new Date().toISOString() },
];

const tickets: Ticket[] = [];
const ticketMsgs: TicketMessage[] = [];

export const support = {
  searchFaq(query:string): FaqEntry[] { const q=query.toLowerCase(); return faqs.filter(f=>f.question.toLowerCase().includes(q)||f.answer.toLowerCase().includes(q)||f.category.toLowerCase().includes(q)); },
  listFaqs(cat?:string): FaqEntry[] { let r=[...faqs]; if(cat) r=r.filter(f=>f.category===cat); return r.sort((a,b)=>a.order-b.order); },
  getFaqCategories(): string[] { return [...new Set(faqs.map(f=>f.category))]; },
  createFaq(e:Omit<FaqEntry,'id'|'created_at'>): FaqEntry { const f:FaqEntry={id:'faq-'+crypto.randomUUID().slice(0,6),...e,order:e.order||faqs.length+1,created_at:new Date().toISOString()}; faqs.push(f); return f; },
  listTickets(orgId:string): Ticket[] { return tickets.filter(t=>t.org_id===orgId).sort((a,b)=>new Date(b.updated_at).getTime()-new Date(a.updated_at).getTime()); },
  getTicket(id:string): Ticket|null { return tickets.find(t=>t.id===id)||null; },
  createTicket(d:{orgId:string;userId:string;userName:string;subject:string;category:string;priority:Ticket['priority'];plan:string}): Ticket {
    const now=new Date(); const slaH=PLAN_SLA[d.plan]||48; const slaBy=new Date(now.getTime()+slaH*3600000);
    const t:Ticket={id:'tkt-'+crypto.randomUUID().slice(0,8),org_id:d.orgId,user_id:d.userId,user_name:d.userName,subject:d.subject,category:d.category,priority:d.priority,status:'open',sla_response_by:slaBy.toISOString(),created_at:now.toISOString(),updated_at:now.toISOString(),resolved_at:null};
    tickets.push(t); return t;
  },
  updateTicketStatus(id:string,status:Ticket['status']): Ticket|null {
    const t=tickets.find(t=>t.id===id); if(!t) return null; t.status=status; t.updated_at=new Date().toISOString();
    if(status==='resolved'||status==='closed') t.resolved_at=new Date().toISOString(); return t;
  },
  listMessages(tid:string): TicketMessage[] { return ticketMsgs.filter(m=>m.ticket_id===tid).sort((a,b)=>new Date(a.created_at).getTime()-new Date(b.created_at).getTime()); },
  addMessage(d:{ticketId:string;authorId:string;authorName:string;body:string;attachments?:string[];isStaff?:boolean}): TicketMessage {
    const m:TicketMessage={id:'msg-'+crypto.randomUUID().slice(0,8),ticket_id:d.ticketId,author_id:d.authorId,author_name:d.authorName,body:d.body,attachments:d.attachments||[],is_staff:d.isStaff||false,created_at:new Date().toISOString()};
    ticketMsgs.push(m); const t=tickets.find(t=>t.id===d.ticketId); if(t){ t.updated_at=new Date().toISOString(); if(t.status==='resolved') t.status='open'; }
    return m;
  },
  getSlaStatus(ticket:Ticket):{ok:boolean;hours_remaining:number} {
    if(!ticket.sla_response_by||ticket.status==='resolved'||ticket.status==='closed') return {ok:true,hours_remaining:-1};
    const remaining=(new Date(ticket.sla_response_by).getTime()-Date.now())/3600000;
    return {ok:remaining>0,hours_remaining:Math.max(0,Math.round(remaining*10)/10)};
  },
};
export default support;
