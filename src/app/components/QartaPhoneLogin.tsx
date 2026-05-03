"use client";
import React from "react";
import { QartaLogo, QartaWordmark } from "./QartaLogo";

interface QartaPhoneLoginProps {
  role?: "client" | "merchant";
}

export default function QartaPhoneLogin({ role = "client" }: QartaPhoneLoginProps) {
  const isMerchant = role === "merchant";
  return (
    <div
      className="w-full h-full login-preview relative"
      data-testid="phone-login-screen"
      style={{
        background: "linear-gradient(180deg, #0b1220 0%, #0f2044 55%, #14285a 100%)",
      }}
    >
      {/* faux iOS status bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-7 pt-6 z-20 text-[11px] font-semibold text-white/90">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-2 rounded-[2px] border border-white/70"></div>
          <span>100%</span>
        </div>
      </div>

      {/* ambient glows */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(74,158,255,0.55), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(44,123,229,0.4), transparent 70%)" }}
      />

      {/* grid bg */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,158,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(74,158,255,0.08) 1px,transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center px-7 pt-20 pb-8">
        <div className="mt-2">
          <QartaLogo size={72} variant="badge" />
        </div>
        <div className="mt-4">
          <QartaWordmark color="#ffffff" />
        </div>
        <p className="text-[11px] text-white/55 tracking-[0.2em] uppercase mt-2">
          {isMerchant ? "Espace commerçant" : "Espace client"}
        </p>

        <h3
          className="text-white text-[22px] font-bold mt-7 text-center leading-tight"
          style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}
        >
          {isMerchant ? "Bienvenue, gérez\nvotre fidélité" : "Bonjour,\nheureux de vous revoir"}
        </h3>

        {/* Inputs */}
        <div className="w-full mt-6 space-y-2.5">
          <div className="bg-white/[0.07] border border-white/12 rounded-2xl px-4 py-3 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-60">
              <path d="M4 6h16v12H4z" stroke="#fff" strokeWidth="1.5" />
              <path d="M4 7l8 6 8-6" stroke="#fff" strokeWidth="1.5" />
            </svg>
            <span className="text-[13px] text-white/50">email@qarta.app</span>
          </div>
          <div className="bg-white/[0.07] border border-white/12 rounded-2xl px-4 py-3 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-60">
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="#fff" strokeWidth="1.5" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#fff" strokeWidth="1.5" />
            </svg>
            <span className="text-[13px] text-white/50">• • • • • • • •</span>
          </div>
        </div>

        <button
          className="w-full mt-5 py-3 rounded-2xl font-semibold text-white text-[14px] relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg,#4a9eff 0%, #2c7be5 100%)",
            boxShadow: "0 10px 26px -8px rgba(44,123,229,.6), inset 0 1px 0 rgba(255,255,255,.25)",
          }}
        >
          Se connecter
        </button>

        <div className="flex items-center gap-3 w-full my-5">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] text-white/35 uppercase tracking-widest">ou</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="py-2.5 rounded-xl border border-white/12 bg-white/5 text-center text-[11px] text-white/80 font-medium">
            🍎 Apple
          </div>
          <div className="py-2.5 rounded-xl border border-white/12 bg-white/5 text-center text-[11px] text-white/80 font-medium">
            G Google
          </div>
        </div>

        <p className="text-white/40 text-[11px] mt-auto">
          Pas encore de compte ?{" "}
          <span className="text-[#4a9eff] font-semibold">Créer un compte</span>
        </p>
      </div>
    </div>
  );
}
