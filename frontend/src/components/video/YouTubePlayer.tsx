/** Embed iframe YouTube responsif 16:9. */

import { toYouTubeWatchUrl } from "@/lib/youtube";

interface YouTubePlayerProps {
  youtubeId: string;
  title: string;
}

export function YouTubePlayer({ youtubeId, title }: YouTubePlayerProps) {
  const embedSrc = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl bg-black shadow-sm">
        <div className="relative w-full pb-[56.25%]">
          <iframe
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
            loading="lazy"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Video tidak muncul?{" "}
        <a
          href={toYouTubeWatchUrl(youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-teal underline"
        >
          Buka langsung di YouTube
        </a>
      </p>
    </div>
  );
}
