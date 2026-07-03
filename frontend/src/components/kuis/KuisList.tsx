/** Grid daftar kuis di halaman /kuis — terpisah dari deskripsi materi. */

import Link from "next/link";
import { ArrowUpRight, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface KuisListItem {
  id: number;
  title: string;
  question_count: number;
}

interface KuisListProps {
  quizzes: KuisListItem[];
}

const DOT_COLORS_D2 = [
  "bg-violet-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-sky-500",
  "bg-purple-500",
] as const;

/* ==========================================================================
 * DESIGN 1 (aktif) — grid kartu teal
 * ========================================================================== */
export function KuisList({ quizzes }: KuisListProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {quizzes.map((quiz) => (
        <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="group min-w-0">
          <Card className="h-full overflow-hidden border-brand-warm/25 bg-brand-peach/20 p-5 group-hover:border-brand-warm">
            <ClipboardList className="h-6 w-6 text-brand-warm" />
            <h2 className="mt-4 line-clamp-2 break-words text-lg font-semibold text-brand-navy group-hover:text-brand-warm">
              {quiz.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {quiz.question_count} pertanyaan pilihan ganda
            </p>
            <p className="mt-4 text-sm font-medium text-brand-warm">Kerjakan kuis →</p>
          </Card>
        </Link>
      ))}
    </section>
  );
}

/* ==========================================================================
 * DESIGN 2 — grid kartu dengan dot ungu
 * ==========================================================================
export function KuisList({ quizzes }: KuisListProps) {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz, index) => (
        <Link
          key={quiz.id}
          href={`/quiz/${quiz.id}`}
          className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <span
            className={`h-3 w-3 rounded-full ${DOT_COLORS_D2[index % DOT_COLORS_D2.length]}`}
            aria-hidden
          />
          <ClipboardList className="mt-4 h-5 w-5 text-violet-500" />
          <h2 className="mt-3 text-base font-bold text-gray-900 group-hover:text-d2-blue">
            {quiz.title}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
            {quiz.question_count} pertanyaan pilihan ganda
          </p>
        </Link>
      ))}
    </section>
  );
}
*/

/* ==========================================================================
 * DESIGN 3 — daftar editorial satu kolom
 * ==========================================================================
export function KuisList({ quizzes }: KuisListProps) {
  return (
    <section className="divide-y divide-d3-coral/20 rounded-2xl border border-d3-coral/20 bg-d3-surface">
      {quizzes.map((quiz) => (
        <Link
          key={quiz.id}
          href={`/quiz/${quiz.id}`}
          className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-d3-sand/60"
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-d3-coral">
              {quiz.question_count} pertanyaan
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-d3-ink group-hover:text-d3-plum">
              {quiz.title}
            </h2>
            <p className="mt-1 text-sm text-d3-muted">Latihan pilihan ganda</p>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-d3-coral transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ))}
    </section>
  );
}
*/
