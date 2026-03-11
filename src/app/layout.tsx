import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale-context";

export const metadata: Metadata = {
  title: "corweb | Maksym Vereshchahin",
  description: "Maksym Vereshchahin — Full-Stack Web Developer. Modern websites for businesses. corweb.dev",
  openGraph: {
    type: "website",
    url: "https://corweb.dev",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-950">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
