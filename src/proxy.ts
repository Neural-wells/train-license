import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    return NextResponse.next();
  }
  const preferred = req.cookies.get("tl_locale")?.value;
  const locale = preferred && isLocale(preferred) ? preferred : DEFAULT_LOCALE;
  return NextResponse.redirect(new URL(`/${locale}${pathname === "/" ? "" : pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!api|_next|signs|favicon.ico|.*\\..*).*)"],
};
