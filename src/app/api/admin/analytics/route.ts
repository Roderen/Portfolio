import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

interface DailyStats {
  date: string;
  pageViews: number;
  projectViews: number;
  projectClicks: number;
  messages: number;
}

interface ProjectStats {
  id: number;
  title: string;
  views: number;
  clicks: number;
  ctr: number; // Click-through rate
}

export async function GET(req: NextRequest) {
  // Check admin authentication
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily statistics
    const dailyStats = await getDailyStats(startDate, endDate);

    // Get project statistics
    const projectStats = await getProjectStats(startDate, endDate);

    // Get overview statistics
    const overview = await getOverview();

    return NextResponse.json({
      overview,
      dailyStats,
      projectStats,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

async function getDailyStats(startDate: Date, endDate: Date): Promise<DailyStats[]> {
  // Get all data in parallel
  const [pageViews, projectViews, projectClicks, messages] = await Promise.all([
    db.pageView.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { createdAt: true },
    }),
    db.projectView.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { createdAt: true },
    }),
    db.projectClick.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { createdAt: true },
    }),
    db.contactMessage.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { createdAt: true },
    }),
  ]);

  // Group by date
  const statsMap = new Map<string, DailyStats>();

  // Initialize all dates with 0
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split("T")[0];
    statsMap.set(dateKey, {
      date: dateKey,
      pageViews: 0,
      projectViews: 0,
      projectClicks: 0,
      messages: 0,
    });
  }

  // Count page views
  pageViews.forEach((view) => {
    const dateKey = view.createdAt.toISOString().split("T")[0];
    const stats = statsMap.get(dateKey);
    if (stats) stats.pageViews++;
  });

  // Count project views
  projectViews.forEach((view) => {
    const dateKey = view.createdAt.toISOString().split("T")[0];
    const stats = statsMap.get(dateKey);
    if (stats) stats.projectViews++;
  });

  // Count project clicks
  projectClicks.forEach((click) => {
    const dateKey = click.createdAt.toISOString().split("T")[0];
    const stats = statsMap.get(dateKey);
    if (stats) stats.projectClicks++;
  });

  // Count messages
  messages.forEach((msg) => {
    const dateKey = msg.createdAt.toISOString().split("T")[0];
    const stats = statsMap.get(dateKey);
    if (stats) stats.messages++;
  });

  return Array.from(statsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

async function getProjectStats(startDate: Date, endDate: Date): Promise<ProjectStats[]> {
  const projects = await db.project.findMany({
    where: { visible: true },
    include: {
      views: {
        where: { createdAt: { gte: startDate, lte: endDate } },
      },
      clicks: {
        where: { createdAt: { gte: startDate, lte: endDate } },
      },
    },
  });

  return projects
    .map((project) => {
      const views = project.views.length;
      const clicks = project.clicks.length;
      const ctr = views > 0 ? (clicks / views) * 100 : 0;

      return {
        id: project.id,
        title: project.title,
        views,
        clicks,
        ctr: Math.round(ctr * 10) / 10,
      };
    })
    .sort((a, b) => b.views - a.views); // Sort by views descending
}

async function getOverview() {
  const [
    totalPageViews,
    totalProjectViews,
    totalProjectClicks,
    totalMessages,
    unreadMessages,
    totalProjects,
  ] = await Promise.all([
    db.pageView.count(),
    db.projectView.count(),
    db.projectClick.count(),
    db.contactMessage.count(),
    db.contactMessage.count({ where: { read: false } }),
    db.project.count({ where: { visible: true } }),
  ]);

  // Get today's stats
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [todayPageViews, todayMessages] = await Promise.all([
    db.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    db.contactMessage.count({ where: { createdAt: { gte: todayStart } } }),
  ]);

  return {
    total: {
      pageViews: totalPageViews,
      projectViews: totalProjectViews,
      projectClicks: totalProjectClicks,
      messages: totalMessages,
      unreadMessages,
      projects: totalProjects,
    },
    today: {
      pageViews: todayPageViews,
      messages: todayMessages,
    },
  };
}
