import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { insertAnswers, type AnswerRow } from "@/lib/db";

/** Record answered questions (practice or exam). Anonymous users get 204 — progress stays in localStorage. */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new NextResponse(null, { status: 204 });

  const body = await req.json().catch(() => null);
  const answers = Array.isArray(body?.answers) ? body.answers : [];
  const valid: AnswerRow[] = answers.filter((a: unknown): a is AnswerRow => {
    const x = a as Record<string, unknown>;
    return (
      typeof x?.questionId === "string" &&
      typeof x?.category === "string" &&
      typeof x?.correct === "boolean" &&
      (x?.mode === "practice" || x?.mode === "exam")
    );
  });
  if (valid.length === 0) return NextResponse.json({ error: "no_valid_answers" }, { status: 400 });

  insertAnswers(user.id, valid.slice(0, 100));
  return NextResponse.json({ ok: true, saved: valid.length });
}
