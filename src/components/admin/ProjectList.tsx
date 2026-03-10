"use client";

import Image from "next/image";
import { Project } from "@/lib/types";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number, visible: boolean) => void;
}

export default function ProjectList({
  projects,
  onEdit,
  onDelete,
  onToggleVisibility,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600">
        <p className="text-4xl mb-3">🗂</p>
        <p>No projects yet. Add your first project!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`bg-gray-900/60 border rounded-xl p-4 flex items-center gap-4 transition-all ${
            project.visible ? "border-white/8" : "border-white/4 opacity-60"
          }`}
        >
          {/* Thumbnail */}
          <div className="w-16 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={64}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                No img
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white truncate">{project.title}</h3>
              {!project.visible && (
                <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                  Hidden
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">{project.description}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {project.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-mono"
                >
                  {skill}
                </span>
              ))}
              {project.skills.length > 4 && (
                <span className="text-xs text-gray-600">+{project.skills.length - 4}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Visibility toggle */}
            <button
              onClick={() => onToggleVisibility(project.id, !project.visible)}
              title={project.visible ? "Hide" : "Show"}
              className="p-2 text-gray-500 hover:text-yellow-400 transition-colors"
            >
              {project.visible ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-gray-500 hover:text-indigo-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 text-gray-500 hover:text-red-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
