import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Qarta",
  description: "Comment Qarta utilise et protège tes données personnelles.",
};

const sections = [
  {
    title: "Qui sommes-nous ?",
    content: `Qarta est une application de fidélité digitale qui permet aux clients de cumuler des tampons chez leurs commerçants préférés, et aux commerçants de créer et gérer leurs propres cartes de fidélité. Qarta est édité par une équipe basée en Belgique. Pour toute question, écris-nous à <a href="mailto:contact@qarta.be" class="privacy-link">contact@qarta.be</a>.`,
  },
  {
    title: "Quelles données on collecte ?",
    content: `On collecte uniquement ce dont on a besoin pour faire fonctionner l'app :
    <ul>
      <li><strong>Ton compte</strong> — prénom, nom, adresse email. Si tu te connectes avec Google, on reçoit ces infos directement depuis Google.</li>
      <li><strong>Ton activité</strong> — les scans de tes cartes de fidélité, le nombre de tampons, les récompenses obtenues.</li>
      <li><strong>Ton appareil</strong> — un identifiant de notification (token FCM) pour t'envoyer des notifications push, uniquement si tu les autorises.</li>
    </ul>
    On ne collecte pas ta localisation, tes contacts, ni aucune donnée sensible.`,
  },
  {
    title: "Pourquoi on utilise tes données ?",
    content: `Tes données servent à une seule chose : faire fonctionner Qarta correctement.
    <ul>
      <li>Créer et gérer ton compte</li>
      <li>Mémoriser tes cartes de fidélité et ton historique de scans</li>
      <li>T'envoyer des notifications sur tes récompenses (si tu les as activées)</li>
      <li>Améliorer l'expérience générale de l'app</li>
    </ul>
    On ne vend pas tes données. On ne les partage pas avec des tiers à des fins publicitaires.`,
  },
  {
    title: "Qui a accès à tes données ?",
    content: `On travaille avec quelques services tiers de confiance pour faire tourner l'app :
    <ul>
      <li><strong>Supabase</strong> — notre base de données et système d'authentification (serveurs en Europe)</li>
      <li><strong>Firebase (Google)</strong> — pour les notifications push</li>
      <li><strong>Railway</strong> — notre serveur backend</li>
    </ul>
    Ces services sont soumis à leurs propres politiques de confidentialité et respectent le RGPD. Aucun de ces services ne revend tes données.`,
  },
  {
    title: "Combien de temps on garde tes données ?",
    content: `On conserve tes données tant que ton compte est actif. Si tu supprimes ton compte, on efface toutes tes données dans un délai de 30 jours. Les données anonymisées (statistiques d'usage globales) peuvent être conservées plus longtemps, mais elles ne te sont plus rattachées.`,
  },
  {
    title: "Tes droits",
    content: `Tu as le droit de :
    <ul>
      <li><strong>Accéder</strong> à toutes les données qu'on a sur toi</li>
      <li><strong>Corriger</strong> des informations incorrectes</li>
      <li><strong>Supprimer</strong> ton compte et toutes tes données</li>
      <li><strong>T'opposer</strong> à certains traitements</li>
      <li><strong>Portabilité</strong> — recevoir tes données dans un format lisible</li>
    </ul>
    Pour exercer un de ces droits, envoie-nous un email à <a href="mailto:contact@qarta.be" class="privacy-link">contact@qarta.be</a>. On répond sous 72h.`,
  },
  {
    title: "Notifications push",
    content: `Les notifications sont optionnelles. Tu peux les activer ou les désactiver à tout moment depuis les paramètres de ton téléphone. Si tu les désactives, ça ne change rien au fonctionnement de l'app — tu recevras juste les infos directement dans l'app plutôt que sur ton écran.`,
  },
  {
    title: "Connexion avec Google",
    content: `Si tu choisis de te connecter avec ton compte Google, on reçoit ton nom et ton adresse email depuis Google. On n'accède à rien d'autre — ni tes contacts, ni tes emails, ni ton calendrier. Google gère son propre processus d'authentification selon <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="privacy-link">sa politique de confidentialité</a>.`,
  },
  {
    title: "Cookies et tracking",
    content: `L'application mobile Qarta n'utilise pas de cookies. Le site qarta.be utilise uniquement des cookies techniques nécessaires au bon fonctionnement du site. Aucun tracker publicitaire, aucun outil d'analyse tiers n'est installé sur ce site.`,
  },
  {
    title: "Sécurité",
    content: `Tes données sont stockées de manière chiffrée. Les communications entre l'app et nos serveurs sont sécurisées via HTTPS. On fait de notre mieux pour protéger tes informations, mais aucun système n'est infaillible à 100% — si tu remarques quelque chose d'anormal, dis-le nous à <a href="mailto:contact@qarta.be" class="privacy-link">contact@qarta.be</a>.`,
  },
  {
    title: "Modifications",
    content: `Si on modifie cette politique, on t'en informera via l'application ou par email avant que les changements entrent en vigueur. La version en vigueur est toujours disponible sur cette page.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        .privacy-link {
          color: #2c7be5;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .privacy-link:hover {
          color: #4a9eff;
        }
        .privacy-section ul {
          margin-top: 12px;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .privacy-section ul li {
          color: #4a5568;
          line-height: 1.7;
          position: relative;
        }
        .privacy-section ul li::marker {
          color: #2c7be5;
        }
      `}</style>

      {/* Header */}
      <header style={{ background: "#0b1220", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <span style={{ color: "white", fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "0.08em" }}>QARTA</span>
          </Link>
          <Link href="/" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Manrope, sans-serif", fontSize: 14, textDecoration: "none" }}>
            ← Retour au site
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: "#0b1220", padding: "72px 24px 80px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, fontWeight: 600, color: "#2c7be5", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
            Transparence
          </p>
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 20 }}>
            Politique de<br />confidentialité
          </h1>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 560 }}>
            On sait que ce genre de page est rarement fun à lire. On a fait de notre mieux pour la rendre claire et honnête. Ici, pas de jargon juridique inutile — juste ce que tu as besoin de savoir.
          </p>
          <p style={{ marginTop: 24, fontFamily: "Manrope, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
            Dernière mise à jour : septembre 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <main style={{ background: "#faf8f4", padding: "72px 24px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>
          {sections.map((section, i) => (
            <div key={i} className="privacy-section" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 10,
                  background: "#2c7be5", color: "white",
                  fontFamily: "Manrope, sans-serif", fontSize: 13, fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 style={{ fontFamily: "Manrope, sans-serif", fontSize: 20, fontWeight: 700, color: "#0f2044", margin: 0 }}>
                  {section.title}
                </h2>
              </div>
              <div
                style={{ fontFamily: "Manrope, sans-serif", fontSize: 15.5, color: "#4a5568", lineHeight: 1.75, paddingLeft: 46 }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
              {i < sections.length - 1 && (
                <div style={{ height: 1, background: "rgba(15,32,68,0.08)", marginTop: 4 }} />
              )}
            </div>
          ))}

          {/* Contact box */}
          <div style={{
            marginTop: 16,
            background: "#0f2044",
            borderRadius: 20,
            padding: "36px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}>
            <h3 style={{ fontFamily: "Manrope, sans-serif", fontSize: 18, fontWeight: 700, color: "white", margin: 0 }}>
              Une question ?
            </h3>
            <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
              On est humains. Si tu as la moindre question sur tes données, un doute ou une demande, envoie-nous un email — on répond vraiment.
            </p>
            <a href="mailto:contact@qarta.be" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginTop: 8,
              background: "#2c7be5", color: "white",
              fontFamily: "Manrope, sans-serif", fontSize: 14, fontWeight: 600,
              padding: "12px 24px", borderRadius: 999,
              textDecoration: "none", width: "fit-content",
            }}>
              contact@qarta.be →
            </a>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer style={{ background: "#0b1220", padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.2)", margin: 0 }}>
          © {new Date().getFullYear()} Qarta. Tous droits réservés.
        </p>
      </footer>
    </>
  );
}
