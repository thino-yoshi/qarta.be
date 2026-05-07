"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { QartaLogo } from "@/app/components/QartaLogo";
import {
  Save, RefreshCw, ChevronRight, Plus, Trash2,
  ArrowUp, ArrowDown, ExternalLink, LayoutPanelLeft,
} from "lucide-react";
import {
  SECTION_DEFS, SectionDef, FieldDef,
  FieldListLink, FieldListText, getDefaults,
} from "@/lib/content/sections";

// ─── Types ────────────────────────────────────────────────────────────────────
type ContentMap = Record<string, unknown>;

const PAGES = [
  { id: "home",      label: "🏠 Accueil" },
  { id: "login",     label: "🔐 Connexion" },
  { id: "register",  label: "📋 Inscription" },
  { id: "dashboard", label: "🎛️ Dashboard" },
];

const PAGE_PREVIEW: Record<string, string> = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
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
  const [activeSection, setActiveSection] = useState("header");
  const [content,       setContent]       = useState<ContentMap>({});
  const [isDirty,       setIsDirty]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [savedMsg,      setSavedMsg]      = useState(false);
  const [loading,       setLoading]       = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sections    = SECTION_DEFS.filter(s => s.page === activePage);
  const sectionDef  = SECTION_DEFS.find(s => s.id === activeSection);

  // Switch page → reset to first section of that page
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
    // Refresh preview iframe
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const refreshPreview = () => {
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  };

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "100vh", fontFamily: "Manrope, sans-serif", background: "#0b1220", color: "#fff" }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-3 px-5 shrink-0"
        style={{
          height: 52,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {/* Logo + label */}
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
                  : { color: "rgba(255,255,255,0.4)",       border: "1px solid transparent" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          {isDirty && (
            <span className="text-[11px] text-amber-400/80 flex items-center gap-1">
              ● Modifications non sauvegardées
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
            {saving
              ? <RefreshCw size={13} className="animate-spin" />
              : <Save size={13} />
            }
            {savedMsg ? "Sauvegardé ✓" : saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
          <a
            href="/admin"
            className="text-[12px] text-white/25 hover:text-white/60 transition-colors"
          >
            ← Admin
          </a>
        </div>
      </header>

      {/* ── 3-col main layout ───────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: sections list */}
        <aside
          className="shrink-0 overflow-y-auto"
          style={{
            width: 200,
            borderRight: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/25">
            Sections
          </p>
          {sections.map(s => {
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-all"
                style={{
                  background:   active ? "rgba(74,158,255,0.08)" : "transparent",
                  borderRight:  active ? "2px solid #4a9eff"     : "2px solid transparent",
                  color:        active ? "#fff" : "rgba(255,255,255,0.45)",
                }}
              >
                <span className="text-[15px]">{s.icon}</span>
                <span className="text-[12px] font-medium flex-1">{s.label}</span>
                {active && <ChevronRight size={11} style={{ color: "#4a9eff" }} />}
              </button>
            );
          })}
        </aside>

        {/* CENTER: field editor */}
        <div
          className="shrink-0 overflow-y-auto"
          style={{
            width: 360,
            borderRight: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.015)",
            padding: "20px",
          }}
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
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#e8ecf0" }}>
          {/* Preview bar */}
          <div
            className="flex items-center gap-2 px-4 shrink-0 text-[11px]"
            style={{
              height: 36,
              background: "rgba(0,0,0,0.5)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <ExternalLink size={11} />
            <span className="flex-1">
              Aperçu — <span style={{ color: "rgba(255,255,255,0.5)" }}>{PAGE_PREVIEW[activePage]}</span>
              &nbsp;· sauvegardez pour voir vos modifications
            </span>
            <button
              onClick={refreshPreview}
              className="flex items-center gap-1.5 hover:text-white/70 transition-colors"
            >
              <RefreshCw size={11} /> Actualiser
            </button>
          </div>

          {/* Iframe */}
          <iframe
            ref={iframeRef}
            src={PAGE_PREVIEW[activePage]}
            className="flex-1 w-full border-0"
            title="Aperçu de la page"
          />
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
  if (field.type === "text" || field.type === "url") {
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <input
          type={field.type === "url" ? "text" : "text"}
          value={(value as string) ?? ""}
          onChange={e => onChange(e.target.value)}
          className={inputBase}
          style={inputStyle}
          placeholder={field.defaultValue}
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className={labelClass}>{field.label}</label>
        <textarea
          rows={3}
          value={(value as string) ?? ""}
          onChange={e => onChange(e.target.value)}
          className={`${inputBase} resize-none`}
          style={inputStyle}
          placeholder={field.defaultValue}
        />
      </div>
    );
  }

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
                className="p-1.5 rounded-lg transition-colors"
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

  if (field.type === "list-link") {
    const f     = field as FieldListLink;
    const items = (value as { label: string; href: string }[]) ?? f.defaultValue;
    const move = (from: number, to: number) => {
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
                {/* Up/down */}
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    onClick={() => idx > 0 && move(idx, idx - 1)}
                    disabled={idx === 0}
                    className="disabled:opacity-20 transition-opacity"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    <ArrowUp size={11} />
                  </button>
                  <button
                    onClick={() => idx < items.length - 1 && move(idx, idx + 1)}
                    disabled={idx === items.length - 1}
                    className="disabled:opacity-20 transition-opacity"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    <ArrowDown size={11} />
                  </button>
                </div>

                {/* Inputs */}
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={item.label}
                    onChange={e => {
                      const n = [...items]; n[idx] = { ...n[idx], label: e.target.value }; onChange(n);
                    }}
                    placeholder="Libellé"
                    className={inputBase}
                    style={{ ...inputStyle, padding: "6px 10px", fontSize: "12px" }}
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={e => {
                      const n = [...items]; n[idx] = { ...n[idx], href: e.target.value }; onChange(n);
                    }}
                    placeholder="Lien (ex: #hero ou /page)"
                    className={inputBase}
                    style={{ ...inputStyle, padding: "6px 10px", fontSize: "12px" }}
                  />
                </div>

                {/* Delete */}
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
