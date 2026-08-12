import { notFound } from "next/navigation";
import PracticePlayer from "@/components/PracticePlayer";
import { CATEGORIES, categoryMeta } from "@/lib/categories";
import { getQuestionsFor } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";
import { getRegion } from "@/lib/prefs";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isLocale(locale)) notFound();
  if (category !== "all" && !CATEGORIES.some((c) => c.slug === category)) notFound();

  const region = await getRegion();
  const questions = await getQuestionsFor(category, region);
  const meta = category === "all" ? null : categoryMeta(category);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-6">
        {meta ? `${meta.icon} ${meta.title[locale]}` : `🎲 ${t("allCategories", locale)}`}
      </h1>
      <PracticePlayer questions={questions} locale={locale} />
    </div>
  );
}
