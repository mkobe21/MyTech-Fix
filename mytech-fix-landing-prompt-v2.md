# Claude Code Prompt — MyTech-Fix Landing Page Rebuild

## Context

I'm rebuilding the marketing landing page for **MyTech-Fix** — an AI-powered tech troubleshooting SaaS for home users and small businesses.

**Already built:** Screenshot analysis, AI image generation for troubleshooting, device memory, chat history, team management, business login, report generation, network diagnostics dashboard (speed test, ping, latency), AI analysis of diagnostic results, and auto-inject of diagnostic results into chat context.

**Current stack:** Next.js + Tailwind CSS + Supabase. No stack changes.

I have a reference HTML file at: `[PASTE PATH TO mytech-fix-landing.html HERE]`

The reference is a single-file HTML mockup. Your job is to convert it into clean, production-ready Next.js components that drop into the existing project. Match the design exactly.

---

## Task Summary

Build out the homepage and supporting marketing components to match the reference design. Highlight the **auto-injecting diagnostics engine** as the central differentiator — that's now a real, shipped feature and the marketing should reflect it.

---

## Design Tokens

Extract from reference and apply via Tailwind config:

```
--navy:    #0A0F1E   (page background)
--card:    #111827   (card backgrounds)
--card2:   #1E293B   (secondary card / input backgrounds)
--blue:    #3B82F6   (primary action color)
--blue-lt: #60A5FA   (light blue for headings/accents)
--slate:   #94A3B8   (secondary text)
--white:   #F8FAFC   (primary text)
--green:   #10B981   (success / checkmarks / live indicators)
--border:  rgba(255,255,255,0.07)
```

Fonts: **Sora** (display/headings, 600–800) + **Inter** (body, 400–600). Load via `next/font/google`.

---

## Updated Hero Copy (Important — Uses Auto-Diagnostic Feature)

The reference HTML used generic copy. Update the hero to emphasize the diagnostic engine:

**Eyebrow:** `🟢  AI + Live Network Diagnostics`

**H1:** `Fix tech problems faster — with AI that actually knows what's wrong`

**Subheading:**
`MyTech-Fix runs real network diagnostics in the background — speed, ping, latency — and feeds them into your AI conversation automatically. No more guessing. No more "have you tried turning it off and on?"`

**Primary CTA:** `Start Free — 5 Chats ↗`
**Secondary CTA:** `See how diagnostics work →`

**Trust row items:**
- No credit card required
- Real diagnostics, not just chat
- Works on any device

---

## Component Breakdown

Build under `components/marketing/`:

### 1. `NavBar.tsx`
- Sticky, `backdrop-blur`, semi-transparent dark
- Logo: "🔧 MyTech**Fix**" — "Fix" in blue
- Links: How it Works · What We Fix · Pricing · "Start Free" CTA button
- Hide nav links below 900px (hamburger optional for v1)

### 2. `HeroSection.tsx`
- Two-column grid: copy on left, animated chat demo on right
- Pulsing green dot in eyebrow badge
- H1 with "actually knows" emphasized in `--blue-lt`
- Stack to single column below 900px

### 3. `ChatDemo.tsx`  ⭐ **Signature element**

Auto-cycling animated chat that shows the diagnostic engine in action. **Critical** — this is what makes the page sell itself.

**Three conversations to cycle through (now showing diagnostic context):**

**Conversation 1 — Slow WiFi with auto-injected diagnostics:**
- Show a small chip at the top of the AI response: `📊 Diagnostics auto-loaded`
- User: "My WiFi has been crawling all morning."
- AI: "I can see your latency is 340ms and download is 12 Mbps — way below your 200 Mbps plan. You're on the 2.4GHz band which is the problem. Here's the fix:"
- Steps: (1) Open router admin at 192.168.1.1 (2) Switch your devices to the 5GHz band (3) Change WiFi channel from Auto to 6 or 11 — clears congestion

