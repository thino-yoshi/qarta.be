"use client";
import React, { useState } from "react";
import { QartaLogo, QartaWordmark } from "./QartaLogo";

export default function Footer({ content }: { content?: Record<string, unknown> }) {
  const c = content ?? {};
  const description     = (c.description     as string) ?? "QARTA réunit vos cartes de fidélité et aide les commerces locaux à tisser un lien durable avec leurs clients.";
  const contactTitle    = (c.contactTitle    as string) ?? "Gardons le contact";
  const contactSubtitle = (c.contactSubtitle as string) ?? "Questions, partenariats, démo — écrivez-nous.";
  const productLinks    = (c.productLinks    as { label: string; href: string }[]) ?? [
    { label: "Client",     href: "#client" },
    { label: "Commerçant", href: "#merchant" },
    { label: "Abonnement", href: "#pricing" },
  ];
  const companyLinks    = (c.companyLinks    as { label: string; href: string }[]) ?? [
    { label: "À propos",         href: "#" },
    { label: "Mentions légales", href: "#" },
    { label: "Confidentialité",  href: "#" },
  ];
  const copyrightText   = (c.copyrightText   as string) ?? "Fait avec ♥ pour le commerce local";
  const socialInstagram = (c.socialInstagram as string) ?? "";
  const socialFacebook  = (c.socialFacebook  as string) ?? "";
  const socialTiktok    = (c.socialTiktok    as string) ?? "";
  const socialLinkedin  = (c.socialLinkedin  as string) ?? "";
  const socials = [
    { href: socialInstagram, label: "Instagram", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
    { href: socialFacebook,  label: "Facebook",  svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
    { href: socialTiktok,    label: "TikTok",    svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.77a8.18 8.18 0 0 0 4.78 1.52V6.84a4.85 4.85 0 0 1-1.01-.15z"/></svg> },
    { href: socialLinkedin,  label: "LinkedIn",  svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
  ].filter(s => s.href);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer
      data-testid="footer-section"
      className="relative overflow-hidden"
      style={{ background: "#0b1220" }}
    >
      <div
        className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(74,158,255,0.4), transparent 60%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-12 grid lg:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center gap-3 mx-auto w-fit">
            <QartaLogo size={52} variant="badge" />
            <QartaWordmark color="#fff" />
          </div>
          <p className="mt-6 text-white/70 text-[15px] leading-relaxed max-w-md">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-[12px] text-white/50">
            <span>© {new Date().getFullYear()} QARTA</span>
            <span>·</span>
            <span>{copyrightText}</span>
          </div>
          {socials.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 gap-6 max-w-md">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Produit</div>
              <ul className="mt-3 space-y-2 text-[14px] text-white/75">
                {productLinks.map(l => (
                  <li key={l.href + l.label}><a href={l.href} className="hover:text-white transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Société</div>
              <ul className="mt-3 space-y-2 text-[14px] text-white/75">
                {companyLinks.map(l => (
                  <li key={l.href + l.label}><a href={l.href} className="hover:text-white transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div id="contact">
          <h3
            className="font-display text-white text-[26px] font-bold"
            style={{ letterSpacing: "-0.02em" }}
          >
            {contactTitle}
          </h3>
          <p className="text-white/60 text-[14px] mt-2">
            {contactSubtitle}
          </p>

          {status === "sent" ? (
            <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-[#4a9eff] text-[28px] mb-2">✓</div>
              <p className="text-white font-semibold">Message reçu !</p>
              <p className="text-white/50 text-[13px] mt-1">On revient vers vous très vite.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-[#4a9eff] text-[13px] underline"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Votre nom"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/35 focus:outline-none focus:border-[#4a9eff] transition-colors"
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/35 focus:outline-none focus:border-[#4a9eff] transition-colors"
                />
              </div>
              <textarea
                required
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Votre message"
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/35 focus:outline-none focus:border-[#4a9eff] transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="q-btn-primary w-full justify-center disabled:opacity-60"
              >
                {status === "sending" ? "Envoi…" : "Envoyer"}
              </button>
              {status === "error" && (
                <p className="text-center text-[13px] text-red-400 mt-2">
                  Une erreur est survenue. Réessayez ou écrivez-nous directement à qarta.contact@gmail.com
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </footer>
  );
}
