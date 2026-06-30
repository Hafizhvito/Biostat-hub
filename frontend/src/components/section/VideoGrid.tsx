/** Grid kartu video + thumbnail YouTube. */

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { extractYouTubeId } from "@/lib/youtube";

interface VideoItem {
  id: number;
  title: string;
  description: string | null;
  youtube_url?: string | null;
  youtubeUrl?: string | null;
  youtube_id?: string | null;
  has_quiz?: boolean;
  quiz?: { id: number } | null;
}

interface VideoGridProps {
  videos: VideoItem[];
}

function truncate(text: string, maxLength = 140) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function VideoCard({ video }: { video: VideoItem }) {
  const sourceUrl = video.youtube_url ?? video.youtubeUrl ?? "";
  const videoId = video.youtube_id ?? extractYouTubeId(sourceUrl);
  const hasQuiz = Boolean(video.has_quiz ?? video.quiz);

  return (
    <Link href={`/video/${video.id}`} className="group">
      <Card className="h-full overflow-hidden border-brand-teal/20 p-0 group-hover:border-brand-teal">
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
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-brand-navy">{video.title}</h3>
            {hasQuiz ? (
              <span className="rounded-full bg-brand-teal-soft px-2 py-1 text-xs font-semibold text-brand-teal">
                Ada Kuis
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            {truncate(video.description || "Deskripsi video belum tersedia.")}
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
