"use client";

import { motion } from "framer-motion";
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

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { t } = useLocale();
  const { ref, inView } = useInView(0.1);

  return (
    <section id="projects" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
