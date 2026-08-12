import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import {
  consumeLoginTokenRow,
  deleteSession,
  findSessionUser,
  insertLoginToken,
  insertSession,
  upsertUser,
} from "./db";

const SESSION_COOKIE = "tl_session";
const SESSION_DAYS = 90;
const TOKEN_MINUTES = 15;

function sha256(v: string): string {
  return createHash("sha256").update(v).digest("hex");
}

export function createLoginToken(email: string): string {
  const token = randomBytes(32).toString("base64url");
  insertLoginToken(
    email.toLowerCase().trim(),
    sha256(token),
    Date.now() + TOKEN_MINUTES * 60_000
  );
  return token;
}

export function consumeLoginToken(token: string): string | null {
  return consumeLoginTokenRow(sha256(token));
}

export function createSession(email: string): string {
  const userId = upsertUser(email);
  const sid = randomBytes(32).toString("base64url");
  insertSession(sha256(sid), userId, Date.now() + SESSION_DAYS * 86_400_000);
  return sid;
}

export async function setSessionCookie(sid: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DAYS * 86_400,
    path: "/",
  });
}

export async function getSessionUser(): Promise<{ id: string; email: string } | null> {
  const sid = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sid) return null;
  return findSessionUser(sha256(sid));
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const sid = store.get(SESSION_COOKIE)?.value;
  if (sid) {
    deleteSession(sha256(sid));
    store.delete(SESSION_COOKIE);
  }
}

export async function sendLoginEmail(email: string, url: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[auth] RESEND_API_KEY not set — sign-in link for ${email}: ${url}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? "Train License <onboarding@resend.dev>",
      to: [email],
      subject: "Your sign-in link — Belgian Driving Theory",
      html: `<p>Click to sign in (valid 15 minutes):</p><p><a href="${url}">${url}</a></p><p>If you didn't request this, you can ignore this email.</p>`,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
  }
}
