"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "@/lib/locale-context";
import { useInView } from "@/lib/use-in-view";

interface AboutSectionProps {
  name: string;
  bio: string;
  photoUrl?: string;
  skills?: string[];
}

export default function AboutSection({ name, bio, photoUrl, skills }: AboutSectionProps) {
  const { t } = useLocale();
  const { ref, inView } = useInView(0.2);

  return (
    <section id="about" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
            — {t.about.badge} —
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">{t.about.title}</h2>
        </motion.div>

        <div className={`flex flex-col ${photoUrl ? "md:flex-row" : ""} items-center gap-12`}>
          {/* Photo */}
          {photoUrl && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <div className="relative w-56 h-56 md:w-72 md:h-72">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 blur-xl opacity-30 scale-105" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={photoUrl}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: photoUrl ? 30 : 0, y: photoUrl ? 0 : 20 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`${!photoUrl ? "max-w-2xl text-center mx-auto" : "flex-1"}`}
          >
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">{bio}</p>

            {skills && skills.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
                    className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm rounded-lg font-mono"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
