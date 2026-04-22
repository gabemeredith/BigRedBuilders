import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { IvySchool } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const school = searchParams.get("school") as IvySchool | null;

  const supabase = createServerClient();

  let query = supabase
    .from("players")
    .select("*")
    .eq("is_active", true)
    .eq("is_hidden", false)
    .order("rating", { ascending: false })
    .limit(100);

  if (school) {
    query = query.eq("school", school);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }

  const players = (data ?? []).map((row) => ({
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

  return NextResponse.json({ players });
}
