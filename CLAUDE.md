@AGENTS.md

# MyTech-Fix — Project Context

## What This Is

MyTech-Fix is an AI-powered tech support SaaS for home users and small businesses. Users describe tech problems (or upload screenshots), and the app provides step-by-step troubleshooting with AI-generated visual aids. Business tiers add team management, shared conversation history, a device inventory, and a network diagnostics tool.

Live product name: **MyTech-Fix** (`package.json` name: `mytech-fix`). Deployed to Vercel.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, React 19) — read `node_modules/next/dist/docs/` before writing Next.js code |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| UI components | shadcn/ui (Radix primitives) + `lucide-react` icons |
| Animation | `framer-motion` v12 |
| Auth + DB | **Supabase** (`@supabase/ssr` v0.10, `@supabase/supabase-js` v2) |
| AI — chat | **xAI Grok** (`grok-3-latest`) via `https://api.x.ai/v1/chat/completions` |
| AI — images | **OpenAI DALL-E 3** (preferred, `OPENAI_API_KEY`) with xAI image gen fallback (`XAI_API_KEY`/`GROK_API_KEY`) |
| Billing | **Stripe** v22 (subscriptions + one-time purchases + webhooks) |
| Toast | `sonner` |
| Theming | `next-themes` (dark default) |

---

## Project Structure

```
app/
  page.tsx              — Landing page (marketing, audience split: home vs business)
  layout.tsx            — Root layout: ThemeProvider > AuthProvider > MotionConfig > ConditionalFooter
  globals.css
  api/
    chat/route.ts       — Main AI chat endpoint (Grok, tier enforcement, image gen trigger)
    diagnostics/
      start/route.ts    — Reserves a diagnostic quota slot, returns run ID
      complete/route.ts — Saves raw results to user_diagnostics table
      analyze/route.ts  — Calls Grok to generate AI analysis for a saved run
    generate-image/route.ts
    stripe/
      checkout/route.ts — Creates Stripe checkout sessions
      portal/route.ts   — Customer portal (manage subscription)
      webhook/route.ts  — Stripe event handler (upgrades tiers, credits image packs)
    auth/               — Auth helpers
  chat/page.tsx         — Main chat interface (speech-to-text, image upload, diagnostic inject)
  dashboard/page.tsx    — User dashboard (usage meters, recent chats, diagnostic runner, WiFi scanner)
  diagnostics/page.tsx  — Diagnostic history archive (filter/sort/export CSV, re-run, AI analysis)
  history/page.tsx      — Chat session history
  inventory/page.tsx    — Business device inventory
  teams/page.tsx        — Team management (business tiers)
  teams/[id]/           — Individual team view
  account/page.tsx
  pricing/page.tsx
  upgrade/page.tsx
  invite/[token]/       — Team invite acceptance
  (auth, contact, how-it-works, what-we-fix, support, privacy, terms, signup)

components/
  AuthProvider.tsx      — Supabase session context
  Navbar.tsx
  DiagnosticResultsViewer.tsx  — Renders a saved diagnostic result + AI analysis
  WifiChannelVisualizer.tsx    — Interactive 2.4 GHz channel interference chart
  BusinessPromptPacks.tsx      — Prompt shortcuts for business users (in chat)
  BusinessOnboarding.tsx
  UsageMeter.tsx
  PlanBadge.tsx / PlanComparisonTable.tsx
  ThemeProvider/ThemeSync/ThemeToggle.tsx
  UserMenu.tsx
  ConditionalFooter.tsx
  ui/                   — shadcn primitives (button, card, dialog, input, label, sonner)

lib/
  tiers.ts              — *** SINGLE SOURCE OF TRUTH for all plan logic ***
  diagnostics.ts        — Client-side network tests + WiFi channel analyzer
  image-generation.ts   — OpenAI / xAI image gen abstraction
  stripe.ts             — Lazy Stripe client
  supabase.ts           — Browser client (createBrowserClient)
  supabase-server.ts    — Server client helper
  animations.ts         — Framer Motion variants (staggerContainer, fadeInUp, cardInteractive, messageIn)
  utils.ts              — cn() helper
  validate-env.ts       — assertServerEnv() — called in middleware to fail fast on missing vars

hooks/
  useChat.ts

middleware.ts           — Supabase session refresh + protected route redirects

supabase/
  migrations/           — SQL migration files (apply in Supabase SQL Editor)
  diagnostics/          — DB repair/rebuild scripts (complete_supabase_rebuild.sql etc.)
```

