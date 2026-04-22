import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateMatchup } from "@/lib/matchup";
import type { Player, Experience, Match } from "@/types";

export async function GET() {
  const supabase = createAdminClient();

  // Fetch active players
  const { data: playersData, error: playersError } = await supabase
    .from("players")
    .select("*")
    .eq("is_active", true)
    .eq("is_hidden", false);

  if (playersError || !playersData) {
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }

  // Fetch recent matches for recency penalty (last 20)
  const { data: recentMatchesData } = await supabase
    .from("matches")
    .select("id, player_left_id, player_right_id, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  const players: Player[] = playersData.map(dbToPlayer);
  const recentMatches: Match[] = (recentMatchesData ?? []).map((m) => ({
    id: m.id,
    playerLeftId: m.player_left_id,
    playerRightId: m.player_right_id,
    createdAt: m.created_at,
  }));

  const matchup = generateMatchup(players, recentMatches);
  if (!matchup) {
    return NextResponse.json({ error: "Not enough players" }, { status: 404 });
  }

  // Fetch experiences for both players
  const { data: expData } = await supabase
    .from("experiences")
    .select("*")
    .in("player_id", [matchup.left.id, matchup.right.id])
    .order("sort_order", { ascending: true });

  const experiences: Experience[] = (expData ?? []).map(dbToExperience);

  // Record the match
  const { data: matchRecord, error: matchError } = await supabase
    .from("matches")
    .insert({
      player_left_id: matchup.left.id,
      player_right_id: matchup.right.id,
    })
    .select("id")
    .single();

  if (matchError || !matchRecord) {
    return NextResponse.json({ error: "Failed to create match record" }, { status: 500 });
  }

  return NextResponse.json({
    matchId: matchRecord.id,
    left: {
      ...matchup.left,
      experiences: experiences.filter((e) => e.playerId === matchup.left.id),
    },
    right: {
      ...matchup.right,
      experiences: experiences.filter((e) => e.playerId === matchup.right.id),
    },
  });
}

// Map snake_case DB rows to camelCase Player type
function dbToPlayer(row: Record<string, unknown>): Player {
  return {
    id: row.id as string,
    name: row.name as string,
    school: row.school as Player["school"],
    descriptor: row.descriptor as string,
    photo: row.photo as string,
    headline: row.headline as string | undefined,
    rating: row.rating as number,
    wins: row.wins as number,
    losses: row.losses as number,
    ties: row.ties as number,
    exposureCount: row.exposure_count as number,
    isActive: row.is_active as boolean,
    isHidden: row.is_hidden as boolean,
    tags: row.tags as string[] | undefined,
  };
}

function dbToExperience(row: Record<string, unknown>): Experience {
  return {
    id: row.id as string,
    playerId: row.player_id as string,
    companyName: row.company_name as string,
    companyLogo: row.company_logo as string | undefined,
    companyDomain: row.company_domain as string | undefined,
    roleTitle: row.role_title as string,
    sortOrder: row.sort_order as number,
  };
}
