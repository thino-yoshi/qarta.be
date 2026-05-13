"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Bell, Star, Gift, Clock, TrendingUp, Stamp, type LucideIcon } from "lucide-react";

interface Notif {
  icon: LucideIcon;
  title: string;
  body: string;
  tint: string;
  iconColor: string;
  side: "left" | "right";
  delayStart: number;
}

const NOTIFS: Notif[] = [
  { icon: Star,  title: "Nouvel avis Google ★★★★★",  body: "Marie a laissé 5 étoiles · +1 récompense créditée.", tint: "#fef3c7", iconColor: "#f59e0b", side: "right", delayStart: 0.25 },
  { icon: Bell,  title: "Rappel de visite envoyé",    body: "12 clients relancés sans effort.",                   tint: "#eaf2fd", iconColor: "#2c7be5", side: "left",  delayStart: 0.35 },
  { icon: Gift,  title: "3 récompenses à distribuer", body: "Vos clients réguliers en attente.",                  tint: "#dcfce7", iconColor: "#27ae60", side: "right", delayStart: 0.45 },
  { icon: Clock, title: "Invendus à écouler",          body: "Push automatique aux habitués → 15% utilisé.",       tint: "#fee2e2", iconColor: "#e24b4a", side: "left",  delayStart: 0.55 },
];

const FEATURE_ICONS: LucideIcon[] = [Stamp, Bell, TrendingUp, Star];

function NotifCard({ n, i, scrollYProgress }: { n: Notif; i: number; scrollYProgress: MotionValue<number> }) {
  const start = n.delayStart;
  const end   = Math.min(1, start + 0.25);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x = useTransform(scrollYProgress, [start, end], n.side === "right" ? [-30, 200 + i * 10] : [30, -220 - i * 10]);
  const y = useTransform(scrollYProgress, [start, end], [30 + i * 6, -60 + i * 90]);
  const scale = useTransform(scrollYProgress, [start, end], [0.85, 1]);
  const Icon = n.icon;

  return (
    <motion.div style={{ opacity, x, y, scale }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      <div className="w-[280px] p-3.5 rounded-2xl flex items-start gap-3"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", boxShadow: "0 20px 50px -20px rgba(11,18,32,0.5), 0 0 0 1px rgba(255,255,255,0.6)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: n.tint }}>
          <Icon size={18} color={n.iconColor} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-[#0f2044] leading-tight">{n.title}</div>
          <div className="text-[11.5px] text-[#6a7388] mt-1 leading-snug">{n.body}</div>
        </div>
      </div>
    </motion.div>
  );
}

