# Build: Rank The Rivalry — Ivy League CS Majors

Clone of ranktherivalry.com adapted for the Ivy League (Brown, Columbia, Cornell, Dartmouth, Harvard, Penn, Princeton, Yale). Two main pages: **Vote** and **Leaderboard**, plus an **About** page.

## Stack
- **Vite + React + TypeScript** with **React Router** (hash routing, matches original `/#/vote`)
- **Tailwind CSS** for styling
- **Firebase** (Firestore) for player data + ELO votes — or stub with a `players.json` + localStorage for v1. Start with the stub; make the data layer swappable.
- **Lucide-react** for icons

## Design tokens

```
Colors
  --bg:            #f3f4f6  (page background, cool gray)
  --card:          #ffffff
  --border:        #e5e7eb
  --text:          #111827
  --text-muted:    #6b7280
  --accent:        #8b1a1a  (crimson — Ivy feel; used for nav underline, links)
  --accent-hover:  #a52828
  --gold:          #c9a227  (1st place ring)
  --silver:        #9ca3af  (2nd place ring)
  --bronze:        #a0522d  (3rd place ring)
  --header-bg:     linear-gradient(90deg, #0a0a0a 0%, #1a1a2e 40%, #8b1a1a 100%)
                   (dark-to-crimson, mirrors the original's dark-to-blue)

Typography
  Font: Inter (or system-ui fallback)
  Logo / H1: font-black, tracking-tight, uppercase
  Body: font-normal, text-sm to text-base

Spacing / layout
  Max content width: 1200px, centered
  Card radius: 12px
  Card shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)
  Card padding: 24px
```

## Layout — global

**Header** (sticky, full-width, ~64px tall, gradient bg, white text):
- Left: `RANK THE IVY` — bold uppercase logo, clicks to `/#/vote`
- Right: `VOTE` · `LEADERBOARD ▾` · `ABOUT` — uppercase, letter-spaced, crimson underline on active
- Leaderboard dropdown: `Overall`, then each Ivy school (Brown, Columbia, Cornell, Dartmouth, Harvard, Penn, Princeton, Yale)

**Footer-ish line** under main content on Vote page: `Please DM [Your Name] to be added or removed from the game.` — muted gray, name is a crimson link.

---

## Page 1 — `/vote`

**Heading block** (centered):
- H1: `Rank CS Majors in the` + inline Ivy League wordmark (SVG — stylized "IVY" in crimson, similar weight to the B1G logo in the reference)
- Subhead: `Who's more cracked?` — small, muted

**Matchup area** — two player cards side by side with an `Equal` pill centered between them:

Each **player card** (white, rounded-xl, border, hover lifts with `shadow-md` + `cursor-pointer`):
- Circular avatar (140px) at top, centered
- Name below avatar, bold
- School tag under name in crimson (e.g. `HARVARD`)
- Divider
- `Experience` section header (bold, small)
- List of up to 3 experiences, each row:
  - 40x40 rounded company logo on left
  - Role title (bold) + company name (muted) stacked on right
- `See More ⌄` pill button at bottom (full width, bordered, hover fills light gray) — expands to show full experience list

**Vote interaction**: clicking a card = vote for that player. The `Equal` pill in the middle = tie vote. After vote, fade out + load next matchup. ELO-style rating update on the backend.

**Below the matchup**: the DM-to-be-added line.

---

## Page 2 — `/leaderboard/overall` (and per-school variants)

**Heading**:
- H1: `TOP 100` — font-black, uppercase, tracking-tight
- Subhead: `Overall rankings across all Ivy League schools` (or `Rankings for [School]`)

**Podium** (top 3, centered, visually staggered):
- #1 in the middle, larger avatar (120px), **gold** ring, raised highest
- #2 on the left, 90px avatar, silver ring, middle height
- #3 on the right, 90px avatar, bronze ring, lowest
- Each has a small numbered badge on the avatar's bottom edge (gold/silver/bronze circle with white number)
- Card below each with: Name (bold), ELO rating (muted), School (crimson, uppercase, small)
- #1's card has a subtle gold tinted background; #2 silver-tinted; #3 bronze-tinted — all very light

