"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  overview: {
    total: {
      pageViews: number;
      projectViews: number;
      projectClicks: number;
      messages: number;
      unreadMessages: number;
      projects: number;
    };
    today: {
      pageViews: number;
      messages: number;
    };
  };
  dailyStats: Array<{
    date: string;
    pageViews: number;
    projectViews: number;
    projectClicks: number;
    messages: number;
  }>;
  projectStats: Array<{
    id: number;
    title: string;
    views: number;
    clicks: number;
    ctr: number;
  }>;
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-400">
        Failed to load analytics data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[7, 14, 30, 90].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              days === d
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {d} days
          </button>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Page Views"
          value={data.overview.total.pageViews.toLocaleString()}
          subtitle={`${data.overview.today.pageViews} today`}
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Project Views"
          value={data.overview.total.projectViews.toLocaleString()}
          subtitle={`${data.overview.total.projectClicks} clicks`}
          icon="👁️"
          color="purple"
        />
        <StatCard
          title="Messages"
          value={data.overview.total.messages.toLocaleString()}
          subtitle={`${data.overview.total.unreadMessages} unread`}
          icon="📧"
          color="green"
        />
        <StatCard
          title="Projects"
          value={data.overview.total.projects.toLocaleString()}
          subtitle="Active projects"
          icon="🚀"
          color="pink"
        />
      </div>

      {/* Activity Chart */}
      <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Activity Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="pageViews"
              name="Page Views"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="projectViews"
              name="Project Views"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="messages"
              name="Messages"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Project Stats Table */}
      <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Project Performance</h3>
        {data.projectStats.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No project data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Project</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Views</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Clicks</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">CTR</th>
                </tr>
              </thead>
              <tbody>
                {data.projectStats.map((project) => (
                  <tr key={project.id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white">{project.title}</td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {project.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {project.clicks.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          project.ctr > 10
                            ? "bg-green-500/20 text-green-400"
                            : project.ctr > 5
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {project.ctr}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Project Clicks Chart */}
      <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Project Clicks Comparison</h3>
        {data.projectStats.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No project data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.projectStats.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="title"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="clicks" name="Clicks" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: "blue" | "purple" | "green" | "pink";
}) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/20",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/20",
    green: "from-green-500/20 to-green-600/10 border-green-500/20",
    pink: "from-pink-500/20 to-pink-600/10 border-pink-500/20",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 relative overflow-hidden`}
    >
      <div className="absolute top-4 right-4 text-4xl opacity-20">{icon}</div>
      <div className="relative z-10">
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-gray-500 text-xs">{subtitle}</p>
      </div>
    </div>
  );
}
