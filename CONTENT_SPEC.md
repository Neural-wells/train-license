# Content Specification — train-license

Contract for all content in `content/`. All content is trilingual (Dutch `nl`, French `fr`, English `en`).
Dutch and French wording must track the official texts; English is a curated translation using the
project lexicon (`content/lexicon.json`) and is marked "unofficial translation" in the UI.

## Sources (cite these)

- **Wegcode / Code de la route**: Koninklijk besluit / Arrêté royal 01/12/1975 (algemeen reglement op de politie van het wegverkeer). Official consolidated text: https://www.ejustice.just.fgov.be/eli/besluit/1975/12/01/1975120109/justel — readable versions: https://www.wegcode.be (NL), https://www.code-de-la-route.be (FR).
- **Wegverkeerswet**: Wet van 16/03/1968 (alcohol, rijbewijs, strafbepalingen): https://www.ejustice.just.fgov.be/eli/wet/1968/03/16/1968031601/justel
- Regional exam info: GOCA Vlaanderen (https://www.gocavlaanderen.be), SPW Mobilité (https://mobilite.wallonie.be), Brussels Mobility (https://mobilite-mobiliteit.brussels).
- Every question and reading section MUST carry at least one citation with article number where applicable.

## Regions

`"FL"` = Flanders, `"BR"` = Brussels-Capital, `"WA"` = Wallonia.
Key regional differences (verify before use):
- Default limit outside built-up areas (non-motorway, no median): **70 km/h in FL** (since 2017), **70 km/h in BR** (since 01/01/2021), **90 km/h in WA only**.
- Brussels-Capital: default **30 km/h in built-up area** region-wide since 2021 ("Stad 30"), 50/70 only where signed.
- Motorways: minimum speed 70 km/h is **Art. 21.2**; the two-rightmost-lanes rule for buses/>3.5 t is **Art. 21.3**.
- Exam logistics (fees, interpreters) differ per region — reading material only.

A question omitting `regions` applies everywhere. If a rule differs by region, either write per-region
questions (set `regions`) or name the region explicitly in the question text.

## Question schema — `content/questions/<category>.json`

```json
{
  "category": "priority",
  "questions": [
    {
      "id": "priority-001",
      "difficulty": 2,
      "regions": ["FL"],
      "severity": "standard",
      "image": { "type": "sign", "code": "B1" },
      "text": { "nl": "…", "fr": "…", "en": "…" },
      "options": [
        { "nl": "…", "fr": "…", "en": "…" },
        { "nl": "…", "fr": "…", "en": "…" },
        { "nl": "…", "fr": "…", "en": "…" }
      ],
      "correct": 0,
      "explanation": { "nl": "…", "fr": "…", "en": "…" },
      "citations": [
        { "source": "Wegcode (KB 01/12/1975), Art. 12.3.1", "url": "https://www.wegcode.be/…" }
      ]
    }
  ]
}
```

Rules:
- `id`: `<category>-NNN`, zero-padded, unique.
- `difficulty`: 1 (basic) – 3 (tricky).
- `severity`: `"severe"` for questions about 3rd/4th-degree offences or speeding (cost 5 of the 50 points
  on the real exam, GOCA format), else `"standard"`.
- `options`: 2–4 entries, exactly one correct (`correct` = 0-based index). Belgian exam commonly uses 2–3 options.
- `explanation`: 1–3 sentences that teach the traffic situation, not just "correct is B".
- `image` is `null`, or one of:
  - `{ "type": "sign", "code": "B1" }` — single sign, rendered from `public/signs/<code>.svg`
  - `{ "type": "signs", "codes": ["C43-50", "F1"] }` — several signs side by side
  - `{ "type": "scene", "scene": <SceneSpec> }` — top-down situation diagram (see below)
- Question style mirrors the GOCA exam: short concrete scenario, direct question, plausible distractors.
- NL and FR wording must use official legal terms; EN uses the lexicon equivalents.

## SceneSpec (situation diagrams)

Rendered by `src/components/Scene.tsx` as a top-down SVG. Compass directions `n|e|s|w`.

```json
{
  "type": "crossroads",            // or "t-junction"
  "stem": "s",                     // t-junction only: which side the stem road joins from
  "signsFor": [ { "approach": "s", "code": "B1" } ],
  "vehicles": [
    { "label": "A", "from": "s", "to": "w" },
    { "label": "B", "from": "e", "to": "s" }
  ]
}
```

- Vehicle colors are assigned by label: A=red, B=blue, C=green, D=amber. `from` is the approach side,
  `to` the exit side (straight, left, right implied). The reader's own car, when relevant, is always "A"
  and the question text says "you are car A" (in each language).
- `signsFor` places a sign icon next to the approach it governs.
- Max 4 vehicles; keep scenes unambiguous.

## Reading material — `content/reading/<slug>.json`

```json
{
  "slug": "priority",
  "order": 3,
  "title": { "nl": "…", "fr": "…", "en": "…" },
  "sections": [
    {
      "heading": { "nl": "…", "fr": "…", "en": "…" },
      "body": { "nl": "markdown…", "fr": "markdown…", "en": "markdown…" },
      "citations": [ { "source": "…, Art. …", "url": "…" } ]
    }
  ]
}
```

Body is GitHub-flavored markdown; may reference signs inline as `![B1](/signs/B1.svg)`.

## Lexicon — `content/lexicon.json`

```json
[
  {
    "nl": "voorrang van rechts",
    "fr": "priorité de droite",
    "en": "priority to the right",
    "note": { "en": "Default rule at uncontrolled intersections." },
    "citation": { "source": "Wegcode, Art. 12.3.1", "url": "…" }
  }
]
```

NL/FR terms are the official statutory terms; EN is this project's canonical translation — use it
consistently across all content.

## Sign assets — `public/signs/<CODE>.svg` + `content/signs/manifest.json`

Manifest entry per sign:

```json
{
  "code": "B1",
  "meaning": { "nl": "…", "fr": "…", "en": "…" },
  "file": "signs/B1.svg",
  "source": "https://commons.wikimedia.org/wiki/File:…",
  "license": "…",
  "attribution": "…"
}
```

Question/reading content may only reference sign codes present in the manifest.

## Accuracy bar

Only state rules you are confident are current Belgian law (2026). When unsure of an article number,
verify against ejustice/wegcode.be rather than guessing. Never copy question text from commercial
question banks — all questions are original works citing the public legal text.
