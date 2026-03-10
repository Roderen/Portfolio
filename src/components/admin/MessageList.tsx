"use client";

import { useState } from "react";
import { ContactMessage as Message } from "@/lib/types";

interface MessageListProps {
  messages: Message[];
  onMarkRead: (id: number, read: boolean) => void;
  onDelete: (id: number) => void;
}

export default function MessageList({ messages, onMarkRead, onDelete }: MessageListProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (messages.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600">
        <p className="text-4xl mb-3">📭</p>
        <p>No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`bg-gray-900/60 border rounded-xl overflow-hidden transition-all ${
            !msg.read ? "border-indigo-500/30" : "border-white/8"
          }`}
        >
          <div
            className="p-4 flex items-start gap-4 cursor-pointer hover:bg-white/2 transition-colors"
            onClick={() => {
              setExpanded(expanded === msg.id ? null : msg.id);
              if (!msg.read) onMarkRead(msg.id, true);
            }}
          >
            {/* Unread dot */}
            <div className="flex-shrink-0 mt-1">
              {!msg.read ? (
                <div className="w-2 h-2 bg-indigo-400 rounded-full" />
              ) : (
                <div className="w-2 h-2 bg-gray-700 rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={`text-sm font-semibold ${!msg.read ? "text-white" : "text-gray-300"}`}>
                    {msg.name || msg.telegram}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-indigo-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {msg.email}
                    </a>
                    {msg.telegram && (
                      <span className="text-xs text-sky-400">{msg.telegram}</span>
                    )}
                    {msg.phone && (
                      <span className="text-xs text-gray-400">{msg.phone}</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 flex-shrink-0">
                  {new Date(msg.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">{msg.message || "—"}</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onMarkRead(msg.id, !msg.read)}
                className="p-2 text-gray-600 hover:text-yellow-400 transition-colors"
                title={msg.read ? "Mark as unread" : "Mark as read"}
              >
                <svg className="w-3.5 h-3.5" fill={msg.read ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(msg.id)}
                className="p-2 text-gray-600 hover:text-red-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {expanded === msg.id && (
            <div className="px-4 pb-4 pt-0 border-t border-white/5 ml-6">
              <div className="mt-3 space-y-1 text-xs text-gray-400">
                {msg.name && <p><span className="text-gray-500">Имя:</span> {msg.name}</p>}
                <p><span className="text-gray-500">Telegram:</span> <span className="text-sky-400">{msg.telegram}</span></p>
                {msg.phone && <p><span className="text-gray-500">Телефон:</span> {msg.phone}</p>}
                <p><span className="text-gray-500">Email:</span> {msg.email}</p>
              </div>
              {msg.message && (
                <p className="text-sm text-gray-300 mt-3 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
              )}
              <a
                href={`mailto:${msg.email}?subject=Re: Your message`}
                className="inline-flex items-center gap-1.5 mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Reply via email
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
