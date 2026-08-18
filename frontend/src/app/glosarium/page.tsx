"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";

interface GlossaryItem {
  id: number;
  term: string;
  definition: string;
  example: string | null;
}

const alphabet = ["all", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export default function GlosariumPage() {
  const [terms, setTerms] = useState<GlossaryItem[]>([]);
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<GlossaryItem[]>("/glossary")
      .then((data) => setTerms(data))
      .catch(() => setTerms([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((item) => {
      const termMatch = item.term.toLowerCase().includes(q);
      const letterMatch = letter === "all" || item.term.toUpperCase().startsWith(letter);
      return termMatch && letterMatch;
    });
  }, [letter, query, terms]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, GlossaryItem[]>>((acc, item) => {
      const key = item.term[0]?.toUpperCase() || "#";
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-lemon">Glosarium</p>
        <h1 className="text-3xl font-bold text-brand-navy">Kamus Istilah Riset</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
          Cari istilah secara cepat, lalu jelajahi per huruf awal.
        </p>
      </header>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari istilah..."
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20"
      />

      <div className="flex flex-wrap gap-2">
        {alphabet.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLetter(item)}
            className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              letter === item ? "bg-brand-warm text-white" : "bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-brand-peach"
            }`}
          >
            {item === "all" ? "Semua" : item}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat glosarium...</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
          Tidak ada istilah untuk filter ini.
        </p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([initial, items]) => (
              <section key={initial} id={`letter-${initial}`} className="space-y-3">
                <h2 className="text-2xl font-bold text-brand-navy">{initial}</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <article key={item.id} id={`term-${item.id}`} className="rounded-2xl border border-brand-peach bg-white p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-brand-navy">{item.term}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.definition}</p>
                      {item.example ? <p className="mt-3 text-sm text-brand-warm">Contoh: {item.example}</p> : null}
                    </article>
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
