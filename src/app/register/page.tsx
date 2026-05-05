"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Building2, User, Mail, Lock, Phone, MapPin, Globe, Hash, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { QartaLogo, QartaWordmark } from "../components/QartaLogo";
import { createClient } from "@/lib/supabase/client";

/* ─── Types de commerce ─── */
const BUSINESS_TYPES = [
  "Coffee shop / Café",
  "Restaurant / Brasserie",
  "Boulangerie / Pâtisserie",
  "Boucherie / Épicerie",
  "Coiffeur / Barbier",
  "Institut de beauté / Spa",
  "Pharmacie / Parapharmacie",
  "Librairie / Papeterie",
  "Boutique de mode",
  "Sport & Fitness",
  "Lavage auto / Garage",
  "Fleuriste",
  "Électronique / High-tech",
  "Pizzeria / Fast-food",
  "Cave à vins / Épicerie fine",
  "Animalerie",
  "Services à domicile",
  "Autre",
];

const NUM_LOCATIONS = ["1 établissement", "2 à 5 établissements", "5+ établissements"];

/* ─── Styles communs ─── */
const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
};
const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.border = "1px solid rgba(74,158,255,0.5)";
  e.currentTarget.style.background = "rgba(74,158,255,0.06)";
};
const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
};

function Field({
  label, icon: Icon, children,
}: { label: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] text-white/50 font-medium mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Icon size={15} color="rgba(255,255,255,0.3)" strokeWidth={2} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ─── Composant principal ─── */
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  /* ─── Form data ─── */
  const [form, setForm] = useState({
    // Étape 1
    business_name: "",
    category: "",
    address: "",
    postal_code: "",
    city: "",
    country: "Belgique",
    website: "",
    // Étape 2
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    siret: "",
    num_locations: "1 établissement",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  /* ─── Cooldown renvoi ─── */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  /* ─── Validation étape 1 ─── */
  const validateStep1 = () => {
    if (!form.business_name.trim()) return "Le nom du commerce est requis.";
    if (!form.category) return "Sélectionnez un type de commerce.";
    if (!form.address.trim()) return "L'adresse est requise.";
    if (!form.postal_code.trim()) return "Le code postal est requis.";
    if (!form.city.trim()) return "La ville est requise.";
    return null;
  };

  /* ─── Validation étape 2 ─── */
  const validateStep2 = () => {
    if (!form.first_name.trim()) return "Le prénom est requis.";
    if (!form.last_name.trim()) return "Le nom est requis.";
    if (!form.phone.trim()) return "Le téléphone est requis.";
    if (!form.email.includes("@")) return "Email invalide.";
    if (form.password.length < 8) return "Le mot de passe doit faire au moins 8 caractères.";
    if (form.password !== form.confirm_password) return "Les mots de passe ne correspondent pas.";
    return null;
  };

  /* ─── Submit étape 1 ─── */
  const handleStep1 = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError(null);
    setStep(2);
  };

  /* ─── Submit étape 2 → envoyer le code ─── */
  const handleStep2 = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          business_name: form.business_name,
          category: form.category,
          address: form.address,
          postal_code: form.postal_code,
          city: form.city,
          country: form.country,
          website: form.website,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          siret: form.siret,
          num_locations: form.num_locations,
          role: "merchant",
        },
      },
    });

    if (signUpError) {
      setError(
        signUpError.message.includes("already registered")
          ? "Cet email est déjà utilisé. Connectez-vous."
          : "Erreur lors de la création du compte. Réessayez."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    setResendCooldown(60);
    setStep(3);
  };

  /* ─── Submit étape 3 → vérifier le code ─── */
  const handleVerify = async () => {
    const token = otp.join("");
    if (token.length < 6) { setError("Entrez le code à 6 chiffres."); return; }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: form.email,
      token,
      type: "signup",
    });

    if (verifyError || !data.user) {
      setError("Code incorrect ou expiré. Demandez un nouveau code.");
      setLoading(false);
      return;
    }

    /* ── Insérer dans merchants ── */
    await supabase.from("merchants").upsert({
      id: data.user.id,
      business_name: form.business_name,
      category: form.category,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      address: form.address,
      postal_code: form.postal_code,
      city: form.city,
      country: form.country,
      website: form.website || null,
      siret: form.siret || null,
      num_locations: form.num_locations,
      subscription_status: "pending",
    });

    /* ── Insérer dans users ── */
    await supabase.from("users").upsert({
      id: data.user.id,
      email: form.email,
      name: `${form.first_name} ${form.last_name}`,
      user_type: "merchant",
    });

    router.push("/dashboard");
    router.refresh();
  };

  /* ─── Renvoi du code ─── */
  const resendCode = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resend({ type: "signup", email: form.email });
    setResendCooldown(60);
    setLoading(false);
  };

  /* ─── OTP input handler ─── */
  const handleOtp = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    text.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    otpRefs.current[Math.min(text.length, 5)]?.focus();
  };

  /* ─── UI helper ─── */
  const inputClass = (hasIcon = true) =>
    `w-full ${hasIcon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-2xl text-[14px] text-white placeholder-white/25 outline-none transition-all`;

  /* ═══════════════════════════════════════ RENDER ═══════════════════════════════════════ */
  return (
    <div className="fixed inset-0 flex flex-col overflow-y-auto" style={{ background: "#0b1220" }}>
      {/* Glows */}
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full opacity-35 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,158,255,0.45), transparent 65%)" }} />
      <div className="absolute bottom-0 -left-40 w-[450px] h-[450px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(44,123,229,0.5), transparent 65%)" }} />
      <div className="absolute inset-0 opacity-15 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(74,158,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(74,158,255,0.07) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-7">
        <Link href="/" className="flex items-center gap-3">
          <QartaLogo size={38} variant="badge" />
          <QartaWordmark color="#ffffff" />
        </Link>
        <Link href="/login" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">
          Déjà un compte ?{" "}
          <span className="text-[#4a9eff] font-semibold">Se connecter</span>
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl p-8 sm:p-10"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(24px)", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)" }}>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all"
                    style={{
                      background: step > s ? "#27ae60" : step === s ? "linear-gradient(135deg,#2c7be5,#4a9eff)" : "rgba(255,255,255,0.08)",
                      color: step >= s ? "#fff" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {step > s ? <CheckCircle size={14} strokeWidth={2.5} /> : s}
                  </div>
                  <span className={`text-[12px] font-medium hidden sm:block ${step === s ? "text-white" : "text-white/30"}`}>
                    {s === 1 ? "Commerce" : s === 2 ? "Compte" : "Vérification"}
                  </span>
                </div>
                {s < 3 && <div className="flex-1 h-px" style={{ background: step > s ? "rgba(44,123,229,0.5)" : "rgba(255,255,255,0.08)" }} />}
              </React.Fragment>
            ))}
          </div>

          {/* ── ÉTAPE 1 ── */}
          {step === 1 && (
            <div>
              <h1 className="text-white text-[22px] font-bold mb-1" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}>
                Votre commerce
              </h1>
              <p className="text-white/40 text-[13px] mb-6">Informations sur votre établissement</p>

              {error && <ErrorBox msg={error} />}

              <div className="space-y-4">
                <Field label="Nom du commerce *" icon={Building2}>
                  <input type="text" placeholder="Ex : Café du Coin" value={form.business_name}
                    onChange={(e) => set("business_name", e.target.value)}
                    className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                </Field>

                <Field label="Type de commerce *" icon={Hash}>
                  <select value={form.category} onChange={(e) => set("category", e.target.value)}
                    className={`${inputClass()} appearance-none cursor-pointer`}
                    style={{ ...inputBase, color: form.category ? "#fff" : "rgba(255,255,255,0.25)" }}
                    onFocus={inputFocus} onBlur={inputBlur}>
                    <option value="" disabled style={{ background: "#0f2044" }}>Sélectionner...</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t} style={{ background: "#0f2044", color: "#fff" }}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Adresse *" icon={MapPin}>
                  <input type="text" placeholder="Rue et numéro" value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Code postal *">
                    <input type="text" placeholder="1000" value={form.postal_code}
                      onChange={(e) => set("postal_code", e.target.value)}
                      className={inputClass(false)} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  </Field>
                  <Field label="Ville *">
                    <input type="text" placeholder="Bruxelles" value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      className={inputClass(false)} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  </Field>
                </div>

                <Field label="Pays">
                  <input type="text" placeholder="Belgique" value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    className={inputClass(false)} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                </Field>

                <Field label="Site web (optionnel)" icon={Globe}>
                  <input type="url" placeholder="https://..." value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                </Field>
              </div>

              <button onClick={handleStep1}
                className="w-full mt-7 py-3.5 rounded-2xl font-semibold text-white text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#2c7be5,#4a9eff)", boxShadow: "0 12px 30px -10px rgba(44,123,229,0.6), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                Continuer <ArrowRight size={16} strokeWidth={2.2} />
              </button>
            </div>
          )}

          {/* ── ÉTAPE 2 ── */}
          {step === 2 && (
            <div>
              <h1 className="text-white text-[22px] font-bold mb-1" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}>
                Votre compte
              </h1>
              <p className="text-white/40 text-[13px] mb-6">Informations personnelles et accès</p>

              {error && <ErrorBox msg={error} />}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Prénom *" icon={User}>
                    <input type="text" placeholder="Jean" value={form.first_name}
                      onChange={(e) => set("first_name", e.target.value)}
                      className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  </Field>
                  <Field label="Nom *" icon={User}>
                    <input type="text" placeholder="Dupont" value={form.last_name}
                      onChange={(e) => set("last_name", e.target.value)}
                      className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  </Field>
                </div>

                <Field label="Téléphone *" icon={Phone}>
                  <input type="tel" placeholder="+32 470 00 00 00" value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                </Field>

                <Field label="Email *" icon={Mail}>
                  <input type="email" placeholder="jean@votrecommerce.be" value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                </Field>

                <Field label="Mot de passe *" icon={Lock}>
                  <input type={showPassword ? "text" : "password"} placeholder="Minimum 8 caractères" value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={`${inputClass()} pr-11`} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </Field>

                <Field label="Confirmer le mot de passe *" icon={Lock}>
                  <input type={showConfirm ? "text" : "password"} placeholder="Répétez le mot de passe" value={form.confirm_password}
                    onChange={(e) => set("confirm_password", e.target.value)}
                    className={`${inputClass()} pr-11`} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </Field>

                <Field label="Nombre d'établissements *">
                  <div className="flex gap-2 flex-wrap">
                    {NUM_LOCATIONS.map((n) => (
                      <button key={n} type="button" onClick={() => set("num_locations", n)}
                        className="flex-1 min-w-[100px] py-2.5 rounded-xl text-[12px] font-semibold transition-all"
                        style={{
                          background: form.num_locations === n ? "rgba(44,123,229,0.25)" : "rgba(255,255,255,0.05)",
                          border: form.num_locations === n ? "1px solid rgba(44,123,229,0.6)" : "1px solid rgba(255,255,255,0.10)",
                          color: form.num_locations === n ? "#4a9eff" : "rgba(255,255,255,0.5)",
                        }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="SIRET (optionnel)" icon={Hash}>
                  <input type="text" placeholder="123 456 789 00010" value={form.siret}
                    onChange={(e) => set("siret", e.target.value)}
                    className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                </Field>
              </div>

              <div className="flex gap-3 mt-7">
                <button onClick={() => { setError(null); setStep(1); }}
                  className="py-3.5 px-5 rounded-2xl font-semibold text-white/50 hover:text-white transition-colors flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <ArrowLeft size={16} />
                </button>
                <button onClick={handleStep2} disabled={loading}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-white text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#2c7be5,#4a9eff)", boxShadow: "0 12px 30px -10px rgba(44,123,229,0.6), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                  {loading ? <Spinner /> : <> Créer mon compte <ArrowRight size={16} strokeWidth={2.2} /> </>}
                </button>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 3 ── */}
          {step === 3 && (
            <div className="text-center">
              <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-5"
                style={{ background: "rgba(44,123,229,0.15)", border: "1px solid rgba(44,123,229,0.3)" }}>
                <Mail size={28} color="#4a9eff" strokeWidth={1.8} />
              </div>
              <h1 className="text-white text-[22px] font-bold mb-2" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}>
                Vérifiez votre email
              </h1>
              <p className="text-white/45 text-[14px] mb-1">Code envoyé à</p>
              <p className="text-[#4a9eff] font-semibold text-[14px] mb-8">{form.email}</p>

              {error && <ErrorBox msg={error} />}

              {/* OTP boxes */}
              <div className="flex gap-2.5 justify-center mb-8" onPaste={handleOtpPaste}>
                {otp.map((val, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtp(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    className="w-12 h-14 text-center text-[22px] font-bold text-white rounded-2xl outline-none transition-all"
                    style={{
                      background: val ? "rgba(44,123,229,0.2)" : "rgba(255,255,255,0.06)",
                      border: val ? "1px solid rgba(44,123,229,0.6)" : "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                ))}
              </div>

              <button onClick={handleVerify} disabled={loading || otp.join("").length < 6}
                className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#2c7be5,#4a9eff)", boxShadow: "0 12px 30px -10px rgba(44,123,229,0.6), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                {loading ? <Spinner /> : <> Vérifier et accéder au dashboard <ArrowRight size={16} strokeWidth={2.2} /> </>}
              </button>

              <p className="mt-5 text-[13px] text-white/35">
                Pas reçu le code ?{" "}
                <button onClick={resendCode} disabled={resendCooldown > 0}
                  className="text-[#4a9eff] font-semibold disabled:text-white/25 transition-colors">
                  {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : "Renvoyer"}
                </button>
              </p>

              <button onClick={() => { setStep(2); setError(null); setOtp(["","","","","",""]); }}
                className="mt-3 text-[12px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1 mx-auto">
                <ArrowLeft size={12} /> Modifier mon email
              </button>
            </div>
          )}

          {/* Footer */}
          {step < 3 && (
            <p className="text-center text-[12px] text-white/25 mt-6">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-[#4a9eff] hover:text-white transition-colors font-semibold">
                Se connecter
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 text-center pb-6">
        <p className="text-[12px] text-white/20">© 2026 QARTA · Tous droits réservés</p>
      </div>
    </div>
  );
}

/* ─── Sous-composants ─── */
function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl mb-4 text-[13px] text-red-300"
      style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.2)" }}>
      <AlertCircle size={15} strokeWidth={2} className="flex-shrink-0 mt-0.5" />
      {msg}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
