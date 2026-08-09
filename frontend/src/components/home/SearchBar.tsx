"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Calculator, Download, FileText, LibraryBig, Search, Table2, Video } from "lucide-react";

import { api } from "@/lib/api";

type SearchResultItem = {
  type: string;
  title: string;
  subtitle: string;
  href: string;
};

type SearchResponse = {
  results: SearchResultItem[];
};

const iconByType: Record<string, typeof BookOpen> = {
  materi: BookOpen,
  video: Video,
  glosarium: LibraryBig,
  unduhan: Download,
  kuis: Table2,
  kalkulator: Calculator,
};

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const trimmed = q.trim();

  useEffect(() => {
    let isCancelled = false;

    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const response = await api<SearchResponse>(`/search?q=${encodeURIComponent(trimmed)}`);
        if (!isCancelled) {
          setResults(response.results ?? []);
        }
      } catch {
        if (!isCancelled) {
          setResults([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      isCancelled = true;
      window.clearTimeout(timer);
    };
  }, [trimmed]);

  const hasResults = useMemo(() => results.length > 0, [results]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setIsOpen(false);
  }

  return (
    <div className="relative mt-6 w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(event) => {
              setQ(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
            placeholder="Cari materi, video, glosarium, unduhan..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-800 shadow-sm outline-none focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-warm px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy sm:w-auto"
        >
          Cari
        </button>
      </form>

      {isOpen && trimmed ? (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {isLoading ? (
            <p className="px-4 py-3 text-sm text-gray-500">Mencari...</p>
          ) : hasResults ? (
            <ul className="max-h-96 overflow-auto py-2">
              {results.map((item) => {
                const Icon = iconByType[item.type] ?? FileText;
                return (
                  <li key={`${item.type}-${item.href}`}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => router.push(item.href)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-brand-peach/40"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-warm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-brand-navy">{item.title}</p>
                        <p className="mt-0.5 truncate text-xs text-gray-500">{item.subtitle}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">Tidak ada hasil untuk &quot;{trimmed}&quot;</p>
          )}
        </div>
      ) : null}
    </div>
  );
}