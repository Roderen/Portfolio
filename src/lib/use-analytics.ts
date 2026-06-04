import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Analytics tracking hook
 */
export function useAnalytics() {
  const pathname = usePathname();

  // Track page view on mount and pathname change
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return {
    trackProjectView,
    trackProjectClick,
  };
}

/**
 * Track page view
 */
export async function trackPageView(path: string) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageView", path }),
    });
  } catch (error) {
    // Silent fail - don't break the app
    console.debug("Analytics tracking failed:", error);
  }
}

/**
 * Track project view (impression)
 */
export async function trackProjectView(projectId: number) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "projectView", projectId }),
    });
  } catch (error) {
    console.debug("Analytics tracking failed:", error);
  }
}

/**
 * Track project click
 */
export async function trackProjectClick(projectId: number) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "projectClick", projectId }),
    });
  } catch (error) {
    console.debug("Analytics tracking failed:", error);
  }
}
