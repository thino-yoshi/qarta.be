import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/neon";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { card_design, convertProgress } = await req.json();
  if (!card_design) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

  // 0. Lire la config ACTUELLE avant de la modifier (pour conversion de progression)
  const [oldMerchant] = await sql`
    SELECT program_type, stamps_required, points_required
    FROM merchants WHERE id = ${user.id}
  `;

  // 1. Sauvegarder le design complet
  try {
    await sql`
      INSERT INTO merchant_card_designs (merchant_id, card_design, updated_at)
      VALUES (${user.id}, ${JSON.stringify(card_design)}, NOW())
      ON CONFLICT (merchant_id) DO UPDATE SET
        card_design = EXCLUDED.card_design,
        updated_at  = EXCLUDED.updated_at
    `;
  } catch (err) {
    console.error("[loyalty-card/save]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  // 1bis. Conversion proportionnelle de la progression des clients
  if (convertProgress === true && oldMerchant) {
    const oldMode = oldMerchant.program_type ?? "stamps";
    const oldMax  = oldMode === "points"
      ? Number(oldMerchant.points_required) || 0
      : Number(oldMerchant.stamps_required) || 0;
    const newMode = card_design.loyaltyMode === "points" ? "points" : "stamps";
    const newMax  = newMode === "points"
      ? Math.max(1, Math.round(Number(card_design.pointsGoal)     || 0))
      : Math.max(1, Math.round(Number(card_design.stampsRequired) || 0));

    if (oldMax > 0 && newMax > 0) {
      const cards = await sql`SELECT id, stamps_count FROM loyalty_cards WHERE merchant_id = ${user.id}`;
      if (cards.length > 0) {
        await Promise.all(cards.map((c: { id: string; stamps_count: number }) => {
          const ratio     = Math.min(1, (Number(c.stamps_count) || 0) / oldMax);
          const converted = Math.min(newMax, Math.max(0, Math.round(ratio * newMax)));
          return sql`UPDATE loyalty_cards SET stamps_count = ${converted} WHERE id = ${c.id}`;
        }));
      }
    }
  }

  // 2. Synchroniser les champs métier vers merchants
  const businessName      = typeof card_design.cardName === "string" && card_design.cardName.trim()
                              ? card_design.cardName.trim() : null;
  const rewardDescription = typeof card_design.rewardDescription === "string"
                              ? card_design.rewardDescription : null;
  const programType       = (card_design.loyaltyMode === "stamps" || card_design.loyaltyMode === "points")
                              ? card_design.loyaltyMode : null;
  const stampsRequired    = Number.isFinite(card_design.stampsRequired)
                              ? Math.max(1, Math.round(card_design.stampsRequired)) : null;
  const pointsRequired    = Number.isFinite(card_design.pointsGoal)
                              ? Math.max(1, Math.round(card_design.pointsGoal)) : null;
  const pointsPerEuro     = Number.isFinite(card_design.pointsPerEuro)
                              ? Math.max(1, Math.round(card_design.pointsPerEuro)) : null;

  try {
    await sql`
      UPDATE merchants SET
        business_name      = COALESCE(${businessName},      business_name),
        reward_description = COALESCE(${rewardDescription}, reward_description),
        program_type       = COALESCE(${programType},       program_type),
        stamps_required    = COALESCE(${stampsRequired},    stamps_required),
        points_required    = COALESCE(${pointsRequired},    points_required),
        points_per_euro    = COALESCE(${pointsPerEuro},     points_per_euro)
      WHERE id = ${user.id}
    `;
  } catch (mErr) {
    console.error("[loyalty-card/save] sync merchants:", mErr);
  }

  return NextResponse.json({ success: true });
}
