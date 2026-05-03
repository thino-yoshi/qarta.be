"use client";
import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import WaveBackground from "./WaveBackground";
import QartaPhoneLogin from "./QartaPhoneLogin";
import { QartaWordmark } from "./QartaLogo";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const subOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 80, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 14 });

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mx.set(x);
      my.set(y);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - rect.left - 300}px, ${e.clientY - rect.top - 300}px, 0)`;
      }
    };
    el.addEventListener("mousemove", handle);
    return () => el.removeEventListener("mousemove", handle);
  }, [mx, my]);

  return (
    <section
      id="hero"
      ref={heroRef}
      data-testid="hero-section"
      className="relative w-full overflow-hidden"
      style={{ height: "110vh" }}
    >
      <WaveBackground intensity={1} />

      <div ref={cursorRef} className="q-cursor-glow" />

      <div
        className="absolute inset-x-0 bottom-0 h-[30vh] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 60%, #ffffff 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 h-full flex flex-col items-center justify-center pt-24">
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="text-center flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-crystal mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff] animate-pulse-glow"></span>
            <span className="text-[12px] font-medium tracking-widest uppercase text-[#0f2044]/80">
              Fidélité digitale · Nouvelle génération
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-light text-white text-center"
            style={{
              fontSize: "clamp(4.5rem, 16vw, 16rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              textShadow: "0 4px 40px rgba(15, 32, 68, 0.25)",
            }}
            data-testid="hero-title"
          >
            QARTA
          </motion.h1>

          <motion.p
            style={{ opacity: subOpacity }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-6 max-w-2xl text-white/90 text-[17px] md:text-[19px] leading-relaxed text-center"
            data-testid="hero-subtitle"
          >
            Toutes vos cartes de fidélité{" "}
            <span className="font-serif-accent text-[#cfe3ff]">réunies</span> dans une seule application.{" "}
            <span className="block mt-1 text-white/70 text-[15px] md:text-[16px]">
              Simple. Digital. Écologique.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ opacity: subOpacity }}
          >
            <a
              href="#merchant"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector<HTMLElement>('[data-testid="scroll-merchant"]')?.scrollIntoView({ behavior: "smooth" });
              }}
              className="q-btn-primary"
              data-testid="hero-cta-merchant"
            >
              Lancer ma fidélité
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </a>
            <a
              href="#client"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector<HTMLElement>('[data-testid="scroll-client"]')?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-3.5 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors backdrop-blur-md"
              data-testid="hero-cta-client"
            >
              Voir côté client
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Défiler</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Floating phone */}
        <motion.div
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 320, opacity: 1 }}
          transition={{ duration: 1.4, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 1400 }}
          className="absolute left-1/2 bottom-[-260px] -translate-x-1/2 animate-float"
          data-testid="hero-floating-phone"
        >
          <div className="q-phone-shell">
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
