"use client";

/** Admin: editor kuis per video (soal, gambar opsional, 4 pilihan). */

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { getToken } from "@/lib/auth";
import { apiWithAuth } from "@/lib/api";

interface SectionItem {
  id: number;
  name: string;
}

interface VideoItem {
  id: number;
  title: string;
  sectionId: number;
}

interface QuizApiOption {
  id: number;
  option_text: string;
  is_correct: boolean;
}

interface QuizApiQuestion {
  id: number;
  question_text: string;
  image_url: string | null;
  options: QuizApiOption[];
}

interface QuizApiResponse {
  id: number;
  video_id: number;
  questions: QuizApiQuestion[];
}

interface QuizEditorQuestion {
  questionText: string;
  imageUrl: string;
  options: string[];
  correctAnswerIndex: number;
}

const emptyQuestion = (): QuizEditorQuestion => ({
  questionText: "",
  imageUrl: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
});

function normalizeQuizQuestion(question: QuizApiQuestion): QuizEditorQuestion {
  const options = question.options.slice(0, 4).map((option) => option.option_text);
  while (options.length < 4) {
    options.push("");
  }
  const correctIndex = question.options.findIndex((option) => option.is_correct);
  return {
    questionText: question.question_text,
    imageUrl: question.image_url ?? "",
    options,
    correctAnswerIndex: correctIndex >= 0 ? Math.min(correctIndex, 3) : 0,
  };
}

