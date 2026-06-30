"use client";

/** Halaman kuis: form jawaban → submit → tampilkan skor. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { QuizForm, QuizQuestion } from "@/components/quiz/QuizForm";
import { QuizResult } from "@/components/quiz/QuizResult";
import { api } from "@/lib/api";

interface QuizResponse {
  id: number;
  videoId: number;
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
  params: Promise<{ videoId: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const [videoId, setVideoId] = useState<string>("");
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

        setVideoId(resolvedParams.videoId);
        const data = await api<QuizResponse>(`/videos/${resolvedParams.videoId}/quiz`);
        if (cancelled) return;
        setQuiz(data);
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
    if (!videoId) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const submission = await api<QuizSubmitResponse>(`/videos/${videoId}/quiz/submit`, {
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

  if (loading) return <p className="text-sm text-gray-600">Memuat kuis...</p>;

  if (quizUnavailable) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-700">
        Kuis belum tersedia untuk video ini.
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {errorMessage}
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600">
          <Link href={`/video/${videoId}`} className="font-medium text-brand-teal">
            Kembali ke Video
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-bold text-brand-navy">Kuis Video</h1>
      </div>

      {result ? (
        <QuizResult result={result} questions={quiz.questions} />
      ) : (
        <>
          <QuizForm questions={quiz.questions} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
          {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
        </>
      )}
    </div>
  );
}
