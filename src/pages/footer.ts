// Footer pages: Privacy, Terms, Cookies, About, Contact, FAQ, Careers, Blog
import { HEAD, COMMON_JS } from './shared';

function footerPage(title: string, subtitle: string, content: string) {
  return `${HEAD(title)}
<body class="min-h-screen flex flex-col" style="background:var(--bg);color:var(--text)">
  <nav class="nav-blur sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-bold text-xl">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black" style="background:var(--lilac);color:#1a1a1a">L</span>
        <span>LogoHub</span>
      </a>
      <div class="flex items-center gap-3">
        <a href="/" class="text-sm" style="color:var(--text-soft)">Home</a>
        <a href="/playground" class="text-sm" style="color:var(--text-soft)">Playground</a>
        <a href="/docs" class="text-sm" style="color:var(--text-soft)">API Docs</a>
      </div>
    </div>
  </nav>

  <main class="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
    <h1 class="text-4xl font-black mb-2">${title}</h1>
    <p class="text-lg mb-10" style="color:var(--text-soft)">${subtitle}</p>
    <div class="prose prose-invert max-w-none" style="line-height:1.8;font-size:1.05rem;color:var(--text-soft)">
      ${content}
    </div>
  </main>

  <footer style="background:var(--surface);border-top:1px solid var(--border)">
    <div class="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <div class="font-bold mb-4">Product</div>
        <div class="flex flex-col gap-2 text-sm" style="color:var(--text-soft)">
          <a href="/">Home</a><a href="/explorer">Explorer</a><a href="/docs">API Docs</a><a href="/playground">Playground</a>
        </div>
      </div>
      <div>
        <div class="font-bold mb-4">Company</div>
        <div class="flex flex-col gap-2 text-sm" style="color:var(--text-soft)">
          <a href="/about">About</a><a href="/blog">Blog</a><a href="/careers">Careers</a><a href="/contact">Contact</a>
        </div>
      </div>
      <div>
        <div class="font-bold mb-4">Legal</div>
        <div class="flex flex-col gap-2 text-sm" style="color:var(--text-soft)">
          <a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/cookies">Cookie Policy</a>
        </div>
      </div>
      <div>
        <div class="font-bold mb-4">Support</div>
        <div class="flex flex-col gap-2 text-sm" style="color:var(--text-soft)">
          <a href="/faq">FAQ</a><a href="/contact">Contact Us</a><a href="mailto:support@logohub.dev">support@logohub.dev</a>
        </div>
      </div>
    </div>
    <div class="max-w-6xl mx-auto px-6 pb-6 text-center text-xs" style="color:var(--text-mute)">
      &copy; ${new Date().getFullYear()} LogoHub API. All rights reserved.
    </div>
  </footer>
  ${COMMON_JS}
</body></html>`;
}

export function privacyPage() {
  return footerPage('Privacy Policy', 'Last updated: June 2026',
    `<h2>1. Information We Collect</h2>
    <p>When you use LogoHub API, we may collect the following information:</p>
    <ul>
      <li><strong>Account Information:</strong> Name, email address, and password when you register.</li>
      <li><strong>Usage Data:</strong> API requests, endpoints called, response times, and error rates.</li>
      <li><strong>Payment Information:</strong> Processed securely through our payment partners (we do not store full credit card details).</li>
      <li><strong>API Keys:</strong> Generated keys and their associated metadata (tags, files, permissions).</li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>To provide and maintain the LogoHub API service.</li>
      <li>To process API requests and enforce rate limits.</li>
      <li>To send service-related notifications (billing, plan changes, security alerts).</li>
      <li>To improve our API performance and reliability.</li>
      <li>To comply with legal obligations.</li>
    </ul>

    <h2>3. Data Storage & Security</h2>
    <p>Your data is stored on Cloudflare's global edge network with encryption at rest and in transit. We implement industry-standard security measures including HTTPS, API key hashing, and JWT-based authentication.</p>

    <h2>4. Data Retention</h2>
    <p>We retain your account data for as long as your account is active. Upon account deletion, all personal data is permanently removed within 30 days. API usage logs are retained for 90 days for analytics purposes.</p>

    <h2>5. Third-Party Services</h2>
    <p>We use Cloudflare for CDN and edge computing. Payment processing is handled by Stripe. These services have their own privacy policies.</p>

    <h2>6. Your Rights</h2>
    <ul>
      <li>Access your personal data at any time via your dashboard.</li>
      <li>Request deletion of your account and associated data.</li>
      <li>Export your data in a machine-readable format.</li>
      <li>Opt-out of non-essential communications.</li>
    </ul>

    <h2>7. Contact</h2>
    <p>For privacy-related inquiries, contact us at <strong>privacy@logohub.dev</strong>.</p>`);
}

