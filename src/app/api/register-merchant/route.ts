import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  /* ── 1. Vérifier que l'utilisateur est bien connecté (OTP vérifié) ── */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  /* ── 2. Insérer via service role (contourne RLS et grants) ── */
  const admin = createAdminClient();

  /* users EN PREMIER — merchants.id a une FK vers public.users.id */
  const { error: userError } = await admin.from("users").upsert({
    id: user.id,
    email: user.email,
    name: `${body.first_name} ${body.last_name}`,
    user_type: "merchant",
  }, { onConflict: "email" });

  if (userError) {
    console.error("[register-merchant] users error:", userError);
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  /* merchants ENSUITE */
  const { error: merchantError } = await admin.from("merchants").upsert({
    id: user.id,
    business_name: body.business_name,
    category: body.category,
    email: user.email,
    first_name: body.first_name,
    last_name: body.last_name,
    phone: body.phone,
    address: body.address,
    postal_code: body.postal_code,
    city: body.city,
    country: body.country,
    website: body.website || null,
    siret: body.siret || null,
    num_locations: body.num_locations,
    subscription_status: "pending",
  });

  if (merchantError) {
    console.error("[register-merchant] merchants error:", merchantError);
    return NextResponse.json({ error: merchantError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
