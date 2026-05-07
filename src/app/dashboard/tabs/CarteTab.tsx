"use client";
import React, { useState } from "react";
import { Save, Eye, Plus, Minus, ImageIcon } from "lucide-react";
import LoyaltyCard, { CardDesign, DEFAULT_DESIGN, FONT_OPTIONS } from "@/app/components/LoyaltyCard";

interface Props {
  merchant:    Record<string, unknown>;
  loyaltyCard: Record<string, unknown> | null;
  isActive:    boolean;
}

/* ─── Sous-composants UI ─────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-3">{children}</p>
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0.5"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
      />
      <input
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-24 px-2 py-1.5 rounded-lg text-[12px] font-mono text-white/70 outline-none"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        placeholder="#000000"
      />
    </div>
  );
}

function GradientBuilder({
  colors, angle, onColors, onAngle,
}: {
  colors: string[]; angle: number;
  onColors: (c: string[]) => void; onAngle: (a: number) => void;
}) {
  const update = (i: number, v: string) => { const c = [...colors]; c[i] = v; onColors(c); };
  const remove = (i: number) => onColors(colors.filter((_, j) => j !== i));
  const add    = () => onColors([...colors, "#ffffff"]);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {colors.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <ColorInput value={c} onChange={(v) => update(i, v)} />
            {colors.length > 2 && (
              <button onClick={() => remove(i)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <Minus size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
      {colors.length < 4 && (
        <button onClick={add} className="flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white/70 transition-colors">
          <Plus size={12} /> Ajouter une couleur
        </button>
      )}
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-white/35">Angle</span>
        <input type="range" min={0} max={360} value={angle} onChange={(e) => onAngle(Number(e.target.value))}
          className="q-range flex-1"
          style={{ "--q-thumb-color": colors[0] } as React.CSSProperties} />
        <span className="text-[12px] text-white/50 w-8 text-right">{angle}°</span>
      </div>
    </div>
  );
}

/* ─── CarteTab ───────────────────────────────────────────────────── */