export function termsPage() {
  return footerPage('Terms of Service', 'Last updated: June 2026',
    `<h2>1. Acceptance of Terms</h2>
    <p>By accessing or using the LogoHub API ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

    <h2>2. Description of Service</h2>
    <p>LogoHub API provides a REST API and CDN for accessing logos, brand icons, flags, sports emblems, and other visual assets. The Service is provided on an "as is" basis.</p>

    <h2>3. User Accounts</h2>
    <ul>
      <li>You must provide accurate registration information.</li>
      <li>You are responsible for maintaining the security of your account credentials.</li>
      <li>You must be at least 16 years old to use the Service.</li>
    </ul>

    <h2>4. API Keys & Usage</h2>
    <ul>
      <li>API keys are confidential and should not be shared.</li>
      <li>You agree not to exceed the rate limits of your plan.</li>
      <li>We reserve the right to revoke API keys for abuse or violation of these terms.</li>
    </ul>

    <h2>5. Plans & Billing</h2>
    <ul>
      <li>Free tier is subject to 1,000 requests/day.</li>
      <li>Paid plans are billed monthly or annually.</li>
      <li>Refunds are available within 7 days of purchase.</li>
    </ul>

    <h2>6. Intellectual Property</h2>
    <p>All trademarks, logos, and brand assets available through the API belong to their respective owners. LogoHub does not claim ownership of any third-party assets.</p>

    <h2>7. Limitation of Liability</h2>
    <p>LogoHub shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Service.</p>

    <h2>8. Termination</h2>
    <p>We reserve the right to suspend or terminate accounts for violation of these terms. You may terminate your account at any time via the dashboard.</p>`);
}

export function cookiesPage() {
  return footerPage('Cookie Policy', 'Last updated: June 2026',
    `<h2>1. What Are Cookies</h2>
    <p>Cookies are small text files stored on your device by your web browser. They help us provide core functionality and improve your experience.</p>

    <h2>2. How We Use Cookies</h2>
    <ul>
      <li><strong>Essential Cookies:</strong> Required for authentication (JWT tokens stored in localStorage) and theme preferences.</li>
      <li><strong>Analytics Cookies:</strong> We use minimal analytics to understand API usage patterns. No personal data is shared with third-party analytics providers.</li>
      <li><strong>Preference Cookies:</strong> Store your dashboard preferences (theme, layout, sidebar state).</li>
    </ul>

    <h2>3. Third-Party Cookies</h2>
    <p>We do not use third-party advertising cookies. Our CDN (Cloudflare) may set technical cookies for security and performance.</p>

    <h2>4. Managing Cookies</h2>
    <p>You can disable cookies in your browser settings. However, some features (authentication, theme persistence) may not work correctly.</p>

    <h2>5. Cookie Duration</h2>
    <ul>
      <li>Session cookies: Deleted when you close the browser.</li>
      <li>Persistent cookies: Used for preferences (theme, language) — last up to 1 year.</li>
    </ul>`);
}

export function aboutPage() {
  return footerPage('About LogoHub', 'The World\'s Largest Visual Identity API',
    `<h2>Our Mission</h2>
    <p>LogoHub was built to solve a common problem: finding high-quality, consistent brand assets across thousands of companies, sports teams, and organizations — all through a single, fast API.</p>

    <h2>What We Offer</h2>
    <ul>
      <li><strong>50,000+ Assets:</strong> Logos, flags, sports emblems, crypto icons, framework logos, and more.</li>
      <li><strong>18ms Average Response Time:</strong> Served from 200+ global edge locations.</li>
      <li><strong>Multiple Formats:</strong> SVG, PNG, WebP, JPG, ICO, AVIF.</li>
      <li><strong>URL Transformations:</strong> Resize, add backgrounds, round corners, and more — all via query parameters.</li>
      <li><strong>Full REST API:</strong> 23+ endpoints with consistent JSON responses.</li>
    </ul>

    <h2>The Team</h2>
    <p>LogoHub is built and maintained by a passionate team of developers and designers who believe that visual identity data should be open, fast, and accessible to everyone.</p>

    <h2>Our Stack</h2>
    <p>Built on Cloudflare Workers at the edge with Hono.js (TypeScript), Vite, and Tailwind CSS. The API runs on a globally distributed network ensuring low latency from anywhere in the world.</p>`);
}

