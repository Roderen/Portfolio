"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AnimatedBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Large Text */}
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.notFound?.title || "Page Not Found"}
          </h2>

          <p className="text-lg text-gray-400 mb-8">
            {t.notFound?.description || "The page you're looking for doesn't exist or has been moved."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                {t.notFound?.backHome || "← Back to Home"}
              </motion.button>
            </Link>

            <Link href="/#contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-gray-700 text-white rounded-lg font-semibold hover:border-purple-500 transition-all"
              >
                {t.notFound?.contact || "Contact Me"}
              </motion.button>
            </Link>
          </div>

          {/* Additional Help Text */}
          <p className="mt-12 text-sm text-gray-500">
            {t.notFound?.help || "Need help? Feel free to reach out through the contact form."}
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      </div>
    </div>
  );
}
