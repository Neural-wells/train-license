import { notFound } from "next/navigation";
import Scene from "@/components/Scene";
import { getAllQuestions } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import type { SceneSpec } from "@/lib/types";

/** Internal QA page: renders every scene question in the catalog (plus fixed samples)
 *  so scene geometry and correct answers can be reviewed at a glance. Not linked in nav. */

const SAMPLES: { label: string; spec: SceneSpec }[] = [
  {
    label: "Uncontrolled crossroads — B comes from A's right",
    spec: {
      type: "crossroads",
      vehicles: [
        { label: "A", from: "s", to: "n" },
        { label: "B", from: "e", to: "w" },
      ],
    },
  },
  {
    label: "A turns left, B oncoming straight",
    spec: {
      type: "crossroads",
      vehicles: [
        { label: "A", from: "s", to: "w" },
        { label: "B", from: "n", to: "s" },
      ],
    },
  },
  {
    label: "T-junction (stem s), A on stem has B1",
    spec: {
      type: "t-junction",
      stem: "s",
      signsFor: [{ approach: "s", code: "B1" }],
      vehicles: [
        { label: "A", from: "s", to: "w" },
        { label: "B", from: "w", to: "e" },
      ],
    },
  },
  {
    label: "Three cars, priority road for e-w (B9)",
    spec: {
      type: "crossroads",
      signsFor: [
        { approach: "e", code: "B9" },
        { approach: "w", code: "B9" },
        { approach: "s", code: "B1" },
      ],
      vehicles: [
        { label: "A", from: "s", to: "e" },
        { label: "B", from: "e", to: "w" },
        { label: "C", from: "w", to: "s" },
      ],
    },
  },
];

export default async function ScenesQA({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const questions = await getAllQuestions();
  const sceneQs = questions.filter((q) => q.image?.type === "scene");

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold">Scene QA — {SAMPLES.length} samples + {sceneQs.length} catalog scenes</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        {SAMPLES.map((s, i) => (
          <div key={`s-${i}`}>
            <p className="text-sm font-medium mb-2">{s.label}</p>
            <Scene spec={s.spec} />
          </div>
        ))}
        {sceneQs.map((q) => (
          <div key={q.id}>
            <p className="text-sm font-medium mb-1 font-mono">{q.id}</p>
            <p className="text-xs text-neutral-500 mb-2">
              {q.text.en} → <span className="font-semibold">{q.options[q.correct]?.en}</span>
            </p>
            {q.image?.type === "scene" && <Scene spec={q.image.scene} />}
          </div>
        ))}
      </div>
    </div>
  );
}
