# Sources

Every question and reading section carries inline citations; this file documents the source
policy and the primary references. Per-sign image sourcing (Wikimedia Commons file, license,
attribution) is recorded in [`content/signs/manifest.json`](content/signs/manifest.json) and
shown in the app under **About & sources**.

## Legal texts (primary sources)

| Source | What we use it for | Link |
|---|---|---|
| **KB/AR 01/12/1975** — "Wegcode" / "Code de la route" (general traffic regulations) | The rules themselves: article-level citations on questions and reading material | https://www.ejustice.just.fgov.be/eli/besluit/1975/12/01/1975120109/justel |
| **Wet/Loi 16/03/1968** — "Wegverkeerswet" (road traffic law) | Alcohol & drugs limits, offence degrees, license withdrawal, hit-and-run | https://www.ejustice.just.fgov.be/eli/wet/1968/03/16/1968031601/justel |
| **wegcode.be** (NL) / **code-de-la-route.be** (FR) | Readable consolidated mirrors of the above, used for verification and as reader-friendly citation URLs | https://www.wegcode.be · https://www.code-de-la-route.be |

## Exam administration (regional authorities)

| Region | Authority | Link |
|---|---|---|
| Flanders | GOCA Vlaanderen | https://www.gocavlaanderen.be |
| Wallonia | SPW Mobilité (exams via Autosécurité/AIBV) | https://mobilite.wallonie.be |
| Brussels-Capital | Brussels Mobility | https://mobilite-mobiliteit.brussels |

Supporting sources for exam-practicalities facts (fees, language options, 12-hour course,
provisional license routes): FOD/SPF Mobiliteit, politie.be, VSV (Vlaamse Stichting
Verkeerskunde), autocontrole.be — cited inline where used.

## Question authorship & copyright

The official exam question banks are **proprietary** (owned by GOCA Vlaanderen, SPW Mobilité and
Brussels Mobility, licensed commercially to a single vendor). **No official exam questions are
used in this project.** All questions are original works: written in the official exam *format*
(scenario + 2–4 options, severe-offence weighting), but testing the public legal text, and each
citing the article it tests.

## Translations

Dutch and French content tracks the official statutory texts and terminology. **There is no
official English version of the Belgian road code** (official languages: NL/FR/DE), so the English
content is this project's curated translation, kept consistent via
[`content/lexicon.json`](content/lexicon.json) (official NL ↔ official FR ↔ project-canonical EN,
~126 terms). The app displays on relevant pages: *"in case of doubt the official text (Royal
Decree 01/12/1975) prevails."*

## Sign images

Belgian road-sign artwork is downloaded from **Wikimedia Commons**; each file's Commons page,
license and author attribution are recorded in `content/signs/manifest.json` (regenerable via
`scripts/download-signs.mjs`). Sign meanings are verified against wegcode.be before inclusion.

## Regional rule differences modeled

- Default limit outside built-up areas: **70 km/h Flanders** (since 2017) vs **90 km/h Wallonia/Brussels**
- Brussels-Capital: default **30 km/h** in built-up area since 2021 ("Stad 30" / "Ville 30")
- Exam logistics per region (fees, English options, booking) — reading chapter 12

Content was authored and fact-checked in **August 2026**; traffic law changes regularly (e.g.
indexed fines and the 1/7/2026 changes are included), so future updates should re-verify against
the consolidated texts above.

**Known upcoming change:** the new *Code van de openbare weg / Code de la voie publique*
(KB 03/06/2024) is slated to replace the 1975 wegcode on **01/09/2026**. All citations here use
the 1975 KB (in force at authoring time); article numbers will need remapping once the new code
takes effect.