**Search bar**: full-width rounded input with magnifying-glass icon, placeholder `Search for a player…`

**Ranked list** (rows 4+, each row is a bordered card with rounded corners, tap to expand or view profile):
- Left: rank number (gray, 20px, bold)
- Avatar (48px circle)
- Name (bold) + School (crimson, uppercase, small) stacked
- Right side: optional 🔥 streak pill (light orange bg, flame icon, number) + ELO rating (bold) + chevron right

Infinite scroll or paginate to 100.

---

## Page 3 — `/about`

Simple centered prose card: what the site is, how ELO works, credits, how to get added (DM link).

---

## Data shape

```ts
type Player = {
  id: string;
  name: string;
  school: 'BROWN'|'COLUMBIA'|'CORNELL'|'DARTMOUTH'|'HARVARD'|'PENN'|'PRINCETON'|'YALE';
  avatarUrl: string;
  elo: number;          // start at 1500
  wins: number;
  losses: number;
  ties: number;
  streak: number;       // consecutive wins
  experiences: {
    role: string;
    company: string;
    logoUrl: string;
  }[];
};

type Vote = {
  winnerId: string | null;  // null = tie
  loserId: string | null;
  timestamp: number;
};
```

**ELO**: K=32, standard formula. Ties give each player 0.5.

**Matchup selection**: prefer players within ±100 ELO of each other; random pick weighted toward closer ratings.

---

## File structure

```
src/
  main.tsx
  App.tsx                    # router
  components/
    Header.tsx
    PlayerCard.tsx           # used on Vote page
    PodiumCard.tsx           # top-3 display
    RankRow.tsx              # list row on leaderboard
    SchoolTag.tsx            # crimson uppercase school label
    IvyWordmark.tsx          # inline SVG
  pages/
    Vote.tsx
    Leaderboard.tsx
    About.tsx
  lib/
    elo.ts                   # rating math + matchup picker
    data.ts                  # data layer (swap stub ↔ firestore)
  data/
    players.json             # seed data (8-16 stub players to start)
  index.css                  # tailwind + CSS vars
```

## Build steps for Claude Code

1. `npm create vite@latest rank-the-ivy -- --template react-ts` then install: `react-router-dom`, `tailwindcss`, `lucide-react`, `clsx`
2. Set up Tailwind, drop the color vars into `index.css` under `@layer base`
3. Build `Header.tsx` with hash-router `NavLink`s and crimson underline on active
4. Create seed `players.json` with 8 placeholder Ivy players (use dicebear or ui-avatars for avatars: `https://api.dicebear.com/7.x/avataaars/svg?seed=NAME`)
5. Build `lib/elo.ts` (update function + `getNextMatchup(players)`)
6. Build `Vote.tsx` — two `PlayerCard`s + center Equal pill, wire click handlers to ELO update + advance
7. Build `Leaderboard.tsx` — sort players by ELO desc, render `PodiumCard` for top 3 + search-filterable list of `RankRow`s
8. Build `About.tsx` — static content
9. Persist ELO to `localStorage` keyed by `rank-the-ivy:players` so votes survive reloads
10. Deploy target: Vercel or Netlify, SPA fallback to `index.html`

## Visual fidelity notes
- The reference has a lot of whitespace — don't crowd cards
- Hover states are subtle: `hover:shadow-md transition-shadow`
- Avatar placeholders while loading = light gray filled circle, no spinner
- Everything uppercase-labeled should use `tracking-wide` or `tracking-wider`
- Mobile: stack the two player cards vertically, `Equal` pill becomes a full-width button between them

---

## Notes on inference
The exact header gradient and podium tinted-background treatment were inferred from screenshots, not the live site (which blocks scraping). For pixel-exact values, grab hex codes off the live site in DevTools and swap them into the tokens block. The "IVY" wordmark SVG will need to be commissioned or placeholdered — a serif-ish bold treatment would contrast nicely against the original's blocky B1G.