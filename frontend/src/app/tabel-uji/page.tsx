"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";

interface StatTestItem {
  id: number;
  name: string;
  function: string;
  dataType: string;
  dataDistribution: string;
  useCase: string;
  spssMenu: string;
  notes: string;
}

const dataTypes = ["all", "nominal", "ordinal", "interval", "rasio"];
const distributions = ["all", "parametrik", "non-parametrik"];

export default function TabelUjiPage() {
  const [tests, setTests] = useState<StatTestItem[]>([]);
  const [dataType, setDataType] = useState("all");
  const [distribution, setDistribution] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<StatTestItem[]>("/stat-tests")
      .then((data) => setTests(data))
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return tests.filter((item) => {
      const dataTypeMatch = dataType === "all" || item.dataType === dataType;
      const distributionMatch = distribution === "all" || item.dataDistribution === distribution;
      return dataTypeMatch && distributionMatch;
    });
  }, [dataType, distribution, tests]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-lemon">Tabel Uji</p>
        <h1 className="text-3xl font-bold text-brand-navy">Tabel Ringkasan Uji Statistik</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
          Gunakan filter untuk membandingkan uji statistik berdasarkan jenis data dan distribusi.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        <select value={dataType} onChange={(event) => setDataType(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20">
          {dataTypes.map((item) => <option key={item} value={item}>{item === "all" ? "Semua Jenis Data" : item}</option>)}
        </select>
        <select value={distribution} onChange={(event) => setDistribution(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-brand-warm focus:ring-2 focus:ring-brand-warm/20">
          {distributions.map((item) => <option key={item} value={item}>{item === "all" ? "Semua Distribusi" : item}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat tabel uji...</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">Tidak ada data yang cocok.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-240 w-full text-left text-sm">
            <thead className="bg-brand-peach/40 text-brand-navy">
              <tr>
                <th className="px-4 py-3">Nama Uji</th>
                <th className="px-4 py-3">Fungsi</th>
                <th className="px-4 py-3">Jenis Data</th>
                <th className="px-4 py-3">Distribusi</th>
                <th className="px-4 py-3">Kapan Digunakan</th>
                <th className="px-4 py-3">Menu SPSS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 align-top transition-colors hover:bg-brand-peach/20">
                  <td className="px-4 py-3 font-medium text-brand-navy">{item.name}</td>
                  <td className="px-4 py-3 text-gray-700">{item.function}</td>
                  <td className="px-4 py-3 text-gray-700">{item.dataType}</td>
                  <td className="px-4 py-3 text-gray-700">{item.dataDistribution}</td>
                  <td className="px-4 py-3 text-gray-700">{item.useCase}</td>
                  <td className="px-4 py-3 text-gray-700">{item.spssMenu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
