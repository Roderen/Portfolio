"use client";

import Link from "next/link";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import { useLocale } from "@/lib/locale-context";

export default function PrivacyPage() {
  const { t } = useLocale();
  const p = t.privacy;

  const sections = [
    { title: p.s1_title, text: p.s1_text },
    { title: p.s2_title, text: p.s2_text },
    { title: p.s3_title, text: p.s3_text },
    { title: p.s4_title, text: p.s4_text },
    { title: p.s5_title, text: p.s5_text },
    { title: p.s6_title, text: p.s6_text },
  ];

  return (
    <div className="relative min-h-screen text-white">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="text-indigo-400 text-sm font-mono hover:text-indigo-300 transition-colors"
          >
            {p.back}
          </Link>

          <div className="mt-8 mb-12">
            <span className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
              {p.updated}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3">
              {p.title}
            </h1>
            <p className="text-gray-400 mt-4 text-lg">{p.subtitle}</p>
          </div>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i} className="border-l-2 border-indigo-500/30 pl-6">
                <h2 className="text-xl font-semibold text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">{section.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
            >
              {p.back}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
