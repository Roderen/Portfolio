"use client";

import { useState } from "react";

export interface ContentData {
  heroName: string | null;
  heroRole: string | null;
  heroSubtitle: string | null;
  aboutBio: string | null;
  aboutSkills: string | null; // JSON array stored as string
}

interface ContentPanelProps {
  initialContent: ContentData;
}

export default function ContentPanel({ initialContent }: ContentPanelProps) {
  const [heroName, setHeroName] = useState(initialContent.heroName ?? "");
  const [heroRole, setHeroRole] = useState(initialContent.heroRole ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(initialContent.heroSubtitle ?? "");
  const [aboutBio, setAboutBio] = useState(initialContent.aboutBio ?? "");
  const [skillsInput, setSkillsInput] = useState(
    initialContent.aboutSkills
      ? (JSON.parse(initialContent.aboutSkills) as string[]).join(", ")
      : ""
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroName: heroName.trim() || null,
          heroRole: heroRole.trim() || null,
          heroSubtitle: heroSubtitle.trim() || null,
          aboutBio: aboutBio.trim() || null,
          aboutSkills: skills.length > 0 ? JSON.stringify(skills) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-xl font-semibold">Content Editor</h2>
      <p className="text-sm text-gray-500 -mt-6">
        Leave a field empty to use the default translated value.
      </p>

      {/* Hero Section */}
      <div className="bg-gray-900/60 border border-white/8 rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-widest">
          Hero Section
        </h3>

        <div className="space-y-1">
          <label className="block text-xs text-gray-500">Name</label>
          <input
            type="text"
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            placeholder="e.g. Maksym Vereshchahin"
            className="w-full bg-gray-800 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-500">Role / Title</label>
          <input
            type="text"
            value={heroRole}
            onChange={(e) => setHeroRole(e.target.value)}
            placeholder="e.g. Full-Stack Web Developer"
            className="w-full bg-gray-800 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-500">Subtitle</label>
          <input
            type="text"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="e.g. I build modern, fast, and beautiful websites"
            className="w-full bg-gray-800 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-900/60 border border-white/8 rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-medium text-gray-300 uppercase tracking-widest">
          About Section
        </h3>

        <div className="space-y-1">
          <label className="block text-xs text-gray-500">Bio</label>
          <textarea
            value={aboutBio}
            onChange={(e) => setAboutBio(e.target.value)}
            placeholder="Write something about yourself..."
            rows={5}
            className="w-full bg-gray-800 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-gray-500">
            Skills{" "}
            <span className="text-gray-600">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="React, Next.js, TypeScript, Node.js"
            className="w-full bg-gray-800 border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {skillsInput.trim() && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {skillsInput
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg font-mono"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </button>
        {saved && <span className="text-sm text-green-400">Saved!</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </div>
  );
}
