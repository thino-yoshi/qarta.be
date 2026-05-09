"use client";
import React, { useState } from "react";
import type { MenuCard } from "@/lib/content/sections";

interface Props {
  content?: Record<string, unknown>;
}

const BADGE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  "Populaire":  { bg: "rgba(244,162,43,0.15)", color: "#f4a22b", border: "rgba(244,162,43,0.3)" },
  "Nouveau":    { bg: "rgba(44,123,229,0.12)", color: "#4a9eff", border: "rgba(74,158,255,0.3)" },
  "Végétarien": { bg: "rgba(39,174,96,0.12)",  color: "#27ae60", border: "rgba(39,174,96,0.3)"  },
  "Vegan":      { bg: "rgba(39,174,96,0.12)",  color: "#27ae60", border: "rgba(39,174,96,0.3)"  },
};

function CardBadge({ badge }: { badge: string }) {
  if (!badge) return null;
  const s = BADGE_STYLES[badge] ?? { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "rgba(255,255,255,0.15)" };
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {badge}
    </span>
  );
}

/* ── Card in Grid layout ── */
function GridCard({ item }: { item: MenuCard }) {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-0.5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 20px -8px rgba(0,0,0,0.4)" }}>
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-[rgba(255,255,255,0.04)] overflow-hidden">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-20">🍽</span>
          </div>
        )}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5">
            <CardBadge badge={item.badge} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-bold text-white leading-snug flex-1">{item.name}</h3>
          <span className="text-[15px] font-bold shrink-0" style={{ color: "var(--q-accent, #2c7be5)" }}>
            {item.price ? `€${item.price}` : ""}
          </span>
        </div>
        {item.category && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">{item.category}</span>
        )}
        {item.description && (
          <p className="text-[12px] text-white/50 leading-relaxed mt-0.5 line-clamp-2">{item.description}</p>
        )}
      </div>
    </div>
  );
}

/* ── Card in List layout ── */
function ListCard({ item }: { item: MenuCard }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
      {/* Image */}
      <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl opacity-20">🍽</div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-[14px] font-bold text-white">{item.name}</h3>
          <CardBadge badge={item.badge} />
        </div>
        {item.description && <p className="text-[12px] text-white/45 mt-0.5 truncate">{item.description}</p>}
        {item.category && <span className="text-[10px] font-semibold uppercase tracking-widest text-white/25">{item.category}</span>}
      </div>

      {/* Price */}
      <span className="text-[16px] font-bold shrink-0" style={{ color: "var(--q-accent, #2c7be5)" }}>
        {item.price ? `€${item.price}` : "—"}
      </span>
    </div>
  );
}

/* ── Card in Mosaic layout ── */
function MosaicCard({ item, large }: { item: MenuCard; large?: boolean }) {
  return (
    <div className={`rounded-2xl overflow-hidden relative ${large ? "row-span-2" : ""}`}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Image */}
      <div className={`w-full overflow-hidden ${large ? "aspect-[3/4]" : "aspect-[4/3]"}`}
        style={{ background: "rgba(255,255,255,0.04)" }}>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={`${large ? "text-6xl" : "text-4xl"} opacity-15`}>🍽</span>
          </div>
        )}
      </div>

      {/* Overlay footer */}
      <div className="absolute bottom-0 inset-x-0 p-3" style={{ background: "linear-gradient(to top, rgba(11,18,32,0.95), transparent)" }}>
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            {item.badge && <div className="mb-1"><CardBadge badge={item.badge} /></div>}
            <h3 className={`font-bold text-white leading-tight ${large ? "text-[15px]" : "text-[13px]"}`}>{item.name}</h3>
            {large && item.description && <p className="text-[11px] text-white/50 mt-0.5 line-clamp-2">{item.description}</p>}
          </div>
          {item.price && (
            <span className={`font-bold shrink-0 ${large ? "text-[18px]" : "text-[14px]"}`} style={{ color: "var(--q-accent, #2c7be5)" }}>
              €{item.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ MAIN COMPONENT ══════════════════════════ */
export default function MenuSection({ content }: Props) {
  const c = content ?? {};
  const visible    = (c.visible    as boolean) ?? false;
  const badge      = (c.badge      as string)  ?? "Notre menu";
  const title      = (c.title      as string)  ?? "Découvrez notre carte";
  const subtitle   = (c.subtitle   as string)  ?? "";
  const layout     = (c.layout     as string)  ?? "grid-3";
  const showFilter = (c.showFilter as boolean) ?? true;
  const items      = (c.items      as MenuCard[]) ?? [];

  const [activeCategory, setActiveCategory] = useState<string>("Tous");

  // Don't render if not visible or no items
  if (!visible || items.length === 0) return null;

  // Extract unique categories
  const allCategories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
  const categories    = allCategories.length > 1 ? ["Tous", ...allCategories] : [];

  const filtered = (showFilter && activeCategory !== "Tous")
    ? items.filter(i => i.category === activeCategory)
    : items;

  return (
    <section
      id="menu"
      className="relative py-20 lg:py-28"
      style={{ background: "var(--q-light, #faf8f4)" }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-1/4 right-[-5%] w-[35vw] h-[35vw] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(44,123,229,0.25), transparent 60%)" }} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eaf2fd] text-[#2c7be5] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4">
            {badge}
          </span>
          <h2 className="font-display text-[#0f2044]"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.08, letterSpacing: "0.04em", fontWeight: 600 }}>
            {title}
          </h2>
          {subtitle && <p className="mt-4 text-[#47526a] text-[17px] leading-relaxed max-w-xl mx-auto">{subtitle}</p>}
        </div>

        {/* Category filter */}
        {showFilter && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
                style={activeCategory === cat
                  ? { background: "var(--q-primary, #0f2044)", color: "#fff", boxShadow: "0 8px 20px -8px rgba(15,32,68,0.4)" }
                  : { background: "rgba(15,32,68,0.06)", color: "#0f2044", border: "1px solid rgba(15,32,68,0.12)" }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Cards */}
        {layout === "list" ? (
          <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden px-4 py-2"
            style={{ background: "#fff", boxShadow: "0 8px 40px -12px rgba(15,32,68,0.12)", border: "1px solid rgba(15,32,68,0.06)" }}>
            {/* Force dark text on list layout since bg is white */}
            <style>{`#menu .list-item-text { color: #0f2044 !important; }`}</style>
            {filtered.map(item => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0" style={{ borderColor: "rgba(15,32,68,0.08)" }}>
                <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "rgba(15,32,68,0.06)" }}>
                  {item.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl opacity-30">🍽</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[14px] font-bold text-[#0f2044]">{item.name}</h3>
                    <CardBadge badge={item.badge} />
                  </div>
                  {item.description && <p className="text-[12px] text-[#47526a] mt-0.5 truncate">{item.description}</p>}
                  {item.category && <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0f2044]/30">{item.category}</span>}
                </div>
                <span className="text-[16px] font-bold shrink-0" style={{ color: "var(--q-accent, #2c7be5)" }}>
                  {item.price ? `€${item.price}` : "—"}
                </span>
              </div>
            ))}
          </div>

        ) : layout === "mosaic" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ gridAutoRows: "200px" }}>
            {filtered.map((item, i) => (
              <MosaicCard key={item.id} item={item} large={i % 5 === 0} />
            ))}
          </div>

        ) : layout === "grid-2" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {filtered.map(item => <GridCard key={item.id} item={item} />)}
          </div>

        ) : (
          /* grid-3 default */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => <GridCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </section>
  );
}
