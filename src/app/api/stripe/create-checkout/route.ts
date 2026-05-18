import { createClient }      from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const admin = createAdminClient();

  // ── Récupérer le marchand ─────────────────────────────────────────
  const { data: merchant } = await admin
    .from("merchants")
    .select("id, stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!merchant) return NextResponse.json({ error: "Marchand introuvable" }, { status: 404 });

  // ── Créer ou récupérer le customer Stripe ─────────────────────────
  let customerId = merchant.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { merchant_id: user.id },
    });
    customerId = customer.id;
    await admin
      .from("merchants")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  // ── Créer la session Checkout ─────────────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://qarta.be";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card", "bancontact", "sepa_debit"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?stripe_success=1`,
    cancel_url:  `${baseUrl}/dashboard`,
    metadata:    { merchant_id: user.id },
    subscription_data: { metadata: { merchant_id: user.id } },
    locale: "fr",
  });

  return NextResponse.json({ url: session.url });
}
