"use client";

import { useMemo, useState } from "react";
import type { Locale, Question } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Feedback, OptionButton, QuestionImageView, postAnswers, recordLocalAnswer } from "./QuestionCard";
import QuestionBadges from "./QuestionBadges";
import { shuffle } from "@/lib/shuffle";

export default function PracticePlayer({ questions, locale }: { questions: Question[]; locale: Locale }) {
  const order = useMemo(() => shuffle(questions), [questions]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [nCorrect, setNCorrect] = useState(0);
  const [done, setDone] = useState(false);

  // Display options in a random order (stable per question view); state keeps ORIGINAL indices.
  const current = order[Math.min(idx, Math.max(0, order.length - 1))];
  const perm = useMemo(
    () => (current ? shuffle([...current.options.keys()]) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.id]
  );

  if (order.length === 0) return <p className="text-neutral-500">{t("noQuestions", locale)}</p>;

  if (done) {
    const pct = Math.round((100 * nCorrect) / order.length);
    return (
      <div className="text-center space-y-4 py-10">
        <p className="text-5xl font-bold">{pct}%</p>
        <p>
          {nCorrect}/{order.length} {t("accuracy", locale)}
        </p>
        <p className="text-sm text-neutral-500">{t("keepGoing", locale)}</p>
        <button
          onClick={() => {
            setIdx(0);
            setChosen(null);
            setChecked(false);
            setNCorrect(0);
            setDone(false);
          }}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          {t("tryAgain", locale)}
        </button>
      </div>
    );
  }

  const q = order[idx];

  function check() {
    if (chosen === null || checked) return;
    setChecked(true);
    const correct = chosen === q.correct;
    if (correct) setNCorrect((n) => n + 1);
    recordLocalAnswer(q.id, q.category, correct);
    postAnswers([{ questionId: q.id, category: q.category, correct, mode: "practice" }]);
  }

  function next() {
    if (idx + 1 >= order.length) {
      setDone(true);
      return;
    }
    setIdx(idx + 1);
    setChosen(null);
    setChecked(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2 flex-wrap text-sm text-neutral-500 mb-3">
        <span>{t("questionOf", locale, { i: idx + 1, n: order.length })}</span>
        <QuestionBadges q={q} locale={locale} />
      </div>
      <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-5">
        <div
          className="h-1.5 bg-blue-600 rounded-full transition-all"
          style={{ width: `${(100 * idx) / order.length}%` }}
        />
      </div>

      <QuestionImageView q={q} locale={locale} />
      <h2 className="text-lg font-semibold leading-snug mb-4">{q.text[locale]}</h2>

      <div className="space-y-2.5">
        {perm.map((orig) => {
          const opt = q.options[orig];
          let state: "idle" | "selected" | "correct" | "wrong" = "idle";
          if (checked) {
            if (orig === q.correct) state = "correct";
            else if (orig === chosen) state = "wrong";
          } else if (orig === chosen) state = "selected";
          return (
            <OptionButton
              key={orig}
              label={opt[locale]}
              state={state}
              disabled={checked}
              onClick={() => setChosen(orig)}
            />
          );
        })}
      </div>

      {checked && chosen !== null && <Feedback q={q} locale={locale} chosen={chosen} />}

      <div className="mt-5 flex justify-end">
        {!checked ? (
          <button
            onClick={check}
            disabled={chosen === null}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-40"
          >
            {t("check", locale)}
          </button>
        ) : (
          <button
            onClick={next}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white font-medium"
          >
            {t("next", locale)}
          </button>
        )}
      </div>
    </div>
  );
}

