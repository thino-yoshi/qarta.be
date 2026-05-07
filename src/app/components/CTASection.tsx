"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Check, ArrowRight, ChevronDown } from "lucide-react";

// ─── Simulator constants ────────────────────────────────────────────────────
const SC = {
  pess: { retour: 0.04, panier: 0.02, push: 0.01,  google: 0.008, pct: "4",  label: "Pessimiste", growth: [1, 1.08, 1.14, 1.18, 1.21] },
  real: { retour: 0.09, panier: 0.05, push: 0.025, google: 0.02,  pct: "10", label: "Réaliste",   growth: [1, 1.15, 1.28, 1.38, 1.46] },
  opti: { retour: 0.15, panier: 0.09, push: 0.04,  google: 0.035, pct: "15", label: "Optimiste",  growth: [1, 1.22, 1.44, 1.63, 1.79] },
} as const;

const LV = [
  { key: "retour", name: "Clients qui ne reviennent pas",  desc: "Sans rappel, les clients oublient. Les notifications et points de fidélité déclenchent des visites récurrentes automatiquement." },
  { key: "panier", name: "Panier moyen sous-optimisé",     desc: "Les offres ciblées et promotions personnalisées augmentent la valeur de chaque visite client de manière mesurable." },
  { key: "push",   name: "Visites non déclenchées",        desc: 'Un push bien ciblé ("Revenez cette semaine, double points") génère 2 à 8 % de conversions supplémentaires selon Airship 2023.' },
  { key: "google", name: "Nouveaux clients non captés",    desc: "Une meilleure note Google attire 5 à 12 % de trafic entrant en plus. La demande d'avis post-visite est entièrement automatisée." },
];

type ScKey = keyof typeof SC;
type Gains = { retour: number; panier: number; push: number; google: number; total: number };

function fmt(n: number): string {
  const a = Math.abs(n), s = n < 0 ? "−" : "";
  if (a >= 1_000_000) return s + (a / 1e6).toFixed(1).replace(".", ",") + " M€";
  if (a >= 10_000)    return s + Math.round(a / 1000) + " k€";
  if (a >= 1_000)     return s + (a / 1000).toFixed(1).replace(".", ",") + " k€";
  return s + Math.round(a) + " €";
}

function fmtF(n: number): string {
  return (n < 0 ? "−" : "") + Math.abs(Math.round(n)).toLocaleString("fr-FR") + " €";
}

function sliderBg(val: number, min: number, max: number): React.CSSProperties {
  const pct = ((val - min) / (max - min)) * 100;
  return { background: `linear-gradient(to right, #0f2044 ${pct}%, #d8e6f0 ${pct}%)` };
}

