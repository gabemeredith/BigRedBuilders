# PRD.md — Big Red Rankings
**Tagline:** Who's more cracked?

---

## Product Summary
A playful web app where users compare Cornell students head-to-head and vote on who is more cracked. Funny, polished, competitive, and socially shareable. Each vote updates player ratings, the campus leaderboard, and matchup balancing. Light-hearted social game — not a serious ranking.

**Vision:** Students send it to friends, argue over rankings, screenshot the leaderboard, and keep coming back to vote.

**Why it exists:** Cornell students love comparing prestige and crackedness — but there's no clean, addictive product built around it. This fills that gap.

---

## Target Users
- **Primary:** Cornell undergrads (CS, ORIE, ECE, quant, startup, builder culture)
- **Secondary:** Friends of listed students, clubs, alumni browsing for fun

---

## Product Principles
1. **Fast** — voting takes almost no effort
2. **Addictive** — strong "one more round" loop
3. **Polished** — real and spreadable
4. **Shareable** — leaderboard is screenshot-worthy
5. **Light-hearted** — never feels malicious or defamatory
6. **Cornell-native** — built for Cornell students, not generic

---

## MVP Scope: 3 Pages
**Vote · Leaderboard · About**

---

## Feature Requirements

### Vote Page *(most important)*
- Two player cards: hidden on load → revealed on interaction → vote → next round
- Each card: profile photo, name, Cornell affiliation, rating, experience list, optional headline
- Experience list: company logo, role title, company name; optional "See More" expansion
- Vote options: Left wins / Right wins / Equal / Skip
- Keyboard shortcuts: `A` left, `L` right, `E` equal, `S` skip
- Reveal → vote transition must be smooth and snappy; no layout shifts

### Leaderboard Page
- Main table: rank, player, rating, optional record/streak/exposure
- Optional subsections: Rising, Most Voted, Controversial (keep MVP simple)
- Easy to scan, competitive feel, screenshot-worthy

### About Page
- What is this? / How voting works / How ratings work / How matchups are generated / How to join or be removed
- Clear "for fun" disclaimer + opt-out path
- Optional: FAQ, countdown timer, contact form

---

## Game Mechanics

### Ratings — ELO
- Starting rating: 1200–1300, configurable K-factor
- Wins increase rating; losses decrease; beating stronger opponents = bigger gains

### Matchup Generation
- Prefer similar ratings, balance exposure, add recency penalty for repeated appearances
- Avoid: same matchup repeatedly, hidden/inactive players, obvious repetitive junk
- Post-MVP modes: Friendly Fire, Battle of #1s, Builder Bowl, Intern War, Underdog Run

---

## Content Model

**Player:** name, Cornell descriptor, photo, headline, rating, wins/losses/ties, exposure count, active/hidden status

**Experience:** company name, logo, role title, sort order

**Optional future:** tags, LinkedIn/portfolio, bio, year/college/major

---

## Design Requirements
- Color palette: off-white/light-gray background, near-black text, Cornell red accent
- Vote page: two large side-by-side cards, clear action area, strong hierarchy and spacing
- Leaderboard: clean table/card, easy scan, screenshot-friendly
- About: short sections, clean hierarchy, not a wall of text

---

## Copy Style
Witty, internet-native, concise, self-aware. *"Who's more cracked?" / "Settle the Cornell hierarchy." / "Big Red bragging rights are on the line."*
**Avoid:** cruelty, defamatory language, claims of objective superiority.

---

## Safety / Ethics
- Visible "for fun" disclaimer + easy opt-out/removal path
- No harassment mechanics, no sensitive private data, no protected-trait ranking
- Prefer submitted/curated profile data; do not scrape private info

---

## Admin (MVP-lightweight)
Add/edit/hide/delete players, manage experiences, upload photos, set active status.

---

## Success Metrics
- Users understand it instantly and voting feels addictive
- Users send it to friends; leaderboard sparks discussion
- Stable vote submission, rating updates, and matchup generation with no obvious abuse

---

## Non-Goals for MVP
Comments, messaging, analytics dashboards, heavy admin tooling, full moderation, many leaderboard tabs.

---

## Recommended Build Order
1. App shell + routes → 2. Vote UI (static) → 3. Reveal interaction → 4. Seed data → 5. Vote submission + ratings → 6. Leaderboard → 7. About → 8. Anti-abuse → 9. Polish → 10. Launch

---

**Final standard:** Polished Cornell-built project — a little elite, a little absurd, very shareable. If students immediately drop it in group chats, it's working.
