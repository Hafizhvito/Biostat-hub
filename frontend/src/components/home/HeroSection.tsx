/** Blok hero beranda: judul, deskripsi, statistik jumlah materi/video. */

interface HeroSectionProps {
  title: string;
  description: string;
  totalSections: number;
  totalVideos: number;
}

export function HeroSection({
  title,
  description,
  totalSections,
  totalVideos,
}: HeroSectionProps) {
  return (
    <section className="mb-8 rounded-2xl bg-brand-navy px-6 py-10 text-white md:px-8 md:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-mint">
        Biostatistika Terstruktur
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-100 md:text-base">{description}</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white/10 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-mint">
            Total Materi
          </p>
          <p className="mt-1 text-3xl font-bold">{totalSections}</p>
        </div>
        <div className="rounded-xl bg-white/10 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-mint">
            Total Video
          </p>
          <p className="mt-1 text-3xl font-bold">{totalVideos}</p>
        </div>
      </div>
    </section>
  );
}
