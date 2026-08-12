import { NextRequest, NextResponse } from "next/server";
import { consumeLoginToken, createSession, setSessionCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const locale = req.nextUrl.searchParams.get("locale") ?? "en";
  const email = await consumeLoginToken(token);
  if (!email) {
    return NextResponse.redirect(new URL(`/${locale}/login?error=expired`, req.nextUrl.origin));
  }
  const sid = await createSession(email);
  await setSessionCookie(sid);
  return NextResponse.redirect(new URL(`/${locale}`, req.nextUrl.origin));
}
