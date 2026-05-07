"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QartaLogo, QartaWordmark } from "./QartaLogo";

const NAV = [
  { label: "Accueil",    href: "#hero",      scrollId: "hero" },
  { label: "Immersion",  href: "#immersion",  scrollId: "scroll-immersion" },
  { label: "Client",     href: "#client",     scrollId: "scroll-client" },
  { label: "Commerçant", href: "#merchant",   scrollId: "scroll-merchant" },
  { label: "Contact",    href: "#contact",    scrollId: "contact" },
  { label: "Tarif",      href: "#pricing",    scrollId: "pricing" },
];

const DEMO = { label: "Démo", href: "/register?role=merchant" };

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLanding = pathname === "/";

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!onLanding) return;
    e.preventDefault();
    const target =
      document.querySelector<HTMLElement>(`[data-testid="${id}"]`) ||
      document.getElementById(id);
    if (target) {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      data-testid="header-nav"
    >
      <div
        className="mx-auto max-w-7xl px-6 lg:px-10 transition-all duration-500"
        style={{ paddingTop: scrolled ? 10 : 20, paddingBottom: scrolled ? 10 : 20 }}
      >
        <div
          className={`flex items-center justify-between rounded-full transition-all duration-500 ${
            scrolled ? "glass-crystal px-4 py-2" : "px-2 py-1"
          }`}
        >
          <Link href="/" className="flex items-center gap-3 group" data-testid="header-logo-link">
            <QartaLogo size={40} variant="badge" />
            <QartaWordmark color={scrolled ? "#0f2044" : "#ffffff"} />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.scrollId ? (onLanding ? item.href : `/${item.href}`) : item.href}
                onClick={(e) => item.scrollId ? handleAnchor(e, item.scrollId) : undefined}
                className={`px-4 py-2 text-[14px] font-medium rounded-full transition-colors duration-200 ${
                  scrolled
                    ? "text-[#0f2044]/80 hover:text-[#2c7be5] hover:bg-[#2c7be5]/8"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                }`}
                data-testid={`header-nav-${item.scrollId || item.label}`}
              >
                {item.label}
              </a>
            ))}

            {/* Séparateur + bouton Démo */}
            <span className={`mx-1 h-4 w-px ${scrolled ? "bg-[#0f2044]/15" : "bg-white/20"}`} />
            <Link
              href={DEMO.href}
              className={`px-4 py-2 text-[14px] font-semibold rounded-full border transition-colors duration-200 ${
                scrolled
                  ? "border-[#0f2044]/20 text-[#0f2044] hover:bg-[#0f2044] hover:text-white"
                  : "border-white/30 text-white hover:bg-white hover:text-[#0f2044]"
              }`}
            >
              Démo
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={`hidden sm:inline-flex px-4 py-2 rounded-full text-[14px] font-semibold transition-colors ${
                scrolled ? "text-[#0f2044] hover:text-[#2c7be5]" : "text-white hover:text-[#cfe3ff]"
              }`}
              data-testid="header-login-link"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="q-btn-primary text-sm py-2 px-4"
              data-testid="header-register-link"
              style={{ padding: "8px 16px", fontSize: "14px" }}
            >
              Créer un compte
            </Link>

            {/* mobile menu */}
            <button
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() => setOpen(!open)}
              data-testid="header-mobile-toggle"
              style={{ background: scrolled ? "rgba(15,32,68,.06)" : "rgba(255,255,255,.1)" }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d={open ? "M4 4l12 12M16 4L4 16" : "M3 6h14M3 10h14M3 14h14"}
                  stroke={scrolled ? "#0f2044" : "#fff"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        {open && (
          <div className="md:hidden mt-2 glass-crystal rounded-3xl p-5 space-y-1 animate-card-in">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.scrollId ? (onLanding ? item.href : `/${item.href}`) : item.href}
                onClick={(e) => {
                  setOpen(false);
                  if (item.scrollId) handleAnchor(e, item.scrollId);
                }}
                className="block px-4 py-3 text-[#0f2044] font-medium rounded-2xl hover:bg-[#2c7be5]/10"
              >
                {item.label}
              </a>
            ))}
            <Link
              href={DEMO.href}
              className="block px-4 py-3 text-[#0f2044] font-semibold rounded-2xl hover:bg-[#0f2044]/8"
            >
              Démo
            </Link>
            <Link
              href="/login"
              className="block px-4 py-3 text-[#2c7be5] font-semibold rounded-2xl"
            >
              Connexion
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
