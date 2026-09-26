import { BookOpen, Presentation } from "lucide-react";
import Link from "next/link";

import type { MaterialResource, MaterialSection, MaterialVideo } from "@/components/material/types";
import { truncateRichText } from "@/lib/rich-text";

function MaterialCard({ video, sectionName }: { video: MaterialVideo; sectionName: string }) {
  return (
    <Link
      href={`/video/${video.id}`}
      className="group flex h-full flex-col rounded-xl border border-brand-warm/25 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-warm hover:shadow-sm"
    >
      <span className="w-fit rounded-full bg-brand-peach px-3 py-1 text-xs font-semibold text-brand-warm">
        {sectionName}
      </span>
      <h2 className="mt-4 text-lg font-semibold text-brand-navy group-hover:text-brand-warm">
        {video.title}
      </h2>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
        {truncateRichText(video.description, 140, "Buka materi untuk melihat video pembelajaran.")}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-warm">
        <BookOpen className="h-4 w-4" /> Pelajari
      </span>
    </Link>
  );
}

function ResourceCard({ resource, sectionName }: { resource: MaterialResource; sectionName: string }) {
  return (
    <Link
      href={`/presentation/${resource.id}`}
      className="group flex h-full flex-col rounded-xl border border-brand-warm/25 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-warm hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="w-fit rounded-full bg-brand-peach px-3 py-1 text-xs font-semibold text-brand-warm">
          {sectionName}
        </span>
        <span className="rounded-full bg-brand-teal-soft px-3 py-1 text-xs font-semibold text-brand-teal">PPT/PDF</span>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-brand-navy group-hover:text-brand-warm">
        {resource.title}
      </h2>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
        {resource.description || "Unduh file presentasi untuk mempelajari materi ini."}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-warm">
        <Presentation className="h-4 w-4" /> Baca materi
      </span>
    </Link>
  );
}

function sectionItems(section: MaterialSection) {
  return [
    ...(section.videos ?? []).map((video) => ({ type: "video" as const, item: video })),
    ...(section.resources ?? []).map((resource) => ({ type: "resource" as const, item: resource })),
  ];
}

export function MaterialCatalog({
  sections,
  mode,
}: {
  sections: MaterialSection[];
  mode: "flat" | "grouped";
}) {
  if (mode === "grouped") {
    return (
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 id={`section-${section.id}`} className="text-xl font-bold text-brand-navy">
                {section.name}
              </h2>
              <span className="text-sm text-gray-500">{sectionItems(section).length} konten</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sectionItems(section).map(({ type, item }) =>
                type === "video" ? (
                  <MaterialCard key={`video-${item.id}`} video={item} sectionName={section.name} />
                ) : (
                  <ResourceCard key={`resource-${item.id}`} resource={item} sectionName={section.name} />
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sections.flatMap((section) =>
        sectionItems(section).map(({ type, item }) =>
          type === "video" ? (
            <MaterialCard key={`video-${item.id}`} video={item} sectionName={section.name} />
          ) : (
            <ResourceCard key={`resource-${item.id}`} resource={item} sectionName={section.name} />
          ),
        ),
      )}
    </div>
  );
}
