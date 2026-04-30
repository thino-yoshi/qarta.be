"use client";

import { ShaderGradientCanvas, ShaderGradient as ShaderGradientBase } from "shadergradient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ShaderGradient = ShaderGradientBase as any;

const PhoneMockup = () => (
  <div style={{
    width: "240px",
    height: "490px",
    background: "#0a0a1a",
    borderRadius: "38px",
    border: "7px solid #1a1a2e",
    boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
  }}>
    {/* Notch */}
    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "72px", height: "22px", background: "#0a0a1a", borderRadius: "0 0 14px 14px", zIndex: 10 }} />

    {/* App content */}
    <div style={{ padding: "36px 14px 14px", height: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", margin: 0 }}>Bonjour</p>
          <p style={{ color: "#fff", fontSize: "13px", fontWeight: 700, margin: 0 }}>Thomas</p>
        </div>
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#2C7BE5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700 }}>T</span>
        </div>
      </div>

      {/* Cards */}
      {[
        { name: "Café Léon", stamps: 7, total: 10, color: "#2C7BE5" },
        { name: "Boulangerie Martin", stamps: 4, total: 8, color: "#27AE60" },
        { name: "Librairie Cœur", stamps: 9, total: 10, color: "#7B4FBF" },
      ].map((card) => (
        <div key={card.name} style={{ background: card.color, borderRadius: "14px", padding: "12px", flexShrink: 0 }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "8px", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Carte fidélité</p>
          <p style={{ color: "#fff", fontSize: "12px", fontWeight: 700, margin: "0 0 8px" }}>{card.name}</p>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {Array.from({ length: card.total }).map((_, i) => (
              <div key={i} style={{ width: "14px", height: "14px", borderRadius: "50%", background: i < card.stamps ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", margin: "6px 0 0", textAlign: "right" }}>{card.stamps}/{card.total} tampons</p>
        </div>
      ))}
    </div>
  </div>
);

export default function Home() {
  return (
    <main>

      {/* ── TÉLÉPHONE FIXE ───────────────────────────────────────────── */}
      <div style={{ position: "fixed", right: "48px", top: "50%", transform: "translateY(-50%)", zIndex: 100, pointerEvents: "none" }}>
        <PhoneMockup />
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <ShaderGradientCanvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <ShaderGradient
            animate="on"
            brightness={1.2}
            cAzimuthAngle={200}
            cDistance={2.11}
            cPolarAngle={90}
            cameraZoom={1}
            color1="#001957"
            color2="#c4b5fd"
            color3="#00005e"
            destination="onCanvas"
            envPreset="city"
            fov={45}
            grain="on"
            lightType="3d"
            pixelDensity={1.8}
            positionX={-1.3}
            positionY={0}
            positionZ={0}
            range="enabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={60}
            rotationY={10}
            rotationZ={50}
            shader="defaults"
            type="plane"
            uAmplitude={1}
            uDensity={0.7}
            uFrequency={5.5}
            uSpeed={0.1}
            uStrength={6.2}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>

        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "60%", maxWidth: "700px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", mixBlendMode: "difference" }}>
            <h1 style={{ fontSize: "clamp(4rem, 12vw, 9rem)", fontWeight: 900, color: "white", letterSpacing: "-0.04em", lineHeight: 1, textAlign: "center", margin: 0 }}>
              Qarta
            </h1>
            <p style={{ color: "white", fontSize: "18px", textAlign: "center", lineHeight: 1.6, maxWidth: "480px", margin: 0 }}>
              La plateforme de fidélité qui connecte les commerçants à leurs clients — simplement, intelligemment.
            </p>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", mixBlendMode: "difference" }}>
          <span style={{ color: "white", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase" }}>Découvrir</span>
          <div style={{ width: "1px", height: "40px", background: "white", opacity: 0.5 }} />
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 80px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <p style={{ color: "#2C7BE5", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>La solution</p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "520px", marginBottom: "32px" }}>
          La fidélité, sans friction.
        </h2>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.8, maxWidth: "480px", marginBottom: "48px" }}>
          Qarta remplace les cartes papier par un système universel basé sur le QR code. Un scan suffit pour tout — rejoindre, cumuler, récompenser.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {[
            { num: "01", title: "Universel", desc: "Un seul QR code par commerce. Aucune app à télécharger pour le client." },
            { num: "02", title: "Instantané", desc: "Les points sont crédités en temps réel, dès le scan en caisse." },
            { num: "03", title: "Personnalisable", desc: "Tampons ou points — chaque commerce définit ses règles." },
          ].map((item) => (
            <div key={item.num} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "12px", color: "#bbb", fontWeight: 700, letterSpacing: "0.1em", minWidth: "24px", marginTop: "2px" }}>{item.num}</span>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0a0a0a", margin: "0 0 4px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ── COMMERÇANT ───────────────────────────────────────────────── */}
      <section style={{ background: "#001133", padding: "100px 80px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <p style={{ color: "#818cf8", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Pour les commerçants</p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "520px", marginBottom: "32px" }}>
          Créez votre programme en 5 minutes.
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "480px", marginBottom: "48px" }}>
          Pas besoin de développeur. Configurez, générez votre QR code et commencez à fidéliser le jour même.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", maxWidth: "500px" }}>
          {[
            { title: "Onboarding rapide", desc: "Compte et QR code en moins de 5 min." },
            { title: "Dashboard temps réel", desc: "Suivez clients, tampons et récompenses." },
            { title: "Programmes flexibles", desc: "Tampons ou points, vous choisissez." },
            { title: "Notifications push", desc: "Offres ciblées sur le téléphone client." },
          ].map((item) => (
            <div key={item.title} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "18px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>{item.title}</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ── CLIENT ───────────────────────────────────────────────────── */}
      <section style={{ background: "#f8f8f8", padding: "100px 80px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <p style={{ color: "#2C7BE5", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Pour les clients</p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "520px", marginBottom: "32px" }}>
          Toutes vos cartes dans votre poche.
        </h2>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.8, maxWidth: "480px", marginBottom: "48px" }}>
          Scannez et rejoignez instantanément. Vos cartes, points et récompenses, toujours à portée de main.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "480px" }}>
          {[
            { title: "Zéro papier", desc: "Fini les cartes oubliées. Tout dans votre téléphone." },
            { title: "Multi-commerces", desc: "Gérez tous vos programmes au même endroit." },
            { title: "Récompenses auto", desc: "Dès le seuil atteint, votre récompense est disponible." },
          ].map((item) => (
            <div key={item.title} style={{ background: "#fff", borderRadius: "14px", padding: "18px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ width: "4px", height: "36px", background: "#2C7BE5", borderRadius: "2px", flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0a0a0a", margin: "0 0 3px" }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 80px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <p style={{ color: "#2C7BE5", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Comment ça marche</p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "520px", marginBottom: "48px" }}>
          Simple comme un scan.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "460px" }}>
          {[
            { step: "1", title: "Le commerçant crée son programme", desc: "Type, seuil, récompense — configuré en quelques clics." },
            { step: "2", title: "Il affiche son QR code en caisse", desc: "Un QR code unique, prêt à être scanné à tout moment." },
            { step: "3", title: "Le client scanne et rejoint", desc: "Depuis l'app Qarta, un scan suffit pour intégrer le programme." },
            { step: "4", title: "Les points s'accumulent", desc: "À chaque passage, crédités automatiquement et en temps réel." },
          ].map((item, i, arr) => (
            <div key={item.step} style={{ display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#001133", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: "13px" }}>{item.step}</span>
                </div>
                {i < arr.length - 1 && <div style={{ width: "1px", height: "44px", background: "#e5e5e5" }} />}
              </div>
              <div style={{ paddingBottom: i < arr.length - 1 ? "28px" : "0", paddingTop: "6px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0a0a0a", margin: "0 0 5px" }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ── TARIFS ───────────────────────────────────────────────────── */}
      <section style={{ background: "#001133", padding: "100px 80px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ color: "#818cf8", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Tarifs</p>
        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "48px" }}>
          Un prix simple, sans surprise.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", maxWidth: "900px" }}>
          {[
            { name: "Starter", price: "Gratuit", desc: "Pour tester sans engagement.", features: ["1 programme", "50 clients max", "QR code statique", "Dashboard basique"], cta: "Commencer", highlight: false },
            { name: "Pro", price: "29€", period: "/mois", desc: "Pour les commerçants actifs.", features: ["Programmes illimités", "Clients illimités", "Notifications push", "Support prioritaire"], cta: "Essai gratuit", highlight: true },
            { name: "Business", price: "Sur devis", desc: "Pour réseaux et franchises.", features: ["Multi-établissements", "API dédiée", "Intégration caisse", "Account manager"], cta: "Nous contacter", highlight: false },
          ].map((plan) => (
            <div key={plan.name} style={{ background: plan.highlight ? "#2C7BE5" : "rgba(255,255,255,0.05)", border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 700, color: plan.highlight ? "rgba(255,255,255,0.7)" : "#818cf8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "32px", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>{plan.desc}</p>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: plan.highlight ? "rgba(255,255,255,0.8)" : "#818cf8", fontSize: "12px" }}>✓</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{ marginTop: "auto", padding: "12px", borderRadius: "10px", border: "none", background: plan.highlight ? "#fff" : "rgba(255,255,255,0.1)", color: plan.highlight ? "#2C7BE5" : "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ background: "#000c1a", padding: "40px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "13px", margin: 0 }}>© 2025 Qarta.be — Tous droits réservés</p>
      </footer>

    </main>
  );
}
