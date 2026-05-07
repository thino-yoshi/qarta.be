"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { QartaLogo } from "@/app/components/QartaLogo";
import {
  Save, RefreshCw, ChevronRight, Plus, Trash2,
  ArrowUp, ArrowDown, ExternalLink, LayoutPanelLeft,
  Monitor, Smartphone, Eye, EyeOff,
} from "lucide-react";
import {
  SECTION_DEFS, SectionDef, FieldDef,
  FieldListLink, FieldListText, FieldSelect, FieldNumber, getDefaults,
} from "@/lib/content/sections";

// ─── Types ────────────────────────────────────────────────────────────────────
type ContentMap = Record<string, unknown>;
type Viewport   = "desktop" | "mobile";

const PAGES = [
  { id: "home",      label: "🏠 Accueil" },
  { id: "login",     label: "🔐 Connexion" },
  { id: "register",  label: "📋 Inscription" },
  { id: "dashboard", label: "🎛️ Dashboard" },
];

// Use dedicated preview routes for pages that have auth redirects
const PAGE_PREVIEW: Record<string, string> = {
  home:      "/",
  login:     "/admin/editor/preview/login",
  register:  "/admin/editor/preview/register",
  dashboard: "/admin/editor/preview/dashboard",
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputBase =
  "w-full px-3 py-2.5 rounded-xl text-[13px] text-white placeholder-white/25 " +
  "focus:outline-none focus:border-[#4a9eff] transition-colors";
const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
};
const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5";

