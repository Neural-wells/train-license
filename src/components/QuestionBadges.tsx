"use client";

import type { Locale, Question } from "@/lib/types";
import { t } from "@/lib/i18n";

const DIFF_STYLES: Record<number, string> = {
  1: "text-green-700 dark:text-green-400 border-green-600/40",
  2: "text-amber-700 dark:text-amber-400 border-amber-600/40",
  3: "text-red-700 dark:text-red-400 border-red-600/40",
};

export default function QuestionBadges({ q, locale }: { q: Question; locale: Locale }) {
  const diffKey = `difficulty${q.difficulty}` as "difficulty1" | "difficulty2" | "difficulty3";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${DIFF_STYLES[q.difficulty]}`}
        title={t(diffKey, locale)}
      >
        <span aria-hidden>
          {"●".repeat(q.difficulty)}
          {"○".repeat(3 - q.difficulty)}
        </span>
        {t(diffKey, locale)}
      </span>
      {q.severity === "severe" && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-red-600/50 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-medium">
          ⚠ {t("severeTag", locale)}
        </span>
      )}
    </span>
  );
}
