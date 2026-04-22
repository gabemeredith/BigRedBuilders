# TASKS.md — Big Red Rankings
Active implementation checklist. Build in phase order. Prioritize polish on core flows over breadth. Don't overengineer.

**Status:** `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked

---

## Phase 6 — Database (Backend)
- [ ] Set up Supabase project, add env vars
- [ ] Schema: `players`, `experiences`, `matches`, `votes` tables
- [ ] Migrate hardcoded `players.ts` data into Supabase
- [ ] Import friend's 60 Cornell builders dataset
- [ ] Replace static data imports with Supabase client fetches
- [ ] `/api/vote` route — persist votes, update ELO ratings, record match

## Phase 7 — Seed Data / Sourcing
- [ ] Use BigRedNetwork and personal contacts to find cracked SWE interns at Cornell
- [ ] Target 30–50 players with realistic experience rows, headlines, tags
- [ ] Tags: SWE · Quant · Startup · AI · Research · Systems · Product · Builder
- [ ] Build `/submit` form so builders can apply to be added
- [ ] Admin review flow: `isActive`/`isHidden` flags gate who goes live

## Phase 8 — Matchup Generation
- [ ] `getNextMatchup()` helper
- [ ] Basic: random active players, avoid repeats and hidden players
- [ ] Better: prefer similar ratings, exposure balancing, recency penalty

## Phase 9 — Vote Submission + Ratings
- [ ] ELO: expected score fn + update fn for win/loss/tie
- [ ] Update player ratings, wins/losses, exposure counts; record vote in DB

## Phase 10 — Polish
- [ ] Page transitions, card hover, reveal + post-vote transition polish
- [ ] Spacing, typography, button styling, loading states, card shadow/borders
- [ ] Hover affordances, "vote registered" feel, satisfying next-round flow

## Phase 11 — Anti-Abuse
- [ ] Session ID vote tracking, rate limiting, duplicate/rapid vote prevention
- [ ] Prevent malformed payloads + same-session matchup spamming

## Phase 12 — Pre-Launch QA
- [ ] Vote loop, leaderboard, about page all working end-to-end
- [ ] No broken layouts; mobile acceptable, desktop polished
- [ ] Disclaimer visible, removal path exists
- [ ] Deploy preview → set env vars → test production vote + leaderboard flows

## Phase 13 — Post-MVP Ideas
Player profile pages · shareable social cards · top-by-category filters · matchup history · featured weekly matchup · search/filters

---

## Build Order
Backend (6) → Seed/Sourcing (7) → Matchup gen (8) → Ratings (9) → Polish (10) → Anti-abuse (11) → QA (12)