export default function AdminQuizzesPage() {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [questions, setQuestions] = useState<QuizEditorQuestion[]>([emptyQuestion()]);
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const authApi = apiWithAuth(getToken() ?? "");

  const videosBySection = useMemo(() => {
    return sections.map((section) => ({
      ...section,
      videos: videos.filter((video) => video.sectionId === section.id),
    }));
  }, [sections, videos]);

  async function loadData() {
    setLoading(true);
    setErrorMessage("");
    try {
      const [sectionData, videoData] = await Promise.all([
        authApi<SectionItem[]>("/admin/sections"),
        authApi<VideoItem[]>("/admin/videos"),
      ]);
      setSections(sectionData);
      setVideos(videoData);
      if (videoData.length > 0) {
        setSelectedVideoId(String(videoData[0].id));
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data kuis.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedVideoId) return;

    let cancelled = false;
    setLoadingQuiz(true);
    setErrorMessage("");
    setActionMessage("");

    async function loadQuiz() {
      try {
        const data = await authApi<QuizApiResponse>(`/admin/videos/${selectedVideoId}/quiz`);
        if (cancelled) return;
        setQuestions(data.questions.map(normalizeQuizQuestion));
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Gagal memuat data kuis.";
        if (message.toLowerCase().includes("quiz tidak ditemukan")) {
          setQuestions([emptyQuestion()]);
          return;
        }
        setErrorMessage(message);
      } finally {
        if (!cancelled) setLoadingQuiz(false);
      }
    }

    loadQuiz();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideoId]);

  function updateQuestionText(index: number, value: string) {
    setQuestions((prev) => prev.map((question, i) => (i === index ? { ...question, questionText: value } : question)));
  }

  function updateQuestionImageUrl(index: number, value: string) {
    setQuestions((prev) => prev.map((question, i) => (i === index ? { ...question, imageUrl: value } : question)));
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              options: question.options.map((option, j) => (j === optionIndex ? value : option)),
            }
          : question,
      ),
    );
  }

  function updateCorrectAnswer(questionIndex: number, optionIndex: number) {
    setQuestions((prev) =>
      prev.map((question, i) => (i === questionIndex ? { ...question, correctAnswerIndex: optionIndex } : question)),
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveQuiz() {
    if (!selectedVideoId) return;

    setErrorMessage("");
    setActionMessage("");

    for (const question of questions) {
      if (!question.questionText.trim()) {
        setErrorMessage("Setiap soal wajib memiliki pertanyaan.");
        return;
      }
      if (question.options.some((option) => !option.trim())) {
        setErrorMessage("Semua opsi jawaban wajib diisi.");
        return;
      }
    }

    setIsSaving(true);
    try {
      await authApi(`/admin/videos/${selectedVideoId}/quiz`, {
        method: "PUT",
        body: JSON.stringify({
          questions: questions.map((question) => ({
            questionText: question.questionText,
            imageUrl: question.imageUrl.trim(),
            options: question.options.map((option, index) => ({
              optionText: option,
              isCorrect: index === question.correctAnswerIndex,
            })),
          })),
        }),
      });
      setActionMessage("Kuis berhasil disimpan.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan kuis.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteQuiz() {
    if (!selectedVideoId) return;

    setIsSaving(true);
    setErrorMessage("");
    setActionMessage("");
    try {
      await authApi(`/admin/videos/${selectedVideoId}/quiz`, { method: "DELETE" });
      setQuestions([emptyQuestion()]);
      setActionMessage("Kuis berhasil dihapus.");
      setConfirmDeleteOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus kuis.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat data kuis...</p>;
  if (errorMessage && videos.length === 0) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>;
  }
  if (videos.length === 0) {
    return <EmptyState message="Belum ada video. Tambahkan video terlebih dahulu sebelum membuat kuis." />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Kelola Kuis</h1>
        <p className="text-sm text-gray-600">Pilih video lalu atur soal kuis dengan 4 opsi jawaban.</p>
      </div>

      <Card>
        <label htmlFor="video-select" className="text-sm font-medium text-brand-navy">
          Pilih Video
        </label>
        <select
          id="video-select"
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-brand-teal focus:ring-2 focus:ring-brand-teal-soft"
          value={selectedVideoId}
          onChange={(event) => setSelectedVideoId(event.target.value)}
        >
          {videosBySection.map((section) => (
            <optgroup key={section.id} label={section.name}>
              {section.videos.map((video) => (
                <option key={video.id} value={video.id}>
                  {video.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Card>

      {loadingQuiz ? <p className="text-sm text-gray-500">Memuat detail kuis...</p> : null}
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {actionMessage ? <p className="text-sm text-green-700">{actionMessage}</p> : null}

      <div className="space-y-3">
        {questions.map((question, questionIndex) => (
          <Card key={`question-${questionIndex}`} className="space-y-3">
            <Input
              label={`Soal ${questionIndex + 1}`}
              value={question.questionText}
              onChange={(event) => updateQuestionText(questionIndex, event.target.value)}
            />
            <Input
              label="Link Gambar (opsional)"
              value={question.imageUrl}
              onChange={(event) => updateQuestionImageUrl(questionIndex, event.target.value)}
              placeholder="https://drive.google.com/..."
            />
            <p className="text-xs text-gray-500">
              Upload gambar ke Google Drive → klik kanan file → <strong>Bagikan</strong> → akses{" "}
              <strong>Siapa saja dengan link</strong> → salin link (harus berisi{" "}
              <code className="rounded bg-gray-100 px-1">drive.google.com/file/d/...</code>). Jika gambar tidak
              muncul, coba upload ke{" "}
              <a
                href="https://imgbb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-teal underline"
              >
                imgbb.com
              </a>{" "}
              lalu salin <strong>Direct link</strong>-nya.
            </p>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={`option-${questionIndex}-${optionIndex}`} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-answer-${questionIndex}`}
                    checked={question.correctAnswerIndex === optionIndex}
                    onChange={() => updateCorrectAnswer(questionIndex, optionIndex)}
                    aria-label={`Jawaban benar opsi ${optionIndex + 1}`}
                  />
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-brand-teal focus:ring-2 focus:ring-brand-teal-soft"
                    value={option}
                    onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)}
                    placeholder={`Opsi ${optionIndex + 1}`}
                  />
                </div>
              ))}
            </div>
            <Button variant="danger" onClick={() => removeQuestion(questionIndex)} disabled={questions.length === 1}>
              Hapus Soal Ini
            </Button>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={addQuestion}>
          + Tambah Soal
        </Button>
        <Button onClick={saveQuiz} disabled={isSaving}>
          {isSaving ? "Menyimpan..." : "Simpan Kuis"}
        </Button>
        <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)} disabled={isSaving}>
          Hapus Kuis
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Hapus Kuis"
        message="Kuis untuk video ini akan dihapus permanen. Lanjutkan?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => {
          void deleteQuiz();
        }}
      />
    </div>
  );
}
