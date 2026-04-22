import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

function isAuthorized(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  // Fetch the nomination
  const { data: nom, error: nomError } = await supabase
    .from("nominations")
    .select("*")
    .eq("id", id)
    .single();

  if (nomError || !nom) {
    return NextResponse.json({ error: "Nomination not found" }, { status: 404 });
  }

  // Create the player record
  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({
      name: nom.name,
      school: nom.school,
      descriptor: nom.descriptor ?? "",
      photo: nom.photo_url ?? "",
      headline: nom.headline ?? null,
      rating: 1200,
      wins: 0,
      losses: 0,
      ties: 0,
      exposure_count: 0,
      is_active: true,
      is_hidden: false,
    })
    .select("id")
    .single();

  if (playerError || !player) {
    console.error("player insert error:", playerError);
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
  }

  // Mark nomination approved
  await supabase
    .from("nominations")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ ok: true, playerId: player.id });
}
