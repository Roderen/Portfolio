"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale } from "@/lib/locale-context";
import { useInView } from "@/lib/use-in-view";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().optional(),
  telegram: z.string().min(2, "Telegram must be at least 2 characters"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all";

export default function ContactSection() {
  const { t } = useLocale();
  const { ref, inView } = useInView(0.2);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        toast.success(t.contact.success, {
          duration: 5000,
          icon: "✅",
        });
        reset();
        // Reset status after animation
        setTimeout(() => setStatus("idle"), 500);
      } else if (res.status === 429) {
        // Rate limit exceeded
        const errorData = await res.json().catch(() => ({}));
        const retryAfter = errorData.retryAfter || 3600;
        const minutes = Math.ceil(retryAfter / 60);
        toast.error(
          t.contact.rateLimitError?.replace("{minutes}", minutes.toString()) ||
          `Too many requests. Please try again in ${minutes} minutes.`,
          { duration: 6000, icon: "⏱️" }
        );
        setStatus("error");
      } else {
        setStatus("error");
        toast.error(t.contact.error, { duration: 4000, icon: "❌" });
      }
    } catch {
      setStatus("error");
      toast.error(t.contact.error, { duration: 4000, icon: "❌" });
    }
  }

  return (
    <section id="contact" className="relative py-24 px-6">
      <div className="max-w-2xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
            — {t.contact.badge} —
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">{t.contact.title}</h2>
          <p className="text-gray-400 mt-4 text-lg">{t.contact.subtitle}</p>
          <div className="flex flex-col items-center gap-2 mt-3">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              {t.contact.or_telegram}
              <a
                href="https://t.me/roderen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                aria-label="Telegram @roderen"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <rect width="24" height="24" rx="5" fill="currentColor"/>
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" fill="white"/>
                </svg>
              </a>
            </p>
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              {t.contact.or_email}
              <a
                href="mailto:relvarnes@gmail.com"
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-mono"
              >
                relvarnes@gmail.com
              </a>
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900/60 backdrop-blur-sm border border-white/8 rounded-2xl p-8 space-y-5"
        >
          {/* Name (optional) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 ml-1">
              {t.contact.label_name}{" "}
              <span className="text-gray-600 text-xs font-normal">({t.contact.optional})</span>
            </label>
            <input
              {...register("name")}
              placeholder={t.contact.name}
              className={inputClass}
            />
          </div>

          {/* Telegram (required) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 ml-1">
              {t.contact.label_telegram} <span className="text-indigo-400">*</span>
            </label>
            <input
              {...register("telegram")}
              placeholder={t.contact.telegram}
              className={inputClass}
            />
            {errors.telegram && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.telegram.message}</p>
            )}
          </div>

          {/* Phone (optional) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 ml-1">
              {t.contact.label_phone}{" "}
              <span className="text-gray-600 text-xs font-normal">({t.contact.optional})</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              placeholder={t.contact.phone}
              className={inputClass}
            />
          </div>

          {/* Email (required) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 ml-1">
              {t.contact.label_email} <span className="text-indigo-400">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder={t.contact.email}
              className={inputClass}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Message (optional) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 ml-1">
              {t.contact.label_message}{" "}
              <span className="text-gray-600 text-xs font-normal">({t.contact.optional})</span>
            </label>
            <textarea
              {...register("message")}
              rows={5}
              placeholder={t.contact.message}
              className={`${inputClass} resize-none`}
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {status === "sending" ? t.contact.sending : t.contact.send}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
