"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import QartaPhoneLogin from "./QartaPhoneLogin";

interface Props {
  content?: Record<string, unknown>;
}

export default function ScrollImmersion({ content }: Props) {
  const c = content ?? {};
  const badge    = (c.badge    as string) ?? "Chapitre 01 · Immersion";
  const title    = (c.title    as string) ?? "Entrez dans";
  const accent   = (c.accent   as string) ?? "l'univers";
  const suffix   = (c.suffix   as string) ?? "QARTA.";
  const subtitle = (c.subtitle as string) ?? "Un univers pensé pour faire disparaître les cartes en papier et créer, d'un seul geste, un lien durable entre les clients et les commerçants.";
  const features = (c.features as string[]) ?? ["Intuitif", "Pratique", "Rapide"];

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0.1, 0.55], [0.85, 1.08]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const y = useTransform(scrollYProgress, [0, 0.45, 1], [280, 0, 50]);
  const x = useTransform(scrollYProgress, [0, 0.45], [-700, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.7], [0, 1, 0.35]);
  const textY = useTransform(scrollYProgress, [0.1, 0.5], [40, -20]);

  return (
    <section
      ref={ref}
      data-testid="scroll-immersion"
      className="relative overflow-hidden"
      style={{ background: "#faf8f4" }}
    >
      {/* decorative blobs */}
      <div
        className="absolute top-1/3 left-[-8%] w-[40vw] h-[40vw] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(74,158,255,0.4), transparent 60%)" }}
      />
      <div
        className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(44,123,229,0.35), transparent 60%)" }}
      />
      {/* bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[35vh] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #faf8f4)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-[8rem] pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="order-2 lg:order-1">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaf2fd] text-[#2c7be5] text-[11px] font-semibold tracking-[0.18em] uppercase">
            {badge}
          </span>
          <h2
            className="mt-6 font-display text-[#0f2044]"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
              lineHeight: 1.05,
              letterSpacing: "0.06em",
              fontWeight: 600,
            }}
          >
            {title}{" "}
            <span className="text-[#2c7be5]">{accent}</span>{" "}
            {suffix}
          </h2>
          <p className="mt-6 text-[#47526a] text-[17px] leading-relaxed max-w-lg">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {features.map((t, i) => (
              <div
                key={t}
                className="px-4 py-2 rounded-full bg-white border border-[#eaf0fb] text-[#0f2044] text-[13px] font-medium"
                style={{ boxShadow: "0 6px 16px -10px rgba(15,32,68,.18)" }}
              >
                <span className="text-[#2c7be5] font-semibold mr-1.5">0{i + 1}</span>
                {t}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ scale, rotate, y, x }}
          className="order-1 lg:order-2 flex justify-center"
          data-testid="immersion-phone"
        >
          <div className="q-phone-shell animate-float" style={{ animationDuration: "7s" }}>
            <div className="q-phone-screen">
              <div className="q-phone-notch" />
              <QartaPhoneLogin role="client" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
