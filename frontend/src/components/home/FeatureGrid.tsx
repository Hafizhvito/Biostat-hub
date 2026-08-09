import Link from "next/link";
import { BookText, Calculator, Download, LibraryBig, Table2, Workflow } from "lucide-react";

import { Card } from "@/components/ui/Card";

const features = [
  {
    href: "/kalkulator",
    title: "Kalkulator Sampel",
    description: "Redirect ke kalkulator eksternal yang diatur admin.",
    icon: Calculator,
  },
  {
    href: "/unduhan",
    title: "Download Center",
    description: "Unduh PDF, template, dan panduan pendukung.",
    icon: Download,
  },
  {
    href: "/wizard",
    title: "Wizard Uji Statistik",
    description: "Flowchart pemilihan uji statistik dengan zoom.",
    icon: Workflow,
  },
  {
    href: "/glosarium",
    title: "Glosarium Istilah",
    description: "Kamus istilah biostatistik yang bisa dicari cepat.",
    icon: BookText,
  },
  {
    href: "/tabel-uji",
    title: "Tabel Ringkasan Uji",
    description: "Lihat ringkasan uji statistik beserta pembahasan dan gambar.",
    icon: Table2,
  },
  {
    href: "/materi",
    title: "Filter Level Materi",
    description: "Jelajahi materi berdasarkan level pembelajaran.",
    icon: LibraryBig,
  },
] as const;

export function FeatureGrid() {
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold text-brand-navy">Alat Bantu & Fitur</h2>
        <p className="mt-1 text-sm text-gray-600">Pilih alat bantu sesuai kebutuhan belajar.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="group min-w-0">
            <Card className="h-full border-brand-teal-soft/70 p-5 transition-colors group-hover:border-brand-warm">
              <Icon className="h-6 w-6 text-brand-warm" />
              <h3 className="mt-4 text-lg font-semibold text-brand-navy group-hover:text-brand-warm">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}