// ─── Main shell ───────────────────────────────────────────────────────────────
export default function EditorShell({ userEmail }: { userEmail: string }) {
  const [activePage,    setActivePage]    = useState("home");
  const [activeSection, setActiveSection] = useState("branding");
  const [content,       setContent]       = useState<ContentMap>({});
  const [isDirty,       setIsDirty]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [savedMsg,      setSavedMsg]      = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [viewport,      setViewport]      = useState<Viewport>("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sections    = SECTION_DEFS.filter(s => s.page === activePage);
  const sectionDef  = SECTION_DEFS.find(s => s.id === activeSection);

  const switchPage = (pageId: string) => {
    setActivePage(pageId);
    const first = SECTION_DEFS.find(s => s.page === pageId);
    if (first) setActiveSection(first.id);
  };

  // Load content when section changes
  useEffect(() => {
    if (!sectionDef) return;
    setLoading(true);
    fetch(`/api/admin/content?page=${activePage}&section=${activeSection}`)
      .then(r => r.json())
      .then(data => {
        const defaults = getDefaults(sectionDef);
        setContent({ ...defaults, ...(data ?? {}) });
        setIsDirty(false);
      })
      .catch(() => setContent(getDefaults(sectionDef!)))
      .finally(() => setLoading(false));
  }, [activePage, activeSection]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateField = useCallback((key: string, value: unknown) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: activePage, section: activeSection, content }),
    });
    setSaving(false);
    setIsDirty(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
    // Refresh preview iframe after save
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  };

  const refreshPreview = () => {
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  };

  const mobileWidth = 390;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "100vh", fontFamily: "Manrope, sans-serif", background: "#0b1220", color: "#fff" }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 52, borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mr-3">
          <QartaLogo size={26} variant="badge" />
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-white/50">
            <LayoutPanelLeft size={13} />
            Éditeur
          </div>
        </div>

        {/* Page tabs */}
        <div className="flex items-center gap-1">
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => switchPage(p.id)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
              style={
                activePage === p.id
                  ? { background: "rgba(74,158,255,0.15)", color: "#4a9eff", border: "1px solid rgba(74,158,255,0.3)" }
                  : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Viewport toggle */}
        <div
          className="ml-3 flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={() => setViewport("desktop")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all"
            style={viewport === "desktop"
              ? { background: "rgba(74,158,255,0.2)", color: "#4a9eff" }
              : { color: "rgba(255,255,255,0.35)" }}
            title="Vue desktop"
          >
            <Monitor size={13} /> Desktop
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all"
            style={viewport === "mobile"
              ? { background: "rgba(74,158,255,0.2)", color: "#4a9eff" }
              : { color: "rgba(255,255,255,0.35)" }}
            title="Vue mobile"
          >
            <Smartphone size={13} /> Mobile
          </button>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          {isDirty && (
            <span className="text-[11px] text-amber-400/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Modifications non sauvegardées
            </span>
          )}
          {savedMsg && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
              ✓ Sauvegardé — rechargez la prévisualisation
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-40"
            style={{
              background: isDirty ? "#4a9eff" : "rgba(255,255,255,0.08)",
              color: isDirty ? "#0f2044" : "rgba(255,255,255,0.35)",
            }}
          >
            {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
          <a href="/admin" className="text-[12px] text-white/25 hover:text-white/60 transition-colors">
            ← Admin
          </a>
        </div>
      </header>

      {/* ── 3-col main layout ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: sections list */}
        <aside
          className="shrink-0 overflow-y-auto"
          style={{ width: 200, borderRight: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)" }}
        >
          <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/25">Sections</p>
          {sections.map(s => {
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-all"
                style={{
                  background:  active ? "rgba(74,158,255,0.08)" : "transparent",
                  borderRight: active ? "2px solid #4a9eff" : "2px solid transparent",
                  color:       active ? "#fff" : "rgba(255,255,255,0.45)",
                }}
              >
                <span className="text-[15px]">{s.icon}</span>
                <span className="text-[12px] font-medium flex-1 leading-snug">{s.label}</span>
                {active && <ChevronRight size={11} style={{ color: "#4a9eff" }} />}
              </button>
            );
          })}
        </aside>

        {/* CENTER: field editor */}
        <div
          className="shrink-0 overflow-y-auto"
          style={{ width: 360, borderRight: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)", padding: "20px" }}
        >
          {sectionDef ? (
            loading ? (
              <div className="flex items-center justify-center h-24 text-white/30 text-[13px]">
                <RefreshCw size={14} className="animate-spin mr-2" /> Chargement…
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <h2 className="text-[15px] font-bold">{sectionDef.icon} {sectionDef.label}</h2>
                  {sectionDef.description && (
                    <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {sectionDef.description}
                    </p>
                  )}
                </div>
                <div className="space-y-5">
                  {sectionDef.fields.map(field => (
                    <FieldEditor
                      key={field.key}
                      field={field}
                      value={content[field.key]}
                      onChange={val => updateField(field.key, val)}
                    />
                  ))}
                </div>
              </>
            )
          ) : (
            <p className="text-white/25 text-[13px]">Sélectionnez une section.</p>
          )}
        </div>

        {/* RIGHT: preview iframe */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#1a1f2e" }}>
          {/* Preview bar */}
          <div
            className="flex items-center gap-2 px-4 shrink-0 text-[11px]"
            style={{ height: 36, background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}
          >
            <ExternalLink size={11} />
            <span className="flex-1 truncate">
              Aperçu —{" "}
              <span style={{ color: "rgba(255,255,255,0.55)" }}>{PAGE_PREVIEW[activePage]}</span>
              {isDirty && <span className="ml-2 text-amber-400/60">· sauvegardez pour voir vos modifications</span>}
            </span>
            <button
              onClick={refreshPreview}
              className="flex items-center gap-1.5 hover:text-white/70 transition-colors shrink-0"
            >
              <RefreshCw size={11} /> Actualiser
            </button>
          </div>

          {/* Iframe wrapper — center in mobile mode */}
          <div
            className="flex-1 overflow-auto flex items-start"
            style={{
              background: viewport === "mobile" ? "#0d1117" : "#e8ecf0",
              justifyContent: viewport === "mobile" ? "center" : "stretch",
              paddingTop: viewport === "mobile" ? "24px" : "0",
              paddingBottom: viewport === "mobile" ? "24px" : "0",
            }}
          >
            {viewport === "mobile" ? (
              /* ── Mobile phone shell ── */
              <div
                style={{
                  width: mobileWidth,
                  height: 780,
                  borderRadius: 44,
                  background: "#111",
                  boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.08)",
                  overflow: "hidden",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {/* Notch */}
                <div style={{
                  position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
                  width: 100, height: 26, background: "#111", borderRadius: 14, zIndex: 10,
                }} />
                <iframe
                  ref={iframeRef}
                  src={PAGE_PREVIEW[activePage]}
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: 44 }}
                  title="Aperçu mobile"
                />
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={PAGE_PREVIEW[activePage]}
                className="flex-1 w-full border-0 h-full"
                title="Aperçu desktop"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Field editor ─────────────────────────────────────────────────────────────
function FieldEditor({
  field, value, onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  // ── Text / textarea / url / image ─────────────────────────────────────────
  if (field.type === "text" || field.type === "textarea" || field.type === "url" || field.type === "image") {
    const strVal = (value as string) ?? "";
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        {field.type === "textarea" ? (
          <textarea
            rows={3}
            value={strVal}
            onChange={e => onChange(e.target.value)}
            className={`${inputBase} resize-none`}
            style={inputStyle}
            placeholder={field.defaultValue}
          />
        ) : (
          <>
            <input
              type="text"
              value={strVal}
              onChange={e => onChange(e.target.value)}
              className={inputBase}
              style={inputStyle}
              placeholder={field.defaultValue}
            />
            {/* Image preview thumbnail */}
            {field.type === "image" && strVal && (
              <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.10)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={strVal} alt="aperçu" className="w-full max-h-32 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── Color picker ─────────────────────────────────────────────────────────
  if (field.type === "color") {
    const hex = (value as string) ?? field.defaultValue;
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <div className="flex items-center gap-3">
          <label
            className="relative cursor-pointer shrink-0"
            style={{ width: 42, height: 42 }}
            title="Choisir une couleur"
          >
            <div
              className="w-full h-full rounded-xl border-2"
              style={{ background: hex, borderColor: "rgba(255,255,255,0.15)" }}
            />
            <input
              type="color"
              value={hex}
              onChange={e => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
          <input
            type="text"
            value={hex}
            onChange={e => onChange(e.target.value)}
            className={inputBase}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: "12px" }}
            placeholder="#000000"
            maxLength={9}
          />
        </div>
      </div>
    );
  }

  // ── Toggle switch ─────────────────────────────────────────────────────────
  if (field.type === "toggle") {
    const checked = (value as boolean) ?? field.defaultValue;
    return (
      <div className="flex items-center justify-between gap-4">
        <label className="text-[12px] font-semibold text-white/70 leading-snug">{field.label}</label>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className="shrink-0 relative transition-all duration-200"
          style={{
            width: 44, height: 24, borderRadius: 12,
            background: checked ? "#4a9eff" : "rgba(255,255,255,0.12)",
            border: checked ? "none" : "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <span
            className="absolute top-[3px] transition-all duration-200"
            style={{
              left: checked ? 22 : 3,
              width: 18, height: 18,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}
          />
        </button>
      </div>
    );
  }

  // ── Select dropdown ───────────────────────────────────────────────────────
  if (field.type === "select") {
    const f   = field as FieldSelect;
    const val = (value as string) ?? f.defaultValue;
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <select
          value={val}
          onChange={e => onChange(e.target.value)}
          className={`${inputBase} cursor-pointer appearance-none`}
          style={inputStyle}
        >
          {f.options.map((opt, i) => (
            <option key={opt} value={opt} style={{ background: "#0b1220" }}>
              {f.optionLabels?.[i] ?? opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ── Number ────────────────────────────────────────────────────────────────
  if (field.type === "number") {
    const f   = field as FieldNumber;
    const val = (value as number) ?? f.defaultValue;
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <input
          type="number"
          value={val}
          min={f.min}
          max={f.max}
          step={f.step ?? 1}
          onChange={e => onChange(Number(e.target.value))}
          className={inputBase}
          style={inputStyle}
        />
      </div>
    );
  }

  // ── List of strings ───────────────────────────────────────────────────────
  if (field.type === "list-text") {
    const f     = field as FieldListText;
    const items = (value as string[]) ?? f.defaultValue;
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={e => {
                  const next = [...items];
                  next[idx] = e.target.value;
                  onChange(next);
                }}
                className={`flex-1 ${inputBase}`}
                style={inputStyle}
              />
              <button
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="p-1.5 rounded-lg transition-colors shrink-0"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange([...items, ""])}
            className="flex items-center gap-1.5 text-[12px] transition-colors mt-1"
            style={{ color: "#4a9eff" }}
          >
            <Plus size={13} /> Ajouter
          </button>
        </div>
      </div>
    );
  }

  // ── List of links ─────────────────────────────────────────────────────────
  if (field.type === "list-link") {
    const f     = field as FieldListLink;
    const items = (value as { label: string; href: string }[]) ?? f.defaultValue;
    const move  = (from: number, to: number) => {
      const n = [...items];
      [n[from], n[to]] = [n[to], n[from]];
      onChange(n);
    };
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl p-3 space-y-2"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1 pt-1">
                  <button onClick={() => idx > 0 && move(idx, idx - 1)} disabled={idx === 0}
                    className="disabled:opacity-20 transition-opacity" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <ArrowUp size={11} />
                  </button>
                  <button onClick={() => idx < items.length - 1 && move(idx, idx + 1)} disabled={idx === items.length - 1}
                    className="disabled:opacity-20 transition-opacity" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <ArrowDown size={11} />
                  </button>
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text" value={item.label} placeholder="Libellé"
                    onChange={e => { const n = [...items]; n[idx] = { ...n[idx], label: e.target.value }; onChange(n); }}
                    className={inputBase}
                    style={{ ...inputStyle, padding: "6px 10px", fontSize: "12px" }}
                  />
                  <input
                    type="text" value={item.href} placeholder="Lien (ex: #hero ou /page)"
                    onChange={e => { const n = [...items]; n[idx] = { ...n[idx], href: e.target.value }; onChange(n); }}
                    className={inputBase}
                    style={{ ...inputStyle, padding: "6px 10px", fontSize: "12px" }}
                  />
                </div>
                <button
                  onClick={() => onChange(items.filter((_, i) => i !== idx))}
                  className="p-1.5 rounded-lg mt-1 shrink-0 transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => onChange([...items, { label: "", href: "" }])}
            className="flex items-center gap-1.5 text-[12px] transition-colors mt-1"
            style={{ color: "#4a9eff" }}
          >
            <Plus size={13} /> Ajouter un lien
          </button>
        </div>
      </div>
    );
  }

  return null;
}