**Conversation 2 — Printer offline:**
- User: "My printer says offline but it's on."
- AI: "Classic Windows print spooler issue — happens after sleep mode. Quick fix:"
- Steps: (1) Press Win+R, type services.msc (2) Find 'Print Spooler' → right-click → Restart (3) Right-click printer in Settings → Set as Default

**Conversation 3 — Smart home conflict:**
- User: "My Nest thermostat stopped showing up in Google Home."
- AI: "This is usually a broken account link after a Google update. Two-minute fix:"
- Steps: (1) Open Google Home → tap + → Set up device → Works with Google (2) Search Nest → re-link your account (3) Remove and re-add the thermostat if it doesn't appear

**Animation sequence per conversation:**
1. Clear chat
2. Type user message into input bar character-by-character (~40ms per char)
3. Clear input → show user bubble with fadeUp
4. 600ms pause → show typing indicator (3 bouncing dots)
5. **For Conversation 1 only**: after typing indicator, show "📊 Diagnostics auto-loaded" chip with fadeUp
6. 1600ms → remove typing → show AI bubble
7. Add steps one at a time, 700ms between each
8. 4000ms pause → next conversation

**Chat UI elements:**
- macOS-style traffic light dots in header
- "MyTech-Fix AI" title + "Online" with pulsing green dot
- Read-only input bar at bottom with send button
- `overflow: hidden`, auto-scroll to bottom on new message
- Use Framer Motion for all entry animations

### 4. `ProofBar.tsx`
Full-width border-top/bottom bar. Four stats:
- `2,400+` · Issues resolved
- `4.9★` · Average rating
- `<3 min` · Avg. time to fix
- `$0` · To get started

Vertical dividers between stats, hide on mobile. Sora bold for numbers, slate for labels.

### 5. `HowItWorks.tsx`
Three steps with horizontal connector line between numbered circles.

**Step 1 — Describe the problem**
Type, paste, or upload a photo. Plain English works.

**Step 2 — We diagnose automatically**
MyTech-Fix runs real network tests and feeds the results into the AI — so you get a real diagnosis, not a guess.

**Step 3 — Get clear, guided steps**
Step-by-step instructions tailored to your exact setup. Mark each as done and move on.

Circles: 56px, blue tinted border, navy fill (sits above connector via z-index). Stack on mobile, hide connector.

### 6. `WhatWeFix.tsx`
Auto-fill grid `repeat(auto-fill, minmax(200px, 1fr))`. Eight categories:
- 📶 WiFi & Networking
- 🖨️ Printers
- 💡 Smart Home
- 💻 Computers
- 📷 Security Cameras
- 📱 Phone & Tablet
- 🔐 Suspicious Activity
- 🛜 VPN & Remote Work

Hover: blue border tint + subtle blue background.

### 7. `DiagnosticsHighlight.tsx`  ⭐ **NEW SECTION**

This is a new section that didn't exist in the reference HTML. Add it between WhatWeFix and AudienceSection to showcase the unique diagnostic engine.

Two-column layout:
- **Left:** Mocked-up diagnostic dashboard UI (static visual) showing speed test gauge, ping graph, latency reading
- **Right:**
  - Eyebrow: `WHY MYTECH-FIX IS DIFFERENT`
  - H2: `Real diagnostics, not just chat`
  - Body: `Most AI tools guess based on what you describe. MyTech-Fix runs real network tests in the background — and our AI uses that actual data to give you specific, accurate fixes. No more "have you tried restarting?" when the issue is your DNS.`
  - Three small feature bullets with icons:
    - ⚡ `Live speed, ping, and latency tests`
    - 🧠 `Results auto-flow into AI conversations`
    - 🔍 `Pinpoints root cause, not symptoms`
  - CTA: `Try it free →`

Stack to single column below 900px.

### 8. `AudienceSection.tsx`
Two cards side by side: Home & Family + Small Business.

Home (green badge): instant help, photo upload, mobile-friendly, pay per use
Business (blue badge): team shared history, device inventory, ROI reports, productivity tools

