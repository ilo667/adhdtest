"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { AuthCard } from "../../components/AuthCard";

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
      let attemptToken: string | undefined;
      try { attemptToken = localStorage.getItem("attemptToken") ?? undefined; } catch { /* private mode */ }
      await api.register(email, password, attemptToken);
      try { localStorage.removeItem("attemptToken"); } catch { /* private mode */ }
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
    <AuthCard>
      <h1 className="[font-family:var(--font-geologica)] font-bold text-[48px] leading-[1.2] text-[#04182c] mb-1">
        Discover your <span className="text-[#1066b9]">ADHD</span> Profile
      </h1>
      <p className="font-medium text-[20px] leading-[1.4] text-[#485664] text-center mb-6">
        {step === "email"
          ? "Enter your email to access your full report"
          : "Enter your password to access your full report"}
      </p>

      {step === "email" ? (
        <form onSubmit={handleEmailStep} className="flex flex-col space-y-3">
          <label className="sr-only" htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full border border-[#b4cce3] rounded-xl px-4 h-[56px] text-[#1c2d3f] placeholder:text-[#485664] focus:outline-none focus:border-[#1066b9] transition-colors bg-white"
          />
          <button
            type="submit"
            className="w-full bg-[#116a73] hover:bg-[#0d5a61] text-white font-medium text-[16px] leading-[16px] py-[14px] px-[32px] rounded-[8px] transition-colors"
          >
            Get My Results
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordStep} className="flex flex-col space-y-3">
          <label className="sr-only" htmlFor="register-email-readonly">Email</label>
          <input
            id="register-email-readonly"
            type="email"
            value={email}
            readOnly
            className="w-full border border-[#b4cce3] rounded-xl px-4 h-[56px] text-[#1c2d3f] bg-white cursor-not-allowed"
          />
          <label className="sr-only" htmlFor="register-password">Create Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoFocus
            className="w-full border border-[#b4cce3] rounded-xl px-4 h-[56px] text-[#1c2d3f] placeholder:text-[#485664] focus:outline-none focus:border-[#1066b9] transition-colors bg-white"
          />
          {error && <p className="text-[#aa3a3d] text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#116a73] hover:bg-[#0d5a61] disabled:opacity-50 text-white font-medium text-[16px] leading-[16px] py-[14px] px-[32px] rounded-[8px] transition-colors"
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

    </AuthCard>
  );
}