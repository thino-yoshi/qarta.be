"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { QartaLogo, QartaWordmark } from "../components/QartaLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/send-reset-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (res.ok) {
      setSent(true);
    } else {
      setError("Une erreur est survenue. Réessayez.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000511" }}>
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-7">
        <Link href="/" className="flex items-center gap-3">
          <QartaLogo size={38} variant="badge" />
          <QartaWordmark color="#ffffff" />
        </Link>
        <Link href="/login" className="flex items-center gap-2 text-[13px] text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Retour à la connexion
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md rounded-3xl p-10"
          style={{
            background: "#0d1b3e",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
          }}
        >
          {sent ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle size={56} color="#4a9eff" strokeWidth={1.5} />
              </div>
              <h1 className="text-[28px] font-bold text-[#FBF7F2] mb-3" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}>
                Email envoyé !
              </h1>
              <p className="text-[15px] text-white/50 leading-relaxed mb-8">
                Si un compte existe pour <strong className="text-white/80">{email}</strong>, vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              <Link
                href="/login"
                className="block w-full py-4 rounded-2xl font-semibold text-[16px] text-center transition-all"
                style={{ background: "#FBF7F2", color: "#0d1b3e" }}
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-[28px] font-bold text-[#FBF7F2] mb-2" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}>
                  Mot de passe oublié ?
                </h1>
                <p className="text-[15px] text-white/50 leading-relaxed">
                  Entrez votre email, on vous envoie un lien.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-[14px]"
                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail size={20} color="#6b7280" strokeWidth={2} />
                  </div>
                  <input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-14 pr-5 py-5 rounded-2xl text-[16px] outline-none transition-all"
                    style={{ background: "#FBF7F2", border: "1px solid rgba(255,255,255,0.1)", color: "#1a1a2e" }}
                    onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(44,123,229,0.6)"; e.currentTarget.style.background = "#f0ecff"; }}
                    onBlur={(e)  => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "#FBF7F2"; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-5 rounded-2xl font-semibold text-[17px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{ background: "#FBF7F2", color: "#0d1b3e" }}
                >
                  {loading ? (
                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#0d1b3e" strokeWidth="3"/>
                      <path className="opacity-75" fill="#0d1b3e" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                  ) : "Envoyer le lien"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="text-center pb-6">
        <p className="text-[12px] text-white/20">© 2026 QARTA · Tous droits réservés</p>
      </div>
    </div>
  );
}
