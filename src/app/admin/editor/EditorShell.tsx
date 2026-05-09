"use client";

import React, { useState, useEffect, useRef, useCallback, useReducer } from "react";
import { QartaLogo } from "@/app/components/QartaLogo";
import {
  Save, RefreshCw, ChevronRight, ChevronDown, Plus, Trash2,
  ArrowUp, ArrowDown, ExternalLink, LayoutPanelLeft,
  Monitor, Smartphone, GripVertical, RotateCcw, RotateCw, Search, X,
} from "lucide-react";
import {
  SECTION_DEFS, SectionDef, FieldDef, FieldGroup,
  FieldListLink, FieldListText, FieldSelect, FieldNumber, FieldMenuCards, MenuCard, getDefaults,
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

// ─── Undo/Redo reducer ────────────────────────────────────────────────────────
type HistoryState = { past: ContentMap[]; present: ContentMap; future: ContentMap[] };
type HistoryAction =
  | { type: "SET"; payload: ContentMap }
  | { type: "UPDATE"; key: string; value: unknown }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET"; payload: ContentMap };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "UPDATE": {
      const next = { ...state.present, [action.key]: action.value };
      return {
        past: [...state.past.slice(-19), state.present],
        present: next,
        future: [],
      };
    }
    case "UNDO": {
      if (!state.past.length) return state;
      const prev = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        present: prev,
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      if (!state.future.length) return state;
      const next = state.future[0];
      return {
        past: [...state.past, state.present],
        present: next,
        future: state.future.slice(1),
      };
    }
    case "RESET":
      return { past: [], present: action.payload, future: [] };
    default:
      return state;
  }
}

// ─── CSS live vars builder ────────────────────────────────────────────────────
function buildThemeCSS(content: ContentMap): string {
  const primary   = (content.primaryColor   as string) || "#0f2044";
  const accent    = (content.accentColor    as string) || "#2c7be5";
  const highlight = (content.highlightColor as string) || "#4a9eff";
  const light     = (content.lightBg        as string) || "#faf8f4";
  const btnStyle  = (content.buttonStyle    as string) || "pill";
  const radius    = btnStyle === "square" ? "8px" : btnStyle === "rounded" ? "16px" : "999px";
  return `:root{--q-primary:${primary};--q-accent:${accent};--q-highlight:${highlight};--q-light:${light};--q-btn-radius:${radius};}`;
}

// ─── Color history (localStorage) ────────────────────────────────────────────
const COLOR_HISTORY_KEY = "qarta_color_history";
function loadColorHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(COLOR_HISTORY_KEY) ?? "[]"); } catch { return []; }
}
function saveColorHistory(hex: string, prev: string[]): string[] {
  const next = [hex, ...prev.filter(c => c !== hex)].slice(0, 12);
  try { localStorage.setItem(COLOR_HISTORY_KEY, JSON.stringify(next)); } catch { /* */ }
  return next;
}

