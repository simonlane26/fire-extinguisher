// Build-time prerendering for public marketing pages.
//
// The frontend is a client-rendered SPA — crawlers that don't execute
// JavaScript (Bingbot, social link-preview bots, etc.) receive an empty
// <div id="root"></div> with no <h1> and no content. This script runs
// after `vite build`, loads each public route in headless Chrome (already
// installed in the Docker image for PDF generation — see reports.service.ts),
// waits for React to render, and saves the fully-rendered HTML as a static
// file. main.ts serves these snapshots to crawlers instead of the empty
// shell; real browsers still get the normal interactive SPA once the JS
// bundle loads and React mounts over the snapshot.
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const DIST = path.join(__dirname, '..', 'frontend', 'dist');
const PORT = 4173;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2',
};

// Third-party trackers we don't want firing during a headless build run
const BLOCKED_HOSTS = [
  'googletagmanager.com', 'google-analytics.com', 'googleadservices.com',
  'doubleclick.net', 'analytics.google.com', 'connect.facebook.net', 'facebook.com',
];

const ROUTES = [
  {
    path: '/',
    out: 'index.html',
    title: 'Fire Extinguisher Management System | Inspection & Compliance Tracking',
    description: 'Track fire extinguisher inspections, compliance and maintenance across every site — QR-tagged assets, scheduled reminders, audit-ready reports.',
  },
  {
    path: '/compare',
    out: 'compare.html',
    title: 'How FirexCheck Compares | FirexCheck',
    description: 'Honest, fact-checked comparisons of FirexCheck against other fire safety compliance tools.',
  },
  {
    path: '/compare/joblogic',
    out: 'compare/joblogic.html',
    title: 'FirexCheck vs Joblogic | FirexCheck',
    description: 'A purpose-built fire safety register vs a general field service management platform. See how FirexCheck and Joblogic compare.',
  },
  {
    path: '/compare/uptick-ezmanagement',
    out: 'compare/uptick-ezmanagement.html',
    title: 'FirexCheck vs Uptick vs EZ Management | FirexCheck',
    description: 'How FirexCheck compares to Uptick and EZ Management’s ezServiceHUB, two UK fire & security compliance platforms.',
  },
];

function serveStatic() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let filePath = path.join(DIST, urlPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST, 'index.html'); // SPA fallback for client-side routes
    }
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  });
}

function setMeta(html, title, description, canonicalUrl) {
  // Chrome's DOM serialization strips the trailing "/" from normal void
  // elements (meta/link/img) but preserves it verbatim on anything inside a
  // <noscript> block (stored as raw unparsed text when JS is enabled, e.g.
  // the Meta Pixel <noscript><img .../></noscript> fallback further down the
  // page). Requiring a literal "/>" here previously let the lazy quantifier
  // skip straight past every real meta tag (none of which still have the
  // slash) and run all the way down to that one surviving tag, swallowing
  // the entire rendered page in between. The "/" must be optional.
  html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);
  html = html.replace(/<meta name="title" content=".*?"\s*\/?>/s, `<meta name="title" content="${title}" />`);
  html = html.replace(/<meta name="description" content=".*?"\s*\/?>/s, `<meta name="description" content="${description}" />`);
  html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/s, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/s, `<meta property="og:description" content="${description}" />`);
  html = html.replace(/<meta property="twitter:title" content=".*?"\s*\/?>/s, `<meta property="twitter:title" content="${title}" />`);
  html = html.replace(/<meta property="twitter:description" content=".*?"\s*\/?>/s, `<meta property="twitter:description" content="${description}" />`);
  html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/s, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta property="twitter:url" content=".*?"\s*\/?>/s, `<meta property="twitter:url" content="${canonicalUrl}" />`);
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/s, `<link rel="canonical" href="${canonicalUrl}" />`);
  return html;
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.error(`❌ Prerender skipped: ${DIST} does not exist. Run the frontend build first.`);
    process.exit(1);
  }

  const server = serveStatic();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`📡 Prerender static server up on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();

      // Skip third-party trackers and block anything the snapshot doesn't need
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const url = req.url();
        if (BLOCKED_HOSTS.some((host) => url.includes(host))) {
          return req.abort();
        }
        return req.continue();
      });

      // Render the page's already-built "reduced motion" code path — the
      // GSAP scroll-story hero on the homepage otherwise starts elements at
      // opacity:0 and animates them in, which would get captured mid-animation.
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

      await page.goto(`http://localhost:${PORT}${route.path}`, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('h1', { timeout: 10000 }).catch(() => {
        console.warn(`⚠️  No <h1> found on ${route.path} — check the page rendered correctly.`);
      });

      let html = await page.content();
      html = setMeta(html, route.title, route.description, `https://firexcheck.com${route.path}`);

      const outPath = path.join(DIST, 'prerendered', route.out);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
      console.log(`✅ Prerendered ${route.path} -> prerendered/${route.out}`);

      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