export function contactPage() {
  return footerPage('Contact Us', 'We\'d love to hear from you!',
    `<h2>Get in Touch</h2>

    <h3>Email</h3>
    <p><strong>General Inquiries:</strong> <a href="mailto:hello@logohub.dev">hello@logohub.dev</a></p>
    <p><strong>Support:</strong> <a href="mailto:support@logohub.dev">support@logohub.dev</a></p>
    <p><strong>Sales:</strong> <a href="mailto:sales@logohub.dev">sales@logohub.dev</a></p>
    <p><strong>Privacy:</strong> <a href="mailto:privacy@logohub.dev">privacy@logohub.dev</a></p>

    <h3>Social Media</h3>
    <ul>
      <li>Twitter/X: <a href="https://twitter.com/logohub_dev">@logohub_dev</a></li>
      <li>GitHub: <a href="https://github.com/deopmdecastro/logohub-api">github.com/deopmdecastro/logohub-api</a></li>
      <li>Discord: Join our community server (coming soon)</li>
    </ul>

    <h3>Response Time</h3>
    <p>We typically respond within:</p>
    <ul>
      <li><strong>Free plan:</strong> 48 hours</li>
      <li><strong>Pro plan:</strong> 24 hours</li>
      <li><strong>Business plan:</strong> 4 hours</li>
      <li><strong>Enterprise:</strong> 1 hour (dedicated support)</li>
    </ul>`);
}

export function faqPage() {
  return footerPage('Frequently Asked Questions', 'Everything you need to know about LogoHub API',
    `<h3>What is LogoHub API?</h3>
    <p>LogoHub is a REST API and CDN that provides access to 50,000+ logos, brand icons, flags, sports emblems, and more. Think of it as "the world's largest visual identity API".</p>

    <h3>How do I get started?</h3>
    <p>Just start making requests! The free tier requires no authentication — you can call any public endpoint right away. For higher limits, <a href="/pricing">upgrade to a paid plan</a> and get an API key.</p>

    <h3>What formats are supported?</h3>
    <p>SVG, PNG, WebP, JPG, ICO, and AVIF. You can also apply transformations via URL parameters: resize, add backgrounds, round corners, apply shadows, and more.</p>

    <h3>What are the rate limits?</h3>
    <ul>
      <li>Free: 1,000 requests/day</li>
      <li>Pro: 100,000 requests/day ($19/mo)</li>
      <li>Business: 1,000,000 requests/day ($79/mo)</li>
      <li>Enterprise: Unlimited (custom pricing)</li>
    </ul>

    <h3>How do I authenticate?</h3>
    <p>Pass your API key in the <code>X-API-Key</code> header or as a query parameter <code>?api_key=your_key</code>.</p>

    <h3>Can I upload my own logos?</h3>
    <p>Yes! Pro and Business plan users can upload custom logos through the dashboard or API.</p>

    <h3>Do you have SDKs?</h3>
    <p>Yes — JavaScript/TypeScript and Python SDKs are available. Check the <a href="/docs">docs</a> for installation instructions.</p>

    <h3>How fast is the API?</h3>
    <p>Our average response time is 18ms, served from Cloudflare's global edge network (200+ locations).</p>`);
}

