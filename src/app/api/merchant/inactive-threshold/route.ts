import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { days } = await req.json();
  if (typeof days !== "number" || days < 1 || days > 365) {
    return NextResponse.json({ error: "Valeur invalide (1–365 jours)" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("merchants")
    .update({ inactive_threshold_days: days })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
