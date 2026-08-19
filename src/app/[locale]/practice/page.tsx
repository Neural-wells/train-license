import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

/** The landing page is the navigation surface — this index is redundant. */
export default async function PracticeIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}`);
}
