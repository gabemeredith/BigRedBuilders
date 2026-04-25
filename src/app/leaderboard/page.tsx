import { Leaderboard } from "@/components/Leaderboard";
import { NominateBanner } from "@/components/NominateBanner";
import { createServerClient } from "@/lib/supabase/server";
import type { Player, IvySchool } from "@/types";

async function getPlayers(school?: string): Promise<Player[]> {
  const supabase = createServerClient();

  let query = supabase
    .from("players")
    .select("*")
    .eq("is_active", true)
    .eq("is_hidden", false)
    .order("rating", { ascending: false })
    .limit(100);

  if (school) {
    query = query.eq("school", school as IvySchool);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    school: row.school,
    descriptor: row.descriptor,
    photo: row.photo,
    headline: row.headline,
    rating: row.rating,
    wins: row.wins,
    losses: row.losses,
    ties: row.ties,
    exposureCount: row.exposure_count,
    isActive: row.is_active,
    isHidden: row.is_hidden,
    tags: row.tags,
  }));
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
