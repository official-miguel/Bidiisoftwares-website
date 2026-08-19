# Bidii School Management Website

An animated marketing website that explains the Bidii school management system to Kenyan school leaders, staff, parents, and learners.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/bidii-site/` — the deployable Bidii marketing website.
- `attached_assets/` — source website copy and pricing guide used for the page content.
- `artifacts/api-server/` — shared API service scaffold; the marketing site currently uses no backend endpoints.

## Architecture decisions

- The first build is a presentation-first single-page website; marketing interactions are local and do not require authentication or a database.
- The visual language combines an editorial school-book metaphor with a technology-forward dashboard vocabulary.
- Pricing is calculated in the browser from the graduated per-student bands in the Bidii pricing guide so the estimator stays transparent.
- Legal text and the demo request are accessible through in-page dialogs to keep the landing page focused while still making trust content reachable.

## Product

The site explains Bidii's connected school management capabilities, including CBC academics, attendance, finance, boarding, library, communication, discipline, achievements, analytics, Soma AI, compatibility across Android/iOS/PC, pricing, migration, security, FAQs, and legal terms.

## User preferences

- Keep clear, polished spaces for adding screenshots of every Bidii module or feature explained on the website.
- Make the experience simple enough for a young child to understand while remaining credible and professional for school leaders.

## Gotchas

- Keep the Bidii page as the root web artifact so the main preview and published site resolve to the landing page.
- Use the managed `artifacts/bidii-site: web` workflow for preview; the app requires its workflow-provided `PORT` and `BASE_PATH`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
