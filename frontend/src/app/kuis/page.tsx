/** Halaman daftar semua kuis. Ganti design: comment/uncomment export default. */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { KuisList } from "@/components/kuis/KuisList";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";

interface QuizListItem {
  id: number;
  title: string;
  question_count: number;
}

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
export default async function KuisPage() {
  const quizzes = await api<QuizListItem[]>("/quizzes");

  return (
    <div className="space-y-6">
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-brand-teal">
          Beranda
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-brand-navy">Kuis</span>
      </nav>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-brand-navy">Latihan Kuis</h1>
        <p className="text-sm text-gray-600">
          Kerjakan kuis pilihan ganda untuk menguji pemahaman Anda.
        </p>
      </header>
      {quizzes.length === 0 ? (
        <EmptyState message="Belum ada kuis. Kuis akan ditambahkan melalui panel admin." />
      ) : (
        <KuisList quizzes={quizzes} />
      )}
    </div>
  );
}

/* ==========================================================================
 * DESIGN 2
 * ==========================================================================
export default async function KuisPage() {
  const quizzes = await api<QuizListItem[]>("/quizzes");

  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 w-screen bg-white">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="transition-colors hover:text-d2-blue">
            Beranda
          </Link>
          <span className="mx-2 text-gray-300">›</span>
          <span className="font-medium text-gray-900">Kuis</span>
        </nav>
        <header className="space-y-2 border-b border-gray-100 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-d2-blue">Latihan</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Kuis Materi</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-gray-500 md:text-base">
            Kerjakan kuis setelah menonton video di setiap materi untuk menguji pemahaman Anda.
          </p>
        </header>
        {quizzes.length === 0 ? (
          <EmptyState message="Belum ada kuis. Kuis akan ditambahkan bersama materi." />
        ) : (
          <KuisList quizzes={quizzes} />
        )}
      </div>
    </div>
  );
}
*/

/* ==========================================================================
 * DESIGN 3
 * ==========================================================================
import { Design3PageShell } from "@/components/layout/Design3PageShell";

export default async function KuisPage() {
  const quizzes = await api<QuizListItem[]>("/quizzes");

  return (
    <Design3PageShell>
      <nav className="text-sm text-d3-muted">
        <Link href="/" className="hover:text-d3-coral">
          Beranda
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-d3-ink">Kuis</span>
      </nav>
      <header className="mt-4 space-y-2 border-b border-d3-coral/20 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-d3-coral">Latihan</p>
        <h1 className="font-serif text-3xl font-semibold text-d3-ink">Kuis Materi</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-d3-muted">
          Kerjakan kuis setelah menonton video di setiap materi untuk menguji pemahaman Anda.
        </p>
      </header>
      <div className="mt-6">
        {quizzes.length === 0 ? (
          <EmptyState message="Belum ada kuis. Kuis akan ditambahkan bersama materi." />
        ) : (
          <KuisList quizzes={quizzes} />
        )}
      </div>
    </Design3PageShell>
  );
}
*/
