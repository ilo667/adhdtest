"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { AuthCard } from "../../components/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(email, password);
      router.push("/report");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>
      <h1 className="[font-family:var(--font-geologica)] font-bold text-[48px] leading-[1.2] text-[#04182c] text-center mb-1">Sign in</h1>
      <p className="text-gray-500 text-sm mb-6">
        Welcome back! Let&apos;s continue your learning journey
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <label className="sr-only" htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          required
          className={`w-full border rounded-[8px] px-[12px] h-[52px] text-[#1c2d3f] placeholder:text-[#485664] focus:outline-none transition-colors font-medium text-[16px] leading-[22px] bg-white mb-[8px] sm:rounded-xl sm:px-4 sm:h-[56px] ${
            error ? "border-[#d65050]" : "border-[#b4cce3] focus:border-[#1066b9]"
          }`}
        />
        {error && <p className="text-[#aa3a3d] text-xs -mt-1">{error}</p>}
        <label className="sr-only" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full border rounded-[8px] px-[12px] h-[52px] text-[#1c2d3f] placeholder:text-[#485664] focus:outline-none transition-colors font-medium text-[16px] leading-[22px] bg-white mb-[8px] sm:rounded-xl sm:px-4 sm:h-[56px] ${
            error ? "border-[#d65050]" : "border-[#b4cce3] focus:border-[#1066b9]"
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#116a73] hover:bg-[#0d5a61] disabled:opacity-50 text-white font-medium text-[16px] leading-[16px] py-[16px] sm:py-[14px] px-[32px] rounded-[8px] transition-colors mt-1 cursor-pointer"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/" className="text-[#1066b9] hover:underline font-medium">
          Take the test
        </Link>
      </p>
    </AuthCard>
  );
}