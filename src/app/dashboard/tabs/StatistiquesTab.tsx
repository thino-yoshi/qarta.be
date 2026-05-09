"use client";
import { Users, Stamp, Award, TrendingUp, Lock } from "lucide-react";

const PLACEHOLDER_BARS = [1,3,2,5,2,4,6,3,5,1,7,4,3,6,2,5,4,7,3,5,6,4,3,2,5,4,6,3,2,1];

interface Props {
  merchant: Record<string, unknown>;
  isActive: boolean;
  content?: Record<string, unknown>;
}

export default function StatistiquesTab({ isActive, content }: Props) {
  const c = content ?? {};
  const chartTitle       = (c.chartTitle       as string) ?? "Nouveaux clients";
  const chartPeriod      = (c.chartPeriod      as string) ?? "30 derniers jours";
  const stat1Label       = (c.stat1Label       as string) ?? "Clients total";
  const stat2Label       = (c.stat2Label       as string) ?? "Tampons distribués";
  const stat3Label       = (c.stat3Label       as string) ?? "Récompenses offertes";
  const stat4Label       = (c.stat4Label       as string) ?? "Taux de retour";
  const stat4Suffix      = (c.stat4Suffix      as string) ?? "%";
  const emptyTitle       = (c.emptyTitle       as string) ?? "Aucun client pour l'instant";
  const emptyHint        = (c.emptyHint        as string) ?? "Activez votre compte pour commencer à accueillir des clients";
  const lastClientsTitle = (c.lastClientsTitle as string) ?? "Derniers clients";
  const pendingDataLabel = (c.pendingDataLabel as string) ?? "Données réelles après activation";

  const stats = [
    { label: stat1Label, value: 0,  icon: Users,      color: "#4a9eff", suffix: "" },
    { label: stat2Label, value: 0,  icon: Stamp,      color: "#9b59b6", suffix: "" },
    { label: stat3Label, value: 0,  icon: Award,      color: "#27ae60", suffix: "" },
    { label: stat4Label, value: 0,  icon: TrendingUp, color: "#f39c12", suffix: stat4Suffix },
  ];

  const maxBar = Math.max(...PLACEHOLDER_BARS);

  return (
    <div className="space-y-6">
      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, suffix }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-white/40 uppercase tracking-wider leading-tight">{label}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={14} color={color} strokeWidth={2} />
              </div>
            </div>
            <p className="text-[28px] font-bold" style={{ color }}>
              {value}{suffix}
            </p>
          </div>
        ))}
      </div>

      {/* ── Chart ── */}
      <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-semibold">{chartTitle}</h3>
            <p className="text-[12px] text-white/35 mt-0.5">{chartPeriod}</p>
          </div>
          {!isActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
              style={{ background: "rgba(243,156,18,0.1)", border: "1px solid rgba(243,156,18,0.2)", color: "#f39c12" }}>
              <Lock size={11} strokeWidth={2.5} />
              {pendingDataLabel}
            </div>
          )}
        </div>
        <div className="flex items-end gap-1 h-28">
          {PLACEHOLDER_BARS.map((v, i) => (
            <div key={i} className="flex-1 rounded-t-sm transition-all"
              style={{ height: `${(v / maxBar) * 100}%`, background: isActive ? "#4a9eff" : "rgba(255,255,255,0.1)", opacity: isActive ? 0.7 : 0.4 }} />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-white/20">
          <span>Il y a 30j</span>
          <span>Aujourd&apos;hui</span>
        </div>
      </div>

      {/* ── Derniers clients ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h3 className="text-[15px] font-semibold">{lastClientsTitle}</h3>
          <span className="text-[12px] text-white/30">0 clients</span>
        </div>
        <div className="py-14 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(255,255,255,0.04)" }}>
            <Users size={22} className="text-white/15" />
          </div>
          <p className="text-[14px] text-white/25">{emptyTitle}</p>
          {!isActive && <p className="text-[12px] text-white/15 mt-1">{emptyHint}</p>}
        </div>
      </div>
    </div>
  );
}
