/**
 * seo-audit.ts
 *
 * Checks every item in the Bidii Schools SEO acceptance checklist against
 * the LIVE site at https://www.bidiischools.co.ke.  Fetches actual HTTP
 * responses the way Google would — catching deploy-time and DNS-level
 * regressions, not just source-code bugs.
 *
 * Run:  pnpm --filter @workspace/scripts seo-audit
 *   or: npm run seo-audit   (from workspace root)
 *
 * Exit 0 → all checks passed.
 * Exit 1 → one or more checks failed (use in CI as a build gate).
 */

import * as https from 'node:https';
import * as http from 'node:http';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CANONICAL = 'https://www.bidiischools.co.ke';

/** Variants that must 301/308-redirect to CANONICAL. */
const REDIRECT_VARIANTS = [
  'http://bidiischools.co.ke',
  'https://bidiischools.co.ke',
  'http://www.bidiischools.co.ke',
];

/** Routes that must NOT appear in the sitemap and must be Disallowed in robots.txt. */
const PROTECTED_ROUTES = ['/dashboard', '/api/', '/auth/', '/login', '/register', '/admin/'];

/** Minimum acceptable Lighthouse SEO score (0–100). */
const MIN_LIGHTHOUSE_SEO = 100;

// ---------------------------------------------------------------------------
// Result tracking
// ---------------------------------------------------------------------------

interface CheckResult {
  label: string;
  passed: boolean;
  detail?: string;
}

const results: CheckResult[] = [];

function pass(label: string, detail?: string): void {
  results.push({ label, passed: true, detail });
}

function fail(label: string, detail: string): void {
  results.push({ label, passed: false, detail });
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

interface Response {
  statusCode: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
}

function get(url: string, followRedirects = true, maxRedirects = 5): Promise<Response> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;

    const req = mod.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; BidiiSEOAudit/1.0; +https://www.bidiischools.co.ke)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        // Don't throw on self-signed certs in staging, but still validate in prod
        rejectUnauthorized: true,
      },
      (res) => {
        const location = res.headers['location'];
        if (
          followRedirects &&
          maxRedirects > 0 &&
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          location
        ) {
          res.resume();
          const nextUrl = location.startsWith('http') ? location : `${parsed.origin}${location}`;
          resolve(get(nextUrl, true, maxRedirects - 1));
          return;
        }

        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk: string) => { body += chunk; });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            headers: res.headers as Record<string, string | string[] | undefined>,
            body,
          });
        });
      },
    );

    req.on('error', reject);
    req.setTimeout(15_000, () => {
      req.destroy(new Error(`Timeout fetching ${url}`));
    });
  });
}

/**
 * Returns the final redirect destination (Location header) and status code
 * WITHOUT following the redirect — used to verify 301 behaviour.
 */
function headNoFollow(url: string): Promise<{ statusCode: number; location?: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;

    const req = mod.get(url, { headers: { 'User-Agent': 'BidiiSEOAudit/1.0' } }, (res) => {
      res.resume();
      resolve({
        statusCode: res.statusCode ?? 0,
        location: res.headers['location'] as string | undefined,
      });
    });
    req.on('error', reject);
    req.setTimeout(10_000, () => req.destroy(new Error(`Timeout: ${url}`)));
  });
}

// ---------------------------------------------------------------------------
// HTML parsing helpers (no external deps — pure regex on well-structured HTML)
// ---------------------------------------------------------------------------

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractH1(html: string): string | null {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return null;
  // Strip inner tags (e.g. <em>, <span>) to get plain text
  return m[1].replace(/<[^>]+>/g, '').trim();
}

function extractCanonical(html: string): string | null {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return m ? m[1].trim() : null;
}

function extractJsonLd(html: string): unknown[] {
  const blocks: unknown[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      // malformed block — captured as a parse failure below
      blocks.push(null);
    }
  }
  return blocks;
}

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

