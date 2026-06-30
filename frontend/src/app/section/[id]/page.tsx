/** Halaman daftar video dalam satu materi. */

import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { VideoGrid } from "@/components/section/VideoGrid";
import { api } from "@/lib/api";

interface SectionVideo {
  id: number;
  title: string;
  description: string | null;
  youtubeUrl: string;
  has_quiz?: boolean;
}

interface SectionDetail {
  id: number;
  name: string;
  description: string | null;
  videos: SectionVideo[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SectionPage({ params }: PageProps) {
  const { id } = await params;
  const section = await api<SectionDetail>(`/sections/${id}`);

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-brand-teal">
          Beranda
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-brand-navy">{section.name}</span>
      </nav>

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal">
          Detail Materi
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy">{section.name}</h1>
        {section.description ? (
          <p className="max-w-3xl text-sm leading-relaxed text-gray-700 md:text-base">
            {section.description}
          </p>
        ) : null}
      </header>

      {section.videos.length === 0 ? (
        <EmptyState message="Belum ada video di materi ini." />
      ) : (
        <VideoGrid videos={section.videos} />
      )}
    </div>
  );
}
