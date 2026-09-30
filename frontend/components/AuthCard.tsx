import { type ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 flex justify-center px-4">
      <div className="w-full max-w-[842px] px-8 pt-[82px]">
        {children}
      </div>
    </main>
  );
}