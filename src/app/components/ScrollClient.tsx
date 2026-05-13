"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { QrCode, Coffee, Scissors, Apple, Wallet, Sparkles, type LucideIcon } from "lucide-react";

interface Props {
  content?: Record<string, unknown>;
}

const FEATURE_ICONS: LucideIcon[] = [QrCode, Wallet, Sparkles, Coffee];

export default function ScrollClient({ content }: Props) {
  const c = content ?? {};
  const badge         = (c.badge        as string)   ?? "Chapitre 02 · Expérience Client";
  const titleLine1    = (c.titleLine1   as string)   ?? "Simple.";
  const titleLine2    = (c.titleLine2   as string)   ?? "Écologique.";
  const titleLine3    = (c.titleLine3   as string)   ?? "Efficace.";
  const subtitle      = (c.subtitle     as string)   ?? "Fini les cartes cartonnées froissées au fond du portefeuille. Toutes vos cartes de fidélité, instantanément réunies, organisées, et prêtes à l'emploi.";
  const featureLabels = (c.featureLabels as string[]) ?? ["QR code unique", "Apple & Google Wallet", "Récompenses auto", "Vos commerces préférés"];

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const paper1Y = useTransform(scrollYProgress, [0.1, 0.55], [0, 520]);
  const paper1R = useTransform(scrollYProgress, [0.1, 0.55], [-8, 42]);
  const paper1O = useTransform(scrollYProgress, [0.1, 0.45, 0.55], [1, 0.5, 0]);

  const paper2Y = useTransform(scrollYProgress, [0.15, 0.6], [0, 600]);
  const paper2R = useTransform(scrollYProgress, [0.15, 0.6], [5, -38]);
  const paper2O = useTransform(scrollYProgress, [0.15, 0.5, 0.6], [1, 0.4, 0]);

  const paper3Y = useTransform(scrollYProgress, [0.2, 0.65], [0, 680]);
  const paper3R = useTransform(scrollYProgress, [0.2, 0.65], [-3, 24]);
  const paper3O = useTransform(scrollYProgress, [0.2, 0.55, 0.65], [1, 0.3, 0]);

  const dig1O = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const dig1Y = useTransform(scrollYProgress, [0.45, 0.7], [60, 0]);
  const dig2O = useTransform(scrollYProgress, [0.5, 0.75], [0, 1]);
  const dig2Y = useTransform(scrollYProgress, [0.5, 0.75], [80, 0]);
  const dig3O = useTransform(scrollYProgress, [0.55, 0.8], [0, 1]);
  const dig3Y = useTransform(scrollYProgress, [0.55, 0.8], [100, 0]);

  const digitalCards = [
    { name: "La Petite Torréfaction", type: "Coffee shop", stamps: 7, total: 10, reward: "Café offert", gradient: "linear-gradient(135deg, #0f2044 0%, #2c7be5 100%)", Icon: Coffee },
    { name: "Salon Odyssée", type: "Coiffeur", stamps: 4, total: 8, reward: "-20 % sur votre prochaine coupe", gradient: "linear-gradient(135deg, #14285a 0%, #4a9eff 100%)", Icon: Scissors },
    { name: "Boucherie Delmas", type: "Alimentaire", stamps: 9, total: 10, reward: "Sachet à offrir", gradient: "linear-gradient(135deg, #0b1220 0%, #1f63c7 100%)", Icon: Apple },
  ];

  const digOpacities = [dig1O, dig2O, dig3O];
  const digYs = [dig1Y, dig2Y, dig3Y];

  return (
    <section
      ref={ref}
      id="client"
      data-testid="scroll-client"
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f4f7fc 0%, #faf8f4 8%, #f3f0ea 100%)" }}
    >
      <div className="flex flex-col items-center justify-center py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#eaf2fd] text-[#2c7be5] text-[11px] font-semibold tracking-[0.18em] uppercase">
              {badge}
            </span>
            <h2
              className="mt-6 font-display text-[#0f2044] flex flex-col"
              style={{ fontSize: "clamp(2.4rem, 5.4vw, 4.6rem)", letterSpacing: "0.06em", fontWeight: 600, lineHeight: 1, gap: "0.12em" }}
            >
              <span>{titleLine1}</span>
              <span className="text-[#2c7be5]">{titleLine2}</span>
              <span>{titleLine3}</span>
            </h2>
            <p className="mt-6 text-[#47526a] text-[17px] leading-relaxed max-w-lg">
              {subtitle}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
              {featureLabels.slice(0, 4).map((label, idx) => {
                const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border-2 border-[#0f2044]"
                    style={{ boxShadow: "0 4px 14px -8px rgba(15,32,68,.12)" }}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#eaf2fd] flex items-center justify-center">
                      <Icon size={16} color="#2c7be5" strokeWidth={2} />
                    </div>
                    <span className="text-[13px] font-medium text-[#0f2044]">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cards stage */}
          <div className="relative h-[620px] flex items-center justify-center" data-testid="client-cards-stage">
            {/* Paper card 1 */}
            <motion.div style={{ y: paper1Y, rotate: paper1R, opacity: paper1O }} className="absolute w-[300px] h-[170px] rounded-xl">
              <div className="w-full h-full rounded-xl p-5 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #f7f2e6 0%, #e8dfc9 100%)", boxShadow: "0 12px 24px -12px rgba(60,40,15,.3), inset 0 0 0 1px rgba(0,0,0,.04)" }}>
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,.02) 0 2px, transparent 2px 6px)" }} />
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#6b5a2e]">CAFÉ DU COIN</div>
                <div className="text-[15px] font-bold mt-1 text-[#2b2111]">Carte de fidélité</div>
                <div className="mt-4 grid grid-cols-5 gap-1.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full border-2 ${i < 5 ? "bg-[#8a6a2f] border-[#8a6a2f]" : "border-[#bda87d] border-dashed"}`} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Paper card 2 */}
            <motion.div style={{ y: paper2Y, rotate: paper2R, opacity: paper2O }} className="absolute w-[280px] h-[160px] rounded-xl">
              <div className="w-full h-full rounded-xl p-5"
                style={{ background: "linear-gradient(135deg, #fbfaf4 0%, #ede7d2 100%)", boxShadow: "0 10px 22px -10px rgba(60,40,15,.28), inset 0 0 0 1px rgba(0,0,0,.04)" }}>
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#7d6b42]">BOUCHERIE</div>
                <div className="text-[14px] font-bold text-[#2b2111] mt-1">10 achats = 1 offert</div>
                <div className="mt-4 flex gap-1.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`w-5 h-5 rounded border ${i < 6 ? "bg-[#8a6a2f]" : "border-[#bda87d]"}`} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Paper card 3 */}
            <motion.div style={{ y: paper3Y, rotate: paper3R, opacity: paper3O }} className="absolute w-[260px] h-[150px] rounded-xl">
              <div className="w-full h-full rounded-xl p-4"
                style={{ background: "linear-gradient(135deg, #f4ecd8 0%, #d8c897 100%)", boxShadow: "0 8px 20px -10px rgba(60,40,15,.25), inset 0 0 0 1px rgba(0,0,0,.04)" }}>
                <div className="text-[10px] uppercase font-mono tracking-widest text-[#6b5a2e]">LAVAGE AUTO</div>
                <div className="text-[13px] font-bold text-[#2b2111] mt-1">5e lavage offert</div>
                <div className="mt-3 flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full ${i < 3 ? "bg-[#8a6a2f]" : "border-2 border-[#bda87d] border-dashed"}`} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Digital QARTA cards */}
            {digitalCards.map((card, i) => {
              const o = digOpacities[i];
              const yv = digYs[i];
              const offset = { left: i * 18 - 22, top: i * 22 - 30 };
              return (
                <motion.div
                  key={card.name}
                  style={{ opacity: o, y: yv, left: `calc(50% + ${offset.left}px - 165px)`, top: `calc(50% + ${offset.top}px - 105px)`, rotate: (i - 1) * 5, zIndex: 10 - i }}
                  className="absolute w-[330px]"
                >
                  <div className="rounded-3xl p-5 relative overflow-hidden"
                    style={{ background: card.gradient, boxShadow: "0 24px 60px -20px rgba(15,32,68,.4), inset 0 1px 0 rgba(255,255,255,.15)" }}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] tracking-[0.2em] uppercase text-white/55 font-semibold">{card.type}</div>
                        <div className="text-white text-[18px] font-bold mt-0.5" style={{ fontFamily: "Manrope" }}>{card.name}</div>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
                        <card.Icon size={20} color="#fff" />
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {Array.from({ length: card.total }).map((_, idx) => (
                        <div key={idx} className={`w-5 h-5 rounded-md ${idx < card.stamps ? "bg-white" : "border border-white/30"}`}
                          style={idx < card.stamps ? { boxShadow: "0 0 8px rgba(255,255,255,.4)" } : {}} />
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-white/75 text-[12px]">
                        <span className="text-white font-semibold">{card.stamps}</span>/{card.total} · {card.reward}
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 text-white text-[10px] font-semibold">
                        <QrCode size={10} /> QR
                      </div>
                    </div>
                    <div className="mt-3 h-1 rounded-full bg-white/12 overflow-hidden">
                      <div className="h-full bg-white/90 rounded-full" style={{ width: `${(card.stamps / card.total) * 100}%` }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
