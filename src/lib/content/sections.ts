// ─── Content section definitions ─────────────────────────────────────────────
// Each section maps to one row in page_content (page + section columns).
// Fields define what the admin can edit and the fallback default values.

export type FieldText     = { key: string; label: string; type: "text" | "textarea" | "url" | "image"; defaultValue: string };
export type FieldListText = { key: string; label: string; type: "list-text"; defaultValue: string[] };
export type FieldListLink = { key: string; label: string; type: "list-link"; defaultValue: { label: string; href: string }[] };
export type FieldColor    = { key: string; label: string; type: "color"; defaultValue: string };
export type FieldToggle   = { key: string; label: string; type: "toggle"; defaultValue: boolean };
export type FieldSelect   = { key: string; label: string; type: "select"; options: string[]; optionLabels?: string[]; defaultValue: string };
export type FieldNumber   = { key: string; label: string; type: "number"; defaultValue: number; min?: number; max?: number; step?: number };
export type FieldDef      = FieldText | FieldListText | FieldListLink | FieldColor | FieldToggle | FieldSelect | FieldNumber;

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

  /* ══════════════════════════════════════════════════════════════
     HOME
  ══════════════════════════════════════════════════════════════ */

  {
    id: "branding",
    label: "Thème & couleurs",
    icon: "🎨",
    page: "home",
    description: "Couleurs principales du site, style des boutons.",
    fields: [
      { key: "primaryColor",   label: "Couleur principale (titres, fonds sombres)", type: "color",  defaultValue: "#0f2044" },
      { key: "accentColor",    label: "Couleur d'accent (liens, badges, boutons)",   type: "color",  defaultValue: "#2c7be5" },
      { key: "highlightColor", label: "Couleur vive (surlignages, CTA)",             type: "color",  defaultValue: "#4a9eff" },
      { key: "lightBg",        label: "Fond clair (sections crémeuses)",             type: "color",  defaultValue: "#faf8f4" },
      { key: "buttonStyle",    label: "Forme des boutons",                           type: "select", options: ["pill", "rounded", "square"], optionLabels: ["Pilule (arrondi max)", "Arrondi (16px)", "Carré (8px)"], defaultValue: "pill" },
    ],
  },

  {
    id: "seo",
    label: "SEO",
    icon: "🔍",
    page: "home",
    description: "Titre de l'onglet, description pour Google, partage sur les réseaux.",
    fields: [
      { key: "metaTitle",       label: "Titre de l'onglet (balise <title>)",           type: "text",     defaultValue: "Qarta — Fidélité digitale" },
      { key: "metaDescription", label: "Meta description (160 caractères max)",        type: "textarea", defaultValue: "Toutes vos cartes de fidélité réunies dans une seule application. Simple. Digital. Pour les commerces locaux." },
      { key: "ogTitle",         label: "Titre partage social (Open Graph)",            type: "text",     defaultValue: "Qarta — La fidélité digitale réinventée" },
      { key: "ogDescription",   label: "Description partage social",                  type: "textarea", defaultValue: "Lancez votre programme de fidélité en 3 minutes. Vos clients gardent leurs points, vous gardez vos clients." },
      { key: "ogImage",         label: "Image de partage (URL absolue, 1200×630px)",  type: "image",    defaultValue: "" },
    ],
  },

  {
    id: "announcement",
    label: "Barre d'annonce",
    icon: "📢",
    page: "home",
    description: "Bandeau affiché en haut de toutes les pages. Activez-le pour une promo ou une annonce.",
    fields: [
      { key: "visible",   label: "Afficher la barre",      type: "toggle", defaultValue: false },
      { key: "text",      label: "Message",                type: "text",   defaultValue: "🎉 QARTA — Lancez votre programme de fidélité dès aujourd'hui !" },
      { key: "linkLabel", label: "Texte du lien",          type: "text",   defaultValue: "Découvrir →" },
      { key: "link",      label: "URL du lien",            type: "url",    defaultValue: "#merchant" },
      { key: "bgColor",   label: "Couleur de fond",        type: "color",  defaultValue: "#0f2044" },
      { key: "textColor", label: "Couleur du texte",       type: "color",  defaultValue: "#faf8f4" },
    ],
  },

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
      { key: "loginLabel",    label: "Bouton — Connexion",    type: "text", defaultValue: "Connexion" },
      { key: "registerLabel", label: "Bouton — Inscription",  type: "text", defaultValue: "Créer un compte" },
      { key: "demoLabel",     label: "Bouton — Démo",         type: "text", defaultValue: "Démo" },
      { key: "demoHref",      label: "Lien — Démo",           type: "url",  defaultValue: "/register?role=merchant" },
    ],
  },

  {
    id: "hero",
    label: "Hero",
    icon: "🏠",
    page: "home",
    description: "Section principale visible dès l'arrivée sur le site.",
    fields: [
      { key: "badge",           label: "Texte du badge",              type: "text",     defaultValue: "La Fidélité digitale Réinventée" },
      { key: "subtitle",        label: "Sous-titre / description",    type: "textarea", defaultValue: "Toutes vos cartes de fidélité réunies dans une seule application." },
      { key: "ctaPrimaryLabel", label: "Bouton principal — texte",    type: "text",     defaultValue: "Lancez votre fidélité" },
      { key: "ctaPrimaryHref",  label: "Bouton principal — lien",     type: "url",      defaultValue: "#merchant" },
      { key: "ctaContactLabel", label: "Bouton contact — texte",      type: "text",     defaultValue: "Contact" },
      { key: "scrollLabel",     label: "Texte scroll (bas du hero)",  type: "text",     defaultValue: "Défiler" },
    ],
  },

  {
    id: "cta",
    label: "Tarifs / Simulateur",
    icon: "💰",
    page: "home",
    description: "Section tarification et simulateur ROI commerçant.",
    fields: [
      { key: "stepsBadge",   label: "Badge section étapes",        type: "text",      defaultValue: "Parcours commerçant" },
      { key: "stepsTitle",   label: "Titre section étapes",        type: "text",      defaultValue: "Créer votre programme en 3 étapes." },
      { key: "pricingBadge", label: "Badge section tarifs",        type: "text",      defaultValue: "Abonnement" },
      { key: "pricingTitle", label: "Titre section tarifs",        type: "text",      defaultValue: "Des tarifs clairs, sans surprise." },
      { key: "planName",     label: "Nom du plan",                 type: "text",      defaultValue: "Pro" },
      { key: "planBadge",    label: "Badge plan (ex: Populaire)",  type: "text",      defaultValue: "Populaire" },
      { key: "price",        label: "Prix (€/mois)",               type: "text",      defaultValue: "20" },
      { key: "priceUnit",    label: "Unité de prix",               type: "text",      defaultValue: "/ mois" },
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
      { key: "ctaLabel", label: "Bouton CTA — texte", type: "text", defaultValue: "Lancer mon programme" },
      { key: "ctaHref",  label: "Bouton CTA — lien",  type: "url",  defaultValue: "/register?role=merchant&plan=pro" },
    ],
  },

  {
    id: "footer",
    label: "Pied de page",
    icon: "📝",
    page: "home",
    description: "Description, colonnes de liens, réseaux sociaux et formulaire de contact.",
    fields: [
      { key: "description",     label: "Description QARTA",              type: "textarea", defaultValue: "QARTA réunit vos cartes de fidélité et aide les commerces locaux à tisser un lien durable avec leurs clients." },
      { key: "copyrightText",   label: "Texte copyright",                type: "text",     defaultValue: "Fait avec ♥ pour le commerce local" },
      { key: "contactTitle",    label: "Titre formulaire contact",       type: "text",     defaultValue: "Gardons le contact" },
      { key: "contactSubtitle", label: "Sous-titre formulaire contact",  type: "text",     defaultValue: "Questions, partenariats, démo — écrivez-nous." },
      {
        key: "productLinks",
        label: "Liens colonne « Produit »",
        type: "list-link",
        defaultValue: [
          { label: "Client",     href: "#client" },
          { label: "Commerçant", href: "#merchant" },
          { label: "Abonnement", href: "#pricing" },
        ],
      },
      {
        key: "companyLinks",
        label: "Liens colonne « Société »",
        type: "list-link",
        defaultValue: [
          { label: "À propos",         href: "#" },
          { label: "Mentions légales", href: "#" },
          { label: "Confidentialité",  href: "#" },
        ],
      },
      { key: "socialInstagram", label: "Instagram (URL complète)", type: "url", defaultValue: "" },
      { key: "socialFacebook",  label: "Facebook (URL complète)",  type: "url", defaultValue: "" },
      { key: "socialTiktok",    label: "TikTok (URL complète)",    type: "url", defaultValue: "" },
      { key: "socialLinkedin",  label: "LinkedIn (URL complète)",  type: "url", defaultValue: "" },
    ],
  },

  /* ══════════════════════════════════════════════════════════════
     LOGIN
  ══════════════════════════════════════════════════════════════ */
  {
    id: "login-form",
    label: "Formulaire connexion",
    icon: "🔐",
    page: "login",
    description: "Textes affichés sur la page de connexion.",
    fields: [
      { key: "title",               label: "Titre principal",              type: "text", defaultValue: "Bon retour parmi nous" },
      { key: "subtitle",            label: "Sous-titre",                   type: "text", defaultValue: "Espace commerçant" },
      { key: "emailPlaceholder",    label: "Placeholder email",            type: "text", defaultValue: "Adresse e-mail" },
      { key: "passwordPlaceholder", label: "Placeholder mot de passe",     type: "text", defaultValue: "Mot de passe" },
      { key: "submitLabel",         label: "Texte bouton connexion",       type: "text", defaultValue: "Se connecter" },
      { key: "forgotLabel",         label: "Lien mot de passe oublié",     type: "text", defaultValue: "Mot de passe oublié ?" },
      { key: "registerPrompt",      label: "Lien inscription (haut + bas)", type: "text", defaultValue: "Créer un espace commerçant" },
    ],
  },

  /* ══════════════════════════════════════════════════════════════
     REGISTER
  ══════════════════════════════════════════════════════════════ */
  {
    id: "register-form",
    label: "Formulaire inscription",
    icon: "📋",
    page: "register",
    description: "Textes affichés sur la page d'inscription (3 étapes).",
    fields: [
      { key: "step1Title",  label: "Titre étape 1",       type: "text", defaultValue: "Votre commerce" },
      { key: "step1Sub",    label: "Sous-titre étape 1",  type: "text", defaultValue: "Informations sur votre établissement" },
      { key: "step2Title",  label: "Titre étape 2",       type: "text", defaultValue: "Votre compte" },
      { key: "step2Sub",    label: "Sous-titre étape 2",  type: "text", defaultValue: "Informations personnelles et accès" },
      { key: "step1CTA",    label: "Bouton étape 1",      type: "text", defaultValue: "Continuer" },
      { key: "step2CTA",    label: "Bouton étape 2",      type: "text", defaultValue: "Créer mon compte" },
      { key: "loginPrompt", label: "Lien connexion (bas)", type: "text", defaultValue: "Déjà un compte ?" },
    ],
  },

  /* ══════════════════════════════════════════════════════════════
     DASHBOARD
  ══════════════════════════════════════════════════════════════ */
  {
    id: "dashboard-header",
    label: "En-tête Dashboard",
    icon: "🎛️",
    page: "dashboard",
    description: "Libellés de la sidebar et des onglets du dashboard commerçant.",
    fields: [
      { key: "sidebarTitle",    label: "Sidebar — onglet carte",         type: "text",     defaultValue: "Ma carte" },
      { key: "sidebarStats",    label: "Sidebar — onglet statistiques",  type: "text",     defaultValue: "Statistiques" },
      { key: "sidebarSub",      label: "Sidebar — onglet abonnement",    type: "text",     defaultValue: "Abonnement" },
      { key: "cardTabTitle",    label: "Titre onglet carte",             type: "text",     defaultValue: "Ma carte de fidélité" },
      { key: "cardTabSub",      label: "Sous-titre onglet carte",        type: "text",     defaultValue: "Personnalisez et prévisualisez votre carte" },
      { key: "statsTabTitle",   label: "Titre onglet statistiques",      type: "text",     defaultValue: "Statistiques" },
      { key: "statsTabSub",     label: "Sous-titre onglet statistiques", type: "text",     defaultValue: "Vue d'ensemble de votre activité" },
      { key: "subTabTitle",     label: "Titre onglet abonnement",        type: "text",     defaultValue: "Abonnement" },
      { key: "pendingNotice",   label: "Message compte en attente",      type: "textarea", defaultValue: "Votre compte est en cours de validation. Vous recevrez un email dès que votre accès est activé." },
    ],
  },

  {
    id: "dashboard-cards",
    label: "Carte de fidélité (onglet)",
    icon: "🃏",
    page: "dashboard",
    description: "Textes de l'onglet carte de fidélité dans le dashboard.",
    fields: [
      { key: "createTitle",    label: "Titre (sans carte)",           type: "text",     defaultValue: "Créez votre carte de fidélité" },
      { key: "createSubtitle", label: "Sous-titre (sans carte)",      type: "textarea", defaultValue: "Concevez une carte personnalisée à vos couleurs et commencez à fidéliser vos clients." },
      { key: "createCTA",      label: "Bouton — créer carte",         type: "text",     defaultValue: "Créer ma carte" },
      { key: "editCTA",        label: "Bouton — modifier carte",      type: "text",     defaultValue: "Modifier la carte" },
    ],
  },
];
