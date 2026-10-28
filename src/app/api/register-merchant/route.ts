import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";
import { welcomeMerchantEmail } from "@/lib/emails/welcome-merchant";
import { adminNewMerchantEmail } from "@/lib/emails/admin-new-merchant";
import { sql } from "@/lib/neon";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const userId = session.id;

  // "1 établissement" → 1, "2 à 5 établissements" → 2, "5+ établissements" → 5
  const numLocations = parseInt(String(body.num_locations ?? "1"), 10) || 1;

  // Insérer dans merchants (users déjà créé par Railway /auth/admin/create-merchant)
  try {
    await sql`
      INSERT INTO merchants (
        id, business_name, category,
        first_name, last_name, phone,
        address, postal_code, city, country,
        website, siret, num_locations, subscription_status
      )
      VALUES (
        ${userId},
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
        ${numLocations},
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

  // Emails via Resend — récupérer l'email depuis Neon
  try {
    const [userRow] = await sql`SELECT email FROM users WHERE id = ${userId} LIMIT 1`;
    const userEmail = (userRow?.email as string) ?? "";

    if (userEmail) {
      const welcome = welcomeMerchantEmail({
        firstName: body.first_name,
        businessName: body.business_name,
      });
      const adminNotif = adminNewMerchantEmail({
        firstName: body.first_name,
        lastName: body.last_name,
        businessName: body.business_name,
        category: body.category,
        email: userEmail,
        phone: body.phone,
        city: body.city,
        numLocations: numLocations,
      });
      await Promise.allSettled([
        resend.emails.send({ from: FROM_EMAIL, to: userEmail, subject: welcome.subject, html: welcome.html }),
        resend.emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject: adminNotif.subject, html: adminNotif.html }),
      ]);
    }
  } catch (err) {
    console.error("[register-merchant] email error:", err);
  }

  return NextResponse.json({ success: true });
}
