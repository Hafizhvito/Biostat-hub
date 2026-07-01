/** Halaman daftar video dalam satu materi + blok kuis. Ganti design: comment/uncomment export default. */

import Link from "next/link";
import { RichTextContent } from "@/components/editor/RichTextContent";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionQuizBlock } from "@/components/section/SectionQuizBlock";
import { VideoGrid } from "@/components/section/VideoGrid";
import { api } from "@/lib/api";

interface SectionVideo {
  id: number;
  title: string;
  description: string | null;
  youtubeUrl: string;
}

interface SectionDetail {
  id: number;
  name: string;
  description: string | null;
  videos: SectionVideo[];
  has_quiz: boolean;
  question_count: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
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
        <h1 className="text-3xl font-bold text-brand-navy">{section.name}</h1>
        <RichTextContent
          html={section.description}
          className="max-w-3xl text-gray-600 rich-text-content--teal"
        />
      </header>
      {section.videos.length === 0 ? (
        <EmptyState message="Belum ada video di materi ini." />
      ) : (
        <VideoGrid videos={section.videos} />
      )}
      {section.has_quiz ? (
        <SectionQuizBlock
          sectionId={section.id}
          sectionName={section.name}
          questionCount={section.question_count}
        />
      ) : null}
    </div>
  );
}

/* ==========================================================================
 * DESIGN 2
 * ==========================================================================
export default async function SectionPage({ params }: PageProps) {
  const { id } = await params;
  const section = await api<SectionDetail>(`/sections/${id}`);

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 w-screen bg-white">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="transition-colors hover:text-d2-blue">
            Beranda
          </Link>
          <span className="mx-2 text-gray-300">›</span>
          <span className="font-medium text-gray-900">{section.name}</span>
        </nav>
        <header className="space-y-2 border-b border-gray-100 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-d2-blue">Detail Materi</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{section.name}</h1>
          <RichTextContent
            html={section.description}
            className="max-w-3xl text-gray-500 md:text-base rich-text-content--blue"
          />
        </header>
        {section.videos.length === 0 ? (
          <EmptyState message="Belum ada video di materi ini." />
        ) : (
          <VideoGrid videos={section.videos} />
        )}
        {section.has_quiz ? (
          <SectionQuizBlock
            sectionId={section.id}
            sectionName={section.name}
            questionCount={section.question_count}
          />
        ) : null}
      </div>
    </div>
  );
}
*/

/* ==========================================================================
 * DESIGN 3
 * ==========================================================================
import { Design3PageShell } from "@/components/layout/Design3PageShell";

export default async function SectionPage({ params }: PageProps) {
  const { id } = await params;
  const section = await api<SectionDetail>(`/sections/${id}`);

  return (
    <Design3PageShell>
      <nav className="text-sm text-d3-muted">
        <Link href="/" className="hover:text-d3-coral">
          Beranda
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-d3-ink">{section.name}</span>
      </nav>
      <header className="mt-4 space-y-2 border-b border-d3-coral/20 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-d3-coral">Materi</p>
        <h1 className="font-serif text-3xl font-semibold text-d3-ink">{section.name}</h1>
        <RichTextContent
          html={section.description}
          className="max-w-3xl text-d3-muted rich-text-content--coral"
        />
      </header>
      <div className="mt-6">
        {section.videos.length === 0 ? (
          <EmptyState message="Belum ada video di materi ini." />
        ) : (
          <VideoGrid videos={section.videos} />
        )}
      </div>
      {section.has_quiz ? (
        <SectionQuizBlock
          sectionId={section.id}
          sectionName={section.name}
          questionCount={section.question_count}
        />
      ) : null}
    </Design3PageShell>
  );
}
*/
