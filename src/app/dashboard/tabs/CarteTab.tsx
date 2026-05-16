"use client";
import React, { useState, useEffect } from "react";
import { Save, Plus, Minus, ImageIcon } from "lucide-react";
import { WalletCard, CardDesign, DEFAULT_DESIGN, FONT_OPTIONS } from "@/app/components/LoyaltyCard";

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

/* ─── Presets couleurs ───────────────────────────────────────────── */
const COLOR_PRESETS = [
  // Rangée 1
  { name:"Rose Nuit",   bg:["#FF2D78","#985986"], acc:["#FF2D78","#9B59B6"], txt:"#ffffff", angle:135, type:"gradient" as const },
  { name:"Nuit Dorée",  bg:["#141626","#2c1f50"], acc:["#F5C842"],           txt:"#F5C842", angle:135, type:"gradient" as const },
  { name:"Émeraude",   bg:["#1B4332","#2d6a4f"], acc:["#95D5B2"],           txt:"#d8f3dc", angle:135, type:"gradient" as const },
  { name:"Cobalt",      bg:["#03045E","#0096C7"], acc:["#90E0EF"],           txt:"#CAF0F8", angle:135, type:"gradient" as const },
  { name:"Craie",       bg:["#F5F0E8"],           acc:["#2c1f50"],           txt:"#2c1f50", angle:135, type:"color"    as const },
  { name:"Braise",      bg:["#F94144","#F8961E"], acc:["#F8961E"],           txt:"#ffffff", angle:135, type:"gradient" as const },
  // Rangée 2
  { name:"Lavande",     bg:["#4A1D96","#7C3AED"], acc:["#DDD6FE"],           txt:"#EDE9FE", angle:135, type:"gradient" as const },
  { name:"Bordeaux",    bg:["#4C0519","#881337"], acc:["#FCA5A5"],           txt:"#FEE2E2", angle:135, type:"gradient" as const },
  { name:"Teal Glacé",  bg:["#134E4A","#0F766E"], acc:["#2DD4BF"],           txt:"#CCFBF1", angle:135, type:"gradient" as const },
  { name:"Café",        bg:["#292524","#44403C"], acc:["#D6B896"],           txt:"#F5EFE8", angle:135, type:"gradient" as const },
  { name:"Sakura",      bg:["#FFF0F5"],           acc:["#DB2777"],           txt:"#831843", angle:135, type:"color"    as const },
  { name:"Soleil",      bg:["#92400E","#B45309"], acc:["#FDE68A"],           txt:"#FEF3C7", angle:135, type:"gradient" as const },
] as const;

/* ─── CarteTab ───────────────────────────────────────────────────── */