---

## Supabase Schema (key tables)

| Table | Purpose |
|-------|---------|
| `profiles` | One row per user. Columns: `id`, `email`, `tier`, `sessions_used`, `images_used`, `diagnostics_used`, `image_reset_date`, `diagnostic_reset_date`, `theme_preference`, `stripe_customer_id`, `full_name` |
| `user_tiers` | Parallel usage tracking (sync table). Same usage columns. Tier is kept in sync by Stripe webhook. `pickHighestTier()` resolves discrepancies. |
| `chat_sessions` | Chat sessions per user. Columns: `user_id`, `title`, `last_message`, `team_id?`, `device_id?`, `tags?` |
| `user_diagnostics` | Each network diagnostic run. `results` (JSONB), `overall_status`, `ai_analysis`, `run_type`, `tier_at_run` |
| `teams` | Business team workspaces. `owner_id` → auth.users |
| `team_members` | `team_id`, `user_id`, `role` (owner/admin/member/viewer) |
| `devices` | Business device inventory. `team_id`, `name`, `device_type`, `location`, `assigned_to`, `notes` |
| `free_trial_claims` | Tracks emails that used a free trial (one per email) |

All tables use RLS. `profiles` + `user_tiers` are written by the Stripe webhook (service role) and the session-authenticated API routes.

**New-user trigger**: `handle_new_user()` fires `AFTER INSERT ON auth.users` and seeds `profiles` (tier=`free_trial`, all usage=0) and `user_tiers`.

---

## Tier / Plan System (`lib/tiers.ts`)

Five tiers: `free_trial` → `single_use` → `home` → `business` → `business_plus`

`lib/tiers.ts` is the **only** place plan limits and labels are defined. Every other file imports from it.

Key exports:
- `TIERS` — full config object keyed by tier
- `getUserTierAndUsage(supabase, userId)` — resilient dual-read helper (profiles + user_tiers, picks highest). Use this in all server routes.
- `pickHighestTier(a, b)` — resolves two potentially-out-of-sync tier strings by rank
- `getLimit / getImageLimit / getDiagnosticLimit` — per-tier numeric limits
- `getPromptStyle` — `'concise' | 'detailed' | 'rich'` controls AI verbosity
- `isPaidPlan / shouldShowUpgrade` — conditional UI helpers
- `IMAGE_PACKS` — one-time Stripe image credit packs (20/50/100)

Business tiers (`business`, `business_plus`) have chat limit 9999 (treated as unlimited). Monthly tiers reset image/diagnostic counts on `image_reset_date` / `diagnostic_reset_date`.

---

## AI / Chat Architecture (`app/api/chat/route.ts`)

1. Authenticate user via Supabase session
2. Call `getUserTierAndUsage()` for tier + usage snapshot
3. Enforce chat session limit server-side (increment `sessions_used` on both `profiles` and `user_tiers`)
4. Build tier-aware system prompt via `getMyTechFixSystemPrompt(tier)` — includes personality, cybersecurity guardrails, visual token instructions, capability list, and live usage numbers
5. If `diagnosticContext` is passed (from `?diagnostic=ID` deeplink), inject formatted diagnostic report into system prompt via `formatDiagnosticReportForChat()`
6. Call **xAI Grok** (`grok-3-latest`) with full conversation history
7. If response contains `[GENERATE_VISUAL: <prompt>]` token, auto-trigger `generateImage()` and strip the token — enforces image quota separately
8. Return `{ reply, imageUrl? }`

**Image generation** (`lib/image-generation.ts`): Prefers DALL-E 3 (better text accuracy for diagrams), falls back to xAI `grok-imagine-image-quality`. Always appends a spelling/legibility booster to prompts.

---

## Diagnostics System

### Client side (`lib/diagnostics.ts`)
- `runFullDiagnostic(onProgress)` — runs 4 sequential tests (internet speed, WiFi quality, latency+packet loss, DNS) using Cloudflare speed test infrastructure. Returns `FullDiagnosticResults`.
- `analyzeWifiChannels(networks, userChannel)` — pure function for 2.4 GHz interference analysis. Used by the interactive WiFi Channel Scanner on the dashboard.
- `formatDiagnosticReportForChat()` — formats results for injection into the AI chat context.

