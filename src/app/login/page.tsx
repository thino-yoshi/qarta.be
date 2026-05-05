"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { QartaLogo, QartaWordmark } from "../components/QartaLogo";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto overflow-x-hidden"
      style={{ background: "#0b1220" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,158,255,0.5), transparent 65%)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(44,123,229,0.5), transparent 65%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(100,120,255,0.6), transparent 60%)" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,158,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(74,158,255,0.08) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

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
          <span className="text-[#4a9eff] font-semibold">S&apos;inscrire</span>
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md rounded-3xl p-8 sm:p-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Header card */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
              style={{ background: "linear-gradient(135deg, #0f2044, #1a3a6e)", border: "1px solid rgba(74,158,255,0.2)", boxShadow: "0 10px 30px -10px rgba(44,123,229,0.4)" }}
            >
              <QartaLogo size={44} variant="badge" showTiles={false} />
            </div>
            <h1
              className="text-white text-[26px] font-bold leading-tight"
              style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}
            >
              Bon retour parmi nous
            </h1>
            <p className="text-white/45 text-[14px] mt-2">
              Connectez-vous à votre espace QARTA
            </p>
          </div>

          {/* Form */}
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Mail size={16} color="rgba(255,255,255,0.35)" strokeWidth={2} />
              </div>
              <input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-[14px] text-white placeholder-white/30 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(74,158,255,0.5)";
                  e.currentTarget.style.background = "rgba(74,158,255,0.06)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock size={16} color="rgba(255,255,255,0.35)" strokeWidth={2} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-[14px] text-white placeholder-white/30 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(74,158,255,0.5)";
                  e.currentTarget.style.background = "rgba(74,158,255,0.06)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
              >
                {showPassword
                  ? <EyeOff size={16} strokeWidth={2} />
                  : <Eye size={16} strokeWidth={2} />
                }
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-[13px] text-[#4a9eff]/80 hover:text-[#4a9eff] transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-1 py-3.5 rounded-2xl font-semibold text-white text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #2c7be5 0%, #4a9eff 100%)",
                boxShadow: "0 12px 30px -10px rgba(44,123,229,0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 16px 36px -10px rgba(44,123,229,0.75), inset 0 1px 0 rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 30px -10px rgba(44,123,229,0.6), inset 0 1px 0 rgba(255,255,255,0.2)";
              }}
            >
              Se connecter
              <ArrowRight size={16} strokeWidth={2.2} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-[11px] text-white/30 uppercase tracking-[0.2em]">ou</span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* SSO buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex items-center justify-center gap-2.5 py-3 rounded-2xl text-[13px] font-semibold text-white/80 hover:text-white transition-all hover:bg-white/8"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
            <button
              className="flex items-center justify-center gap-2.5 py-3 rounded-2xl text-[13px] font-semibold text-white/80 hover:text-white transition-all hover:bg-white/8"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          {/* Footer card */}
          <p className="text-center text-[13px] text-white/35 mt-8">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-[#4a9eff] font-semibold hover:text-white transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 text-center pb-6">
        <p className="text-[12px] text-white/20">© 2026 QARTA · Tous droits réservés</p>
      </div>
    </div>
  );
}
