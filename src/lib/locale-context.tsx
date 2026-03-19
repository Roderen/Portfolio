"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Locale, translations } from "./translations";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = any;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: T;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    // Persist as a cookie so the server uses it on the next request
    document.cookie = `portfolio-locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
