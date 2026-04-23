/**
 * Seed script — loads the static players.ts data into Supabase.
 * Run with: npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const players = [
  { name: "Marcus Chen", school: "Harvard", descriptor: "CS '26 · John A. Paulson SEAS", photo: "/avatars/marcus.jpg", headline: "Built a compiler in Rust for fun", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["SWE", "AI"] },
  { name: "Priya Patel", school: "Princeton", descriptor: "ORFE '25 · School of Engineering", photo: "/avatars/priya.jpg", headline: "Jane Street intern, competitive math", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["Quant", "Research"] },
  { name: "Jake Morrison", school: "Yale", descriptor: "CS '27 · Yale School of Engineering", photo: "/avatars/jake.jpg", headline: "Dropped out, raised $2M, came back", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["Startup", "SWE"] },
  { name: "Sophia Kim", school: "Columbia", descriptor: "ECE '26 · Fu Foundation SEAS", photo: "/avatars/sophia.jpg", headline: "Published 3 NeurIPS papers as undergrad", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["AI", "Research"] },
  { name: "David Okafor", school: "Brown", descriptor: "CS '25 · School of Engineering", photo: "/avatars/david.jpg", headline: "Open source maintainer, 5k+ GitHub stars", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["SWE"] },
  { name: "Emily Zhang", school: "Cornell", descriptor: "Math '26 · College of Arts & Sciences", photo: "/avatars/emily.jpg", headline: "Putnam Fellow, IMO gold medalist", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["Quant", "Research"] },
  { name: "Ryan Torres", school: "Penn", descriptor: "CS '27 · School of Engineering & Applied Science", photo: "/avatars/ryan.jpg", headline: "YC W25, building AI dev tools", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["Startup", "AI"] },
  { name: "Aisha Rahman", school: "Dartmouth", descriptor: "CS '26 · Thayer School of Engineering", photo: "/avatars/aisha.jpg", headline: "Google STEP → Meta → now doing research", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["SWE", "Research"] },
  { name: "Leo Nakamura", school: "Princeton", descriptor: "Applied Physics '25 · School of Engineering", photo: "/avatars/leo.jpg", headline: "Quantum computing research at IBM", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["Research"] },
  { name: "Chloe Bennett", school: "Yale", descriptor: "CS + Economics '27 · Yale College", photo: "/avatars/chloe.jpg", headline: "Sold first startup at 19, CS + Business", rating: 1200, wins: 0, losses: 0, ties: 0, exposure_count: 0, is_active: true, is_hidden: false, tags: ["Startup", "SWE"] },
];

const experiencesByPlayerName: Record<string, { company_name: string; company_domain?: string; role_title: string; sort_order: number }[]> = {
  "Marcus Chen": [
    { company_name: "Apple", company_domain: "apple.com", role_title: "SWE Intern", sort_order: 0 },
    { company_name: "Harvard CS", company_domain: "seas.harvard.edu", role_title: "Research Assistant", sort_order: 1 },
  ],
  "Priya Patel": [
    { company_name: "Jane Street", company_domain: "janestreet.com", role_title: "Quant Intern", sort_order: 0 },
    { company_name: "Princeton ORFE", company_domain: "princeton.edu", role_title: "Teaching Assistant", sort_order: 1 },
  ],
  "Jake Morrison": [
    { company_name: "Self-funded Startup", role_title: "Co-founder & CEO", sort_order: 0 },
    { company_name: "Andreessen Horowitz", company_domain: "a16z.com", role_title: "a16z Scout", sort_order: 1 },
  ],
  "Sophia Kim": [
    { company_name: "Google DeepMind", company_domain: "deepmind.google", role_title: "Research Intern", sort_order: 0 },
    { company_name: "Columbia AI Lab", company_domain: "columbia.edu", role_title: "Research Assistant", sort_order: 1 },
  ],
  "David Okafor": [
    { company_name: "Cloudflare", company_domain: "cloudflare.com", role_title: "SWE Intern", sort_order: 0 },
    { company_name: "Open Source", role_title: "Maintainer", sort_order: 1 },
  ],
  "Emily Zhang": [
    { company_name: "Two Sigma", company_domain: "twosigma.com", role_title: "Quant Research Intern", sort_order: 0 },
    { company_name: "Cornell Math", company_domain: "math.cornell.edu", role_title: "Putnam Team Captain", sort_order: 1 },
  ],
  "Ryan Torres": [
    { company_name: "YC W25 Startup", company_domain: "ycombinator.com", role_title: "Co-founder & CTO", sort_order: 0 },
    { company_name: "Microsoft", company_domain: "microsoft.com", role_title: "SWE Intern", sort_order: 1 },
  ],
  "Aisha Rahman": [
    { company_name: "Meta", company_domain: "meta.com", role_title: "SWE Intern", sort_order: 0 },
    { company_name: "Google", company_domain: "google.com", role_title: "STEP Intern", sort_order: 1 },
  ],
  "Leo Nakamura": [
    { company_name: "IBM Research", company_domain: "ibm.com", role_title: "Quantum Computing Intern", sort_order: 0 },
    { company_name: "Princeton Physics", company_domain: "princeton.edu", role_title: "Lab Researcher", sort_order: 1 },
  ],
  "Chloe Bennett": [
    { company_name: "Acquired Startup", role_title: "Founder", sort_order: 0 },
    { company_name: "Sequoia Capital", company_domain: "sequoiacap.com", role_title: "Scout", sort_order: 1 },
  ],
};

async function seed() {
  console.log("Seeding players…");

  const { data: inserted, error } = await supabase
    .from("players")
    .insert(players)
    .select("id, name");

  if (error) {
    console.error("Players insert failed:", error.message);
    process.exit(1);
  }

  console.log(`Inserted ${inserted?.length} players.`);

  const experiences = inserted!.flatMap((p) => {
    const exps = experiencesByPlayerName[p.name] ?? [];
    return exps.map((e) => ({ ...e, player_id: p.id }));
  });

  const { error: expError } = await supabase.from("experiences").insert(experiences);

  if (expError) {
    console.error("Experiences insert failed:", expError.message);
    process.exit(1);
  }

  console.log(`Inserted ${experiences.length} experiences.`);
  console.log("Seed complete ✓");
}

seed();
