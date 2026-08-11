import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { api } from "@/lib/api";

interface CalculatorLinkItem {
  id: number;
  title: string;
  url: string;
}

export default async function KalkulatorPage() {
  const links = await api<CalculatorLinkItem[]>("/calculator-links").catch(() => []);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-lemon">Alat Bantu</p>
        <h1 className="text-3xl font-bold text-brand-navy">Kalkulator Sampel</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
          Gunakan kalkulator eksternal untuk menghitung kebutuhan sampel secara cepat. Link aktif dapat diatur oleh admin.
        </p>
      </header>

      {links.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
          Fitur ini sedang disiapkan. Silakan cek lagi nanti.
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <article key={link.id} className="rounded-2xl border border-brand-peach bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-brand-navy">{link.title}</h2>
              <p className="mt-2 text-sm text-gray-600">Buka kalkulator ini pada tab baru.</p>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-warm px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-navy"
              >
                Buka {link.title}
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="mt-3 text-xs text-gray-500">URL: {link.url}</p>
            </article>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-navy">Cara Pakai</h2>
        <p className="mt-2 leading-relaxed">
          Tentukan parameter penelitian, buka kalkulator, lalu ikuti panduan dari layanan eksternal tersebut.
        </p>
        <p className="mt-2 leading-relaxed">
          Kembali ke{" "}
          <Link href="/" className="font-medium text-brand-warm hover:underline">
            beranda
          </Link>{" "}
          untuk memilih materi atau fitur lain.
        </p>
      </div>
    </div>
  );
}
