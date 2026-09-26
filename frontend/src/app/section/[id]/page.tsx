/** Halaman daftar video dalam satu materi. Ganti design: comment/uncomment export default. */

import Link from "next/link";
import { RichTextContent } from "@/components/editor/RichTextContent";
import { EmptyState } from "@/components/ui/EmptyState";
import { VideoGrid } from "@/components/section/VideoGrid";
import { api, apiUrl } from "@/lib/api";
import { stripHtml } from "@/lib/rich-text";
import { FileDown } from "lucide-react";
import type { Metadata } from "next";

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
  resources: Array<{
    id: number;
    title: string;
    description: string | null;
    originalName: string;
    fileSize: number;
  }>;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const section = await api<SectionDetail>(`/sections/${id}`);
    const description = stripHtml(section.description ?? "").slice(0, 160)
      || `Pelajari materi ${section.name} di Riset Hub.`;
    return {
      title: section.name,
      description,
      alternates: { canonical: `/section/${id}` },
      openGraph: { title: section.name, description, url: `/section/${id}` },
    };
  } catch {
    return { title: "Materi", robots: { index: false, follow: false } };
  }
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
        <Link href="/materi" className="hover:text-brand-teal">
          Materi
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
      {section.videos.length === 0 && (section.resources?.length ?? 0) === 0 ? (
        <EmptyState message="Belum ada konten di materi ini." />
      ) : null}
      {section.videos.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-navy">Video Pembelajaran</h2>
          <VideoGrid videos={section.videos} />
        </section>
      ) : null}
      {(section.resources?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brand-navy">PPT dan PDF Materi</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(section.resources ?? []).map((resource) => (
              <a
                key={resource.id}
                href={apiUrl(`/downloads/${resource.id}/file`)}
                className="group flex flex-col rounded-xl border border-brand-warm/25 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-warm hover:shadow-sm"
              >
                <span className="w-fit rounded-full bg-brand-teal-soft px-3 py-1 text-xs font-semibold text-brand-teal">PPT/PDF</span>
                <h3 className="mt-4 text-lg font-semibold text-brand-navy group-hover:text-brand-warm">{resource.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {resource.description || "Unduh file presentasi untuk mempelajari materi ini."}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-warm">
                  <FileDown className="h-4 w-4" /> Unduh materi
                </span>
              </a>
            ))}
          </div>
        </section>
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
    </Design3PageShell>
  );
}
*/
