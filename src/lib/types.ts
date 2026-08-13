export type Locale = "nl" | "fr" | "en";
export type Region = "FL" | "BR" | "WA";

export type Localized = Record<Locale, string>;

export interface SceneVehicle {
  label: string; // A, B, C, D
  from: "n" | "e" | "s" | "w";
  to: "n" | "e" | "s" | "w";
}

export interface SceneSign {
  approach: "n" | "e" | "s" | "w";
  code: string;
}

export interface SceneSpec {
  type: "crossroads" | "t-junction";
  stem?: "n" | "e" | "s" | "w";
  signsFor?: SceneSign[];
  vehicles: SceneVehicle[];
}

export type QuestionImage =
  | { type: "sign"; code: string }
  | { type: "signs"; codes: string[] }
  | { type: "scene"; scene: SceneSpec }
  | null;

export interface Citation {
  source: string;
  url?: string;
}

export interface Question {
  id: string;
  category: string;
  difficulty: 1 | 2 | 3;
  regions?: Region[];
  severity: "standard" | "severe";
  image: QuestionImage;
  text: Localized;
  options: Localized[];
  correct: number;
  explanation: Localized;
  citations: Citation[];
}

export interface QuestionFile {
  category: string;
  questions: Omit<Question, "category">[];
}

export interface ReadingSection {
  heading: Localized;
  body: Localized;
  citations: Citation[];
}

export interface ReadingChapter {
  slug: string;
  order: number;
  title: Localized;
  sections: ReadingSection[];
}

export interface LexiconEntry {
  nl: string;
  fr: string;
  en: string;
  note?: Partial<Localized>;
  citation?: Citation;
}

export interface SignManifestEntry {
  code: string;
  meaning: Localized;
  file: string;
  source: string;
  license: string;
  attribution: string;
  uploadUrl?: string;
}

export interface CategoryMeta {
  slug: string;
  title: Localized;
  icon: string; // emoji
}
