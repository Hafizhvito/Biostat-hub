import type { MetadataRoute } from "next";

const SITE_URL = "https://biostatresearch.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface VideoItem { id: number; updatedAt?: string }
interface SectionItem { id: number; updatedAt?: string; videos?: VideoItem[] }
interface SectionsResponse { sections: SectionItem[] }

async function getSectionsWithVideos(): Promise<SectionItem[]> {
  try {
    const sectionResponse = await fetch(`${API_URL}/sections`, { next: { revalidate: 3600 } });
    if (!sectionResponse.ok) return [];
    const { sections } = (await sectionResponse.json()) as SectionsResponse;
    return await Promise.all(sections.map(async (section) => {
      try {
        const response = await fetch(`${API_URL}/sections/${section.id}`, { next: { revalidate: 3600 } });
        return response.ok ? ((await response.json()) as SectionItem) : section;
      } catch {
        return section;
      }
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/materi`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/kuis`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/glosarium`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/unduhan`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/wizard`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/kalkulator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
  const sections = await getSectionsWithVideos();
  const sectionPages: MetadataRoute.Sitemap = sections.map((section) => ({
    url: `${SITE_URL}/section/${section.id}`,
    lastModified: section.updatedAt ? new Date(section.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));
  const videoPages: MetadataRoute.Sitemap = sections.flatMap((section) =>
    (section.videos ?? []).map((video) => ({
      url: `${SITE_URL}/video/${video.id}`,
      lastModified: video.updatedAt ? new Date(video.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );
  return [...staticPages, ...sectionPages, ...videoPages];
}
