import { NextRequest, NextResponse } from "next/server";

const SUPPORTED = ["en", "ru", "uk", "de"] as const;
const COOKIE = "portfolio-locale";

function detectLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return "en";
  // Parse "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7" into ordered language tags
  const langs = acceptLanguage
    .split(",")
    .map((entry) => entry.split(";")[0].trim().toLowerCase());

  for (const lang of langs) {
    if (lang.startsWith("ru")) return "ru";
    if (lang.startsWith("uk")) return "uk";
    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("en")) return "en";
  }
  return "en";
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // If the user already has a saved preference, keep it
  const existing = req.cookies.get(COOKIE)?.value;
  if (existing && (SUPPORTED as readonly string[]).includes(existing)) {
    return res;
  }

  // Auto-detect from browser's Accept-Language header
  const locale = detectLocale(req.headers.get("accept-language"));
  res.cookies.set(COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