async function checkTitleAndH1(): Promise<void> {
  const label = '1. Every public page title contains "Bidii Schools"';
  let res: Response;
  try {
    res = await get(CANONICAL);
  } catch (e) {
    fail(label, `Could not fetch ${CANONICAL}: ${(e as Error).message}`);
    return;
  }

  if (res.statusCode !== 200) {
    fail(label, `HTTP ${res.statusCode} from ${CANONICAL}`);
    return;
  }

  const title = extractTitle(res.body);
  if (!title) {
    fail(label, 'No <title> tag found in homepage HTML');
    return;
  }
  if (!title.toLowerCase().includes('bidii schools')) {
    fail(label, `<title> does not contain "Bidii Schools": "${title}"`);
    return;
  }
  pass(label, `<title> = "${title}"`);

  // Also check sitemap pages (reuse body below)
  await checkSitemapPageTitles(res.body);

  // H1 check — same response
  const h1label = '6. Homepage <h1> contains the literal text "Bidii Schools"';
  const h1 = extractH1(res.body);
  if (!h1) {
    fail(h1label, 'No <h1> element found in homepage HTML');
  } else if (!h1.toLowerCase().includes('bidii schools')) {
    fail(h1label, `<h1> text does not contain "Bidii Schools": "${h1}"`);
  } else {
    pass(h1label, `<h1> = "${h1}"`);
  }

  // Canonical check — same response
  const canonLabel = '2a. Homepage canonical tag points to the correct domain';
  const canonical = extractCanonical(res.body);
  if (!canonical) {
    fail(canonLabel, 'No <link rel="canonical"> found on homepage');
  } else {
    const normalised = canonical.replace(/\/$/, '');
    const expected = CANONICAL.replace(/\/$/, '');
    if (normalised !== expected) {
      fail(canonLabel, `canonical = "${canonical}", expected "${CANONICAL}"`);
    } else {
      pass(canonLabel, `canonical = "${canonical}"`);
    }
  }

  // Store body for JSON-LD check
  homepageBody = res.body;
}

let homepageBody = '';

async function checkSitemapPageTitles(homepageHtml: string): Promise<void> {
  // Parse the sitemap to get all page URLs, then spot-check titles
  let sitemapRes: Response;
  try {
    sitemapRes = await get(`${CANONICAL}/sitemap.xml`);
  } catch {
    // Sitemap itself is validated in a separate check
    return;
  }
  if (sitemapRes.statusCode !== 200) return;

  const locs = [...sitemapRes.body.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/gi)].map((m) =>
    m[1].trim(),
  );

  for (const loc of locs) {
    // Homepage was already checked — skip
    const normalised = loc.replace(/\/$/, '');
    if (normalised === CANONICAL.replace(/\/$/, '')) continue;

    let pageRes: Response;
    try {
      pageRes = await get(loc);
    } catch (e) {
      fail(
        `1. Sitemap page title check — ${loc}`,
        `Could not fetch: ${(e as Error).message}`,
      );
      continue;
    }
    const t = extractTitle(pageRes.body);
    if (!t || !t.toLowerCase().includes('bidii schools')) {
      fail(`1. Sitemap page title check — ${loc}`, `<title> = "${t ?? '(missing)'}"`);
    } else {
      pass(`1. Sitemap page title check — ${loc}`, `<title> = "${t}"`);
    }
  }

  void homepageHtml; // used above, referenced to satisfy linter
}

async function checkRedirects(): Promise<void> {
  const label = '2. Only one canonical domain; all variants 301-redirect to it';

  const failures: string[] = [];
  for (const variant of REDIRECT_VARIANTS) {
    try {
      const r = await headNoFollow(variant);
      if (r.statusCode !== 301 && r.statusCode !== 308) {
        failures.push(
          `${variant} → HTTP ${r.statusCode} (expected 301 or 308)`,
        );
      } else {
        const dest = (r.location ?? '').replace(/\/$/, '');
        const expected = CANONICAL.replace(/\/$/, '');
        if (dest !== expected) {
          failures.push(
            `${variant} → ${r.statusCode} but Location: "${r.location}" (expected "${CANONICAL}")`,
          );
        }
      }
    } catch (e) {
      failures.push(`${variant} → fetch error: ${(e as Error).message}`);
    }
  }

  if (failures.length === 0) {
    pass(label, `All ${REDIRECT_VARIANTS.length} variants redirect correctly`);
  } else {
    fail(label, failures.join('\n  '));
  }
}

