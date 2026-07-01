"use client";

/**
 * Halaman kuis per materi.
 * Ganti design: comment/uncomment block QuizPageLayout + sesuaikan className di JSX bawah.
 * Atau pakai block export default penuh di bagian bawah file (D2/D3).
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { QuizForm, QuizQuestion } from "@/components/quiz/QuizForm";
import { QuizResult } from "@/components/quiz/QuizResult";
import { api } from "@/lib/api";

interface QuizResponse {
  id: number;
  sectionId: number;
  section: { id: number; name: string };
  questions: QuizQuestion[];
}

interface QuizSubmitResponse {
  score: number;
  total: number;
  results: Array<{
    question_id: number;
    selected_option_id: number;
    correct_option_id: number;
    is_correct: boolean;
  }>;
}

interface QuizPageProps {
  params: Promise<{ sectionId: string }>;
}

/* ==========================================================================
 * DESIGN 1 (aktif) — layout
 * ========================================================================== */
function QuizPageLayout({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

/* ==========================================================================
 * DESIGN 2 — layout
 * ==========================================================================
function QuizPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 w-screen bg-white">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">{children}</div>
    </div>
  );
}
*/

/* ==========================================================================
 * DESIGN 3 — layout
 * ==========================================================================
import { Design3PageShell } from "@/components/layout/Design3PageShell";

function QuizPageLayout({ children }: { children: React.ReactNode }) {
  return <Design3PageShell>{children}</Design3PageShell>;
}
*/

export default function QuizPage({ params }: QuizPageProps) {
  const [sectionId, setSectionId] = useState<string>("");
  const [sectionName, setSectionName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [quizUnavailable, setQuizUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const resolvedParams = await params;
        if (cancelled) return;
        setSectionId(resolvedParams.sectionId);
        const data = await api<QuizResponse>(`/sections/${resolvedParams.sectionId}/quiz`);
        if (cancelled) return;
        setQuiz(data);
        setSectionName(data.section.name);
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Gagal memuat kuis.";
        if (message.toLowerCase().includes("quiz tidak ditemukan")) {
          setQuizUnavailable(true);
          return;
        }
        setErrorMessage(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params]);

  async function handleSubmit(answers: Array<{ question_id: number; option_id: number }>) {
    if (!sectionId) return;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const submission = await api<QuizSubmitResponse>(`/sections/${sectionId}/quiz/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      });
      setResult(submission);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Gagal mengirim jawaban.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <QuizPageLayout>
        <p className="text-sm text-gray-600">Memuat kuis...</p>
      </QuizPageLayout>
    );
  }

  if (quizUnavailable) {
    return (
      <QuizPageLayout>
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
          Kuis belum tersedia untuk materi ini.
        </div>
      </QuizPageLayout>
    );
  }

  if (errorMessage) {
    return (
      <QuizPageLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{errorMessage}</div>
      </QuizPageLayout>
    );
  }

  if (!quiz) return null;

  return (
    <QuizPageLayout>
      {/* DESIGN 1 — breadcrumb & header (aktif) */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-brand-teal">
          Beranda
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/section/${sectionId}`} className="hover:text-brand-teal">
          {sectionName || "Materi"}
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-brand-navy">Kuis</span>
      </nav>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Latihan Kuis</p>
        <h1 className="mt-2 text-3xl font-bold text-brand-navy">Kuis: {sectionName}</h1>
        <p className="mt-2 text-sm text-gray-600">
          <Link href={`/section/${sectionId}`} className="font-medium text-brand-teal hover:underline">
            Kembali ke materi
          </Link>
        </p>
      </header>

      {/* DESIGN 2 — uncomment & comment block DESIGN 1 di atas
      <nav className="text-sm text-gray-500">
        <Link href="/" className="transition-colors hover:text-d2-blue">Beranda</Link>
        <span className="mx-2 text-gray-300">›</span>
        <Link href={`/section/${sectionId}`} className="transition-colors hover:text-d2-blue">
          {sectionName || "Materi"}
        </Link>
        <span className="mx-2 text-gray-300">›</span>
        <span className="font-medium text-gray-900">Kuis</span>
      </nav>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-d2-blue">Latihan Kuis</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Kuis: {sectionName}</h1>
        <p className="mt-2 text-sm text-gray-500">
          <Link href={`/section/${sectionId}`} className="font-medium text-d2-blue hover:underline">
            Kembali ke materi
          </Link>
        </p>
      </header>
      */}

      {/* DESIGN 3 — uncomment & comment block DESIGN 1 di atas
      <nav className="text-sm text-d3-muted">
        <Link href="/" className="hover:text-d3-coral">Beranda</Link>
        <span className="mx-2">›</span>
        <Link href={`/section/${sectionId}`} className="hover:text-d3-coral">
          {sectionName || "Materi"}
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-d3-ink">Kuis</span>
      </nav>
      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-d3-coral">Latihan Kuis</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-d3-ink">Kuis: {sectionName}</h1>
        <p className="mt-2 text-sm text-d3-muted">
          <Link href={`/section/${sectionId}`} className="font-medium text-d3-coral hover:underline">
            Kembali ke materi
          </Link>
        </p>
      </header>
      */}

      {result ? (
        <QuizResult result={result} questions={quiz.questions} />
      ) : (
        <>
          <QuizForm questions={quiz.questions} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
          {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
        </>
      )}
    </QuizPageLayout>
  );
}
