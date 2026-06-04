import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://corweb.dev';

  // Get all visible projects
  let projects: { id: number; updatedAt: Date }[] = [];
  try {
    projects = await db.project.findMany({
      where: { visible: true },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch projects for sitemap:', error);
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic project pages (if/when project detail pages are created)
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: project.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages];
}