function MerchantDashboardPreview() {
  return (
    <div className="w-full h-full flex flex-col text-white" style={{ background: "#0b1220" }}>
      <div className="px-5 pt-12 pb-4 relative">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(74,158,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(74,158,255,0.1) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/40">Tableau de bord</div>
            <div className="text-[16px] font-bold">Café du Coin</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#0f2044] border border-[#4a9eff]/30 flex items-center justify-center text-[12px] font-bold text-[#4a9eff]">Q</div>
        </div>
      </div>
      <div className="px-4 grid grid-cols-3 gap-2">
        {[{ v: "128", l: "Clients" }, { v: "42", l: "Récompenses" }, { v: "4.9", l: "Note" }].map((s) => (
          <div key={s.l} className="bg-white/5 border border-white/8 rounded-xl p-2.5">
            <div className="text-[17px] font-bold text-white">{s.v}</div>
            <div className="text-[9px] text-white/45 uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-4 p-3 rounded-2xl bg-white/5 border border-white/8">
        <div className="flex items-center justify-between">
          <div className="text-[11px] text-white/50 font-semibold uppercase tracking-wider">Visites (7j)</div>
          <div className="text-[11px] text-[#4a9eff]">+12%</div>
        </div>
        <div className="mt-3 flex items-end gap-1.5 h-16">
          {[28, 40, 52, 34, 62, 72, 58].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: "linear-gradient(180deg, #4a9eff, #2c7be5)", opacity: 0.4 + i * 0.08 }} />
          ))}
        </div>
      </div>
      <div className="mx-4 mt-3 p-3 rounded-2xl" style={{ background: "linear-gradient(135deg,#2c7be5,#0f2044)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-white/60 uppercase tracking-wider">Programme actif</div>
            <div className="text-[13px] font-bold">10 cafés = 1 offert</div>
          </div>
          <Stamp size={20} color="#fff" />
        </div>
      </div>
      <div className="mx-4 mt-3 space-y-1.5 overflow-hidden">
        <div className="text-[10px] text-white/45 uppercase tracking-wider font-semibold">Activité</div>
        {["Marie a tamponné", "Paul a reçu un reward", "Ana a laissé un avis"].map((t, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4a9eff]" />
            <span className="text-[11px] text-white/75">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  content?: Record<string, unknown>;
}

export default function ScrollMerchant({ content }: Props) {
  const c = content ?? {};
  const badge         = (c.badge         as string)   ?? "Chapitre 03 · Commerçant";
  const title         = (c.title         as string)   ?? "Un outil";
  const accent        = (c.accent        as string)   ?? "puissant";
  const suffix        = (c.suffix        as string)   ?? "et simple.";
  const subtitle      = (c.subtitle      as string)   ?? "Créez un programme de fidélité pour faire revenir vos clients, envoyer des rappels automatiques et analyser vos ventes. Identifiez vos heures creuses et augmentez votre chiffre d'affaires depuis un tableau de bord simple.";
  const featureLabels = (c.featureLabels as string[]) ?? ["Tampons & récompenses", "Notifications automatiques", "Statistiques en temps réel", "Avis Google intégrés"];

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const phoneY      = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [-2, 4]);

  return (
    <section ref={ref} id="merchant" data-testid="scroll-merchant" className="relative overflow-hidden" style={{ background: "#0b1220" }}>
      <div className="absolute top-1/4 right-[-10%] w-[55vw] h-[55vw] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(74,158,255,0.5), transparent 60%)" }} />
      <div className="absolute bottom-0 left-[-10%] w-[45vw] h-[45vw] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(44,123,229,0.6), transparent 60%)" }} />

      <div className="flex items-center py-20 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="inline-block px-3 py-1 rounded-full bg-white/8 text-[#4a9eff] text-[11px] font-semibold tracking-[0.18em] uppercase border border-white/10">
              {badge}
            </span>
            <h2 className="mt-6 font-display text-white" style={{ fontSize: "clamp(2.3rem, 5vw, 4.2rem)", lineHeight: 1.02, letterSpacing: "0.06em", fontWeight: 600 }}>
              {title}{" "}<span className="text-[#4a9eff]">{accent}</span><br />{suffix}
            </h2>
            <p className="mt-6 text-white/70 text-[17px] leading-relaxed max-w-lg">{subtitle}</p>

            <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
              {featureLabels.slice(0, 4).map((label, idx) => {
                const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
                return (
                  <div key={label} className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-[#faf8f4]/40 backdrop-blur-sm">
                    <div className="w-9 h-9 rounded-xl bg-[#4a9eff]/15 flex items-center justify-center">
                      <Icon size={16} color="#4a9eff" strokeWidth={2} />
                    </div>
                    <span className="text-[13px] font-medium text-white/85">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 relative flex items-center justify-center" data-testid="merchant-phone-stage">
            <motion.div style={{ y: phoneY, rotate: phoneRotate }} className="relative">
              <div className="q-phone-shell animate-float" style={{ animationDuration: "8s" }}>
                <div className="q-phone-screen">
                  <div className="q-phone-notch" />
                  <MerchantDashboardPreview />
                </div>
              </div>
            </motion.div>

            {NOTIFS.map((n, i) => (
              <NotifCard key={i} n={n} i={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
