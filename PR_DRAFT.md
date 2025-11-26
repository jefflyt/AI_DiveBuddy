# feat(1.1): Next.js setup + shadcn UI + landing page

Summary:

This PR implements the initial Next.js scaffold (App Router + TypeScript + Tailwind), installs and verifies shadcn/ui components, adds a landing page and mock chat API, and includes developer convenience files and plans.

## What changed

- Added `divebuddy-app/` Next.js app (TypeScript, Tailwind, App Router)
- Installed shadcn/ui components and utilities (`src/components/ui/*`, `src/lib/utils.ts`)
- Implemented landing page and header (`src/app/page.tsx`, `src/app/layout.tsx`, `src/components/ui/Header.tsx`)
- Added mock chat API route at `src/app/api/chat/route.ts` and interactive `ChatPlaceholder` client component
- Added `run.sh` helper and `.env.example`
- Plans updated: `plans/dovvybuddy/1-nextjs-setup/*` (steps 1.1–1.4) and preview snapshots

## Verification

- `npm --prefix divebuddy-app run build` completed successfully (SSG + static pages generated)
- Dev server starts locally and pages `/` and `/chat` load
- ESLint warnings cleared for unused catch bindings

## Notes / Next steps

- Wire Supabase and LLM provider keys (do not commit secrets)
- Implement destination browser, Supabase schema and RAG ingestion (planned in steps 2.x)

## How to test locally

```bash
npm --prefix divebuddy-app install
npm --prefix divebuddy-app run dev -- -p 3001
# open http://localhost:3001
```

Please review and let me know if you'd like me to split the work into smaller PRs.
