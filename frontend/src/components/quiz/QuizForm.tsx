"use client";

/** Form kuis: semua soal + radio button, submit sekali. */

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuizQuestionImage } from "@/components/quiz/QuizQuestionImage";

export interface QuizOption {
  id: number;
  optionText: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  imageUrl?: string | null;
  options: QuizOption[];
}

interface QuizFormProps {
  questions: QuizQuestion[];
  isSubmitting: boolean;
  onSubmit: (answers: Array<{ question_id: number; option_id: number }>) => void;
}

export function QuizForm({ questions, isSubmitting, onSubmit }: QuizFormProps) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [validationError, setValidationError] = useState("");

  const totalAnswered = useMemo(() => Object.keys(selected).length, [selected]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (totalAnswered !== questions.length) {
      setValidationError("Mohon jawab semua soal sebelum mengirim.");
      return;
    }

    setValidationError("");
    const answers = questions.map((question) => ({
      question_id: question.id,
      option_id: selected[question.id],
    }));
    onSubmit(answers);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question, index) => (
        <fieldset key={question.id} className="rounded-xl border border-gray-200 bg-white p-4">
          <legend className="px-1 text-sm font-semibold text-brand-navy">
            Soal {index + 1}
          </legend>
          {question.imageUrl ? (
            <div className="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2">
              <QuizQuestionImage url={question.imageUrl} alt={`Gambar soal ${index + 1}`} />
            </div>
          ) : null}
          <p className="mt-1 text-sm text-gray-800">{question.questionText}</p>
          <div className="mt-4 space-y-2">
            {question.options.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm hover:border-brand-teal"
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={selected[question.id] === option.id}
                  onChange={() =>
                    setSelected((prev) => ({
                      ...prev,
                      [question.id]: option.id,
                    }))
                  }
                  className="mt-0.5 h-4 w-4 accent-brand-teal"
                />
                <span>{option.optionText}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {validationError ? <p className="text-sm text-red-600">{validationError}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Mengirim..." : "Kirim Jawaban"}
      </Button>
    </form>
  );
}
