import React from "react";
import Image from "next/image";
import Link from "next/link";

function FloatingTag({ first, second, icon, style, className }: { first: string; second: string; icon?: string; style?: React.CSSProperties; className?: string }) {
  return (
    <span
      className={`absolute flex flex-col rounded-[10px] px-6 py-[7px] border border-[#F1F4F7] whitespace-nowrap ${className ?? ""}`}
      style={{ background: "#F1F4F780", ...style }}
    >
      {icon ? (
        <span className="flex items-center space-x-1 font-medium text-[12px] leading-[16px] sm:text-[20px] sm:leading-[28px]">
          <Image src={icon} alt="" width={24} height={24} aria-hidden className="w-[14px] sm:w-[24px]" />
          <span className="text-[#1066B9]">{first}</span>
          <span className="text-[#3B5779]">{second}</span>
        </span>
      ) : (
        <>
          <span className="font-medium text-[12px] leading-[16px] sm:text-[20px] sm:leading-[28px] text-[#1066B9]">{first}</span>
          <span className="font-medium text-[12px] leading-[16px] sm:text-[20px] sm:leading-[28px] text-[#3B5779]">{second}</span>
        </>
      )}
    </span>
  );
}

export default function LandingPage() {
  return (
    <main className="flex-1 flex items-start justify-center px-4 pt-4 sm:pt-[41px] pb-16">
      <div
        className="w-full max-w-[638px] bg-white rounded-[20px] border border-[#F1F4F7] px-4 py-8 sm:p-10 flex flex-col items-center"
        style={{ boxShadow: "0px 10px 22px 0px #8393A505, 0px 41px 41px 0px #8393A505, 0px 91px 55px 0px #8393A503, 0px 162px 65px 0px #8393A500, 0px 254px 71px 0px #8393A500" }}
      >
        <div className="relative flex items-center justify-center w-full mb-8 h-[223px] sm:h-[284px]">
          <FloatingTag first="High" second="Productivity" style={{ top: 39, left: -1 }} />
          <FloatingTag first="-6%" second="Focus" icon="/arrow-down.svg" style={{ top: 163, left: 23, padding: "7px 11px" }} />
          <Image
            src="/head.png"
            alt="Head illustration"
            width={273}
            height={237}
            quality={100}
          />
          <FloatingTag first="+10%" second="Impulsivity" icon="/arrow-up.svg" style={{ top: 5, right: -1, padding: '7px 11px' }} />
          <FloatingTag first="Medium" second="Distractions" style={{ top: 185, right: -1 }} className="text-right" />
        </div>

        <div className="w-full sm:px-[33px]">
          <h1 className="font-semibold text-[24px] leading-[1.2] sm:text-[48px] sm:leading-[58px] text-[#04182c] text-center mb-5">
            Discover Your{" "}
            <span className="text-[#1066b9] block">ADHD Trait Profile</span>
          </h1>
          <p className="text-[16px] leading-[1.4] sm:text-[20px] sm:leading-[28px] text-[#1C2D3F] text-center mb-[40px]">
            Find out how ADHD traits influence your focus, energy, and daily life
          </p>

          <div className="flex space-x-4 w-full">
            {["Male", "Female"].map((label) => (
              <Link key={label} href="/quiz" className="flex-1 text-center bg-[#116a73] hover:bg-[#0d5a61] text-white font-medium text-[16px] leading-[22px] sm:text-[20px] sm:leading-[28px] py-[14px] px-8 rounded-[8px] transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
