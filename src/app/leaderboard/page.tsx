import { Leaderboard } from "@/components/Leaderboard";
import { NominateBanner } from "@/components/NominateBanner";
import type { Player } from "@/types";

async function getPlayers(school?: string): Promise<Player[]> {
  const url = school
    ? `/api/leaderboard?school=${encodeURIComponent(school)}`
    : "/api/leaderboard";

  // Use absolute URL for server-side fetch
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}${url}`, { next: { revalidate: 30 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.players ?? [];
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string }>;
}) {
  const { school } = await searchParams;
  const players = await getPlayers(school);

  return (
    <div className="flex flex-1 flex-col gap-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tight">The cracked index.</h1>
        <p className="mt-1.5 text-muted-foreground font-mono text-sm">
          Top performers across the Ivy League, sorted by Elo.
        </p>
      </div>
      <Leaderboard players={players} />
      <NominateBanner />
    </div>
  );
}