async function checkJsonLd(): Promise<void> {
  const label = '3. JSON-LD Organization schema — present, well-formed, @type=Organization, name="Bidii Schools"';

  if (!homepageBody) {
    fail(label, 'Homepage body not available (earlier fetch failed)');
    return;
  }

  const blocks = extractJsonLd(homepageBody);
  if (blocks.length === 0) {
    fail(label, 'No <script type="application/ld+json"> found on homepage');
    return;
  }

  if (blocks.includes(null)) {
    fail(label, 'At least one JSON-LD block failed to parse (malformed JSON)');
    return;
  }

  // Flatten @graph arrays
  const nodes: unknown[] = [];
  for (const block of blocks) {
    if (block && typeof block === 'object' && '@graph' in (block as object)) {
      nodes.push(...((block as { '@graph': unknown[] })['@graph']));
    } else {
      nodes.push(block);
    }
  }

  const org = nodes.find(
    (n) =>
      n &&
      typeof n === 'object' &&
      (n as Record<string, unknown>)['@type'] === 'Organization',
  ) as Record<string, unknown> | undefined;

  if (!org) {
    fail(label, `JSON-LD blocks found but none has @type: "Organization". Types present: ${nodes.map((n) => (n as Record<string, unknown>)['@type']).join(', ')}`);
    return;
  }

  const name = org['name'] as string | undefined;
  if (!name || !name.toLowerCase().includes('bidii schools')) {
    fail(label, `Organization @type found but name = "${name ?? '(missing)'}" — must contain "Bidii Schools"`);
    return;
  }

  const url = org['url'] as string | undefined;
  if (!url || !url.includes('bidiischools.co.ke')) {
    fail(label, `Organization url = "${url ?? '(missing)'}" — must reference bidiischools.co.ke`);
    return;
  }

  pass(label, `name="${name}", url="${url}"`);
}

async function checkSitemap(): Promise<void> {
  const label = '4a. /sitemap.xml is live and reachable';
  let res: Response;
  try {
    res = await get(`${CANONICAL}/sitemap.xml`);
  } catch (e) {
    fail(label, `Fetch error: ${(e as Error).message}`);
    return;
  }

  if (res.statusCode !== 200) {
    fail(label, `HTTP ${res.statusCode}`);
    return;
  }
  if (!res.body.includes('<urlset') && !res.body.includes('<sitemapindex')) {
    fail(label, 'Response does not look like a valid sitemap (no <urlset> or <sitemapindex>)');
    return;
  }
  pass(label, `HTTP 200, ${res.body.length} bytes`);

  // Check no protected routes appear in the sitemap
  const sitemapProtectedLabel = '5a. Authenticated routes are excluded from the sitemap';
  const violations: string[] = [];
  for (const route of PROTECTED_ROUTES) {
    if (res.body.includes(route)) {
      violations.push(route);
    }
  }
  if (violations.length > 0) {
    fail(sitemapProtectedLabel, `Sitemap contains protected routes: ${violations.join(', ')}`);
  } else {
    pass(sitemapProtectedLabel, 'No protected routes found in sitemap');
  }

  // Check all <loc> URLs use the canonical domain
  const nonCanonical = [...res.body.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/gi)]
    .map((m) => m[1])
    .filter((url) => !url.startsWith(CANONICAL));
  if (nonCanonical.length > 0) {
    fail('4b. All sitemap <loc> entries use the canonical domain', `Non-canonical URLs: ${nonCanonical.join(', ')}`);
  } else {
    pass('4b. All sitemap <loc> entries use the canonical domain');
  }
}

