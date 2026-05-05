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
          <span className="text-[#4a9eff] font-semibold">Créer un espace commerçant</span>
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
              Espace commerçant
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

          {/* Footer card */}
          <p className="text-center text-[13px] text-white/35 mt-6">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-[#4a9eff] font-semibold hover:text-white transition-colors">
              Créer un espace commerçant
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
