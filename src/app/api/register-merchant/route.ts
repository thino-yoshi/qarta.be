import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";
import { welcomeMerchantEmail } from "@/lib/emails/welcome-merchant";
import { adminNewMerchantEmail } from "@/lib/emails/admin-new-merchant";

export async function POST(req: NextRequest) {
  /* ── 1. Vérifier que l'utilisateur est bien connecté ── */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  /* ── 2. Insérer via service role ── */
  const admin = createAdminClient();

  /* users EN PREMIER */
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

  /* ── 3. Emails via Resend (en parallèle, non bloquants) ── */
  const welcome = welcomeMerchantEmail({
    firstName: body.first_name,
    businessName: body.business_name,
  });

  const adminNotif = adminNewMerchantEmail({
    firstName: body.first_name,
    lastName: body.last_name,
    businessName: body.business_name,
    category: body.category,
    email: user.email!,
    phone: body.phone,
    city: body.city,
    numLocations: body.num_locations,
  });

  await Promise.allSettled([
    resend.emails.send({
      from: FROM_EMAIL,
      to: user.email!,
      subject: welcome.subject,
      html: welcome.html,
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: adminNotif.subject,
      html: adminNotif.html,
    }),
  ]);

  return NextResponse.json({ success: true });
}
