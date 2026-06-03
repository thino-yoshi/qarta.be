"use client";
import { useState } from "react";
import { Store, BarChart2, CreditCard, LogOut, ChevronRight, AlertTriangle, Rocket, Lock, CheckCircle, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { QartaWordmark } from "../components/QartaLogo";
import CarteTab from "./tabs/CarteTab";
import StatistiquesTab from "./tabs/StatistiquesTab";
import AbonnementTab from "./tabs/AbonnementTab";

type Tab = "carte" | "statistiques" | "abonnement";

interface Props {
  user: { id: string; email: string };
  merchant: Record<string, unknown>;
  loyaltyCard: Record<string, unknown> | null;
  stripeSuccess?: boolean;
  content?: {
    header?:       Record<string, unknown>;
    cards?:        Record<string, unknown>;
    subscription?: Record<string, unknown>;
    stats?:        Record<string, unknown>;
  };
}

export default function DashboardShell({ user, merchant, loyaltyCard, stripeSuccess, content }: Props) {
  const h = content?.header ?? {};
  const sidebarTitle  = (h.sidebarTitle  as string) ?? "Ma carte";
  const sidebarStats  = (h.sidebarStats  as string) ?? "Statistiques";
  const sidebarSub    = (h.sidebarSub    as string) ?? "Abonnement";
  const cardTabTitle  = (h.cardTabTitle  as string) ?? "Ma carte de fidélité";
  const cardTabSub    = (h.cardTabSub    as string) ?? "Personnalisez et prévisualisez votre carte";
  const statsTabTitle = (h.statsTabTitle as string) ?? "Statistiques";
  const statsTabSub   = (h.statsTabSub   as string) ?? "Vue d'ensemble de votre activité";
  const subTabTitle   = (h.subTabTitle   as string) ?? "Abonnement";
  const pendingTitle  = (h.pendingTitle  as string) ?? "Accès restreint";
  const pendingNotice = (h.pendingNotice as string) ?? "Votre abonnement n'est pas encore actif — vous n'avez pas accès à toutes les fonctionnalités. Activez votre compte pour débloquer les statistiques et la gestion d'abonnement.";

  const [activeTab, setActiveTab] = useState<Tab>("carte");
  const [showComingSoon, setShowComingSoon] = useState(false);
  const isActive = merchant?.subscription_status === "active";

  const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: "carte",         label: sidebarTitle, icon: Store },
    { id: "statistiques",  label: sidebarStats, icon: BarChart2 },
    { id: "abonnement",    label: sidebarSub,   icon: CreditCard },
  ];

  const tabTitles: Record<Tab, { title: string; sub: string }> = {
    carte:        { title: cardTabTitle,  sub: cardTabSub },
    statistiques: { title: statsTabTitle, sub: statsTabSub },
    abonnement:   { title: subTabTitle,   sub: isActive ? "Votre plan en cours" : "Choisissez votre abonnement" },
  };

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#0b1220", fontFamily: "Manrope, sans-serif", color: "#fff" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(74,158,255,0.5), transparent 65%)" }}
      />

      {/* ── Sidebar ── */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col border-r overflow-y-auto"
        style={{ background: "#faf8f4", borderColor: "rgba(15,32,68,0.1)" }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5 border-b"
          style={{ borderColor: "rgba(15,32,68,0.08)" }}
        >
          <Image src="/logo-qarta.png" width={40} height={40} alt="Qarta" style={{ borderRadius: 10 }} />
          <QartaWordmark color="#0f2044" />
        </div>

        {/* Merchant info card */}
        <div className="px-3 py-4 border-b" style={{ borderColor: "rgba(15,32,68,0.08)" }}>
          <div className="rounded-xl px-3 py-3" style={{ background: "#ffffff", border: "1.5px solid #0f2044" }}>
            <p className="text-[13px] font-semibold text-[#0f2044] truncate">
              {(merchant?.business_name as string) || "Mon commerce"}
            </p>
            <p className="text-[11px] text-[#0f2044]/45 truncate mt-0.5">{user.email}</p>
            <div className="mt-2">
              {isActive ? (
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(39,174,96,0.15)", color: "#27ae60" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27ae60]" />
                  Actif
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(243,156,18,0.15)", color: "#f39c12" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f39c12]" />
                  En attente
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const selected = activeTab === id;
            const locked = (!isActive && id === "statistiques") || id === "abonnement";
            return (
              <button
                key={id}
                onClick={() => {
                  if (id === "abonnement") { setShowComingSoon(true); return; }
                  if (!locked) setActiveTab(id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
                style={
                  selected && !locked
                    ? {
                        background: "#0f2044",
                        color: "#ffffff",
                        border: "1px solid #0f2044",
                      }
                    : {
                        background: "transparent",
                        color: locked ? "#0f2044" : "#2c7be5",
                        border: "1px solid transparent",
                      }
                }
              >
                <Icon size={15} strokeWidth={2} />
                {label}
                {locked
                  ? <Lock size={11} className="ml-auto" />
                  : selected && <ChevronRight size={13} className="ml-auto opacity-50" />
                }
              </button>
            );
          })}
        </nav>

        {/* Onboarding shortcut */}
        <div className="px-3 pb-2">
          <a
            href="/onboarding.html"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all"
            style={{
              background: "#0f2044",
              border: "1px solid #0f2044",
              color: "#ffffff",
            }}
          >
            <Rocket size={14} strokeWidth={2} />
            Revoir l&apos;onboarding
          </a>
        </div>

        {/* Logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(15,32,68,0.08)" }}>
          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
              style={{ color: "#0f2044", border: "1px solid rgba(15,32,68,0.08)" }}
            >
              <LogOut size={14} strokeWidth={2} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top bar */}
        <header
          className="flex items-center px-8 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div>
            <h1 className="text-[17px] font-bold" style={{ letterSpacing: "-0.01em" }}>
              {tabTitles[activeTab].title}
            </h1>
            <p className="text-[12px] text-white/35 mt-0.5">{tabTitles[activeTab].sub}</p>
          </div>
        </header>

        {/* Launch announcement banner — carte tab only */}
        {activeTab === "carte" && (
          <div
            className="mx-6 mt-3 flex items-center gap-3 px-5 py-3.5 rounded-2xl"
            style={{
              background: "linear-gradient(90deg, rgba(124,58,237,0.12), rgba(79,70,229,0.08))",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            <p className="text-[13px] flex-1">
              <span className="font-semibold" style={{ color: "#a78bfa" }}>Lancement fin juin — début juillet 2025</span>
              <span className="font-semibold" style={{ color: "#7dd3fc" }}> · Votre carte de fidélité sera disponible pour vos clients très bientôt !</span>
            </p>
          </div>
        )}

        {/* Stripe success banner */}
        {stripeSuccess && (
          <div
            className="mx-6 mt-3 flex items-center gap-3 px-5 py-3.5 rounded-2xl"
            style={{
              background: "rgba(39,174,96,0.07)",
              border: "1px solid rgba(39,174,96,0.25)",
            }}
          >
            <CheckCircle size={15} color="#27ae60" strokeWidth={2} className="flex-shrink-0" />
            <p className="text-[13px] flex-1">
              <span className="font-semibold text-[#27ae60]">Paiement reçu ✓</span>
              <span className="text-white/45"> — Votre abonnement est en cours d&apos;activation. Actualisez la page dans quelques secondes.</span>
            </p>
          </div>
        )}

        {/* Pending banner */}
        {!isActive && (
          <div
            className="mx-6 my-3 flex items-center gap-3 px-5 py-3.5 rounded-2xl"
            style={{
              background: "rgba(243,156,18,0.07)",
              border: "1px solid rgba(243,156,18,0.2)",
            }}
          >
            <AlertTriangle size={15} color="#f39c12" strokeWidth={2} className="flex-shrink-0" />
            <p className="text-[13px] flex-1">
              <span className="font-semibold text-[#f39c12]">{pendingTitle}</span>
              <span className="text-white/45"> — {pendingNotice}</span>
            </p>
            <button
              onClick={() => setShowComingSoon(true)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all hover:scale-105"
              style={{
                background: "rgba(243,156,18,0.15)",
                border: "1px solid rgba(243,156,18,0.3)",
                color: "#f39c12",
              }}
            >
              Bientôt →
            </button>
          </div>
        )}

        {/* Tab content — tous les onglets restent montés (display:none) pour
             préserver l'état React (design de la carte, etc.) entre les navigations */}
        <div className="flex-1 min-h-0 px-6 pt-0 pb-6 overflow-auto">
          <div style={{ display: activeTab === "carte" ? "block" : "none" }}>
            <CarteTab merchant={merchant} loyaltyCard={loyaltyCard} isActive={isActive} />
          </div>
          <div style={{ display: activeTab === "statistiques" ? "block" : "none" }}>
            <StatistiquesTab merchant={merchant} isActive={isActive} content={content?.stats} />
          </div>
          <div style={{ display: activeTab === "abonnement" ? "block" : "none" }}>
            <AbonnementTab merchant={merchant} isActive={isActive} content={content?.subscription} />
          </div>
        </div>
      </main>

      {/* ── Modale Bientôt disponible ── */}
      {showComingSoon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          onClick={() => setShowComingSoon(false)}
        >
          <div
            className="relative flex flex-col items-center text-center rounded-3xl px-10 py-10 mx-4"
            style={{
              background: "#111927",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 32px 80px -20px rgba(0,0,0,0.8)",
              maxWidth: 420,
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icône */}
            <div
              className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
              style={{ background: "rgba(74,158,255,0.12)", border: "1px solid rgba(74,158,255,0.25)" }}
            >
              <Lock size={22} color="#4a9eff" strokeWidth={2} />
            </div>

            {/* Titre */}
            <h2 className="text-[20px] font-bold mb-2" style={{ letterSpacing: "-0.02em" }}>
              Bientôt disponible
            </h2>

            {/* Message */}
            <p className="text-[14px] leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
              La gestion des abonnements sera disponible lors du lancement officiel de Qarta.
            </p>
            <p className="text-[13px] font-semibold mb-7" style={{ color: "#4a9eff" }}>
              Lancement prévu fin juin — début juillet 2026
            </p>

            {/* Bouton fermer */}
            <button
              onClick={() => setShowComingSoon(false)}
              className="px-8 py-3 rounded-2xl text-[14px] font-semibold transition-all hover:scale-105 active:scale-100"
              style={{
                background: "#0f2044",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#ffffff",
                boxShadow: "0 8px 24px -8px rgba(0,0,0,0.5)",
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
