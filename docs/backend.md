# Backend Data Shape

## Overview

Admin-reviewed submissions. Users fill out a form; profiles go live only after manual approval (`isActive: false`, `isHidden: true` until approved).

---

## Onboarding Form

~10 fields. Short and opinionated.

| Field | Maps to | Notes |
|---|---|---|
| Name | `player.name` | |
| Photo upload | `player.photo` | Store in Supabase Storage / S3, save URL |
| School | `player.school` | Dropdown — Ivy only |
| Major + Year | `player.descriptor` | e.g. "CS '26 · College of Engineering" |
| "Most cracked thing you've done?" | `player.headline` | One punchy line. Nudge: *include metrics if startup stuff* |
| Experience 1–3: Role title | `experience.roleTitle` | |
| Experience 1–3: Company name | `experience.companyName` | |
| Experience 1–3: Company website | `experience.companyDomain` | Optional — used to auto-fetch logo |

**Gating:** Require a `.edu` email from an Ivy domain to submit. Proves enrollment without any API.

---

## Company Logos

No manual logo upload needed. Given `companyDomain`, logos are fetched automatically:

- **Primary:** `https://logo.clearbit.com/{domain}` — clean, high-res
- **Fallback:** `https://www.google.com/s2/favicons?domain={domain}&sz=64`
- **Final fallback:** Building icon (already implemented in `ExperienceList.tsx`)

For companies with no domain (e.g. self-funded startup, open source), show the building icon.

Optionally: use Brandfetch or Clearbit's company search API to autocomplete domain from company name as the user types.

---

## ELO

- Starting rating: `1200` (set server-side on submission, never a form field)
- K-factor: `32` (hardcoded in `src/lib/elo.ts`)
- ELO updated server-side on every vote via `processVote()` — not client-side
- Stored as a column on the player record in the DB

---

## Player Schema

```ts
Player {
  id: string
  name: string
  school: IvySchool           // verified via .edu email domain
  descriptor: string          // "CS '26 · College of Engineering"
  photo: string               // CDN URL (Supabase Storage / S3)
  headline?: string           // "most cracked thing" free-text
  rating: number              // ELO — starts at 1200, server-managed
  wins: number
  losses: number
  ties: number
  exposureCount: number
  isActive: boolean           // false until admin approves
  isHidden: boolean           // true until admin approves
  tags?: string[]             // admin-assigned after review
}
```

## Experience Schema

```ts
Experience {
  id: string
  playerId: string
  companyName: string
  companyLogo?: string        // explicit URL if needed (usually not — use domain)
  companyDomain?: string      // drives auto logo fetch
  roleTitle: string
  sortOrder: number           // 0 = most prominent
}
```

---

## Admin Review Flow

1. User submits form → player record created with `isActive: false`, `isHidden: true`
2. Admin reviews submission
3. Admin approves → `isActive: true`, `isHidden: false`, tags assigned
4. Player enters the matchup pool at rating 1200

---

## Stack Recommendation

- **DB + Auth:** Supabase (Postgres + Storage for photos)
- **Logo fetching:** Clearbit (primary) + Google favicons (fallback), fetched at render time — no storage needed
- **School verification:** Supabase Auth with `.edu` email allowlist
