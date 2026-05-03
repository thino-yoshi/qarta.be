"use client";
import React, { useState, useRef, useCallback } from "react";
import { Pencil, X, Loader2 } from "lucide-react";

type Status = "idle" | "saving" | "saved" | "error" | "notfound";

// Elements whose subtree we never touch
const SKIP =
  "header, nav, button, a, script, style, [data-floating-edit], [data-edit-span], svg, input, textarea, footer, code, pre";

export default function FloatingEditButton() {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [lastFile, setLastFile] = useState("");
  const editSpans = useRef<Array<{ span: HTMLSpanElement; original: string }>>([]);

  /* ── Save one text change ─────────────────────────────────── */
  const save = useCallback(async (original: string, updated: string) => {
    // Normalize whitespace (JSX collapses newlines to spaces)
    const a = original.replace(/\s+/g, " ").trim();
    const b = updated.replace(/\s+/g, " ").trim();
    if (!a || a === b) return;

    setStatus("saving");
    try {
      const res = await fetch("/api/update-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original: a, updated: b }),
      });
      const data = await res.json();
      if (data.ok) {
        setLastFile(data.file ?? "");
        setStatus("saved");
      } else {
        setStatus(data.message === "not-found" ? "notfound" : "error");
      }
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3500);
  }, []);

  /* ── Enable edit mode ─────────────────────────────────────── */
  const enable = () => {
    // Walk every TEXT NODE in the page (not elements — nodes)
    // Each text node maps 1-to-1 with a literal string in the JSX source
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = (node.textContent ?? "").trim();
        // Skip empty / very short / pure-numeric
        if (text.length < 3) return NodeFilter.FILTER_REJECT;
        if (/^\d+(\.\d+)?$/.test(text)) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        // Skip forbidden zones
        if (parent.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes: Text[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) textNodes.push(n as Text);

    for (const textNode of textNodes) {
      const original = textNode.textContent ?? "";
      if (!original.trim()) continue;

      // Wrap the raw text node in an editable <span>
      const span = document.createElement("span");
      span.setAttribute("data-edit-span", "1");
      span.contentEditable = "true";
      span.textContent = original;
      span.style.cssText =
        "outline:1.5px dashed rgba(74,158,255,0.55);outline-offset:2px;border-radius:2px;cursor:text;white-space:inherit;";

      textNode.parentNode?.replaceChild(span, textNode);
      editSpans.current.push({ span, original });

      // Save on blur (when user clicks away)
      span.addEventListener("blur", () => {
        save(original, span.textContent ?? "");
      });
    }

    setEditMode(true);
    setStatus("idle");
  };

  /* ── Disable edit mode ────────────────────────────────────── */
  const disable = () => {
    for (const { span } of editSpans.current) {
      const textNode = document.createTextNode(span.textContent ?? "");
      span.parentNode?.replaceChild(textNode, span);
    }
    editSpans.current = [];
    setEditMode(false);
    setStatus("idle");
  };

  /* ── Badge ────────────────────────────────────────────────── */
  const badge: { text: string; bg: string } | null =
    status === "saving"
      ? { text: "Enregistrement…", bg: "#0f2044" }
      : status === "saved"
      ? { text: `✓ Sauvegardé — ${lastFile}`, bg: "#16a34a" }
      : status === "notfound"
      ? { text: "⚠ Texte introuvable — dites-moi lequel", bg: "#d97706" }
      : status === "error"
      ? { text: "✗ Erreur API", bg: "#dc2626" }
      : editMode
      ? { text: "✏ Cliquez sur un texte pour l'éditer", bg: "#0f2044" }
      : null;

  return (
    <div
      data-floating-edit=""
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2.5 pointer-events-none select-none"
    >
      {badge && (
        <div
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white text-[11px] font-semibold tracking-wide shadow-lg transition-colors duration-300"
          style={{ background: badge.bg, maxWidth: 360 }}
        >
          {status === "saving" && (
            <Loader2 size={11} className="animate-spin flex-shrink-0" />
          )}
          {status === "idle" && editMode && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff] animate-pulse inline-block flex-shrink-0" />
          )}
          <span className="truncate">{badge.text}</span>
        </div>
      )}

      <button
        onMouseDown={(e) => e.preventDefault()} // prevent accidental blur before click
        onClick={editMode ? disable : enable}
        className="pointer-events-auto rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          width: 52,
          height: 52,
          background: editMode
            ? "linear-gradient(135deg, #16a34a, #15803d)"
            : "linear-gradient(135deg, #0f2044, #0b1220)",
          boxShadow: editMode
            ? "0 10px 28px -8px rgba(22,163,74,0.65)"
            : "0 10px 28px -8px rgba(15,32,68,0.6)",
        }}
        title={editMode ? "Terminer l'édition" : "Modifier les textes"}
      >
        {editMode ? (
          <X size={20} color="white" strokeWidth={2.5} />
        ) : (
          <Pencil size={18} color="white" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