### API flow
1. `POST /api/diagnostics/start` — checks quota, inserts a pending `user_diagnostics` row, returns `{ id }`
2. Client runs tests in browser (progress callbacks)
3. `POST /api/diagnostics/complete` — saves raw results + overall_status to the row
4. `POST /api/diagnostics/analyze` — calls Grok to produce `ai_analysis` text, persists to the row
5. User can then click "Discuss with MyTech-Fix" → navigates to `/chat?diagnostic=<id>`, which auto-injects the report into the AI context

### Dashboard (`app/dashboard/page.tsx`)
Full diagnostic runner + WiFi Channel Scanner UI with live progress, dialog-based viewer, and links to `/diagnostics` history page.

### Diagnostics archive (`app/diagnostics/page.tsx`)
Filter by status (Good/Fair/Poor), sort newest/oldest, search text, CSV export, delete, re-run, and on-demand AI analysis — all from one page.

---

## Billing / Stripe

- `POST /api/stripe/checkout` — creates a Stripe Checkout session with `userId` + `plan` in metadata
- `POST /api/stripe/portal` — creates a billing portal session
- `POST /api/stripe/webhook` — handles `checkout.session.completed`, `customer.subscription.*`, `invoice.paid`
  - On successful checkout: upserts `profiles.tier` + `user_tiers.tier` to the purchased plan; resets usage if upgrading
  - Image packs: decrements `images_used` by the pack size (credits)
  - Subscription cancellation/deletion: downgrades tier to `free_trial`

Stripe API version pinned to `2026-04-22.dahlia` in `lib/stripe.ts`.

---

## Authentication

- Supabase Auth (email/password + magic link)
- `middleware.ts` enforces session on all protected paths: `/chat`, `/dashboard`, `/history`, `/account`, `/diagnostics`, `/inventory`, `/teams`, `/upgrade`
- `AuthProvider` (`components/AuthProvider.tsx`) wraps the app and provides session context to client components
- Browser client: `supabaseBrowser` from `lib/supabase.ts` (singleton, safe for client components)
- Server client: `createSupabaseServerClient` from `lib/supabase-server.ts` (created per-request)

---

## Environment Variables

See `.env.example`. Required:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `GROK_API_KEY` — xAI key for chat (`grok-3-latest`)
- `XAI_API_KEY` — xAI key for image gen (can be same value as `GROK_API_KEY`)
- `OPENAI_API_KEY` — preferred for DALL-E 3 image gen
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_*` — one env var per Stripe Price ID
- `NEXT_PUBLIC_SITE_URL`

`assertServerEnv()` in `lib/validate-env.ts` runs in middleware and throws clearly on missing critical vars.

---

## Key Patterns & Conventions

- **Dual-write resilience**: Usage counts are written to both `profiles` and `user_tiers`. Reads always call `getUserTierAndUsage()` which picks the highest tier and max usage from both. This tolerates webhook delays or partial writes.
- **No mock data**: All data comes from Supabase. No fixtures or stubs in production paths.
- **Tier enforcement is server-side**: Client does fast pre-checks for UX, but the API routes are the authoritative enforcers.
- **`lib/tiers.ts` is sacred**: Never hardcode plan limits anywhere else. Add new tiers or change limits only there.
- **Image prompts always get the spelling booster** appended in `lib/image-generation.ts` — do not remove it; diagrams need legible text.
- **Diagnostics run in the browser**: All speed/latency tests use Cloudflare infrastructure (`speed.cloudflare.com`), not the Next.js server, for accurate real-internet measurements.
- **`'use client'`** is on almost every page component; server components are used only for layouts and API routes.
- Framer Motion variants live in `lib/animations.ts` — import from there rather than defining inline.

---

## Running Locally

```bash
npm run dev       # start dev server
npm run build     # production build
npm run typecheck # tsc --noEmit
npm run lint      # eslint
```

Copy `.env.example` → `.env.local` and fill in all keys before starting.

Database: apply migrations from `supabase/migrations/` in chronological order via the Supabase SQL Editor. For a fresh DB use `supabase/diagnostics/complete_supabase_rebuild.sql` first.
