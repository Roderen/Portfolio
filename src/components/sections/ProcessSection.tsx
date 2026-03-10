"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { useInView } from "@/lib/use-in-view";
import { TranslationKeys } from "@/lib/translations";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconBrief() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function IconDesign() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ── Step data ─────────────────────────────────────────────────────────────────

type StepItem = {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  glow: string;
};

function getSteps(t: TranslationKeys): StepItem[] {
  return [
    {
      num: t.process.s1_num,
      title: t.process.s1_title,
      desc: t.process.s1_desc,
      icon: <IconBrief />,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
      glow: "shadow-indigo-500/20",
    },
    {
      num: t.process.s2_num,
      title: t.process.s2_title,
      desc: t.process.s2_desc,
      icon: <IconDesign />,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/30",
      glow: "shadow-violet-500/20",
    },
    {
      num: t.process.s3_num,
      title: t.process.s3_title,
      desc: t.process.s3_desc,
      icon: <IconCode />,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      glow: "shadow-cyan-500/20",
    },
    {
      num: t.process.s4_num,
      title: t.process.s4_title,
      desc: t.process.s4_desc,
      icon: <IconRocket />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/20",
    },
    {
      num: t.process.s5_num,
      title: t.process.s5_title,
      desc: t.process.s5_desc,
      icon: <IconShield />,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
      glow: "shadow-sky-500/20",
    },
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProcessSection() {
  const { t } = useLocale();
  const { ref, inView } = useInView(0.1);
  const steps = getSteps(t);

  return (
    <section id="process" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
            — {t.process.badge} —
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">{t.process.title}</h2>
          <p className="text-gray-400 mt-4 text-lg">{t.process.subtitle}</p>
        </motion.div>

        {/* Desktop timeline */}
        <div className="hidden md:block relative">
          {/* Connector line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-indigo-500/40 via-cyan-500/40 to-sky-500/40 origin-left"
          />

          <div className="grid grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className={`relative z-10 w-20 h-20 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center ${step.color} shadow-lg ${step.glow} mb-6`}>
                  {step.icon}
                  <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-950 border ${step.border} flex items-center justify-center text-[10px] font-mono font-bold ${step.color}`}>
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden relative">
          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute left-9 top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/40 via-cyan-500/40 to-sky-500/40 origin-top"
          />

          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex gap-5 items-start"
              >
                {/* Icon circle */}
                <div className={`relative z-10 flex-shrink-0 w-[4.5rem] h-[4.5rem] rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center ${step.color} shadow-lg ${step.glow}`}>
                  {step.icon}
                  <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-950 border ${step.border} flex items-center justify-center text-[9px] font-mono font-bold ${step.color}`}>
                    {i + 1}
                  </span>
                </div>

                {/* Text */}
                <div className="pt-3">
                  <h3 className="text-white font-semibold text-base">{step.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
