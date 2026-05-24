import Link from "next/link";

export const metadata = {
  title: "Démo — Qarta",
  description: "La démo interactive de Qarta arrive bientôt.",
};

export default function DemoPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: "linear-gradient(135deg, #0b1220 0%, #0f2044 60%, #1a2a5e 100%)",
        fontFamily: "Manrope, sans-serif",
        color: "#fff",
      }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,158,255,0.6), transparent 65%)" }}
      />

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-widest mb-8"
        style={{
          background: "rgba(74,158,255,0.12)",
          border: "1px solid rgba(74,158,255,0.3)",
          color: "#4a9eff",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff] animate-pulse" />
        Bientôt disponible
      </div>

      {/* Titre */}
      <h1
        className="text-[2.8rem] font-black leading-tight mb-4"
        style={{ letterSpacing: "-0.03em", maxWidth: 560 }}
      >
        La démo arrive<br />
        <span style={{
          background: "linear-gradient(90deg, #4a9eff, #74d3ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          très bientôt
        </span>
      </h1>

      {/* Sous-titre */}
      <p
        className="text-[16px] leading-relaxed mb-10"
        style={{ color: "rgba(255,255,255,0.5)", maxWidth: 420 }}
      >
        Nous préparons une démonstration interactive de Qarta.
        Revenez nous voir fin juin&nbsp;— début juillet&nbsp;2026.
      </p>

      {/* Bouton retour */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-semibold transition-all hover:scale-105 active:scale-100"
        style={{
          background: "#fff",
          color: "#0f2044",
          boxShadow: "0 12px 36px -10px rgba(74,158,255,0.4)",
        }}
      >
        ← Retour à l&apos;accueil
      </Link>
    </div>
  );
}
