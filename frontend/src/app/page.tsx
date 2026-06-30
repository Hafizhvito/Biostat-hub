/** Beranda: hero (dari API settings) + grid materi. Empty state jika belum ada materi. */

import { HeroSection } from "@/components/home/HeroSection";
import { SectionGrid } from "@/components/home/SectionGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";

interface PublicSettingsResponse {
  hero_title: string;
  hero_description: string;
}

interface SectionItem {
  id: number;
  name: string;
  description: string | null;
  _count?: {
    videos: number;
  };
}

interface SectionsResponse {
  sections: SectionItem[];
  stats: {
    total_sections: number;
    total_videos: number;
  };
}

export default async function HomePage() {
  const [settings, sectionResponse] = await Promise.all([
    api<PublicSettingsResponse>("/settings"),
    api<SectionsResponse>("/sections"),
  ]);

  return (
    <div>
      <HeroSection
        title={settings.hero_title || "Biostat Hub"}
        description={settings.hero_description || "Belajar biostatistika dengan materi terstruktur."}
        totalSections={sectionResponse.stats.total_sections}
        totalVideos={sectionResponse.stats.total_videos}
      />

      {sectionResponse.sections.length === 0 ? (
        <EmptyState message="Belum ada materi. Materi akan segera ditambahkan." />
      ) : (
        <section className="space-y-4">
          <header>
            <h2 className="text-2xl font-bold text-brand-navy">Materi Pembelajaran</h2>
            <p className="mt-1 text-sm text-gray-600">
              Pilih materi sesuai urutan untuk pengalaman belajar yang lebih terarah.
            </p>
          </header>
          <SectionGrid sections={sectionResponse.sections} />
        </section>
      )}
    </div>
  );
}
