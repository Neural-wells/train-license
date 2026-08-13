import { marked } from "marked";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReadingChapter } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const chapter = await getReadingChapter(slug);
  if (!chapter) notFound();

  return (
    <article className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link href={`/${locale}/learn`} className="text-sm text-blue-600 underline">
          ← {t("learn", locale)}
        </Link>
        <h1 className="text-2xl font-bold mt-2">{chapter.title[locale]}</h1>
      </div>
      {chapter.sections.map((s, i) => (
        <section key={i}>
          <h2 className="text-lg font-semibold mb-2">{s.heading[locale]}</h2>
          <div
            className="prose prose-neutral dark:prose-invert max-w-none prose-img:inline-block prose-img:h-14 prose-img:w-auto prose-img:my-0 prose-img:align-middle text-[15px] leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: marked.parse(s.body[locale] ?? "") as string }}
          />
          {s.citations?.length > 0 && (
            <p className="mt-2 text-xs text-neutral-500">
              {t("source", locale)}:{" "}
              {s.citations.map((c, j) => (
                <span key={j}>
                  {j > 0 && "; "}
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer" className="underline">
                      {c.source}
                    </a>
                  ) : (
                    c.source
                  )}
                </span>
              ))}
            </p>
          )}
        </section>
      ))}
    </article>
  );
}
