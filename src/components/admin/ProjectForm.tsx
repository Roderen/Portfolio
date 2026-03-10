"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/lib/types";

interface ProjectFormProps {
  project: Project | null;
  onSave: (project: Project) => void;
  onClose: () => void;
}

export default function ProjectForm({ project, onSave, onClose }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [imageUrl, setImageUrl] = useState(project?.imageUrl || "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || "");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(project?.skills || []);
  const [order, setOrder] = useState(project?.order || 0);
  const [visible, setVisible] = useState(project?.visible ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      setImageUrl(url);
    } else {
      setError("Upload failed");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) {
      setError("Title and description are required");
      return;
    }
    if (skills.length === 0) {
      setError("Add at least one skill");
      return;
    }

    setSaving(true);
    setError("");

    const body = { title, description, imageUrl: imageUrl || null, liveUrl: liveUrl || null, skills, order, visible };

    const res = project
      ? await fetch(`/api/projects/${project.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (res.ok) {
      const saved = await res.json();
      onSave(saved);
    } else {
      setError("Failed to save project");
    }
    setSaving(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-lg font-semibold">{project ? "Edit Project" : "Add Project"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Screenshot</label>
            <div className="flex gap-3 items-start">
              {imageUrl && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-white/10 rounded-xl text-sm text-gray-300 transition-colors disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : imageUrl ? "Change Image" : "Upload Image"}
                </button>
                <p className="text-xs text-gray-600 mt-1.5">JPG, PNG, WebP — max 5MB</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Project Title <span className="text-red-400">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Project"
              className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief project description..."
              className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Live URL</label>
            <input
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
              className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Technologies <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="React, TypeScript..."
                className="flex-1 bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-indigo-600/50 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 rounded-xl text-sm transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-indigo-400 hover:text-red-400 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Order + Visible */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1.5">Sort Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
              />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => setVisible(!visible)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    visible ? "bg-indigo-600" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      visible ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-400">Visible</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {saving ? "Saving..." : project ? "Save Changes" : "Add Project"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
