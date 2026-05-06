"use client";
import { useState } from "react";
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
    <div className="flex flex-col xl:flex-row gap-6">

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
      <div className="xl:w-[480px] flex-shrink-0">
      <div className="sticky top-6 space-y-4">
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Eye size={14} color="#4a9eff" />
            <span className="text-[13px] font-semibold">Aperçu en temps réel</span>
          </div>

          {/* Carte preview avec tampons exemple */}
          <LoyaltyCard design={design} clientName="Pierre" currentStamps={previewStamps} />

          <p className="text-[11px] text-white/20 text-center mt-3">
            {previewStamps} tampon{previewStamps > 1 ? "s" : ""} affichés pour l&apos;aperçu
          </p>
        </div>

        {/* Preview fond vide (0 tampon) */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[11px] text-white/30 mb-3 uppercase tracking-widest">Carte vierge (nouveau client)</p>
          <LoyaltyCard design={design} clientName="Nouveau client" currentStamps={0} />
        </div>
      </div>
      </div>{/* end sticky wrapper */}

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
