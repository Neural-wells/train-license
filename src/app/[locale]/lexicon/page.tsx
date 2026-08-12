import { notFound } from "next/navigation";
import LexiconTable from "@/components/LexiconTable";
import { getLexicon } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";

export default async function LexiconPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const entries = await getLexicon();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{t("lexicon", locale)}</h1>
      <p className="text-sm text-neutral-500">{t("unofficialNotice", locale)}</p>
      <LexiconTable entries={entries} locale={locale} />
    </div>
  );
}
