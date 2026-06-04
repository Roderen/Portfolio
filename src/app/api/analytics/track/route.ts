import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

/**
 * Track page views and project interactions
 * POST /api/analytics/track
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, path, projectId } = body;

    // Get user info (anonymized)
    const userAgent = req.headers.get("user-agent") || undefined;
    const ip = getClientIP(req);
    const hashedIP = ip ? hashIP(ip) : undefined; // Hash IP for privacy

    switch (type) {
      case "pageView":
        if (!path) {
          return NextResponse.json({ error: "Path required" }, { status: 400 });
        }
        await db.pageView.create({
          data: { path, userAgent, ip: hashedIP },
        });
        break;

      case "projectView":
        if (!projectId) {
          return NextResponse.json({ error: "ProjectId required" }, { status: 400 });
        }
        await db.projectView.create({
          data: { projectId: parseInt(projectId), userAgent, ip: hashedIP },
        });
        break;

      case "projectClick":
        if (!projectId) {
          return NextResponse.json({ error: "ProjectId required" }, { status: 400 });
        }
        await db.projectClick.create({
          data: { projectId: parseInt(projectId), userAgent, ip: hashedIP },
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}

/**
 * Get client IP address from request
 */
function getClientIP(req: NextRequest): string | null {
  // Try to get real IP from Vercel headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return null;
}

/**
 * Hash IP address for privacy (GDPR compliance)
 */
function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
}
