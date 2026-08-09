"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";

interface SectionItem {
  id: number;
  name: string;
  description: string | null;
  level: "dasar" | "menengah" | "lanjut" | null;
  _count?: { videos: number };
}

export default function MateriPage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [activeLevel, setActiveLevel] = useState<"all" | "dasar" | "menengah" | "lanjut">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ sections: SectionItem[]; stats: { total_sections: number; total_videos: number } }>("/sections")
      .then((data) => setSections(data.sections ?? []))
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeLevel === "all") return sections;
    return sections.filter((section) => section.level === activeLevel);
  }, [activeLevel, sections]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-lemon">Materi</p>
        <h1 className="text-3xl font-bold text-brand-navy">Filter Level Materi</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
          Pilih level untuk menyaring materi sesuai kebutuhan belajar.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {[
          ["all", "Semua"],
          ["dasar", "Dasar"],
          ["menengah", "Menengah"],
          ["lanjut", "Lanjut"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveLevel(value as typeof activeLevel)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeLevel === value ? "bg-brand-warm text-white" : "bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-brand-peach"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat materi...</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
          Tidak ada materi untuk level ini.
        </p>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((section) => (
            <Link key={section.id} href={`/section/${section.id}`} className="group rounded-2xl border border-brand-peach bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-brand-navy group-hover:text-brand-warm">{section.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{section.description || "Deskripsi materi belum tersedia."}</p>
                </div>
                {section.level ? (
                  <span className="rounded-full bg-brand-peach px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-warm">
                    {section.level}
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm font-medium text-brand-warm">{section._count?.videos ?? 0} video</p>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
