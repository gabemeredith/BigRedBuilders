import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

function isAuthorized(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const supabase = createAdminClient();

  const { experiences, ...playerFields } = body;

  const allowedFields = [
    "name", "school", "descriptor", "headline", "photo",
    "rating", "wins", "losses", "ties", "is_active", "is_hidden", "tags",
  ];
  const update: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in playerFields) update[key] = playerFields[key];
  }

  const { error: playerError } = await supabase
    .from("players")
    .update(update)
    .eq("id", id);

  if (playerError) {
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
  }

  if (Array.isArray(experiences)) {
    await supabase.from("experiences").delete().eq("player_id", id);

    if (experiences.length > 0) {
      const rows = experiences.map((e: {
        companyName: string;
        roleTitle: string;
        companyDomain?: string;
        sortOrder: number;
      }, i: number) => ({
        player_id: id,
        company_name: e.companyName,
        role_title: e.roleTitle,
        company_domain: e.companyDomain ?? null,
        sort_order: e.sortOrder ?? i,
      }));
      const { error: expError } = await supabase.from("experiences").insert(rows);
      if (expError) {
        return NextResponse.json({ error: "Failed to update experiences" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  await supabase.from("experiences").delete().eq("player_id", id);

  // Delete votes via matches involving this player
  const { data: matches } = await supabase
    .from("matches")
    .select("id")
    .or(`player_left_id.eq.${id},player_right_id.eq.${id}`);

  if (matches && matches.length > 0) {
    const matchIds = matches.map((m) => m.id);
    await supabase.from("votes").delete().in("match_id", matchIds);
    await supabase.from("matches").delete().in("id", matchIds);
  }

  const { error } = await supabase.from("players").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