export default function CarteTab({ merchant, loyaltyCard }: Props) {
  const saved = loyaltyCard?.card_design as Partial<CardDesign> | undefined;

  const [design, setDesign] = useState<CardDesign>({
    ...DEFAULT_DESIGN,
    cardName: (merchant?.business_name as string) ?? "Mon Commerce",
    ...saved,
  });

  const [saving,   setSaving]   = useState(false);
  const [saveOk,   setSaveOk]   = useState(false);
  const [saveErr,  setSaveErr]  = useState<string | null>(null);
  const [previewStamps] = useState(3); // tampons affichés en preview

  const set = <K extends keyof CardDesign>(key: K, val: CardDesign[K]) =>
    setDesign((d) => ({ ...d, [key]: val }));

  const handleSave = async () => {
    setSaving(true); setSaveErr(null);
    try {
      const res = await fetch("/api/loyalty-card/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_design: design }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur serveur");
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (e: unknown) {
      setSaveErr(e instanceof Error ? e.message : "Erreur");
    }
    setSaving(false);
  };

  /* ── Rendu ── */
  return (
    <div className="flex flex-col xl:flex-row gap-x-6 gap-y-4">

      {/* ── Panneau gauche : customisation ── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Identité */}
        <Section title="Identité de la carte">
          <Field label="Nom affiché sur la carte">
            <TextInput value={design.cardName} onChange={(v) => set("cardName", v)} placeholder="Ex : BARBER" />
          </Field>
          <Field label="Label des tampons">
            <TextInput value={design.stampLabel} onChange={(v) => set("stampLabel", v)} placeholder="Ex : COUPES COLLECTÉES" />
          </Field>
          <Field label="Récompense">
            <TextInput value={design.rewardDescription} onChange={(v) => set("rewardDescription", v)} placeholder="Ex : coupe offerte" />
          </Field>
        </Section>

        {/* Tampons */}
        <Section title="Nombre de tampons">
          <div className="flex items-center gap-4">
            <input
              type="range" min={3} max={15} value={design.stampsRequired}
              onChange={(e) => set("stampsRequired", Number(e.target.value))}
              className="q-range flex-1"
              style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties}
            />
            <div className="w-12 h-10 rounded-xl flex items-center justify-center text-[20px] font-bold flex-shrink-0"
              style={{ background: `${design.accentColors[0]}22`, color: design.accentColors[0] }}>
              {design.stampsRequired}
            </div>
          </div>
        </Section>

        {/* Fond */}
        <Section title="Fond de la carte">
          {/* Type toggle */}
          <div className="flex gap-1 mb-4 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.05)" }}>
            {(["color", "gradient", "image"] as const).map((t) => (
              <button key={t} onClick={() => set("bgType", t)}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition-all"
                style={design.bgType === t
                  ? { background: "rgba(74,158,255,0.2)", color: "#4a9eff", border: "1px solid rgba(74,158,255,0.3)" }
                  : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }
                }>
                {t === "color" ? "Couleur" : t === "gradient" ? "Dégradé" : "Image"}
              </button>
            ))}
          </div>

          {design.bgType === "color" && (
            <ColorInput value={design.bgColors[0] ?? "#141626"} onChange={(v) => set("bgColors", [v])} />
          )}

          {design.bgType === "gradient" && (
            <GradientBuilder
              colors={design.bgColors.length >= 2 ? design.bgColors : [...design.bgColors, "#2c3e50"]}
              angle={design.bgGradientAngle}
              onColors={(c) => set("bgColors", c)}
              onAngle={(a) => set("bgGradientAngle", a)}
            />
          )}

          {design.bgType === "image" && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)" }}>
              <ImageIcon size={16} className="text-white/25" />
              <div>
                <p className="text-[12px] text-white/40">Upload d&apos;image</p>
                <p className="text-[11px] text-white/20 mt-0.5">Disponible prochainement</p>
              </div>
              <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(74,158,255,0.12)", color: "#4a9eff" }}>Soon</span>
            </div>
          )}
        </Section>

        {/* Couleur d'accent */}
        <Section title="Tampons & barre de progression">
          {/* Toggle mono / dégradé */}
          <div className="flex gap-1 mb-4 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.05)" }}>
            {["Couleur", "Dégradé"].map((t, i) => {
              const isSingle = design.accentColors.length === 1;
              const active = i === 0 ? isSingle : !isSingle;
              return (
                <button key={t} onClick={() => {
                  if (i === 0) set("accentColors", [design.accentColors[0]]);
                  else if (design.accentColors.length < 2) set("accentColors", [design.accentColors[0], "#9B59B6"]);
                }}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                  style={active
                    ? { background: "rgba(74,158,255,0.2)", color: "#4a9eff", border: "1px solid rgba(74,158,255,0.3)" }
                    : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }
                  }>
                  {t}
                </button>
              );
            })}
          </div>

          {design.accentColors.length === 1 ? (
            <ColorInput value={design.accentColors[0]} onChange={(v) => set("accentColors", [v])} />
          ) : (
            <GradientBuilder
              colors={design.accentColors}
              angle={design.accentAngle}
              onColors={(c) => set("accentColors", c)}
              onAngle={(a) => set("accentAngle", a)}
            />
          )}
        </Section>

        {/* Texte & Police */}
        <Section title="Texte & police">
          <Field label="Couleur du texte principal">
            <ColorInput value={design.textColor} onChange={(v) => set("textColor", v)} />
          </Field>

          <Field label="Police">
            <div className="grid grid-cols-2 gap-2 mt-1">
              {FONT_OPTIONS.map((f) => (
                <button key={f.value} onClick={() => set("fontFamily", f.value)}
                  className="px-3 py-2.5 rounded-xl text-[13px] text-left transition-all"
                  style={{
                    fontFamily: `'${f.value}', sans-serif`,
                    ...(design.fontFamily === f.value
                      ? { background: "rgba(74,158,255,0.12)", color: "#4a9eff", border: "1px solid rgba(74,158,255,0.3)" }
                      : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }
                    ),
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {/* Watermark Q */}
        <Section title="Filigrane Q">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-white/60">Afficher le «&nbsp;Q&nbsp;» en fond</span>
            <button onClick={() => set("showQ", !design.showQ)}
              className="w-11 h-6 rounded-full transition-all relative"
              style={{ background: design.showQ ? "rgba(74,158,255,0.5)" : "rgba(255,255,255,0.1)" }}>
              <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: design.showQ ? "calc(100% - 20px)" : 4 }} />
            </button>
          </div>
          {design.showQ && (
            <Field label={`Opacité : ${Math.round(design.qOpacity * 100)}%`}>
              <input type="range" min={1} max={30} value={Math.round(design.qOpacity * 100)}
                onChange={(e) => set("qOpacity", Number(e.target.value) / 100)}
                className="q-range w-full"
                style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties} />
            </Field>
          )}
        </Section>

        {/* Sauvegarder */}
        {saveErr && (
          <p className="text-[12px] text-red-400 px-1">{saveErr}</p>
        )}
        <button
          onClick={handleSave} disabled={saving}
          className="w-full py-3.5 rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          style={saveOk
            ? { background: "rgba(39,174,96,0.12)", border: "1px solid rgba(39,174,96,0.3)", color: "#27ae60" }
            : { background: "linear-gradient(135deg,#2c7be5,#4a9eff)", boxShadow: "0 8px 24px -8px rgba(44,123,229,0.5)", color: "#fff", border: "none" }
          }
        >
          {saving ? (
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
          ) : saveOk ? "✓ Carte sauvegardée !" : <><Save size={15}/> Sauvegarder la carte</>}
        </button>
      </div>

      {/* ── Panneau droit : aperçu ── */}

      {/* Spacer : réserve la place dans le flex sans contenu */}
      <div className="hidden xl:block xl:w-[490px] xl:flex-shrink-0" />

      {/* Panel fixe — couvre toute la hauteur viewport, passe sur le header */}
      <div
        className="xl:fixed xl:top-0 xl:right-0 xl:w-[490px] xl:h-screen xl:overflow-y-auto xl:z-20
                   sticky top-0 w-full"
        style={{ background: "#0b1220", borderLeft: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="p-5 space-y-4">
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Eye size={14} color="#4a9eff" />
              <span className="text-[13px] font-semibold">Aperçu en temps réel</span>
            </div>
            <LoyaltyCard design={design} clientName="Pierre" currentStamps={previewStamps} />
            <p className="text-[11px] text-white/20 text-center mt-3">
              {previewStamps} tampon{previewStamps > 1 ? "s" : ""} affichés pour l&apos;aperçu
            </p>
          </div>

          {/* Pass numérique QR */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[11px] text-white/30 mb-3 uppercase tracking-widest">Pass numérique (QR)</p>
            <WalletPassCard design={design} clientName="Pierre" />
          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── Micro-composants ────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <SectionTitle>{title}</SectionTitle>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] text-white/40 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-[13px] text-white outline-none transition-all"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(74,158,255,0.5)"; }}
      onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
    />
  );
}

