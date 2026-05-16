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

export type MenuCard = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: string;
  image: string;
  badge: string; // "Populaire" | "Nouveau" | "Végétarien" | "Vegan" | ""
};
export type FieldMenuCards = { key: string; label: string; type: "menu-cards"; defaultValue: MenuCard[] };

export type FieldDef = FieldText | FieldListText | FieldListLink | FieldColor | FieldToggle | FieldSelect | FieldNumber | FieldMenuCards;

export type FieldGroup = {
  id: string;
  label: string;
  icon?: string;
  fieldKeys: string[];
  defaultOpen?: boolean; // true = ouvert par défaut
};

export type SectionDef = {
  id: string;
  label: string;
  icon: string;
  page: "home" | "login" | "register" | "dashboard";
  description?: string;
  fields: FieldDef[];
  groups?: FieldGroup[]; // Regroupe les champs en accordéons
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
    groups: [
      { id: "colors", label: "Palette de couleurs", icon: "🎨", fieldKeys: ["primaryColor", "accentColor", "highlightColor", "lightBg"], defaultOpen: true },
      { id: "style",  label: "Style des boutons",   icon: "✦",  fieldKeys: ["buttonStyle"], defaultOpen: true },
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
    groups: [
      { id: "visibility", label: "Activation",  icon: "👁",  fieldKeys: ["visible"], defaultOpen: true },
      { id: "content",    label: "Contenu",      icon: "✏️", fieldKeys: ["text", "linkLabel", "link"], defaultOpen: true },
      { id: "colors",     label: "Couleurs",     icon: "🎨", fieldKeys: ["bgColor", "textColor"] },
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
    groups: [
      { id: "texts",   label: "Textes",  icon: "✏️", fieldKeys: ["badge", "subtitle", "scrollLabel"], defaultOpen: true },
      { id: "buttons", label: "Boutons", icon: "🔘", fieldKeys: ["ctaPrimaryLabel", "ctaPrimaryHref", "ctaContactLabel"] },
    ],
  },

  {
    id: "scroll-immersion",
    label: "Section Immersion",
    icon: "✨",
    page: "home",
    description: "Section scrollable 'Chapitre 01' avec le téléphone animé.",
    fields: [
      { key: "badge",    label: "Texte du badge",         type: "text",      defaultValue: "Chapitre 01 · Immersion" },
      { key: "title",    label: "Titre (sans accent)",    type: "text",      defaultValue: "Entrez dans" },
      { key: "accent",   label: "Mot en couleur (accent)",type: "text",      defaultValue: "l'univers" },
      { key: "suffix",   label: "Suite du titre",         type: "text",      defaultValue: "QARTA." },
      { key: "subtitle", label: "Paragraphe",             type: "textarea",  defaultValue: "Plongez dans un écosystème où commerçants et clients interagissent en toute fluidité : une interface unique pour centraliser vos avantages, valoriser l'engagement local et transformer chaque échange en une relation durable." },
      { key: "features", label: "Tags (pilules)",         type: "list-text", defaultValue: ["Intuitif", "Pratique", "Rapide"] },
    ],
  },

  {
    id: "scroll-client",
    label: "Section Client",
    icon: "👤",
    page: "home",
    description: "Section scrollable 'Chapitre 02' avec la transition cartes papier → QARTA.",
    fields: [
      { key: "badge",       label: "Texte du badge",         type: "text",      defaultValue: "Chapitre 02 · Expérience Client" },
      { key: "titleLine1",  label: "Titre ligne 1",          type: "text",      defaultValue: "Simple." },
      { key: "titleLine2",  label: "Titre ligne 2 (accent)", type: "text",      defaultValue: "Écologique." },
      { key: "titleLine3",  label: "Titre ligne 3",          type: "text",      defaultValue: "Efficace." },
      { key: "subtitle",    label: "Paragraphe",             type: "textarea",  defaultValue: "Papiers froissés au fond du portefeuille… Toutes vos cartes de fidélité, instantanément réunies, organisées, et prêtes à l'emploi." },
      { key: "featureLabels", label: "Fonctionnalités (4 pilules)", type: "list-text", defaultValue: ["QR code unique", "Google Wallet", "Récompenses auto", "Vos commerces préférés"] },
    ],
  },

  {
    id: "scroll-merchant",
    label: "Section Commerçant",
    icon: "🏪",
    page: "home",
    description: "Section scrollable 'Chapitre 03' avec le dashboard animé.",
    fields: [
      { key: "badge",         label: "Texte du badge",         type: "text",      defaultValue: "Chapitre 03 · Commerçant" },
      { key: "title",         label: "Titre (sans accent)",    type: "text",      defaultValue: "Un outil" },
      { key: "accent",        label: "Mot en couleur (accent)",type: "text",      defaultValue: "puissant" },
      { key: "suffix",        label: "Suite du titre",         type: "text",      defaultValue: "et simple." },
      { key: "subtitle",      label: "Paragraphe",             type: "textarea",  defaultValue: "Créez un programme de fidélité pour faire revenir vos clients, envoyer des rappels automatiques et analyser vos ventes. Identifiez vos heures creuses et augmentez votre chiffre d'affaires depuis un tableau de bord simple." },
      { key: "featureLabels", label: "Fonctionnalités (4 pilules)", type: "list-text", defaultValue: ["Tampons & récompenses", "Notifications automatiques", "Statistiques en temps réel", "Avis Google intégrés"] },
    ],
  },

  {
    id: "scroll-businesses",
    label: "Section Commerces",
    icon: "🌐",
    page: "home",
    description: "Section 'Chapitre 04' avec l'orbite de types de commerces.",
    fields: [
      { key: "badge",          label: "Texte du badge",          type: "text",      defaultValue: "Chapitre 04 · Tous types de commerces" },
      { key: "title",          label: "Titre (avant accent)",    type: "text",      defaultValue: "QARTA s'adapte à" },
      { key: "accent",         label: "Mot en couleur (accent)", type: "text",      defaultValue: "tous" },
      { key: "suffix",         label: "Suite du titre",          type: "text",      defaultValue: "les commerces." },
      { key: "subtitle",       label: "Paragraphe",              type: "textarea",  defaultValue: "Du coffee shop à l'atelier de lavage auto, du coiffeur au boucher, chaque commerce local trouve sa place dans l'univers QARTA." },
      { key: "businessLabels", label: "Types de commerces (orbite)", type: "list-text", defaultValue: ["Coffee shops", "Coiffeurs", "Restaurants", "Boutiques", "High-tech", "Lavage auto", "Fitness", "Beauté"] },
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
    id: "menu-builder",
    label: "🍽 Menu",
    icon: "🍽",
    page: "home",
    description: "Créez un menu personnalisé avec des cartes drag & drop. Activez la section pour qu'elle apparaisse sur le site.",
    fields: [
      { key: "visible",    label: "Afficher le menu sur le site",      type: "toggle",     defaultValue: false },
      { key: "badge",      label: "Badge de section",                  type: "text",        defaultValue: "Notre menu" },
      { key: "title",      label: "Titre du menu",                     type: "text",        defaultValue: "Découvrez notre carte" },
      { key: "subtitle",   label: "Sous-titre",                        type: "textarea",    defaultValue: "Des créations faites avec passion, pour vous." },
      { key: "layout",     label: "Disposition des cartes",            type: "select",
        options: ["grid-2", "grid-3", "list", "mosaic"],
        optionLabels: ["Grille 2 colonnes", "Grille 3 colonnes", "Liste", "Mosaïque"],
        defaultValue: "grid-3" },
      { key: "showFilter", label: "Afficher le filtre par catégorie",  type: "toggle",      defaultValue: true },
      {
        key: "items",
        label: "Cartes du menu",
        type: "menu-cards",
        defaultValue: [
          { id: "demo-1", category: "Plats", name: "Pizza Margherita", description: "Tomate San Marzano, fior di latte, basilic frais", price: "12.50", image: "", badge: "Populaire" },
          { id: "demo-2", category: "Plats", name: "Pâtes Carbonara", description: "Guanciale, pecorino, jaune d'œuf, poivre noir", price: "13.00", image: "", badge: "" },
          { id: "demo-3", category: "Desserts", name: "Tiramisu maison", description: "Mascarpone, café espresso, biscuits savoiardi", price: "6.50", image: "", badge: "Nouveau" },
          { id: "demo-4", category: "Boissons", name: "Café du barista", description: "Espresso double, lait oaté, sirop vanille", price: "4.00", image: "", badge: "" },
        ],
      },
    ],
  },

  {
    id: "footer",
    label: "Pied de page",
    icon: "📝",
    page: "home",
    description: "Description, colonnes de liens, réseaux sociaux et formulaire de contact.",
    groups: [
      { id: "texts",   label: "Textes",         icon: "✏️", fieldKeys: ["description", "copyrightText"], defaultOpen: true },
      { id: "contact", label: "Contact",         icon: "✉️", fieldKeys: ["contactTitle", "contactSubtitle"], defaultOpen: true },
      { id: "links",   label: "Liens colonnes",  icon: "🔗", fieldKeys: ["productLinks", "companyLinks"] },
      { id: "social",  label: "Réseaux sociaux", icon: "📲", fieldKeys: ["socialInstagram", "socialFacebook", "socialTiktok", "socialLinkedin"] },
    ],
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
    groups: [
      { id: "tabs",   label: "Onglets d'étapes", icon: "🔢", fieldKeys: ["tab1Label", "tab2Label", "tab3Label"], defaultOpen: true },
      { id: "step1",  label: "Étape 1 — Commerce", icon: "🏪", fieldKeys: ["step1Title", "step1Sub", "step1CTA"], defaultOpen: true },
      { id: "step2",  label: "Étape 2 — Compte",   icon: "👤", fieldKeys: ["step2Title", "step2Sub", "firstNameLabel", "lastNameLabel", "phoneLabel", "emailLabel", "passwordLabel", "confirmPasswordLabel", "numLocationsLabel", "siretLabel", "step2CTA"] },
      { id: "step3",  label: "Étape 3 — Vérif.",   icon: "✉️", fieldKeys: ["step3Title", "step3Sub", "step3CTA", "resendHint", "resendLabel", "editEmailLabel"] },
      { id: "global", label: "Global",              icon: "🔗", fieldKeys: ["loginPrompt"] },
    ],
    fields: [
      // ── Indicateur d'étapes ──
      { key: "tab1Label",  label: "Onglet étape 1",       type: "text", defaultValue: "Commerce" },
      { key: "tab2Label",  label: "Onglet étape 2",       type: "text", defaultValue: "Compte" },
      { key: "tab3Label",  label: "Onglet étape 3",       type: "text", defaultValue: "Vérification" },
      // ── Étape 1 ──
      { key: "step1Title", label: "Titre étape 1",        type: "text", defaultValue: "Votre commerce" },
      { key: "step1Sub",   label: "Sous-titre étape 1",   type: "text", defaultValue: "Informations sur votre établissement" },
      { key: "step1CTA",   label: "Bouton étape 1",       type: "text", defaultValue: "Continuer" },
      // ── Étape 2 ──
      { key: "step2Title",          label: "Titre étape 2",                    type: "text", defaultValue: "Votre compte" },
      { key: "step2Sub",            label: "Sous-titre étape 2",               type: "text", defaultValue: "Informations personnelles et accès" },
      { key: "firstNameLabel",      label: "Étape 2 — Label prénom",           type: "text", defaultValue: "Prénom" },
      { key: "lastNameLabel",       label: "Étape 2 — Label nom",              type: "text", defaultValue: "Nom" },
      { key: "phoneLabel",          label: "Étape 2 — Label téléphone",        type: "text", defaultValue: "Téléphone" },
      { key: "emailLabel",          label: "Étape 2 — Label email",            type: "text", defaultValue: "Email" },
      { key: "passwordLabel",       label: "Étape 2 — Label mot de passe",     type: "text", defaultValue: "Mot de passe" },
      { key: "confirmPasswordLabel",label: "Étape 2 — Label confirmation",     type: "text", defaultValue: "Confirmer le mot de passe" },
      { key: "numLocationsLabel",   label: "Étape 2 — Label nb établissements",type: "text", defaultValue: "Nombre d'établissements" },
      { key: "siretLabel",          label: "Étape 2 — Label SIRET",            type: "text", defaultValue: "SIRET (optionnel)" },
      { key: "step2CTA",            label: "Bouton étape 2",                   type: "text", defaultValue: "Créer mon compte" },
      // ── Étape 3 (OTP) ──
      { key: "step3Title",     label: "Titre étape 3 (OTP)",            type: "text",     defaultValue: "Vérifiez votre email" },
      { key: "step3Sub",       label: "Sous-titre étape 3",             type: "text",     defaultValue: "Code à 8 chiffres envoyé à" },
      { key: "step3CTA",       label: "Bouton étape 3 — vérifier",      type: "text",     defaultValue: "Vérifier et accéder au dashboard" },
      { key: "resendHint",     label: "Texte renvoi du code",           type: "text",     defaultValue: "Pas reçu le code ?" },
      { key: "resendLabel",    label: "Bouton renvoyer",                type: "text",     defaultValue: "Renvoyer" },
      { key: "editEmailLabel", label: "Lien modifier email",            type: "text",     defaultValue: "Modifier mon email" },
      // ── Global ──
      { key: "loginPrompt",    label: "Lien connexion (bas de page)",   type: "text",     defaultValue: "Déjà un compte ?" },
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

  {
    id: "dashboard-subscription",
    label: "Abonnement (onglet)",
    icon: "💳",
    page: "dashboard",
    description: "Textes de l'onglet abonnement dans le dashboard commerçant.",
    groups: [
      { id: "plan",    label: "Plan tarifaire",    icon: "💰", fieldKeys: ["planName", "planPrice", "planPeriod", "planFeatures", "ctaLabel", "planBadgeLabel", "secureLabel"], defaultOpen: true },
      { id: "billing", label: "Facturation",       icon: "🧾", fieldKeys: ["billingTitle"] },
      { id: "faq",     label: "FAQ (3 questions)", icon: "❓", fieldKeys: ["faq1Q", "faq1A", "faq2Q", "faq2A", "faq3Q", "faq3A"] },
    ],
    fields: [
      { key: "planName",     label: "Nom du plan",                    type: "text",      defaultValue: "Pro" },
      { key: "planPrice",    label: "Prix (chiffre uniquement)",      type: "text",      defaultValue: "29" },
      { key: "planPeriod",   label: "Unité (mois, an…)",              type: "text",      defaultValue: "mois" },
      { key: "planFeatures", label: "Fonctionnalités incluses",       type: "list-text", defaultValue: [
        "Carte de fidélité digitale",
        "Scan QR code illimité",
        "Dashboard statistiques complet",
        "Notifications push clients",
        "Support prioritaire",
        "Application mobile QARTA",
      ]},
      { key: "ctaLabel",         label: "Bouton — s'abonner",             type: "text", defaultValue: "S'abonner maintenant" },
      { key: "billingTitle",     label: "Titre section facturation",       type: "text", defaultValue: "Informations de facturation" },
      { key: "planBadgeLabel",   label: "Badge (plan unique)",             type: "text", defaultValue: "Seul plan disponible" },
      { key: "secureLabel",      label: "Texte sécurité sous le bouton",   type: "text", defaultValue: "Paiement sécurisé · Sans engagement · Résiliable à tout moment" },
      { key: "faq1Q", label: "FAQ 1 — Question", type: "text", defaultValue: "Puis-je résilier à tout moment ?" },
      { key: "faq1A", label: "FAQ 1 — Réponse",  type: "text", defaultValue: "Oui, sans frais ni engagement." },
      { key: "faq2Q", label: "FAQ 2 — Question", type: "text", defaultValue: "Quand mon compte sera-t-il activé ?" },
      { key: "faq2A", label: "FAQ 2 — Réponse",  type: "text", defaultValue: "Immédiatement après confirmation du paiement." },
      { key: "faq3Q", label: "FAQ 3 — Question", type: "text", defaultValue: "Combien de clients puis-je avoir ?" },
      { key: "faq3A", label: "FAQ 3 — Réponse",  type: "text", defaultValue: "Illimité sur le plan Pro." },
    ],
  },

  {
    id: "dashboard-stats",
    label: "Statistiques (onglet)",
    icon: "📊",
    page: "dashboard",
    description: "Textes de l'onglet statistiques dans le dashboard commerçant.",
    fields: [
      { key: "chartTitle",    label: "Titre du graphique",              type: "text", defaultValue: "Nouveaux clients" },
      { key: "chartPeriod",   label: "Période du graphique",            type: "text", defaultValue: "30 derniers jours" },
      { key: "stat1Label",    label: "Statistique 1 — libellé",         type: "text", defaultValue: "Clients total" },
      { key: "stat2Label",    label: "Statistique 2 — libellé",         type: "text", defaultValue: "Tampons distribués" },
      { key: "stat3Label",    label: "Statistique 3 — libellé",         type: "text", defaultValue: "Récompenses offertes" },
      { key: "stat4Label",    label: "Statistique 4 — libellé",         type: "text", defaultValue: "Taux de retour" },
      { key: "stat4Suffix",   label: "Statistique 4 — suffixe (%, €…)", type: "text", defaultValue: "%" },
      { key: "emptyTitle",    label: "Message vide — titre",            type: "text", defaultValue: "Aucun client pour l'instant" },
      { key: "emptyHint",     label: "Message vide — conseil",          type: "text", defaultValue: "Activez votre compte pour commencer à accueillir des clients" },
      { key: "lastClientsTitle", label: "Titre tableau derniers clients",type: "text", defaultValue: "Derniers clients" },
      { key: "pendingDataLabel", label: "Badge données en attente",      type: "text", defaultValue: "Données réelles après activation" },
    ],
  },
];
