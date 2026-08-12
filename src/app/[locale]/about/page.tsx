import { notFound } from "next/navigation";
import { getSignManifest } from "@/lib/content";
import { isLocale, t } from "@/lib/i18n";

const INTRO: Record<string, { heading: string; body: string[] }> = {
  nl: {
    heading: "Over deze app",
    body: [
      "Alle vragen zijn origineel werk, opgesteld naar het model van het officiële theorie-examen en telkens met verwijzing naar het artikel van de wegcode (KB 01/12/1975) of de wegverkeerswet (16/03/1968).",
      "De officiële examenvragen zijn eigendom van GOCA Vlaanderen, SPW Mobilité en Brussel Mobiliteit en worden hier niet gebruikt.",
    ],
  },
  fr: {
    heading: "À propos de cette application",
    body: [
      "Toutes les questions sont des œuvres originales, rédigées sur le modèle de l'examen théorique officiel, avec référence à l'article du code de la route (AR 01/12/1975) ou de la loi sur la circulation routière (16/03/1968).",
      "Les questions officielles d'examen appartiennent au GOCA, au SPW Mobilité et à Bruxelles Mobilité et ne sont pas utilisées ici.",
    ],
  },
  en: {
    heading: "About this app",
    body: [
      "All questions are original work, modeled on the official theory exam format, each citing the article of the Belgian road code (Royal Decree 01/12/1975) or the road traffic law (16/03/1968) it tests.",
      "The official exam question banks are owned by GOCA Vlaanderen, SPW Mobilité and Brussels Mobility and are not used here.",
    ],
  },
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const manifest = await getSignManifest();
  const intro = INTRO[locale];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-3">{intro.heading}</h1>
        {intro.body.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed mb-2">
            {p}
          </p>
        ))}
        <p className="text-sm leading-relaxed">{t("unofficialNotice", locale)}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">{t("source", locale)}</h2>
        <ul className="text-sm space-y-1 list-disc pl-5">
          <li>
            <a className="underline" href="https://www.ejustice.just.fgov.be/eli/besluit/1975/12/01/1975120109/justel" target="_blank" rel="noreferrer">
              KB/AR 01/12/1975 — Wegcode / Code de la route (ejustice.just.fgov.be)
            </a>
          </li>
          <li>
            <a className="underline" href="https://www.wegcode.be" target="_blank" rel="noreferrer">wegcode.be</a>
            {" / "}
            <a className="underline" href="https://www.code-de-la-route.be" target="_blank" rel="noreferrer">code-de-la-route.be</a>
          </li>
          <li>
            <a className="underline" href="https://www.ejustice.just.fgov.be/eli/wet/1968/03/16/1968031601/justel" target="_blank" rel="noreferrer">
              Wet/Loi 16/03/1968 — Wegverkeerswet
            </a>
          </li>
          <li>
            <a className="underline" href="https://www.gocavlaanderen.be" target="_blank" rel="noreferrer">GOCA Vlaanderen</a>
            {", "}
            <a className="underline" href="https://mobilite.wallonie.be" target="_blank" rel="noreferrer">SPW Mobilité</a>
            {", "}
            <a className="underline" href="https://mobilite-mobiliteit.brussels" target="_blank" rel="noreferrer">Brussels Mobility</a>
          </li>
        </ul>
      </section>

      {manifest.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Sign images</h2>
          <p className="text-sm text-neutral-500 mb-3">
            Road sign images via Wikimedia Commons — per-file source and license:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left border-b border-neutral-300 dark:border-neutral-700">
                  <th className="py-1 pr-3">Sign</th>
                  <th className="py-1 pr-3">{t("signMeaning", locale)}</th>
                  <th className="py-1 pr-3">License</th>
                  <th className="py-1">Source</th>
                </tr>
              </thead>
              <tbody>
                {manifest.map((s) => (
                  <tr key={s.code} className="border-b border-neutral-100 dark:border-neutral-800">
                    <td className="py-1 pr-3 font-mono">{s.code}</td>
                    <td className="py-1 pr-3">{s.meaning[locale]}</td>
                    <td className="py-1 pr-3">{s.license}</td>
                    <td className="py-1">
                      <a href={s.source} className="underline" target="_blank" rel="noreferrer">
                        Commons
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
