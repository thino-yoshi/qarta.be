import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qarta — Fidélité digitale",
  description: "Toutes vos cartes de fidélité réunies dans une seule application. Simple. Digital. Écologique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
