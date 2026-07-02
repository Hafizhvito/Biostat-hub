/** Grid kartu video + thumbnail YouTube. */

import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { truncateRichText } from "@/lib/rich-text";
import { extractYouTubeId } from "@/lib/youtube";

interface VideoItem {
  id: number;
  title: string;
  description: string | null;
  youtube_url?: string | null;
  youtubeUrl?: string | null;
  youtube_id?: string | null;
}

interface VideoGridProps {
  videos: VideoItem[];
}

function truncateDescription(html: string | null, fallback: string) {
  return truncateRichText(html, 140, fallback);
}

/* ==========================================================================
 * DESIGN 1 (aktif) — grid 3 kolom teal
 * ========================================================================== */
export function VideoCard({ video }: { video: VideoItem }) {
  const sourceUrl = video.youtube_url ?? video.youtubeUrl ?? "";
  const videoId = video.youtube_id ?? extractYouTubeId(sourceUrl);

  return (
    <Link href={`/video/${video.id}`} className="group">
      <Card className="h-full overflow-hidden border-brand-warm/25 p-0 group-hover:border-brand-warm">
        {videoId ? (
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={`Thumbnail ${video.title}`}
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
            Thumbnail tidak tersedia
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-brand-navy">{video.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            {truncateDescription(video.description, "Deskripsi video belum tersedia.")}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export function VideoGrid({ videos }: VideoGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </section>
  );
}

/* ==========================================================================
 * DESIGN 2 — kartu video grid vertikal
 * ==========================================================================
export function VideoCard({ video }: { video: VideoItem }) {
  const sourceUrl = video.youtube_url ?? video.youtubeUrl ?? "";
  const videoId = video.youtube_id ?? extractYouTubeId(sourceUrl);

  return (
    <Link
      href={`/video/${video.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative">
        {videoId ? (
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={`Thumbnail ${video.title}`}
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
            Thumbnail tidak tersedia
          </div>
        )}
        <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-d2-blue/90 text-white shadow-sm">
          <Play className="h-4 w-4 fill-white" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-gray-900 group-hover:text-d2-blue">{video.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
          {truncateDescription(video.description, "Deskripsi video belum tersedia.")}
        </p>
      </div>
    </Link>
  );
}

export function VideoGrid({ videos }: VideoGridProps) {
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </section>
  );
}
*/

/* ==========================================================================
 * DESIGN 3 — kartu horizontal
 * ==========================================================================
export function VideoCard({ video }: { video: VideoItem }) {
  const sourceUrl = video.youtube_url ?? video.youtubeUrl ?? "";
  const videoId = video.youtube_id ?? extractYouTubeId(sourceUrl);

  return (
    <Link
      href={`/video/${video.id}`}
      className="group flex gap-4 rounded-2xl border border-d3-coral/20 bg-d3-surface p-4 transition-colors hover:bg-d3-sand/50"
    >
      {videoId ? (
        <img
          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt={`Thumbnail ${video.title}`}
          className="h-24 w-40 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-lg bg-d3-sand text-xs text-d3-muted">
          Thumbnail tidak tersedia
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg font-semibold text-d3-ink group-hover:text-d3-plum">
          {video.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-d3-muted">
          {truncateDescription(video.description, "Deskripsi video belum tersedia.")}
        </p>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 self-center text-d3-coral" />
    </Link>
  );
}

export function VideoGrid({ videos }: VideoGridProps) {
  return (
    <section className="space-y-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </section>
  );
}
*/
