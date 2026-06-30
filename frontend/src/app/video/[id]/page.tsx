/** Halaman putar video YouTube + tombol ke kuis (jika ada). */

import Link from "next/link";
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
  has_quiz: boolean;
  section: {
    id: number;
    name: string;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;
  const video = await api<VideoDetail>(`/videos/${id}`);
  const youtubeId =
    video.youtube_id ?? extractYouTubeId(video.youtube_url ?? video.youtubeUrl ?? "");

  return (
    <div className="space-y-6">
      {youtubeId ? (
        <YouTubePlayer youtubeId={youtubeId} title={video.title} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          Video tidak dapat diputar karena URL YouTube tidak valid.
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-teal">
          Materi Video
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy">{video.title}</h1>
        <p className="text-sm text-gray-700">
          Materi:{" "}
          <Link href={`/section/${video.section.id}`} className="font-medium text-brand-teal">
            {video.section.name}
          </Link>
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-700 md:text-base">
          {video.description || "Deskripsi video belum tersedia."}
        </p>

        {video.has_quiz ? (
          <Link
            href={`/quiz/${video.id}`}
            className="inline-flex rounded-lg bg-brand-mint px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-teal"
          >
            Kerjakan Kuis
          </Link>
        ) : null}
      </div>
    </div>
  );
}
