"use client";
import { useEffect, useMemo } from "react";

/* ─── Types & constantes ─────────────────────────────────────────── */

export const FONT_OPTIONS = [
  { label: "Manrope",       value: "Manrope",       gf: "Manrope:wght@400;700;800;900" },
  { label: "Bebas Neue",    value: "Bebas Neue",     gf: "Bebas+Neue" },
  { label: "Poppins",       value: "Poppins",        gf: "Poppins:wght@400;700;800" },
  { label: "Oswald",        value: "Oswald",         gf: "Oswald:wght@400;600;700" },
  { label: "Space Grotesk", value: "Space Grotesk",  gf: "Space+Grotesk:wght@400;600;700" },
  { label: "Inter",         value: "Inter",          gf: "Inter:wght@400;700;800;900" },
  { label: "Montserrat",    value: "Montserrat",     gf: "Montserrat:wght@400;700;800;900" },
];

export interface CardDesign {
  cardName:           string;
  stampLabel:         string;
  stampsRequired:     number;
  rewardDescription:  string;
  // Fond
  bgType:             "color" | "gradient" | "image";
  bgColors:           string[];      // 1-4 hex
  bgGradientAngle:    number;        // 0-360
  bgImageUrl:         string | null;
  bgImageOpacity:     number;        // 0-1
  // Accent (tampons + barre)
  accentColors:       string[];      // 1-4 hex
  accentAngle:        number;
  // Texte
  textColor:          string;
  // Police
  fontFamily:         string;
  // Q watermark
  showQ:              boolean;
  qOpacity:           number;        // 0-1
  compactPointsSize:  number;        // taille du grand chiffre en mode points — carte compacte (px)
  // ── Mode de fidélité ────────────────────────────────────────────
  loyaltyMode:        "stamps" | "points";
  pointsGoal:         number;        // ex: 1000 (points pour récompense)
}

export const DEFAULT_DESIGN: CardDesign = {
  cardName:           "Mon Commerce",
  stampLabel:         "POINTS COLLECTÉS",
  stampsRequired:     5,
  rewardDescription:  "récompense offerte",
  bgType:             "gradient",
  bgColors:           ["#4A1D96", "#7C3AED"],
  bgGradientAngle:    135,
  bgImageUrl:         null,
  bgImageOpacity:     0.3,
  accentColors:       ["#DDD6FE"],
  accentAngle:        135,
  textColor:          "#EDE9FE",
  fontFamily:         "Manrope",
  showQ:              true,
  qOpacity:           0.05,
  compactPointsSize:  68,
  // Mode de fidélité
  loyaltyMode:        "stamps",
  pointsGoal:         1000,
};

/* ─── Helpers ────────────────────────────────────────────────────── */

/** Retourne #ffffff ou #1a1a1a selon la luminance du hex pour garantir le contraste */
export function contrastColor(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return "#ffffff";
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.179 ? "#1a1a1a" : "#ffffff";
}

function buildGradient(colors: string[], angle: number) {
  if (!colors?.length) return "#141626";
  if (colors.length === 1) return colors[0];
  return `linear-gradient(${angle}deg, ${colors.join(", ")})`;
}

function loadFont(fontFamily: string) {
  const opt = FONT_OPTIONS.find((f) => f.value === fontFamily);
  if (!opt) return;
  const id = `gf-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${opt.gf}&display=swap`;
  document.head.appendChild(link);
}

/* ─── Composant carte ─────────────────────────────────────────────── */

interface Props {
  design?: Partial<CardDesign>;
  clientName?: string;
  currentStamps?: number;
  currentPoints?: number;
  defaultExpanded?: boolean;
}

