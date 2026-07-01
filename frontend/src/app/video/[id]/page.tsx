/** Halaman putar video YouTube. Ganti design: comment/uncomment export default. */

import Link from "next/link";
import { RichTextContent } from "@/components/editor/RichTextContent";
import { YouTubePlayer } from "@/components/video/YouTubePlayer";
import { api } from "@/lib/api";
import { extractYouTubeId } from "@/lib/youtube";

interface VideoDetail {
  id: number;
  title: string;
  description: string | null;
  youtubeUrl?: string;
  youtube_url?: string;
  youtube_id?: string | null;
  section: {
    id: number;
    name: string;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  const video = await api<VideoDetail>(`/videos/${id}`);
  const youtubeId =
    video.youtube_id ?? extractYouTubeId(video.youtube_url ?? video.youtubeUrl ?? "");

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-brand-teal">
          Beranda
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/section/${video.section.id}`} className="hover:text-brand-teal">
          {video.section.name}
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-brand-navy">{video.title}</span>
      </nav>
      {youtubeId ? (
        <YouTubePlayer youtubeId={youtubeId} title={video.title} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          Video tidak dapat diputar karena URL YouTube tidak valid.
        </div>
      )}
      <div className="space-y-4 rounded-xl border border-brand-teal/20 bg-white px-6 py-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Materi Video</p>
        <h1 className="text-3xl font-bold text-brand-navy">{video.title}</h1>
        <p className="text-sm text-gray-600">
          Materi:{" "}
          <Link
            href={`/section/${video.section.id}`}
            className="font-medium text-brand-teal hover:underline"
          >
            {video.section.name}
          </Link>
        </p>
        <RichTextContent
          html={video.description}
          className="max-w-3xl text-gray-700 md:text-base rich-text-content--teal"
          fallback={<p className="max-w-3xl text-sm leading-relaxed text-gray-700 md:text-base">Deskripsi video belum tersedia.</p>}
        />
      </div>
    </div>
  );
}

/* ==========================================================================
 * DESIGN 2
 * ==========================================================================
export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  const video = await api<VideoDetail>(`/videos/${id}`);
  const youtubeId =
    video.youtube_id ?? extractYouTubeId(video.youtube_url ?? video.youtubeUrl ?? "");

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 w-screen bg-white">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="transition-colors hover:text-d2-blue">
            Beranda
          </Link>
          <span className="mx-2 text-gray-300">›</span>
          <Link
            href={`/section/${video.section.id}`}
            className="transition-colors hover:text-d2-blue"
          >
            {video.section.name}
          </Link>
          <span className="mx-2 text-gray-300">›</span>
          <span className="font-medium text-gray-900">{video.title}</span>
        </nav>
        {youtubeId ? (
          <YouTubePlayer youtubeId={youtubeId} title={video.title} />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            Video tidak dapat diputar karena URL YouTube tidak valid.
          </div>
        )}
        <div className="space-y-4 rounded-xl border border-gray-100 bg-white px-6 py-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-d2-blue">Materi Video</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{video.title}</h1>
          <p className="text-sm text-gray-500">
            Materi:{" "}
            <Link
              href={`/section/${video.section.id}`}
              className="font-medium text-d2-blue hover:underline"
            >
              {video.section.name}
            </Link>
          </p>
          <RichTextContent
            html={video.description}
            className="max-w-3xl text-gray-500 md:text-base rich-text-content--blue"
            fallback={<p className="max-w-3xl text-sm leading-relaxed text-gray-500 md:text-base">Deskripsi video belum tersedia.</p>}
          />
        </div>
      </div>
    </div>
  );
}
*/

/* ==========================================================================
 * DESIGN 3
 * ==========================================================================
import { Design3PageShell } from "@/components/layout/Design3PageShell";

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  const video = await api<VideoDetail>(`/videos/${id}`);
  const youtubeId =
    video.youtube_id ?? extractYouTubeId(video.youtube_url ?? video.youtubeUrl ?? "");

  return (
    <Design3PageShell>
      <nav className="text-sm text-d3-muted">
        <Link href="/" className="hover:text-d3-coral">
          Beranda
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/section/${video.section.id}`} className="hover:text-d3-coral">
          {video.section.name}
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-d3-ink">{video.title}</span>
      </nav>
      <div className="mt-6">
        {youtubeId ? (
          <YouTubePlayer youtubeId={youtubeId} title={video.title} />
        ) : (
          <div className="rounded-xl border border-d3-coral/20 bg-d3-surface p-6 text-sm text-d3-muted">
            Video tidak dapat diputar karena URL YouTube tidak valid.
          </div>
        )}
      </div>
      <div className="mt-6 space-y-4 rounded-2xl border border-d3-coral/20 bg-d3-surface px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-d3-coral">Materi Video</p>
        <h1 className="font-serif text-3xl font-semibold text-d3-ink">{video.title}</h1>
        <p className="text-sm text-d3-muted">
          Materi:{" "}
          <Link
            href={`/section/${video.section.id}`}
            className="font-medium text-d3-coral hover:underline"
          >
            {video.section.name}
          </Link>
        </p>
        <RichTextContent
          html={video.description}
          className="max-w-3xl text-d3-muted md:text-base rich-text-content--coral"
          fallback={<p className="max-w-3xl text-sm leading-relaxed text-d3-muted md:text-base">Deskripsi video belum tersedia.</p>}
        />
      </div>
    </Design3PageShell>
  );
}
*/
