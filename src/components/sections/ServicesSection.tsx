"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { useInView } from "@/lib/use-in-view";
import { TranslationKeys } from "@/lib/translations";

// ── Icons ────────────────────────────────────────────────────────────────────

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconMonitor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function IconApi() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconCloud() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

// ── Service card data ─────────────────────────────────────────────────────────

type ServiceItem = {
  icon: ReactNode;
  title: string;
  desc: string;
  features: string[];
  gradient: string;
  border: string;
  accent: string;
};

function getServices(t: TranslationKeys): ServiceItem[] {
  return [
    {
      icon: <IconGlobe />,
      title: t.services.s1_title,
      desc: t.services.s1_desc,
      features: [t.services.s1_f1, t.services.s1_f2, t.services.s1_f3, t.services.s1_f4],
      gradient: "from-indigo-500/20 to-indigo-500/5",
      border: "border-indigo-500/20",
      accent: "text-indigo-400",
    },
    {
      icon: <IconMonitor />,
      title: t.services.s2_title,
      desc: t.services.s2_desc,
      features: [t.services.s2_f1, t.services.s2_f2, t.services.s2_f3, t.services.s2_f4],
      gradient: "from-cyan-500/20 to-cyan-500/5",
      border: "border-cyan-500/20",
      accent: "text-cyan-400",
    },
    {
      icon: <IconCart />,
      title: t.services.s3_title,
      desc: t.services.s3_desc,
      features: [t.services.s3_f1, t.services.s3_f2, t.services.s3_f3, t.services.s3_f4],
      gradient: "from-violet-500/20 to-violet-500/5",
      border: "border-violet-500/20",
      accent: "text-violet-400",
    },
    {
      icon: <IconApi />,
      title: t.services.s4_title,
      desc: t.services.s4_desc,
      features: [t.services.s4_f1, t.services.s4_f2, t.services.s4_f3, t.services.s4_f4],
      gradient: "from-emerald-500/20 to-emerald-500/5",
      border: "border-emerald-500/20",
      accent: "text-emerald-400",
    },
    {
      icon: <IconCloud />,
      title: t.services.s5_title,
      desc: t.services.s5_desc,
      features: [t.services.s5_f1, t.services.s5_f2, t.services.s5_f3, t.services.s5_f4],
      gradient: "from-sky-500/20 to-sky-500/5",
      border: "border-sky-500/20",
      accent: "text-sky-400",
    },
    {
      icon: <IconWrench />,
      title: t.services.s6_title,
      desc: t.services.s6_desc,
      features: [t.services.s6_f1, t.services.s6_f2, t.services.s6_f3, t.services.s6_f4],
      gradient: "from-orange-500/20 to-orange-500/5",
      border: "border-orange-500/20",
      accent: "text-orange-400",
    },
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ServicesSection() {
  const { t } = useLocale();
  const { ref, inView } = useInView(0.1);
  const services = getServices(t);

  return (
    <section id="services" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
            — {t.services.badge} —
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">{t.services.title}</h2>
          <p className="text-gray-400 mt-4 text-lg">{t.services.subtitle}</p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className={`relative bg-gradient-to-br ${service.gradient} border ${service.border} rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-300`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gray-900/60 flex items-center justify-center ${service.accent}`}>
                {service.icon}
              </div>

              {/* Title & description */}
              <div>
                <h3 className="text-white font-semibold text-lg">{service.title}</h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{service.desc}</p>
              </div>

              {/* Feature list */}
              <ul className="mt-auto space-y-1.5">
                {service.features.map((feature) => (
                  <li key={feature} className={`flex items-center gap-2 text-sm ${service.accent}`}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
