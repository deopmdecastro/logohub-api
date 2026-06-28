import { DICT } from "./i18n";
// Shared head, css and helpers for all pages — premium SaaS look.
export const HEAD = (title: string, extraScripts: string = '') => `<!DOCTYPE html>
<html lang="${LANG}" class="" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<meta name="theme-color" content="#0a0a0f">
<title>${title}</title>
<script>
(function(){
  var L="en";
  try{
    var p=new URLSearchParams(location.search),u=p.get("lang");
    if(u==="pt"||u==="en")L=u;
    else{var s=localStorage.getItem("lang");if(s==="pt"||s==="en")L=s;else if(navigator.language&&navigator.language.indexOf("pt")===0)L="pt";}
  }catch(e){}
  window.__LANG=L;localStorage.setItem("lang",L);document.documentElement.lang=L;
  window.__DICT = {

  // NAVEGAÇÃO
  'nav.docs':              { pt: 'Documentação', en: 'Docs' },
  'nav.explorer':          { pt: 'Explorar', en: 'Explorer' },
  'nav.playground':        { pt: 'Testar', en: 'Playground' },
  'nav.blog':              { pt: 'Blog', en: 'Blog' },
  'nav.faq':               { pt: 'FAQ', en: 'FAQ' },
  'nav.pricing':           { pt: 'Preços', en: 'Pricing' },
  'nav.login':             { pt: 'Entrar', en: 'Log in' },
  'nav.signup':            { pt: 'Criar conta', en: 'Sign up' },
  'nav.getApiKey':         { pt: 'Obter API Key', en: 'Get API Key' },
  'nav.logout':            { pt: 'Sair', en: 'Sign out' },

  // LANDING PAGE
  'landing.hero_title':    { pt: 'A Maior<br>API de Identidade Visual', en: "The World's Largest<br>Visual Identity API" },
  'landing.hero_subtitle': { pt: 'Mais de <strong>50.000+</strong> logótipos, ícones, bandeiras, emblemas desportivos e logos cripto. REST API ultrarrápida com CDN global.', en: 'Access <strong>50,000+</strong> logos, brand icons, flags, sports emblems, crypto logos and more through our lightning-fast REST API and global CDN.' },
  'landing.search_placeholder':{ pt: 'Pesquisar: google, bitcoin, react...', en: 'Search: google, bitcoin, react...' },
  'landing.try':           { pt: 'Experimenta:', en: 'Try:' },
  'landing.read_docs':     { pt: 'Ler Documentação', en: 'Read the Docs' },
  'landing.explore_assets':{ pt: 'Explorar Assets', en: 'Explore Assets' },
  'landing.browse_category':{ pt: 'Explorar por Categoria', en: 'Browse by Category' },
  'landing.popular_brands':{ pt: 'Marcas e Assets Populares', en: 'Popular Brands & Assets' },
  'landing.api_title':     { pt: 'Simples. Consistente. Poderosa.', en: 'Simple. Consistent. Powerful.' },
  'landing.api_subtitle':  { pt: 'Uma API unificada para identidade visual.', en: 'One unified API for all your visual identity needs.' },
  'landing.features_title':{ pt: 'Feita para Programadores', en: 'Built for Developers' },
  'landing.features_subtitle':{ pt: 'Tudo o que precisas, sem preocupações com assets.', en: 'Everything you need without worrying about visual assets.' },
  'landing.pricing_section':{ pt: 'Preços', en: 'Pricing' },
  'landing.pricing_title': { pt: 'Preços Simples e Transparentes', en: 'Simple Transparent Pricing' },
  'landing.cta_title':     { pt: 'Pronto para Começar?', en: 'Ready to Build?' },
  'landing.cta_subtitle':  { pt: 'Mais de 10.000 programadores já usam a LogoHub API. Começa grátis.', en: "Join 10,000+ developers using LogoHub API. Start free." },
  'landing.cta_button':    { pt: 'Criar conta grátis', en: 'Get your free API key' },
  'landing.status_online': { pt: 'API Online · ', en: 'API Online · ' },
  'landing.requests_today':{ pt: ' pedidos hoje · ', en: ' requests today · ' },
  'landing.ms_avg':        { pt: 'ms média', en: 'ms avg' },
  'landing.operational':   { pt: 'Todos os sistemas operacionais', en: 'All systems operational' },
  'landing.footer_product':{ pt: 'Produto', en: 'Product' },
  'landing.footer_resources':{ pt: 'Recursos', en: 'Resources' },
  'landing.footer_company':{ pt: 'Empresa', en: 'Company' },
  'landing.footer_copyright':{ pt: '© 2026 LogoHub API. Todos os direitos reservados.', en: '© 2026 LogoHub API. All rights reserved.' },
  'landing.pricing.free':  { pt: 'Grátis', en: 'Free' },
  'landing.pricing.free.period':{ pt: '/para sempre', en: '/forever' },
  'landing.pricing.free.desc':{ pt: 'Para hobby e projetos pessoais', en: 'For hobbyists & side projects' },
  'landing.pricing.free.cta':{ pt: 'Começar Grátis', en: 'Start Free' },
  'landing.feature1_title':{ pt: 'Ultrarrápida', en: 'Lightning Fast' },
  'landing.feature1_desc': { pt: 'Respostas em 18ms com cache global.', en: '18ms avg response with global edge caching.' },
  'landing.feature2_title':{ pt: 'Empresarial', en: 'Enterprise Ready' },
  'landing.feature2_desc': { pt: '99.99% SLA, rate limiting, API keys, analytics.', en: '99.99% SLA, rate limiting, API keys, analytics.' },
  'landing.feature3_title':{ pt: 'Múltiplos Formatos', en: 'Multiple Formats' },
  'landing.feature3_desc': { pt: 'SVG, PNG, WEBP, JPG, ICO e AVIF.', en: 'SVG, PNG, WEBP, JPG, ICO and AVIF.' },
  'landing.feature4_title':{ pt: 'Pesquisa Inteligente', en: 'Smart Search' },
  'landing.feature4_desc': { pt: 'Fuzzy search com aliases e correção de erros.', en: 'Fuzzy search with aliases and typo correction.' },
  'landing.feature5_title':{ pt: '7 SDKs Oficiais', en: '7 Official SDKs' },
  'landing.feature6_title':{ pt: 'Webhooks', en: 'Webhooks & Events' },
  'landing.feature6_desc': { pt: 'Notificações quando assets são atualizados.', en: 'Get notified when assets are updated.' },
  'landing.feature7_title':{ pt: 'Paletas de Cores', en: 'Color Palettes' },
  'landing.feature7_desc': { pt: 'Extração automática de cores dos assets.', en: 'Auto color extraction from every asset.' },
  'landing.feature8_title':{ pt: 'CDN Global', en: 'Global CDN' },
  'landing.feature8_desc': { pt: 'Mais de 200 localizações edge.', en: '200+ edge locations worldwide.' },
  'landing.feature9_title':{ pt: 'API Versionada', en: 'Versioned API' },
  'landing.feature9_desc': { pt: 'API v1 estável, sem breaking changes.', en: 'Stable v1 API, no breaking changes.' },

  // AUTH
  'auth.login_title':      { pt: 'Entrar', en: 'Sign in' },
  'auth.welcome_back':     { pt: 'Bem-vindo de volta', en: 'Welcome back' },
  'auth.access_platform':  { pt: 'Acede a mais de 50.000 logótipos e ícones.', en: 'Access 50,000+ logos and visual assets.' },
  'auth.fast_api':         { pt: 'API Rápida', en: 'Fast API' },
  'auth.fast_api.desc':    { pt: 'Respostas <20ms', en: 'Sub-20ms responses' },
  'auth.secure':           { pt: 'Seguro', en: 'Secure' },
  'auth.secure.desc':      { pt: 'Autenticação API key', en: 'API key auth' },
  'auth.credentials':      { pt: 'Introduz as tuas credenciais', en: 'Enter your credentials to continue' },
  'auth.quick_fill':       { pt: 'CONTAS DEMO', en: 'DEMO ACCOUNTS' },
  'auth.or':               { pt: 'OU', en: 'OR' },
  'auth.email':            { pt: 'EMAIL', en: 'EMAIL' },
  'auth.password':         { pt: 'PALAVRA-PASSE', en: 'PASSWORD' },
  'auth.forgot_password':  { pt: 'Esqueceste a palavra-passe?', en: 'Forgot password?' },
  'auth.sign_in_btn':      { pt: 'Entrar', en: 'Sign in' },
  'auth.no_account':       { pt: 'Não tens conta?', en: "Don't have an account?" },
  'auth.create_one':       { pt: 'Criar uma', en: 'Create one' },
  'auth.login_failed':     { pt: 'Falha no login', en: 'Login failed' },
  'auth.register_heading': { pt: 'Criar Conta', en: 'Get started' },
  'auth.register_subtitle':{ pt: 'Cria a tua conta e começa a usar a API.', en: 'Create your account and start using the API.' },
  'auth.register_name':    { pt: 'NOME', en: 'NAME' },
  'auth.register_name_ph': { pt: 'O teu nome', en: 'Your name' },
  'auth.register_email_ph':{ pt: 'tu@exemplo.com', en: 'you@example.com' },
  'auth.register_password_ph':{ pt: 'Mín. 8 caracteres', en: 'Min. 8 characters' },
  'auth.register_role':    { pt: 'FUNÇÃO', en: 'ROLE' },
  'auth.register_btn':     { pt: 'Criar conta', en: 'Create account' },
  'auth.have_account':     { pt: 'Já tens conta?', en: 'Already have an account?' },
  'auth.go_login':         { pt: 'Entrar', en: 'Log in' },
  'auth.register_failed':  { pt: 'Falha no registo', en: 'Registration failed' },

  // DASHBOARD / SIDEBAR
  'dashboard.overview':    { pt: 'Visão Geral', en: 'Overview' },
  'dashboard.users':       { pt: 'Utilizadores', en: 'Users' },
  'dashboard.api_keys':    { pt: 'API Keys', en: 'API Keys' },
  'dashboard.content':     { pt: 'Conteúdo', en: 'Content' },
  'dashboard.blog':        { pt: 'Blog', en: 'Blog' },
  'dashboard.faq':         { pt: 'FAQ', en: 'FAQ' },
  'dashboard.support':     { pt: 'Suporte', en: 'Support' },
  'dashboard.analytics':   { pt: 'Análises', en: 'Analytics' },
  'dashboard.activity':    { pt: 'Atividade', en: 'Activity' },
  'dashboard.billing':     { pt: 'Faturação', en: 'Billing' },
  'dashboard.team':        { pt: 'Equipa', en: 'Team' },
  'dashboard.settings':    { pt: 'Definições', en: 'Settings' },
  'dashboard.notifications':{ pt: 'Notificações', en: 'Notifications' },
  'dashboard.my_profile':  { pt: 'Meu Perfil', en: 'My Profile' },
  'dashboard.admin_plan':  { pt: 'Plano Admin', en: 'Admin Plan' },
  'dashboard.manage_billing':{ pt: 'Gerir faturação', en: 'Manage billing' },

  // USER MANAGEMENT
  'users.title':           { pt: 'Gestão de Utilizadores', en: 'User Management' },
  'users.subtitle':        { pt: 'Gerir utilizadores: banir, bloquear, redefinir senhas', en: 'Manage all users: ban, block, reset passwords' },
  'users.total':           { pt: 'Total de Utilizadores', en: 'Total Users' },
  'users.active':          { pt: 'Ativos', en: 'Active' },
  'users.creators':        { pt: 'Criadores', en: 'Creators' },
  'users.banned':          { pt: 'Banidos', en: 'Banned' },
  'users.search_placeholder':{ pt: 'Pesquisar por nome ou email...', en: 'Search by name or email...' },
  'users.all_roles':       { pt: 'Todas as funções', en: 'All roles' },
  'users.all_plans':       { pt: 'Todos os planos', en: 'All plans' },
  'users.all_statuses':    { pt: 'Todos os estados', en: 'All statuses' },
  'users.no_results':      { pt: 'Nenhum utilizador encontrado', en: 'No users found' },
  'users.try_filters':     { pt: 'Tenta ajustar os filtros', en: 'Try adjusting the filters' },
  'users.create_user':     { pt: 'Criar utilizador', en: 'Create user' },
  'users.create_title':    { pt: 'Criar Utilizador', en: 'Create User' },
  'users.create_subtitle': { pt: 'Adicionar novo utilizador à plataforma', en: 'Add a new user to the platform' },
  'users.full_name_req':   { pt: 'Nome Completo *', en: 'Full Name *' },
  'users.email_req':       { pt: 'Email *', en: 'Email *' },
  'users.password_req':    { pt: 'Palavra-passe *', en: 'Password *' },
  'users.send_welcome':    { pt: 'Enviar email de boas-vindas', en: 'Send welcome email' },
  'users.send_welcome.desc':{ pt: 'Enviar email com instruções de acesso', en: 'Send welcome email with login instructions' },
  'users.created':         { pt: 'Utilizador criado!', en: 'User created!' },
  'users.can_login':       { pt: 'já pode iniciar sessão.', en: 'can now log in.' },
  'users.updated':         { pt: 'Utilizador atualizado', en: 'User updated' },
  'users.deleted':         { pt: 'Utilizador eliminado', en: 'User deleted' },
  'users.banned_msg':      { pt: 'Utilizador banido', en: 'User banned' },
  'users.unbanned':        { pt: 'Utilizador desbanido', en: 'User unbanned' },
  'users.password_reset':  { pt: 'Senha redefinida', en: 'Password reset' },
  'users.edit_title':      { pt: 'Editar Utilizador', en: 'Edit User' },
  'users.reset_password':  { pt: 'Redefinir Senha', en: 'Reset Password' },
  'users.new_pass_ph':     { pt: 'Introduz nova senha...', en: 'Enter new password...' },
  'users.ban_confirm_title':{ pt: 'Banir este utilizador?', en: 'Ban this user?' },
  'users.ban_confirm_msg': { pt: 'Não poderá iniciar sessão. As suas keys serão revogadas.', en: 'They will not be able to log in and their keys will be revoked.' },
  'users.delete_confirm_title':{ pt: 'Eliminar utilizador?', en: 'Delete this user?' },
  'users.delete_confirm_msg':{ pt: 'Todos os dados serão permanentemente removidos.', en: 'All their data will be permanently removed.' },
  'users.requests':        { pt: 'Pedidos', en: 'Requests' },
  'users.this_month':      { pt: 'este mês', en: 'this month' },
  'users.load_failed':     { pt: 'Falha ao carregar utilizadores', en: 'Failed to load users' },
  'users.save_failed':     { pt: 'Falha ao guardar', en: 'Save failed' },
  'users.create_failed':   { pt: 'Falha ao criar', en: 'Create failed' },
  'users.name_email_required':{ pt: 'Nome, email e palavra-passe são obrigatórios', en: 'Name, email, and password are required' },
  'users.password_min':    { pt: 'A palavra-passe deve ter pelo menos 8 caracteres', en: 'Password must be at least 8 characters' },
  'users.valid_password':  { pt: 'Introduz uma senha válida (mín. 8 caracteres)', en: 'Enter a valid password (min. 8 chars)' },

  // ROLES / STATUS / PLANS
  'role.admin':            { pt: 'Admin', en: 'Admin' },
  'role.creator':          { pt: 'Criador', en: 'Creator' },
  'role.consumer':         { pt: 'Consumidor', en: 'Consumer' },
  'role.editor':           { pt: 'Editor', en: 'Editor' },
  'role.viewer':           { pt: 'Visualizador', en: 'Viewer' },
  'role.billing':          { pt: 'Faturação', en: 'Billing' },
  'status.active':         { pt: 'Ativo', en: 'Active' },
  'status.inactive':       { pt: 'Inativo', en: 'Inactive' },
  'status.suspended':      { pt: 'Suspenso', en: 'Suspended' },
  'status.banned':         { pt: 'Banido', en: 'Banned' },
  'status.invited':        { pt: 'Convidado', en: 'Invited' },
  'plan.free':             { pt: 'Grátis', en: 'Free' },
  'plan.pro':              { pt: 'Pro', en: 'Pro' },
  'plan.business':         { pt: 'Business', en: 'Business' },
  'plan.enterprise':       { pt: 'Enterprise', en: 'Enterprise' },

  // TEAM
  'team.title':            { pt: 'Equipa', en: 'Team' },
  'team.subtitle':         { pt: 'Convidar e gerir membros', en: 'Invite and manage members' },
  'team.members':          { pt: 'membros', en: 'members' },
  'team.invite_btn':       { pt: 'Convidar utilizador', en: 'Invite user' },
  'team.invite_title':     { pt: 'Convidar membro da equipa', en: 'Invite team member' },
  'team.invite_subtitle':  { pt: 'Enviar convite por email', en: 'Send an email invitation to join your team' },
  'team.edit_title':       { pt: 'Editar membro', en: 'Edit member' },
  'team.edit_subtitle':    { pt: 'Atualizar função, plano ou estado', en: 'Update role, plan, or status' },
  'team.send_invite':      { pt: 'Enviar email de convite', en: 'Send invitation email' },
  'team.send_now':         { pt: 'Enviar convite agora', en: 'Send invitation now' },
  'team.invitation_sent':  { pt: 'Convite enviado!', en: 'Invitation sent!' },
  'team.updated':          { pt: 'Membro atualizado', en: 'Member updated' },
  'team.removed':          { pt: 'Removido', en: 'Removed' },
  'team.remove_confirm':   { pt: 'Remover membro?', en: 'Remove member?' },
  'team.no_members':       { pt: 'Nenhum membro na equipa', en: 'No team members yet' },
  'team.load_failed':      { pt: 'Falha ao carregar', en: 'Load failed' },
  'team.save_failed':      { pt: 'Falha ao guardar', en: 'Save failed' },

  // CONTENT
  'content.title':         { pt: 'Conteúdo', en: 'Content' },
  'content.subtitle':      { pt: 'Upload drag & drop · paleta automática · preview', en: 'Drag & drop uploads · auto palette · live preview' },
  'content.search_placeholder':{ pt: 'Pesquisar por nome, slug, tag…', en: 'Search by name, slug, tag…' },
  'content.all_categories':{ pt: 'Todas as categorias', en: 'All categories' },
  'content.all_statuses':  { pt: 'Todos os estados', en: 'All statuses' },
  'content.new_content':   { pt: 'Novo conteúdo', en: 'New content' },
  'content.no_matches':    { pt: 'Nenhum conteúdo encontrado', en: 'No content matches your filters' },
  'content.edit_content':  { pt: 'Editar conteúdo', en: 'Edit content' },
  'content.new_content_title':{ pt: 'Novo conteúdo', en: 'New content' },
  'content.deleted':       { pt: 'Eliminado', en: 'Deleted' },
  'content.published':     { pt: 'Publicado', en: 'Published' },
  'content.draft':         { pt: 'Rascunho', en: 'Draft' },
  'content.review':        { pt: 'Em revisão', en: 'Review' },
  'content.rejected':      { pt: 'Rejeitado', en: 'Rejected' },
  'content.verified':      { pt: 'Verificado', en: 'Verified' },

  // SETTINGS
  'settings.title':        { pt: 'Definições', en: 'Settings' },
  'settings.subtitle':     { pt: 'Plataforma, Git, branding e estatísticas', en: 'Platform, Git integration, branding and stats' },
  'settings.general':      { pt: 'Geral', en: 'General' },
  'settings.git':          { pt: 'Git', en: 'Git' },
  'settings.brand':        { pt: 'Marca', en: 'Brand' },
  'settings.stats':        { pt: 'Estatísticas', en: 'Stats' },

  // NOTIFICATIONS
  'notifications.title':   { pt: 'Notificações', en: 'Notifications' },
  'notifications.subtitle':{ pt: 'Alertas do sistema e atualizações', en: 'System alerts and updates' },
  'notifications.mark_read':{ pt: 'Marcar todas como lidas', en: 'Mark all as read' },
  'notifications.no_notifs':{ pt: 'Sem notificações', en: 'No notifications' },

  // PROFILE
  'profile.title':         { pt: 'Perfil', en: 'Profile' },
  'profile.subtitle':      { pt: 'Gerir a tua conta', en: 'Manage your account and preferences' },

  // BOTOES / GERAL
  'btn.cancel':            { pt: 'Cancelar', en: 'Cancel' },
  'btn.save':              { pt: 'Guardar', en: 'Save' },
  'btn.save_changes':      { pt: 'Guardar alterações', en: 'Save changes' },
  'btn.create':            { pt: 'Criar', en: 'Create' },
  'btn.delete':            { pt: 'Eliminar', en: 'Delete' },
  'btn.edit':              { pt: 'Editar', en: 'Edit' },
  'btn.refresh':           { pt: 'Atualizar', en: 'Refresh' },
  'btn.invite':            { pt: 'Convidar', en: 'Invite' },
  'btn.search':            { pt: 'Pesquisar', en: 'Search' },
  'form.name':             { pt: 'Nome', en: 'Name' },
  'form.email':            { pt: 'Email', en: 'Email' },
  'form.password':         { pt: 'Palavra-passe', en: 'Password' },
  'form.role':             { pt: 'Função', en: 'Role' },
  'form.plan':             { pt: 'Plano', en: 'Plan' },
  'form.status':           { pt: 'Estado', en: 'Status' },
  'form.bio':              { pt: 'Bio', en: 'Bio' },
  'form.company':          { pt: 'Empresa', en: 'Company' },
  'form.optional':         { pt: 'Opcional', en: 'Optional' },
  'form.email_placeholder':{ pt: 'exemplo@email.com', en: 'name@example.com' },
};
  window.__T=function(k){var e=window.__DICT[k];if(!e)return k;return e[window.__LANG]||e.en||k};
  document.addEventListener("DOMContentLoaded",function(){
    document.querySelectorAll("[data-i18n]").forEach(function(el){var k=el.getAttribute("data-i18n");if(k)el.textContent=window.__T(k)});
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){var k=el.getAttribute("data-i18n-ph");if(k)el.placeholder=window.__T(k)});
  });
})();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap">
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<script>
  // Theme bootstrap (before paint to avoid flash)
  (function(){
    var t = localStorage.getItem('theme') || 'dark';
    document.documentElement.dataset.theme = t;
    document.documentElement.classList.toggle('dark', t === 'dark');
  })();
  tailwind.config = {
    darkMode: ['class'],
    theme: {
      extend: {
        fontFamily: { sans: ['Inter','system-ui','sans-serif'], mono: ['JetBrains Mono','monospace'] },
        colors: {
          brand: { 50:'#f0f4ff', 100:'#e0e9ff', 400:'#818cf8', 500:'#6366f1', 600:'#4f46e5', 700:'#4338ca', 900:'#1e1b4b' },
          lilac: { 50:'#f3f1fb', 100:'#e7e3f6', 300:'#c8bdee', 500:'#b8a9e8', 700:'#7e6bc4' },
          ink: { 900:'#0a0a0f', 800:'#111118', 700:'#18181f', 600:'#23232b', 500:'#2f2f3a' },
        },
        animation: {
          'fade-up': 'fadeUp .35s ease-out',
          'fade-in': 'fadeIn .25s ease-out',
          'slide-in-right': 'slideInRight .25s ease-out',
          'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        },
        keyframes: {
          fadeUp: { '0%':{opacity:0,transform:'translateY(8px)'}, '100%':{opacity:1,transform:'translateY(0)'} },
          fadeIn: { '0%':{opacity:0}, '100%':{opacity:1} },
          slideInRight: { '0%':{opacity:0,transform:'translateX(24px)'}, '100%':{opacity:1,transform:'translateX(0)'} },
          pulseDot: { '0%,100%':{boxShadow:'0 0 0 0 rgba(74,222,128,.45)'}, '50%':{boxShadow:'0 0 0 6px rgba(74,222,128,0)'} },
        }
      }
    }
  }
</script>
<style>
  :root {
    --bg: #0a0a0f; --surface: #11111a; --panel: #15151f; --panel-2: #1a1a24;
    --border: rgba(255,255,255,.07); --border-strong: rgba(255,255,255,.12);
    --text: #f5f5f7; --text-soft: #a1a1aa; --text-mute: #71717a;
    --lilac: #b8a9e8; --amber: #f5a623; --teal: #4ecdc4; --coral: #ff6b6b; --green: #4ade80;
  }
  :root[data-theme="light"] {
    --bg: #fafaf8; --surface: #ffffff; --panel: #ffffff; --panel-2: #fafaf8;
    --border: #f0f0f0; --border-strong: #e5e5e5;
    --text: #1a1a1a; --text-soft: #6b6b6b; --text-mute: #9b9b9b;
  }
  * { box-sizing: border-box; }
  html, body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  body { background: var(--bg); color: var(--text); }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(184,169,232,.4); }

  /* Glass panels */
  .glass { background: var(--panel); border: 1px solid var(--border); }
  .glass-strong { background: var(--surface); border: 1px solid var(--border-strong); }
  .glass-hover { transition: all .2s ease; }
  .glass-hover:hover { background: var(--panel-2); border-color: rgba(184,169,232,.35); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }

  /* Premium gradient text */
  .gradient-text { background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .gradient-text-lilac { background: linear-gradient(135deg, #b8a9e8 0%, #f5a623 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-glow { background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(184,169,232,.22) 0%, transparent 60%); }
  .nav-blur { background: color-mix(in srgb, var(--bg) 78%, transparent); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }

  /* Buttons */
  .btn { display:inline-flex; align-items:center; gap:.5rem; font-weight:500; font-size:.875rem; padding:.5rem 1rem; border-radius:9999px; transition:all .2s ease; cursor:pointer; border: 1px solid transparent; }
  .btn-primary { background: var(--lilac); color:#1a1a1a; box-shadow: 0 2px 6px rgba(184,169,232,.25); }
  .btn-primary:hover { background:#a89ad8; box-shadow:0 4px 12px rgba(184,169,232,.4); transform: translateY(-1px); }
  .btn-ink { background:#1a1a1a; color:white; }
  .btn-ink:hover { background:#333; }
  .btn-ghost { background: var(--panel); border-color: var(--border-strong); color: var(--text); }
  .btn-ghost:hover { background: var(--panel-2); }
  .btn-danger { background: rgba(255,107,107,.1); color:#ff6b6b; border-color: rgba(255,107,107,.25); }
  .btn-danger:hover { background: rgba(255,107,107,.18); }
  .btn-sm { padding:.35rem .75rem; font-size:.78rem; }
  .btn-icon { width:34px; height:34px; padding:0; justify-content:center; }
  .btn-icon-sm { width:28px; height:28px; padding:0; justify-content:center; font-size:.7rem; }

  /* Pills / badges */
  .pill { display:inline-flex; align-items:center; gap:.3rem; font-size:.66rem; font-weight:600; padding:.15rem .55rem; border-radius:9999px; text-transform:uppercase; letter-spacing:.04em; border:1px solid transparent; }
  .pill-lilac { background:rgba(184,169,232,.15); color:#9d8de0; border-color:rgba(184,169,232,.3); }
  .pill-amber { background:rgba(245,166,35,.12); color:#f5a623; border-color:rgba(245,166,35,.28); }
  .pill-teal  { background:rgba(78,205,196,.12); color:#4ecdc4; border-color:rgba(78,205,196,.3); }
  .pill-coral { background:rgba(255,107,107,.12); color:#ff6b6b; border-color:rgba(255,107,107,.3); }
  .pill-green { background:rgba(74,222,128,.12); color:#4ade80; border-color:rgba(74,222,128,.3); }
  .pill-neutral { background: var(--panel-2); color: var(--text-soft); border-color: var(--border); }

  /* Inputs */
  .input, .select, .textarea { width:100%; padding:.6rem .9rem; font-size:.875rem; border-radius:.75rem; background: var(--surface); color: var(--text); border:1px solid var(--border-strong); transition: all .2s ease; outline:none; }
  .select {
    appearance: none; -webkit-appearance: none; -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23b8a9e8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right .75rem center;
    padding-right: 2.2rem; cursor: pointer;
  }
  .select option {
    background: var(--surface); color: var(--text); padding: .5rem .75rem;
  }
  .select option:checked { background: rgba(184,169,232,.15); color: #b8a9e8; }
  .select option:hover { background: var(--panel-2); }
  .input:focus, .select:focus, .textarea:focus { border-color:#b8a9e8; box-shadow: 0 0 0 3px rgba(184,169,232,.18); }
  .input::placeholder, .textarea::placeholder { color: var(--text-mute); }
  .input-pill { border-radius: 9999px; padding:.55rem 1rem .55rem 2.4rem; }

  /* Custom select: any <select> styled with .select or .input gets the lilac treatment */
  select.select, select.input, select.input-pill {
    appearance: none; -webkit-appearance: none; -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23b8a9e8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right .75rem center;
    padding-right: 2.2rem; cursor: pointer;
  }
  select.select option, select.input option, select.input-pill option {
    background: var(--surface); color: var(--text); padding: .5rem .75rem;
  }
  select.select option:checked, select.input option:checked, select.input-pill option:checked {
    background: rgba(184,169,232,.15); color: #b8a9e8;
  }
  select.select option:hover, select.input option:hover, select.input-pill option:hover {
    background: var(--panel-2);
  }
  .field-label { font-size: .68rem; font-weight: 600; color: var(--text-soft); text-transform: uppercase; letter-spacing: .05em; margin-bottom: .35rem; display: block; }
  .field-hint { font-size: .68rem; color: var(--text-mute); margin-top: .25rem; }

  /* Cards */
  .card { background: var(--panel); border:1px solid var(--border); border-radius:16px; transition: all .2s ease; }
  .card-hover:hover { border-color: var(--border-strong); box-shadow: 0 8px 24px rgba(0,0,0,.06); transform: translateY(-2px); }

  /* Sidebar */
  .sidebar-item { display:flex; align-items:center; gap:.6rem; padding:.55rem .85rem; border-radius:.75rem; font-size:.875rem; color: var(--text-soft); transition:all .15s ease; cursor:pointer; }
  .sidebar-item:hover { background: var(--panel-2); color: var(--text); }
  .sidebar-item.active { background: rgba(184,169,232,.12); color: var(--text); }
  .sidebar-item .ic { width:24px; height:24px; border-radius:.5rem; display:flex; align-items:center; justify-content:center; font-size:.66rem; }

  /* Tab nav */
  .tab-pill-group { display:inline-flex; gap:.15rem; padding:.2rem; background: var(--panel-2); border-radius:9999px; border:1px solid var(--border); }
  .tab-pill { padding:.4rem 1rem; font-size:.8rem; font-weight:500; border-radius:9999px; color: var(--text-soft); cursor:pointer; transition:all .2s ease; display:inline-flex; align-items:center; gap:.4rem; }
  .tab-pill.active { background: var(--surface); color: var(--text); box-shadow:0 1px 2px rgba(0,0,0,.06); }
  .tab-pill:hover:not(.active) { color: var(--text); }

  /* Tables */
  table.lh-table { width:100%; border-collapse:collapse; }
  table.lh-table th { text-align:left; font-size:.66rem; font-weight:600; color: var(--text-mute); text-transform:uppercase; letter-spacing:.04em; padding:.85rem 1rem; border-bottom:1px solid var(--border); }
  table.lh-table td { padding:.85rem 1rem; font-size:.85rem; border-bottom:1px solid var(--border); }
  table.lh-table tbody tr:last-child td { border-bottom:none; }
  table.lh-table tbody tr:hover { background: var(--panel-2); }

  /* Modal */
  .modal-overlay { position:fixed; inset:0; z-index:90; background: rgba(10,10,15,.55); backdrop-filter: blur(6px); display:flex; align-items:center; justify-content:center; padding:1rem; animation: fadeIn .18s ease-out; }
  .modal-box { background: var(--surface); border:1px solid var(--border-strong); border-radius:20px; max-width: 720px; width:100%; max-height: 90vh; overflow:hidden; display:flex; flex-direction:column; animation: fadeUp .22s ease-out; }
  .modal-head { padding: 1.1rem 1.4rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:1rem; }
  .modal-body { padding: 1.4rem; overflow-y:auto; }
  .modal-foot { padding: 1rem 1.4rem; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:flex-end; gap:.5rem; background: var(--panel-2); }

  /* Toasts */
  .toast { position: fixed; top:1rem; right:1rem; z-index:120; }
  .toast-item { display:flex; align-items:flex-start; gap:.75rem; padding:.85rem 1rem; border-radius:14px; min-width:280px; max-width:380px; background: var(--surface); border:1px solid var(--border-strong); box-shadow:0 10px 30px rgba(0,0,0,.18); animation: slideInRight .22s ease-out; margin-bottom:.5rem; }

  /* Drag & drop */
  .dropzone { border: 2px dashed var(--border-strong); border-radius:18px; padding: 2.2rem 1.2rem; text-align:center; transition:all .2s ease; background: var(--panel-2); }
  .dropzone.dragover { border-color:#b8a9e8; background: rgba(184,169,232,.06); }

  /* Logo card preview */
  .logo-thumb { width:64px; height:64px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:1.75rem; font-weight:800; }

  /* Skeleton */
  .skeleton { background: linear-gradient(90deg, var(--panel) 25%, var(--panel-2) 50%, var(--panel) 75%); background-size:200% 100%; animation: shimmer 1.2s linear infinite; border-radius: .75rem; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* Switch */
  .switch { position:relative; width:36px; height:20px; background: var(--border-strong); border-radius:9999px; cursor:pointer; transition: all .2s ease; }
  .switch.on { background: #b8a9e8; }
  .switch .knob { position:absolute; top:2px; left:2px; width:16px; height:16px; background:white; border-radius:9999px; transition:all .2s ease; }
  .switch.on .knob { left:18px; }

  /* Color swatch */
  .color-swatch { width:22px; height:22px; border-radius:9999px; border:2px solid var(--surface); box-shadow: 0 0 0 1px var(--border-strong); }
  .color-input { display:flex; align-items:center; gap:.5rem; }
  .color-input input[type="color"] { width:42px; height:38px; border-radius:.6rem; padding:0; border:1px solid var(--border-strong); cursor:pointer; background:transparent; }

  /* Responsive helpers */
  @media (max-width: 1023px) { .lg-show { display:none !important; } .mobile-only { display:block !important; } }
  @media (min-width: 1024px) { .mobile-only { display:none !important; } }

  /* Code block */
  pre.code-block { background:#0a0a0f; border:1px solid var(--border); border-radius:14px; padding:1rem 1.2rem; font-family:'JetBrains Mono', monospace; font-size:.78rem; color:#cbd5e1; overflow-x:auto; }

  /* Hide scrollbar utility for tab strips */
  .no-scrollbar::-webkit-scrollbar { display:none; }
  .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }

  /* Empty state */
  .empty-state { text-align:center; padding: 3rem 1rem; color: var(--text-mute); }
</style>
${extraScripts}
</head>`;

