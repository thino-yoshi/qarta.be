"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Coffee, Scissors, ShoppingBag, Cpu, Car, Dumbbell, Utensils, Flower2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { QartaLogo } from "./QartaLogo";

const ORBIT: { Icon: LucideIcon; label: string }[] = [
  { Icon: Coffee, label: "Coffee shops" },
  { Icon: Scissors, label: "Coiffeurs" },
  { Icon: Utensils, label: "Restaurants" },
  { Icon: ShoppingBag, label: "Boutiques" },
  { Icon: Cpu, label: "High-tech" },
  { Icon: Car, label: "Lavage auto" },
  { Icon: Dumbbell, label: "Fitness" },
  { Icon: Flower2, label: "Beauté" },
];

const DURATION = 22; // secondes pour un tour complet

function OrbitIcon({ item, index, total }: { item: { Icon: LucideIcon; label: string }; index: number; total: number }) {
  const angle = (index / total) * Math.PI * 2;
  const radius = 220;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const Icon = item.Icon;

  return (
    <div style={{ position: "absolute", transform: `translate(${x}px, ${y}px)` }}>
      {/* contre-rotation pour garder les icônes droites */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: DURATION, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-[82px] h-[82px] rounded-2xl flex flex-col items-center justify-center gap-1"
          style={{
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 18px 40px -18px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.8)",
          }}
        >
          <Icon size={22} color="#2c7be5" strokeWidth={2} />
          <span className="text-[9px] font-semibold text-[#0f2044] text-center px-1 leading-tight">
            {item.label}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function ScrollBusinesses() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      data-testid="scroll-all-business"
      className="relative overflow-hidden"
      style={{
        background: "#0b1220",
      }}
    >
      <div className="flex items-center py-20 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 w-full text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/8 text-[#4a9eff] text-[11px] font-semibold tracking-[0.18em] uppercase border border-white/10">
            Chapitre 04 · Tous types de commerces
          </span>
          <h2
            className="mt-6 font-display text-white mx-auto"
            style={{
              fontSize: "clamp(2.3rem, 5vw, 4.4rem)",
              lineHeight: 1.02,
              letterSpacing: "0.06em",
              fontWeight: 600,
              maxWidth: "20ch",
            }}
          >
            QARTA s&apos;adapte à{" "}
            <span className="text-[#4a9eff]">tous</span> les commerces.
          </h2>
          <p className="mt-6 text-white/70 text-[17px] max-w-xl mx-auto leading-relaxed">
            Du coffee shop à l&apos;atelier de lavage auto, du coiffeur au boucher — chaque commerce
            local trouve sa place dans l&apos;univers QARTA.
          </p>

          <div className="relative mx-auto mt-14 w-full" style={{ height: 480 }}>
            {/* orbit rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="rounded-full border border-white/10" style={{ width: 380, height: 380 }} />
              <div className="absolute rounded-full border border-white/8" style={{ width: 520, height: 520 }} />
              <div className="absolute rounded-full border border-white/5" style={{ width: 660, height: 660 }} />
            </div>

            {/* center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div
                  className="w-36 h-36 rounded-3xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 20px 60px -10px rgba(74,158,255,.35)",
                  }}
                >
                  <QartaLogo size={92} variant="badge" />
                </div>
                <div className="absolute -inset-6 rounded-[40px] bg-[#4a9eff]/20 blur-2xl -z-10 animate-pulse-glow" />
              </motion.div>
            </div>

            {/* rotating icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: DURATION, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {ORBIT.map((item, i) => (
                <OrbitIcon
                  key={item.label}
                  item={item}
                  index={i}
                  total={ORBIT.length}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
