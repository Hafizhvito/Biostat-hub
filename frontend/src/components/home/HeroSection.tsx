/** Blok hero beranda: judul, deskripsi, statistik jumlah materi/video. */

import { ArrowRight, Play } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface HeroSectionProps {
  title: string;
  description: string;
  totalSections: number;
  totalVideos: number;
  totalGlossary: number;
  totalDownloads: number;
}

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
export function HeroSection({
  title,
  description,
  totalSections,
  totalVideos,
  totalGlossary,
  totalDownloads,
}: HeroSectionProps) {
  return (
    <section className="mb-8 overflow-hidden rounded-2xl bg-brand-powder shadow-sm">
      <div className="px-6 py-10 md:px-8 md:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-lemon">
          Riset Terstruktur
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-warm md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-700 md:text-base">{description}</p>
        <SearchBar />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white/75 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-lemon">Total Materi</p>
            <p className="mt-1 text-3xl font-bold text-brand-warm">{totalSections}</p>
          </div>
          <div className="rounded-xl bg-white/75 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-lemon">Total Video</p>
            <p className="mt-1 text-3xl font-bold text-brand-warm">{totalVideos}</p>
          </div>
          <div className="rounded-xl bg-white/75 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-lemon">Istilah Glosarium</p>
            <p className="mt-1 text-3xl font-bold text-brand-warm">{totalGlossary}</p>
          </div>
          <div className="rounded-xl bg-white/75 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-lemon">File Unduhan</p>
            <p className="mt-1 text-3xl font-bold text-brand-warm">{totalDownloads}</p>
          </div>
        </div>
      </div>
      <div className="bg-brand-peach px-6 py-3 md:px-8">
        <p className="text-center text-sm font-medium text-brand-warm">
          Materi disusun ringkas, terstruktur, dan mudah dipahami.
        </p>
      </div>
    </section>
  );
}

/* ==========================================================================
 * DESIGN 2 — hero tengah, CTA scroll ke daftar materi
 * ==========================================================================
export function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <section className="py-12 text-center md:py-16">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-gray-500 md:text-lg">{description}</p>
      <a
        href="#jelajahi-materi"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-d2-blue px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-d2-blue-dark"
      >
        <Play className="h-4 w-4 fill-white" />
        Lihat Materi
      </a>
    </section>
  );
}
*/

/* ==========================================================================
 * DESIGN 3 — split asymetris: panel plum + statistik coral
 * ==========================================================================
export function HeroSection({
  title,
  description,
  totalSections,
  totalVideos,
}: HeroSectionProps) {
  return (
    <section className="mb-6 grid gap-0 overflow-hidden rounded-2xl md:grid-cols-2">
      <div className="bg-d3-plum-dark px-6 py-10 text-white md:px-8 md:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-d3-coral-soft">
          Riset Terstruktur
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-d3-sand/90 md:text-base">{description}</p>
        <a
          href="#jelajahi-materi"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-d3-coral px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-d3-coral/90"
        >
          Jelajahi Materi
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <div className="flex flex-col justify-center gap-4 bg-d3-coral-soft px-6 py-10 md:px-8 md:py-12">
        <div className="rounded-xl bg-white/60 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-d3-plum">Total Materi</p>
          <p className="mt-1 font-serif text-3xl font-semibold text-d3-ink">{totalSections}</p>
        </div>
        <div className="rounded-xl bg-white/60 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-d3-plum">Total Video</p>
          <p className="mt-1 font-serif text-3xl font-semibold text-d3-ink">{totalVideos}</p>
        </div>
      </div>
    </section>
  );
}
*/
