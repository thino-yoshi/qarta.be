"use client";
import { Lock } from "lucide-react";

interface RecentClient { clientId: string; name: string; stamps: number; joinedAt: string; }

interface StatsData {
  totalClients: number;
  totalStamps:  number;
  totalRewards: number;
  returnRate:   number;
  dailyData:    number[];
  recentClients: RecentClient[];
}

const PLACEHOLDER_BARS = [1,3,2,5,2,4,6,3,5,1,7,4,3,6,2,5,4,7,3,5,6,4,3,2,5,4,6,3,2,1];

interface Props {
  merchant: Record<string, unknown>;
  isActive: boolean;
  stats?: StatsData;
  content?: Record<string, unknown>;
}

export default function StatistiquesTab({ isActive, stats, content }: Props) {
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

  const mainStats = [
    { label: stat1Label, value: isActive ? (stats?.totalClients ?? 0) : 0 },
    { label: stat2Label, value: isActive ? (stats?.totalStamps  ?? 0) : 0 },
    { label: stat3Label, value: isActive ? (stats?.totalRewards ?? 0) : 0 },
  ];
  const returnRate = isActive ? (stats?.returnRate ?? 0) : 0;

  const bars    = isActive && stats?.dailyData?.length ? stats.dailyData : PLACEHOLDER_BARS;
  const maxBar  = Math.max(...bars, 1);
  const hasData = isActive && (stats?.totalClients ?? 0) > 0;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }

  return (
    <div className="space-y-6">
      {/* ── Bloc Vue d'ensemble ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            Vue d&apos;ensemble · 30 derniers jours
          </span>
        </div>

        {/* 3 stats en colonnes */}
        <div className="grid grid-cols-3 divide-x" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {mainStats.map(({ label, value }) => (
            <div key={label} className="px-6 py-6 text-center">
              <p className="text-[36px] font-bold leading-none text-white mb-2">{value}</p>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Taux de retour — barre */}
        <div className="px-6 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>{stat4Label}</span>
            <span className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
              {returnRate}{stat4Suffix} reviennent
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(returnRate, 100)}%`, background: "linear-gradient(90deg, #4a9eff, #7b6fff)" }}
            />
          </div>
        </div>
      </div>

      {/* ── Graphique ── */}
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
          {bars.map((v, i) => (
            <div key={i} className="flex-1 rounded-t-sm transition-all"
              style={{
                height: `${(v / maxBar) * 100}%`,
                background: isActive ? "#4a9eff" : "rgba(255,255,255,0.1)",
                opacity: isActive ? (v === 0 ? 0.2 : 0.8) : 0.4,
                minHeight: 2,
              }} />
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
          <span className="text-[12px] text-white/30">{isActive ? `${stats?.totalClients ?? 0} clients` : "0 clients"}</span>
        </div>

        {hasData && stats!.recentClients.length > 0 ? (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {stats!.recentClients.map((client) => (
              <div key={client.clientId} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold"
                    style={{ background: "rgba(74,158,255,0.12)", color: "#4a9eff" }}>
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold">{client.name}</p>
                    <p className="text-[11px] text-white/35">Rejoint le {formatDate(client.joinedAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-white/70">{client.stamps} tampons</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-14 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Users size={22} className="text-white/15" />
            </div>
            <p className="text-[14px] text-white/25">{emptyTitle}</p>
            {!isActive && <p className="text-[12px] text-white/15 mt-1">{emptyHint}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
