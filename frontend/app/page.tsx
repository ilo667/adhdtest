import React from "react";
import Image from "next/image";
import Link from "next/link";

function FloatingTag({ first, second, icon, paddingClass, className }: { first: string; second: string; icon?: string; paddingClass?: string; className?: string }) {
  return (
    <span
      className={`absolute flex flex-col rounded-[6px] sm:rounded-[10px] ${paddingClass ?? "px-[14px] py-[5px] sm:px-6 sm:py-[7px]"} border border-[#f1f4f7] whitespace-nowrap ${className ?? ""}`}
      style={{ background: "#f1f4f780" }}
    >
      {icon ? (
        <span className="flex items-center space-x-1 font-medium text-[12px] leading-[16px] sm:text-[20px] sm:leading-[28px]">
          <Image src={icon} alt="" width={24} height={24} aria-hidden className="w-[14px] sm:w-[24px]" />
          <span className="text-[#1066b9]">{first}</span>
          <span className="text-[#3b5779]">{second}</span>
        </span>
      ) : (
        <>
          <span className="font-medium text-[12px] leading-[16px] sm:text-[20px] sm:leading-[28px] text-[#1066b9]">{first}</span>
          <span className="font-medium text-[12px] leading-[16px] sm:text-[20px] sm:leading-[28px] text-[#3b5779]">{second}</span>
        </>
      )}
    </span>
  );
}

export default function LandingPage() {
  return (
    <main className="flex-1 flex items-start justify-center px-[19px] pt-4 sm:pt-[41px] pb-16">
      <div
        className="w-full max-w-[638px] bg-white rounded-[20px] border border-[#f1f4f7] px-4 py-8 sm:p-10 flex flex-col items-center"
        style={{ boxShadow: "0px 10px 22px 0px #8393a505, 0px 41px 41px 0px #8393a505, 0px 91px 55px 0px #8393a503, 0px 162px 65px 0px #8393a500, 0px 254px 71px 0px #8393a500" }}
      >
        <div className="relative flex items-center justify-center w-full mb-6 sm:mb-8 h-[223px] sm:h-[284px]">
          <FloatingTag first="High" second="Productivity" className="top-[59px] left-[-1px] sm:top-[39px]" />
          <FloatingTag first="-6%" second="Focus" icon="/arrow-down.svg" paddingClass="px-[6px] py-[4px] sm:px-[11px] sm:py-[7px]" className="top-[124px] left-[12px] sm:top-[163px] sm:left-[23px]" />
          <Image
            src="/head.png"
            alt="Head illustration"
            width={273}
            height={237}
            quality={100}
            className="w-[169px] sm:w-[273px]"
          />
          <FloatingTag first="+10%" second="Impulsivity" icon="/arrow-up.svg" paddingClass="px-[6px] py-[4px] sm:px-[11px] sm:py-[7px]" className="top-[33px] right-[-1px] sm:top-[5px]" />
          <FloatingTag first="Medium" second="Distractions" className="top-[137px] right-[-1px] sm:top-[185px] text-right" />
        </div>

        <div className="w-full sm:px-[33px]">
          <h1 className="font-semibold text-[24px] leading-[1.2] sm:text-[48px] sm:leading-[58px] text-[#04182c] text-center mb-5">
            Discover Your{" "}
            <span className="text-[#1066b9] block">ADHD Trait Profile</span>
          </h1>
          <p className="text-[16px] leading-[1.4] sm:text-[20px] sm:leading-[28px] text-[#1c2d3f] text-center mb-[38px] sm:mb-[40px]">
            Find out how ADHD traits influence your focus, energy, and daily life
          </p>

          <div className="flex space-x-4 w-full">
            {["Male", "Female"].map((label) => (
              <Link key={label} href="/quiz" className="flex-1 text-center bg-[#116a73] hover:bg-[#0d5a61] text-white font-medium text-[16px] leading-[22px] sm:text-[20px] sm:leading-[28px] py-[15px] sm:py-[14px] px-8 rounded-[8px] transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
