"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleEmailStep(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStep("password");
  }

  async function handlePasswordStep(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const attemptToken = localStorage.getItem("attemptToken") ?? undefined;
      await api.register(email, password, attemptToken);
      localStorage.removeItem("attemptToken");
      router.push("/report");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg.toLowerCase().includes("already") || msg.toLowerCase().includes("conflict")
          ? "This email is already registered. Sign in instead."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#04182c] mb-1 leading-snug">
          Discover your <span className="text-[#1066b9]">ADHD</span> Profile
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {step === "email"
            ? "Enter your email to access your full report"
            : "Enter your password to access your full report"}
        </p>

        {step === "email" ? (
          <form onSubmit={handleEmailStep} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#04182c] text-sm focus:outline-none focus:border-[#1066b9] transition-colors bg-[#f9fafb]"
            />
            <button
              type="submit"
              className="w-full bg-[#116a73] hover:bg-[#0d5a61] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              Get My Results
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordStep} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              readOnly
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#04182c] text-sm bg-[#f9fafb] cursor-not-allowed"
            />
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#04182c] text-sm focus:outline-none focus:border-[#1066b9] transition-colors bg-[#f9fafb]"
            />
            {error && <p className="text-[#aa3a3d] text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#116a73] hover:bg-[#0d5a61] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              {loading ? "Creating account…" : "Get My Results"}
            </button>
            <button
              type="button"
              onClick={() => { setStep("email"); setError(""); }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Change email
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#1066b9] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
