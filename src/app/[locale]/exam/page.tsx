import { notFound } from "next/navigation";
import ExamPlayer from "@/components/ExamPlayer";
import { drawExam } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";
import { getRegion } from "@/lib/prefs";

export const dynamic = "force-dynamic";

export default async function ExamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const region = await getRegion();
  const questions = await drawExam(region);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">{t("exam", locale)}</h1>
      <p className="text-sm text-neutral-500 mb-1">{t("examIntro", locale)}</p>
      <p className="text-xs text-neutral-400 mb-6">{t("perQuestionTimer", locale)}</p>
      <ExamPlayer questions={questions} locale={locale} region={region} />
    </div>
  );
}
