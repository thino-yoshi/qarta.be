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

  const { data: merchant } = await admin
    .from("merchants")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

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
