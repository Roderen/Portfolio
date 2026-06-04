"use client";

import { useAnalytics } from "@/lib/use-analytics";

/**
 * Client component that tracks page views
 * Place in layout or page to enable analytics
 */
export default function AnalyticsTracker() {
  useAnalytics(); // Auto-tracks page views on route change
  return null; // This component doesn't render anything
}