export default function CarteTab({ merchant, loyaltyCard }: Props) {
  const saved = loyaltyCard?.card_design as Partial<CardDesign> | undefined;

  const [design, setDesign] = useState<CardDesign>({
    ...DEFAULT_DESIGN,
    cardName: (merchant?.business_name as string) ?? "Mon Commerce",
    ...saved,
  });

  const [saving,        setSaving]        = useState(false);
  const [saveOk,        setSaveOk]        = useState(false);
  const [saveErr,       setSaveErr]       = useState<string | null>(null);
  const [previewStamps] = useState(3);
  const [previewPoints] = useState(720);
  const [loyaltyTab,    setLoyaltyTab]    = useState<"stamps" | "points">("stamps");
  const [editorTab,     setEditorTab]     = useState<"compact" | "wallet">("compact");
  const [imgUploading,  setImgUploading]  = useState(false);
  const [imgError,      setImgError]      = useState<string | null>(null);

  // Charger la carte créée pendant l'onboarding (si présente)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("qarta_pending_card");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CardDesign>;
        setDesign((d) => ({ ...d, ...parsed }));
        if (parsed.loyaltyMode) setLoyaltyTab(parsed.loyaltyMode);
        localStorage.removeItem("qarta_pending_card");
      }
    } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync loyaltyTab → design.loyaltyMode
  useEffect(() => {
    set("loyaltyMode", loyaltyTab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loyaltyTab]);

  const set = <K extends keyof CardDesign>(key: K, val: CardDesign[K]) =>
    setDesign((d) => ({ ...d, [key]: val }));

  const applyPreset = (p: typeof COLOR_PRESETS[number]) => {
    setDesign((d) => ({
      ...d,
      bgType:          p.type,
      bgColors:        [...p.bg],
      bgGradientAngle: p.angle,
      accentColors:    [...p.acc],
      accentAngle:     p.angle,
      textColor:       p.txt,
      bgImageUrl:      null,   // reset l'image si présente
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgUploading(true);
    setImgError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/loyalty-card/upload-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur upload");
      set("bgImageUrl", data.url);
    } catch (e: unknown) {
      setImgError(e instanceof Error ? e.message : "Erreur");
    }
    setImgUploading(false);
    // reset input so même fichier peut être re-sélectionné
    e.target.value = "";
  };

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

        {/* ── Onglets mode fidélité (niveau 1) ── */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {([["stamps", "🎯  Tampons"], ["points", "⭐  Points"]] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setLoyaltyTab(tab)}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={loyaltyTab === tab
                ? { background: "linear-gradient(135deg,rgba(74,158,255,0.18),rgba(155,89,182,0.12))", color: "#fff", border: "1px solid rgba(74,158,255,0.3)" }
                : { color: "rgba(255,255,255,0.3)", border: "1px solid transparent" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* ─── Onglet COMPACT ─── */}
        {editorTab === "compact" && <>

        {/* Identité */}
        <Section title="Identité de la carte">
          <Field label="Nom affiché sur la carte">
            <TextInput value={design.cardName} onChange={(v) => set("cardName", v)} placeholder="Ex : BARBER" />
          </Field>
          <Field label={loyaltyTab === "points" ? "Label des points" : "Label des tampons"}>
            <TextInput value={design.stampLabel} onChange={(v) => set("stampLabel", v)}
              placeholder={loyaltyTab === "points" ? "Ex : POINTS CUMULÉS" : "Ex : COUPES COLLECTÉES"} />
          </Field>
          <Field label="Récompense">
            <TextInput value={design.rewardDescription} onChange={(v) => set("rewardDescription", v)} placeholder="Ex : coupe offerte" />
          </Field>
        </Section>

        {/* Tampons ou Objectif points */}
        {loyaltyTab === "stamps" ? (
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
        ) : (
        <Section title="Objectif de points">
          <Field label={`Points nécessaires pour la récompense : ${design.pointsGoal.toLocaleString()}`}>
            <input type="range" min={100} max={5000} step={50} value={design.pointsGoal}
              onChange={(e) => set("pointsGoal", Number(e.target.value))}
              className="q-range w-full"
              style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties} />
          </Field>
          <Field label={`Taille du chiffre principal : ${design.compactPointsSize}px`}>
            <input type="range" min={28} max={96} value={design.compactPointsSize}
              onChange={(e) => set("compactPointsSize", Number(e.target.value))}
              className="q-range w-full"
              style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties} />
          </Field>
        </Section>
        )}

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
            <div className="space-y-3">
              {/* Zone upload / aperçu */}
              {design.bgImageUrl ? (
                <div className="relative rounded-xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  {/* Aperçu */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={design.bgImageUrl} alt="Fond de carte"
                    className="w-full object-cover"
                    style={{ height: 100 }}
                  />
                  {/* Overlay actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2"
                    style={{ background: "rgba(0,0,0,0.45)" }}>
                    <label className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all hover:scale-105"
                      style={{ background: "rgba(74,158,255,0.25)", border: "1px solid rgba(74,158,255,0.4)", color: "#4a9eff" }}>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                      {imgUploading ? "Upload…" : "Changer"}
                    </label>
                    <button
                      onClick={() => { set("bgImageUrl", null); setImgError(null); }}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all hover:scale-105"
                      style={{ background: "rgba(231,76,60,0.2)", border: "1px solid rgba(231,76,60,0.35)", color: "#e74c3c" }}>
                      Supprimer
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-2 px-4 py-6 rounded-xl cursor-pointer transition-all hover:border-white/25"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.15)" }}>
                  <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={imgUploading} />
                  {imgUploading
                    ? <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3"/>
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                      </svg>
                    : <ImageIcon size={20} className="text-white/25" />
                  }
                  <p className="text-[12px] text-white/50 font-medium">
                    {imgUploading ? "Upload en cours…" : "Cliquer pour choisir une image"}
                  </p>
                  <p className="text-[11px] text-white/25">JPG, PNG, WebP · max 5 MB</p>
                </label>
              )}

              {/* Erreur */}
              {imgError && <p className="text-[12px] text-red-400">{imgError}</p>}

              {/* Opacité — visible seulement si image chargée */}
              {design.bgImageUrl && (
                <Field label={`Opacité de l'image : ${Math.round(design.bgImageOpacity * 100)}%`}>
                  <input type="range" min={5} max={100} value={Math.round(design.bgImageOpacity * 100)}
                    onChange={(e) => set("bgImageOpacity", Number(e.target.value) / 100)}
                    className="q-range w-full"
                    style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties} />
                </Field>
              )}
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
        {saveErr && <p className="text-[12px] text-red-400 px-1">{saveErr}</p>}
        <SaveButton saving={saving} saveOk={saveOk} onClick={handleSave} />

        </> /* fin onglet compact */}

        {/* ─── Onglet WALLET ─── */}
        {editorTab === "wallet" && <>

          {/* Typographie */}
          <Section title="Typographie">
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

            <Field label={`Taille — nom du commerce : ${design.walletTitleSize}px`}>
              <input type="range" min={20} max={54} value={design.walletTitleSize}
                onChange={(e) => set("walletTitleSize", Number(e.target.value))}
                className="q-range w-full"
                style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties} />
            </Field>

            <Field label={`Taille — nom du client : ${design.walletNameSize}px`}>
              <input type="range" min={14} max={44} value={design.walletNameSize}
                onChange={(e) => set("walletNameSize", Number(e.target.value))}
                className="q-range w-full"
                style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties} />
            </Field>
          </Section>

          {/* Grille de tampons — masquée en mode points */}
          {loyaltyTab === "stamps" && (
          <Section title="Grille de tampons">
            <Field label={`Colonnes : ${Math.min(design.walletStampCols, design.stampsRequired)}`}>
              <div className="flex gap-1">
                {[3, 4, 5].map((n) => (
                  <button key={n} onClick={() => set("walletStampCols", n)}
                    className="flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all"
                    style={design.walletStampCols === n
                      ? { background: "rgba(74,158,255,0.15)", color: "#4a9eff", border: "1px solid rgba(74,158,255,0.3)" }
                      : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }
                    }>
                    {n} col.
                  </button>
                ))}
              </div>
            </Field>
          </Section>
          )}

          {/* Taille du chiffre — visible uniquement en mode points */}
          {loyaltyTab === "points" && (
          <Section title="Affichage des points">
            <Field label={`Taille du chiffre principal : ${design.walletPointsSize}px`}>
              <input type="range" min={28} max={96} value={design.walletPointsSize}
                onChange={(e) => set("walletPointsSize", Number(e.target.value))}
                className="q-range w-full"
                style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties} />
            </Field>
          </Section>
          )}

          {/* QR Code */}
          <Section title="QR Code">
            <Field label={`Taille : ${design.walletQRSize}px`}>
              <input type="range" min={80} max={200} value={design.walletQRSize}
                onChange={(e) => set("walletQRSize", Number(e.target.value))}
                className="q-range w-full"
                style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties} />
            </Field>
          </Section>

          {/* Mise en page */}
          <Section title="Mise en page">
            <Field label={`Padding interne : ${design.walletPadding}px`}>
              <input type="range" min={12} max={48} value={design.walletPadding}
                onChange={(e) => set("walletPadding", Number(e.target.value))}
                className="q-range w-full"
                style={{ "--q-thumb-color": design.accentColors[0] } as React.CSSProperties} />
            </Field>

            <div className="flex items-center justify-between">
              <span className="text-[13px] text-white/60">Cercles décoratifs en fond</span>
              <button onClick={() => set("walletShowCircles", !design.walletShowCircles)}
                className="w-11 h-6 rounded-full transition-all relative"
                style={{ background: design.walletShowCircles ? "rgba(74,158,255,0.5)" : "rgba(255,255,255,0.1)" }}>
                <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: design.walletShowCircles ? "calc(100% - 20px)" : 4 }} />
              </button>
            </div>
          </Section>

          {saveErr && <p className="text-[12px] text-red-400 px-1">{saveErr}</p>}
          <SaveButton saving={saving} saveOk={saveOk} onClick={handleSave} />

        </> /* fin onglet wallet */}

      </div>

      {/* ── Panneau droit : aperçu ── */}

      {/* Spacer */}
      <div className="hidden xl:block xl:w-[420px] xl:flex-shrink-0" />

      {/* Panel fixe — canvas crème · 420px → canvas 400px → carte 380px */}
      <div
        className="xl:fixed xl:top-[32px] xl:right-4 xl:w-[420px] xl:z-20 xl:rounded-2xl
                   sticky top-0 w-full flex flex-col items-center"
        style={{
          background: "#ede9e0",
          borderLeft: "1.5px solid rgba(200,180,140,0.45)",
          height: "calc(100vh - 64px)",
        }}
      >
        {/* Onglets en haut */}
        <div className="w-full px-2 pt-4 pb-0 flex-shrink-0">
          <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "rgba(58,48,40,0.08)" }}>
            {(["compact", "wallet"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setEditorTab(tab)}
                className="flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={editorTab === tab
                  ? { background: "rgba(58,48,40,0.15)", color: "#3a3028" }
                  : { color: "rgba(58,48,40,0.45)" }
                }
              >
                {tab === "compact" ? "🃏  Carte compacte" : "📱  Carte Wallet"}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas centré */}
        <div className="flex-1 flex items-center justify-center w-full px-2">
        {/* Canvas avec ombre derrière la carte */}
        <div style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 20,
          padding: "22px 10px",
          background: "radial-gradient(ellipse 92% 58% at 50% 50%, rgba(0,0,0,0.28) 0%, transparent 72%)",
        }}>
          <WalletCard
            key={editorTab}
            design={design}
            clientName="Pierre Dubois"
            currentStamps={previewStamps}
            currentPoints={previewPoints}
            defaultExpanded={editorTab === "wallet"}
          />
        </div>
        </div>{/* fin flex-1 centré */}

        {/* ── Thèmes prêts à l'emploi ── */}
        <div className="flex-shrink-0 w-full px-3 pb-4 pt-1">
          <p className="text-center mb-2" style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(58,48,40,0.38)"
          }}>
            Thèmes rapides
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {COLOR_PRESETS.map((p, i) => {
              const isActive =
                design.bgColors[0] === p.bg[0] &&
                design.accentColors[0] === p.acc[0];
              return (
                <button
                  key={i}
                  onClick={() => applyPreset(p)}
                  title={p.name}
                  style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: p.type === "gradient"
                      ? `linear-gradient(${p.angle}deg, ${[...p.bg].join(", ")})`
                      : p.bg[0],
                    border: isActive
                      ? "2.5px solid rgba(58,48,40,0.7)"
                      : "2px solid rgba(255,255,255,0.55)",
                    cursor: "pointer",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(58,48,40,0.15)"
                      : "0 2px 8px rgba(0,0,0,0.18)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {/* Dot accent en bas à droite */}
                  <span style={{
                    position: "absolute", bottom: 4, right: 4,
                    width: 9, height: 9, borderRadius: "50%",
                    background: p.acc[0],
                    border: "1.5px solid rgba(255,255,255,0.7)",
                  }} />
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

/* ─── Micro-composants ────────────────────────────────────────────── */

function SaveButton({ saving, saveOk, onClick }: { saving: boolean; saveOk: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick} disabled={saving}
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
  );
}

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

