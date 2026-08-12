import { NextRequest, NextResponse } from "next/server";
import { createLoginToken, sendLoginEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, locale } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  const token = await createLoginToken(email);
  const base = process.env.APP_URL ?? req.nextUrl.origin;
  const url = `${base}/api/auth/verify?token=${token}&locale=${locale === "nl" || locale === "fr" ? locale : "en"}`;
  try {
    await sendLoginEmail(email.toLowerCase().trim(), url);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
