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
      <h1 className="text-2xl font-bold text-[#04182c] mb-1">Sign in</h1>
      <p className="text-gray-500 text-sm mb-6">
        Welcome back! Let&apos;s continue your learning journey
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          required
          className={`w-full border rounded-xl px-4 py-3 text-[#04182c] text-sm focus:outline-none transition-colors bg-[#f9fafb] ${
            error ? "border-[#d65050]" : "border-gray-200 focus:border-[#1066b9]"
          }`}
        />
        {error && <p className="text-[#aa3a3d] text-xs -mt-1">{error}</p>}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full border rounded-xl px-4 py-3 text-[#04182c] text-sm focus:outline-none transition-colors bg-[#f9fafb] ${
            error ? "border-[#d65050]" : "border-gray-200 focus:border-[#1066b9]"
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#116a73] hover:bg-[#0d5a61] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm mt-1"
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