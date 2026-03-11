"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

export default function FooterLinks() {
  const { t } = useLocale();
  return (
    <Link
      href="/privacy"
      className="text-gray-600 hover:text-gray-400 transition-colors"
    >
      {t.footer.privacy}
    </Link>
  );
}
