"use client";

import { useRouter } from "next/navigation";
import { REGIONS } from "@/lib/i18n";
import type { Locale, Region } from "@/lib/types";

export default function RegionSwitcher({ current, locale }: { current: Region; locale: Locale }) {
  const router = useRouter();

  return (
    <select
      value={current}
      onChange={(e) => {
        document.cookie = `tl_region=${e.target.value};path=/;max-age=31536000`;
        router.refresh();
      }}
      className="text-sm rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-2 py-1"
      aria-label="Region"
    >
      {REGIONS.map((r) => (
        <option key={r.code} value={r.code}>
          {r.label[locale]}
        </option>
      ))}
    </select>
  );
}
