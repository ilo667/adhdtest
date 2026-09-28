"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { BrainsMateLogo } from "../../components/BrainIcon";

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
    <main className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8">
        <div className="mb-8">
          <BrainsMateLogo size={22} />
        </div>

        <h1 className="text-2xl font-bold text-[#1a2340] mb-1">Sign in</h1>
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
            className={`w-full border rounded-xl px-4 py-3 text-[#1a2340] text-sm focus:outline-none transition-colors bg-[#f9fafb] ${
              error ? "border-red-400" : "border-gray-200 focus:border-[#2563eb]"
            }`}
          />
          {error && <p className="text-red-500 text-xs -mt-1">{error}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full border rounded-xl px-4 py-3 text-[#1a2340] text-sm focus:outline-none transition-colors bg-[#f9fafb] ${
              error ? "border-red-400" : "border-gray-200 focus:border-[#2563eb]"
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
          <Link href="/" className="text-[#2563eb] hover:underline font-medium">
            Take the test
          </Link>
        </p>
      </div>
    </main>
  );
}
