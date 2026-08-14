import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getQuestionsFor, getReadingChapters } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";
import { getRegion } from "@/lib/prefs";
import { notFound } from "next/navigation";

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
  const chapterTitle = (slug: string) =>
    chapters.find((ch) => ch.slug === slug)?.title[locale] ?? slug;

  return (
    <div className="space-y-10">
      <section className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2">{t("appName", locale)}</h1>
        <p className="text-neutral-500 mb-6">{t("tagline", locale)}</p>
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
        <div className="grid sm:grid-cols-2 gap-4">
          {CATEGORIES.map((c) => (
            <div
              key={c.slug}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <span className="flex-1 font-medium leading-snug">{c.title[locale]}</span>
                <span className="text-xs text-neutral-400 whitespace-nowrap">
                  {counts.get(c.slug) ?? 0} Q
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/${locale}/learn/${c.reading[0]}`}
                  className="flex-1 text-center px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm font-medium hover:border-blue-500 hover:text-blue-600"
                >
                  📖 {t("learn", locale)}
                </Link>
                <Link
                  href={`/${locale}/practice/${c.slug}`}
                  className="flex-1 text-center px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  ✏️ {t("practice", locale)}
                </Link>
              </div>
              {c.reading.length > 1 && (
                <p className="text-xs text-neutral-500">
                  📖{" "}
                  {c.reading.slice(1).map((slug, i) => (
                    <span key={slug}>
                      {i > 0 && " · "}
                      <Link href={`/${locale}/learn/${slug}`} className="underline hover:text-blue-600">
                        {chapterTitle(slug)}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
