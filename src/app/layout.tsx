import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale-context";

export const metadata: Metadata = {
  title: "Portfolio | Web Developer",
  description: "Full-Stack Web Developer portfolio — modern websites for businesses",
  openGraph: {
    type: "website",
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
