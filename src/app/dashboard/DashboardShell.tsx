"use client";
import { useState } from "react";
import { Store, BarChart2, CreditCard, LogOut, ChevronRight, AlertTriangle, type LucideIcon } from "lucide-react";
import { QartaLogo, QartaWordmark } from "../components/QartaLogo";
import CarteTab from "./tabs/CarteTab";
import StatistiquesTab from "./tabs/StatistiquesTab";
import AbonnementTab from "./tabs/AbonnementTab";

type Tab = "carte" | "statistiques" | "abonnement";

interface Props {
  user: { id: string; email: string };
  merchant: Record<string, unknown>;
  loyaltyCard: Record<string, unknown> | null;
}

export default function DashboardShell({ user, merchant, loyaltyCard }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("carte");
  const isActive = merchant?.subscription_status === "active";

  const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: "carte",         label: "Ma carte",      icon: Store },
    { id: "statistiques",  label: "Statistiques",  icon: BarChart2 },
    { id: "abonnement",    label: "Abonnement",    icon: CreditCard },
  ];

  const tabTitles: Record<Tab, { title: string; sub: string }> = {
    carte:        { title: "Ma carte de fidélité", sub: "Personnalisez et prévisualisez votre carte" },
    statistiques: { title: "Statistiques",         sub: "Vue d'ensemble de votre activité" },
    abonnement:   { title: "Abonnement",           sub: isActive ? "Votre plan en cours" : "Choisissez votre abonnement" },
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
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <QartaLogo size={56} variant="badge" />
          <QartaWordmark color="#ffffff" />
        </div>

        {/* Merchant info card */}
        <div className="px-3 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="rounded-xl px-3 py-3" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-[13px] font-semibold text-white truncate">
              {(merchant?.business_name as string) || "Mon commerce"}
            </p>
            <p className="text-[11px] text-white/40 truncate mt-0.5">{user.email}</p>
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
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left"
                style={
                  selected
                    ? {
                        background: "rgba(74,158,255,0.12)",
                        color: "#4a9eff",
                        border: "1px solid rgba(74,158,255,0.2)",
                      }
                    : {
                        background: "transparent",
                        color: "rgba(255,255,255,0.45)",
                        border: "1px solid transparent",
                      }
                }
              >
                <Icon size={15} strokeWidth={2} />
                {label}
                {selected && <ChevronRight size={13} className="ml-auto opacity-50" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/35 hover:text-white/60 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
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

        {/* Pending banner */}
        {!isActive && (
          <div
            className="mx-6 mt-5 flex items-center gap-3 px-5 py-3.5 rounded-2xl"
            style={{
              background: "rgba(243,156,18,0.07)",
              border: "1px solid rgba(243,156,18,0.2)",
            }}
          >
            <AlertTriangle size={15} color="#f39c12" strokeWidth={2} className="flex-shrink-0" />
            <p className="text-[13px] flex-1">
              <span className="font-semibold text-[#f39c12]">Compte non activé</span>
              <span className="text-white/45">
                {" "}— Pas encore accès à l'application ni au scan QR.
              </span>
            </p>
            <button
              onClick={() => setActiveTab("abonnement")}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all hover:scale-105"
              style={{
                background: "rgba(243,156,18,0.15)",
                border: "1px solid rgba(243,156,18,0.3)",
                color: "#f39c12",
              }}
            >
              Activer →
            </button>
          </div>
        )}

        {/* Tab content — tous les onglets restent montés (display:none) pour
             préserver l'état React (design de la carte, etc.) entre les navigations */}
        <div className="flex-1 min-h-0 px-6 py-6 overflow-auto">
          <div style={{ display: activeTab === "carte" ? "block" : "none" }}>
            <CarteTab merchant={merchant} loyaltyCard={loyaltyCard} isActive={isActive} />
          </div>
          <div style={{ display: activeTab === "statistiques" ? "block" : "none" }}>
            <StatistiquesTab merchant={merchant} isActive={isActive} />
          </div>
          <div style={{ display: activeTab === "abonnement" ? "block" : "none" }}>
            <AbonnementTab merchant={merchant} isActive={isActive} />
          </div>
        </div>
      </main>
    </div>
  );
}
