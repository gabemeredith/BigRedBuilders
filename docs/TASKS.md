# TASKS.md — Big Red Rankings
Active implementation checklist. Build in phase order. Prioritize polish on core flows over breadth. Don't overengineer.

**Status:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

---

## Phase 0 — Project Setup
- [ ] Init Next.js + TypeScript + Tailwind, App Router
- [ ] Install deps: `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`, `shadcn/ui`
- [ ] Global font/typography + site metadata (title, description, favicon)
- [ ] Folder structure: `/app/(site)/vote`, `/leaderboard`, `/about` · `/components` · `/lib` · `/data` · `/types`

## Phase 1 — App Shell
- [ ] `Navbar` with Vote / Leaderboard / About links + active state
- [ ] Site-wide centered layout container, consistent spacing, global bg/text styles
- [ ] Logo/wordmark placeholder + heading style system

## Phase 2 — Vote Page UI (static)
- [ ] `VoteArena` layout with "Rank Cornell students" heading and "Who's more cracked?" subheading
- [ ] `ProfileCard`, `ProfileHeader`, `ExperienceList`, `VoteControls`, `RevealState` components
- [ ] Two-card arena: left + right cards, center action area, responsive spacing
- [ ] Mock player + experience dataset; render realistic seeded matchup

## Phase 3 — Hidden / Reveal Interaction
- [ ] Hidden state: skeleton avatar, name bar, experience rows
- [ ] "Reveal Matchup" button — cards start hidden, click reveals actual info
- [ ] Reveal animation: fade/blur/scale, smooth and quick, no layout shifts
- [ ] Voting disabled before reveal; activates after

## Phase 4 — Vote Interaction (frontend)
- [ ] Vote buttons: Left / Right / Equal / Skip
- [ ] Keyboard shortcuts: `A` left · `L` right · `E` equal · `S` skip
- [ ] Hover, pressed, disabled, and loading states
- [ ] After vote: animate into next matchup (hidden state again), keep loop fast

## Phase 5 — Types
- [ ] `Player`, `Experience`, `Match`, `Vote` types
- [ ] Cornell-specific display metadata + tag categories

## Phase 6 — Database
- [!] Choose: Supabase / Postgres+Prisma / local JSON prototype
- [ ] Tables: `players`, `experiences`, `matches`, `votes`
- [ ] Player fields: `rating`, `wins`, `losses`, `ties`, `exposure_count`, `is_active`, `is_hidden`

## Phase 7 — Seed Data
- [ ] 30–50 players with realistic experience rows, photos/placeholders, headlines, tags
- [ ] Tags: SWE · Quant · Startup · AI · Research · Systems · Product · Builder
- [ ] Profiles should feel believable and visually varied

## Phase 8 — Matchup Generation
- [ ] `getNextMatchup()` helper
- [ ] Basic: random active players, avoid repeats and hidden players
- [ ] Better: prefer similar ratings, exposure balancing, recency penalty
- [ ] Post-MVP: matchup modes (`normal`, `battle_of_1s`, `friendly_fire`, `underdog_run`, `builder_bowl`, `intern_war`)

## Phase 9 — Vote Submission + Ratings
- [ ] API endpoint / server action: validate payload, ensure match exists, prevent self-matches
- [ ] ELO: expected score fn + update fn for win/loss/tie
- [ ] Update player ratings, wins/losses, exposure counts; record vote in DB

## Phase 10 — Leaderboard Page
- [ ] Leaderboard table/cards: rank, name, rating, optional record/streak/tags
- [ ] Optional sections: Rising, Most Voted, Controversial
- [ ] Easy to scan, screenshot-worthy, subtle Cornell identity

## Phase 11 — About Page
- [ ] Sections: What is this? / How voting works / How ratings work / How matchups work / Join or be removed
- [ ] Clear "for fun" disclaimer + opt-out language
- [ ] Optional: countdown timer, FAQ, contact CTA

## Phase 12 — Polish
- [ ] Page transitions, card hover, reveal + post-vote transition polish
- [ ] Spacing, typography, button styling, loading states, card shadow/borders
- [ ] Hover affordances, "vote registered" feel, satisfying next-round flow

## Phase 13 — Anti-Abuse
- [ ] Session ID vote tracking, rate limiting, duplicate/rapid vote prevention
- [ ] Prevent malformed payloads + same-session matchup spamming
- [ ] Optional: Cloudflare Turnstile, hashed IP guardrails

## Phase 14 — Admin
- [ ] Add/edit/hide/delete players, manage experiences, upload profile images
- [ ] Optional: recompute ratings, force featured matchups, CSV import

## Phase 15 — Pre-Launch QA
- [ ] Vote loop, reveal state, leaderboard data, about page all working
- [ ] No broken layouts; mobile acceptable, desktop polished
- [ ] Disclaimer visible, removal path exists, no unsafe content
- [ ] Deploy preview → set env vars → test production vote + leaderboard flows

## Phase 16 — Post-MVP Ideas
Player profile pages · shareable social cards · top-by-category filters · daily streaks · matchup history · featured weekly matchup · search/filters · theme toggle

---

## Build Order (non-linear — follow this, not phase numbers)
0 → 1 → 2 → 3 → 4 → 5 → **7** (seed data) → **10** (leaderboard UI) → **11** (about) → **6/8/9** (backend) → 13 → 14
*Frontend-first: build and polish UI before wiring persistence.*

## Execution Rule
When asked what to build next: find the earliest incomplete task in the build order above → implement cleanly → mark done → don't jump ahead unless blocked. **Vote page polish above all else.**
