import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "crypto";

/**
 * SQLite via Node's built-in driver (no native deps). The file lives on the
 * Fly volume in production (DB_PATH=/data/train.db), ./dev.db locally.
 */
const globalForDb = globalThis as unknown as { tlDb?: DatabaseSync };

function open(): DatabaseSync {
  const db = new DatabaseSync(process.env.DB_PATH ?? "dev.db");
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS login_tokens (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      token_hash TEXT UNIQUE NOT NULL,
      expires_at INTEGER NOT NULL,
      used_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL,
      category TEXT NOT NULL,
      correct INTEGER NOT NULL,
      mode TEXT NOT NULL,
      answered_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_answers_user ON answers(user_id, category);
    CREATE TABLE IF NOT EXISTS exam_results (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      passed INTEGER NOT NULL,
      region TEXT NOT NULL,
      locale TEXT NOT NULL,
      taken_at INTEGER NOT NULL
    );
  `);
  return db;
}

export function db(): DatabaseSync {
  if (!globalForDb.tlDb) globalForDb.tlDb = open();
  return globalForDb.tlDb;
}

// ---- auth ----

export function insertLoginToken(email: string, tokenHash: string, expiresAt: number): void {
  db()
    .prepare("INSERT INTO login_tokens (id, email, token_hash, expires_at) VALUES (?, ?, ?, ?)")
    .run(randomUUID(), email, tokenHash, expiresAt);
}

export function consumeLoginTokenRow(tokenHash: string): string | null {
  const row = db()
    .prepare("SELECT id, email, expires_at, used_at FROM login_tokens WHERE token_hash = ?")
    .get(tokenHash) as { id: string; email: string; expires_at: number; used_at: number | null } | undefined;
  if (!row || row.used_at || row.expires_at < Date.now()) return null;
  db().prepare("UPDATE login_tokens SET used_at = ? WHERE id = ?").run(Date.now(), row.id);
  return row.email;
}

export function upsertUser(email: string): string {
  const existing = db().prepare("SELECT id FROM users WHERE email = ?").get(email) as
    | { id: string }
    | undefined;
  if (existing) return existing.id;
  const id = randomUUID();
  db().prepare("INSERT INTO users (id, email, created_at) VALUES (?, ?, ?)").run(id, email, Date.now());
  return id;
}

export function insertSession(idHash: string, userId: string, expiresAt: number): void {
  db()
    .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .run(idHash, userId, expiresAt);
}

export function findSessionUser(idHash: string): { id: string; email: string } | null {
  const row = db()
    .prepare(
      `SELECT u.id, u.email, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ?`
    )
    .get(idHash) as { id: string; email: string; expires_at: number } | undefined;
  if (!row || row.expires_at < Date.now()) return null;
  return { id: row.id, email: row.email };
}

export function deleteSession(idHash: string): void {
  db().prepare("DELETE FROM sessions WHERE id = ?").run(idHash);
}

// ---- progress ----

export interface AnswerRow {
  questionId: string;
  category: string;
  correct: boolean;
  mode: "practice" | "exam";
}

export function insertAnswers(userId: string, answers: AnswerRow[]): void {
  const stmt = db().prepare(
    "INSERT INTO answers (id, user_id, question_id, category, correct, mode, answered_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const a of answers) {
    stmt.run(randomUUID(), userId, a.questionId, a.category, a.correct ? 1 : 0, a.mode, Date.now());
  }
}

export function insertExamResult(
  userId: string,
  score: number,
  region: string,
  locale: string
): void {
  db()
    .prepare(
      "INSERT INTO exam_results (id, user_id, score, passed, region, locale, taken_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(randomUUID(), userId, score, score >= 41 ? 1 : 0, region, locale, Date.now());
}

export function statsByCategory(userId: string): { cat: string; c: number; w: number }[] {
  const rows = db()
    .prepare(
      `SELECT category AS cat,
              SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) AS c,
              SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) AS w
         FROM answers WHERE user_id = ? GROUP BY category`
    )
    .all(userId) as unknown as { cat: string; c: number; w: number }[];
  return rows;
}

export function recentExams(
  userId: string
): { id: string; score: number; passed: number; region: string; taken_at: number }[] {
  return db()
    .prepare(
      "SELECT id, score, passed, region, taken_at FROM exam_results WHERE user_id = ? ORDER BY taken_at DESC LIMIT 10"
    )
    .all(userId) as unknown as { id: string; score: number; passed: number; region: string; taken_at: number }[];
}
