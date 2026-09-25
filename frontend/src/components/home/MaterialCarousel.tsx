"use client";

import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { MaterialSection } from "@/components/material/types";
import { truncateRichText } from "@/lib/rich-text";

export function MaterialCarousel({ sections }: { sections: MaterialSection[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canGoLeft, setCanGoLeft] = useState(false);
  const [canGoRight, setCanGoRight] = useState(false);

  const items = sections.flatMap((section) =>
    (section.videos ?? []).map((video) => ({ ...video, sectionName: section.name })),
  );

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanGoLeft(track.scrollLeft > 4);
    setCanGoRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateControls();
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    track.addEventListener("scroll", updateControls, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updateControls);
    };
  }, [updateControls]);

  function move(direction: -1 | 1) {
    trackRef.current?.scrollBy({
      left: direction * Math.max(280, trackRef.current.clientWidth * 0.75),
      behavior: "smooth",
    });
  }

  return (
    <section id="jelajahi-materi" className="space-y-4 scroll-mt-6" aria-labelledby="materi-home-title">
      <div className="flex items-end justify-between gap-4">
        <header>
          <h2 id="materi-home-title" className="text-2xl font-bold text-brand-navy">Jelajahi Materi</h2>
          <p className="mt-1 text-sm text-gray-600">
            Geser untuk melihat materi lainnya atau buka daftar lengkap.
          </p>
        </header>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canGoLeft}
            aria-label="Lihat materi sebelumnya"
            className="rounded-full border border-brand-powder bg-white p-2 text-brand-navy transition hover:border-brand-warm hover:text-brand-warm disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!canGoRight}
            aria-label="Lihat materi berikutnya"
            className="rounded-full border border-brand-powder bg-white p-2 text-brand-navy transition hover:border-brand-warm hover:text-brand-warm disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin] [scrollbar-color:#bfd8d2_transparent]"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/video/${item.id}`}
            className="group flex w-[82vw] max-w-sm shrink-0 snap-start flex-col rounded-xl border border-brand-warm/25 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-warm hover:shadow-sm sm:w-80"
          >
            <span className="w-fit rounded-full bg-brand-peach px-3 py-1 text-xs font-semibold text-brand-warm">
              {item.sectionName}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-brand-navy group-hover:text-brand-warm">
              {item.title}
            </h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-600">
              {truncateRichText(item.description, 110, "Buka materi untuk mulai belajar.")}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-warm">
              <PlayCircle className="h-4 w-4" /> Buka materi
            </span>
          </Link>
        ))}
      </div>

      <Link href="/materi" className="inline-flex text-sm font-semibold text-brand-warm hover:underline">
        Lihat semua materi →
      </Link>
    </section>
  );
}
