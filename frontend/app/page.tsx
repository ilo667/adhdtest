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
    <main className="flex-1 flex items-center justify-center bg-[#F7F8FA] px-4 py-8">
      <div
        className="w-full max-w-[638px] bg-white rounded-[20px] border border-[#F1F4F7] p-10 flex flex-col items-center"
        style={{ boxShadow: "0px 10px 22px 0px #8393A505, 0px 41px 41px 0px #8393A505, 0px 91px 55px 0px #8393A503, 0px 162px 65px 0px #8393A500, 0px 254px 71px 0px #8393A500" }}
      >
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

        <h1 className="font-semibold text-[48px] leading-[58px] text-[#04182c] text-center mb-3">
          Discover Your{" "}
          <span className="text-[#1066b9]">ADHD Trait Profile</span>
        </h1>
        <p className="text-[20px] leading-[28px] text-gray-500 text-center mb-8">
          Find out how ADHD traits influence your focus, energy, and daily life
        </p>

        <div className="flex gap-4 w-full">
          {["Male", "Female"].map((label) => (
            <Link key={label} href="/quiz" className="flex-1 text-center bg-[#116a73] hover:bg-[#0d5a61] text-white font-medium text-[20px] leading-[28px] py-[14px] px-8 rounded-[8px] transition-colors">
              {label}
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