// ─── Main shell ───────────────────────────────────────────────────────────────
export default function EditorShell({ userEmail }: { userEmail: string }) {
  const [activePage,    setActivePage]    = useState("home");
  const [activeSection, setActiveSection] = useState("branding");
  const [isDirty,       setIsDirty]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [savedMsg,      setSavedMsg]      = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [viewport,      setViewport]      = useState<Viewport>("desktop");
  const [searchQuery,   setSearchQuery]   = useState("");
  const [openGroups,    setOpenGroups]    = useState<Set<string>>(new Set());
  const [colorHistory,  setColorHistory]  = useState<string[]>([]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // History/undo reducer
  const [{ present: content, past, future }, dispatch] = useReducer(historyReducer, {
    past: [], present: {}, future: [],
  });

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const sections    = SECTION_DEFS.filter(s => s.page === activePage);
  const sectionDef  = SECTION_DEFS.find(s => s.id === activeSection);

  // Filtered sections by search
  const filteredSections = searchQuery.trim()
    ? sections.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : sections;

  // Load color history on mount
  useEffect(() => { setColorHistory(loadColorHistory()); }, []);

  const switchPage = (pageId: string) => {
    setActivePage(pageId);
    const first = SECTION_DEFS.find(s => s.page === pageId);
    if (first) setActiveSection(first.id);
    setSearchQuery("");
  };

  // Load content when section changes
  useEffect(() => {
    if (!sectionDef) return;
    setLoading(true);
    fetch(`/api/admin/content?page=${activePage}&section=${activeSection}`)
      .then(r => r.json())
      .then(data => {
        const defaults = getDefaults(sectionDef);
        const loaded = { ...defaults, ...(data ?? {}) };
        dispatch({ type: "RESET", payload: loaded });
        setIsDirty(false);
        // Init open groups
        const initOpen = new Set<string>();
        sectionDef.groups?.forEach(g => { if (g.defaultOpen) initOpen.add(g.id); });
        setOpenGroups(initOpen);
      })
      .catch(() => {
        dispatch({ type: "RESET", payload: getDefaults(sectionDef!) });
      })
      .finally(() => setLoading(false));
  }, [activePage, activeSection]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateField = useCallback((key: string, value: unknown) => {
    dispatch({ type: "UPDATE", key, value });
    setIsDirty(true);
  }, []);

  // Live CSS update on color change (branding section)
  const sendLiveCSS = useCallback((updatedContent: ContentMap) => {
    if (activeSection !== "branding") return;
    const css = buildThemeCSS(updatedContent);
    iframeRef.current?.contentWindow?.postMessage({ type: "QARTA_LIVE_CSS", css }, "*");
  }, [activeSection]);

  const updateColor = useCallback((key: string, hex: string) => {
    dispatch({ type: "UPDATE", key, value: hex });
    setIsDirty(true);
    // Live preview
    const updated = { ...content, [key]: hex };
    sendLiveCSS(updated);
    // Color history
    setColorHistory(prev => saveColorHistory(hex, prev));
  }, [content, sendLiveCSS]);

  const handleSave = useCallback(async () => {
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
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  }, [isDirty, activePage, activeSection, content]);

  const refreshPreview = () => {
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "s") { e.preventDefault(); handleSave(); }
      if (mod && !e.shiftKey && e.key === "z") { e.preventDefault(); if (canUndo) { dispatch({ type: "UNDO" }); setIsDirty(true); } }
      if (mod && e.shiftKey && e.key === "z")  { e.preventDefault(); if (canRedo) { dispatch({ type: "REDO" }); setIsDirty(true); } }
      if (mod && e.key === "y") { e.preventDefault(); if (canRedo) { dispatch({ type: "REDO" }); setIsDirty(true); } }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave, canUndo, canRedo]);

  const resetField = (key: string) => {
    const def = sectionDef?.fields.find(f => f.key === key);
    if (!def) return;
    dispatch({ type: "UPDATE", key, value: def.defaultValue });
    setIsDirty(true);
  };

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const mobileWidth = 390;

  return (
    <div className="flex flex-col overflow-hidden"
      style={{ height: "100vh", fontFamily: "Manrope, sans-serif", background: "#0b1220", color: "#fff" }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 shrink-0"
        style={{ height: 52, borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
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
            <button key={p.id} onClick={() => switchPage(p.id)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
              style={activePage === p.id
                ? { background: "rgba(74,158,255,0.15)", color: "#4a9eff", border: "1px solid rgba(74,158,255,0.3)" }
                : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Viewport toggle */}
        <div className="ml-3 flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setViewport("desktop")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all"
            style={viewport === "desktop" ? { background: "rgba(74,158,255,0.2)", color: "#4a9eff" } : { color: "rgba(255,255,255,0.35)" }}>
            <Monitor size={13} /> Desktop
          </button>
          <button onClick={() => setViewport("mobile")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all"
            style={viewport === "mobile" ? { background: "rgba(74,158,255,0.2)", color: "#4a9eff" } : { color: "rgba(255,255,255,0.35)" }}>
            <Smartphone size={13} /> Mobile
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 ml-2">
          <button onClick={() => { if (canUndo) { dispatch({ type: "UNDO" }); setIsDirty(true); } }}
            disabled={!canUndo} title="Annuler (Ctrl+Z)"
            className="p-1.5 rounded-lg disabled:opacity-25 transition-all hover:bg-white/8"
            style={{ color: canUndo ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}>
            <RotateCcw size={13} />
          </button>
          <button onClick={() => { if (canRedo) { dispatch({ type: "REDO" }); setIsDirty(true); } }}
            disabled={!canRedo} title="Rétablir (Ctrl+Shift+Z)"
            className="p-1.5 rounded-lg disabled:opacity-25 transition-all hover:bg-white/8"
            style={{ color: canRedo ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}>
            <RotateCw size={13} />
          </button>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          {isDirty && (
            <span className="text-[11px] text-amber-400/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Non sauvegardé
            </span>
          )}
          {savedMsg && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">✓ Sauvegardé</span>
          )}
          <button onClick={handleSave} disabled={saving || !isDirty}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all disabled:opacity-40"
            style={{ background: isDirty ? "#4a9eff" : "rgba(255,255,255,0.08)", color: isDirty ? "#0f2044" : "rgba(255,255,255,0.35)" }}
            title="Sauvegarder (Ctrl+S)">
            {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
          <a href="/admin" className="text-[12px] text-white/25 hover:text-white/60 transition-colors">← Admin</a>
        </div>
      </header>

      {/* ── 3-col main layout ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — sections list */}
        <aside className="shrink-0 overflow-y-auto flex flex-col"
          style={{ width: 210, borderRight: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.25)" }}>
          {/* Search */}
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher…"
                className="w-full pl-8 pr-7 py-2 rounded-xl text-[12px] text-white placeholder-white/25 focus:outline-none transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/25">
            {filteredSections.length} section{filteredSections.length !== 1 ? "s" : ""}
          </p>
          {filteredSections.map(s => {
            const active = activeSection === s.id;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-all"
                style={{
                  background:  active ? "rgba(74,158,255,0.08)" : "transparent",
                  borderRight: active ? "2px solid #4a9eff" : "2px solid transparent",
                  color:       active ? "#fff" : "rgba(255,255,255,0.45)",
                }}>
                <span className="text-[15px]">{s.icon}</span>
                <span className="text-[12px] font-medium flex-1 leading-snug">{s.label}</span>
                {active && <ChevronRight size={11} style={{ color: "#4a9eff" }} />}
              </button>
            );
          })}
        </aside>

        {/* CENTER — field editor */}
        <div className="shrink-0 overflow-y-auto flex flex-col"
          style={{ width: 370, borderRight: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}>
          {sectionDef ? (
            loading ? (
              <div className="flex items-center justify-center h-24 text-white/30 text-[13px] mt-8">
                <RefreshCw size={14} className="animate-spin mr-2" /> Chargement…
              </div>
            ) : (
              <>
                {/* Section header */}
                <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <h2 className="text-[15px] font-bold">{sectionDef.icon} {sectionDef.label}</h2>
                  {sectionDef.description && (
                    <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{sectionDef.description}</p>
                  )}
                </div>

                {/* Fields — with groups if defined, flat otherwise */}
                <div className="flex-1 p-4">
                  {sectionDef.groups && sectionDef.groups.length > 0
                    ? <GroupedFields
                        sectionDef={sectionDef as SectionDef & { groups: FieldGroup[] }}
                        content={content}
                        openGroups={openGroups}
                        toggleGroup={toggleGroup}
                        updateField={updateField}
                        updateColor={updateColor}
                        resetField={resetField}
                        colorHistory={colorHistory}
                        defaults={getDefaults(sectionDef)}
                      />
                    : <FlatFields
                        fields={sectionDef.fields}
                        content={content}
                        updateField={updateField}
                        updateColor={updateColor}
                        resetField={resetField}
                        colorHistory={colorHistory}
                        defaults={getDefaults(sectionDef)}
                      />
                  }
                </div>
              </>
            )
          ) : (
            <p className="text-white/25 text-[13px] p-5">Sélectionnez une section.</p>
          )}
        </div>

        {/* RIGHT — preview iframe */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#1a1f2e" }}>
          {/* Preview bar */}
          <div className="flex items-center gap-2 px-4 shrink-0 text-[11px]"
            style={{ height: 36, background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>
            <ExternalLink size={11} />
            <span className="flex-1 truncate">
              Aperçu — <span style={{ color: "rgba(255,255,255,0.55)" }}>{PAGE_PREVIEW[activePage]}</span>
              {isDirty && activeSection !== "branding" && (
                <span className="ml-2 text-amber-400/60">· sauvegardez pour voir les modifications</span>
              )}
              {activeSection === "branding" && (
                <span className="ml-2 text-emerald-400/70">· couleurs mises à jour en direct ✦</span>
              )}
            </span>
            <button onClick={refreshPreview} className="flex items-center gap-1.5 hover:text-white/70 transition-colors shrink-0">
              <RefreshCw size={11} /> Actualiser
            </button>
          </div>

          {/* Iframe wrapper */}
          <div className="flex-1 overflow-auto flex items-start"
            style={{
              background: viewport === "mobile" ? "#0d1117" : "#e8ecf0",
              justifyContent: viewport === "mobile" ? "center" : "stretch",
              paddingTop: viewport === "mobile" ? "24px" : "0",
              paddingBottom: viewport === "mobile" ? "24px" : "0",
            }}>
            {viewport === "mobile" ? (
              <div style={{ width: mobileWidth, height: 780, borderRadius: 44, background: "#111", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.08)", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 100, height: 26, background: "#111", borderRadius: 14, zIndex: 10 }} />
                <iframe ref={iframeRef} src={PAGE_PREVIEW[activePage]} style={{ width: "100%", height: "100%", border: "none", borderRadius: 44 }} title="Aperçu mobile" />
              </div>
            ) : (
              <iframe ref={iframeRef} src={PAGE_PREVIEW[activePage]} className="flex-1 w-full border-0 h-full" title="Aperçu desktop" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Grouped fields renderer ──────────────────────────────────────────────────
function GroupedFields({
  sectionDef, content, openGroups, toggleGroup,
  updateField, updateColor, resetField, colorHistory, defaults,
}: {
  sectionDef: SectionDef & { groups: NonNullable<SectionDef["groups"]> };
  content: ContentMap; openGroups: Set<string>; toggleGroup: (id: string) => void;
  updateField: (k: string, v: unknown) => void; updateColor: (k: string, v: string) => void;
  resetField: (k: string) => void; colorHistory: string[]; defaults: ContentMap;
}) {
  // Fields not in any group
  const groupedKeys = new Set(sectionDef.groups.flatMap(g => g.fieldKeys));
  const ungrouped = sectionDef.fields.filter(f => !groupedKeys.has(f.key));

  return (
    <div className="space-y-2">
      {sectionDef.groups.map(group => {
        const groupFields = group.fieldKeys
          .map(key => sectionDef.fields.find(f => f.key === key))
          .filter(Boolean) as typeof sectionDef.fields;
        const isOpen = openGroups.has(group.id);

        return (
          <div key={group.id} className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Accordion header */}
            <button onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left transition-all hover:bg-white/5"
              style={{ background: isOpen ? "rgba(74,158,255,0.07)" : "rgba(255,255,255,0.03)" }}>
              <span className="text-[14px]">{group.icon ?? "▸"}</span>
              <span className="flex-1 text-[12px] font-semibold text-white/80">{group.label}</span>
              <ChevronDown size={13} className="transition-transform" style={{ color: "rgba(255,255,255,0.3)", transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }} />
            </button>

            {/* Accordion content */}
            {isOpen && (
              <div className="p-4 space-y-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {groupFields.map(field => (
                  <FieldEditor
                    key={field.key} field={field} value={content[field.key]}
                    onChange={val => field.type === "color" ? updateColor(field.key, val as string) : updateField(field.key, val)}
                    onReset={() => resetField(field.key)}
                    defaultValue={defaults[field.key]}
                    colorHistory={colorHistory}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Ungrouped fields */}
      {ungrouped.length > 0 && (
        <div className="space-y-4 pt-2">
          {ungrouped.map(field => (
            <FieldEditor
              key={field.key} field={field} value={content[field.key]}
              onChange={val => field.type === "color" ? updateColor(field.key, val as string) : updateField(field.key, val)}
              onReset={() => resetField(field.key)}
              defaultValue={defaults[field.key]}
              colorHistory={colorHistory}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Flat fields renderer (no groups) ────────────────────────────────────────
function FlatFields({
  fields, content, updateField, updateColor, resetField, colorHistory, defaults,
}: {
  fields: FieldDef[]; content: ContentMap;
  updateField: (k: string, v: unknown) => void; updateColor: (k: string, v: string) => void;
  resetField: (k: string) => void; colorHistory: string[]; defaults: ContentMap;
}) {
  return (
    <div className="space-y-5">
      {fields.map(field => (
        <FieldEditor
          key={field.key} field={field} value={content[field.key]}
          onChange={val => field.type === "color" ? updateColor(field.key, val as string) : updateField(field.key, val)}
          onReset={() => resetField(field.key)}
          defaultValue={defaults[field.key]}
          colorHistory={colorHistory}
        />
      ))}
    </div>
  );
}

// ─── Individual field editor ──────────────────────────────────────────────────
function FieldEditor({
  field, value, onChange, onReset, defaultValue, colorHistory,
}: {
  field: FieldDef; value: unknown;
  onChange: (v: unknown) => void; onReset: () => void;
  defaultValue: unknown; colorHistory: string[];
}) {
  const isDefault = JSON.stringify(value) === JSON.stringify(defaultValue);

  const LabelRow = ({ children }: { children?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-1.5">
      <label className={labelClass} style={{ margin: 0 }}>{field.label}</label>
      <div className="flex items-center gap-1">
        {children}
        {!isDefault && (
          <button onClick={onReset} title="Réinitialiser"
            className="p-1 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.25)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f59e0b")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
            <RotateCcw size={11} />
          </button>
        )}
      </div>
    </div>
  );

  // ── Text / textarea / url / image ─────────────────────────────────────────
  if (field.type === "text" || field.type === "textarea" || field.type === "url" || field.type === "image") {
    const strVal = (value as string) ?? "";
    return (
      <div>
        <LabelRow />
        {field.type === "textarea" ? (
          <textarea rows={3} value={strVal} onChange={e => onChange(e.target.value)}
            className={`${inputBase} resize-none`} style={inputStyle} placeholder={field.defaultValue as string} />
        ) : (
          <>
            <input type="text" value={strVal} onChange={e => onChange(e.target.value)}
              className={inputBase} style={inputStyle} placeholder={field.defaultValue as string} />
            {field.type === "image" && strVal && (
              <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.10)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={strVal} alt="aperçu" className="w-full max-h-32 object-cover" onError={e => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── Color picker with history ─────────────────────────────────────────────
  if (field.type === "color") {
    const hex = (value as string) ?? (field.defaultValue as string);
    return (
      <div>
        <LabelRow />
        <div className="flex items-center gap-3">
          {/* Swatch + native picker */}
          <label className="relative cursor-pointer shrink-0" style={{ width: 42, height: 42 }}>
            <div className="w-full h-full rounded-xl border-2" style={{ background: hex, borderColor: "rgba(255,255,255,0.15)" }} />
            <input type="color" value={hex} onChange={e => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          </label>
          {/* Hex input */}
          <input type="text" value={hex} onChange={e => onChange(e.target.value)}
            className={inputBase}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: "12px" }}
            placeholder="#000000" maxLength={9} />
        </div>
        {/* Color history */}
        {colorHistory.length > 0 && (
          <div className="mt-2">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>Récents</p>
            <div className="flex flex-wrap gap-1.5">
              {colorHistory.map(c => (
                <button key={c} onClick={() => onChange(c)} title={c}
                  className="w-6 h-6 rounded-md border-2 transition-all hover:scale-110"
                  style={{ background: c, borderColor: c === hex ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.12)" }} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Toggle switch ─────────────────────────────────────────────────────────
  if (field.type === "toggle") {
    const checked = (value as boolean) ?? (field.defaultValue as boolean);
    return (
      <div className="flex items-center justify-between gap-4">
        <div>
          <label className="text-[12px] font-semibold text-white/70 leading-snug">{field.label}</label>
          {!isDefault && (
            <button onClick={onReset} className="ml-2 text-[10px] font-bold" style={{ color: "#f59e0b" }}>↺</button>
          )}
        </div>
        <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
          className="shrink-0 relative transition-all duration-200"
          style={{ width: 44, height: 24, borderRadius: 12, background: checked ? "#4a9eff" : "rgba(255,255,255,0.12)", border: checked ? "none" : "1px solid rgba(255,255,255,0.15)" }}>
          <span className="absolute top-[3px] transition-all duration-200"
            style={{ left: checked ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
        </button>
      </div>
    );
  }

  // ── Select — visual button group si ≤ 4 options, sinon dropdown ───────────
  if (field.type === "select") {
    const f   = field as FieldSelect;
    const val = (value as string) ?? f.defaultValue;
    // Visual icons for known selects
    const VISUAL_ICONS: Record<string, string[]> = {
      buttonStyle: ["⬭", "▢", "■"],
      layout:      ["▦▦", "▦▦▦", "☰", "⊞"],
    };
    const icons = VISUAL_ICONS[field.key];

    return (
      <div>
        <LabelRow />
        {f.options.length <= 4 ? (
          <div className="flex gap-2 flex-wrap">
            {f.options.map((opt, i) => (
              <button key={opt} onClick={() => onChange(opt)}
                className="flex-1 min-w-0 py-2.5 px-2 rounded-xl text-[11px] font-semibold transition-all flex flex-col items-center gap-1"
                style={val === opt
                  ? { background: "rgba(74,158,255,0.2)", color: "#4a9eff", border: "1px solid rgba(74,158,255,0.5)" }
                  : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.10)" }}>
                {icons && <span className="text-[16px]">{icons[i]}</span>}
                <span className="text-center leading-tight">{f.optionLabels?.[i] ?? opt}</span>
              </button>
            ))}
          </div>
        ) : (
          <select value={val} onChange={e => onChange(e.target.value)}
            className={`${inputBase} cursor-pointer appearance-none`} style={inputStyle}>
            {f.options.map((opt, i) => (
              <option key={opt} value={opt} style={{ background: "#0b1220" }}>
                {f.optionLabels?.[i] ?? opt}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }

  // ── Number — slider + input ───────────────────────────────────────────────
  if (field.type === "number") {
    const f   = field as FieldNumber;
    const val = (value as number) ?? f.defaultValue;
    const min = f.min ?? 0;
    const max = f.max ?? 100;
    return (
      <div>
        <LabelRow />
        <div className="flex items-center gap-3">
          <input type="range" value={val} min={min} max={max} step={f.step ?? 1}
            onChange={e => onChange(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "#4a9eff", background: `linear-gradient(to right, #4a9eff ${((val - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 0)` }}
          />
          <input type="number" value={val} min={min} max={max} step={f.step ?? 1}
            onChange={e => onChange(Number(e.target.value))}
            className="w-16 px-2 py-1.5 rounded-lg text-[12px] text-white text-center focus:outline-none"
            style={inputStyle} />
        </div>
      </div>
    );
  }

  // ── List of strings ───────────────────────────────────────────────────────
  if (field.type === "list-text") {
    const f     = field as FieldListText;
    const items = (value as string[]) ?? f.defaultValue;
    return (
      <div>
        <LabelRow />
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input type="text" value={item}
                onChange={e => { const n = [...items]; n[idx] = e.target.value; onChange(n); }}
                className={`flex-1 ${inputBase}`} style={inputStyle} />
              <button onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="p-1.5 rounded-lg transition-colors shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button onClick={() => onChange([...items, ""])}
            className="flex items-center gap-1.5 text-[12px] transition-colors mt-1" style={{ color: "#4a9eff" }}>
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
      const n = [...items]; [n[from], n[to]] = [n[to], n[from]]; onChange(n);
    };
    return (
      <div>
        <LabelRow />
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-xl p-3 space-y-2"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
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
                  <input type="text" value={item.label} placeholder="Libellé"
                    onChange={e => { const n = [...items]; n[idx] = { ...n[idx], label: e.target.value }; onChange(n); }}
                    className={inputBase} style={{ ...inputStyle, padding: "6px 10px", fontSize: "12px" }} />
                  <input type="text" value={item.href} placeholder="Lien (ex: #hero ou /page)"
                    onChange={e => { const n = [...items]; n[idx] = { ...n[idx], href: e.target.value }; onChange(n); }}
                    className={inputBase} style={{ ...inputStyle, padding: "6px 10px", fontSize: "12px" }} />
                </div>
                <button onClick={() => onChange(items.filter((_, i) => i !== idx))}
                  className="p-1.5 rounded-lg mt-1 shrink-0 transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => onChange([...items, { label: "", href: "" }])}
            className="flex items-center gap-1.5 text-[12px] transition-colors mt-1" style={{ color: "#4a9eff" }}>
            <Plus size={13} /> Ajouter un lien
          </button>
        </div>
      </div>
    );
  }

  // ── Menu cards builder ────────────────────────────────────────────────────
  if (field.type === "menu-cards") {
    const f     = field as FieldMenuCards;
    const cards = (value as MenuCard[]) ?? f.defaultValue;
    const BADGE_OPTIONS = ["", "Populaire", "Nouveau", "Végétarien", "Vegan"];

    const updateCard = (idx: number, key: keyof MenuCard, val: string) => {
      onChange(cards.map((c, i) => i === idx ? { ...c, [key]: val } : c));
    };
    const addCard = () => onChange([...cards, { id: `card-${Date.now()}`, category: "", name: "Nouveau plat", description: "", price: "", image: "", badge: "" }]);
    const removeCard = (idx: number) => onChange(cards.filter((_, i) => i !== idx));
    const moveCard = (from: number, to: number) => { const n = [...cards]; [n[from], n[to]] = [n[to], n[from]]; onChange(n); };

    return (
      <div>
        <LabelRow />
        <p className="text-[11px] text-white/30 mb-3">{cards.length} carte{cards.length !== 1 ? "s" : ""}</p>
        <div className="space-y-3">
          {cards.map((card, idx) => (
            <div key={card.id} className="rounded-xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
              {/* Card header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b"
                style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
                <GripVertical size={12} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="flex-1 text-[12px] font-semibold text-white/70 truncate">{card.name || "Nouvelle carte"}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => idx > 0 && moveCard(idx, idx - 1)} disabled={idx === 0} className="p-1 rounded disabled:opacity-20" style={{ color: "rgba(255,255,255,0.4)" }}><ArrowUp size={10} /></button>
                  <button onClick={() => idx < cards.length - 1 && moveCard(idx, idx + 1)} disabled={idx === cards.length - 1} className="p-1 rounded disabled:opacity-20" style={{ color: "rgba(255,255,255,0.4)" }}><ArrowDown size={10} /></button>
                  <button onClick={() => removeCard(idx)} className="p-1 rounded ml-1 transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#f87171")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}><Trash2 size={11} /></button>
                </div>
              </div>
              {/* Card fields */}
              <div className="p-3 space-y-2.5">
                <div className="flex gap-3 items-start">
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {card.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={card.image} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                      : <div className="w-full h-full flex items-center justify-center text-xl opacity-20">🍽</div>}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input type="text" value={card.name} placeholder="Nom du plat" onChange={e => updateCard(idx, "name", e.target.value)} className={`${inputBase} text-[12px]`} style={{ ...inputStyle, padding: "6px 10px" }} />
                    <input type="text" value={card.image} placeholder="URL image (https://...)" onChange={e => updateCard(idx, "image", e.target.value)} className={`${inputBase} text-[11px]`} style={{ ...inputStyle, padding: "5px 10px", color: "rgba(255,255,255,0.5)" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Catégorie</label>
                    <input type="text" value={card.category} placeholder="Ex : Plats" onChange={e => updateCard(idx, "category", e.target.value)} className={`${inputBase} text-[12px]`} style={{ ...inputStyle, padding: "6px 10px" }} />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Prix (€)</label>
                    <input type="text" value={card.price} placeholder="12.50" onChange={e => updateCard(idx, "price", e.target.value)} className={`${inputBase} text-[12px]`} style={{ ...inputStyle, padding: "6px 10px" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Description</label>
                  <textarea rows={2} value={card.description} placeholder="Ingrédients, description courte…" onChange={e => updateCard(idx, "description", e.target.value)} className={`${inputBase} resize-none text-[12px]`} style={{ ...inputStyle, padding: "6px 10px" }} />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Badge</label>
                  <div className="flex flex-wrap gap-1.5">
                    {BADGE_OPTIONS.map(b => (
                      <button key={b} type="button" onClick={() => updateCard(idx, "badge", b)}
                        className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
                        style={card.badge === b
                          ? { background: "rgba(74,158,255,0.2)", color: "#4a9eff", border: "1px solid rgba(74,158,255,0.4)" }
                          : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.10)" }}>
                        {b || "Aucun"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addCard}
          className="flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl text-[12px] font-semibold w-full justify-center transition-all"
          style={{ background: "rgba(74,158,255,0.08)", color: "#4a9eff", border: "1px solid rgba(74,158,255,0.2)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(74,158,255,0.15)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(74,158,255,0.08)")}>
          <Plus size={14} /> Ajouter une carte
        </button>
      </div>
    );
  }

  return null;
}
