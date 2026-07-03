"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Terjadi Kesalahan</h2>
          <p className="mt-2 text-sm text-gray-600">Aplikasi mengalami masalah.</p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
