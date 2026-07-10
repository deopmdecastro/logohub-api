import { HEAD, COMMON_JS } from './shared';
import { consumerSidebar, shellWrap, topbar, CONSUMER_CTX } from './layout';

export const consumerDashboardV2Page = () => `${HEAD('Consumer Dashboard — LogoHub', COMMON_JS)}
${shellWrap(consumerSidebar('overview'), `${topbar('Consumer Dashboard', 'Usage, quotas, top APIs and recent keys', CONSUMER_CTX)}
<div class="px-4 lg:px-6 py-5 lg:py-7 max-w-[1500px] mx-auto space-y-5 animate-fade-up">
  <section class="card p-5 lg:p-6 overflow-hidden" style="background:linear-gradient(135deg,rgba(184,169,232,.10),rgba(78,205,196,.06) 55%, transparent)">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div class="min-w-0">
        <div class="flex items-center gap-2 flex-wrap mb-2">
          <span class="pill pill-lilac" id="projectBadge">Workspace</span>
          <span class="pill pill-neutral" id="planBadge">Loading plan…</span>
        </div>
        <h2 class="text-2xl lg:text-3xl font-black tracking-tight" style="color:var(--text)">Stay ahead of quota, errors and key hygiene</h2>
        <p class="text-sm mt-2 max-w-3xl" style="color:var(--text-soft)" id="heroLine">Loading consumer summary…</p>
      </div>
      <div class="flex gap-2 flex-wrap" id="quickActions"></div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5" id="headlineStats">
      <div class="card p-4"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-20 mb-2"></div><div class="skeleton h-4 w-28"></div></div>
      <div class="card p-4"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-20 mb-2"></div><div class="skeleton h-4 w-28"></div></div>
      <div class="card p-4"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-20 mb-2"></div><div class="skeleton h-4 w-28"></div></div>
      <div class="card p-4"><div class="skeleton h-5 w-24 mb-3"></div><div class="skeleton h-8 w-20 mb-2"></div><div class="skeleton h-4 w-28"></div></div>
    </div>
  </section>

  <section class="grid grid-cols-1 xl:grid-cols-[1.45fr_.9fr] gap-4 lg:gap-5">
    <div class="card p-5 lg:p-6">
      <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <h3 class="text-sm font-bold flex items-center gap-2"><span class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:rgba(184,169,232,.14);color:var(--lilac)"><i class="fas fa-chart-line text-[11px]"></i></span>Requests over time</h3>
          <p class="text-[11px] mt-1" style="color:var(--text-mute)">30-day usage trend with error and latency context</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm" onclick="loadDashboard('7d')">7d</button>
          <button class="btn btn-primary btn-sm" onclick="loadDashboard('30d')">30d</button>
        </div>
      </div>
      <div style="height:300px"><canvas id="usageTrendChart"></canvas></div>
    </div>
    <div class="space-y-4">
      <div class="card p-5 lg:p-6">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 class="text-sm font-bold flex items-center gap-2"><span class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:rgba(78,205,196,.14);color:var(--teal)"><i class="fas fa-gauge text-[11px]"></i></span>Quota health</h3>
            <p class="text-[11px] mt-1" style="color:var(--text-mute)">Daily plan utilisation and remaining budget</p>
          </div>
        </div>
        <div class="flex items-end justify-between gap-3 mb-2">
          <div>
            <div class="text-3xl font-black" id="quotaPercent">—</div>
            <div class="text-[11px]" style="color:var(--text-mute)" id="quotaCaption">Loading…</div>
          </div>
          <div class="text-right">
            <div class="text-[11px] uppercase tracking-wide font-semibold" style="color:var(--text-mute)">Remaining today</div>
            <div class="text-base font-bold" id="quotaRemaining">—</div>
          </div>
        </div>
        <div class="progress mt-3"><div id="quotaBar" class="progress-bar lilac" style="width:0%"></div></div>
      </div>
      <div class="card p-5 lg:p-6">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 class="text-sm font-bold flex items-center gap-2"><span class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:rgba(245,166,35,.14);color:var(--amber)"><i class="fas fa-triangle-exclamation text-[11px]"></i></span>Alerts</h3>
            <p class="text-[11px] mt-1" style="color:var(--text-mute)">Actionable notices for quota, auth and key lifecycle</p>
          </div>
        </div>
        <div id="alertsStack" class="space-y-3"></div>
      </div>
    </div>
  </section>

  <section class="grid grid-cols-1 xl:grid-cols-[1.2fr_.8fr] gap-4 lg:gap-5">
    <div class="card p-5 lg:p-6">
      <div class="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-sm font-bold flex items-center gap-2"><span class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:rgba(245,166,35,.14);color:var(--amber)"><i class="fas fa-key text-[11px]"></i></span>Recent API keys</h3>
          <p class="text-[11px] mt-1" style="color:var(--text-mute)">Most recently active keys, ready for quick review and copy</p>
        </div>
        <a href="/dashboard/consumer/keys" class="btn btn-primary btn-sm"><i class="fas fa-plus text-[10px]"></i> New key</a>
      </div>
      <div class="overflow-x-auto"><table class="lh-table"><thead><tr><th>Name</th><th>Preview</th><th>Status</th><th>Requests</th><th>Last used</th><th></th></tr></thead><tbody id="recentKeysTable"><tr><td colspan="6" style="padding:2rem;text-align:center;color:var(--text-mute)">Loading keys…</td></tr></tbody></table></div>
    </div>
    <div class="card p-5 lg:p-6">
      <div class="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-sm font-bold flex items-center gap-2"><span class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:rgba(78,205,196,.14);color:var(--teal)"><i class="fas fa-cubes text-[11px]"></i></span>Top APIs</h3>
          <p class="text-[11px] mt-1" style="color:var(--text-mute)">What your product uses most right now</p>
        </div>
      </div>
      <div id="topApisList" class="space-y-3"></div>
    </div>
  </section>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
