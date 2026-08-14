import { promises as fs } from "fs";
import path from "path";
import type {
  LexiconEntry,
  Question,
  QuestionFile,
  ReadingChapter,
  Region,
  SignManifestEntry,
} from "./types";
import { CATEGORIES } from "./categories";

/**
 * Content can be served from the local `content/` directory (bundled in the
 * image) or from a Tigris/S3 bucket when CONTENT_BASE_URL is set — the bucket
 * is the durable store, the local copy is the fallback.
 */
const CONTENT_BASE_URL = process.env.CONTENT_BASE_URL; // e.g. https://<bucket>.fly.storage.tigris.dev/content
const LOCAL_ROOT = path.join(process.cwd(), "content");

async function loadJson<T>(relPath: string): Promise<T | null> {
  if (CONTENT_BASE_URL) {
    try {
      const res = await fetch(`${CONTENT_BASE_URL}/${relPath.replace(/\\/g, "/")}`, {
        next: { revalidate: 300 },
      });
      if (res.ok) return (await res.json()) as T;
    } catch {
      // fall through to local copy
    }
  }
  try {
    const raw = await fs.readFile(path.join(LOCAL_ROOT, relPath), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const CACHE_TTL_MS = 5 * 60_000;
let questionCache: Question[] | null = null;
let questionCacheAt = 0;

export async function getAllQuestions(): Promise<Question[]> {
  if (questionCache && Date.now() - questionCacheAt < CACHE_TTL_MS) return questionCache;
  const all: Question[] = [];
  for (const cat of CATEGORIES) {
    const file = await loadJson<QuestionFile>(`questions/${cat.slug}.json`);
    if (!file) continue;
    for (const q of file.questions) {
      all.push({ ...q, category: file.category ?? cat.slug });
    }
  }
  questionCache = all;
  questionCacheAt = Date.now();
  return all;
}

export async function getQuestionsFor(
  category: string | "all",
  region: Region
): Promise<Question[]> {
  const all = await getAllQuestions();
  return all.filter(
    (q) =>
      (category === "all" || q.category === category) &&
      (!q.regions || q.regions.includes(region))
  );
}

export async function getReadingChapters(): Promise<ReadingChapter[]> {
  const dirFiles = await listReadingSlugs();
  const chapters: ReadingChapter[] = [];
  for (const slug of dirFiles) {
    const ch = await loadJson<ReadingChapter>(`reading/${slug}.json`);
    if (ch) chapters.push(ch);
  }
  return chapters.sort((a, b) => a.order - b.order);
}

const READING_SLUGS = [
  "road-basics",
  "traffic-signs",
  "priority",
  "speed",
  "maneuvers",
  "stopping-parking",
  "vulnerable-users",
  "motorways",
  "driver-vehicle",
  "fitness-alcohol",
  "accidents-emergencies",
  "exam-guide",
];

async function listReadingSlugs(): Promise<string[]> {
  // Local dir listing when available; otherwise the known chapter list.
  try {
    const files = await fs.readdir(path.join(LOCAL_ROOT, "reading"));
    const slugs = files.filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
    if (slugs.length > 0) return slugs;
  } catch {
    // ignore
  }
  return READING_SLUGS;
}

export async function getReadingChapter(slug: string): Promise<ReadingChapter | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return loadJson<ReadingChapter>(`reading/${slug}.json`);
}

export async function getLexicon(): Promise<LexiconEntry[]> {
  return (await loadJson<LexiconEntry[]>("lexicon.json")) ?? [];
}

export async function getSignManifest(): Promise<SignManifestEntry[]> {
  return (await loadJson<SignManifestEntry[]>("signs/manifest.json")) ?? [];
}

/**
 * Exam draw matching the real GOCA format: exactly 5 severe questions (worth 5
 * points each when wrong) + 45 standard questions spread across categories.
 */
export async function drawExam(region: Region): Promise<Question[]> {
  const pool = await getQuestionsFor("all", region);
  const severePick = shuffle(pool.filter((q) => q.severity === "severe")).slice(0, 5);

  const standardPool = pool.filter((q) => q.severity !== "severe");
  const byCat = new Map<string, Question[]>();
  for (const q of standardPool) {
    const list = byCat.get(q.category) ?? [];
    list.push(q);
    byCat.set(q.category, list);
  }
  const cats = [...byCat.keys()];
  const target = 50 - severePick.length;
  const perCat = Math.floor(target / Math.max(1, cats.length));
  const picked: Question[] = [];
  for (const cat of cats) {
    picked.push(...shuffle(byCat.get(cat)!).slice(0, perCat));
  }
  const remaining = shuffle(standardPool.filter((q) => !picked.includes(q)));
  picked.push(...remaining.slice(0, target - picked.length));
  return shuffle([...picked.slice(0, target), ...severePick]);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
