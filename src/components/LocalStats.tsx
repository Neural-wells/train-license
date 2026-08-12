"use client";

import { useEffect, useState } from "react";
import type { CategoryMeta, Locale } from "@/lib/types";

export default function LocalStats({ categories, locale }: { categories: CategoryMeta[]; locale: Locale }) {
  const [rows, setRows] = useState<{ cat: string; c: number; w: number }[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("tl_progress") ?? "{}") as Record<
        string,
        { c: number; w: number; cat?: string }
      >;
      const byCat = new Map<string, { c: number; w: number }>();
      for (const v of Object.values(data)) {
        if (!v.cat) continue;
        const cur = byCat.get(v.cat) ?? { c: 0, w: 0 };
        cur.c += v.c;
        cur.w += v.w;
        byCat.set(v.cat, cur);
      }
      setRows([...byCat.entries()].map(([cat, v]) => ({ cat, ...v })));
    } catch {
      // ignore
    }
  }, []);

  return <StatsTable rows={rows} categories={categories} locale={locale} />;
}

export function StatsTable({
  rows,
  categories,
  locale,
}: {
  rows: { cat: string; c: number; w: number }[];
  categories: CategoryMeta[];
  locale: Locale;
}) {
  if (rows.length === 0) return <p className="text-neutral-500 text-sm">—</p>;
  return (
    <div className="space-y-2">
      {categories
        .map((meta) => ({ meta, row: rows.find((r) => r.cat === meta.slug) }))
        .filter((x) => x.row && x.row.c + x.row.w > 0)
        .map(({ meta, row }) => {
          const total = row!.c + row!.w;
          const pct = Math.round((100 * row!.c) / total);
          return (
            <div key={meta.slug} className="flex items-center gap-3">
              <span className="w-64 truncate text-sm">
                {meta.icon} {meta.title[locale]}
              </span>
              <div className="flex-1 h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                <div
                  className={`h-2.5 rounded-full ${pct >= 82 ? "bg-green-600" : pct >= 60 ? "bg-amber-500" : "bg-red-600"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-20 text-right text-sm font-mono">
                {pct}% <span className="text-neutral-400">({total})</span>
              </span>
            </div>
          );
        })}
    </div>
  );
}
