---
name: seo-audit
description: >
  Runs the Bidii Schools SEO acceptance checklist against the live site at
  https://bidiischools.co.ke. Fetches real HTTP responses the way Google
  would, so it catches deploy-time and DNS-level regressions — not just
  source-code bugs.
---

# SEO Audit Skill

## What it checks

Runs `scripts/src/seo-audit.ts` against the **live** `https://bidiischools.co.ke` and
produces a one-to-one pass/fail result for every item in the acceptance checklist:

| # | Check |
|---|-------|
| 1 | Every public page `<title>` contains "Bidii Schools" |
| 2 | Only one canonical domain form is reachable; all variants 301-redirect to it |
| 3 | JSON-LD `Organization` schema — present, well-formed, `@type=Organization`, `name="Bidii Schools"` |
| 4 | `/sitemap.xml` and `/robots.txt` are live and correct |
| 5 | Authenticated routes (`/dashboard`, `/api/`, `/auth/`) absent from sitemap and Disallowed in robots.txt |
| 6 | Homepage `<h1>` contains the literal text "Bidii Schools" |
| 7 | Lighthouse SEO score ≥ 100 on the homepage |

## When to run it

- **Before merging** any PR that touches `index.html`, `App.tsx`, `sitemap.xml`, `robots.txt`, or the Vercel / hosting config.
- **After a deploy** to production — the CI workflow (`.github/workflows/seo-audit.yml`) does this automatically on every successful Vercel deployment.
- **After a domain or DNS change** — redirects and canonical tags are the most common post-migration regression.
- **After adding a new marketing page** — to verify its title and that it's in the sitemap.

## How to run it manually

From the workspace root:

```sh
pnpm seo-audit
```

Or directly from the `scripts/` package:

```sh
pnpm --filter @workspace/scripts seo-audit
```

Set `SEO_AUDIT_VERBOSE=1` to print the detail line for every check, not just failures:

```sh
SEO_AUDIT_VERBOSE=1 pnpm seo-audit
```

## Prerequisites

- Node 18+ (uses native `fetch`-equivalent via `node:https`)
- `pnpm install` done at the workspace root (pulls in `tsx`)
- `lighthouse` CLI installed globally for the Lighthouse SEO score check:
  ```sh
  npm install -g lighthouse@12
  ```
  If Lighthouse is not installed, that specific check is skipped with a clear message — all other checks still run.
- **The site must be live and DNS must resolve** — this script checks the real deployment, not localhost.

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | All checks passed |
| `1` | One or more checks failed — review the output and fix before deploying |

## Adding new pages to the sitemap

When you add a new public marketing page:

1. Add its `<loc>` entry to `artifacts/bidii-site/public/sitemap.xml`.
2. Ensure its rendered `<title>` contains "Bidii Schools".
3. Run `pnpm seo-audit` to verify the new page passes checks 1 and 4.

## Important: the OG image

`index.html` references `/og-image.png` for social sharing previews.
That file **does not yet exist** — see `artifacts/bidii-site/public/og-image-README.md`
for the spec. Create and commit it before the first production deploy, or social
sharing previews will show a broken image.
