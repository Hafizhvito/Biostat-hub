export default function Loading() {
  return (
    <div className="space-y-8" role="status" aria-live="polite" aria-label="Memuat halaman">
      <div className="animate-pulse rounded-2xl bg-brand-powder/70 p-8">
        <div className="h-3 w-36 rounded bg-white/70" />
        <div className="mt-5 h-9 w-56 rounded bg-white/80" />
        <div className="mt-4 h-4 max-w-xl rounded bg-white/70" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 rounded-xl bg-white/80" />
          ))}
        </div>
      </div>
      <div className="animate-pulse space-y-4">
        <div className="h-7 w-48 rounded bg-gray-200" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-36 rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
      <span className="sr-only">Sedang memuat konten…</span>
    </div>
  );
}
