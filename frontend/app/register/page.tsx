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
      <h1 className="font-bold text-[32px] leading-[1.1] text-heading text-center mb-[10px] sm:mb-[16px] sm:text-[48px] sm:leading-[1.2]">
        Discover your <span className="text-accent">ADHD</span> Profile
      </h1>
      <p className="font-medium text-[16px] leading-[1.4] text-muted text-center mb-[24px] sm:mb-[32px] sm:text-[20px]">
        {step === "email"
          ? "Enter your email to access your full report"
          : "Enter your password to access your full report"}
      </p>

      {step === "email" ? (
        <form onSubmit={handleEmailStep} className="flex flex-col space-y-3 sm:max-w-[440px] mx-auto">
          <label className="sr-only" htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full border border-line rounded-[8px] px-[12px] h-[52px] font-medium text-[16px] leading-[22px] text-body placeholder:text-muted focus:outline-none focus:border-accent transition-colors bg-white mb-[8px] sm:rounded-xl sm:px-4 sm:h-[56px]"
          />
          <button
            type="submit"
            className="w-full bg-teal hover:bg-teal-dark text-white font-medium text-[16px] leading-[16px] py-[16px] sm:py-[14px] px-[32px] rounded-[8px] transition-colors mt-[8px] cursor-pointer"
          >
            Get My Results
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordStep} className="flex flex-col space-y-3 sm:max-w-[440px] mx-auto">
          <label className="sr-only" htmlFor="register-email-readonly">Email</label>
          <input
            id="register-email-readonly"
            type="email"
            value={email}
            readOnly
            className="w-full border border-line rounded-[8px] px-[12px] h-[52px] font-medium text-[16px] leading-[22px] text-body bg-white cursor-not-allowed mb-[8px] sm:rounded-xl sm:px-4 sm:h-[56px]"
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
            className="w-full border border-line rounded-[8px] px-[12px] h-[52px] font-medium text-[16px] leading-[22px] text-body placeholder:text-muted focus:outline-none focus:border-accent transition-colors bg-white mb-[8px] sm:rounded-xl sm:px-4 sm:h-[56px]"
          />
          {error && <p className="text-danger text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal hover:bg-teal-dark disabled:opacity-50 text-white font-medium text-[16px] leading-[16px] py-[16px] sm:py-[14px] px-[32px] rounded-[8px] transition-colors mt-[8px] cursor-pointer"
          >
            {loading ? "Creating account…" : "Get My Results"}
          </button>
        </form>
      )}

    </AuthCard>
  );
}