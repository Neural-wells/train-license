import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { isLocale, t } from "@/lib/i18n";

export default async function PracticeIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("practice", locale)}</h1>
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href={`/${locale}/practice/all`}
          className="rounded-xl border border-blue-500 p-4 font-medium hover:bg-blue-50 dark:hover:bg-blue-950"
        >
          🎲 {t("allCategories", locale)}
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/${locale}/practice/${c.slug}`}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 hover:border-blue-500 transition"
          >
            {c.icon} <span className="font-medium">{c.title[locale]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
