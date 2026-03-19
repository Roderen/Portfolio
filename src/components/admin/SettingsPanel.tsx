"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface SettingsPanelProps {
  initialPhotoUrl: string | null;
}

export default function SettingsPanel({ initialPhotoUrl }: SettingsPanelProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      await savePhotoUrl(data.url);
      setPhotoUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      // Reset input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function savePhotoUrl(url: string | null) {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemovePhoto() {
    setPhotoUrl(null);
    await savePhotoUrl(null);
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold mb-6">Site Settings</h2>

      {/* Photo section */}
      <div className="bg-gray-900/60 border border-white/8 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Profile Photo</h3>

        <div className="flex items-start gap-6">
          {/* Preview */}
          <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-800 border border-white/8 flex-shrink-0">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Profile photo"
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-1">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-xs">No photo</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || saving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {photoUrl ? "Replace photo" : "Upload photo"}
                </>
              )}
            </button>

            {photoUrl && (
              <button
                onClick={handleRemovePhoto}
                disabled={uploading || saving}
                className="px-4 py-2 bg-gray-800 hover:bg-red-500/20 hover:border-red-500/40 border border-white/8 disabled:opacity-50 text-gray-400 hover:text-red-400 rounded-lg text-sm transition-colors"
              >
                Remove photo
              </button>
            )}

            <p className="text-xs text-gray-600">JPG, PNG or WebP · max 5 MB</p>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}
        {saved && !error && (
          <p className="mt-3 text-sm text-green-400">Saved!</p>
        )}
      </div>
    </div>
  );
}
