"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QartaLogo, QartaWordmark } from "../components/QartaLogo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 8) { setError("Le mot de passe doit faire au moins 8 caractères."); return; }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError("Lien expiré ou invalide. Recommencez depuis la page de connexion.");
    } else {
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000511" }}>
      <div className="relative z-10 flex items-center px-8 pt-7">
        <Link href="/" className="flex items-center gap-3">
          <QartaLogo size={38} variant="badge" />
          <QartaWordmark color="#ffffff" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md rounded-3xl p-10"
          style={{
            background: "#0d1b3e",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
          }}
        >
          {done ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle size={56} color="#4a9eff" strokeWidth={1.5} />
              </div>
              <h1 className="text-[26px] font-bold text-[#FBF7F2] mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>
                Mot de passe mis à jour !
              </h1>
              <p className="text-[14px] text-white/50">Redirection vers votre dashboard…</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-[26px] font-bold text-[#FBF7F2] mb-2" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}>
                  Nouveau mot de passe
                </h1>
                <p className="text-[14px] text-white/50">Choisissez un mot de passe d&apos;au moins 8 caractères.</p>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl mb-5 text-[14px]"
                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "pwd", placeholder: "Nouveau mot de passe", value: password, set: setPassword },
                  { id: "cfm", placeholder: "Confirmer le mot de passe", value: confirm, set: setConfirm },
                ].map(({ id, placeholder, value, set }) => (
                  <div key={id} className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock size={20} color="#6b7280" strokeWidth={2} />
                    </div>
                    <input
                      type={showPwd ? "text" : "password"}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      required
                      className="w-full pl-14 pr-14 py-5 rounded-2xl text-[16px] outline-none transition-all"
                      style={{ background: "#FBF7F2", border: "1px solid rgba(255,255,255,0.1)", color: "#1a1a2e" }}
                      onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(44,123,229,0.6)"; e.currentTarget.style.background = "#f0ecff"; }}
                      onBlur={(e)  => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "#FBF7F2"; }}
                    />
                    {id === "pwd" && (
                      <button type="button" onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-5 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }}>
                        {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl font-semibold text-[17px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{ background: "#FBF7F2", color: "#0d1b3e" }}
                >
                  {loading ? (
                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#0d1b3e" strokeWidth="3"/>
                      <path className="opacity-75" fill="#0d1b3e" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                  ) : "Enregistrer le mot de passe"}
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
