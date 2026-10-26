import type { Lang } from "./index";

/**
 * Copy for the parts of the site every page shares — navbar, landing
 * buttons, document metadata. Page-specific copy stays with the page.
 */
export const CHROME = {
  hr: {
    siteTitle: "MATSEK — Matematička sekcija FER",
    siteDescription: "Službena aplikacija za upravljanje aktivnostima Math Cluba FER",
    home: "Početna stranica",
    calendar: "Kalendar",
    materials: "Materijali",
    propose: "Predloži aktivnost",
    proposeShort: "Predloži",
    tools: "Alati",
    admin: "Admin panel",
    adminShort: "Admin",
    profile: "Profil",
    login: "Prijavi se",
    register: "Registriraj se",
    toggleTheme: "Promijeni temu",
    toggleLang: "Switch to English",
    loading: "Učitavanje…",
    logout: "Odjavi se",
    loggingOut: "Odjava…",
    notFoundTitle: "Stranica nije pronađena",
    notFoundBody: "Ta stranica ne postoji ili je premještena.",
    errorTitle: "Nešto je pošlo po zlu",
    errorBody: "Greška je zabilježena. Pokušaj ponovno ili se vrati na početnu stranicu.",
    retry: "Pokušaj ponovno",
    backHome: "Na početnu stranicu",
    toCalendar: "Na kalendar",
  },
  en: {
    siteTitle: "MATSEK — Mathematics Section FER",
    siteDescription: "The official app of the FER Mathematics Section",
    home: "Home",
    calendar: "Calendar",
    materials: "Materials",
    propose: "Propose an activity",
    proposeShort: "Propose",
    tools: "Tools",
    admin: "Admin panel",
    adminShort: "Admin",
    profile: "Profile",
    login: "Sign in",
    register: "Register",
    toggleTheme: "Toggle theme",
    toggleLang: "Prebaci na hrvatski",
    loading: "Loading…",
    logout: "Sign out",
    loggingOut: "Signing out…",
    notFoundTitle: "Page not found",
    notFoundBody: "That page doesn't exist or has moved.",
    errorTitle: "Something went wrong",
    errorBody: "The error has been logged. Try again, or go back to the home page.",
    retry: "Try again",
    backHome: "Back to the home page",
    toCalendar: "To the calendar",
  },
} satisfies Record<Lang, Record<string, string>>;

export type Chrome = (typeof CHROME)[Lang];
