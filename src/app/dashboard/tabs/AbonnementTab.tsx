"use client";
import { Check, Zap, Calendar, CreditCard, Clock, ArrowRight, Receipt } from "lucide-react";

const PLAN = {
  name: "Pro",
  price: 29,
  currency: "€",
  period: "mois",
  features: [
    "Carte de fidélité digitale",
    "Scan QR code illimité",
    "Dashboard statistiques complet",
    "Notifications push clients",
    "Support prioritaire",
    "Application mobile QARTA",
  ],
};

interface Props {
  merchant: Record<string, unknown>;
  isActive: boolean;
}

export default function AbonnementTab({ merchant, isActive }: Props) {

  /* ── Compte ACTIF ─────────────────────────────────────────────── */
  if (isActive) {
    const souscritLe = merchant?.created_at
      ? new Date(merchant.created_at as string).toLocaleDateString("fr-BE", {
          day: "numeric", month: "long", year: "numeric",
        })
      : "—";

    return (
      <div className="max-w-2xl space-y-5">

        {/* Plan actuel */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "rgba(39,174,96,0.06)", border: "1px solid rgba(39,174,96,0.2)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(39,174,96,0.15)" }}
              >
                <Zap size={18} color="#27ae60" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white">Plan {PLAN.name}</h3>
                <p className="text-[12px]" style={{ color: "#27ae60" }}>● Abonnement actif</p>
              </div>
            </div>
            <p className="text-[22px] font-bold text-white">
              {PLAN.price}{PLAN.currency}
              <span className="text-[14px] text-white/40">/{PLAN.period}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            {PLAN.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-[13px] text-white/60">
                <Check size={13} color="#27ae60" strokeWidth={2.5} />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Infos facturation */}
        <div
          className="rounded-2xl p-6 space-y-1"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h3 className="text-[15px] font-semibold mb-4">Informations de facturation</h3>

          {[
            { icon: Calendar,    label: "Date de souscription",    value: souscritLe },
            { icon: Clock,       label: "Prochain renouvellement", value: "—" /* TODO: from subscriptions table */ },
            { icon: CreditCard,  label: "Montant prélevé",         value: `${PLAN.price}${PLAN.currency} / ${PLAN.period}` },
            { icon: Receipt,     label: "Dernière facture",        value: "—" /* TODO */ },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between py-3 border-b last:border-0"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
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
        <p className="text-[13px] text-white/40">
          Débloquez toutes les fonctionnalités QARTA pour votre commerce
        </p>
      </div>

      {/* Plan card */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "rgba(74,158,255,0.05)", border: "2px solid rgba(74,158,255,0.3)" }}
      >
        {/* Badge */}
        <div
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ background: "rgba(74,158,255,0.12)", border: "1px solid rgba(74,158,255,0.25)", color: "#4a9eff" }}
        >
          Seul plan disponible
        </div>

        <div className="flex items-baseline gap-0.5 mb-0.5">
          <span className="text-[42px] font-bold text-white leading-none">{PLAN.price}</span>
          <span className="text-[22px] text-white/50 mt-1">{PLAN.currency}</span>
          <span className="text-[14px] text-white/35 ml-1 self-end mb-1">/ {PLAN.period}</span>
        </div>
        <p className="text-[15px] font-semibold text-white/80 mb-5">Plan {PLAN.name}</p>

        <div className="space-y-2.5 mb-6">
          {PLAN.features.map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-[13px] text-white/60">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(74,158,255,0.15)" }}
              >
                <Check size={11} color="#4a9eff" strokeWidth={2.5} />
              </div>
              {f}
            </div>
          ))}
        </div>

        {/* CTA — paiement à implémenter */}
        <button
          className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #2c7be5, #4a9eff)",
            boxShadow: "0 12px 30px -10px rgba(44,123,229,0.6)",
          }}
          onClick={() => alert("Système de paiement Stripe — à venir !")}
        >
          S&apos;abonner maintenant <ArrowRight size={16} strokeWidth={2.2} />
        </button>

        <p className="text-[11px] text-white/20 text-center mt-3">
          Paiement sécurisé · Sans engagement · Résiliable à tout moment
        </p>
      </div>

      {/* FAQ rapide */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {[
          { q: "Puis-je résilier à tout moment ?",        r: "Oui, sans frais ni engagement." },
          { q: "Quand mon compte sera-t-il activé ?",     r: "Immédiatement après confirmation du paiement." },
          { q: "Combien de clients puis-je avoir ?",      r: "Illimité sur le plan Pro." },
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
