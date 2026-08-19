import Link from "next/link";
import { notFound } from "next/navigation";
import { CURRICULUM } from "@/lib/curriculum";
import { getQuestionsFor, getReadingChapters } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";
import { getRegion } from "@/lib/prefs";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const region = await getRegion();
  const [questions, chapters] = await Promise.all([
    getQuestionsFor("all", region),
    getReadingChapters(),
  ]);
  const counts = new Map<string, number>();
  for (const q of questions) counts.set(q.category, (counts.get(q.category) ?? 0) + 1);
  const chapterBySlug = new Map(chapters.map((ch) => [ch.slug, ch]));

  return (
    <div className="space-y-8">
      <section className="text-center py-4">
        <h1 className="text-3xl font-bold mb-2">{t("appName", locale)}</h1>
        <p className="text-neutral-500 mb-5">{t("tagline", locale)}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href={`/${locale}/exam`}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            {t("startExam", locale)}
          </Link>
          <Link
            href={`/${locale}/practice/all`}
            className="px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 font-medium hover:border-blue-500"
          >
            🎲 {t("allCategories", locale)}
          </Link>
        </div>
      </section>

      <section>
        <ol className="space-y-2">
          {CURRICULUM.map((unit, i) => {
            const chapter = chapterBySlug.get(unit.chapter);
            if (!chapter) return null;
            const practiceCount =
              unit.practice && unit.practice !== "exam" ? counts.get(unit.practice) ?? 0 : null;
            return (
              <li
                key={unit.chapter}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center gap-3 flex-wrap"
              >
                <span className="text-neutral-400 font-mono text-sm w-6 text-right">{i + 1}</span>
                <span className="text-xl">{unit.icon}</span>
                <span className="flex-1 font-medium leading-snug min-w-[12rem]">
                  {chapter.title[locale]}
                </span>
                <span className="flex gap-2 ml-auto">
                  <Link
                    href={`/${locale}/learn/${unit.chapter}`}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium hover:border-blue-500 hover:text-blue-600 whitespace-nowrap"
                  >
                    📖 {t("learn", locale)}
                  </Link>
                  {unit.practice === "exam" ? (
                    <Link
                      href={`/${locale}/exam`}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
                    >
                      🎓 {t("exam", locale)}
                    </Link>
                  ) : unit.practice ? (
                    <Link
                      href={`/${locale}/practice/${unit.practice}`}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
                    >
                      ✏️ {t("practice", locale)}
                      {practiceCount !== null && (
                        <span className="opacity-70"> · {practiceCount}</span>
                      )}
                    </Link>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
