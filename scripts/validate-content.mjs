// Validates all content files against CONTENT_SPEC.md. Run: node scripts/validate-content.mjs
import { readFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "content");
const LOCALES = ["nl", "fr", "en"];
const REGIONS = ["FL", "BR", "WA"];
const SIDES = ["n", "e", "s", "w"];
const CATEGORIES = [
  "signs-danger-priority",
  "signs-prohibition-obligation",
  "signs-parking-indication",
  "priority",
  "speed",
  "maneuvers",
  "parking",
  "vulnerable-users",
  "motorways-special",
  "driver-fitness-documents",
];

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

function localized(obj, where, { required = true } = {}) {
  if (obj == null) {
    if (required) err(`${where}: missing localized object`);
    return;
  }
  for (const l of LOCALES) {
    if (typeof obj[l] !== "string" || obj[l].trim() === "") err(`${where}: missing/empty "${l}"`);
  }
}

async function loadJson(rel) {
  const p = path.join(ROOT, rel);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(await readFile(p, "utf8"));
  } catch (e) {
    err(`${rel}: invalid JSON — ${e.message}`);
    return null;
  }
}

// ---- signs manifest ----
const manifest = (await loadJson("signs/manifest.json")) ?? [];
const signCodes = new Set(manifest.map((s) => s.code));
for (const s of manifest) {
  localized(s.meaning, `manifest ${s.code}.meaning`);
  for (const f of ["code", "file", "source", "license", "attribution"]) {
    if (typeof s[f] !== "string" || !s[f]) err(`manifest ${s.code ?? "?"}: missing ${f}`);
  }
  const filePath = path.join(process.cwd(), "public", "signs", `${s.code}.svg`);
  if (!existsSync(filePath)) err(`manifest ${s.code}: public/signs/${s.code}.svg missing`);
}

function checkImage(img, where) {
  if (img == null) return;
  if (img.type === "sign") {
    if (!signCodes.has(img.code)) err(`${where}: sign "${img.code}" not in manifest`);
  } else if (img.type === "signs") {
    if (!Array.isArray(img.codes) || img.codes.length === 0) err(`${where}: signs.codes empty`);
    else for (const c of img.codes) if (!signCodes.has(c)) err(`${where}: sign "${c}" not in manifest`);
  } else if (img.type === "scene") {
    const sc = img.scene;
    if (!sc || !["crossroads", "t-junction"].includes(sc.type)) err(`${where}: bad scene.type`);
    if (sc?.type === "t-junction" && sc.stem && !SIDES.includes(sc.stem)) err(`${where}: bad stem`);
    const vehicles = sc?.vehicles ?? [];
    if (vehicles.length < 1 || vehicles.length > 4) err(`${where}: scene needs 1-4 vehicles`);
    const labels = new Set();
    for (const v of vehicles) {
      if (!["A", "B", "C", "D"].includes(v.label)) err(`${where}: bad vehicle label "${v.label}"`);
      if (labels.has(v.label)) err(`${where}: duplicate vehicle "${v.label}"`);
      labels.add(v.label);
      if (!SIDES.includes(v.from) || !SIDES.includes(v.to)) err(`${where}: bad from/to`);
      if (v.from === v.to) err(`${where}: vehicle ${v.label} from===to`);
    }
    for (const s of sc?.signsFor ?? []) {
      if (!SIDES.includes(s.approach)) err(`${where}: bad signsFor.approach`);
      if (!signCodes.has(s.code)) err(`${where}: scene sign "${s.code}" not in manifest`);
    }
  } else {
    err(`${where}: unknown image.type "${img.type}"`);
  }
}

// ---- questions ----
let totalQ = 0;
const allIds = new Set();
const perCat = {};
for (const cat of CATEGORIES) {
  const file = await loadJson(`questions/${cat}.json`);
  if (!file) {
    warn(`questions/${cat}.json missing`);
    continue;
  }
  if (file.category !== cat) err(`questions/${cat}.json: category field is "${file.category}"`);
  const qs = file.questions ?? [];
  perCat[cat] = qs.length;
  totalQ += qs.length;
  for (const q of qs) {
    const w = `${cat}/${q.id ?? "?"}`;
    if (!q.id || !q.id.startsWith(cat + "-")) err(`${w}: id must start with "${cat}-"`);
    if (allIds.has(q.id)) err(`${w}: duplicate id`);
    allIds.add(q.id);
    if (![1, 2, 3].includes(q.difficulty)) err(`${w}: difficulty must be 1-3`);
    if (q.regions && (!Array.isArray(q.regions) || q.regions.some((r) => !REGIONS.includes(r))))
      err(`${w}: bad regions`);
    if (!["standard", "severe"].includes(q.severity)) err(`${w}: bad severity`);
    localized(q.text, `${w}.text`);
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4)
      err(`${w}: needs 2-4 options`);
    else {
      q.options.forEach((o, i) => localized(o, `${w}.options[${i}]`));
      if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length)
        err(`${w}: correct index out of range`);
    }
    localized(q.explanation, `${w}.explanation`);
    if (!Array.isArray(q.citations) || q.citations.length === 0) err(`${w}: needs >=1 citation`);
    else
      for (const c of q.citations)
        if (!c.source || !c.url || !/^https?:\/\//.test(c.url)) err(`${w}: bad citation`);
    checkImage(q.image, `${w}.image`);
  }
}

// ---- reading ----
let chapters = 0;
try {
  const files = (await readdir(path.join(ROOT, "reading"))).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    const ch = await loadJson(`reading/${f}`);
    if (!ch) continue;
    chapters++;
    const w = `reading/${f}`;
    if (ch.slug !== f.replace(/\.json$/, "")) err(`${w}: slug mismatch`);
    if (!Number.isInteger(ch.order)) err(`${w}: missing order`);
    localized(ch.title, `${w}.title`);
    if (!Array.isArray(ch.sections) || ch.sections.length < 2) err(`${w}: needs >=2 sections`);
    for (const [i, s] of (ch.sections ?? []).entries()) {
      localized(s.heading, `${w}.sections[${i}].heading`);
      localized(s.body, `${w}.sections[${i}].body`);
      if (!Array.isArray(s.citations) || s.citations.length === 0)
        warn(`${w}.sections[${i}]: no citations`);
      for (const m of ["nl", "fr", "en"]) {
        const body = s.body?.[m] ?? "";
        for (const [, code] of body.matchAll(/\/signs\/([A-Za-z0-9-]+)\.svg/g)) {
          if (!signCodes.has(code)) err(`${w}.sections[${i}].body.${m}: unknown sign "${code}"`);
        }
      }
    }
  }
} catch {
  warn("content/reading missing");
}

// ---- lexicon ----
const lexicon = (await loadJson("lexicon.json")) ?? [];
for (const [i, e] of lexicon.entries()) {
  for (const f of ["nl", "fr", "en"])
    if (typeof e[f] !== "string" || !e[f]) err(`lexicon[${i}]: missing ${f}`);
}

// ---- report ----
console.log("── content validation ──");
console.log(`questions: ${totalQ}`);
for (const [cat, n] of Object.entries(perCat)) console.log(`  ${cat}: ${n}`);
console.log(`reading chapters: ${chapters}`);
console.log(`lexicon entries: ${lexicon.length}`);
console.log(`signs in manifest: ${manifest.length}`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  warnings.slice(0, 40).forEach((w) => console.log("  ⚠ " + w));
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  errors.slice(0, 80).forEach((e) => console.error("  ✗ " + e));
  if (errors.length > 80) console.error(`  … and ${errors.length - 80} more`);
  process.exit(1);
}
console.log("\n✓ content valid");
