"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type QuizData } from "../../lib/api";

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
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-red-500 text-center px-4">{error}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-gray-400 text-center">Loading…</p>
      </div>
    );
  }

  const questions = quiz.questions;
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

    if (!quiz) return;
    setSubmitting(true);
    try {
      const payload = Object.entries(nextAnswers).map(([qId, val]) => ({
        questionId: Number(qId),
        value: val,
      }));
      const result = await api.submitAttempt(quiz.versionId, payload);
      try { localStorage.setItem("attemptToken", result.attemptToken); } catch { /* private mode */ }
      const loggedIn = await api.getMe().then(() => true).catch(() => false);
      router.push(loggedIn ? "/report" : "/register");
    } catch {
      setError("Failed to submit quiz. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 bg-white flex flex-col px-[70px]">
      {/* Progress bar */}
      <div className="w-full h-1 bg-[#f3f7fa] rounded-[4px]">
        <div
          className="h-1 bg-[#1066b9] rounded-[31px] transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center pt-[47px] px-4 pb-24">
        <div className="w-full max-w-2xl">
          <h2 className="font-medium text-[32px] leading-[36px] text-[#04182c] text-center mb-10">
            {question.prompt}
          </h2>
          <div className="flex flex-col space-y-3">
            {ANSWER_LABELS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelected(value)}
                className={`w-full py-4 px-6 rounded-[12px] text-left font-medium text-[20px] leading-[28px] transition-all cursor-pointer ${
                  selected === value
                    ? "border border-[#1066b9] bg-[#e5f5ff] text-[#04182c]"
                    : "border border-transparent bg-[#f3f7fa] text-[#04182c] hover:bg-gray-200"
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
            aria-label="Previous question"
            className="w-9 h-9 rounded-xl bg-[#f3f7fa] flex items-center justify-center text-gray-500 hover:text-[#1066b9] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: "scale(-1, 1)" }}>
              <path d="M4 12H16.25L11 6.75L11.66 6L18.16 12.5L11.66 19L11 18.25L16.25 13H4V12Z" fill="currentColor"/>
            </svg>
          </button>

          <span className="text-sm text-gray-500 font-medium">{current + 1}/{total}</span>

          <button
            onClick={handleNext}
            disabled={selected === null || submitting}
            aria-label="Next question"
            className="w-9 h-9 rounded-xl bg-[#f3f7fa] flex items-center justify-center text-gray-500 hover:text-[#1066b9] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-gray-300 border-t-[#1066b9] rounded-full animate-spin" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12H16.25L11 6.75L11.66 6L18.16 12.5L11.66 19L11 18.25L16.25 13H4V12Z" fill="currentColor"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