// ─── Steps data ─────────────────────────────────────────────────────────────
const steps = [
  { n: "01", t: "Choisir le type de fidélité",  d: "Tampons, visites, points ou récompenses — sélectionnez ce qui correspond à votre activité." },
  { n: "02", t: "Personnaliser",                d: "Couleurs, logo, seuils, récompenses : votre programme à votre image." },
  { n: "03", t: "Activer & partager",           d: "Obtenez une clé d'accès et commencez à fidéliser vos clients immédiatement." },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function CTASection() {
  // Simulator state
  const [clients,  setClients]  = useState(50);
  const [jours,    setJours]    = useState(22);
  const [panier,   setPanier]   = useState(15);
  const [pdv,      setPdv]      = useState(1);
  const [heroSc,   setHeroSc]   = useState<ScKey>("real");
  const [showDetail, setShowDetail] = useState(false);

  const caAn = useMemo(
    () => clients * jours * 12 * panier * pdv,
    [clients, jours, panier, pdv]
  );

  const getGains = (sc: ScKey): Gains => {
    const s = SC[sc];
    const r = caAn * s.retour, p = caAn * s.panier, push = caAn * s.push, g = caAn * s.google;
    return { retour: r, panier: p, push, google: g, total: r + p + push + g };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const heroGains   = useMemo(() => getGains(heroSc), [heroSc, caAn]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const detailGains = useMemo(() => getGains(heroSc), [heroSc, caAn]);

  const cum = useMemo(() => {
    let run = 0;
    return SC[heroSc].growth.map(gf => { run += Math.round(detailGains.total * gf); return run; });
  }, [heroSc, detailGains.total]);
  const mx = cum[cum.length - 1] || 1;

  const sliders = [
    { label: "Clients par jour",      val: clients, set: setClients, min: 10, max: 500, step: 5,  suffix: "" },
    { label: "Jours ouverts / mois",  val: jours,   set: setJours,   min: 10, max: 31,  step: 1,  suffix: "" },
    { label: "Panier moyen",          val: panier,  set: setPanier,  min: 3,  max: 200, step: 1,  suffix: " €" },
    { label: "Points de vente",       val: pdv,     set: setPdv,     min: 1,  max: 20,  step: 1,  suffix: "" },
  ] as const;

  return (
    <section id="pricing" data-testid="cta-section" className="relative" style={{ background: "#faf8f4" }}>

      {/* ── Steps ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaf2fd] text-[#2c7be5] text-[11px] font-semibold tracking-[0.18em] uppercase">
            Parcours commerçant
          </span>
          <h2
            className="mt-6 font-display text-[#0f2044]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)", fontWeight: 400, letterSpacing: "0.06em", lineHeight: 1.15 }}
          >
            Créer votre programme<br />
            en <span className="text-[#2c7be5]">3 étapes</span>.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="p-7 rounded-3xl bg-white border border-[#eaf0fb] relative overflow-hidden"
              style={{ boxShadow: "0 10px 30px -18px rgba(15,32,68,0.18)" }}>
              <div className="flex items-start justify-between">
                <div className="text-[11px] font-mono text-[#2c7be5] font-bold tracking-widest">ÉTAPE {s.n}</div>
                <div className="w-9 h-9 rounded-xl bg-[#eaf2fd] flex items-center justify-center text-[#2c7be5] font-bold text-[14px]">{i + 1}</div>
              </div>
              <h3 className="mt-4 font-display text-[20px] font-bold text-[#0f2044]">{s.t}</h3>
              <p className="mt-2 text-[#47526a] text-[14px] leading-relaxed">{s.d}</p>
              <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-[#4a9eff]/10 blur-2xl pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center">
          <Link href="/register?role=merchant" className="q-btn-primary text-[15px]">
            Créer mon programme de fidélité
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Pricing + Simulator ───────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pb-10">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaf2fd] text-[#2c7be5] text-[11px] font-semibold tracking-[0.18em] uppercase">
            Abonnement
          </span>
          <h2
            className="mt-6 font-display text-[#0f2044]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)", fontWeight: 600, letterSpacing: "0.06em" }}
          >
            Des tarifs <span className="text-[#2c7be5]">clairs</span>,<br />sans surprise.
          </h2>
        </div>

        {/* 3-col equal: pricing · sliders · result */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">

          {/* ── LEFT : pricing card ── */}
          <div
            className="relative p-7 rounded-3xl border-2 border-[#0f2044] bg-white"
            style={{ boxShadow: "0 30px 60px -30px rgba(44,123,229,.4)" }}
          >
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#0f2044] text-white text-[10px] font-bold uppercase tracking-widest">
              Populaire
            </div>
            <div className="text-[13px] font-semibold text-[#0f2044]/70 uppercase tracking-widest">Pro</div>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-display text-[42px] font-bold text-[#0f2044]">20€</span>
              <span className="text-[#6a7388] text-[13px] mb-2">/ mois</span>
            </div>
            <div className="mt-5 space-y-3">
              {["Programmes illimités", "Clients illimités", "Notifications automatiques", "Avis Google intégrés", "Support prioritaire"].map(f => (
                <div key={f} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#e8eaf0] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} color="#0f2044" strokeWidth={3} />
                  </div>
                  <span className="text-[14px] text-[#47526a]">{f}</span>
                </div>
              ))}
            </div>
            <Link
              href="/register?role=merchant&plan=pro"
              className="mt-7 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-semibold bg-[#0f2044] text-white hover:bg-[#162040] transition-colors"
            >
              Lancer mon programme <ArrowRight size={14} />
            </Link>
          </div>

          {/* ── MIDDLE : sliders panel ── */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2eaf5] flex flex-col"
            style={{ boxShadow: "0 4px 32px rgba(15,32,68,0.05)" }}>
              <p className="text-[11px] font-bold text-[#0f2044] mb-5 uppercase tracking-[0.14em]">Vos données</p>

              {sliders.map(({ label, val, set, min, max, step, suffix }) => (
                <div key={label} className="mb-5 last:mb-0">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[12px] text-[#4a637d] font-medium">{label}</span>
                    <span className="text-[12px] font-bold text-[#0f2044] bg-[#eaf0f8] px-2.5 py-0.5 rounded-lg tabular-nums min-w-[52px] text-center">
                      {val}{suffix}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min} max={max} step={step} value={val}
                    onChange={e => set(Number(e.target.value) as never)}
                    className="sim-range"
                    style={sliderBg(val, min, max)}
                  />
                </div>
              ))}

              <div className="mt-auto pt-4 border-t border-[#eaf0f8]">
                <p className="text-[11px] text-[#7a96b0] mb-0.5">CA annuel estimé</p>
                <p className="font-bold text-[#0f2044] tabular-nums" style={{ fontSize: "clamp(18px,2vw,22px)" }}>
                  {fmtF(caAn)}
                </p>
              </div>
            </div>

            {/* Result panel */}
            <div className="rounded-2xl p-5 relative overflow-hidden flex flex-col" style={{ background: "#0f2044" }}>
              <div className="absolute -top-14 -right-14 w-36 h-36 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(74,158,255,0.1), transparent 70%)" }} />

              {/* Scenario tabs */}
              <div className="flex rounded-full p-[3px] gap-[2px] mb-5 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                {(["pess", "real", "opti"] as ScKey[]).map(k => (
                  <button
                    key={k}
                    onClick={() => setHeroSc(k)}
                    className="flex-1 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                    style={heroSc === k
                      ? { background: "#4a9eff", color: "#0f2044", boxShadow: "0 2px 12px rgba(74,158,255,0.45)" }
                      : { color: "rgba(255,255,255,0.4)" }}
                  >
                    {SC[k].label}
                  </button>
                ))}
              </div>

              <p className="text-[11.5px] mb-1 leading-relaxed" style={{ color: "#b8d9ff" }}>
                Si seulement{" "}
                <span className="font-bold" style={{ color: "#7ec4ff" }}>{SC[heroSc].pct} %</span>{" "}
                de vos clients revient
              </p>
              <div
                className="font-black leading-none mb-1 tabular-nums"
                style={{ fontSize: "clamp(26px,3.5vw,38px)", color: "#7ec4ff", letterSpacing: "-0.04em" }}
              >
                {fmtF(heroGains.total)}
              </div>
              <p className="text-[10.5px] mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                de ventes supplémentaires / an
              </p>

              <div className="grid grid-cols-2 gap-1.5 mb-5 flex-1">
                {[["↗", "× 2 rétention"], ["★", "× 2 bénéfices"], ["🛒", "+ 30 % panier"], ["💬", "Avis Google auto"]].map(([icon, txt]) => (
                  <div key={txt}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[10.5px] font-semibold"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#b8d9ff" }}
                  >
                    <span className="text-[12px]">{icon}</span>{txt}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowDetail(v => !v)}
                className="w-full py-2.5 rounded-full font-bold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: "#4a9eff", color: "#0f2044", boxShadow: "0 4px 20px rgba(74,158,255,0.35)" }}
              >
                {showDetail ? "Masquer le détail" : "Voir le détail complet"}
                <ChevronDown
                  size={14}
                  style={{ transform: showDetail ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
                />
              </button>
              <p className="text-center text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                Études sectorielles indépendantes
              </p>
            </div>
        </div>

        {/* ── Expandable detail (accordion) ──────────────────────────── */}
        <div
          className="overflow-hidden"
          style={{
            maxHeight: showDetail ? "3200px" : "0px",
            opacity: showDetail ? 1 : 0,
            transition: "max-height 0.7s ease-in-out, opacity 0.4s ease",
          }}
        >
          <div className="mt-10 pb-4">
            <h3 className="font-display text-[22px] font-bold text-[#0f2044] mb-1" style={{ letterSpacing: "-0.025em" }}>
              Analyse détaillée du manque à gagner
            </h3>
            <p className="text-[13px] text-[#7a96b0] mb-6">
              Ce que vous perdez chaque année sans programme de fidélisation
            </p>


            {/* 4 levers */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {LV.map(l => {
                const v = detailGains[l.key as keyof Gains] as number;
                const pb = Math.round((v / detailGains.total) * 100);
                const pc = ((v / (caAn || 1)) * 100).toFixed(1);
                const sign = "−";
                const col = "#e03535";
                return (
                  <div key={l.key}
                    className="bg-white rounded-2xl p-5 border border-[#e2eaf5] hover:border-[#4a9eff] transition-all hover:-translate-y-0.5"
                    style={{ boxShadow: "0 4px 20px rgba(15,32,68,0.04)" }}
                  >
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <span className="font-bold text-[13px] text-[#0f2044] leading-snug">{l.name}</span>
                      <span className="font-extrabold text-[14px] whitespace-nowrap flex-shrink-0" style={{ color: col }}>
                        {sign}{fmt(v)}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#7a96b0] leading-relaxed mb-3">{l.desc}</p>
                    <div className="h-[3px] bg-[#e8eef6] rounded-full overflow-hidden mb-1">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pb}%`, background: col }} />
                    </div>
                    <p className="text-[11px] text-[#a8bed4] text-right">{pc} % du CA annuel</p>
                  </div>
                );
              })}
            </div>

            {/* Summary row */}
            <div
              className="rounded-2xl px-7 py-5 flex justify-between items-center mb-10 border border-white/[0.07]"
              style={{ background: "#0f2044" }}
            >
              <div>
                <p className="text-[13px] font-medium mb-1" style={{ color: "#b8d9ff" }}>
                  Manque à gagner sans QARTA
                </p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {`Soit −${fmt(detailGains.total / 12)} chaque mois non récupérés`}
                </p>
              </div>
              <span className="font-black text-[28px] tabular-nums" style={{ letterSpacing: "-0.03em", color: "#ff8080" }}>
                −{fmtF(detailGains.total)}
              </span>
            </div>

            {/* 5-year bars */}
            <h4 className="font-display text-[17px] font-bold text-[#0f2044] mb-5" style={{ letterSpacing: "-0.02em" }}>
              Accumulation sur 5 ans
            </h4>
            <div className="grid grid-cols-5 gap-3 mb-5 items-end">
              {cum.map((v, idx) => {
                const h = Math.max(8, Math.round((v / mx) * 140));
                const col  = "#e03535";
                const bgC  = "#fdf2f2";
                const bdC  = "#f0b0b0";
                const sign = "−";
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="font-bold text-[11px] text-center tabular-nums" style={{ color: col }}>
                      {sign}{fmt(v)}
                    </span>
                    <div className="w-full flex flex-col justify-end" style={{ height: "140px" }}>
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{ height: `${h}px`, background: bgC, border: `1.5px solid ${bdC}` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: "#a8bed4" }}>An {idx + 1}</span>
                  </div>
                );
              })}
            </div>

            {/* 5-year total */}
            <div
              className="rounded-2xl px-6 py-5 flex justify-between items-center"
              style={{ background: "#fdf2f2", border: "1px solid #f0b0b0" }}
            >
              <div>
                <p className="text-[13px] font-bold mb-1" style={{ color: "#7a1c1c" }}>
                  Manque à gagner cumulé sans QARTA
                </p>
                <p className="text-[11px]" style={{ color: "#9a4040" }}>
                  Sans programme de fidélisation actif
                </p>
              </div>
              <span className="font-black text-[32px] tabular-nums" style={{ letterSpacing: "-0.03em", color: "#e03535" }}>
                −{fmt(cum[cum.length - 1])}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
