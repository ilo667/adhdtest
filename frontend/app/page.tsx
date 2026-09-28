import { type ReactNode } from "react";
import Link from "next/link";
import { BrainsMateLogo } from "../components/BrainIcon";

function BrainSVG() {
  return (
    <svg viewBox="0 0 140 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-36 h-36">
      <path d="M70 18 C75 12 92 11 103 20 C118 31 122 50 119 65 C117 76 112 84 104 88 C107 95 106 105 99 111 C92 117 82 116 77 111 C74 117 70 121 70 121" stroke="#60a5fa" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M70 18 C65 12 48 11 37 20 C22 31 18 50 21 65 C23 76 28 84 36 88 C33 95 34 105 41 111 C48 117 58 116 63 111 C66 117 70 121 70 121" stroke="#60a5fa" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <line x1="70" y1="18" x2="70" y2="121" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5"/>
      <path d="M90 32 C97 37 101 46 98 55" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M96 60 C103 66 104 76 101 84" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M50 32 C43 37 39 46 42 55" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M44 60 C37 66 36 76 39 84" stroke="#93c5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <circle cx="82" cy="24" r="2" fill="#93c5fd" opacity="0.6"/>
      <circle cx="104" cy="38" r="1.5" fill="#bfdbfe" opacity="0.8"/>
      <circle cx="112" cy="57" r="2" fill="#93c5fd" opacity="0.5"/>
      <circle cx="109" cy="74" r="1.5" fill="#bfdbfe" opacity="0.7"/>
      <circle cx="94" cy="95" r="2" fill="#93c5fd" opacity="0.6"/>
      <circle cx="58" cy="24" r="2" fill="#93c5fd" opacity="0.6"/>
      <circle cx="36" cy="38" r="1.5" fill="#bfdbfe" opacity="0.8"/>
      <circle cx="28" cy="57" r="2" fill="#93c5fd" opacity="0.5"/>
      <circle cx="31" cy="74" r="1.5" fill="#bfdbfe" opacity="0.7"/>
      <circle cx="46" cy="95" r="2" fill="#93c5fd" opacity="0.6"/>
      <circle cx="70" cy="14" r="2" fill="#bfdbfe" opacity="0.7"/>
      <circle cx="70" cy="112" r="1.5" fill="#93c5fd" opacity="0.6"/>
      <circle cx="115" cy="48" r="1.5" fill="#dbeafe" opacity="0.6"/>
      <circle cx="25" cy="48" r="1.5" fill="#dbeafe" opacity="0.6"/>
    </svg>
  );
}

function FloatingTag({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`absolute bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-[#1a2340] shadow-sm border border-gray-100 whitespace-nowrap ${className}`}>
      {children}
    </span>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center">
        <div className="self-start mb-8">
          <BrainsMateLogo size={26} />
        </div>

        {/* Brain visual with floating tags */}
        <div className="relative flex items-center justify-center w-full mb-8" style={{ height: 200 }}>
          <FloatingTag className="-left-2 top-8">High Productivity</FloatingTag>
          <FloatingTag className="-left-4 bottom-8">↘ -6% Focus</FloatingTag>
          <BrainSVG />
          <FloatingTag className="-right-2 top-8">↗ +10% Impulsivity</FloatingTag>
          <FloatingTag className="-right-4 bottom-8 text-[#2563eb]">Medium Distractions</FloatingTag>
        </div>

        <h1 className="text-3xl font-bold text-[#1a2340] text-center mb-3">
          Discover Your{" "}
          <span className="text-[#2563eb]">ADHD</span>{" "}
          Trait Profile
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
          Find out how ADHD traits influence your focus, energy, and daily life
        </p>

        <div className="flex gap-4 w-full">
          <Link href="/quiz" className="flex-1 text-center bg-[#1d7a6e] hover:bg-[#166560] text-white font-semibold py-4 rounded-xl transition-colors">
            Male
          </Link>
          <Link href="/quiz" className="flex-1 text-center bg-[#1d7a6e] hover:bg-[#166560] text-white font-semibold py-4 rounded-xl transition-colors">
            Female
          </Link>
        </div>

        <Link href="/login" className="mt-5 text-sm text-gray-400 hover:text-[#2563eb] transition-colors">
          Already have an account? Sign in
        </Link>
      </div>
    </main>
  );
}
