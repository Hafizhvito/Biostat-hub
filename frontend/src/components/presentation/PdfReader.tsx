"use client";

import { Download, Maximize2, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PdfReaderProps {
  url: string;
  title: string;
  downloadUrl?: string;
}

export function PdfReader({ url, title, downloadUrl }: PdfReaderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    let pageObserver: IntersectionObserver | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let renderVersion = 0;
    let lastWidth = 0;

    async function initialize() {
      try {
        setLoading(true);
        setErrorMessage("");
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        const pdf = await pdfjs.getDocument({ url }).promise;
        if (cancelled) return;
        setPageCount(pdf.numPages);

        async function renderPages() {
          const pages = pagesRef.current;
          const viewportElement = viewportRef.current;
          if (!pages || !viewportElement) return;
          const currentVersion = ++renderVersion;
          const availableWidth = Math.max(280, viewportElement.clientWidth - 32);
          pages.replaceChildren();
          pageObserver?.disconnect();

          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            if (cancelled || currentVersion !== renderVersion) return;
            const page = await pdf.getPage(pageNumber);
            const baseViewport = page.getViewport({ scale: 1 });
            const cssScale = (availableWidth / baseViewport.width) * zoom;
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            const renderViewport = page.getViewport({ scale: cssScale * pixelRatio });
            const wrapper = document.createElement("div");
            wrapper.dataset.page = String(pageNumber);
            wrapper.className = "mx-auto w-max rounded-md bg-white shadow-sm";
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Canvas tidak tersedia.");
            canvas.width = Math.floor(renderViewport.width);
            canvas.height = Math.floor(renderViewport.height);
            canvas.style.width = `${Math.floor(renderViewport.width / pixelRatio)}px`;
            canvas.style.height = `${Math.floor(renderViewport.height / pixelRatio)}px`;
            canvas.className = "block max-w-none rounded-md bg-white";
            canvas.setAttribute("aria-label", `Halaman ${pageNumber} dari ${title}`);
            wrapper.appendChild(canvas);
            pages.appendChild(wrapper);
            await page.render({ canvas, canvasContext: context, viewport: renderViewport }).promise;
          }

          if (cancelled || currentVersion !== renderVersion) return;
          setLoading(false);
          pageObserver = new IntersectionObserver(
            (entries) => {
              const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
              const page = Number((visible?.target as HTMLElement | undefined)?.dataset.page);
              if (page) setActivePage(page);
            },
            { root: viewportElement, threshold: [0.15, 0.35, 0.6] },
          );
          pages.querySelectorAll<HTMLElement>("[data-page]").forEach((element) => pageObserver?.observe(element));
        }

        await renderPages();
        lastWidth = viewportRef.current?.clientWidth ?? 0;
        resizeObserver = new ResizeObserver((entries) => {
          const width = Math.round(entries[0]?.contentRect.width ?? 0);
          if (!width || Math.abs(width - lastWidth) < 2) return;
          lastWidth = width;
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => void renderPages(), 180);
        });
        if (viewportRef.current) resizeObserver.observe(viewportRef.current);
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
      clearTimeout(resizeTimer);
      resizeObserver?.disconnect();
      pageObserver?.disconnect();
    };
  }, [title, url, zoom]);

  return (
    <div className="overflow-hidden rounded-xl border border-brand-teal/20 bg-gray-100 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white/95 px-3 py-2">
        <div className="text-sm font-medium text-brand-navy" aria-live="polite">
          Halaman {Math.min(activePage, pageCount || 1)} dari {pageCount || "…"}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setZoom((value) => Math.max(0.5, Number((value - 0.15).toFixed(2))))} disabled={zoom <= 0.5} className="rounded-md border border-gray-300 bg-white p-2 text-brand-navy hover:bg-gray-50 disabled:opacity-40" aria-label="Perkecil tampilan"><Minus className="h-4 w-4" /></button>
          <span className="min-w-12 text-center text-sm text-gray-600">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom((value) => Math.min(2.5, Number((value + 0.15).toFixed(2))))} disabled={zoom >= 2.5} className="rounded-md border border-gray-300 bg-white p-2 text-brand-navy hover:bg-gray-50 disabled:opacity-40" aria-label="Perbesar tampilan"><Plus className="h-4 w-4" /></button>
          <button type="button" onClick={() => setZoom(1)} className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-brand-navy hover:bg-gray-50"><Maximize2 className="h-4 w-4" /> Sesuaikan lebar</button>
          {downloadUrl ? <a href={downloadUrl} className="inline-flex items-center gap-1.5 rounded-md bg-brand-warm px-3 py-2 text-sm font-semibold text-white hover:opacity-90"><Download className="h-4 w-4" /> Unduh PDF</a> : null}
        </div>
      </div>
      {loading ? <p className="py-12 text-center text-sm text-gray-500">Memuat seluruh halaman materi...</p> : null}
      {errorMessage ? <p className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Materi tidak dapat ditampilkan. {errorMessage}</p> : null}
      <div ref={viewportRef} className="max-h-[75vh] min-h-72 overflow-auto p-4" aria-label={`Pembaca materi ${title}`}>
        <div ref={pagesRef} className="min-w-max space-y-4" />
      </div>
    </div>
  );
}
