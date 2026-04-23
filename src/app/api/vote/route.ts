import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { processVote } from "@/lib/elo";
import type { VoteResult } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { matchId, result, sessionId } = body as {
    matchId: string;
    result: VoteResult;
    sessionId?: string;
  };

  if (!matchId || !result) {
    return NextResponse.json({ error: "matchId and result are required" }, { status: 400 });
  }

  const validResults: VoteResult[] = ["left", "right", "equal", "skip"];
  if (!validResults.includes(result)) {
    return NextResponse.json({ error: "Invalid result" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Fetch the match
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("player_left_id, player_right_id")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // Fetch both players
  const { data: playersData, error: playersError } = await supabase
    .from("players")
    .select("id, rating, wins, losses, ties, exposure_count")
    .in("id", [match.player_left_id, match.player_right_id]);

  if (playersError || !playersData || playersData.length < 2) {
    return NextResponse.json({ error: "Players not found" }, { status: 404 });
  }

  const left = playersData.find((p) => p.id === match.player_left_id)!;
  const right = playersData.find((p) => p.id === match.player_right_id)!;

  const update = processVote(left.rating, right.rating, result);

  // Insert vote record
  await supabase.from("votes").insert({
    match_id: matchId,
    result,
    session_id: sessionId ?? null,
  });

  // Skip votes don't update ratings
  if (result === "skip") {
    return NextResponse.json({ leftRating: left.rating, rightRating: right.rating, leftDelta: 0, rightDelta: 0 });
  }

  // Update left player
  await supabase
    .from("players")
    .update({
      rating: update.leftRating,
      wins: left.wins + (result === "left" ? 1 : 0),
      losses: left.losses + (result === "right" ? 1 : 0),
      ties: left.ties + (result === "equal" ? 1 : 0),
      exposure_count: left.exposure_count + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", left.id);

  // Update right player
  await supabase
    .from("players")
    .update({
      rating: update.rightRating,
      wins: right.wins + (result === "right" ? 1 : 0),
      losses: right.losses + (result === "left" ? 1 : 0),
      ties: right.ties + (result === "equal" ? 1 : 0),
      exposure_count: right.exposure_count + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", right.id);

  return NextResponse.json({
    leftRating: update.leftRating,
    rightRating: update.rightRating,
    leftDelta: update.leftDelta,
    rightDelta: update.rightDelta,
  });
}
