"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Download, ZoomIn, ZoomOut, X } from "lucide-react";

import { api } from "@/lib/api";

interface WizardItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export default function WizardPage() {
  const [items, setItems] = useState<WizardItem[]>([]);
  const [selected, setSelected] = useState<WizardItem | null>(null);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<WizardItem[]>("/wizard")
      .then((data) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const selectedTitle = useMemo(() => selected?.title ?? "", [selected]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-lemon">Wizard</p>
        <h1 className="text-3xl font-bold text-brand-navy">Wizard Uji Statistik</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
          Lihat flowchart pemilihan uji statistik, buka dalam tampilan besar, lalu unduh gambar bila diperlukan.
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat flowchart...</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
          Belum ada flowchart wizard.
        </p>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-brand-peach bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-brand-navy">{item.title}</h2>
              <button type="button" onClick={() => { setSelected(item); setScale(1); }} className="mt-4 block w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                <Image src={item.imageUrl} alt={item.title} width={1200} height={800} className="max-h-[32rem] w-full object-contain" unoptimized />
              </button>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={item.imageUrl} download className="inline-flex items-center gap-2 rounded-xl bg-brand-warm px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy">
                  <Download className="h-4 w-4" />
                  Download Gambar
                </a>
                <button type="button" onClick={() => { setSelected(item); setScale(1); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-brand-peach">
                  Zoom
                </button>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">{item.description || "Pembahasan belum tersedia."}</p>
            </article>
          ))}
        </div>
      )}

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-h-[90vh] w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="font-semibold text-brand-navy">{selectedTitle}</h2>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setScale((value) => Math.max(0.5, value - 0.25))} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"><ZoomOut className="h-4 w-4" /></button>
                <button type="button" onClick={() => setScale((value) => Math.min(3, value + 0.25))} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"><ZoomIn className="h-4 w-4" /></button>
                <button type="button" onClick={() => setSelected(null)} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="max-h-[calc(90vh-56px)] overflow-auto bg-gray-50 p-4">
              <Image src={selected.imageUrl} alt={selected.title} width={1600} height={1200} style={{ transform: `scale(${scale})`, transformOrigin: "center top" }} className="mx-auto max-w-full rounded-xl bg-white object-contain" unoptimized />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
