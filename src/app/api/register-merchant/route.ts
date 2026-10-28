import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";
import { welcomeMerchantEmail } from "@/lib/emails/welcome-merchant";
import { adminNewMerchantEmail } from "@/lib/emails/admin-new-merchant";
import { sql } from "@/lib/neon";

export async function POST(req: NextRequest) {
  /* ── 1. Vérifier que l'utilisateur est bien connecté ── */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();

  /* ── 2. Insérer dans Neon ── */

  /* users EN PREMIER */
  try {
    await sql`
      INSERT INTO users (id, email, name, user_type, password_hash)
      VALUES (
        ${user.id},
        ${user.email ?? ""},
        ${`${body.first_name} ${body.last_name}`.trim()},
        'merchant',
        'SUPABASE_AUTH'
      )
      ON CONFLICT (id) DO UPDATE SET
        email     = EXCLUDED.email,
        name      = EXCLUDED.name,
        user_type = 'merchant'
    `;
  } catch (err) {
    console.error("[register-merchant] users error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  /* merchants ENSUITE */
  try {
    await sql`
      INSERT INTO merchants (
        id, business_name, category,
        first_name, last_name, phone,
        address, postal_code, city, country,
        website, siret, num_locations, subscription_status
      )
      VALUES (
        ${user.id},
        ${body.business_name},
        ${body.category},
        ${body.first_name},
        ${body.last_name},
        ${body.phone},
        ${body.address},
        ${body.postal_code},
        ${body.city},
        ${body.country},
        ${body.website || null},
        ${body.siret || null},
        ${body.num_locations},
        'pending'
      )
      ON CONFLICT (id) DO UPDATE SET
        business_name     = EXCLUDED.business_name,
        category          = EXCLUDED.category,
        first_name        = EXCLUDED.first_name,
        last_name         = EXCLUDED.last_name,
        phone             = EXCLUDED.phone,
        address           = EXCLUDED.address,
        postal_code       = EXCLUDED.postal_code,
        city              = EXCLUDED.city,
        country           = EXCLUDED.country,
        website           = EXCLUDED.website,
        siret             = EXCLUDED.siret,
        num_locations     = EXCLUDED.num_locations
    `;
  } catch (err) {
    console.error("[register-merchant] merchants error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
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