### 9. `PricingSection.tsx`
Three cards:
- **Pay As You Go** — $9.99 · 10 sessions included (clarified copy)
- **Home Plan** — $14.99/mo · featured with "Most Popular" badge
- **Business** — $29.99/mo · up to 5 members

All features use green checkmarks. Featured card gets blue border + subtle blue gradient.

**Pricing config: put all plan data in a `PLANS` const array at top of file** — make it easy to update.

### 10. `Testimonials.tsx`
Three placeholder testimonials in a row. Data driven by `TESTIMONIALS` const array.

### 11. `FinalCTA.tsx`
Centered, max 700px. Same headline pattern + two CTAs as hero.

### 12. `Footer.tsx`
Simple: logo · Privacy · Terms · Support · Contact · copyright.

---

## Routing & Links

All internal navigation uses Next.js `<Link>`:
- `/chat` — Start troubleshooting (primary CTA target)
- `/pricing` — Pricing page (also `#pricing` anchor on homepage)
- `#how-it-works`, `#what-we-fix`, `#diagnostics` — section anchors
- `/privacy`, `/terms`, `/support`, `/contact` — placeholder paths

---

## Animations (Framer Motion)

```bash
npm install framer-motion
```

Use for:
- Chat bubble `fadeUp` — `{ opacity: 0, y: 8 }` → `{ opacity: 1, y: 0 }`, 0.4s
- Pulsing dot — scale 1 → 1.4 → 1, opacity 1 → 0.5 → 1, 2s infinite
- Typing indicator — three dots staggered 0.2s
- Diagnostics chip entry — fadeIn + slight scale, 0.5s
- Section reveal on scroll (`whileInView`) — subtle fade + slight y movement

---

## Responsive Breakpoints

- `< 900px`: hero stacks, audience cards stack, pricing stacks, diagnostics section stacks
- `< 600px`: hide proof bar dividers, hide nav links

---

## Quality Checks

Before finishing, verify:
- [ ] Fonts load via `next/font/google` (no layout shift)
- [ ] Chat demo cleans up timers on unmount (no memory leaks)
- [ ] All internal links use `<Link>`
- [ ] Page responsive at 375px, 768px, 1280px
- [ ] All colors come from the design tokens — none hardcoded
- [ ] Tailwind config extended with custom color names
- [ ] `"use client"` at top of components using state/browser APIs (ChatDemo, anything with motion)
- [ ] DiagnosticsHighlight section accurately reflects the real shipped feature
- [ ] Hero copy matches the updated version above (not the original reference)

---

## File Structure Target

```
app/
  page.tsx                       ← assembles all sections
components/
  marketing/
    NavBar.tsx
    HeroSection.tsx
    ChatDemo.tsx
    ProofBar.tsx
    HowItWorks.tsx
    WhatWeFix.tsx
    DiagnosticsHighlight.tsx     ← NEW
    AudienceSection.tsx
    PricingSection.tsx
    Testimonials.tsx
    FinalCTA.tsx
    Footer.tsx
```

---

## Implementation Notes

- Dark mode is the default; no light/dark toggle needed for v1
- Testimonials and pricing plans must be driven by `const` arrays at the top of their files — easy to update
- Chat demo `CONVERSATIONS` array also lives at top of `ChatDemo.tsx`
- Don't add analytics, cookie banners, or third-party scripts in this pass
- The DiagnosticsHighlight section is the most important new addition — give it real visual weight; this is the unique differentiator
- Use existing project conventions (file naming, import paths, etc.) — read 2-3 existing components first to match style

---

## Once Complete

After implementation, do these final steps:
1. Run `npm run build` to confirm no errors
2. Visually QA each section at 375px, 768px, 1280px widths
3. Confirm chat demo cycles through all three conversations without hanging
4. Confirm DiagnosticsHighlight section displays correctly and tells the differentiation story clearly
