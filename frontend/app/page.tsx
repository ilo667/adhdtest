import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

function FloatingTag({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`absolute bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-[#04182c] shadow-sm border border-gray-100 whitespace-nowrap ${className}`}>
      {children}
    </span>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center">
        <div className="relative flex items-center justify-center w-full mb-8" style={{ height: 200 }}>
          <FloatingTag className="-left-2 top-8">High Productivity</FloatingTag>
          <FloatingTag className="-left-4 bottom-8">↘ -6% Focus</FloatingTag>
          <Image
            src="/head.png"
            alt="Head illustration"
            width={273}
            height={237}
            quality={100}
          />
          <FloatingTag className="-right-2 top-8">↗ +10% Impulsivity</FloatingTag>
          <FloatingTag className="-right-4 bottom-8 text-[#1066b9]">Medium Distractions</FloatingTag>
        </div>

        <h1 className="text-3xl font-bold text-[#04182c] text-center mb-3">
          Discover Your{" "}
          <span className="text-[#1066b9]">ADHD Trait Profile</span>
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
          Find out how ADHD traits influence your focus, energy, and daily life
        </p>

        <div className="flex gap-4 w-full">
          <Link href="/quiz" className="flex-1 text-center bg-[#116a73] hover:bg-[#0d5a61] text-white font-semibold py-4 rounded-xl transition-colors">
            Male
          </Link>
          <Link href="/quiz" className="flex-1 text-center bg-[#116a73] hover:bg-[#0d5a61] text-white font-semibold py-4 rounded-xl transition-colors">
            Female
          </Link>
        </div>

        <Link href="/login" className="mt-5 text-sm text-gray-400 hover:text-[#1066b9] transition-colors">
          Already have an account? Sign in
        </Link>
      </div>
    </main>
  );
}
