"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Building2, User, Mail, Lock, Phone, MapPin, Globe, Hash, CheckCircle, AlertCircle, Eye, EyeOff, type LucideIcon } from "lucide-react";
import { QartaLogo, QartaWordmark } from "../components/QartaLogo";
import { createClient } from "@/lib/supabase/client";
import HeroGradient from "../components/HeroGradient";

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
}: { label: string; icon?: LucideIcon; children: React.ReactNode }) {
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
export default function RegisterForm({ content }: { content?: Record<string, unknown> }) {
  const c = content ?? {};
  // ── Étapes ──
  const tab1Label  = (c.tab1Label  as string) ?? "Commerce";
  const tab2Label  = (c.tab2Label  as string) ?? "Compte";
  const tab3Label  = (c.tab3Label  as string) ?? "Vérification";
  // ── Étape 1 ──
  const step1Title = (c.step1Title as string) ?? "Votre commerce";
  const step1Sub   = (c.step1Sub   as string) ?? "Informations sur votre établissement";
  const step1CTA   = (c.step1CTA   as string) ?? "Continuer";
  // ── Étape 2 ──
  const step2Title          = (c.step2Title          as string) ?? "Votre compte";
  const step2Sub            = (c.step2Sub            as string) ?? "Informations personnelles et accès";
  const firstNameLabel      = (c.firstNameLabel      as string) ?? "Prénom";
  const lastNameLabel       = (c.lastNameLabel       as string) ?? "Nom";
  const phoneLabel          = (c.phoneLabel          as string) ?? "Téléphone";
  const emailLabel          = (c.emailLabel          as string) ?? "Email";
  const passwordLabel       = (c.passwordLabel       as string) ?? "Mot de passe";
  const confirmPasswordLabel= (c.confirmPasswordLabel as string) ?? "Confirmer le mot de passe";
  const numLocationsLabel   = (c.numLocationsLabel   as string) ?? "Nombre d'établissements";
  const siretLabel          = (c.siretLabel          as string) ?? "SIRET (optionnel)";
  const step2CTA            = (c.step2CTA            as string) ?? "Créer mon compte";
  // ── Étape 3 ──
  const step3Title     = (c.step3Title     as string) ?? "Vérifiez votre email";
  const step3Sub       = (c.step3Sub       as string) ?? "Code à 8 chiffres envoyé à";
  const step3CTA       = (c.step3CTA       as string) ?? "Vérifier et accéder au dashboard";
  const resendHint     = (c.resendHint     as string) ?? "Pas reçu le code ?";
  const resendLabel    = (c.resendLabel    as string) ?? "Renvoyer";
  const editEmailLabel = (c.editEmailLabel as string) ?? "Modifier mon email";
  // ── Global ──
  const loginPrompt = (c.loginPrompt as string) ?? "Déjà un compte ?";

  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  /* ─── Form data ─── */
  const [form, setForm] = useState({
    business_name: "",
    category: "",
    address: "",
    postal_code: "",
    city: "",
    country: "Belgique",
    website: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    siret: "",
    num_locations: "1 établissement",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  /* ─── Cooldown renvoi ─── */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  /* ─── Validation ─── */
  const validateStep1 = () => {
    if (!form.business_name.trim()) return "Le nom du commerce est requis.";
    if (!form.category) return "Sélectionnez un type de commerce.";
    if (!form.address.trim()) return "L'adresse est requise.";
    if (!form.postal_code.trim()) return "Le code postal est requis.";
    if (!form.city.trim()) return "La ville est requise.";
    return null;
  };

  const validateStep2 = () => {
    if (!form.first_name.trim()) return "Le prénom est requis.";
    if (!form.last_name.trim()) return "Le nom est requis.";
    if (!form.phone.trim()) return "Le téléphone est requis.";
    if (!form.email.includes("@")) return "Email invalide.";
    if (form.password.length < 8) return "Le mot de passe doit faire au moins 8 caractères.";
    if (form.password !== form.confirm_password) return "Les mots de passe ne correspondent pas.";
    return null;
  };

  const handleStep1 = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError(null);
    setStep(2);
  };

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
          : `Erreur: ${signUpError.message}`
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    setResendCooldown(60);
    setStep(3);
  };

  const handleVerify = async () => {
    const token = otp.join("");
    if (token.length < 8) { setError("Entrez le code à 8 chiffres."); return; }
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

    try {
      const res = await fetch("/api/register-merchant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: form.business_name,
          category: form.category,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          address: form.address,
          postal_code: form.postal_code,
          city: form.city,
          country: form.country,
          website: form.website,
          siret: form.siret,
          num_locations: form.num_locations,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(`Erreur lors de l'enregistrement : ${result.error}`);
        setLoading(false);
        return;
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const resendCode = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resend({ type: "signup", email: form.email });
    setResendCooldown(60);
    setLoading(false);
  };

  const handleOtp = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 7) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    const next = [...otp];
    text.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(text.length, 7)]?.focus();
  };

  const inputClass = (hasIcon = true) =>
    `w-full ${hasIcon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-2xl text-[14px] text-white placeholder-white/25 outline-none transition-all`;

  /* ══════════════════════════ RENDER ══════════════════════════ */
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: "#000000" }}>
      {/* Hero gradient background */}
      <HeroGradient />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-7">
        <Link href="/" className="flex items-center gap-3">
          <QartaLogo size={38} variant="badge" />
          <QartaWordmark color="#ffffff" />
        </Link>
        <Link href="/login" className="text-[13px] text-white/50 hover:text-white transition-colors font-medium">
          {loginPrompt}{" "}
          <span className="text-[#4a9eff] font-semibold">Se connecter</span>
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-1 overflow-y-auto">
        <div className="w-full max-w-lg rounded-3xl p-5 sm:p-7"
          style={{ background: "#0b1220", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)" }}>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-2">
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
                    {s === 1 ? tab1Label : s === 2 ? tab2Label : tab3Label}
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
                {step1Title}
              </h1>
              <p className="text-white/40 text-[13px] mb-2">{step1Sub}</p>

              {error && <ErrorBox msg={error} />}

              <div className="space-y-3">
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
                className="w-full mt-4 py-3 rounded-2xl font-semibold text-white text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#2c7be5,#4a9eff)", boxShadow: "0 12px 30px -10px rgba(44,123,229,0.6), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                {step1CTA} <ArrowRight size={16} strokeWidth={2.2} />
              </button>
            </div>
          )}

          {/* ── ÉTAPE 2 ── */}
          {step === 2 && (
            <div>
              <h1 className="text-white text-[22px] font-bold mb-1" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.02em" }}>
                {step2Title}
              </h1>
              <p className="text-white/40 text-[13px] mb-6">{step2Sub}</p>

              {error && <ErrorBox msg={error} />}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label={`${firstNameLabel} *`} icon={User}>
                    <input type="text" placeholder="Jean" value={form.first_name}
                      onChange={(e) => set("first_name", e.target.value)}
                      className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  </Field>
                  <Field label={`${lastNameLabel} *`} icon={User}>
                    <input type="text" placeholder="Dupont" value={form.last_name}
                      onChange={(e) => set("last_name", e.target.value)}
                      className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  </Field>
                </div>

                <Field label={`${phoneLabel} *`} icon={Phone}>
                  <input type="tel" placeholder="+32 470 00 00 00" value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                </Field>

                <Field label={`${emailLabel} *`} icon={Mail}>
                  <input type="email" placeholder="jean@votrecommerce.be" value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputClass()} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                </Field>

                <Field label={`${passwordLabel} *`} icon={Lock}>
                  <input type={showPassword ? "text" : "password"} placeholder="Minimum 8 caractères" value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={`${inputClass()} pr-11`} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </Field>

                <Field label={`${confirmPasswordLabel} *`} icon={Lock}>
                  <input type={showConfirm ? "text" : "password"} placeholder="Répétez le mot de passe" value={form.confirm_password}
                    onChange={(e) => set("confirm_password", e.target.value)}
                    className={`${inputClass()} pr-11`} style={inputBase} onFocus={inputFocus} onBlur={inputBlur} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </Field>

                <Field label={`${numLocationsLabel} *`}>
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

                <Field label={siretLabel} icon={Hash}>
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
                  {loading ? <Spinner /> : <> {step2CTA} <ArrowRight size={16} strokeWidth={2.2} /> </>}
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
                {step3Title}
              </h1>
              <p className="text-white/45 text-[14px] mb-1">{step3Sub}</p>
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

              <button onClick={handleVerify}
                disabled={loading || otp.join("").length < 8}
                className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#2c7be5,#4a9eff)", boxShadow: "0 12px 30px -10px rgba(44,123,229,0.6), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                {loading ? <Spinner /> : <> {step3CTA} <ArrowRight size={16} strokeWidth={2.2} /> </>}
              </button>

              <p className="mt-5 text-[13px] text-white/35">
                {resendHint}{" "}
                <button onClick={resendCode} disabled={resendCooldown > 0}
                  className="text-[#4a9eff] font-semibold disabled:text-white/25 transition-colors">
                  {resendCooldown > 0 ? `${resendLabel} dans ${resendCooldown}s` : resendLabel}
                </button>
              </p>

              <button onClick={() => { setStep(2); setError(null); setOtp(["","","","","","","",""]); }}
                className="mt-3 text-[12px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-1 mx-auto">
                <ArrowLeft size={12} /> {editEmailLabel}
              </button>
            </div>
          )}

          {/* Footer */}
          {step < 3 && (
            <p className="text-center text-[12px] text-white/25 mt-6">
              {loginPrompt}{" "}
              <Link href="/login" className="text-[#4a9eff] hover:text-white transition-colors font-semibold">
                Se connecter
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 text-center pb-6">
        <p className="text-[12px] text-white/20">© {new Date().getFullYear()} QARTA · Tous droits réservés</p>
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
