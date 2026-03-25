# New Portfolio

SvelteKit portfolio site with:

- a public VS Code-inspired portfolio experience under `(portfolio)`
- an authenticated admin area for managing about, careers, skills, projects, and blogs
- Turso + Drizzle for persistence
- optional R2 uploads for project and blog media
- a one-time Notion to Turso seed script

## Commands

```sh
pnpm dev
pnpm check
pnpm build
pnpm lint
pnpm db:push
pnpm db:seed
```

## Required Environment

Copy [.env.example](/Users/sushil/Projects/Svelte/new-portfolio/.env.example) to `.env.local` and provide:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `ADMIN_PASSWORD`

## Optional Environment

Set these if you use the related features:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`
- `VERCEL_DEPLOY_HOOK_URL`

## Seed Migration

`pnpm db:seed` migrates portfolio content from Notion into Turso.

For that script only, set:

- `INTEGRATION_TOKEN` or `NOTION_TOKEN`
- `BASE_URL`

## Structure

- `src/routes/(portfolio)` public portfolio routes
- `src/routes/admin` admin UI
- `src/routes/api/auth` auth endpoints
- `src/routes/api/upload` R2 upload endpoint
- `src/lib/server` database, auth, and storage integration
- `scripts/seed.ts` migration script
