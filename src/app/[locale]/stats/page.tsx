import Link from "next/link";
import { notFound } from "next/navigation";
import LocalStats, { StatsTable } from "@/components/LocalStats";
import { getSessionUser } from "@/lib/auth";
import { recentExams, statsByCategory } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import { isLocale, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function StatsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">{t("stats", locale)}</h1>
        <p className="text-sm text-neutral-500">
          {t("signInIntro", locale)}{" "}
          <Link href={`/${locale}/login`} className="underline text-blue-600">
            {t("signIn", locale)}
          </Link>
        </p>
        <LocalStats categories={CATEGORIES} locale={locale} />
      </div>
    );
  }

  const rows = statsByCategory(user.id);
  const exams = recentExams(user.id);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{t("stats", locale)}</h1>
        <p className="text-sm text-neutral-500">{user.email}</p>
      </div>
      <StatsTable rows={rows} categories={CATEGORIES} locale={locale} />
      {exams.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">{t("exam", locale)}</h2>
          <ul className="space-y-1 text-sm font-mono">
            {exams.map((e) => (
              <li key={e.id} className="flex gap-4">
                <span>{new Date(e.taken_at).toISOString().slice(0, 10)}</span>
                <span className={e.passed ? "text-green-600" : "text-red-600"}>{e.score}/50</span>
                <span className="text-neutral-400">{e.region}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
