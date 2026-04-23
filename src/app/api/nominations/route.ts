import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isIvyEduEmail, getIvySchoolFromEmail } from "@/lib/ivy-domains";
import type { IvySchool } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, school, profileUrl, photoUrl, nominatorName, eduEmail, descriptor, headline, experiences } = body;

  if (!name || !school || !profileUrl) {
    return NextResponse.json({ error: "name, school, and profileUrl are required" }, { status: 400 });
  }

  // If an .edu email was provided, validate it server-side
  if (eduEmail) {
    if (!isIvyEduEmail(eduEmail)) {
      return NextResponse.json({ error: "Email must be from an Ivy League .edu domain" }, { status: 400 });
    }
    // Auto-correct school from email if it differs
    const emailSchool = getIvySchoolFromEmail(eduEmail);
    if (emailSchool && emailSchool !== school) {
      return NextResponse.json(
        { error: `Email domain suggests ${emailSchool}, but school is set to ${school}` },
        { status: 400 }
      );
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("nominations").insert({
    name,
    school: school as IvySchool,
    edu_email: eduEmail || null,
    email_verified: false,
    profile_url: profileUrl,
    photo_url: photoUrl || null,
    experiences: experiences ?? null,
    nominator_name: nominatorName || null,
    descriptor: descriptor || null,
    headline: headline || null,
    status: "pending",
  });

  if (error) {
    console.error("nominations insert error:", error);
    return NextResponse.json({ error: "Failed to save nomination" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
