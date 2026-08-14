"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale, Question, Region } from "@/lib/types";
import { t } from "@/lib/i18n";
import { Feedback, OptionButton, QuestionImageView, postAnswers, recordLocalAnswer } from "./QuestionCard";
import QuestionBadges from "./QuestionBadges";

const SECONDS_PER_QUESTION = 15;
const PASS_SCORE = 41;

export default function ExamPlayer({
  questions,
  locale,
  region,
}: {
  questions: Question[];
  locale: Locale;
  region: Region;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [chosen, setChosen] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [reviewing, setReviewing] = useState(false);
  const submitted = useRef(false);

  const commit = useCallback(
    (choice: number | null) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[idx] = choice;
        return next;
      });
      setChosen(null);
      setTimeLeft(SECONDS_PER_QUESTION);
      if (idx + 1 >= questions.length) setFinished(true);
      else setIdx((i) => i + 1);
    },
    [idx, questions.length]
  );

  useEffect(() => {
    if (finished) return;
    const iv = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          commit(chosen);
          return SECONDS_PER_QUESTION;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [finished, commit, chosen]);

  useEffect(() => {
    if (!finished || submitted.current) return;
    submitted.current = true;
    const payload = questions.map((q, i) => ({
      questionId: q.id,
      category: q.category,
      correct: answers[i] === q.correct,
      mode: "exam" as const,
    }));
    payload.forEach((p) => recordLocalAnswer(p.questionId, p.category, p.correct));
    postAnswers(payload);
    const { score } = computeScore(questions, answers);
    fetch("/api/exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, region, locale }),
    }).catch(() => {});
  }, [finished, questions, answers, region, locale]);

  if (questions.length === 0) return <p className="text-neutral-500">{t("noQuestions", locale)}</p>;

  if (finished) {
    const { score, wrong } = computeScore(questions, answers);
    const passed = score >= PASS_SCORE;
    if (reviewing) {
      return (
        <div className="space-y-8">
          <h2 className="text-xl font-bold">{t("reviewMistakes", locale)}</h2>
          {wrong.map(({ q, given }) => (
            <div key={q.id} className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
              <div className="mb-2">
                <QuestionBadges q={q} locale={locale} />
              </div>
              <QuestionImageView q={q} locale={locale} />
              <p className="font-semibold mb-2">{q.text[locale]}</p>
              <Feedback q={q} locale={locale} chosen={given ?? -1} />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="text-center space-y-4 py-10">
        <p className={`text-2xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
          {passed ? t("passed", locale) : t("failed", locale)}
        </p>
        <p className="text-6xl font-bold">
          {score}
          <span className="text-2xl text-neutral-400">/50</span>
        </p>
        <p className="text-sm text-neutral-500">{t("examIntro", locale)}</p>
        {wrong.length > 0 && (
          <button
            onClick={() => setReviewing(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            {t("reviewMistakes", locale)} ({wrong.length})
          </button>
        )}
      </div>
    );
  }

  const q = questions[idx];

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-neutral-500">{t("questionOf", locale, { i: idx + 1, n: questions.length })}</span>
        <span
          className={`font-mono font-bold ${timeLeft <= 5 ? "text-red-600" : "text-neutral-600 dark:text-neutral-300"}`}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-5">
        <div
          className="h-1.5 bg-blue-600 rounded-full transition-all"
          style={{ width: `${(100 * idx) / questions.length}%` }}
        />
      </div>

      <QuestionImageView q={q} locale={locale} />
      <h2 className="text-lg font-semibold leading-snug mb-4">{q.text[locale]}</h2>

      <div className="space-y-2.5">
        {q.options.map((opt, i) => (
          <OptionButton
            key={i}
            label={opt[locale]}
            state={i === chosen ? "selected" : "idle"}
            disabled={false}
            onClick={() => setChosen(i)}
          />
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => commit(chosen)}
          disabled={chosen === null}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-40"
        >
          {t("next", locale)}
        </button>
      </div>
    </div>
  );
}

function computeScore(questions: Question[], answers: (number | null)[]) {
  let penalty = 0;
  const wrong: { q: Question; given: number | null }[] = [];
  questions.forEach((q, i) => {
    if (answers[i] !== q.correct) {
      penalty += q.severity === "severe" ? 5 : 1;
      wrong.push({ q, given: answers[i] });
    }
  });
  return { score: Math.max(0, 50 - penalty), wrong };
}
