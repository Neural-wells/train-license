import { notFound } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { isLocale, t } from "@/lib/i18n";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{t("signIn", locale)}</h1>
      <p className="text-sm text-neutral-500">{t("signInIntro", locale)}</p>
      <LoginForm locale={locale} />
    </div>
  );
}
