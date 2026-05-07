"use client";
import React, { useState } from "react";
import { QartaLogo, QartaWordmark } from "./QartaLogo";

export default function Footer() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire up to backend when available
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
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

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-12 grid lg:grid-cols-2 gap-16">
        <div>
          <div className="flex items-center gap-3">
            <QartaLogo size={52} variant="badge" />
            <QartaWordmark color="#fff" />
          </div>
          <p className="mt-6 text-white/70 text-[15px] leading-relaxed max-w-md">
            QARTA réunit vos cartes de fidélité et aide les commerces locaux à tisser un lien
            durable avec leurs clients.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-[12px] text-white/50">
            <span>© {new Date().getFullYear()} QARTA</span>
            <span>·</span>
            <span>Fait avec ♥ pour le commerce local</span>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 max-w-md">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Produit</div>
              <ul className="mt-3 space-y-2 text-[14px] text-white/75">
                <li><a href="#client" className="hover:text-white transition-colors">Client</a></li>
                <li><a href="#merchant" className="hover:text-white transition-colors">Commerçant</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Abonnement</a></li>
              </ul>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Société</div>
              <ul className="mt-3 space-y-2 text-[14px] text-white/75">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div id="contact">
          <h3
            className="font-display text-white text-[26px] font-bold"
            style={{ letterSpacing: "-0.02em" }}
          >
            Gardons le contact
          </h3>
          <p className="text-white/60 text-[14px] mt-2">
            Questions, partenariats, démo — écrivez-nous.
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
            </form>
          )}
        </div>
      </div>
    </footer>
  );
}
