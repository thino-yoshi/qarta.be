import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { card_design } = await req.json();
  if (!card_design) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

  const admin = createAdminClient();

  const { error } = await admin.from("merchant_card_designs").upsert(
    {
      merchant_id:  user.id,
      card_design,
      updated_at:   new Date().toISOString(),
    },
    { onConflict: "merchant_id" }
  );

  if (error) {
    console.error("[loyalty-card/save]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
