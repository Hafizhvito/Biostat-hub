/** Grid kartu materi di beranda — klik menuju /section/[id]. */

import Link from "next/link";
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

function getVideoCount(section: SectionItem) {
  if (typeof section._count?.videos === "number") return section._count.videos;
  if (Array.isArray(section.videos)) return section.videos.length;
  return 0;
}

export function SectionGrid({ sections }: SectionGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <Link key={section.id} href={`/section/${section.id}`} className="group">
          <Card className="h-full border-brand-teal/30 bg-white group-hover:border-brand-teal">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
              {getVideoCount(section)} Video
            </p>
            <h2 className="mt-2 text-lg font-semibold text-brand-navy">{section.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {section.description || "Deskripsi materi belum tersedia."}
            </p>
          </Card>
        </Link>
      ))}
    </section>
  );
}
