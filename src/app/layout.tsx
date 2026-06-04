import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale-context";
import { cookies } from "next/headers";
import { Locale, translations } from "@/lib/translations";
import { Analytics } from "@vercel/analytics/next";
import { StructuredData } from "@/components/StructuredData";
import { Toaster } from "react-hot-toast";

const SUPPORTED: Locale[] = ["en", "ru", "uk", "de"];

const LOCALE_TO_OG: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
  uk: "uk_UA",
  de: "de_DE",
};

export async function generateMetadata(): Promise<Metadata> {
  const jar = await cookies();
  const raw = jar.get("portfolio-locale")?.value;
  const locale: Locale = SUPPORTED.includes(raw as Locale) ? (raw as Locale) : "en";
  const t = translations[locale];

  return {
    title: "corweb | Maksym Vereshchahin",
    description: t.hero.subtitle || "Maksym Vereshchahin — Full-Stack Web Developer. Modern websites for businesses.",
    keywords: [
      "web developer",
      "full-stack developer",
      "Next.js",
      "React",
      "TypeScript",
      "portfolio",
      "web development",
      "Maksym Vereshchahin",
      "corweb",
    ],
    authors: [{ name: "Maksym Vereshchahin" }],
    creator: "Maksym Vereshchahin",
    publisher: "corweb.dev",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      url: "https://corweb.dev",
      title: "corweb | Maksym Vereshchahin",
      description: t.hero.subtitle,
      siteName: "corweb",
      locale: LOCALE_TO_OG[locale],
      alternateLocale: ["en_US", "ru_RU", "uk_UA", "de_DE"],
    },
    twitter: {
      card: "summary_large_image",
      title: "corweb | Maksym Vereshchahin",
      description: t.hero.subtitle,
    },
    metadataBase: new URL("https://corweb.dev"),
    alternates: {
      canonical: "https://corweb.dev",
    },
  };
}

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
      <head>
        <StructuredData />
      </head>
      <body className="antialiased bg-gray-950">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #374151",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
