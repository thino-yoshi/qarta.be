// ─── Content section definitions ─────────────────────────────────────────────
// Each section maps to one row in page_content (page + section columns).
// Fields define what the admin can edit and the fallback default values.

export type FieldText     = { key: string; label: string; type: "text" | "textarea" | "url"; defaultValue: string };
export type FieldListText = { key: string; label: string; type: "list-text"; defaultValue: string[] };
export type FieldListLink = { key: string; label: string; type: "list-link"; defaultValue: { label: string; href: string }[] };
export type FieldDef      = FieldText | FieldListText | FieldListLink;

export type SectionDef = {
  id: string;
  label: string;
  icon: string;
  page: "home" | "login" | "register" | "dashboard";
  description?: string;
  fields: FieldDef[];
};

/** Returns a plain object with all default values for a section */
export function getDefaults(section: SectionDef): Record<string, unknown> {
  return Object.fromEntries(section.fields.map(f => [f.key, f.defaultValue]));
}

// ─── Section definitions ──────────────────────────────────────────────────────
export const SECTION_DEFS: SectionDef[] = [

  /* ── HOME ─────────────────────────────────────────────────────────────────── */
  {
    id: "header",
    label: "Navigation",
    icon: "🧭",
    page: "home",
    description: "Liens de navigation, textes des boutons d'en-tête.",
    fields: [
      {
        key: "navLinks",
        label: "Liens navigation",
        type: "list-link",
        defaultValue: [
          { label: "Accueil",    href: "#hero" },
          { label: "Immersion",  href: "#immersion" },
          { label: "Client",     href: "#client" },
          { label: "Commerçant", href: "#merchant" },
          { label: "Contact",    href: "#contact" },
          { label: "Tarif",      href: "#pricing" },
        ],
      },
      { key: "loginLabel",    label: "Texte bouton Connexion",  type: "text", defaultValue: "Connexion" },
      { key: "registerLabel", label: "Texte bouton Inscription", type: "text", defaultValue: "Créer un compte" },
      { key: "demoLabel",     label: "Texte bouton Démo",       type: "text", defaultValue: "Démo" },
      { key: "demoHref",      label: "Lien bouton Démo",        type: "url",  defaultValue: "/register?role=merchant" },
    ],
  },

  {
    id: "hero",
    label: "Hero",
    icon: "🏠",
    page: "home",
    description: "Section principale visible dès l'arrivée sur le site.",
    fields: [
      { key: "badge",            label: "Texte badge",           type: "text",     defaultValue: "Programme de fidélité" },
      { key: "title",            label: "Titre principal",        type: "textarea", defaultValue: "Fidélisez vos clients,\nboostez vos revenus." },
      { key: "subtitle",         label: "Sous-titre / description", type: "textarea", defaultValue: "QARTA réunit toutes vos cartes de fidélité en une seule application mobile." },
      { key: "ctaPrimaryLabel",  label: "Bouton principal — texte", type: "text", defaultValue: "Lancez votre fidélité" },
      { key: "ctaPrimaryHref",   label: "Bouton principal — lien",  type: "url",  defaultValue: "/register?role=merchant" },
      { key: "ctaContactLabel",  label: "Bouton Contact — texte",   type: "text", defaultValue: "Contact" },
    ],
  },

  {
    id: "cta",
    label: "Tarifs / Simulateur",
    icon: "💰",
    page: "home",
    description: "Section tarification et simulateur ROI commerçant.",
    fields: [
      { key: "stepsTitle",  label: "Titre section étapes",  type: "text",     defaultValue: "Créer votre programme en 3 étapes." },
      { key: "pricingTitle",label: "Titre section tarifs",  type: "text",     defaultValue: "Des tarifs clairs, sans surprise." },
      { key: "planName",    label: "Nom du plan",           type: "text",     defaultValue: "Pro" },
      { key: "price",       label: "Prix (€)",              type: "text",     defaultValue: "20" },
      { key: "priceUnit",   label: "Unité de prix",         type: "text",     defaultValue: "/ mois" },
      {
        key: "features",
        label: "Fonctionnalités incluses",
        type: "list-text",
        defaultValue: [
          "Programmes illimités",
          "Clients illimités",
          "Notifications automatiques",
          "Avis Google intégrés",
          "Support prioritaire",
        ],
      },
      { key: "ctaLabel",  label: "Texte bouton CTA",  type: "text", defaultValue: "Lancer mon programme" },
      { key: "ctaHref",   label: "Lien bouton CTA",   type: "url",  defaultValue: "/register?role=merchant&plan=pro" },
    ],
  },

  {
    id: "footer",
    label: "Pied de page",
    icon: "📝",
    page: "home",
    description: "Description, colonnes de liens et formulaire de contact.",
    fields: [
      { key: "description",     label: "Description QARTA",       type: "textarea", defaultValue: "QARTA réunit vos cartes de fidélité et aide les commerces locaux à tisser un lien durable avec leurs clients." },
      { key: "contactTitle",    label: "Titre formulaire contact", type: "text",     defaultValue: "Gardons le contact" },
      { key: "contactSubtitle", label: "Sous-titre formulaire",    type: "text",     defaultValue: "Questions, partenariats, démo — écrivez-nous." },
      {
        key: "productLinks",
        label: "Liens colonne « Produit »",
        type: "list-link",
        defaultValue: [
          { label: "Client",      href: "#client" },
          { label: "Commerçant",  href: "#merchant" },
          { label: "Abonnement",  href: "#pricing" },
        ],
      },
      {
        key: "companyLinks",
        label: "Liens colonne « Société »",
        type: "list-link",
        defaultValue: [
          { label: "À propos",          href: "#" },
          { label: "Mentions légales",  href: "#" },
          { label: "Confidentialité",   href: "#" },
        ],
      },
    ],
  },

  /* ── LOGIN ────────────────────────────────────────────────────────────────── */
  {
    id: "login-form",
    label: "Formulaire connexion",
    icon: "🔐",
    page: "login",
    description: "Textes affichés sur la page de connexion.",
    fields: [
      { key: "title",          label: "Titre",                  type: "text", defaultValue: "Connexion" },
      { key: "subtitle",       label: "Sous-titre",             type: "text", defaultValue: "Accédez à votre espace QARTA" },
      { key: "emailLabel",     label: "Label email",            type: "text", defaultValue: "Adresse email" },
      { key: "passwordLabel",  label: "Label mot de passe",     type: "text", defaultValue: "Mot de passe" },
      { key: "submitLabel",    label: "Texte bouton",           type: "text", defaultValue: "Se connecter" },
      { key: "forgotLabel",    label: "Lien mot de passe oublié", type: "text", defaultValue: "Mot de passe oublié ?" },
      { key: "registerPrompt", label: "Texte lien inscription", type: "text", defaultValue: "Pas encore de compte ? S'inscrire" },
    ],
  },

  /* ── REGISTER ─────────────────────────────────────────────────────────────── */
  {
    id: "register-form",
    label: "Formulaire inscription",
    icon: "📋",
    page: "register",
    description: "Textes affichés sur la page d'inscription.",
    fields: [
      { key: "title",        label: "Titre",               type: "text", defaultValue: "Créer un compte" },
      { key: "subtitle",     label: "Sous-titre",          type: "text", defaultValue: "Rejoignez QARTA et fidélisez vos clients" },
      { key: "submitLabel",  label: "Texte bouton",        type: "text", defaultValue: "Créer mon compte" },
      { key: "loginPrompt",  label: "Texte lien connexion", type: "text", defaultValue: "Déjà un compte ? Se connecter" },
    ],
  },

  /* ── DASHBOARD ────────────────────────────────────────────────────────────── */
  {
    id: "dashboard-header",
    label: "En-tête Dashboard",
    icon: "🎛️",
    page: "dashboard",
    description: "Textes de l'en-tête du dashboard commerçant.",
    fields: [
      { key: "welcomeTitle",    label: "Titre de bienvenue",    type: "text", defaultValue: "Bonjour," },
      { key: "welcomeSubtitle", label: "Sous-titre",            type: "text", defaultValue: "Voici un aperçu de votre programme de fidélité" },
      { key: "statsLabel",      label: "Titre statistiques",    type: "text", defaultValue: "Statistiques" },
      { key: "clientsLabel",    label: "Label clients fidèles", type: "text", defaultValue: "Clients fidèles" },
      { key: "visitsLabel",     label: "Label visites",         type: "text", defaultValue: "Visites ce mois" },
      { key: "revenueLabel",    label: "Label revenus estimés", type: "text", defaultValue: "Revenus estimés" },
    ],
  },

  {
    id: "dashboard-cards",
    label: "Carte de fidélité",
    icon: "🃏",
    page: "dashboard",
    description: "Textes de la section carte de fidélité.",
    fields: [
      { key: "cardTitle",      label: "Titre section",          type: "text", defaultValue: "Votre carte de fidélité" },
      { key: "cardSubtitle",   label: "Sous-titre",             type: "text", defaultValue: "Personnalisez l'apparence de votre programme" },
      { key: "ctaLabel",       label: "Texte bouton créer",     type: "text", defaultValue: "Créer ma carte" },
      { key: "ctaEditLabel",   label: "Texte bouton modifier",  type: "text", defaultValue: "Modifier" },
    ],
  },
];
