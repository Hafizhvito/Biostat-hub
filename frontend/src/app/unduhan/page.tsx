"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";

import { api, apiUrl } from "@/lib/api";

interface DownloadItem {
  id: number;
  title: string;
  description: string;
  category: string;
  originalName: string;
  fileSize: number;
  downloadCount: number;
}

const categories = ["all", "Materi", "Template", "Panduan SPSS", "Lainnya"];

function formatFileSize(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function UnduhanPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<DownloadItem[]>("/downloads")
      .then((data) => setDownloads(data))
      .catch(() => setDownloads([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return downloads.filter((item) => {
      const categoryMatch = category === "all" || item.category === category;
      const queryMatch = !q || item.title.toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
  }, [category, downloads, query]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-lemon">Unduhan</p>
        <h1 className="text-3xl font-bold text-brand-navy">Download Center</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
          Unduh file pendukung seperti PDF, template, dan panduan.
        </p>
      </header>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari file berdasarkan judul..."
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20"
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              category === item ? "bg-brand-warm text-white" : "bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-brand-peach"
            }`}
          >
            {item === "all" ? "Semua" : item}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat file unduhan...</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
          Tidak ada file yang cocok.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-2xl border border-brand-peach bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-brand-peach/60 p-3 text-brand-warm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-brand-navy">{item.title}</h2>
                    <p className="mt-1 text-sm text-gray-600">{item.description || "Deskripsi belum tersedia."}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-brand-warm">
                <span className="rounded-full bg-brand-peach px-3 py-1">{item.category}</span>
                <span className="rounded-full bg-brand-peach px-3 py-1">{formatFileSize(item.fileSize)}</span>
                {item.downloadCount > 0 ? (
                  <span className="rounded-full bg-brand-peach px-3 py-1">{item.downloadCount} unduhan</span>
                ) : null}
              </div>
              <a
                href={apiUrl(`/downloads/${item.id}/file`)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-warm px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy"
              >
                <Download className="h-4 w-4" />
                Unduh File
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
