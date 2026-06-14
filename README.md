# MyTech-Fix (smartfix-ai)

AI-powered tech support and troubleshooting for home users and small business teams. Features Grok/xAI chat (with vision + auto-generated diagrams), client-side diagnostics + AI analysis, tiered usage quotas, team device inventory, shared history, and Stripe billing.

**Note**: This is a custom Next.js 16 + React 19 app (see `AGENTS.md` / `Claude.md` for agent rules and breaking changes vs classic Next.js knowledge).

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill real keys (see below)
npm run dev
```

Open http://localhost:3000.

Useful scripts:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`   # <— run this (tsc --noEmit) after changes

After editing `.env.local`, fully restart the dev server.

## Environment Variables (required for full functionality)

Copy `.env.example` → `.env.local` (never commit `.env.local`).

Critical keys:
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY`
- `GROK_API_KEY` (or `XAI_API_KEY`) for chat text (Grok model)
- `XAI_API_KEY` (preferred) or `GROK_API_KEY` + optionally `OPENAI_API_KEY` for high-quality image/diagram generation (DALL·E 3 "hd" recommended for accurate spelling/labels in troubleshooting visuals)
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- All `STRIPE_PRICE_*` (see `.env.example` comments — map to Price IDs created in your Stripe dashboard)
- `NEXT_PUBLIC_SITE_URL` (for redirects)

Apply Supabase migrations from `supabase/migrations/` (and any repair SQLs in `supabase/diagnostics/`) via Supabase SQL editor as needed for schema (teams, devices, user_tiers columns, image/diag usage, etc.). See `restore-admin-tier.sql` for manual tier recovery after testing.

## Key Features & Flows
- Chat (with screenshot upload + AI image gen visuals via special token in responses)
- Dashboard (recent chats + run full diagnostics: speed, latency/packet loss, DNS, WiFi signal, channel scanner/interference)
- Business plans: teams, shared history, device inventory
- Tier enforcement is server-authoritative (chat, image gen, diagnostics quotas)
- Resilient dual tracking: `profiles` + `user_tiers` (see `lib/tiers.ts` + past fixes)

## Architecture Notes
- Centralized tiers + limits in `lib/tiers.ts` (reuse this).
- Server clients via `lib/supabase-server.ts`; browser via `lib/supabase.ts`.
- Animations via `framer-motion` + `lib/animations.ts` (already used in layout + several pages).
- Stripe checkout + webhook (image packs + plan upgrades/downgrades).
- Diagnostics run client tests (public endpoints) then persist + optional Grok analysis server-side.

See root `docs/` and the various `supabase/*.sql` for schema history and repairs.

## Deploy
Vercel is the easiest (set env vars + Supabase + Stripe in project settings). Re-run any pending SQL migrations after DB changes.

Contributions / feedback welcome (but heed the custom Next.js + agent rules in AGENTS.md).
