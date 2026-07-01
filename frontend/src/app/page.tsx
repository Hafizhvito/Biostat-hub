/** Beranda: hero + grid materi + kuis. Ganti design: comment/uncomment salah satu export default. */

import { HeroSection } from "@/components/home/HeroSection";
import { HomeKuisSection } from "@/components/home/HomeKuisSection";
import { SectionGrid } from "@/components/home/SectionGrid";
import { KuisListItem } from "@/components/kuis/KuisList";
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
  _count?: { videos: number };
}

interface SectionsResponse {
  sections: SectionItem[];
  stats: { total_sections: number; total_videos: number };
}

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
export default async function HomePage() {
  const [settings, sectionResponse, quizzes] = await Promise.all([
    api<PublicSettingsResponse>("/settings"),
    api<SectionsResponse>("/sections"),
    api<KuisListItem[]>("/quizzes").catch(() => [] as KuisListItem[]),
  ]);

  return (
    <div className="space-y-8">
      <HeroSection
        title={settings.hero_title || "Biostat Hub"}
        description={
          settings.hero_description ||
          "Belajar biostatistika jadi lebih mudah, sistematis, dan aplikatif."
        }
        totalSections={sectionResponse.stats.total_sections}
        totalVideos={sectionResponse.stats.total_videos}
      />
      {sectionResponse.sections.length === 0 ? (
        <div id="jelajahi-materi">
          <EmptyState message="Belum ada materi. Materi akan segera ditambahkan." />
        </div>
      ) : (
        <section id="jelajahi-materi" className="space-y-4">
          <header>
            <h2 className="text-2xl font-bold text-brand-navy">Jelajahi Materi</h2>
            <p className="mt-1 text-sm text-gray-600">
              Pilih topik untuk mulai belajar sesuai kebutuhanmu.
            </p>
          </header>
          <SectionGrid sections={sectionResponse.sections} />
        </section>
      )}
      <HomeKuisSection quizzes={quizzes} />
    </div>
  );
}

/* ==========================================================================
 * DESIGN 2
 * ==========================================================================
export default async function HomePage() {
  const [settings, sectionResponse, quizzes] = await Promise.all([
    api<PublicSettingsResponse>("/settings"),
    api<SectionsResponse>("/sections"),
    api<KuisListItem[]>("/quizzes").catch(() => [] as KuisListItem[]),
  ]);

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 w-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-4 pt-2">
        <HeroSection
          title={settings.hero_title || "Biostat Hub"}
          description={
            settings.hero_description ||
            "Belajar biostatistika jadi lebih mudah, sistematis, dan aplikatif."
          }
          totalSections={sectionResponse.stats.total_sections}
          totalVideos={sectionResponse.stats.total_videos}
        />
        {sectionResponse.sections.length === 0 ? (
          <div id="jelajahi-materi">
            <EmptyState message="Belum ada materi. Materi akan segera ditambahkan." />
          </div>
        ) : (
          <section id="jelajahi-materi" className="space-y-6 pb-8">
            <header>
              <h2 className="text-2xl font-bold text-gray-900">Jelajahi Materi</h2>
              <p className="mt-1 text-sm text-gray-500">
                Pilih topik untuk mulai belajar sesuai kebutuhanmu.
              </p>
            </header>
            <SectionGrid sections={sectionResponse.sections} />
          </section>
        )}
        <HomeKuisSection quizzes={quizzes} />
      </div>
    </div>
  );
}
*/

/* ==========================================================================
 * DESIGN 3
 * ==========================================================================
import { Design3PageShell } from "@/components/layout/Design3PageShell";

export default async function HomePage() {
  const [settings, sectionResponse, quizzes] = await Promise.all([
    api<PublicSettingsResponse>("/settings"),
    api<SectionsResponse>("/sections"),
    api<KuisListItem[]>("/quizzes").catch(() => [] as KuisListItem[]),
  ]);

  return (
    <Design3PageShell className="pb-4 pt-2">
      <HeroSection
        title={settings.hero_title || "Biostat Hub"}
        description={
          settings.hero_description ||
          "Belajar biostatistika jadi lebih mudah, sistematis, dan aplikatif."
        }
        totalSections={sectionResponse.stats.total_sections}
        totalVideos={sectionResponse.stats.total_videos}
      />
      {sectionResponse.sections.length === 0 ? (
        <div id="jelajahi-materi">
          <EmptyState message="Belum ada materi. Materi akan segera ditambahkan." />
        </div>
      ) : (
        <section id="jelajahi-materi" className="space-y-5 pb-8">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-d3-coral">Materi</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-d3-ink">Jelajahi Materi</h2>
            <p className="mt-1 text-sm text-d3-muted">
              Pilih topik untuk mulai belajar sesuai kebutuhanmu.
            </p>
          </header>
          <SectionGrid sections={sectionResponse.sections} />
        </section>
      )}
      <HomeKuisSection quizzes={quizzes} />
    </Design3PageShell>
  );
}
*/
