import Link from "next/link";

import { api } from '@/lib/api';

interface SearchResultItem {
  type: string;
  title: string;
  subtitle: string;
  href: string;
}

interface SearchResult {
  results: SearchResultItem[];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  let result: SearchResult = { results: [] };
  if (query) {
    result = await api<SearchResult>(`/search?q=${encodeURIComponent(query)}`).catch(() => ({
      results: [],
    }));
  }

  const total = result.results.length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-brand-navy">Hasil Pencarian</h1>
        {query && (
          <p className="mt-1 text-sm text-gray-500">
            {total > 0 ? `${total} hasil untuk "${query}"` : `Tidak ada hasil untuk "${query}"`}
          </p>
        )}
      </header>

      {result.results.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-lemon">Materi</h2>
          <ul className="space-y-2">
            {result.results.map((item) => (
              <li key={`${item.type}-${item.href}`}>
                <Link
                  href={item.href}
                  className="block rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-lemon">
                    {item.subtitle}
                  </p>
                  <p className="mt-1 font-medium text-brand-navy">{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {query && total === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
          Coba kata kunci lain.
        </div>
      )}
    </div>
  );
}
