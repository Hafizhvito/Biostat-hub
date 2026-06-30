"use client";

/**
 * Gambar soal kuis: preview + klik buka lightbox dengan zoom in/out.
 * Mencoba beberapa format URL Google Drive; fallback link tab baru.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { getDisplayImageCandidates } from "@/lib/image";

interface QuizQuestionImageProps {
  url: string;
  alt: string;
  className?: string;
}

const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

export function QuizQuestionImage({
  url,
  alt,
  className = "mx-auto max-h-80 w-full object-contain",
}: QuizQuestionImageProps) {
  const candidates = useMemo(() => getDisplayImageCandidates(url), [url]);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const activeSrc = candidates[index];

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, closeLightbox]);

  function zoomIn() {
    setZoom((prev) => Math.min(ZOOM_MAX, +(prev + ZOOM_STEP).toFixed(2)));
  }

  function zoomOut() {
    setZoom((prev) => Math.max(ZOOM_MIN, +(prev - ZOOM_STEP).toFixed(2)));
  }

  if (failed || index >= candidates.length) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-medium">Gambar tidak bisa ditampilkan di halaman ini.</p>
        <p className="mt-1 text-amber-900/80">
          Link Google Drive kadang tidak bisa di-embed meski sudah dibagikan. Buka gambar lewat tombol di bawah.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-medium text-brand-teal underline"
        >
          Buka gambar di tab baru
        </a>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative w-full cursor-zoom-in rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
        aria-label={`Perbesar ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeSrc}
          alt={alt}
          className={`${className} transition-opacity group-hover:opacity-95`}
          referrerPolicy="no-referrer"
          onError={() => {
            if (index + 1 < candidates.length) {
              setIndex((prev) => prev + 1);
            } else {
              setFailed(true);
            }
          }}
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-brand-navy/80 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          Klik untuk perbesar
        </span>
      </button>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3 text-white">
            <p className="truncate text-sm font-medium">{alt}</p>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoom <= ZOOM_MIN}
                className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-40"
                aria-label="Perkecil"
                title="Perkecil"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="min-w-12 text-center text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoom >= ZOOM_MAX}
                className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-40"
                aria-label="Perbesar"
                title="Perbesar"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="rounded-lg p-2 hover:bg-white/10"
                aria-label="Atur ulang zoom"
                title="Atur ulang"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="ml-1 rounded-lg p-2 hover:bg-white/10"
                aria-label="Tutup"
                title="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            className="flex flex-1 items-center justify-center overflow-auto p-4"
            onClick={closeLightbox}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSrc}
              alt={alt}
              className="max-h-none max-w-none origin-center transition-transform duration-150"
              style={{
                transform: `scale(${zoom})`,
                maxHeight: zoom === 1 ? "calc(100vh - 8rem)" : undefined,
                maxWidth: zoom === 1 ? "100%" : undefined,
              }}
              referrerPolicy="no-referrer"
              onClick={(event) => event.stopPropagation()}
            />
          </div>

          <p className="border-t border-white/10 px-4 py-2 text-center text-xs text-white/70">
            Gunakan tombol + / − untuk zoom · Klik area gelap atau tekan Esc untuk tutup
          </p>
        </div>
      ) : null}
    </>
  );
}
