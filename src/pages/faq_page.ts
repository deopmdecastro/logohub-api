// FAQ page — public page with expandable questions & answers
import { HEAD, COMMON_JS } from './shared';

export function faqPage() {
  return HEAD('FAQ — LogoHub API', COMMON_JS) + `
<body class="font-sans">
<nav class="fixed top-0 w-full z-50 nav-blur">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:#1a1a1a"><i class="fas fa-sparkles" style="color:#b8a9e8"></i></div>
      <span class="font-bold text-lg tracking-tight">LogoHub <span class="gradient-text-lilac">API</span></span>
    </a>
    <div class="hidden md:flex items-center gap-7 text-sm" style="color:var(--text-soft)">
      <a href="/docs" class="hover:text-white transition-colors">Docs</a>
      <a href="/explorer" class="hover:text-white transition-colors">Explorer</a>
      <a href="/playground" class="hover:text-white transition-colors">Playground</a>
      <a href="/blog" class="hover:text-white transition-colors">Blog</a>
      <a href="/faq" class="hover:text-white transition-colors font-semibold" style="color:var(--text)">FAQ</a>
    </div>
    <div class="flex items-center gap-2">
      <button id="themeBtn" onclick="LH.toggleTheme()" class="btn btn-ghost btn-icon" title="Toggle theme"><i class="fas fa-sun"></i></button>
      <a href="/login" class="btn btn-primary btn-sm">Dashboard</a>
    </div>
  </div>
</nav>

<section class="pt-28 pb-20 px-4">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-12 animate-fade-up">
      <span class="pill pill-lilac mb-4">FAQ</span>
      <h1 class="text-4xl sm:text-5xl font-black mb-3 tracking-tight" style="color:var(--text)">Frequently Asked <span class="gradient-text">Questions</span></h1>
      <p class="text-lg" style="color:var(--text-soft)">Everything you need to know about LogoHub API.</p>
    </div>

    <!-- Category tabs -->
    <div class="flex flex-wrap justify-center gap-2 mb-8" id="faqCategories"></div>

    <!-- Search -->
    <div class="relative mb-10 max-w-xl mx-auto">
      <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2" style="color:var(--text-mute)"></i>
      <input id="faqSearch" type="text" placeholder="Search questions…" class="input input-pill pl-10" oninput="renderFAQ()">
    </div>

    <!-- FAQ list -->
    <div id="faqList" class="space-y-3 animate-fade-up"></div>

    <!-- Still have questions -->
    <div class="card p-8 mt-12 text-center">
      <div class="text-4xl mb-4">💬</div>
      <h3 class="text-xl font-bold mb-2" style="color:var(--text)">Still have questions?</h3>
      <p class="text-sm mb-6" style="color:var(--text-soft)">Can't find what you're looking for? Reach out to our support team.</p>
      <a href="/contact" class="btn btn-primary"><i class="fas fa-envelope"></i> Contact Support</a>
    </div>
  </div>
</section>

<script>
var FAQ = [];
var activeCategory = '';

async function loadFAQ() {
  try {
    var res = await fetch('/api/admin/faq?status=published');
    var json = await res.json();
    FAQ = json.data || [];
    renderCategories();
    renderFAQ();
  } catch(e) {
    document.getElementById('faqList').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle text-3xl mb-3 opacity-30 block"></i>Failed to load FAQ</div>';
  }
}

function renderCategories() {
  var cats = [];
  var seen = {};
  for (var i = 0; i < FAQ.length; i++) {
    var c = FAQ[i].category || 'General';
    if (!seen[c]) { seen[c] = true; cats.push(c); }
  }
  var html = '<button class="pill ' + (activeCategory === '' ? 'pill-lilac' : 'pill-neutral') + '" onclick="filterCategory(\\'\\')">All</button>';
  for (var j = 0; j < cats.length; j++) {
    html += '<button class="pill ' + (activeCategory === cats[j] ? 'pill-lilac' : 'pill-neutral') + '" onclick="filterCategory(\\'' + escAttr(cats[j]) + '\\')">' + esc(cats[j]) + '</button>';
  }
  document.getElementById('faqCategories').innerHTML = html;
}

function filterCategory(cat) {
  activeCategory = cat;
  renderCategories();
  renderFAQ();
}

function renderFAQ() {
  var q = (document.getElementById('faqSearch') ? document.getElementById('faqSearch').value : '').toLowerCase();
  var items = [];
  for (var i = 0; i < FAQ.length; i++) {
    var f = FAQ[i];
    if (activeCategory && f.category !== activeCategory) continue;
    if (q) {
      var match = (f.question || '').toLowerCase().indexOf(q) >= 0 ||
                  (f.answer || '').toLowerCase().indexOf(q) >= 0;
      if (f.tags) {
        for (var t = 0; t < f.tags.length; t++) {
          if (f.tags[t].toLowerCase().indexOf(q) >= 0) { match = true; break; }
        }
      }
      if (!match) continue;
    }
    items.push(f);
  }

  if (!items.length) {
    document.getElementById('faqList').innerHTML = '<div class="empty-state"><i class="fas fa-inbox text-3xl mb-3 opacity-30 block"></i>No questions found</div>';
    return;
  }

  var html = '';
  for (var i = 0; i < items.length; i++) {
    var f = items[i];
    var faqId = 'faq-' + (f.id || i);
    html += '<div class="card overflow-hidden transition-all" style="border:1px solid var(--border)">';
    html += '<button class="faq-question w-full text-left p-5 flex items-start gap-4 cursor-pointer hover:bg-[var(--panel-2)] transition-colors" onclick="toggleFAQ(this,\\'' + faqId + '\\')" aria-expanded="false">';
    html += '<div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style="background:var(--lilac);color:#1a1a1a;opacity:.7"><i class="fas fa-question text-xs"></i></div>';
    html += '<div class="flex-1 min-w-0">';
    html += '<h3 class="text-sm font-semibold pr-8" style="color:var(--text)">' + esc(f.question) + '</h3>';
    if (f.category) { html += '<span class="pill pill-teal mt-1" style="font-size:10px">' + esc(f.category) + '</span>'; }
    html += '</div>';
    html += '<i class="fas fa-chevron-down transition-transform duration-300 text-xs shrink-0 mt-1" style="color:var(--text-mute)" id="' + faqId + '-icon"></i>';
    html += '</button>';
    html += '<div id="' + faqId + '" class="faq-answer" style="max-height:0;overflow:hidden;transition:max-height .35s ease,padding .35s ease">';
    html += '<div class="px-5 pb-5 pt-0" style="color:var(--text-soft);font-size:.9rem;line-height:1.7">';
    html += '<div class="pl-12">' + formatAnswer(f.answer) + '</div>';
    if (f.tags && f.tags.length) {
      html += '<div class="pl-12 mt-4 flex flex-wrap gap-1.5">';
      for (var t = 0; t < f.tags.length; t++) {
        html += '<span class="pill pill-neutral" style="font-size:10px">' + esc(f.tags[t]) + '</span>';
      }
      html += '</div>';
    }
    html += '</div></div></div>';
  }
  document.getElementById('faqList').innerHTML = html;
}

function formatAnswer(text) {
  if (!text) return '';
  text = text.replace(/\`([^\`]+)\`/g, '<code class="font-mono text-xs px-1.5 py-0.5 rounded" style="background:var(--panel-2);color:var(--lilac)">$1</code>');
  text = text.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre class="code-block my-3">$1</pre>');
  text = text.replace(/\\[(.+?)\\]\\((.+?)\\)/g, '<a href="$2" target="_blank" style="color:var(--lilac)">$1</a>');
  text = text.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
  text = text.replace(/\\n/g, '<br>');
  return text;
}

function toggleFAQ(btn, faqId) {
  var answer = document.getElementById(faqId);
  var icon = document.getElementById(faqId + '-icon');
  var isOpen = btn.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    answer.style.maxHeight = '0';
    btn.setAttribute('aria-expanded', 'false');
    if (icon) icon.style.transform = 'rotate(0deg)';
  } else {
    answer.style.maxHeight = answer.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
    if (icon) icon.style.transform = 'rotate(180deg)';
  }
}

function esc(s) { return String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return String(s||'').replace(/'/g,"\\\\'").replace(/"/g,'&quot;'); }

document.addEventListener('keydown', function(e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.faq-question')) {
    e.preventDefault();
    e.target.closest('.faq-question').click();
  }
});

(function(){
  var t = localStorage.getItem('theme') || 'dark';
  var b = document.getElementById('themeBtn');
  if (b) b.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
})();
loadFAQ();
</script>

<style>
.faq-question:focus-visible { outline: 2px solid var(--lilac); outline-offset: -2px; border-radius: inherit; }
</style>
</body></html>`;
}
