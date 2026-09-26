import type { Metadata } from "next";
import Link from "next/link";

import { PdfReader } from "@/components/presentation/PdfReader";
import { api, apiUrl } from "@/lib/api";

interface MaterialResourceDetail {
  id: number;
  title: string;
  description: string | null;
  originalName: string;
  fileSize: number;
  section: {
    id: number;
    name: string;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const resource = await api<MaterialResourceDetail>(`/material-resources/${id}`);
    return {
      title: resource.title,
      description: resource.description || `Materi presentasi ${resource.title} di Riset Hub.`,
      robots: { index: false, follow: true },
    };
  } catch {
    return { title: "Materi Presentasi", robots: { index: false, follow: false } };
  }
}

export default async function PresentationPage({ params }: PageProps) {
  const { id } = await params;
  const resource = await api<MaterialResourceDetail>(`/material-resources/${id}`);

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-600">
        <Link href="/materi" className="hover:text-brand-teal">Materi</Link>
        <span className="mx-2">›</span>
        <Link href={`/section/${resource.section.id}`} className="hover:text-brand-teal">{resource.section.name}</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-brand-navy">{resource.title}</span>
      </nav>

      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Materi Presentasi</p>
        <h1 className="text-3xl font-bold text-brand-navy">{resource.title}</h1>
        {resource.description ? <p className="max-w-3xl leading-relaxed text-gray-600">{resource.description}</p> : null}
      </header>

      <PdfReader url={apiUrl(`/material-resources/${resource.id}/preview`)} title={resource.title} />

      <p className="text-sm text-gray-500">
        Materi ditampilkan untuk dibaca di dalam website. Tampilan viewer dapat berbeda mengikuti perangkat dan browser.
      </p>
    </div>
  );
}
