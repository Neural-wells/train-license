#!/usr/bin/env node
/**
 * Re-downloads all road-sign SVGs listed in content/signs/manifest.json
 * from Wikimedia Commons into public/signs/.
 *
 * Idempotent: files that already exist and look like valid SVG are skipped.
 * Pass --force to re-download everything.
 *
 * Usage: node scripts/download-signs.mjs [--force]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "content", "signs", "manifest.json");
const signsDir = join(root, "public", "signs");
const force = process.argv.includes("--force");

const USER_AGENT =
  "train-license/1.0 (educational app; samdewaele1988@gmail.com)";

const isSvg = (text) => {
  const head = text.replace(/^﻿/, "").trimStart().slice(0, 300).toLowerCase();
  return head.startsWith("<?xml") || head.startsWith("<svg");
};

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
mkdirSync(signsDir, { recursive: true });

let downloaded = 0;
let skipped = 0;
const failed = [];

for (const entry of manifest) {
  const dest = join(root, "public", entry.file);
  if (!force && existsSync(dest) && isSvg(readFileSync(dest, "utf8"))) {
    skipped++;
    continue;
  }
  if (!entry.uploadUrl) {
    failed.push({ code: entry.code, reason: "manifest entry has no uploadUrl" });
    continue;
  }
  let ok = false;
  for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
    try {
      const res = await fetch(entry.uploadUrl, {
        headers: { "User-Agent": USER_AGENT },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!isSvg(text)) throw new Error("response is not an SVG document");
      writeFileSync(dest, text);
      ok = true;
      downloaded++;
      console.log(`ok   ${entry.code} <- ${entry.uploadUrl}`);
    } catch (err) {
      if (attempt === 3) {
        failed.push({ code: entry.code, reason: String(err.message ?? err) });
      } else {
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
  }
  // modest rate limiting towards Commons
  await new Promise((r) => setTimeout(r, 400));
}

console.log(
  `\ndone: ${downloaded} downloaded, ${skipped} already present, ${failed.length} failed (of ${manifest.length})`
);
for (const f of failed) console.error(`FAILED ${f.code}: ${f.reason}`);
if (failed.length > 0) process.exitCode = 1;