export function careersPage() {
  return footerPage('Careers', 'Join the team building the world\'s largest visual identity API',
    `<h2>Why Work at LogoHub?</h2>
    <p>We're a remote-first team building infrastructure that powers thousands of applications worldwide. Our API serves millions of requests daily with 18ms average latency.</p>

    <h2>Open Positions</h2>
    <div class="card" style="padding:1.5rem;margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
        <span class="pill pill-lilac">Engineering</span>
        <span style="font-size:.75rem;color:var(--text-mute)">Remote</span>
      </div>
      <h3 style="margin:.25rem 0">Senior Backend Engineer</h3>
      <p style="font-size:.9rem;color:var(--text-soft)">Build and scale our API infrastructure. Experience with TypeScript, Cloudflare Workers, and distributed systems required.</p>
    </div>
    <div class="card" style="padding:1.5rem;margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
        <span class="pill pill-amber">Design</span>
        <span style="font-size:.75rem;color:var(--text-mute)">Remote</span>
      </div>
      <h3 style="margin:.25rem 0">Product Designer</h3>
      <p style="font-size:.9rem;color:var(--text-soft)">Design intuitive developer tools and dashboards. Experience with design systems and developer-focused products.</p>
    </div>
    <div class="card" style="padding:1.5rem;margin-bottom:1rem">
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
        <span class="pill pill-teal">Developer Relations</span>
        <span style="font-size:.75rem;color:var(--text-mute)">Remote</span>
      </div>
      <h3 style="margin:.25rem 0">Developer Advocate</h3>
      <p style="font-size:.9rem;color:var(--text-soft)">Create content, build demos, and engage with the developer community. Strong technical writing and public speaking skills.</p>
    </div>

    <h2>How to Apply</h2>
    <p>Send your resume and a brief introduction to <a href="mailto:careers@logohub.dev">careers@logohub.dev</a>. We review every application personally.</p>

    <h2>Benefits</h2>
    <ul>
      <li>🌍 Fully remote — work from anywhere</li>
      <li>💻 Latest hardware of your choice</li>
      <li>📚 Learning & development budget</li>
      <li>🏖️ 25 days PTO + local holidays</li>
      <li>🏥 Health insurance (country-dependent)</li>
      <li>💰 Competitive salary + equity</li>
    </ul>`);
}

export function blogPage() {
  return footerPage('Blog', 'Latest updates from the LogoHub team',
    `<div class="card card-hover" style="padding:1.5rem;margin-bottom:1.5rem;cursor:pointer">
      <span class="pill pill-lilac" style="margin-bottom:.75rem;display:inline-flex">Announcement</span>
      <h3 style="margin:.25rem 0">Introducing the Playground — Code in Your Browser</h3>
      <p style="color:var(--text-soft);margin-bottom:.5rem">We've launched a built-in code editor supporting HTML, CSS, JavaScript, and TypeScript. Try it now at /playground.</p>
      <div style="display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--text-mute)">
        <span>June 27, 2026</span><span>·</span><span>5 min read</span>
      </div>
    </div>

    <div class="card card-hover" style="padding:1.5rem;margin-bottom:1.5rem;cursor:pointer">
      <span class="pill pill-amber" style="margin-bottom:.75rem;display:inline-flex">Engineering</span>
      <h3 style="margin:.25rem 0">How We Achieve 18ms Average Response Time</h3>
      <p style="color:var(--text-soft);margin-bottom:.5rem">A deep dive into our edge-computing architecture using Cloudflare Workers and optimized data structures.</p>
      <div style="display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--text-mute)">
        <span>June 20, 2026</span><span>·</span><span>8 min read</span>
      </div>
    </div>

    <div class="card card-hover" style="padding:1.5rem;margin-bottom:1.5rem;cursor:pointer">
      <span class="pill pill-teal" style="margin-bottom:.75rem;display:inline-flex">Product</span>
      <h3 style="margin:.25rem 0">API Keys v2: Tags, Files, and Better Organization</h3>
      <p style="color:var(--text-soft);margin-bottom:.5rem">Organize your API keys with tags and associate multiple files per key — each identifiable by a custom tag.</p>
      <div style="display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--text-mute)">
        <span>June 15, 2026</span><span>·</span><span>3 min read</span>
      </div>
    </div>

    <div class="card card-hover" style="padding:1.5rem;margin-bottom:1.5rem;cursor:pointer">
      <span class="pill pill-green" style="margin-bottom:.75rem;display:inline-flex">Community</span>
      <h3 style="margin:.25rem 0">LogoHub Reaches 1 Million Daily Requests</h3>
      <p style="color:var(--text-soft);margin-bottom:.5rem">Thanks to our amazing community, we've hit a major milestone. Here's what's next for the platform.</p>
      <div style="display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:var(--text-mute)">
        <span>June 1, 2026</span><span>·</span><span>4 min read</span>
      </div>
    </div>`);
}
