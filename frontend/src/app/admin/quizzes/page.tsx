"use client";

/** Admin: kelola kuis mandiri — judul + soal, tanpa kaitan ke materi. */

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { getToken } from "@/lib/auth";
import { apiWithAuth } from "@/lib/api";

interface QuizListItem {
  id: number;
  title: string;
  question_count: number;
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
  title: string;
  questions: QuizApiQuestion[];
}

interface QuizEditorQuestion {
  questionText: string;
  imageUrl: string;
  options: string[];
  correctAnswerIndex: number;
}

const DEFAULT_TITLE = "Kuis";

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

function buildPayload(title: string, questions: QuizEditorQuestion[]) {
  return {
    title: title.trim() || DEFAULT_TITLE,
    questions: questions.map((question) => ({
      questionText: question.questionText,
      imageUrl: question.imageUrl.trim(),
      options: question.options.map((option, index) => ({
        optionText: option,
        isCorrect: index === question.correctAnswerIndex,
      })),
    })),
  };
}

export default function AdminQuizzesPage() {
  const [quizList, setQuizList] = useState<QuizListItem[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [questions, setQuestions] = useState<QuizEditorQuestion[]>([emptyQuestion()]);
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const authApi = apiWithAuth(getToken() ?? "");

  function resetNewQuizForm() {
    setSelectedQuizId(null);
    setTitle(DEFAULT_TITLE);
    setQuestions([emptyQuestion()]);
    setErrorMessage("");
    setActionMessage("");
  }

  async function loadQuizList(preferredId?: number | null) {
    const list = await authApi<QuizListItem[]>("/admin/quizzes");
    setQuizList(list);

    if (list.length === 0) {
      resetNewQuizForm();
      return;
    }

    const nextId =
      preferredId && list.some((quiz) => quiz.id === preferredId)
        ? preferredId
        : list[0].id;
    setSelectedQuizId(nextId);
  }

  async function loadQuizDetail(quizId: number) {
    setLoadingQuiz(true);
    setErrorMessage("");
    setActionMessage("");
    try {
      const data = await authApi<QuizApiResponse>(`/admin/quizzes/${quizId}`);
      setTitle(data.title);
      setQuestions(data.questions.length > 0 ? data.questions.map(normalizeQuizQuestion) : [emptyQuestion()]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat detail kuis.");
    } finally {
      setLoadingQuiz(false);
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true);
      setErrorMessage("");
      try {
        await loadQuizList();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data kuis.");
      } finally {
        setLoading(false);
      }
    }

    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedQuizId === null) return;
    void loadQuizDetail(selectedQuizId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuizId]);

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
      const payload = buildPayload(title, questions);

      if (selectedQuizId === null) {
        const created = await authApi<QuizApiResponse>("/admin/quizzes", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setActionMessage("Kuis berhasil dibuat.");
        await loadQuizList(created.id);
      } else {
        await authApi(`/admin/quizzes/${selectedQuizId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setActionMessage("Kuis berhasil disimpan.");
        await loadQuizList(selectedQuizId);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan kuis.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteQuiz() {
    if (selectedQuizId === null) return;

    setIsSaving(true);
    setErrorMessage("");
    setActionMessage("");
    try {
      await authApi(`/admin/quizzes/${selectedQuizId}`, { method: "DELETE" });
      setConfirmDeleteOpen(false);
      setActionMessage("Kuis berhasil dihapus.");
      await loadQuizList();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghapus kuis.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return <p className="py-8 text-sm text-gray-500">Memuat data kuis...</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-navy">Kelola Kuis</h1>
        <p className="text-sm text-gray-600">
          Buat dan atur kuis secara mandiri. Judul dan soal kuis tidak terkait dengan materi pembelajaran.
        </p>
      </div>

      {quizList.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {quizList.map((quiz) => (
            <Button
              key={quiz.id}
              variant={selectedQuizId === quiz.id ? "primary" : "secondary"}
              onClick={() => setSelectedQuizId(quiz.id)}
            >
              {quiz.title}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={resetNewQuizForm}>
          + Kuis Baru
        </Button>
      </div>

      <Card className="space-y-3">
        <Input
          label="Judul Kuis"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={DEFAULT_TITLE}
        />
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
          {isSaving ? "Menyimpan..." : selectedQuizId === null ? "Buat Kuis" : "Simpan Kuis"}
        </Button>
        {selectedQuizId !== null ? (
          <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)} disabled={isSaving}>
            Hapus Kuis
          </Button>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Hapus Kuis"
        message="Kuis ini akan dihapus permanen. Lanjutkan?"
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