export default function LoyaltyCard({
  design: raw,
  clientName = "Titulaire",
  currentStamps = 0,
  currentPoints = 0,
}: Props) {
  const d: CardDesign = { ...DEFAULT_DESIGN, ...raw };

  // Charger la police Google Fonts
  useEffect(() => { loadFont(d.fontFamily); }, [d.fontFamily]);

  const bgStyle = useMemo(() => {
    if (d.bgType === "gradient" && d.bgColors?.length > 1)
      return { background: buildGradient(d.bgColors, d.bgGradientAngle) };
    return { background: d.bgColors?.[0] ?? "#141626" };
  }, [d.bgType, d.bgColors, d.bgGradientAngle]);

  const accentFirst = d.accentColors?.[0] ?? "#FF2D78";
  const accentLast  = d.accentColors?.[d.accentColors.length - 1] ?? accentFirst;

  const isPoints  = d.loyaltyMode === "points";

  // Mode tampons
  const stamps    = Math.max(0, Math.min(currentStamps, d.stampsRequired));
  const progress  = isPoints
    ? Math.min(currentPoints / (d.pointsGoal || 1), 1)
    : d.stampsRequired > 0 ? stamps / d.stampsRequired : 0;
  const remaining = isPoints ? Math.max(0, d.pointsGoal - currentPoints) : d.stampsRequired - stamps;

  // Taille des tampons selon le nombre
  const stampPx = d.stampsRequired <= 5 ? 40 : d.stampsRequired <= 8 ? 32 : d.stampsRequired <= 12 ? 26 : 20;

  return (
    <div
      className="relative rounded-2xl overflow-hidden w-full select-none"
      style={{
        ...bgStyle,
        aspectRatio: "380 / 240",
        fontFamily: `'${d.fontFamily}', sans-serif`,
        boxShadow: `0 24px 60px -16px ${accentFirst}33`,
      }}
    >
      {/* Image de fond */}
      {d.bgType === "image" && d.bgImageUrl && (
        <img
          src={d.bgImageUrl} alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: d.bgImageOpacity }}
        />
      )}

      {/* Watermark Q */}
      {d.showQ && (
        <div
          className="absolute right-[6%] top-1/2 -translate-y-[48%] leading-none pointer-events-none"
          style={{
            fontSize: "clamp(72px, 28cqw, 170px)",
            fontFamily: `'${d.fontFamily}', sans-serif`,
            fontWeight: 900,
            color: `rgba(255,255,255,${d.qOpacity})`,
          }}
        >
          Q
        </div>
      )}

      {/* Contenu */}
      <div className="relative z-10 h-full flex flex-col" style={{ padding: "5% 6% 4%", textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>

        {/* Haut : nom + titulaire */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p style={{
              color: `${d.textColor}99`,
              fontSize: "clamp(9px, 2cqw, 12px)",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              Carte de fidélité
            </p>
            <h2
              className="font-black leading-none"
              style={{
                color: d.textColor,
                fontSize: "clamp(16px, 5.5cqw, 30px)",
                letterSpacing: "0.01em",
                textTransform: "uppercase",
              }}
            >
              {d.cardName}
            </h2>
          </div>

          <div className="text-right flex-shrink-0">
            <p style={{
              color: `${d.textColor}99`,
              fontSize: "clamp(6px, 1.4cqw, 9px)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}>
              Titulaire
            </p>
            <p className="font-bold mt-0.5" style={{
              fontSize: "clamp(10px, 2.4cqw, 15px)",
              color: d.textColor,
              whiteSpace: "nowrap",
            }}>
              {clientName}
            </p>
          </div>
        </div>

        {/* ── Mode POINTS ── */}
        {isPoints ? (
          <div className="mt-auto">
            <p style={{ color: accentFirst, fontSize: "clamp(6px,1.4cqw,9px)",
              fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px" }}>
              {d.stampLabel}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "6%" }}>
              <span style={{ color: accentFirst, fontWeight: 900, lineHeight: 1,
                fontSize: `clamp(${Math.round(d.compactPointsSize * 0.47)}px, ${(d.compactPointsSize * 0.176).toFixed(1)}cqw, ${d.compactPointsSize}px)` }}>
                {currentPoints.toLocaleString()}
              </span>
              <span style={{ color: accentFirst, fontWeight: 700, opacity: 0.75,
                fontSize: `clamp(${Math.round(d.compactPointsSize * 0.16)}px, ${(d.compactPointsSize * 0.052).toFixed(1)}cqw, ${Math.round(d.compactPointsSize * 0.32)}px)` }}>
                PTS
              </span>
            </div>
            {/* Barre */}
            <div style={{ marginTop: "4%" }}>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 2, background: "rgba(255,255,255,0.1)", marginBottom: 8 }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${accentFirst}, ${accentLast})` }} />
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: d.textColor, fontSize: "clamp(7px,1.5cqw,9px)" }}>
                  {remaining > 0 ? (
                    <>Encore <span style={{ color: accentFirst, fontWeight: 700 }}>{remaining.toLocaleString()} pts</span>{" "}pour votre{" "}
                      <span style={{ color: accentFirst }}>{d.rewardDescription}</span></>
                  ) : <span style={{ color: accentFirst, fontWeight: 700 }}>Récompense disponible 🎉</span>}
                </p>
                <p style={{ color: accentFirst, fontWeight: 700, fontSize: "clamp(9px,1.8cqw,12px)" }}>
                  {currentPoints.toLocaleString()} / {d.pointsGoal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

        ) : (
          /* ── Mode TAMPONS ── */
          <>
            <div className="mt-auto">
              <p style={{ color: accentFirst, fontSize: "clamp(6px, 1.4cqw, 9px)",
                fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}>
                {d.stampLabel}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.ceil(d.stampsRequired / 2)}, 1fr)`, justifyItems: "center", width: "100%", gap: "4px" }}>
                {Array.from({ length: d.stampsRequired }).map((_, i) => (
                  <div key={i} className="rounded-full flex-shrink-0"
                    style={{
                      width: stampPx, height: stampPx,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      ...(i < stamps
                        ? { background: accentFirst, boxShadow: `0 2px 10px ${accentFirst}55` }
                        : { border: `1.5px solid ${accentFirst}44`, background: "transparent" }
                      ),
                    }}>
                    {i < stamps && (
                      <svg viewBox="0 0 24 24" fill="none" stroke={contrastColor(accentFirst)}
                        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        style={{ width: "52%", height: "52%" }}>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Barre de progression + texte */}
            <div style={{ marginTop: "4%" }}>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 2, background: "rgba(255,255,255,0.1)", marginBottom: 8 }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${accentFirst}, ${accentLast})` }} />
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: d.textColor, fontSize: "clamp(7px, 1.5cqw, 9px)" }}>
                  {remaining > 0 ? (
                    <>Encore{" "}<span style={{ color: accentFirst, fontWeight: 700 }}>{remaining}</span>
                      {" "}pour votre{" "}<span style={{ color: accentFirst }}>{d.rewardDescription}</span></>
                  ) : <span style={{ color: accentFirst, fontWeight: 700 }}>Récompense disponible 🎉</span>}
                </p>
                <p style={{ color: accentFirst, fontWeight: 700, fontSize: "clamp(9px, 1.8cqw, 12px)" }}>
                  {stamps} / {d.stampsRequired}
                </p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

