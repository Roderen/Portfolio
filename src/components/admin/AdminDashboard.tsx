"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import MessageList from "./MessageList";
import SettingsPanel from "./SettingsPanel";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { Project, ContactMessage as Message } from "@/lib/types";

type Tab = "projects" | "messages" | "analytics" | "settings";

export default function AdminDashboard({
  initialProjects,
  initialMessages,
  initialPhotoUrl,
}: {
  initialProjects: Project[];
  initialMessages: Message[];
  initialPhotoUrl: string | null;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState(initialProjects);
  const [messages, setMessages] = useState(initialMessages);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const unreadCount = messages.filter((m) => !m.read).length;

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function handleProjectSaved(project: Project) {
    if (editingProject) {
      setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
    } else {
      setProjects((prev) => [...prev, project]);
    }
    setShowForm(false);
    setEditingProject(null);
  }

  async function handleDeleteProject(id: number) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleReorder(reordered: Project[]) {
    setProjects(reordered);
    await fetch("/api/admin/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((p) => p.id) }),
    });
  }

  async function handleToggleVisibility(id: number, visible: boolean) {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible }),
    });
    const updated = await res.json();
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, visible: updated.visible } : p)));
  }

  function handleEditProject(project: Project) {
    setEditingProject(project);
    setShowForm(true);
  }

  async function handleMarkRead(id: number, read: boolean) {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
  }

  async function handleDeleteMessage(id: number) {
    if (!confirm("Delete this message?")) return;
    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 border-b border-white/8 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-indigo-400 font-bold text-xl font-mono">
              {"<Dev />"}
            </a>
            <span className="text-gray-600">/</span>
            <span className="text-gray-400 text-sm">Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View Site
            </a>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              {loggingOut ? "..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Projects", value: projects.length, icon: "🗂" },
            {
              label: "Published",
              value: projects.filter((p) => p.visible).length,
              icon: "✅",
            },
            { label: "Messages", value: messages.length, icon: "📨" },
            { label: "Unread", value: unreadCount, icon: "🔔" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900/60 border border-white/8 rounded-xl p-4"
            >
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["projects", "messages", "analytics", "settings"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                tab === t
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:text-white border border-white/8"
              }`}
            >
              {t}
              {t === "messages" && unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Projects</h2>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Project
              </button>
            </div>

            <ProjectList
              projects={projects}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onToggleVisibility={handleToggleVisibility}
              onReorder={handleReorder}
            />
          </div>
        )}

        {tab === "messages" && (
          <MessageList
            messages={messages}
            onMarkRead={handleMarkRead}
            onDelete={handleDeleteMessage}
          />
        )}

        {tab === "analytics" && <AnalyticsDashboard />}

        {tab === "settings" && (
          <SettingsPanel initialPhotoUrl={initialPhotoUrl} />
        )}
      </main>

      {/* Project Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProjectForm
            project={editingProject}
            onSave={handleProjectSaved}
            onClose={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
