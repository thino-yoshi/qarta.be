"use client";
import { Check, Zap, Calendar, CreditCard, Clock, ArrowRight, Receipt } from "lucide-react";

interface Props {
  merchant: Record<string, unknown>;
  isActive: boolean;
  content?: Record<string, unknown>;
}

export default function AbonnementTab({ merchant, isActive, content }: Props) {
  const c = content ?? {};
  const planName       = (c.planName       as string)   ?? "Pro";
  const planPrice      = (c.planPrice      as string)   ?? "29";
  const planPeriod     = (c.planPeriod     as string)   ?? "mois";
  const planFeatures   = (c.planFeatures   as string[]) ?? ["Carte de fidélité digitale", "Scan QR code illimité", "Dashboard statistiques complet", "Notifications push clients", "Support prioritaire", "Application mobile QARTA"];
  const ctaLabel       = (c.ctaLabel       as string)   ?? "S'abonner maintenant";
  const billingTitle   = (c.billingTitle   as string)   ?? "Informations de facturation";
  const planBadgeLabel = (c.planBadgeLabel as string)   ?? "Seul plan disponible";
  const secureLabel    = (c.secureLabel    as string)   ?? "Paiement sécurisé · Sans engagement · Résiliable à tout moment";
  const faq1Q = (c.faq1Q as string) ?? "Puis-je résilier à tout moment ?";
  const faq1A = (c.faq1A as string) ?? "Oui, sans frais ni engagement.";
  const faq2Q = (c.faq2Q as string) ?? "Quand mon compte sera-t-il activé ?";
  const faq2A = (c.faq2A as string) ?? "Immédiatement après confirmation du paiement.";
  const faq3Q = (c.faq3Q as string) ?? "Combien de clients puis-je avoir ?";
  const faq3A = (c.faq3A as string) ?? "Illimité sur le plan Pro.";

  /* ── Compte ACTIF ─────────────────────────────────────────────── */
  if (isActive) {
    const souscritLe = merchant?.created_at
      ? new Date(merchant.created_at as string).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })
      : "—";

    return (
      <div className="max-w-2xl space-y-5">
        {/* Plan actuel */}
        <div className="rounded-2xl p-6" style={{ background: "rgba(39,174,96,0.06)", border: "1px solid rgba(39,174,96,0.2)" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(39,174,96,0.15)" }}>
                <Zap size={18} color="#27ae60" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white">Plan {planName}</h3>
                <p className="text-[12px]" style={{ color: "#27ae60" }}>● Abonnement actif</p>
              </div>
            </div>
            <p className="text-[22px] font-bold text-white">
              {planPrice}<span className="text-[16px]">€</span>
              <span className="text-[14px] text-white/40">/{planPeriod}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            {planFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2 text-[13px] text-white/60">
                <Check size={13} color="#27ae60" strokeWidth={2.5} />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Infos facturation */}
        <div className="rounded-2xl p-6 space-y-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 className="text-[15px] font-semibold mb-4">{billingTitle}</h3>
          {[
            { icon: Calendar,   label: "Date de souscription",    value: souscritLe },
            { icon: Clock,      label: "Prochain renouvellement", value: "—" },
            { icon: CreditCard, label: "Montant prélevé",         value: `${planPrice}€ / ${planPeriod}` },
            { icon: Receipt,    label: "Dernière facture",        value: "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3 text-[13px] text-white/45">
                <Icon size={14} strokeWidth={2} />
                {label}
              </div>
              <span className="text-[13px] text-white/75 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Compte EN ATTENTE ────────────────────────────────────────── */
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-[18px] font-bold mb-1">Choisissez votre abonnement</h2>
        <p className="text-[13px] text-white/40">Débloquez toutes les fonctionnalités QARTA pour votre commerce</p>
      </div>

      {/* Plan card */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "rgba(74,158,255,0.05)", border: "2px solid rgba(74,158,255,0.3)" }}>
        {/* Badge */}
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ background: "rgba(74,158,255,0.12)", border: "1px solid rgba(74,158,255,0.25)", color: "#4a9eff" }}>
          {planBadgeLabel}
        </div>

        <div className="flex items-baseline gap-0.5 mb-0.5">
          <span className="text-[42px] font-bold text-white leading-none">{planPrice}</span>
          <span className="text-[22px] text-white/50 mt-1">€</span>
          <span className="text-[14px] text-white/35 ml-1 self-end mb-1">/ {planPeriod}</span>
        </div>
        <p className="text-[15px] font-semibold text-white/80 mb-5">Plan {planName}</p>

        <div className="space-y-2.5 mb-6">
          {planFeatures.map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-[13px] text-white/60">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(74,158,255,0.15)" }}>
                <Check size={11} color="#4a9eff" strokeWidth={2.5} />
              </div>
              {f}
            </div>
          ))}
        </div>

        <button
          className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #2c7be5, #4a9eff)", boxShadow: "0 12px 30px -10px rgba(44,123,229,0.6)" }}
          onClick={() => alert("Système de paiement Stripe — à venir !")}
        >
          {ctaLabel} <ArrowRight size={16} strokeWidth={2.2} />
        </button>

        <p className="text-[11px] text-white/20 text-center mt-3">{secureLabel}</p>
      </div>

      {/* FAQ */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {[
          { q: faq1Q, r: faq1A },
          { q: faq2Q, r: faq2A },
          { q: faq3Q, r: faq3A },
        ].map(({ q, r }) => (
          <div key={q}>
            <p className="text-[12px] font-semibold text-white/60">{q}</p>
            <p className="text-[12px] text-white/35 mt-0.5">{r}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
