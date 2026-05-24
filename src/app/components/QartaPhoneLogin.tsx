"use client";
import React from "react";
import Image from "next/image";
import { QartaWordmark } from "./QartaLogo";

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
          <Image src="/logo-qarta.png" width={72} height={72} alt="Qarta" style={{ borderRadius: 16 }} />
        </div>
        <div className="mt-4">
          <QartaWordmark color="#ffffff" />
        </div>

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
          <div className="py-2.5 rounded-xl border border-white/12 bg-white/5 flex items-center justify-center gap-1.5 text-[11px] text-white/80 font-medium">
            {/* Apple logo officiel */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.459 2.208 3.09 3.792 3.029 1.52-.065 2.09-.987 3.925-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
            </svg>
            Apple
          </div>
          <div className="py-2.5 rounded-xl border border-white/12 bg-white/5 flex items-center justify-center gap-1.5 text-[11px] text-white/80 font-medium">
            {/* Google logo */}
            <svg width="13" height="13" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
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
