import Link from "next/link";
import { notFound } from "next/navigation";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import RegionSwitcher from "@/components/RegionSwitcher";
import { getSessionUser } from "@/lib/auth";
import { isLocale, t } from "@/lib/i18n";
import { getRegion } from "@/lib/prefs";
import type { Locale } from "@/lib/types";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const [user, region] = await Promise.all([getSessionUser(), getRegion()]);

  const nav = [
    { href: `/${locale}/practice`, label: t("practice", locale) },
    { href: `/${locale}/exam`, label: t("exam", locale) },
    { href: `/${locale}/learn`, label: t("learn", locale) },
    { href: `/${locale}/lexicon`, label: t("lexicon", locale) },
    { href: `/${locale}/stats`, label: t("stats", locale) },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <Link href={`/${locale}`} className="font-bold text-lg whitespace-nowrap">
            🚗 {t("appName", locale)}
          </Link>
          <nav className="flex gap-3 text-sm flex-wrap">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-neutral-600 dark:text-neutral-300 hover:text-blue-600">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <RegionSwitcher current={region} locale={locale} />
            <LocaleSwitcher current={locale} />
            {user ? (
              <form action={`/api/auth/signout?locale=${locale}`} method="post">
                <button className="text-sm text-neutral-500 hover:text-blue-600">{t("signOut", locale)}</button>
              </form>
            ) : (
              <Link href={`/${locale}/login`} className="text-sm text-neutral-500 hover:text-blue-600">
                {t("signIn", locale)}
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">{children}</main>
      <footer className="border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-1">
          <p>{t("unofficialNotice", locale)}</p>
          <p>
            <Link href={`/${locale}/about`} className="underline">
              {t("about", locale)}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
