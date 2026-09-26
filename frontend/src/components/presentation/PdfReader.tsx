"use client";

import { useEffect, useRef, useState } from "react";

interface PdfReaderProps {
  url: string;
  title: string;
}

export function PdfReader({ url, title }: PdfReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | null = null;
    let renderVersion = 0;

    async function initialize() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const pdf = await pdfjs.getDocument({ url }).promise;
        if (cancelled || !containerRef.current) return;

        async function renderPages() {
          const container = containerRef.current;
          if (!container) return;
          const currentVersion = ++renderVersion;
          container.replaceChildren();
          const availableWidth = Math.max(280, container.clientWidth - 32);

          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            if (cancelled || currentVersion !== renderVersion) return;
            const page = await pdf.getPage(pageNumber);
            const baseViewport = page.getViewport({ scale: 1 });
            const cssScale = Math.min(1.6, availableWidth / baseViewport.width);
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            const viewport = page.getViewport({ scale: cssScale * pixelRatio });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Canvas tidak tersedia.");
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.style.width = `${Math.floor(viewport.width / pixelRatio)}px`;
            canvas.style.height = `${Math.floor(viewport.height / pixelRatio)}px`;
            canvas.className = "mx-auto block max-w-full rounded-md bg-white shadow-sm";
            canvas.setAttribute("aria-label", `Halaman ${pageNumber} dari ${title}`);
            container.appendChild(canvas);
            await page.render({ canvas, canvasContext: context, viewport }).promise;
          }
          if (!cancelled && currentVersion === renderVersion) setLoading(false);
        }

        await renderPages();
        let resizeTimer: ReturnType<typeof setTimeout> | undefined;
        observer = new ResizeObserver(() => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => void renderPages(), 180);
        });
        observer.observe(containerRef.current);
      } catch (error) {
        if (!cancelled) {
          setLoading(false);
          setErrorMessage(error instanceof Error ? error.message : "Materi gagal ditampilkan.");
        }
      }
    }

    void initialize();
    return () => {
      cancelled = true;
      renderVersion += 1;
      observer?.disconnect();
    };
  }, [title, url]);

  return (
    <div className="rounded-xl border border-brand-teal/20 bg-gray-100 p-4 shadow-sm">
      {loading ? <p className="py-12 text-center text-sm text-gray-500">Memuat materi...</p> : null}
      {errorMessage ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Materi tidak dapat ditampilkan. {errorMessage}
        </p>
      ) : null}
      <div ref={containerRef} className="space-y-4" aria-label={`Pembaca materi ${title}`} />
    </div>
  );
}
