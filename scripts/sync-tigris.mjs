// Uploads content/ and public/signs/ to the Tigris bucket (durable store for
// questions and artifacts). The app reads from CONTENT_BASE_URL when set,
// falling back to the bundled copies.
//
// Requires env (from `fly storage create` / Tigris dashboard):
//   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET_NAME
//   AWS_ENDPOINT_URL_S3 (default https://fly.storage.tigris.dev)
//
// Run: node scripts/sync-tigris.mjs
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile, readdir, stat } from "fs/promises";
import path from "path";

const BUCKET = process.env.BUCKET_NAME;
if (!BUCKET) {
  console.error("BUCKET_NAME not set");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_ENDPOINT_URL_S3 ?? "https://fly.storage.tigris.dev",
});

const TYPES = {
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".md": "text/markdown",
};

async function* walk(dir) {
  for (const entry of await readdir(dir)) {
    const p = path.join(dir, entry);
    if ((await stat(p)).isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function uploadTree(localDir, prefix) {
  let n = 0;
  for await (const file of walk(localDir)) {
    const key = prefix + path.relative(localDir, file).replace(/\\/g, "/");
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: await readFile(file),
        ContentType: TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream",
      })
    );
    n++;
    process.stdout.write(`\r${prefix} ${n} files`);
  }
  console.log();
  return n;
}

const a = await uploadTree(path.join(process.cwd(), "content"), "content/");
const b = await uploadTree(path.join(process.cwd(), "public", "signs"), "signs/");
console.log(`✓ synced ${a + b} files to ${BUCKET}`);
