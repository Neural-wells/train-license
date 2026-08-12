"use client";

import { useMemo, useState } from "react";
import type { LexiconEntry, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

export default function LexiconTable({ entries, locale }: { entries: LexiconEntry[]; locale: Locale }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.toLowerCase().trim();
    if (!needle) return entries;
    return entries.filter((e) =>
      [e.nl, e.fr, e.en].some((v) => v.toLowerCase().includes(needle))
    );
  }, [entries, q]);

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("searchLexicon", locale)}
        className="w-full mb-4 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-300 dark:border-neutral-700">
              <th className="py-2 pr-4">Nederlands</th>
              <th className="py-2 pr-4">Français</th>
              <th className="py-2">English</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={i} className="border-b border-neutral-100 dark:border-neutral-800 align-top">
                <td className="py-2 pr-4 font-medium">{e.nl}</td>
                <td className="py-2 pr-4">{e.fr}</td>
                <td className="py-2">
                  {e.en}
                  {e.note?.[locale] && (
                    <span className="block text-xs text-neutral-500">{e.note[locale]}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
