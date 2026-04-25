import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

function isAuthorized(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("players")
    .select("*, experiences(*)")
    .order("rating", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }

  return NextResponse.json({ players: data ?? [] });
}
