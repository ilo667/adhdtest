"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Question, type QuizData } from "../../lib/api";
import { BrainsMateLogo } from "../../components/BrainIcon";

const ANSWER_LABELS = [
  { value: 4, label: "Strongly agree" },
  { value: 3, label: "Agree" },
  { value: 2, label: "Neutral" },
  { value: 1, label: "Disagree" },
  { value: 0, label: "Strongly Disagree" },
];

export default function QuizPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .getActiveQuiz()
      .then((data) => setQuiz(data))
      .catch(() => setError("Could not load quiz. Please try again."));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 text-center px-4">{error}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 text-center">Loading…</p>
      </div>
    );
  }

  const questions: Question[] = quiz.questions;
  const total = questions.length;
  const question = questions[current];
  const isFirst = current === 0;
  const isLast = current === total - 1;

  function saveAndGo(nextIndex: number, currentAnswers: Record<number, number>) {
    setCurrent(nextIndex);
    setSelected(currentAnswers[questions[nextIndex].id] ?? null);
  }

  function handleBack() {
    if (isFirst) return;
    const updated = selected !== null ? { ...answers, [question.id]: selected } : answers;
    setAnswers(updated);
    saveAndGo(current - 1, updated);
  }

  async function handleNext() {
    if (selected === null) return;
    const nextAnswers = { ...answers, [question.id]: selected };
    setAnswers(nextAnswers);

    if (!isLast) {
      saveAndGo(current + 1, nextAnswers);
      return;
    }

    setSubmitting(true);
    try {
      const payload = Object.entries(nextAnswers).map(([qId, val]) => ({
        questionId: Number(qId),
        value: val,
      }));
      const result = await api.submitAttempt(quiz!.versionId, payload);
      localStorage.setItem("attemptToken", result.attemptToken);
      router.push("/register");
    } catch {
      setError("Failed to submit quiz. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-1 bg-[#2563eb] transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <header className="px-6 pt-4 pb-2">
        <BrainsMateLogo size={22} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-[#1a2340] text-center mb-10 leading-snug">
            {question.prompt}
          </h2>
          <div className="flex flex-col gap-3">
            {ANSWER_LABELS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelected(value)}
                className={`w-full py-4 px-6 rounded-2xl text-left font-medium text-base transition-all ${
                  selected === value
                    ? "border-2 border-[#2563eb] bg-[#eff6ff] text-[#1a2340]"
                    : "border border-transparent bg-[#f3f4f6] text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={handleBack}
            disabled={isFirst}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <span className="text-sm text-gray-500 font-medium">{current + 1}/{total}</span>

          <button
            onClick={handleNext}
            disabled={selected === null || submitting}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#2563eb] hover:text-[#2563eb] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-gray-300 border-t-[#2563eb] rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
