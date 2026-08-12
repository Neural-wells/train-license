# train-license — Belgian Driving Theory (Rijbewijs B / Permis B)

Trilingual (NL/FR/EN) web app to practice for the Belgian category B driving theory exam.
Practice questions with explanations and road-code citations, a realistic mock exam
(50 questions, pass at 41/50, 5-point serious-offence questions, 15 s/question), rule-reference
reading material, and a NL/FR/EN lexicon of legal traffic terms.

Built because good English-language prep for the Belgian theory exam barely exists.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind 4), deployed on **Fly.io** (region `ams`)
- **SQLite** via Node's built-in `node:sqlite` on a Fly volume (`/data`) — accounts & progress
- **Magic-link auth** via the Resend HTTP API (no key set → link is logged to the server console)
- **Tigris** (Fly's S3-compatible object storage) as the durable store for questions & artifacts
- Content lives in `content/` (see [CONTENT_SPEC.md](CONTENT_SPEC.md)); sources in [SOURCES.md](SOURCES.md)

## Local development

```bash
npm install
npm run dev        # http://localhost:3000 — sign-in links print to this console
npm run validate   # schema-validate all content (questions, reading, lexicon, signs)
```

## Content model

- `content/questions/<category>.json` — 10 categories of original, code-cited questions
- `content/reading/<slug>.json` — 12 rule-reference chapters
- `content/lexicon.json` — legal-term lexicon (official NL/FR ↔ curated EN)
- `content/signs/manifest.json` + `public/signs/*.svg` — sign images with per-file license/attribution
- Region differences (Flanders / Brussels / Wallonia) are modeled per question via `regions`

Dutch and French track the official texts; English is a careful but **unofficial** translation —
the official text (KB/AR 01/12/1975) prevails. The UI states this on every relevant page.

## Deployment (Fly.io)

One-time setup:

```bash
fly auth login
fly apps create train-license
fly volumes create tl_data --region ams --size 1
fly storage create                          # Tigris bucket; note the credentials it prints
fly secrets set RESEND_API_KEY=re_...       # optional — real sign-in emails
fly secrets set MAIL_FROM="Train License <noreply@yourdomain.be>"   # optional
```

Deploy (always `fly deploy`, never `fly launch` — launch re-provisions and rewrites fly.toml):

```bash
fly deploy
```

Sync content to Tigris and point the app at it (optional; the image bundles content as fallback):

```bash
AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... BUCKET_NAME=... npm run sync-tigris
fly secrets set CONTENT_BASE_URL=https://<bucket>.fly.storage.tigris.dev
```

## Scoring model (matches the real exam)

- 50 questions, 1 point each; pass at **41/50**
- A mistake on a question flagged `severe` (3rd/4th-degree offence or speeding) costs **5 points**
- Mock exam uses a 15-second per-question timer like the real exam
