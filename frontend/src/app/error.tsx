"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-2xl font-bold text-brand-navy">Terjadi Kesalahan</h2>
      <p className="mt-2 text-sm text-gray-600">
        Halaman tidak bisa dimuat. Silakan coba lagi.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-brand-warm px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-warm/90"
      >
        Coba Lagi
      </button>
    </div>
  );
}
