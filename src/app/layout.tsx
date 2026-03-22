import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale-context";
import { cookies } from "next/headers";
import { Locale } from "@/lib/translations";
import { Analytics } from "@vercel/analytics/next";

const SUPPORTED: Locale[] = ["en", "ru", "uk", "de"];

export const metadata: Metadata = {
  title: "corweb | Maksym Vereshchahin",
  description: "Maksym Vereshchahin — Full-Stack Web Developer. Modern websites for businesses. corweb.dev",
  openGraph: {
    type: "website",
    url: "https://corweb.dev",
    locale: "en_US",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const raw = jar.get("portfolio-locale")?.value;
  const initialLocale: Locale = SUPPORTED.includes(raw as Locale) ? (raw as Locale) : "en";

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <body className="antialiased bg-gray-950">
        <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
