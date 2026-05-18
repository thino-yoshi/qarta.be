"use client";
import { useState } from "react";
import { Check, Zap, Calendar, CreditCard, Clock, ArrowRight, Receipt, Settings, AlertTriangle } from "lucide-react";

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
    return <ActiveView merchant={merchant} planName={planName} planPrice={planPrice} planPeriod={planPeriod} planFeatures={planFeatures} billingTitle={billingTitle} />;
  }

  /* ── Compte EN ATTENTE ────────────────────────────────────────── */
  return <InactiveView planName={planName} planPrice={planPrice} planPeriod={planPeriod} planFeatures={planFeatures} ctaLabel={ctaLabel} planBadgeLabel={planBadgeLabel} secureLabel={secureLabel} faq1Q={faq1Q} faq1A={faq1A} faq2Q={faq2Q} faq2A={faq2A} faq3Q={faq3Q} faq3A={faq3A} />;
}

/* ─── Vue compte actif ─────────────────────────────────────────────── */
function ActiveView({ merchant, planName, planPrice, planPeriod, planFeatures, billingTitle }: {
  merchant: Record<string, unknown>;
  planName: string; planPrice: string; planPeriod: string;
  planFeatures: string[]; billingTitle: string;
}) {
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError,   setPortalError]   = useState<string | null>(null);

  const souscritLe = merchant?.created_at
    ? new Date(merchant.created_at as string).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const prochainRenouvellement = merchant?.stripe_current_period_end
    ? new Date(merchant.stripe_current_period_end as string).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const handlePortal = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res  = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      window.location.href = data.url;
    } catch (e) {
      setPortalError(e instanceof Error ? e.message : "Erreur");
      setPortalLoading(false);
    }
  };

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
          { icon: Clock,      label: "Prochain renouvellement", value: prochainRenouvellement },
          { icon: CreditCard, label: "Montant prélevé",         value: `${planPrice}€ / ${planPeriod}` },
          { icon: Receipt,    label: "Factures & paiements",    value: "Voir dans le portail →" },
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

      {/* Gérer l'abonnement */}
      {portalError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-[13px]"
          style={{ background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.2)", color: "#e74c3c" }}>
          <AlertTriangle size={14} strokeWidth={2} />
          {portalError}
        </div>
      )}
      <button
        onClick={handlePortal}
        disabled={portalLoading}
        className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-[13px] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
      >
        {portalLoading ? (
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
        ) : (
          <Settings size={14} strokeWidth={2} />
        )}
        {portalLoading ? "Redirection…" : "Gérer mon abonnement (facturation, résiliation)"}
      </button>
    </div>
  );
}

/* ─── Vue compte inactif ───────────────────────────────────────────── */
function InactiveView({ planName, planPrice, planPeriod, planFeatures, ctaLabel, planBadgeLabel, secureLabel, faq1Q, faq1A, faq2Q, faq2A, faq3Q, faq3A }: {
  planName: string; planPrice: string; planPeriod: string;
  planFeatures: string[]; ctaLabel: string; planBadgeLabel: string; secureLabel: string;
  faq1Q: string; faq1A: string; faq2Q: string; faq2A: string; faq3Q: string; faq3A: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/stripe/create-checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue");
      setLoading(false);
    }
  };

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

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl text-[13px]"
            style={{ background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.2)", color: "#e74c3c" }}>
            <AlertTriangle size={14} strokeWidth={2} />
            {error}
          </div>
        )}

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, #2c7be5, #4a9eff)", boxShadow: "0 12px 30px -10px rgba(44,123,229,0.6)" }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              Redirection vers Stripe…
            </>
          ) : (
            <>{ctaLabel} <ArrowRight size={16} strokeWidth={2.2} /></>
          )}
        </button>

        <p className="text-[11px] text-white/20 text-center mt-3">{secureLabel}</p>
      </div>

      {/* Méthodes de paiement acceptées */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-white/25 mr-1">Accepté :</span>
        {["Visa", "Mastercard", "Bancontact", "SEPA"].map((m) => (
          <span key={m} className="px-2 py-0.5 rounded-md text-[11px] font-medium"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }}>
            {m}
          </span>
        ))}
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
