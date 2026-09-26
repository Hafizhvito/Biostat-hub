import type { Metadata } from "next";

import { MaterialCatalog } from "@/components/material/MaterialCatalog";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { getSectionsWithVideos } from "@/lib/materials";

export const metadata: Metadata = {
  title: "Materi",
  description: "Jelajahi seluruh materi dan video pembelajaran statistik di Riset Hub.",
  alternates: { canonical: "/materi" },
};

export const revalidate = 30;

const MATERIAL_FETCH_OPTIONS = {
  cache: "force-cache" as RequestCache,
  next: { revalidate: 30 },
};

interface SettingsResponse {
  material_display_mode?: "flat" | "grouped";
}

export default async function MateriPage() {
  const [response, settings] = await Promise.all([
    getSectionsWithVideos(MATERIAL_FETCH_OPTIONS),
    api<SettingsResponse>("/settings", MATERIAL_FETCH_OPTIONS),
  ]);

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-warm">Materi</p>
        <h1 className="mt-1 text-3xl font-bold text-brand-navy">Jelajahi Materi</h1>
        <p className="mt-2 max-w-3xl text-gray-600">
          Semua judul materi langsung tersedia. Pilih video untuk belajar atau unduh PPT dan PDF yang disediakan.
        </p>
      </header>

      {response.stats.total_videos + (response.stats.total_resources ?? 0) === 0 ? (
        <EmptyState message="Belum ada materi yang tersedia." />
      ) : (
        <MaterialCatalog
          sections={response.sections}
          mode={settings.material_display_mode === "grouped" ? "grouped" : "flat"}
        />
      )}
    </div>
  );
}
