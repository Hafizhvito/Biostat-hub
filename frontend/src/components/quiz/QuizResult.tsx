/** Tampilan hasil kuis setelah submit (skor + koreksi per soal). */

import { QuizQuestion } from "./QuizForm";
import { QuizQuestionImage } from "@/components/quiz/QuizQuestionImage";

interface QuizResultItem {
  question_id: number;
  selected_option_id: number;
  correct_option_id: number;
  is_correct: boolean;
}

interface QuizResultData {
  score: number;
  total: number;
  results: QuizResultItem[];
}

interface QuizResultProps {
  result: QuizResultData;
  questions: QuizQuestion[];
}

function getOptionLabel(question: QuizQuestion | undefined, optionId: number) {
  if (!question) return "-";
  return question.options.find((option) => option.id === optionId)?.optionText ?? "-";
}

export function QuizResult({ result, questions }: QuizResultProps) {
  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">Hasil Kuis</p>
        <h2 className="mt-1 text-2xl font-bold text-brand-navy">
          Skor {result.score} / {result.total}
        </h2>
      </div>

      <div className="space-y-3">
        {result.results.map((item, index) => {
          const question = questions.find((q) => q.id === item.question_id);
          return (
            <div
              key={item.question_id}
              className={`rounded-lg border p-3 text-sm ${
                item.is_correct
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <p className="font-semibold">Soal {index + 1}</p>
              {question?.imageUrl ? (
                <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white p-2">
                  <QuizQuestionImage
                    url={question.imageUrl}
                    alt={`Gambar soal ${index + 1}`}
                    className="mx-auto max-h-48 w-full object-contain"
                  />
                </div>
              ) : null}
              <p className="mt-1">{question?.questionText ?? "-"}</p>
              <p className="mt-2">
                Jawaban Anda: {getOptionLabel(question, item.selected_option_id)}
              </p>
              {!item.is_correct ? (
                <p className="mt-1">
                  Jawaban benar: {getOptionLabel(question, item.correct_option_id)}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
