import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Next.js App Router : pas de bodyParser à désactiver, on lit req.text() directement
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "Signature manquante" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[stripe/webhook] Signature invalide :", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {

    // ── Paiement initial confirmé ─────────────────────────────────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const merchantId     = session.metadata?.merchant_id;
      const subscriptionId = session.subscription as string;
      if (!merchantId || !subscriptionId) break;

      // Récupérer la subscription pour avoir current_period_end
      const sub = await stripe.subscriptions.retrieve(subscriptionId);

      await admin.from("merchants").update({
        subscription_status:        "active",
        stripe_customer_id:         session.customer as string,
        stripe_subscription_id:     subscriptionId,
        stripe_current_period_end:  new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
      }).eq("id", merchantId);

      break;
    }

    // ── Renouvellement / mise à jour ──────────────────────────────────
    case "customer.subscription.updated": {
      const sub        = event.data.object as Stripe.Subscription;
      const merchantId = sub.metadata?.merchant_id;
      if (!merchantId) break;

      const newStatus = sub.status === "active" ? "active" : "pending";
      await admin.from("merchants").update({
        subscription_status:       newStatus,
        stripe_current_period_end: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
      }).eq("id", merchantId);

      break;
    }

    // ── Annulation ────────────────────────────────────────────────────
    case "customer.subscription.deleted": {
      const sub        = event.data.object as Stripe.Subscription;
      const merchantId = sub.metadata?.merchant_id;
      if (!merchantId) break;

      await admin.from("merchants").update({
        subscription_status:       "canceled",
        stripe_subscription_id:    null,
        stripe_current_period_end: null,
      }).eq("id", merchantId);

      break;
    }

    // ── Échec de paiement ─────────────────────────────────────────────
    case "invoice.payment_failed": {
      const invoice    = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      if (!customerId) break;

      // Retrouver le marchand via stripe_customer_id
      const { data: merchant } = await admin
        .from("merchants")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .maybeSingle();

      if (merchant) {
        await admin.from("merchants").update({ subscription_status: "payment_failed" }).eq("id", merchant.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
