import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { insertExamResult } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new NextResponse(null, { status: 204 });

  const body = await req.json().catch(() => null);
  const score = Number(body?.score);
  const region = String(body?.region ?? "");
  const locale = String(body?.locale ?? "en");
  if (!Number.isInteger(score) || score < 0 || score > 50 || !["FL", "BR", "WA"].includes(region)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  insertExamResult(user.id, score, region, locale);
  return NextResponse.json({ ok: true });
}
