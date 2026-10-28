import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sql } from "@/lib/neon";

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

  if (section) {
    const [row] = await sql`
      SELECT content FROM page_content WHERE page = ${page} AND section = ${section} LIMIT 1
    `;
    return NextResponse.json(row?.content ?? null);
  }

  const rows = await sql`SELECT section, content FROM page_content WHERE page = ${page}`;
  const map = Object.fromEntries(rows.map((r: { section: string; content: unknown }) => [r.section, r.content]));
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

  try {
    await sql`
      INSERT INTO page_content (page, section, content, updated_at)
      VALUES (${page}, ${section}, ${JSON.stringify(content)}, NOW())
      ON CONFLICT (page, section) DO UPDATE SET
        content    = EXCLUDED.content,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
