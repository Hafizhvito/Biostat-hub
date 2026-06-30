/** Halaman 404 kustom. */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <h1 className="text-2xl font-bold text-brand-navy">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-gray-600">Halaman yang Anda cari tidak tersedia.</p>
      <Link
        href="/"
        className="mt-5 inline-flex rounded-lg bg-brand-mint px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-teal"
      >
        Beranda
      </Link>
    </div>
  );
}
