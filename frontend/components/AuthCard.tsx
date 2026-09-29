import { type ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8">
        {children}
      </div>
    </main>
  );
}