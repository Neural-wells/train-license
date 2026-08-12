import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getQuestionsFor } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";
import { getRegion } from "@/lib/prefs";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const region = await getRegion();
  const questions = await getQuestionsFor("all", region);
  const counts = new Map<string, number>();
  for (const q of questions) counts.set(q.category, (counts.get(q.category) ?? 0) + 1);

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
            href={`/${locale}/practice`}
            className="px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 font-medium hover:border-blue-500"
          >
            {t("practice", locale)}
          </Link>
        </div>
      </section>

      <section>
        <div className="grid sm:grid-cols-2 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/practice/${c.slug}`}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 hover:border-blue-500 transition flex items-center gap-3"
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="flex-1">
                <span className="font-medium block">{c.title[locale]}</span>
                <span className="text-xs text-neutral-500">{counts.get(c.slug) ?? 0} Q</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
