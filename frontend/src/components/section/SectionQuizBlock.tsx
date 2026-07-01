/** Blok kuis di halaman materi — satu kuis per section, bukan per video. */

import Link from "next/link";
import { ClipboardList } from "lucide-react";

interface SectionQuizBlockProps {
  sectionId: number;
  sectionName: string;
  questionCount: number;
}

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
export function SectionQuizBlock({ sectionId, sectionName, questionCount }: SectionQuizBlockProps) {
  if (questionCount === 0) return null;

  return (
    <section className="mt-10 space-y-4 border-t border-brand-teal/20 pt-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Latihan Kuis</p>
        <h2 className="mt-1 text-xl font-semibold text-brand-navy">Uji pemahaman materi ini</h2>
      </header>
      <div className="rounded-xl border border-brand-teal/25 bg-brand-teal-soft p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-teal text-white">
              <ClipboardList className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-brand-navy">Kuis: {sectionName}</h3>
              <p className="mt-1 text-sm text-gray-600">{questionCount} pertanyaan pilihan ganda</p>
            </div>
          </div>
          <Link
            href={`/quiz/${sectionId}`}
            className="inline-flex shrink-0 justify-center rounded-lg bg-brand-teal px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy"
          >
            Mulai Kuis
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
 * DESIGN 2 — kartu biru di bawah grid video
 * ==========================================================================
export function SectionQuizBlock({ sectionId, sectionName, questionCount }: SectionQuizBlockProps) {
  if (questionCount === 0) return null;

  return (
    <section className="mt-10 space-y-4 border-t border-gray-100 pt-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-d2-blue">Latihan Kuis</p>
        <h2 className="mt-1 text-xl font-bold text-gray-900">Uji pemahaman materi ini</h2>
      </header>
      <div className="rounded-xl border border-d2-blue/20 bg-d2-blue/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-d2-blue text-white">
              <ClipboardList className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-gray-900">Kuis: {sectionName}</h3>
              <p className="mt-1 text-sm text-gray-500">{questionCount} pertanyaan pilihan ganda</p>
            </div>
          </div>
          <Link
            href={`/quiz/${sectionId}`}
            className="inline-flex shrink-0 justify-center rounded-lg bg-d2-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-d2-blue-dark"
          >
            Mulai Kuis
          </Link>
        </div>
      </div>
    </section>
  );
}
*/

/* ==========================================================================
 * DESIGN 3 — kartu plum/coral editorial
 * ==========================================================================
export function SectionQuizBlock({ sectionId, sectionName, questionCount }: SectionQuizBlockProps) {
  if (questionCount === 0) return null;

  return (
    <section className="mt-10 space-y-4 border-t border-d3-coral/30 pt-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-d3-coral">Latihan Kuis</p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-d3-ink">Uji pemahaman materi ini</h2>
      </header>
      <div className="rounded-2xl border border-d3-coral/25 bg-d3-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-d3-plum text-white">
              <ClipboardList className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-d3-ink">Kuis: {sectionName}</h3>
              <p className="mt-1 text-sm text-d3-muted">{questionCount} pertanyaan pilihan ganda</p>
            </div>
          </div>
          <Link
            href={`/quiz/${sectionId}`}
            className="inline-flex shrink-0 justify-center rounded-xl bg-d3-coral px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-d3-plum"
          >
            Mulai Kuis
          </Link>
        </div>
      </div>
    </section>
  );
}
*/
