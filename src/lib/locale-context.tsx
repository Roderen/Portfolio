"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, translations } from "./translations";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = any;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: T;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

function getBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("ru")) return "ru";
  if (lang.startsWith("uk")) return "uk";
  if (lang.startsWith("de") || lang.startsWith("ch")) return "de";
  return "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-locale") as Locale | null;
    setLocaleState(saved || getBrowserLocale());
  }, []);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    localStorage.setItem("portfolio-locale", newLocale);
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
