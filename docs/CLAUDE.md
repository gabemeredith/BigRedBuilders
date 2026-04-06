# CLAUDE.md — Big Red Rankings 
**Tagline:** Who's more cracked?

Use with `PRD.md` (product truth) and `TASKS.md` (execution order). This file defines behavior, taste, and guardrails.

---

## Project Summary
A polished, funny, shareable web app where users vote on who's more cracked at Cornell. Social game, not a serious ranking. Feel: Cornell-native, internet-native, slightly absurd, not mean-spirited.

---

## Product Vibe
Should feel like a polished student-built side project that people instantly drop in group chats.
- More playful than LinkedIn, calmer than a meme site, cleaner than most student projects.
- **Not:** a class project, hackathon MVP, or generic ranking dashboard.
- **Do not clone other sites** — preserve the social ranking mechanic, adapt to Cornell culture, improve the taste.

---

## Design Taste
- Minimal, clean, modern, premium — whitespace-heavy with crisp typography and subtle motion.
- Tasteful shadows, rounded cards, strong hierarchy.
- **Avoid:** clutter, cramped layouts, loud gradients, too many colors, cheap gamification.

**Framer Motion:** use sparingly — good for vote transitions, reveal state, hover, page transitions. Bad for random decorative spam.

---

## Priorities
1. **Vote page** — must feel excellent (highest polish surface in the app)
2. **Polish** — app should feel spreadable
3. **Simplicity** — instantly understandable
4. **Leaderboard** — dramatic, screenshot-worthy
5. **About page** — clear and safe

Always optimize the vote loop before lower-value features.

---

## Vote Page Quality Bar
- Addictive, snappy, premium, satisfying, obvious.
- Matchup: hidden → revealed → voted → fast transition to next.
- Buttons feel good, cards have strong hierarchy, no janky layout shifts, loading well-disguised.

---

## Leaderboard Quality Bar
- Competitive, social, screenshot-worthy, easy to scan.
- Not a boring dashboard or spreadsheet. Should feel like something people send friends.

---

## Copywriting
Witty, concise, internet-native, self-aware, playful. Examples: *"Who's more cracked?" / "Settle the Cornell hierarchy." / "Vote responsibly."*
**Avoid:** corporate copy, startup jargon, aggressive humor, AI-generic phrasing.

---

## Ethics / Safety
- Visible disclaimer: ranking is for fun only.
- Opt-out path for anyone in the rankings.
- No defamatory framing, no harassment mechanics, no ranking on protected traits, no private/sensitive data.
- Cheeky, not hostile.

---

## Data / Profiles
Focus on: name, Cornell affiliation, experience, role titles, optional headline + tags (SWE, Quant, Startup, AI, Research, Systems, Product, Builder).
**Avoid:** appearance, private personal info, anything creepy or invasive.

---

## Tech Stack
Next.js · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Supabase/Postgres · Vercel

Use `cn`/`clsx` for Tailwind. No heavy deps unless clearly worth it.

---

## Coding Style
- Clean, modular, readable, TypeScript-first.
- Small reusable components, simple props, descriptive names.
- **Avoid:** overengineering, excessive context providers, deeply nested trees, premature abstractions.

**Component naming:** `VoteArena`, `ProfileCard`, `ProfileHeader`, `ExperienceList`, `RevealState`, `VoteControls`, `PlayerLeaderboard`, `AboutSections`

---

## Backend Mindset
Practical, understandable, easy to debug. MVP: correctness and iteration speed > architectural perfection.
Prioritize: clean vote submission, stable rating updates, reasonable matchup gen, abuse prevention.
**Avoid:** overcomplicated matchmaking, event systems, premature optimization.

---

## MVP Discipline
Flag flashy non-essential asks as post-MVP. Ship before overbuilding.
- One polished vote loop > ten half-baked features.
- One polished leaderboard > multiple unfinished tabs.
- Clean seed data > complex admin systems early.

---

## Behavior Standard
Act like a technical cofounder with taste. Propose clean next steps, suggest concrete file changes, avoid vague advice.

Before any large change: Does this improve the vote loop? Does it make the app feel more premium? Is it worth the complexity? If not, simplify.

**Final goal:** A Cornell student sees it once and immediately sends it to 5 friends.