/* ─── QR placeholder SVG ──────────────────────────────────────────── */

function QRPlaceholder({ size = 136 }: { size?: number }) {
  const N = 21;
  const cell = size / N;

  const filled = (r: number, c: number): boolean => {
    // Finder top-left (7×7)
    if (r < 7 && c < 7) {
      return r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    }
    // Finder top-right (7×7)
    if (r < 7 && c >= 14) {
      const lc = c - 14;
      return r === 0 || r === 6 || lc === 0 || lc === 6 || (r >= 2 && r <= 4 && lc >= 2 && lc <= 4);
    }
    // Finder bottom-left (7×7)
    if (r >= 14 && c < 7) {
      const lr = r - 14;
      return lr === 0 || lr === 6 || c === 0 || c === 6 || (lr >= 2 && lr <= 4 && c >= 2 && c <= 4);
    }
    // Separator quiet zones
    if (r === 7 || c === 7) return false;
    // Timing strips
    if (r === 6 && c >= 8 && c <= 12) return c % 2 === 0;
    if (c === 6 && r >= 8 && r <= 12) return r % 2 === 0;
    // Alignment pattern at (16,16)
    if (r >= 14 && r <= 18 && c >= 14 && c <= 18) {
      const lr = r - 14; const lc = c - 14;
      return lr === 0 || lr === 4 || lc === 0 || lc === 4 || (lr === 2 && lc === 2);
    }
    // Data cells — pseudo-random deterministic
    return ((r * 31 + c * 17 + r * c * 7 + r + c) % 100) > 48;
  };

  const rects: React.ReactElement[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (filled(r, c)) {
        rects.push(
          <rect key={`${r}-${c}`} x={c * cell + 0.15} y={r * cell + 0.15}
            width={cell - 0.3} height={cell - 0.3} fill="#000" rx={0.6} />
        );
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {rects}
    </svg>
  );
}

/* ─── WalletPassCard ──────────────────────────────────────────────── */

function WalletPassCard({ design: raw, clientName }: { design: CardDesign; clientName: string }) {
  const d: CardDesign = { ...DEFAULT_DESIGN, ...raw };

  const bgStyle =
    d.bgType === "gradient" && d.bgColors?.length > 1
      ? { background: `linear-gradient(${d.bgGradientAngle}deg, ${d.bgColors.join(", ")})` }
      : { background: d.bgColors?.[0] ?? "#141626" };

  const accentFirst = d.accentColors?.[0] ?? "#FF2D78";

  return (
    <div
      style={{
        ...bgStyle,
        borderRadius: 24,
        overflow: "hidden",
        fontFamily: `'${d.fontFamily}', sans-serif`,
        boxShadow: `0 24px 60px -16px ${accentFirst}44`,
        position: "relative",
        width: "100%",
      }}
    >
      {/* Watermark Q */}
      {d.showQ && (
        <div
          style={{
            position: "absolute",
            right: "4%",
            top: "50%",
            transform: "translateY(-48%)",
            fontSize: 160,
            fontWeight: 900,
            color: d.textColor,
            opacity: d.qOpacity,
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            fontFamily: `'${d.fontFamily}', sans-serif`,
          }}
        >Q</div>
      )}

      {/* Zone haut : identité */}
      <div style={{ padding: "20px 20px 0", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{
              fontSize: 20, fontWeight: 900, color: d.textColor,
              textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0,
            }}>
              {d.cardName}
            </p>
            <p style={{
              fontSize: 9, fontWeight: 700, color: d.textColor,
              opacity: 0.5, letterSpacing: "0.12em", margin: "3px 0 0",
            }}>
              CARTE FIDÉLITÉ
            </p>
          </div>

          {/* Badge wallet */}
          <div style={{
            background: `${accentFirst}22`,
            border: `1px solid ${accentFirst}44`,
            borderRadius: 10,
            padding: "7px 9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* Wallet icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="5" width="20" height="14" rx="3" stroke={d.textColor} strokeWidth="1.8" strokeOpacity="0.7"/>
              <path d="M16 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" fill={d.textColor} fillOpacity="0.7"/>
              <path d="M2 9h20" stroke={d.textColor} strokeWidth="1.8" strokeOpacity="0.5"/>
            </svg>
          </div>
        </div>

        {/* Titulaire */}
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: d.textColor, opacity: 0.4, letterSpacing: "0.1em", margin: 0 }}>
            TITULAIRE
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: d.textColor, margin: "3px 0 0" }}>
            {clientName}
          </p>
        </div>
      </div>

      {/* Séparateur */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "18px 20px" }} />

      {/* Zone QR */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "0 20px 26px", gap: 14, position: "relative", zIndex: 1,
      }}>
        <div style={{
          background: "#ffffff",
          borderRadius: 18,
          padding: 14,
          boxShadow: "0 12px 32px -8px rgba(0,0,0,0.35)",
        }}>
          <QRPlaceholder size={140} />
        </div>

        <p style={{
          fontSize: 9, fontWeight: 600, color: d.textColor,
          opacity: 0.3, letterSpacing: "0.1em", textTransform: "uppercase",
          margin: 0, textAlign: "center",
        }}>
          Scanner pour accéder à votre carte
        </p>
      </div>
    </div>
  );
}
