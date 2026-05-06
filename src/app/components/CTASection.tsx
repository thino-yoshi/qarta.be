"use client";
import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    t: "Choisir le type de fidélité",
    d: "Tampons, visites, points ou récompenses — sélectionnez ce qui correspond à votre activité.",
  },
  {
    n: "02",
    t: "Personnaliser",
    d: "Couleurs, logo, seuils, récompenses : votre programme à votre image.",
  },
  {
    n: "03",
    t: "Activer & partager",
    d: "Obtenez une clé d'accès et commencez à fidéliser vos clients immédiatement.",
  },
];

const plans = [
  {
    name: "Pro",
    price: "20€",
    period: "/ mois",
    features: [
      "Programmes illimités",
      "Clients illimités",
      "Notifications automatiques",
      "Avis Google intégrés",
      "Support prioritaire",
    ],
    cta: "Lancer mon programme",
    href: "/register?role=merchant&plan=pro",
    popular: true,
  },
];

export default function CTASection() {
  return (
    <section id="pricing" data-testid="cta-section" className="relative" style={{ background: "#faf8f4" }}>
      {/* Steps */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaf2fd] text-[#2c7be5] text-[11px] font-semibold tracking-[0.18em] uppercase">
            Parcours commerçant
          </span>
          <h2
            className="mt-6 font-display text-[#0f2044]"
            style={{
              fontSize: "clamp(2rem, 4.2vw, 3.4rem)",
              fontWeight: 400,
              letterSpacing: "0.06em",
              lineHeight: 1.15,
            }}
          >
            Créer votre programme<br />
            en <span className="text-[#2c7be5]">3 étapes</span>.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="p-7 rounded-3xl bg-white border border-[#eaf0fb] relative overflow-hidden"
              style={{ boxShadow: "0 10px 30px -18px rgba(15,32,68,0.18)" }}
            >
              <div className="flex items-start justify-between">
                <div className="text-[11px] font-mono text-[#2c7be5] font-bold tracking-widest">
                  ÉTAPE {s.n}
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#eaf2fd] flex items-center justify-center text-[#2c7be5] font-bold text-[14px]">
                  {i + 1}
                </div>
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

      {/* Pricing */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaf2fd] text-[#2c7be5] text-[11px] font-semibold tracking-[0.18em] uppercase">
            Abonnement
          </span>
          <h2
            className="mt-6 font-display text-[#0f2044]"
            style={{
              fontSize: "clamp(2rem, 4.2vw, 3.4rem)",
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            Des tarifs{" "}
            <span className="text-[#2c7be5]">clairs</span> et sans surprise.
          </h2>
        </div>

        <div className="mt-14 flex justify-center">
          {plans.map((p, i) => (
            <div
              key={p.name}
              className={`relative p-7 rounded-3xl transition-transform hover:-translate-y-1 duration-300 w-full max-w-sm ${
                p.popular
                  ? "border-2 border-[#0f2044] bg-white"
                  : "bg-white border border-[#eaf0fb]"
              }`}
              style={{
                boxShadow: p.popular
                  ? "0 30px 60px -30px rgba(44,123,229,.45)"
                  : "0 12px 28px -16px rgba(15,32,68,.14)",
              }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-[#0f2044] text-white text-[10px] font-bold uppercase tracking-widest">
                  Populaire
                </div>
              )}
              <div className="text-[13px] font-semibold text-[#0f2044]/70 uppercase tracking-widest">
                {p.name}
              </div>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-[40px] font-bold text-[#0f2044]">{p.price}</span>
                <span className="text-[#6a7388] text-[13px] mb-2">{p.period}</span>
              </div>
              <div className="mt-5 space-y-3">
                {p.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#e8eaf0] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} color="#0f2044" strokeWidth={3} />
                    </div>
                    <span className="text-[14px] text-[#47526a]">{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href={p.href}
                className={`mt-7 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-colors ${
                  p.popular
                    ? "bg-[#0f2044] text-white hover:bg-[#0b1220]"
                    : "border border-[#0f2044]/14 text-[#0f2044] hover:border-[#2c7be5] hover:text-[#2c7be5]"
                }`}
              >
                {p.cta}
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
