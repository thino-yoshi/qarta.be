import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/neon";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { days } = await req.json();
  if (typeof days !== "number" || days < 1 || days > 365) {
    return NextResponse.json({ error: "Valeur invalide (1–365 jours)" }, { status: 400 });
  }

  try {
    await sql`UPDATE merchants SET inactive_threshold_days = ${days} WHERE id = ${session.id}`;
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
