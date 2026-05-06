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
}

export const DEFAULT_DESIGN: CardDesign = {
  cardName:           "Mon Commerce",
  stampLabel:         "POINTS COLLECTÉS",
  stampsRequired:     5,
  rewardDescription:  "récompense offerte",
  bgType:             "color",
  bgColors:           ["#141626"],
  bgGradientAngle:    135,
  bgImageUrl:         null,
  bgImageOpacity:     0.3,
  accentColors:       ["#FF2D78", "#9B59B6"],
  accentAngle:        135,
  textColor:          "#FF2D78",
  fontFamily:         "Manrope",
  showQ:              true,
  qOpacity:           0.05,
};

/* ─── Helpers ────────────────────────────────────────────────────── */

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
}

export default function LoyaltyCard({
  design: raw,
  clientName = "Titulaire",
  currentStamps = 0,
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

  const stamps    = Math.max(0, Math.min(currentStamps, d.stampsRequired));
  const progress  = d.stampsRequired > 0 ? stamps / d.stampsRequired : 0;
  const remaining = d.stampsRequired - stamps;

  // Taille des tampons selon le nombre
  const stampPx = d.stampsRequired <= 5 ? 40 : d.stampsRequired <= 8 ? 32 : d.stampsRequired <= 12 ? 26 : 20;

  return (
    <div
      className="relative rounded-2xl overflow-hidden w-full select-none"
      style={{
        ...bgStyle,
        aspectRatio: "1.6 / 1",
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
        className="absolute top-3 right-3 rounded-xl p-2.5 grid grid-cols-2 gap-1"
        style={{ width: 72, height: 72, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
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

          <div className="text-right" style={{ marginRight: "14%" }}>
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

        {/* Tampons */}
        <div className="mt-auto">
          <p style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "clamp(6px, 1.4cqw, 9px)",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}>
            {d.stampLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: d.stampsRequired }).map((_, i) => (
              <div
                key={i}
                className="rounded-full flex-shrink-0"
                style={{
                  width: stampPx,
                  height: stampPx,
                  ...(i < stamps
                    ? { background: accentGrad, boxShadow: `0 2px 10px ${accentFirst}55` }
                    : { border: `1.5px solid ${accentFirst}44`, background: "transparent" }
                  ),
                }}
              />
            ))}
          </div>
        </div>

        {/* Barre de progression + texte */}
        <div style={{ marginTop: "4%" }}>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 2, background: "rgba(255,255,255,0.1)", marginBottom: 8 }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${accentFirst}, ${accentLast})` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(7px, 1.5cqw, 9px)" }}>
              {remaining > 0 ? (
                <>
                  Encore{" "}
                  <span style={{ color: d.textColor, fontWeight: 700 }}>{remaining}</span>
                  {" "}pour votre{" "}
                  <span style={{ color: d.textColor }}>{d.rewardDescription}</span>
                </>
              ) : (
                <span style={{ color: d.textColor, fontWeight: 700 }}>Récompense disponible 🎉</span>
              )}
            </p>
            <p style={{ color: d.textColor, fontWeight: 700, fontSize: "clamp(9px, 1.8cqw, 12px)" }}>
              {stamps} / {d.stampsRequired}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
