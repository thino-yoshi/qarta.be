import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@/lib/neon";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const [merchant] = await sql`
    SELECT stripe_customer_id FROM merchants WHERE id = ${session.id} LIMIT 1
  `;
  if (!merchant?.stripe_customer_id) {
    return NextResponse.json({ error: "Aucun compte Stripe associé" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://qarta.be";
  const portalSession = await stripe.billingPortal.sessions.create({
    customer:   merchant.stripe_customer_id as string,
    return_url: `${baseUrl}/dashboard`,
  });

  return NextResponse.json({ url: portalSession.url });
}
