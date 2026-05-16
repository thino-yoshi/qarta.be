"use client";
import { useEffect, useMemo, useState } from "react";

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
  // ── Carte Wallet (vue dépliée) ──────────────────────────────────
  walletTitleSize:    number;        // taille nom commerce (px)
  walletNameSize:     number;        // taille nom client (px)
  walletStampCols:    number;        // colonnes grille tampons (3-5)
  walletQRSize:       number;        // taille QR code (px)
  walletShowCircles:  boolean;       // cercles décoratifs en fond
  walletPadding:      number;        // padding interne (px)
  walletPointsSize:   number;        // taille du grand chiffre en mode points (px)
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
  // Wallet defaults
  walletTitleSize:    34,
  walletNameSize:     26,
  walletStampCols:    5,
  walletQRSize:       130,
  walletShowCircles:  true,
  walletPadding:      26,
  walletPointsSize:   52,
  compactPointsSize:  68,
  // Mode de fidélité
  loyaltyMode:        "stamps",
  pointsGoal:         1000,
};

/* ─── Helpers ────────────────────────────────────────────────────── */

/** Retourne #ffffff ou #1a1a1a selon la luminance du hex pour garantir le contraste */
function contrastColor(hex: string): string {
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

  const accentGrad  = buildGradient(d.accentColors, d.accentAngle);
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

      {/* QR placeholder */}
      <div
        className="absolute rounded-xl grid grid-cols-2"
        style={{
          top: "5%", right: "4%",
          width: "13%", aspectRatio: "1",
          padding: "1.8%", gap: "10%",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {[0,1,2,3].map((i) => (
          <div key={i} className="rounded-[2px]" style={{ background: "rgba(255,255,255,0.18)" }} />
        ))}
      </div>

      {/* Contenu */}
      <div className="relative z-10 h-full flex flex-col" style={{ padding: "5% 6% 4%" }}>

        {/* Haut : nom + titulaire */}
        <div className="flex items-start justify-between">
          <div>
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
            <p style={{
              color: `${d.textColor}99`,
              fontSize: "clamp(7px, 1.6cqw, 10px)",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginTop: "4px",
            }}>
              Carte Fidélité
            </p>
          </div>

          <div className="text-right" style={{ marginRight: "19%" }}>
            <p style={{
              color: `${d.textColor}99`,
              fontSize: "clamp(6px, 1.4cqw, 9px)",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}>
              Titulaire
            </p>
            <p className="font-bold text-white mt-0.5" style={{ fontSize: "clamp(10px, 2.4cqw, 15px)" }}>
              {clientName}
            </p>
          </div>
        </div>

        {/* ── Mode POINTS ── */}
        {isPoints ? (
          <div className="mt-auto">
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "clamp(6px,1.4cqw,9px)",
              fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px" }}>
              Points cumulés
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
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(7px,1.5cqw,9px)" }}>
                  {remaining > 0 ? (
                    <>Encore <span style={{ color: d.textColor, fontWeight: 700 }}>{remaining.toLocaleString()} pts</span>{" "}pour votre{" "}
                      <span style={{ color: d.textColor }}>{d.rewardDescription}</span></>
                  ) : <span style={{ color: d.textColor, fontWeight: 700 }}>Récompense disponible 🎉</span>}
                </p>
                <p style={{ color: d.textColor, fontWeight: 700, fontSize: "clamp(9px,1.8cqw,12px)" }}>
                  {currentPoints.toLocaleString()} / {d.pointsGoal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

        ) : (
          /* ── Mode TAMPONS ── */
          <>
            <div className="mt-auto">
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "clamp(6px, 1.4cqw, 9px)",
                fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" }}>
                {d.stampLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: d.stampsRequired }).map((_, i) => (
                  <div key={i} className="rounded-full flex-shrink-0"
                    style={{
                      width: stampPx, height: stampPx,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      ...(i < stamps
                        ? { background: accentGrad, boxShadow: `0 2px 10px ${accentFirst}55` }
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
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(7px, 1.5cqw, 9px)" }}>
                  {remaining > 0 ? (
                    <>Encore{" "}<span style={{ color: d.textColor, fontWeight: 700 }}>{remaining}</span>
                      {" "}pour votre{" "}<span style={{ color: d.textColor }}>{d.rewardDescription}</span></>
                  ) : <span style={{ color: d.textColor, fontWeight: 700 }}>Récompense disponible 🎉</span>}
                </p>
                <p style={{ color: d.textColor, fontWeight: 700, fontSize: "clamp(9px, 1.8cqw, 12px)" }}>
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

/* ─── QR placeholder SVG ──────────────────────────────────────────── */

export function QRPlaceholder({ size = 130 }: { size?: number }) {
  const N = 21;
  const cell = size / N;
  const filled = (r: number, c: number): boolean => {
    if (r < 7 && c < 7) return r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    if (r < 7 && c >= 14) { const lc = c - 14; return r === 0 || r === 6 || lc === 0 || lc === 6 || (r >= 2 && r <= 4 && lc >= 2 && lc <= 4); }
    if (r >= 14 && c < 7) { const lr = r - 14; return lr === 0 || lr === 6 || c === 0 || c === 6 || (lr >= 2 && lr <= 4 && c >= 2 && c <= 4); }
    if (r === 7 || c === 7) return false;
    if (r === 6 && c >= 8 && c <= 12) return c % 2 === 0;
    if (c === 6 && r >= 8 && r <= 12) return r % 2 === 0;
    if (r >= 14 && r <= 18 && c >= 14 && c <= 18) { const lr = r - 14; const lc = c - 14; return lr === 0 || lr === 4 || lc === 0 || lc === 4 || (lr === 2 && lc === 2); }
    return ((r * 31 + c * 17 + r * c * 7 + r + c) % 100) > 48;
  };
  const rects: React.ReactElement[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (filled(r, c)) rects.push(<rect key={`${r}-${c}`} x={c * cell + 0.15} y={r * cell + 0.15} width={cell - 0.3} height={cell - 0.3} fill="#000" rx={0.6} />);
    }
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>{rects}</svg>;
}

/* ─── Verso de la carte : tampons + QR ───────────────────────────── */

export function CardQRBack({ design: raw, clientName = "Titulaire", currentStamps = 0, currentPoints = 0 }: Props) {
  const d: CardDesign = { ...DEFAULT_DESIGN, ...raw };

  useEffect(() => { loadFont(d.fontFamily); }, [d.fontFamily]);

  const bgStyle = useMemo(() => {
    if (d.bgType === "gradient" && d.bgColors?.length > 1)
      return { background: buildGradient(d.bgColors, d.bgGradientAngle) };
    return { background: d.bgColors?.[0] ?? "#141626" };
  }, [d.bgType, d.bgColors, d.bgGradientAngle]);

  const accentFirst  = d.accentColors?.[0] ?? "#FF2D78";
  const bgBase       = d.bgColors?.[0] ?? "#141626";
  const isPoints     = d.loyaltyMode === "points";
  const stamps       = Math.max(0, Math.min(currentStamps, d.stampsRequired));
  const remaining    = isPoints ? Math.max(0, d.pointsGoal - currentPoints) : d.stampsRequired - stamps;
  const progress     = isPoints
    ? Math.min(currentPoints / (d.pointsGoal || 1), 1)
    : d.stampsRequired > 0 ? stamps / d.stampsRequired : 0;
  const COLS         = Math.min(d.walletStampCols ?? 5, d.stampsRequired);
  const stampPxW     = d.stampsRequired <= 5 ? 40 : d.stampsRequired <= 8 ? 32 : d.stampsRequired <= 12 ? 26 : 20;
  const titleSize    = d.walletTitleSize   ?? 34;
  const nameSize     = d.walletNameSize    ?? 26;
  const qrSize       = d.walletQRSize      ?? 130;
  const pad          = d.walletPadding     ?? 26;
  const showCircles  = d.walletShowCircles ?? true;
  const pointsSize   = d.walletPointsSize  ?? 52;

  const bracketStyle = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute", width: 22, height: 22, ...pos,
  });

  return (
    <div style={{
      ...bgStyle,
      borderRadius: 20,
      overflow: "hidden",
      position: "relative",
      padding: `${pad + 2}px ${pad}px ${pad}px`,
      fontFamily: `'${d.fontFamily}', sans-serif`,
    }}>
      {/* Cercles décoratifs en fond */}
      {showCircles && <>
        <div style={{ position: "absolute", bottom: -90, right: -90, width: 260, height: 260,
          borderRadius: "50%", border: `72px solid ${d.textColor}07`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 20, right: -30, width: 190, height: 190,
          borderRadius: "50%", border: `52px solid ${d.textColor}04`, pointerEvents: "none" }} />
      </>}

      {/* Nom du commerce */}
      <h2 style={{ margin: 0, fontSize: titleSize, fontWeight: 900, color: d.textColor,
        letterSpacing: "-0.01em", lineHeight: 1.1 }}>
        {d.cardName}
      </h2>
      <p style={{ margin: "5px 0 22px", fontSize: 10, fontWeight: 700,
        color: `${d.textColor}55`, letterSpacing: "0.22em", textTransform: "uppercase" }}>
        Carte Fidélité
      </p>

      {/* Titulaire */}
      <p style={{ margin: 0, fontSize: 9, fontWeight: 700,
        color: `${d.textColor}55`, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        Titulaire
      </p>
      <h3 style={{ margin: "5px 0 0", fontSize: nameSize, fontWeight: 800, color: d.textColor, letterSpacing: "-0.01em" }}>
        {clientName}
      </h3>

      {/* Séparateur */}
      <div style={{ height: 1, background: `${d.textColor}18`, margin: "20px 0" }} />

      {/* ── Mode POINTS ── */}
      {isPoints ? (
        <>
          <p style={{ margin: "0 0 10px", fontSize: 9, fontWeight: 700,
            color: `${d.textColor}55`, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Points cumulés
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
            <span style={{ fontSize: pointsSize, fontWeight: 900, color: d.textColor, lineHeight: 1 }}>
              {currentPoints.toLocaleString()}
            </span>
            <span style={{ fontSize: Math.round(pointsSize * 0.38), fontWeight: 700, color: d.textColor, opacity: 0.75 }}>PTS</span>
          </div>
        </>
      ) : (
        /* ── Mode TAMPONS ── */
        <>
          <p style={{ margin: "0 0 14px", fontSize: 9, fontWeight: 700,
            color: `${d.textColor}55`, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {d.stampLabel}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            {Array.from({ length: d.stampsRequired }).map((_, i) => (
              <div key={i} style={{
                width: stampPxW, height: stampPxW, flexShrink: 0,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                ...(i < stamps
                  ? { background: accentFirst, boxShadow: `0 4px 14px ${accentFirst}55` }
                  : { border: `2px solid ${accentFirst}35`, background: `${accentFirst}08` }
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
        </>
      )}

      {/* Barre de progression (commune) */}
      <div style={{ height: 3, background: `${d.textColor}18`, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, background: accentFirst,
          borderRadius: 99, transition: "width 0.5s ease" }} />
      </div>

      {/* Texte progression (commun) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 10, marginBottom: 22 }}>
        <p style={{ margin: 0, fontSize: 12, color: `${d.textColor}70` }}>
          {remaining > 0 ? (
            isPoints
              ? <>Encore <strong style={{ color: d.textColor }}>{remaining.toLocaleString()} pts</strong> pour votre{" "}
                  <span style={{ color: d.textColor }}>{d.rewardDescription}</span></>
              : <>Encore <strong style={{ color: d.textColor }}>{remaining} tampons</strong> pour votre{" "}
                  <span style={{ color: d.textColor }}>{d.rewardDescription}</span></>
          ) : <strong style={{ color: d.textColor }}>Récompense disponible 🎉</strong>}
        </p>
        <span style={{ fontSize: 14, fontWeight: 700, color: d.textColor }}>
          {isPoints
            ? `${currentPoints.toLocaleString()} / ${d.pointsGoal.toLocaleString()}`
            : `${stamps} / ${d.stampsRequired}`}
        </span>
      </div>

      {/* Séparateur */}
      <div style={{ height: 1, background: `${d.textColor}18`, marginBottom: 22 }} />

      {/* QR Code */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", padding: 14, background: "#ffffff",
          borderRadius: 16, boxShadow: `0 16px 48px -8px rgba(0,0,0,0.45)` }}>
          {/* Coins de scan */}
          <div style={bracketStyle({ top: -3, left: -3, borderTop: `3px solid ${accentFirst}`, borderLeft: `3px solid ${accentFirst}`, borderRadius: "6px 0 0 0" })} />
          <div style={bracketStyle({ top: -3, right: -3, borderTop: `3px solid ${accentFirst}`, borderRight: `3px solid ${accentFirst}`, borderRadius: "0 6px 0 0" })} />
          <div style={bracketStyle({ bottom: -3, left: -3, borderBottom: `3px solid ${accentFirst}`, borderLeft: `3px solid ${accentFirst}`, borderRadius: "0 0 0 6px" })} />
          <div style={bracketStyle({ bottom: -3, right: -3, borderBottom: `3px solid ${accentFirst}`, borderRight: `3px solid ${accentFirst}`, borderRadius: "0 0 6px 0" })} />
          <QRPlaceholder size={qrSize} />
        </div>
        <p style={{ margin: 0, fontSize: 9, fontWeight: 700,
          color: `${d.textColor}55`, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Scanner pour valider
        </p>
      </div>
    </div>
  );
}

/* ─── Aperçu carte Wallet (s'allonge au clic, comme Apple/Google Wallet) */

export function WalletCard({ design, clientName = "Pierre", currentStamps = 0, currentPoints = 0, defaultExpanded = false }: Props) {
  const [expanded,     setExpanded]     = useState(defaultExpanded);
  const [contentReady, setContentReady] = useState(true);

  const d            = { ...DEFAULT_DESIGN, ...design };
  const accentFirst  = d.accentColors?.[0] ?? "#FF2D78";

  const bgStyle = useMemo(() => {
    if (d.bgType === "gradient" && d.bgColors?.length > 1)
      return { background: buildGradient(d.bgColors, d.bgGradientAngle) };
    return { background: d.bgColors?.[0] ?? "#141626" };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.bgType, JSON.stringify(d.bgColors), d.bgGradientAngle]);

  const handleToggle = () => {
    setContentReady(false);
    setTimeout(() => { setExpanded(e => !e); setContentReady(true); }, 200);
  };

  return (
    <div>
      {/* Label */}
      <button
        onClick={handleToggle}
        style={{
          display: "block", width: "100%", textAlign: "center",
          fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
          color: `${accentFirst}99`, background: "none", border: "none",
          cursor: "pointer", marginBottom: 10, padding: "4px 0",
          fontFamily: `'${d.fontFamily}', sans-serif`,
          transition: "color 0.3s",
        }}
      >
        {expanded ? "↑  Réduire" : "↓  Voir la carte ouverte dans le Wallet"}
      </button>

      {/* Conteneur carte — ratio fixe 380/240 compact · 380/580 wallet */}
      <div
        onClick={handleToggle}
        style={{
          ...bgStyle,
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          cursor: "pointer",
          /* Compact : 240/380×100 = 63.16% | Wallet : 580/380×100 = 152.63% */
          paddingBottom: expanded ? "152.63%" : "63.16%",
          transition: "padding-bottom 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: `0 24px 60px -16px ${accentFirst}33`,
        }}
      >
        {/* Contenu absolu — remplir le container (overflow:hidden coupe l'excès) */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, width: "100%",
          opacity: contentReady ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}>
          {expanded
            ? <CardQRBack design={design} clientName={clientName} currentStamps={currentStamps} currentPoints={currentPoints} />
            : <LoyaltyCard design={design} clientName={clientName} currentStamps={currentStamps} currentPoints={currentPoints} />
          }
        </div>
      </div>
    </div>
  );
}
