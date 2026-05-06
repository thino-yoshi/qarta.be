"use client";
import { Users, Stamp, Award, TrendingUp, Lock } from "lucide-react";

// Données fictives pour la structure — à remplacer par vraies requêtes Supabase
const PLACEHOLDER_BARS = [1,3,2,5,2,4,6,3,5,1,7,4,3,6,2,5,4,7,3,5,6,4,3,2,5,4,6,3,2,1];

interface Props {
  merchant: Record<string, unknown>;
  isActive: boolean;
}

export default function StatistiquesTab({ isActive }: Props) {
  const stats = [
    { label: "Clients total",         value: 0,   icon: Users,     color: "#4a9eff",  suffix: ""  },
    { label: "Tampons distribués",     value: 0,   icon: Stamp,     color: "#9b59b6",  suffix: ""  },
    { label: "Récompenses offertes",   value: 0,   icon: Award,     color: "#27ae60",  suffix: ""  },
    { label: "Taux de retour",         value: 0,   icon: TrendingUp,color: "#f39c12",  suffix: "%" },
  ];

  const maxBar = Math.max(...PLACEHOLDER_BARS);

  return (
    <div className="space-y-6">

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, suffix }) => (
          <div
            key={label}
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
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
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-semibold">Nouveaux clients</h3>
            <p className="text-[12px] text-white/35 mt-0.5">30 derniers jours</p>
          </div>
          {!isActive && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
              style={{ background: "rgba(243,156,18,0.1)", border: "1px solid rgba(243,156,18,0.2)", color: "#f39c12" }}
            >
              <Lock size={11} strokeWidth={2.5} />
              Données réelles après activation
            </div>
          )}
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1 h-28">
          {PLACEHOLDER_BARS.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all"
              style={{
                height: `${(v / maxBar) * 100}%`,
                background: isActive ? "#4a9eff" : "rgba(255,255,255,0.1)",
                opacity: isActive ? 0.7 : 0.4,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-white/20">
          <span>Il y a 30j</span>
          <span>Aujourd&apos;hui</span>
        </div>
      </div>

      {/* ── Derniers clients ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h3 className="text-[15px] font-semibold">Derniers clients</h3>
          <span className="text-[12px] text-white/30">0 clients</span>
        </div>

        <div className="py-14 text-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <Users size={22} className="text-white/15" />
          </div>
          <p className="text-[14px] text-white/25">Aucun client pour l&apos;instant</p>
          {!isActive && (
            <p className="text-[12px] text-white/15 mt-1">
              Activez votre compte pour commencer à accueillir des clients
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
