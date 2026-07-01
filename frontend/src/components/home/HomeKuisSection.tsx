/** Blok kuis di beranda — di bawah Jelajahi Materi, link ke /quiz/[sectionId]. */

import Link from "next/link";
import { KuisList, KuisListItem } from "@/components/kuis/KuisList";

interface HomeKuisSectionProps {
  quizzes: KuisListItem[];
}

/* ==========================================================================
 * DESIGN 1 (aktif)
 * ========================================================================== */
export function HomeKuisSection({ quizzes }: HomeKuisSectionProps) {
  if (quizzes.length === 0) return null;

  return (
    <section id="latihan-kuis" className="space-y-4 border-t border-brand-teal/20 pt-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Latihan Kuis</h2>
          <p className="mt-1 text-sm text-gray-600">
            Uji pemahaman setelah menonton video di setiap materi.
          </p>
        </div>
        <Link href="/kuis" className="text-sm font-medium text-brand-teal hover:underline">
          Lihat semua →
        </Link>
      </header>
      <KuisList quizzes={quizzes} />
    </section>
  );
}

/* ==========================================================================
 * DESIGN 2
 * ==========================================================================
export function HomeKuisSection({ quizzes }: HomeKuisSectionProps) {
  if (quizzes.length === 0) return null;

  return (
    <section id="latihan-kuis" className="space-y-6 border-t border-gray-100 pt-10 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Latihan Kuis</h2>
          <p className="mt-1 text-sm text-gray-500">
            Uji pemahaman setelah menonton video di setiap materi.
          </p>
        </div>
        <Link
          href="/kuis"
          className="text-sm font-medium text-d2-blue transition-colors hover:text-d2-blue-dark"
        >
          Lihat semua →
        </Link>
      </header>
      <KuisList quizzes={quizzes} />
    </section>
  );
}
*/

/* ==========================================================================
 * DESIGN 3
 * ==========================================================================
export function HomeKuisSection({ quizzes }: HomeKuisSectionProps) {
  if (quizzes.length === 0) return null;

  return (
    <section id="latihan-kuis" className="space-y-5 border-t border-d3-coral/25 pt-10 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-d3-coral">Latihan</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-d3-ink">Kuis Materi</h2>
          <p className="mt-1 text-sm text-d3-muted">
            Uji pemahaman setelah menonton video di setiap materi.
          </p>
        </div>
        <Link href="/kuis" className="text-sm font-medium text-d3-coral hover:underline">
          Lihat semua →
        </Link>
      </header>
      <KuisList quizzes={quizzes} />
    </section>
  );
}
*/