// Shared toolkit script — toasts, theme toggle, fetch helpers, format helpers
export const COMMON_JS = `
<script>
window.LH = window.LH || {};
LH.fmt = (n) => Number(n||0).toLocaleString();
LH.rel = (s) => {
  const d = new Date(s); if (isNaN(d.getTime())) return '—';
  const m = Math.floor((Date.now() - d.getTime())/60000);
  if (m < 1) return 'just now'; if (m < 60) return m+'m ago';
  const h = Math.floor(m/60); if (h < 24) return h+'h ago';
  const day = Math.floor(h/24); if (day < 30) return day+'d ago';
  return d.toLocaleDateString();
};
LH.toast = (kind, title, msg) => {
  let host = document.getElementById('lh-toast-host');
  if (!host) { host = document.createElement('div'); host.id='lh-toast-host'; host.className='toast'; document.body.appendChild(host); }
  const c = kind==='success'?'#4ade80':kind==='error'?'#ff6b6b':'#b8a9e8';
  const icon = kind==='success'?'check-circle':kind==='error'?'exclamation-circle':'sparkles';
  const div = document.createElement('div');
  div.className='toast-item';
  div.innerHTML = '<div style="width:34px;height:34px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:'+c+'22;color:'+c+';flex-shrink:0;"><i class="fas fa-'+icon+'"></i></div>' +
                  '<div style="flex:1;min-width:0;"><div style="font-size:.85rem;font-weight:600;color:var(--text)">'+title+'</div>'+ (msg?'<div style="font-size:.7rem;color:var(--text-mute);margin-top:2px">'+msg+'</div>':'') +'</div>';
  host.appendChild(div);
  setTimeout(()=>{ div.style.opacity='0'; div.style.transform='translateX(20px)'; div.style.transition='all .2s'; setTimeout(()=>div.remove(),200); }, 3800);
};
LH.confirm = (opts) => new Promise(res => {
  const o = document.createElement('div'); o.className='modal-overlay';
  o.innerHTML = '<div class="modal-box" style="max-width:420px"><div class="modal-head"><div style="display:flex;align-items:center;gap:.7rem;"><div style="width:36px;height:36px;border-radius:12px;background:'+(opts.danger?'#ff6b6b22':'#b8a9e822')+';color:'+(opts.danger?'#ff6b6b':'#b8a9e8')+';display:flex;align-items:center;justify-content:center;"><i class="fas fa-'+(opts.danger?'exclamation-triangle':'info-circle')+'"></i></div><div><div style="font-weight:700;font-size:.95rem;">'+opts.title+'</div>'+(opts.msg?'<div style="font-size:.75rem;color:var(--text-soft);margin-top:2px;">'+opts.msg+'</div>':'')+'</div></div></div><div class="modal-foot"><button class="btn btn-ghost btn-sm" data-act="no">Cancel</button><button class="btn '+(opts.danger?'btn-danger':'btn-primary')+' btn-sm" data-act="yes">'+(opts.yes||'Confirm')+'</button></div></div>';
  document.body.appendChild(o);
  const close = (v) => { o.remove(); res(v); };
  o.addEventListener('click', (e) => { if (e.target===o) close(false); const a = e.target.closest('[data-act]'); if (a) close(a.dataset.act==='yes'); });
});
LH.openModal = (innerHtml) => {
  const o = document.createElement('div'); o.className='modal-overlay';
  o.innerHTML = innerHtml; document.body.appendChild(o);
  o.addEventListener('click', (e) => { if (e.target===o || e.target.closest('[data-close]')) o.remove(); });
  return o;
};
LH.toggleLang = () => {
  var cur = window.__LANG || 'en';
  var next = cur === 'en' ? 'pt' : 'en';
  window.__LANG = next;
  localStorage.setItem('lang', next);
  document.documentElement.lang = next;
  location.reload();
};
LH.toggleTheme = () => {
  const cur = document.documentElement.dataset.theme || 'dark';
  const next = cur==='dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  document.documentElement.classList.toggle('dark', next==='dark');
  localStorage.setItem('theme', next);
  const btn = document.getElementById('themeBtn'); if (btn) btn.innerHTML = next==='dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
};
LH.copy = async (t) => { try { await navigator.clipboard.writeText(t); LH.toast('success','Copied to clipboard'); } catch { LH.toast('error','Copy failed'); } };
LH.api = async (path, opts={}) => {
  var headers = { 'Content-Type': 'application/json' };
  var token = localStorage.getItem('logohub_token');
  if (token) headers['Authorization'] = 'Bearer ' + token;
  if (opts.headers) { for (var k in opts.headers) headers[k] = opts.headers[k]; }
  var r = await fetch(path, { ...opts, headers: headers });
  if (!r.ok) throw new Error((await r.json().catch(function(){return {};})).error || r.statusText);
  return r.json();
};
LH.extractPalette = (file) => new Promise((res) => {
  const img = new Image(); img.crossOrigin='anonymous';
  img.onload = () => {
    const c = document.createElement('canvas'); const size=48; c.width=size; c.height=size;
    const ctx = c.getContext('2d'); ctx.drawImage(img,0,0,size,size);
    const px = ctx.getImageData(0,0,size,size).data;
    const buckets = {};
    for (let i=0;i<px.length;i+=4) {
      if (px[i+3]<128) continue;
      const r = Math.round(px[i]/32)*32, g = Math.round(px[i+1]/32)*32, b = Math.round(px[i+2]/32)*32;
      const sum = r+g+b; if (sum>720 || sum<40) continue;
      const k = r+','+g+','+b; buckets[k] = (buckets[k]||0)+1;
    }
    const sorted = Object.entries(buckets).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const hex = sorted.map(([k]) => { const [r,g,b]=k.split(',').map(Number); return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase(); });
    res(hex);
  };
  img.onerror = () => res([]);
  img.src = URL.createObjectURL(file);
});
LH.fileToDataUrl = (f) => new Promise((res,rej) => { const r = new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(f); });
LH.slugify = (s) => String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

LH.authHeader = () => {
  var t = localStorage.getItem('logohub_token');
  return t ? { 'Authorization': 'Bearer ' + t } : {};
};

LH.loadUser = async () => {
  try {
    var r = await fetch('/api/v1/auth/me', { headers: LH.authHeader() });
    if (!r.ok) return null;
    var data = await r.json();
    var u = data.data || {};
    window.__USER = u;
    // Update avatar
    var initials = (u.name || '?').split(' ').map(function(p){return (p||'')[0];}).slice(0,2).join('').toUpperCase();
    var el = document.getElementById('avatarInitials');
    if (el) el.textContent = initials;
    var mel = document.getElementById('menuInitials');
    if (mel) mel.textContent = initials;
    var mn = document.getElementById('menuName');
    if (mn) mn.textContent = u.name || 'User';
    var me = document.getElementById('menuEmail');
    if (me) me.textContent = u.email || '';
    var mr = document.getElementById('menuRole');
    if (mr) { mr.textContent = u.role || '—'; mr.className = 'pill ' + ((u.role==='admin')?'pill-lilac':(u.role==='creator')?'pill-amber':'pill-teal'); }
    var mp = document.getElementById('menuPlan');
    if (mp) { mp.textContent = u.plan || '—'; mp.className = 'pill ' + ((u.plan==='business')?'pill-lilac':(u.plan==='pro')?'pill-teal':(u.plan==='enterprise')?'pill-amber':'pill-neutral'); }
    return u;
  } catch(e) { return null; }
};

LH.toggleUserMenu = function() {
  var m = document.getElementById('userMenu');
  if (!m) return;
  var isOpen = m.style.display === 'block';
  m.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    LH.loadUser();
    // Close on outside click
    setTimeout(function() {
      document.addEventListener('click', function closeMenu(e) {
        var dd = document.getElementById('avatarDropdown');
        if (dd && !dd.contains(e.target)) {
          m.style.display = 'none';
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 50);
  }
};

LH.logout = function() {
  localStorage.removeItem('logohub_token');
  fetch('/api/v1/auth/logout', { method: 'POST', headers: LH.authHeader() }).catch(function(){});
  window.location.href = '/login';
};

LH.loadNotifUnread = async function() {
  try {
    var r = await fetch('/api/v1/notifications/unread-count', { headers: LH.authHeader() });
    var data = await r.json();
    var count = (data.data && data.data.unread) || 0;
    var badge = document.getElementById('notifBadge');
    if (badge) {
      if (count > 0) {
        badge.style.display = 'flex';
        badge.textContent = count > 99 ? '99+' : count;
      } else {
        badge.style.display = 'none';
      }
    }
    window.NOTIF_UNREAD = count;
    return count;
  } catch(e) { return 0; }
};

// On page load — fetch unread count + user
(function() {
  LH.loadNotifUnread();
  // Only load user if we have a token (not on login/register pages)
  if (localStorage.getItem('logohub_token')) {
    LH.loadUser();
  }
})();

// Shared image upload helpers for Logo & Favicon (used in settings, team, users, billing pages)
LH.handleLogoUpload = function(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'contain';
    const preview = document.getElementById('logoPreview');
    if (preview) {
      preview.innerHTML = '';
      preview.appendChild(img);
    }
    if (typeof saveSetting === 'function') saveSetting('brand_logo_url', e.target.result);
    LH.toast('success', 'Logo updated');
  };
  reader.readAsDataURL(file);
};

LH.handleFaviconUpload = function(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'contain';
    const preview = document.getElementById('faviconPreview');
    if (preview) {
      preview.innerHTML = '';
      preview.appendChild(img);
    }
    if (typeof saveSetting === 'function') saveSetting('brand_favicon_url', e.target.result);
    LH.toast('success', 'Favicon updated');
  };
  reader.readAsDataURL(file);
};

</script>
`;
