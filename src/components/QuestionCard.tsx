"use client";

import Scene from "./Scene";
import type { Locale, Question } from "@/lib/types";
import { t } from "@/lib/i18n";

export function QuestionImageView({ q, locale }: { q: Question; locale: Locale }) {
  if (!q.image) return null;
  if (q.image.type === "sign") {
    return (
      <div className="flex justify-center my-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/signs/${q.image.code}.svg`} alt={`Traffic sign ${q.image.code}`} className="h-32 w-auto" />
      </div>
    );
  }
  if (q.image.type === "signs") {
    return (
      <div className="flex justify-center gap-6 my-4 flex-wrap">
        {q.image.codes.map((c) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={c} src={`/signs/${c}.svg`} alt={`Traffic sign ${c}`} className="h-24 w-auto" />
        ))}
      </div>
    );
  }
  return (
    <div className="my-4">
      <Scene spec={q.image.scene} />
      {q.image.scene.vehicles.some((v) => v.label === "A") && (
        <p className="text-center text-sm text-neutral-500 mt-1">{t("yourCarNote", locale)}</p>
      )}
    </div>
  );
}

export function OptionButton({
  label,
  state,
  onClick,
  disabled,
}: {
  label: string;
  state: "idle" | "selected" | "correct" | "wrong";
  onClick: () => void;
  disabled: boolean;
}) {
  const styles: Record<string, string> = {
    idle: "border-neutral-300 dark:border-neutral-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950",
    selected: "border-blue-600 bg-blue-50 dark:bg-blue-950 ring-1 ring-blue-600",
    correct: "border-green-600 bg-green-50 dark:bg-green-950 ring-1 ring-green-600",
    wrong: "border-red-600 bg-red-50 dark:bg-red-950 ring-1 ring-red-600",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-4 py-3 rounded-xl border transition ${styles[state]} disabled:cursor-default`}
    >
      {label}
    </button>
  );
}

export function Feedback({ q, locale, chosen }: { q: Question; locale: Locale; chosen: number }) {
  const good = chosen === q.correct;
  return (
    <div
      className={`mt-4 rounded-xl border p-4 ${
        good
          ? "border-green-600 bg-green-50 dark:bg-green-950"
          : "border-red-600 bg-red-50 dark:bg-red-950"
      }`}
    >
      <p className="font-semibold">{good ? t("correct", locale) : t("incorrect", locale)}</p>
      <p className="mt-2 text-sm leading-relaxed">
        <span className="font-medium">{t("explanation", locale)}: </span>
        {q.explanation[locale]}
      </p>
      {q.citations?.length > 0 && (
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          {t("source", locale)}:{" "}
          {q.citations.map((c, i) => (
            <span key={i}>
              {i > 0 && "; "}
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer" className="underline">
                  {c.source}
                </a>
              ) : (
                c.source
              )}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

export function recordLocalAnswer(questionId: string, category: string, correct: boolean) {
  try {
    const key = "tl_progress";
    const data = JSON.parse(localStorage.getItem(key) ?? "{}");
    const cur = data[questionId] ?? { c: 0, w: 0, cat: category };
    cur.cat = category;
    if (correct) cur.c += 1;
    else cur.w += 1;
    cur.t = Date.now();
    data[questionId] = cur;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // private mode etc. — ignore
  }
}

export function postAnswers(
  answers: { questionId: string; category: string; correct: boolean; mode: "practice" | "exam" }[]
) {
  fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  }).catch(() => {});
}
