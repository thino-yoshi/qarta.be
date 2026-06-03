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
  pointsLabel:        string;
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
  compactPointsSize:  number;        // taille du grand chiffre en mode points — carte compacte (px)
  // ── Mode de fidélité ────────────────────────────────────────────
  loyaltyMode:        "stamps" | "points";
  pointsGoal:         number;        // ex: 1000 (points pour récompense)
}

export const DEFAULT_DESIGN: CardDesign = {
  cardName:           "Mon Commerce",
  stampLabel:         "TAMPONS COLLECTÉS",
  pointsLabel:        "POINTS COLLECTÉS",
  stampsRequired:     6,
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

  // Toujours 2 lignes de N/2
  const perRow = d.stampsRequired / 2;

  // Police du nom : grande si ≤2 lignes attendues, réduite si 3 lignes nécessaires
  const nameFontSize = d.cardName.length >= 39
    ? "clamp(11px, 3.8cqw, 22px)"
    : "clamp(16px, 5.5cqw, 30px)";

  return (
    <div
      className="relative rounded-2xl overflow-hidden w-full select-none"
      style={{
        ...bgStyle,
        aspectRatio: "380 / 240",
        fontFamily: `'${d.fontFamily}', sans-serif`,
        boxShadow: `0 24px 60px -16px ${accentFirst}33`,
        containerType: "inline-size",
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



      {/* Contenu */}
      <div className="relative z-10 h-full flex flex-col" style={{ padding: "5% 6% 4%", textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>

        {/* Haut : nom + titulaire */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p style={{
              color: d.textColor,
              fontSize: "clamp(9px, 2cqw, 12px)",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}>
              Carte de fidélité
            </p>
            <h2
              className="font-black"
              style={{
                color: d.textColor,
                fontSize: nameFontSize,
                letterSpacing: "0.01em",
                lineHeight: 1.15,
                textTransform: "uppercase",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
              }}
            >
              {d.cardName}
            </h2>
          </div>

          <div className="text-right flex-shrink-0">
            <p style={{
              color: d.textColor,
              fontSize: "clamp(9px, 2cqw, 12px)",
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
            <p style={{ color: d.textColor, fontSize: "clamp(9px, 2.2cqw, 13px)",
              fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px" }}>
              {d.pointsLabel}
            </p>
            <div style={{ height: "20cqw", display: "flex", alignItems: "center", gap: "4px" }}>
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
            <div style={{ marginTop: "2%" }}>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 2, background: "rgba(255,255,255,0.1)", marginBottom: 8 }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${accentFirst}, ${accentLast})` }} />
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: d.textColor, fontSize: "clamp(12px,2.6cqw,15px)" }}>
                  {remaining > 0 ? (
                    <>Encore <span style={{ fontWeight: 700 }}>{remaining.toLocaleString()} pts</span>{" "}pour votre{" "}
                      <span>{d.rewardDescription}</span></>
                  ) : <span style={{ fontWeight: 700 }}>Récompense disponible 🎉</span>}
                </p>
                <p style={{ color: d.textColor, fontWeight: 700, fontSize: "clamp(13px,2.8cqw,16px)" }}>
                  {currentPoints.toLocaleString()} / {d.pointsGoal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

        ) : (
          /* ── Mode TAMPONS ── */
          <div className="mt-auto">
            <p style={{ color: d.textColor, fontSize: "clamp(9px, 2.2cqw, 13px)",
              fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}>
              {d.stampLabel}
            </p>
            {/* Grille tampons — 1 ligne N≤10, 2 lignes N≥12. Cap 12cqw en 2 lignes pour rester dans la carte */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${perRow}, 1fr)`,
              gridTemplateRows: "1fr 1fr",
              height: "24cqw",
              width: "100%",
              gap: "0",
              justifyItems: "center",
              alignItems: "center",
            }}>
              {Array.from({ length: d.stampsRequired }).map((_, i) => (
                <div key={i} className="rounded-full"
                  style={{
                    width: "min(100%, 12cqw)",
                    aspectRatio: "1 / 1",
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
            {/* Barre de progression + texte — toujours dans la carte */}
            <div style={{ marginTop: "3%" }}>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 2, background: "rgba(255,255,255,0.1)", marginBottom: 6 }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${accentFirst}, ${accentLast})` }} />
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: d.textColor, fontSize: "clamp(12px, 2.6cqw, 15px)" }}>
                  {remaining > 0 ? (
                    <>Encore{" "}<span style={{ fontWeight: 700 }}>{remaining}</span>
                      {" "}pour votre{" "}<span>{d.rewardDescription}</span></>
                  ) : <span style={{ fontWeight: 700 }}>Récompense disponible 🎉</span>}
                </p>
                <p style={{ color: d.textColor, fontWeight: 700, fontSize: "clamp(13px, 2.8cqw, 16px)" }}>
                  {stamps} / {d.stampsRequired}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

