import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function checkAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === process.env.QARTA_ADMIN_EMAIL;
}

/** GET /api/admin/content?page=home&section=header  → content JSON
 *  GET /api/admin/content?page=home                 → { section: content, … } */
export async function GET(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page    = searchParams.get("page");
  const section = searchParams.get("section");

  if (!page) return NextResponse.json({ error: "Missing page param" }, { status: 400 });

  const db = createAdminClient();

  if (section) {
    const { data, error } = await db
      .from("page_content")
      .select("content")
      .eq("page", page)
      .eq("section", section)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data?.content ?? null);
  }

  const { data, error } = await db
    .from("page_content")
    .select("section, content")
    .eq("page", page);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const map = Object.fromEntries((data ?? []).map(r => [r.section, r.content]));
  return NextResponse.json(map);
}

/** PUT /api/admin/content  body: { page, section, content } */
export async function PUT(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { page, section, content } = body ?? {};

  if (!page || !section || content === undefined) {
    return NextResponse.json({ error: "Missing fields: page, section, content" }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db
    .from("page_content")
    .upsert(
      { page, section, content, updated_at: new Date().toISOString() },
      { onConflict: "page,section" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
