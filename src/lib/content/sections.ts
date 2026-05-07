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
      { key: "title",          label: "Titre principal",            type: "text", defaultValue: "Bon retour parmi nous" },
      { key: "subtitle",       label: "Sous-titre",                 type: "text", defaultValue: "Espace commerçant" },
      { key: "emailPlaceholder",   label: "Placeholder email",      type: "text", defaultValue: "Adresse e-mail" },
      { key: "passwordPlaceholder",label: "Placeholder mot de passe",type: "text", defaultValue: "Mot de passe" },
      { key: "submitLabel",    label: "Texte bouton connexion",     type: "text", defaultValue: "Se connecter" },
      { key: "forgotLabel",    label: "Lien mot de passe oublié",   type: "text", defaultValue: "Mot de passe oublié ?" },
      { key: "registerPrompt", label: "Lien inscription (bas)",     type: "text", defaultValue: "Créer un espace commerçant" },
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
      { key: "step1Title",    label: "Titre étape 1",            type: "text", defaultValue: "Votre commerce" },
      { key: "step1Sub",      label: "Sous-titre étape 1",       type: "text", defaultValue: "Informations sur votre établissement" },
      { key: "step2Title",    label: "Titre étape 2",            type: "text", defaultValue: "Votre compte" },
      { key: "step2Sub",      label: "Sous-titre étape 2",       type: "text", defaultValue: "Informations personnelles et accès" },
      { key: "step1CTA",      label: "Bouton étape 1",           type: "text", defaultValue: "Continuer" },
      { key: "step2CTA",      label: "Bouton étape 2",           type: "text", defaultValue: "Créer mon compte" },
      { key: "loginPrompt",   label: "Lien connexion (bas)",     type: "text", defaultValue: "Déjà un compte ?" },
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
      { key: "sidebarTitle",    label: "Titre sidebar (onglet carte)",   type: "text", defaultValue: "Ma carte" },
      { key: "sidebarStats",    label: "Titre sidebar (onglet stats)",   type: "text", defaultValue: "Statistiques" },
      { key: "sidebarSub",      label: "Titre sidebar (abonnement)",     type: "text", defaultValue: "Abonnement" },
      { key: "cardTabTitle",    label: "Titre onglet carte",             type: "text", defaultValue: "Ma carte de fidélité" },
      { key: "cardTabSub",      label: "Sous-titre onglet carte",        type: "text", defaultValue: "Personnalisez et prévisualisez votre carte" },
      { key: "statsTabTitle",   label: "Titre onglet statistiques",      type: "text", defaultValue: "Statistiques" },
      { key: "statsTabSub",     label: "Sous-titre onglet statistiques", type: "text", defaultValue: "Vue d'ensemble de votre activité" },
      { key: "subTabTitle",     label: "Titre onglet abonnement",        type: "text", defaultValue: "Abonnement" },
      { key: "pendingNotice",   label: "Message compte en attente",      type: "textarea", defaultValue: "Votre compte est en cours de validation. Vous recevrez un email dès que votre accès est activé." },
    ],
  },

  {
    id: "dashboard-cards",
    label: "Carte de fidélité (onglet)",
    icon: "🃏",
    page: "dashboard",
    description: "Textes de l'onglet carte de fidélité du dashboard.",
    fields: [
      { key: "createTitle",    label: "Titre (pas encore de carte)",    type: "text", defaultValue: "Créez votre carte de fidélité" },
      { key: "createSubtitle", label: "Sous-titre (pas de carte)",      type: "textarea", defaultValue: "Concevez une carte personnalisée à vos couleurs et commencez à fidéliser vos clients." },
      { key: "createCTA",      label: "Bouton créer carte",             type: "text", defaultValue: "Créer ma carte" },
      { key: "editCTA",        label: "Bouton modifier carte",          type: "text", defaultValue: "Modifier la carte" },
    ],
  },
];
