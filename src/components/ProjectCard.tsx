"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "@/lib/locale-context";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  liveUrl?: string | null;
  skills: string[];
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { t } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group relative bg-gray-900/60 backdrop-blur-sm border border-white/8 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-cyan-500/0 group-hover:from-indigo-500/5 group-hover:to-cyan-500/5 transition-all duration-500 rounded-2xl" />

      {/* Screenshot */}
      <div className="relative w-full h-48 bg-gray-800 overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-600 flex flex-col items-center gap-2">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-mono">{project.title}</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-mono rounded-md border border-indigo-500/15"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* CTA */}
        {project.liveUrl ? (
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600/80 hover:bg-indigo-600 px-4 py-2.5 rounded-xl w-full justify-center transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t.projects.view}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </motion.a>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-600 px-4 py-2.5 rounded-xl w-full justify-center bg-gray-800/50">
            {t.projects.view}
          </div>
        )}
      </div>
    </motion.div>
  );
}
