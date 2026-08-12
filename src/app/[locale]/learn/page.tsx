import Link from "next/link";
import { notFound } from "next/navigation";
import { getReadingChapters } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";

export default async function LearnIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const chapters = await getReadingChapters();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("learn", locale)}</h1>
      <p className="text-sm text-neutral-500">{t("unofficialNotice", locale)}</p>
      <ol className="space-y-2">
        {chapters.map((ch) => (
          <li key={ch.slug}>
            <Link
              href={`/${locale}/learn/${ch.slug}`}
              className="block rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 hover:border-blue-500 transition"
            >
              <span className="text-neutral-400 mr-2">{ch.order}.</span>
              <span className="font-medium">{ch.title[locale]}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
