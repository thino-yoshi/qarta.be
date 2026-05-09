import type { Metadata } from "next";
import Hero from "./components/Hero";
import Header from "./components/Header";
import AnnouncementBar from "./components/AnnouncementBar";
import ScrollImmersion from "./components/ScrollImmersion";
import ScrollClient from "./components/ScrollClient";
import ScrollMerchant from "./components/ScrollMerchant";
import ScrollBusinesses from "./components/ScrollBusinesses";
import CTASection from "./components/CTASection";
import MenuSection from "./components/MenuSection";
import Footer from "./components/Footer";
import { getPageContent } from "@/lib/content/getContent";

// ── Dynamic metadata (SEO) — uses React cache, no double fetch ───────────────
export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("home");
  const seo = content.seo ?? {};
  return {
    title:       (seo.metaTitle       as string) || "Qarta — Fidélité digitale",
    description: (seo.metaDescription as string) || "Toutes vos cartes de fidélité réunies dans une seule application. Simple. Digital.",
    openGraph: {
      title:       (seo.ogTitle       as string) || undefined,
      description: (seo.ogDescription as string) || undefined,
      images:       seo.ogImage ? [(seo.ogImage as string)] : undefined,
      type: "website",
    },
  };
}

// ── Helper: build CSS variable overrides from branding section ────────────────
function buildThemeCSS(branding: Record<string, unknown>): string {
  const primary   = (branding.primaryColor   as string) || "#0f2044";
  const accent    = (branding.accentColor    as string) || "#2c7be5";
  const highlight = (branding.highlightColor as string) || "#4a9eff";
  const light     = (branding.lightBg        as string) || "#faf8f4";
  const btnStyle  = (branding.buttonStyle    as string) || "pill";
  const radius    = btnStyle === "square" ? "8px" : btnStyle === "rounded" ? "16px" : "999px";

  return `
    :root {
      --q-primary:    ${primary};
      --q-accent:     ${accent};
      --q-highlight:  ${highlight};
      --q-light:      ${light};
      --q-btn-radius: ${radius};
    }
  `.trim();
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function Home() {
  const content  = await getPageContent("home");
  const branding = (content.branding ?? {}) as Record<string, unknown>;
  const themeCSS = buildThemeCSS(branding);

  return (
    <main className="relative">
      {/* CSS variable overrides from branding editor */}
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />

      <AnnouncementBar content={content.announcement} />
      <Header content={content.header} />
      <Hero content={content.hero} />
      <ScrollImmersion content={content["scroll-immersion"]} />
      <ScrollClient    content={content["scroll-client"]} />
      <ScrollMerchant  content={content["scroll-merchant"]} />
      <ScrollBusinesses content={content["scroll-businesses"]} />
      <CTASection content={content.cta} />
      {/* Menu — visible uniquement si activé dans l'éditeur et qu'il y a des cartes */}
      <MenuSection content={content["menu-builder"]} />
      <Footer content={content.footer} />
    </main>
  );
}