let SUMMARY = null;
let TIMESERIES = [];
let usageTrendChart = null;

function esc(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

async function loadDashboard(range){
  const user = await LH.guardRole(['consumer']);
  if(!user) return;
  try {
    const [summaryRes, seriesRes] = await Promise.all([
      LH.api('/api/v1/consumer/dashboard/summary'),
      LH.api('/api/v1/consumer/usage/timeseries?range=' + (range || '30d')),
    ]);
    SUMMARY = summaryRes.data;
    TIMESERIES = seriesRes.data || [];
    renderDashboard();
  } catch (e) {
    LH.toast('error', 'Failed to load dashboard', e.message);
  }
}

function renderDashboard(){
  if(!SUMMARY) return;
  const plan = SUMMARY.plan || {};
  const stats = SUMMARY.stats || {};
  const project = SUMMARY.project || {};
  document.getElementById('projectBadge').textContent = project.name || 'Workspace';
  document.getElementById('planBadge').className = 'pill ' + (plan.id === 'enterprise' ? 'pill-amber' : plan.id === 'business' ? 'pill-lilac' : plan.id === 'pro' ? 'pill-teal' : 'pill-neutral');
  document.getElementById('planBadge').textContent = ((plan.name || plan.id || 'free') + ' plan').replace(/^./, s => s.toUpperCase());
  document.getElementById('heroLine').innerHTML = 'You processed <strong style="color:var(--text)">' + LH.fmt(stats.requests_30d || 0) + '</strong> requests in the last 30 days with <strong style="color:var(--text)">' + (stats.success_rate || 100) + '%</strong> key health and an average latency of <strong style="color:var(--text)">' + (stats.avg_latency_ms || 0) + 'ms</strong>.';

  const cards = [
    { icon:'fa-bolt', color:'var(--lilac)', bg:'rgba(184,169,232,.14)', value:LH.fmt(stats.requests_today || 0), label:'Requests today', meta:(plan.quota_daily === -1 ? 'Unlimited daily quota' : LH.fmt(plan.quota_daily || 0) + ' daily quota') },
    { icon:'fa-key', color:'var(--amber)', bg:'rgba(245,166,35,.14)', value:LH.fmt(stats.active_keys || 0), label:'Active keys', meta:LH.fmt(stats.revoked_keys || 0) + ' revoked' },
    { icon:'fa-chart-line', color:'var(--teal)', bg:'rgba(78,205,196,.14)', value:LH.fmt(stats.requests_30d || 0), label:'Requests (30d)', meta:'Usage trend across your workspace' },
    { icon:'fa-shield-check', color:'var(--green)', bg:'rgba(74,222,128,.14)', value:(stats.success_rate || 100) + '%', label:'Key health', meta:(stats.avg_latency_ms || 0) + 'ms average latency' },
  ];
  document.getElementById('headlineStats').innerHTML = cards.map(card => '<div class="card p-4"><div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style="background:'+card.bg+';color:'+card.color+'"><i class="fas '+card.icon+'"></i></div><div class="text-2xl font-black">'+card.value+'</div><div class="text-sm font-semibold mt-1">'+card.label+'</div><div class="text-[11px] mt-1" style="color:var(--text-mute)">'+card.meta+'</div></div>').join('');

  renderQuickActions(SUMMARY.quick_actions || []);
  renderQuota(plan);
  renderAlerts(SUMMARY.alerts || []);
  renderKeys(SUMMARY.recent_keys || []);
  renderTopApis(SUMMARY.top_apis || []);
  renderTrendChart(TIMESERIES || []);
}

function renderQuickActions(actions){
  const host = document.getElementById('quickActions');
  host.innerHTML = actions.map(action => '<a href="'+action.href+'" class="btn btn-ghost btn-sm"><i class="fas '+action.icon+' text-[10px]"></i> '+esc(action.label)+'</a>').join('');
}

function renderQuota(plan){
  const percent = plan.quota_daily === -1 ? 0 : Math.min(100, Number(plan.percent_used || 0));
  document.getElementById('quotaPercent').textContent = plan.quota_daily === -1 ? 'Unlimited' : percent + '%';
  document.getElementById('quotaCaption').textContent = 'Used ' + LH.fmt(plan.used_today || 0) + ' of ' + (plan.quota_daily === -1 ? 'unlimited' : LH.fmt(plan.quota_daily || 0)) + ' requests today';
  document.getElementById('quotaRemaining').textContent = plan.quota_daily === -1 ? '∞' : LH.fmt(plan.remaining_today || 0);
  const bar = document.getElementById('quotaBar');
  bar.style.width = plan.quota_daily === -1 ? '8%' : Math.max(6, percent) + '%';
  bar.className = 'progress-bar ' + (percent >= 90 ? 'coral' : percent >= 80 ? 'amber' : 'lilac');
}

function renderAlerts(alerts){
  const host = document.getElementById('alertsStack');
  if(!alerts.length){
    host.innerHTML = '<div class="empty-state" style="padding:1.5rem 0"><i class="fas fa-check-circle text-2xl mb-3 opacity-30 block"></i>No alerts</div>';
    return;
  }
  host.innerHTML = alerts.map(alert => {
    const color = alert.type === 'critical' ? '#ff6b6b' : alert.type === 'warning' ? '#f5a623' : '#4ade80';
    return '<div class="card p-4"><div class="flex items-start gap-3"><div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:'+color+'22;color:'+color+'"><i class="fas fa-bell"></i></div><div class="min-w-0 flex-1"><div class="flex items-center gap-2 flex-wrap"><p class="text-sm font-semibold">'+esc(alert.title)+'</p><span class="pill" style="background:'+color+'22;color:'+color+';border-color:'+color+'55">'+esc(alert.type)+'</span></div><p class="text-[11px] mt-1" style="color:var(--text-mute)">'+esc(alert.message)+'</p>'+(alert.action_href ? '<a href="'+alert.action_href+'" class="btn btn-ghost btn-sm mt-3">'+esc(alert.action_label || 'Open')+'</a>' : '')+'</div></div></div>';
  }).join('');
}

function renderKeys(keys){
  const host = document.getElementById('recentKeysTable');
  if(!keys.length){
    host.innerHTML = '<tr><td colspan="6" style="padding:2rem;text-align:center;color:var(--text-mute)">No keys created yet</td></tr>';
    return;
  }
  host.innerHTML = keys.map(key => {
    const pill = key.status === 'active' ? 'pill-green' : key.status === 'revoked' ? 'pill-coral' : 'pill-amber';
    return '<tr><td><div class="font-semibold">'+esc(key.name)+'</div>'+(key.tags && key.tags.length ? '<div class="text-[11px] mt-1" style="color:var(--text-mute)">'+esc(key.tags.join(', '))+'</div>' : '')+'</td><td><code class="text-xs font-mono" style="color:var(--lilac)">'+esc(key.key_preview)+'</code></td><td><span class="pill '+pill+'">'+esc(key.status)+'</span></td><td>'+LH.fmt(key.requests || 0)+'</td><td>'+(key.last_used ? LH.rel(key.last_used) : '—')+'</td><td><button class="btn btn-ghost btn-icon-sm" onclick="LH.copy(\''+String(key.key_preview).replace(/'/g, '\\&#39;')+'\')"><i class="fas fa-copy text-[10px]"></i></button></td></tr>';
  }).join('');
}

function renderTopApis(items){
  const host = document.getElementById('topApisList');
  if(!items.length){
    host.innerHTML = '<div class="empty-state" style="padding:1.5rem 0"><i class="fas fa-cubes text-2xl mb-3 opacity-30 block"></i>No API consumption yet</div>';
    return;
  }
  const max = Math.max(1, ...items.map(item => item.requests || 0));
  host.innerHTML = items.map(item => {
    const width = Math.round(((item.requests || 0) / max) * 100);
    return '<div><div class="flex items-center justify-between gap-3 mb-1.5"><div><div class="text-sm font-semibold">'+esc(item.name)+'</div><div class="text-[11px]" style="color:var(--text-mute)">'+esc(item.slug)+'</div></div><div class="text-right"><div class="text-sm font-bold">'+LH.fmt(item.requests || 0)+'</div><div class="text-[11px]" style="color:'+(item.color || 'var(--text-mute)')+'">'+esc(item.trend || '')+'</div></div></div><div class="progress"><div class="progress-bar" style="width:'+Math.max(10,width)+'%;background:'+(item.color || 'var(--lilac)')+'"></div></div></div>';
  }).join('');
}

function renderTrendChart(rows){
  const canvas = document.getElementById('usageTrendChart');
  if(!canvas) return;
  if(usageTrendChart) usageTrendChart.destroy();
  usageTrendChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: rows.map(r => r.label),
      datasets: [
        {
          label: 'Requests',
          data: rows.map(r => r.requests),
          borderColor: '#b8a9e8',
          backgroundColor: 'rgba(184,169,232,.12)',
          fill: true,
          tension: .35,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Errors',
          data: rows.map(r => r.errors),
          borderColor: '#ff6b6b',
          backgroundColor: 'transparent',
          fill: false,
          tension: .35,
          pointRadius: 0,
          borderWidth: 1.5,
          borderDash: [6, 6],
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-soft') } },
        tooltip: {
          callbacks: {
            afterBody: (items) => {
              const row = rows[items[0].dataIndex];
              return 'Avg latency: ' + row.avg_latency_ms + 'ms';
            }
          }
        }
      },
      scales: {
        x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-mute') }, grid: { display: false } },
        y: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-mute') }, grid: { color: 'rgba(255,255,255,.05)' } },
      }
    }
  });
}

loadDashboard('30d');
</script>
`)}`;
