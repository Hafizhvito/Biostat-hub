/** Grid kartu materi di beranda — klik menuju /section/[id]. */

import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface SectionItem {
  id: number;
  name: string;
  description: string | null;
  _count?: {
    videos: number;
  };
  videos?: Array<{ id: number }>;
}

interface SectionGridProps {
  sections: SectionItem[];
}

const DOT_COLORS_D2 = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-400",
  "bg-violet-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-sky-500",
  "bg-orange-500",
  "bg-indigo-500",
] as const;

function getVideoCount(section: SectionItem) {
  if (typeof section._count?.videos === "number") return section._count.videos;
  if (Array.isArray(section.videos)) return section.videos.length;
  return 0;
}

/* ==========================================================================
 * DESIGN 1 (aktif) — grid 3 kolom teal
 * ========================================================================== */
export function SectionGrid({ sections }: SectionGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sections.map((section) => (
        <Link key={section.id} href={`/section/${section.id}`} className="group">
          <Card className="h-full border-brand-teal/20 bg-brand-teal-soft/40 p-5 transition-colors group-hover:border-brand-teal">
            <h2 className="text-lg font-semibold text-brand-navy group-hover:text-brand-teal">
              {section.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {section.description || "Deskripsi materi belum tersedia."}
            </p>
            <p className="mt-4 text-sm font-medium text-brand-teal">{getVideoCount(section)} video</p>
          </Card>
        </Link>
      ))}
    </section>
  );
}

/* ==========================================================================
 * DESIGN 2 — grid 3 kolom, dot warna
 * ==========================================================================
export function SectionGrid({ sections }: SectionGridProps) {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section, index) => (
        <Link
          key={section.id}
          href={`/section/${section.id}`}
          className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <span
            className={`h-3 w-3 rounded-full ${DOT_COLORS_D2[index % DOT_COLORS_D2.length]}`}
            aria-hidden
          />
          <h2 className="mt-4 text-base font-bold text-gray-900 group-hover:text-d2-blue">
            {section.name}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
            {section.description || "Deskripsi materi belum tersedia."}
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-gray-400">
            <Play className="h-3.5 w-3.5" />
            {getVideoCount(section)} video
          </p>
        </Link>
      ))}
    </section>
  );
}
*/

/* ==========================================================================
 * DESIGN 3 — daftar editorial satu kolom
 * ==========================================================================
export function SectionGrid({ sections }: SectionGridProps) {
  return (
    <section className="divide-y divide-d3-coral/20 rounded-2xl border border-d3-coral/20 bg-d3-surface">
      {sections.map((section) => (
        <Link
          key={section.id}
          href={`/section/${section.id}`}
          className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-d3-sand/60"
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-d3-coral">
              {getVideoCount(section)} video
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-d3-ink group-hover:text-d3-plum">
              {section.name}
            </h2>
            <p className="mt-1 text-sm text-d3-muted">
              {section.description || "Deskripsi materi belum tersedia."}
            </p>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-d3-coral transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ))}
    </section>
  );
}
*/
