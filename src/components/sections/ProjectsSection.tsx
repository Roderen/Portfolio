"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import ProjectCard from "@/components/ProjectCard";
import { useInView } from "@/lib/use-in-view";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  liveUrl?: string | null;
  skills: string[];
}

interface ProjectsSectionProps {
  projects: Project[];
}

const PAGE_MOBILE = 3;
const PAGE_DESKTOP = 6;

function usePageSize() {
  const [pageSize, setPageSize] = useState(PAGE_DESKTOP);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) =>
      setPageSize(e.matches ? PAGE_MOBILE : PAGE_DESKTOP);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return pageSize;
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { t } = useLocale();
  const { ref: inViewRef, inView } = useInView(0.1);
  const sectionRef = useRef<HTMLElement>(null);
  const pageSize = usePageSize();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(projects.length / pageSize);
  const paged = projects.slice(page * pageSize, page * pageSize + pageSize);

  // Reset to page 0 when pageSize changes (e.g. resize) or projects change
  useEffect(() => {
    setPage(0);
  }, [pageSize, projects]);

  const goTo = useCallback(
    (next: number) => {
      setPage(next);
      // Scroll to top of section
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    []
  );

  return (
    <section id="projects" ref={sectionRef} className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto" ref={inViewRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
            — {t.projects.badge} —
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">{t.projects.title}</h2>
          <p className="text-gray-400 mt-4 text-lg">{t.projects.subtitle}</p>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="text-gray-600 text-6xl mb-4">💻</div>
            <p className="text-gray-500 text-lg">{t.projects.no_projects}</p>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paged.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => goTo(page - 1)}
                  disabled={page === 0}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        i === page
                          ? "bg-indigo-600 text-white"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                      aria-label={`Page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goTo(page + 1)}
                  disabled={page === totalPages - 1}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
