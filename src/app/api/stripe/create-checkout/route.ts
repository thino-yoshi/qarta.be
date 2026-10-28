import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@/lib/neon";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const [merchant] = await sql`
    SELECT id, stripe_customer_id FROM merchants WHERE id = ${session.id} LIMIT 1
  `;
  if (!merchant) return NextResponse.json({ error: "Marchand introuvable" }, { status: 404 });

  let customerId = merchant.stripe_customer_id as string | null;
  if (!customerId) {
    const [userRow] = await sql`SELECT email FROM users WHERE id = ${session.id} LIMIT 1`;
    const customer = await stripe.customers.create({
      email: (userRow?.email as string) ?? "",
      metadata: { merchant_id: session.id },
    });
    customerId = customer.id;
    await sql`UPDATE merchants SET stripe_customer_id = ${customerId} WHERE id = ${session.id}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://qarta.be";

  const stripeSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card", "bancontact", "sepa_debit"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?stripe_success=1`,
    cancel_url:  `${baseUrl}/dashboard`,
    metadata:    { merchant_id: session.id },
    subscription_data: { metadata: { merchant_id: session.id } },
    locale: "fr",
  });

  return NextResponse.json({ url: stripeSession.url });
}
