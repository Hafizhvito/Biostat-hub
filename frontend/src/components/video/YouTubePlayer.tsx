/** Embed iframe YouTube responsif 16:9. */

interface YouTubePlayerProps {
  youtubeId: string;
  title: string;
}

export function YouTubePlayer({ youtubeId, title }: YouTubePlayerProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-black shadow-sm">
      <div className="relative w-full pb-[56.25%]">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
