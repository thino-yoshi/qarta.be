"use client";
import React, { useState, Component, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { QartaLogo, QartaWordmark } from "../components/QartaLogo";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
const HeroGradient = dynamic(() => import("../components/HeroGradient"), { ssr: false });

class GradientErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  componentDidCatch() { this.setState({ crashed: true }); }
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) return null;
    return this.props.children;
  }
}

export default function LoginForm({ content }: { content?: Record<string, unknown> }) {
  const c = content ?? {};
  const title               = (c.title               as string) ?? "Bon retour parmi nous";
  const subtitle            = (c.subtitle             as string) ?? "Espace commerçant";
  const emailPlaceholder    = (c.emailPlaceholder     as string) ?? "Adresse e-mail";
  const passwordPlaceholder = (c.passwordPlaceholder  as string) ?? "Mot de passe";
  const submitLabel         = (c.submitLabel          as string) ?? "Se connecter";
  const forgotLabel         = (c.forgotLabel          as string) ?? "Mot de passe oublié ?";
  const registerPrompt      = (c.registerPrompt       as string) ?? "Créer un espace commerçant";

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : "Une erreur est survenue. Réessayez."
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <>
      {/* Gradient fixe derrière tout */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -10, background: "#000511" }}>
        <GradientErrorBoundary>
          <HeroGradient />
        </GradientErrorBoundary>
      </div>

    <div className="min-h-screen flex flex-col overflow-x-hidden">

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-7">
        <Link href="/" className="flex items-center gap-3 group">
          <QartaLogo size={38} variant="badge" />
          <QartaWordmark color="#ffffff" />
        </Link>
        <Link
          href="/register"
          className="text-[13px] text-white/60 hover:text-white transition-colors font-medium"
        >
          Pas encore de compte ?{" "}
          <span className="text-[#4a9eff] font-semibold">{registerPrompt}</span>
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-[1300px] rounded-3xl p-16 sm:p-20"
          style={{
            background: "#0d1b3e",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
            minHeight: "850px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="max-w-lg mx-auto">
            {/* Header card */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-7"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.4)" }}
              >
                <QartaLogo size={64} variant="badge" showTiles={false} />
              </div>
              <h1
                className="text-[38px] font-bold leading-tight"
                style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em", color: "#FBF7F2" }}
              >
                {title}
              </h1>
              <p className="text-[17px] mt-2" style={{ color: "#4a9eff" }}>
                {subtitle}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 px-5 py-4 rounded-2xl mb-6 text-[15px]"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                <AlertCircle size={17} strokeWidth={2} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Email */}
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail size={20} color="#6b7280" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  placeholder={emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 rounded-2xl text-[17px] outline-none transition-all"
                  style={{ background: "#FBF7F2", border: "1px solid rgba(255,255,255,0.1)", color: "#1a1a2e" }}
                  onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(44,123,229,0.6)"; e.currentTarget.style.background = "#f0ecff"; }}
                  onBlur={(e)  => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "#FBF7F2"; }}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock size={20} color="#6b7280" strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-5 rounded-2xl text-[17px] outline-none transition-all"
                  style={{ background: "#FBF7F2", border: "1px solid rgba(255,255,255,0.1)", color: "#1a1a2e" }}
                  onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(44,123,229,0.6)"; e.currentTarget.style.background = "#f0ecff"; }}
                  onBlur={(e)  => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "#FBF7F2"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#6b7280" }}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                </button>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end pt-1">
                <Link href="/forgot-password" className="text-[15px] transition-colors" style={{ color: "#4a9eff" }}>
                  {forgotLabel}
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-5 rounded-2xl font-semibold text-[18px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "#FBF7F2", color: "#0d1b3e", boxShadow: "0 12px 30px -10px rgba(0,0,0,0.3)" }}
              >
                {loading ? (
                  <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#0d1b3e" strokeWidth="3"/>
                    <path className="opacity-75" fill="#0d1b3e" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                ) : (
                  <>{submitLabel} <ArrowRight size={20} strokeWidth={2.2} /></>
                )}
              </button>
            </form>

            {/* Footer card */}
            <p className="text-center text-[15px] mt-8" style={{ color: "#4a9eff" }}>
              Pas encore de compte ?{" "}
              <Link href="/register" className="font-semibold transition-colors" style={{ color: "#FBF7F2" }}>
                {registerPrompt}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 text-center pb-6">
        <p className="text-[12px] text-white/20">© {new Date().getFullYear()} QARTA · Tous droits réservés</p>
      </div>
    </div>
    </>
  );
}
