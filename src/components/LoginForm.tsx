"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

export default function LoginForm({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/auth/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    }).catch(() => null);
    setState(res?.ok ? "sent" : "error");
  }

  if (state === "sent") {
    return <p className="rounded-xl border border-green-600 bg-green-50 dark:bg-green-950 p-4">{t("magicLinkSent", locale)}</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("emailPlaceholder", locale)}
        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent"
      />
      <button
        disabled={state === "sending"}
        className="w-full px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {t("sendLink", locale)}
      </button>
      {state === "error" && <p className="text-sm text-red-600">Something went wrong — try again.</p>}
    </form>
  );
}
