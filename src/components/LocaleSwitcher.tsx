"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(loc: Locale) {
    const parts = pathname.split("/");
    parts[1] = loc;
    document.cookie = `tl_locale=${loc};path=/;max-age=31536000`;
    router.push(parts.join("/") || `/${loc}`);
  }

  return (
    <div className="flex gap-1 text-sm">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          className={`px-2 py-1 rounded-md uppercase font-medium ${
            loc === current
              ? "bg-blue-600 text-white"
              : "text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