async function checkRobots(): Promise<void> {
  const label = '4c. /robots.txt is live and references the sitemap';
  let res: Response;
  try {
    res = await get(`${CANONICAL}/robots.txt`);
  } catch (e) {
    fail(label, `Fetch error: ${(e as Error).message}`);
    return;
  }

  if (res.statusCode !== 200) {
    fail(label, `HTTP ${res.statusCode}`);
    return;
  }
  if (!res.body.includes('Sitemap:')) {
    fail(label, 'robots.txt does not contain a Sitemap: directive');
    return;
  }
  if (!res.body.includes('bidiischools.co.ke')) {
    fail(label, 'Sitemap: directive in robots.txt does not reference bidiischools.co.ke');
    return;
  }
  pass(label, 'robots.txt present with correct Sitemap reference');

  // Check protected routes are disallowed
  const disallowLabel = '5b. Authenticated routes are Disallowed in robots.txt';
  const missing: string[] = [];
  for (const route of ['/dashboard', '/api/', '/auth/']) {
    if (!res.body.includes(`Disallow: ${route}`)) {
      missing.push(route);
    }
  }
  if (missing.length > 0) {
    fail(disallowLabel, `Missing Disallow directives for: ${missing.join(', ')}`);
  } else {
    pass(disallowLabel, 'All required Disallow directives present');
  }
}

async function checkLighthouse(): Promise<void> {
  const label = `7. Lighthouse SEO score ≥ ${MIN_LIGHTHOUSE_SEO} on homepage`;

  // Try to find the lighthouse CLI
  let lighthouseBin: string;
  try {
    const { execSync } = await import('node:child_process');
    const which = process.platform === 'win32' ? 'where lighthouse' : 'which lighthouse';
    lighthouseBin = execSync(which, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim().split('\n')[0].trim();
  } catch {
    fail(
      label,
      'lighthouse CLI not found — install it with: npm install -g lighthouse\n  ' +
        'Then re-run this audit. Skipping Lighthouse check for now.',
    );
    return;
  }

  try {
    const { execSync } = await import('node:child_process');
    const output = execSync(
      `"${lighthouseBin}" ${CANONICAL} --output=json --output-path=stdout --only-categories=seo --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --quiet`,
      { encoding: 'utf8', timeout: 120_000 },
    );

    const report = JSON.parse(output) as {
      categories?: { seo?: { score?: number } };
    };
    const rawScore = report?.categories?.seo?.score;
    if (rawScore === undefined || rawScore === null) {
      fail(label, 'Could not parse SEO score from Lighthouse output');
      return;
    }

    const score = Math.round(rawScore * 100);
    if (score < MIN_LIGHTHOUSE_SEO) {
      fail(label, `Score = ${score} (need ≥ ${MIN_LIGHTHOUSE_SEO})`);
    } else {
      pass(label, `Score = ${score}`);
    }
  } catch (e) {
    fail(label, `Lighthouse run failed: ${(e as Error).message.slice(0, 200)}`);
  }
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('\n🔍  Bidii Schools — SEO Audit\n');
  console.log(`    Target: ${CANONICAL}`);
  console.log(`    Date:   ${new Date().toISOString()}\n`);

  // Run checks — some are sequential because they share state (homepageBody),
  // others are fully independent.
  await checkTitleAndH1();       // sets homepageBody, checks title + h1 + canonical
  await checkJsonLd();           // uses homepageBody
  await checkRedirects();
  await checkSitemap();
  await checkRobots();
  await checkLighthouse();

  // ---------------------------------------------------------------------------
  // Report
  // ---------------------------------------------------------------------------
  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);

  console.log('─'.repeat(72));
  console.log('  RESULTS\n');

  for (const r of results) {
    const icon = r.passed ? '✅' : '❌';
    console.log(`  ${icon}  ${r.label}`);
    if (r.detail && (!r.passed || process.env['SEO_AUDIT_VERBOSE'])) {
      console.log(`       ${r.detail.replace(/\n/g, '\n       ')}`);
    }
  }

  console.log('\n' + '─'.repeat(72));
  console.log(`  ${passed.length} passed   ${failed.length} failed   ${results.length} total`);

  if (failed.length > 0) {
    console.log('\n  Failed checks:');
    for (const r of failed) {
      console.log(`\n  ❌  ${r.label}`);
      if (r.detail) {
        console.log(`       ${r.detail.replace(/\n/g, '\n       ')}`);
      }
    }
    console.log('\n');
    process.exit(1);
  } else {
    console.log('\n  ✅  All checks passed.\n');
    process.exit(0);
  }
}

main().catch((err: unknown) => {
  console.error('\n💥  Audit script crashed:', err);
  process.exit(1);
});
