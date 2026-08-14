import type { Locale, Region } from "./types";

export const LOCALES: Locale[] = ["nl", "fr", "en"];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(v: string): v is Locale {
  return (LOCALES as string[]).includes(v);
}

export const REGIONS: { code: Region; label: Record<Locale, string> }[] = [
  { code: "FL", label: { nl: "Vlaanderen", fr: "Flandre", en: "Flanders" } },
  { code: "BR", label: { nl: "Brussel", fr: "Bruxelles", en: "Brussels" } },
  { code: "WA", label: { nl: "Wallonië", fr: "Wallonie", en: "Wallonia" } },
];

type Dict = Record<string, Record<Locale, string>>;

export const T: Dict = {
  appName: { nl: "Rijbewijs B Theorie", fr: "Permis B Théorie", en: "Belgian Driving Theory" },
  tagline: {
    nl: "Oefen gratis voor het theorie-examen rijbewijs B",
    fr: "Entraînez-vous gratuitement à l'examen théorique du permis B",
    en: "Free practice for the Belgian category B theory exam",
  },
  practice: { nl: "Oefenen", fr: "S'exercer", en: "Practice" },
  exam: { nl: "Proefexamen", fr: "Examen blanc", en: "Mock exam" },
  learn: { nl: "Leerstof", fr: "Matière", en: "Study" },
  lexicon: { nl: "Lexicon", fr: "Lexique", en: "Lexicon" },
  stats: { nl: "Mijn voortgang", fr: "Ma progression", en: "My progress" },
  about: { nl: "Over & bronnen", fr: "À propos & sources", en: "About & sources" },
  signIn: { nl: "Aanmelden", fr: "Se connecter", en: "Sign in" },
  signOut: { nl: "Afmelden", fr: "Se déconnecter", en: "Sign out" },
  region: { nl: "Gewest", fr: "Région", en: "Region" },
  allCategories: { nl: "Alle categorieën door elkaar", fr: "Toutes les catégories mélangées", en: "All categories mixed" },
  startExam: { nl: "Start proefexamen", fr: "Commencer l'examen blanc", en: "Start mock exam" },
  examIntro: {
    nl: "50 vragen, net als op het echte examen. Je slaagt vanaf 41/50. Vijf vragen gaan over zware overtredingen of snelheid: een fout daarop kost 5 punten — twee zulke fouten en je bent gebuisd. Je weet niet welke vragen dat zijn.",
    fr: "50 questions, comme au vrai examen. Réussite à partir de 41/50. Cinq questions portent sur des infractions graves ou la vitesse : une erreur y coûte 5 points — deux erreurs de ce type et c'est l'échec. Vous ne savez pas lesquelles.",
    en: "50 questions, just like the real exam. You pass from 41/50. Five questions cover serious offences or speeding: a mistake there costs 5 points — two such mistakes and you fail. You won't know which ones they are.",
  },
  check: { nl: "Controleer", fr: "Vérifier", en: "Check" },
  next: { nl: "Volgende", fr: "Suivante", en: "Next" },
  correct: { nl: "Juist!", fr: "Correct !", en: "Correct!" },
  incorrect: { nl: "Fout", fr: "Incorrect", en: "Incorrect" },
  explanation: { nl: "Uitleg", fr: "Explication", en: "Explanation" },
  source: { nl: "Bron", fr: "Source", en: "Source" },
  severeTag: { nl: "Zware overtreding — 5 punten", fr: "Infraction grave — 5 points", en: "Serious offence — 5 points" },
  difficulty1: { nl: "Basis", fr: "Base", en: "Basic" },
  difficulty2: { nl: "Gemiddeld", fr: "Moyen", en: "Intermediate" },
  difficulty3: { nl: "Moeilijk", fr: "Difficile", en: "Hard" },
  questionOf: { nl: "Vraag {i} van {n}", fr: "Question {i} sur {n}", en: "Question {i} of {n}" },
  score: { nl: "Score", fr: "Score", en: "Score" },
  passed: { nl: "Geslaagd!", fr: "Réussi !", en: "Passed!" },
  failed: { nl: "Niet geslaagd", fr: "Échoué", en: "Not passed" },
  reviewMistakes: { nl: "Bekijk je fouten", fr: "Revoir vos erreurs", en: "Review your mistakes" },
  tryAgain: { nl: "Opnieuw proberen", fr: "Réessayer", en: "Try again" },
  emailPlaceholder: { nl: "jouw@email.be", fr: "votre@email.be", en: "you@email.com" },
  magicLinkSent: {
    nl: "Controleer je mailbox — we stuurden je een aanmeldlink.",
    fr: "Vérifiez votre boîte mail — nous vous avons envoyé un lien de connexion.",
    en: "Check your inbox — we sent you a sign-in link.",
  },
  signInIntro: {
    nl: "Meld aan met een e-maillink om je voortgang op al je toestellen bij te houden. Oefenen kan ook zonder account.",
    fr: "Connectez-vous via un lien e-mail pour suivre votre progression sur tous vos appareils. Vous pouvez aussi vous exercer sans compte.",
    en: "Sign in with an email link to keep your progress across devices. You can also practice without an account.",
  },
  sendLink: { nl: "Stuur aanmeldlink", fr: "Envoyer le lien", en: "Send sign-in link" },
  unofficialNotice: {
    nl: "De Nederlandse en Franse teksten volgen de officiële wegcode. De Engelse versie is een zorgvuldige, onofficiële vertaling — bij twijfel geldt de officiële tekst (KB 01/12/1975).",
    fr: "Les textes néerlandais et français suivent le code de la route officiel. La version anglaise est une traduction soignée mais non officielle — en cas de doute, le texte officiel (AR 01/12/1975) prévaut.",
    en: "Dutch and French texts track the official Belgian road code. The English version is a careful but unofficial translation — in case of doubt the official text (Royal Decree 01/12/1975) prevails.",
  },
  timeLeft: { nl: "Resterende tijd", fr: "Temps restant", en: "Time left" },
  perQuestionTimer: { nl: "15 s per vraag (zoals op het examen)", fr: "15 s par question (comme à l'examen)", en: "15 s per question (like the real exam)" },
  answered: { nl: "beantwoord", fr: "répondues", en: "answered" },
  accuracy: { nl: "juist beantwoord", fr: "de bonnes réponses", en: "answered correctly" },
  keepGoing: { nl: "Blijf oefenen tot je constant boven 82% zit.", fr: "Continuez jusqu'à dépasser 82 % de façon constante.", en: "Keep practicing until you're consistently above 82%." },
  yourCarNote: { nl: "Jij bent bestuurder A.", fr: "Vous êtes le conducteur A.", en: "You are driver A." },
  noQuestions: { nl: "Nog geen vragen in deze categorie.", fr: "Pas encore de questions dans cette catégorie.", en: "No questions in this category yet." },
  signMeaning: { nl: "Betekenis", fr: "Signification", en: "Meaning" },
  searchLexicon: { nl: "Zoek een term…", fr: "Rechercher un terme…", en: "Search a term…" },
};

export function t(key: keyof typeof T, locale: Locale, vars?: Record<string, string | number>): string {
  let s = T[key]?.[locale] ?? T[key]?.en ?? String(key);
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}
