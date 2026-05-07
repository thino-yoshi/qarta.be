"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar({ content }: { content?: Record<string, unknown> }) {
  const [dismissed, setDismissed] = useState(false);

  const c          = content ?? {};
  const visible    = (c.visible    as boolean) ?? false;
  const text       = (c.text       as string)  ?? "";
  const link       = (c.link       as string)  ?? "#";
  const linkLabel  = (c.linkLabel  as string)  ?? "";
  const bgColor    = (c.bgColor    as string)  ?? "#0f2044";
  const textColor  = (c.textColor  as string)  ?? "#faf8f4";

  if (!visible || dismissed || !text) return null;

  return (
    <div
      className="q-announcement-bar"
      style={{ background: bgColor, color: textColor }}
    >
      <span>{text}</span>
      {linkLabel && link && (
        <a href={link} style={{ color: textColor }}>
          {linkLabel}
        </a>
      )}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Fermer"
        style={{ color: textColor }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
