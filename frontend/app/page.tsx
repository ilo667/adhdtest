import { type ReactNode } from "react";
import Link from "next/link";
import { BrainsMateLogo } from "../components/BrainIcon";

function HeadSVG() {
  const sizes =    [1.0, 1.5, 0.8, 1.8, 1.2, 0.6, 2.0, 1.0, 1.4, 1.6, 0.7, 1.3];
  const opacities = [0.55, 0.75, 0.45, 0.85, 0.65, 0.4, 0.5, 0.7, 0.6, 0.8, 0.5, 0.65];
  const colors = ['#3b82f6','#60a5fa','#93c5fd','#2563eb','#60a5fa','#93c5fd','#3b82f6','#bfdbfe','#60a5fa','#3b82f6','#93c5fd','#60a5fa'];

  const dots: { x: number; y: number; r: number; op: number; fill: string }[] = [];
  let idx = 0;
  for (let row = 0; row < 23; row++) {
    const y = 22 + row * 9;
    const offset = (row % 2) * 4.5;
    for (let col = 0; col < 17; col++) {
      const x = 20 + offset + col * 8.5;
      dots.push({ x, y, r: sizes[idx % 12], op: opacities[idx % 12], fill: colors[idx % 12] });
      idx++;
    }
  }

  return (
    <svg viewBox="0 0 180 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-36 h-44">
      <defs>
        <clipPath id="headClip">
          {/* Human head + neck silhouette */}
          <path d="M90 18 C58 18 32 40 25 70 C18 100 26 134 44 154 C55 167 68 176 74 180 L74 208 C79 213 85 216 90 216 C95 216 101 213 106 208 L106 180 C112 176 125 167 136 154 C154 134 162 100 155 70 C148 40 122 18 90 18 Z"/>
        </clipPath>
      </defs>
      {/* Scattered exterior dots */}
      <circle cx="11" cy="62" r="1.5" fill="#93c5fd" opacity="0.3"/>
      <circle cx="169" cy="48" r="1.2" fill="#bfdbfe" opacity="0.35"/>
      <circle cx="6" cy="108" r="2" fill="#93c5fd" opacity="0.2"/>
      <circle cx="174" cy="118" r="1.5" fill="#bfdbfe" opacity="0.28"/>
      <circle cx="14" cy="85" r="1" fill="#bfdbfe" opacity="0.22"/>
      <circle cx="166" cy="145" r="1.3" fill="#93c5fd" opacity="0.25"/>
      <circle cx="20" cy="152" r="1" fill="#60a5fa" opacity="0.2"/>
      <circle cx="162" cy="72" r="1.2" fill="#bfdbfe" opacity="0.22"/>
      {/* Head dots clipped to head shape */}
      <g clipPath="url(#headClip)">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.fill} opacity={d.op}/>
        ))}
      </g>
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

        <div className="relative flex items-center justify-center w-full mb-8" style={{ height: 200 }}>
          <FloatingTag className="-left-2 top-8">High Productivity</FloatingTag>
          <FloatingTag className="-left-4 bottom-8">↘ -6% Focus</FloatingTag>
          <HeadSVG />
          <FloatingTag className="-right-2 top-8">↗ +10% Impulsivity</FloatingTag>
          <FloatingTag className="-right-4 bottom-8 text-[#2563eb]">Medium Distractions</FloatingTag>
        </div>

        <h1 className="text-3xl font-bold text-[#1a2340] text-center mb-3">
          Discover Your{" "}
          <span className="text-[#2563eb]">ADHD Trait Profile</span>
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
