import type { Metadata } from "next";
import "./globals.css";
import LiveThemeListener from "./components/LiveThemeListener";

export const metadata: Metadata = {
  title: "Qarta — Fidélité digitale",
  description: "Toutes vos cartes de fidélité réunies dans une seule application. Simple. Digital.",
  icons: {
    icon: "/logo-qarta.png",
    shortcut: "/logo-qarta.png",
    apple: "/logo-qarta.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">
        <LiveThemeListener />
        {/* Wrapper qui clippe les débordements horizontaux (halos .q-cursor-glow,
            blobs en -right-*) → supprime la bande blanche / le dézoom mobile.
            `overflow-x: clip` sur un div NON-racine clippe sans devenir un
            conteneur de scroll, donc window.scrollY et framer-motion (useScroll)
            continuent de fonctionner. Le header fixe n'est pas clippé (son bloc
            conteneur reste le viewport). */}
        <div style={{ overflowX: "clip" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
