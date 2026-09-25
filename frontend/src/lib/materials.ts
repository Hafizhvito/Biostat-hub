import type { MaterialSection, SectionsResponse } from "@/components/material/types";
import { api } from "@/lib/api";

export async function getSectionsWithVideos(options?: RequestInit): Promise<SectionsResponse> {
  const response = await api<SectionsResponse>("/sections", options);
  const needsDetails = response.sections.some((section) => !Array.isArray(section.videos));

  if (!needsDetails) return response;

  const sections = await Promise.all(
    response.sections.map(async (section) => {
      if (Array.isArray(section.videos)) return section;
      return api<MaterialSection>(`/sections/${section.id}`, options);
    }),
  );

  return { ...response, sections };
}
