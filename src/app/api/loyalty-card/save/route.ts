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

  // 1. Sauvegarder le design complet (source de vérité pour le rendu de la carte)
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

  // 2. Synchroniser les champs « métier » vers la table merchants.
  //    Le backend FastAPI utilise merchants.* (et non card_design) pour la logique
  //    de fidélité : nombre de tampons requis, récompense, type de programme, etc.
  //    Sans cette synchro, la carte affiche X tampons mais la récompense se débloque
  //    à une autre valeur — incohérence visible côté client.
  const merchantUpdate: Record<string, unknown> = {};
  if (typeof card_design.cardName === "string" && card_design.cardName.trim())
    merchantUpdate.business_name = card_design.cardName.trim();
  if (typeof card_design.rewardDescription === "string")
    merchantUpdate.reward_description = card_design.rewardDescription;
  if (card_design.loyaltyMode === "stamps" || card_design.loyaltyMode === "points")
    merchantUpdate.program_type = card_design.loyaltyMode;
  if (Number.isFinite(card_design.stampsRequired))
    merchantUpdate.stamps_required = Math.max(1, Math.round(card_design.stampsRequired));
  if (Number.isFinite(card_design.pointsGoal))
    merchantUpdate.points_required = Math.max(1, Math.round(card_design.pointsGoal));

  if (Object.keys(merchantUpdate).length > 0) {
    const { error: mErr } = await admin
      .from("merchants")
      .update(merchantUpdate)
      .eq("id", user.id);
    if (mErr) {
      // Non bloquant : le design est déjà sauvegardé. On loggue pour diagnostic.
      console.error("[loyalty-card/save] sync merchants:", mErr);
    }
  }

  return NextResponse.json({ success: true });
}
