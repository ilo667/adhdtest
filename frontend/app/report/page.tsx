"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type AuthResponse } from "../../lib/api";
import { Footer } from "../../components/Footer";

function ScoreGauge({ scorePercent }: { scorePercent: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(scorePercent)));
  const blend = Math.max(0, (5 - Math.abs(clamped - 50)) / 5);
  const cx = 122 - 4 * blend, cy = 108;
  const needleAngle = 137.04 + (clamped / 100) * 265.92;
  const rotation = needleAngle - 158 + blend;

  return (
    <div className="flex flex-col items-center sm:pr-[98px]">
      <svg viewBox="0 0 241 194" className="w-[193px] sm:w-[240px]">
        <path d="M41.8286 182.677C25.1509 164.445 15.0098 140.368 15.0098 113.973C15.0098 57.0573 62.165 10.9177 120.334 10.9177C178.503 10.9177 225.658 57.0573 225.658 113.973C225.658 140.368 215.517 164.445 198.839 182.677" stroke="#c4d2e9" strokeWidth="21.8353" fill="none" strokeLinecap="round"/>
        <path d="M41.8286 182.677C25.1509 164.444 15.0098 140.368 15.0098 113.973C15.0098 108.21 15.4932 102.558 16.4224 97.0533" stroke="#8cc9ad" strokeWidth="21.8353" fill="none" strokeLinecap="round"/>
        <path d="M199.054 182.677C215.732 164.444 225.873 140.368 225.873 113.973C225.873 108.21 225.39 102.558 224.46 97.0533" stroke="#e66642" strokeWidth="21.8353" fill="none" strokeLinecap="round"/>
        <path d="M75.4062 20.7395C89.0348 14.4403 104.267 10.9177 120.339 10.9177C136.412 10.9177 151.644 14.4403 165.272 20.7395" stroke="#ddcf64" strokeWidth="21.8353" fill="none" strokeLinecap="round"/>
        <path d="M7.64885 85.4952L4.91524 96.0651L26.055 101.532L28.7886 90.9624L18.2188 88.2288L7.64885 85.4952ZM63.9777 26.5096L69.7364 35.7851L69.7364 35.7851L63.9777 26.5096ZM18.2188 88.2288L28.7886 90.9624C34.7446 67.9329 49.6258 48.2708 69.7364 35.7851L63.9777 26.5096L58.2191 17.2342C33.5218 32.5676 15.064 56.8236 7.64885 85.4952L18.2188 88.2288ZM63.9777 26.5096L69.7364 35.7851C72.8804 33.8331 76.1506 32.0578 79.5323 30.4734L74.9005 20.587L70.2686 10.7005C66.1094 12.6492 62.0869 14.8329 58.2191 17.2342L63.9777 26.5096Z" fill="#a9c98c"/>
        <path d="M232.539 85.4952L235.272 96.0651L214.132 101.532L211.399 90.9624L221.969 88.2288L232.539 85.4952ZM176.21 26.5096L170.451 35.7851L170.451 35.7851L176.21 26.5096ZM221.969 88.2288L211.399 90.9624C205.443 67.9329 190.562 48.2708 170.451 35.7851L176.21 26.5096L181.968 17.2342C206.666 32.5676 225.124 56.8236 232.539 85.4952L221.969 88.2288ZM176.21 26.5096L170.451 35.7851C167.307 33.8331 164.037 32.0578 160.655 30.4734L165.287 20.587L169.919 10.7005C174.078 12.6492 178.101 14.8329 181.968 17.2342L176.21 26.5096Z" fill="#e6aa42"/>
        <path d="M0.427734 96.7972L31.2148 100.038" stroke="#f0f2f5" strokeWidth="8.18825"/>
        <path d="M240.252 98.4177L209.465 101.658" stroke="#f0f2f5" strokeWidth="8.18825"/>
        <path d="M80.5078 36.5778L66.8544 8.79419" stroke="#f0f2f5" strokeWidth="8.18825"/>
        <path d="M160.857 36.5778L174.511 8.79419" stroke="#f0f2f5" strokeWidth="8.18825"/>
        <g transform={`translate(${cx}, ${cy}) rotate(${rotation.toFixed(2)}) scale(0.88) translate(-82, -18)`}>
          <path d="M83.821 7.86661C82.7085 6.12506 81.2451 4.58784 79.5145 3.34286C77.7839 2.09786 75.8201 1.16951 73.7352 0.610883C71.6504 0.0522536 69.4855 -0.125699 67.3642 0.087202C65.243 0.300095 63.2071 0.899665 61.3728 1.85163L0.000684707 51.3102L78.3291 28.3628C80.1646 27.4127 81.7628 26.1288 83.0323 24.5842C84.3018 23.0397 85.2178 21.2649 85.7279 19.3614C86.2379 17.4579 86.332 15.4629 86.0048 13.4905C85.6777 11.5182 84.9356 9.6071 83.821 7.86661Z" fill="#18334d"/>
        </g>
      </svg>
      <p className="[font-family:var(--font-geologica)] font-medium text-[19px] leading-[47px] text-[#304f6d] -mt-[43px] text-center sm:text-[24px] sm:leading-[58px] sm:-mt-[46px]">
        {clamped} / 100
      </p>
    </div>
  );
}

const HIGH_FAQS = [
  { q: "Does a high ADHD score mean I have ADHD?", a: "This score suggests significant ADHD traits, but an official diagnosis requires professional evaluation." },
  { q: "Can ADHD traits be strengths?", a: "Yes! Many people with high ADHD traits channel their energy into creativity, hyperfocus, and innovative thinking." },
  { q: "What strategies can help manage high ADHD traits?", a: "Structured routines, time-blocking, mindfulness, and working with a therapist or coach can make a significant difference." },
  { q: "Does this score mean I struggle with emotional regulation?", a: "High ADHD traits can make emotional regulation more challenging, but with awareness and coping tools, it is very manageable." },
  { q: "How can I stay organized with high ADHD traits?", a: "External systems like planners, reminders, and body doubling (working alongside others) often work better than willpower alone." },
  { q: "Can my ADHD trait levels change over time?", a: "Yes — trait levels can shift with life changes, stress, therapy, or lifestyle adjustments." },
];

const LOW_FAQS = [
  { q: "Does a low ADHD score mean I definitely don't have ADHD?", a: "A low score suggests minimal ADHD traits, but if you have concerns, a professional evaluation can provide a definitive answer." },
  { q: "Can I still benefit from brain training with low ADHD traits?", a: "Absolutely. Cognitive training, mindfulness, and healthy habits benefit everyone, regardless of ADHD trait levels." },
  { q: "What can I do to maintain my strong cognitive performance?", a: "Regular exercise, quality sleep, and challenging mental activities help sustain strong focus and memory over time." },
  { q: "Can my ADHD trait levels change over time?", a: "Yes — trait levels can shift with life changes, stress, or aging. Regular check-ins can be helpful." },
  { q: "Is a low score something to be proud of?", a: "A low score reflects strong self-regulation, though everyone faces different challenges. It's a useful data point, not a judgement." },
];

function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.q ?? null);
  return (
    <div>
      {items.map((item) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen(open === item.q ? null : item.q)}
            aria-expanded={open === item.q}
            className={`w-full flex items-center justify-between p-[8px] text-left cursor-pointer border-b border-[#e8edf2] sm:p-[12px] ${open === item.q ? "" : "mb-[11px] sm:mb-[15px]"}`}
          >
            <span className="[font-family:var(--font-geologica)] font-medium text-[18px] leading-[1.2] text-[#1c2d3f] sm:text-[24px] sm:leading-[26px]">{item.q}</span>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" className={`ml-4 flex-shrink-0 transition-transform w-6 h-6 sm:w-9 sm:h-9 ${open === item.q ? "rotate-180" : ""}`}>
              <rect x="0.5" y="0.5" width="35" height="35" rx="17.5" stroke="#b4cce3"/>
              <path d="M24 15.0246C24 14.9238 23.9602 14.8207 23.8828 14.7434C23.7281 14.5887 23.475 14.5887 23.3203 14.7434L18.0258 20.0379L12.8086 14.8207C12.6539 14.666 12.4008 14.666 12.2461 14.8207C12.0914 14.9754 12.0914 15.2285 12.2461 15.3832L17.7445 20.884C17.8992 21.0387 18.1523 21.0387 18.307 20.884L23.8828 15.3082C23.9625 15.2285 24 15.1277 24 15.0246Z" fill="#377ec1"/>
            </svg>
          </button>
          {open === item.q && <div className="pt-[11px] pb-[29px] px-[8px] sm:px-[12px] sm:pb-[32px]"><p className="text-[16px] leading-[22px] text-[#1c2d3f] max-w-[940px] sm:text-sm">{item.a}</p></div>}
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="flex-shrink-0">
      <rect width="28" height="28" rx="14" fill="#e6f2f2"/>
      <path d="M12.0007 16.7801L9.68741 14.4667C9.56276 14.3421 9.3937 14.272 9.21741 14.272C9.04113 14.272 8.87207 14.3421 8.74741 14.4667C8.62276 14.5914 8.55273 14.7604 8.55273 14.9367C8.55273 15.024 8.56993 15.1104 8.60333 15.1911C8.63673 15.2717 8.68569 15.345 8.74741 15.4067L11.5341 18.1934C11.7941 18.4534 12.2141 18.4534 12.4741 18.1934L19.5274 11.1401C19.6521 11.0154 19.7221 10.8463 19.7221 10.6701C19.7221 10.4938 19.6521 10.3247 19.5274 10.2001C19.4028 10.0754 19.2337 10.0054 19.0574 10.0054C18.8811 10.0054 18.7121 10.0754 18.5874 10.2001L12.0007 16.7801Z" fill="#13869a"/>
    </svg>
  );
}

function BulletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0 -ml-[4px] mr-[8px]">
      <circle cx="8" cy="8" r="4" fill="#b4cce3"/>
    </svg>
  );
}

function HighContent() {
  return (
    <>
      <section className="px-[19px] sm:px-6 pt-[40px] pb-[11px] sm:pb-[40px]">
        <div className="max-w-[1080px] mx-auto">
          <h3 className="font-semibold text-[20px] leading-[1.2] text-[#1c2d3f] mb-1 sm:font-medium sm:text-[32px] sm:leading-[36px]">Your Cognitive and Behavioral Strengths</h3>
          <p className="[font-family:var(--font-geologica)] font-light text-[16px] leading-[1.2] text-[#485664] mb-[20px] sm:mb-[36px] sm:text-sm">Despite these challenges, you possess real strengths:</p>
          <ul className="space-y-2.5">
            {[
              "Strong creative problem-solving abilities, adaptability, and enthusiasm",
              "Ability to think outside the box, offering innovative solutions others would not consider",
              "Highly energetic and passionate, bringing enthusiasm into projects and conversations",
              "Resilience — pushing forward despite setbacks",
              "Ability to hyperfocus on areas of interest can serve as a valuable asset when properly channeled",
            ].map((item) => (
              <li key={item} className="flex items-center space-x-3 font-medium text-[#485664] mb-[12px] sm:mb-[16px] sm:text-sm">
                <CheckIcon /> <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="px-[19px] sm:px-6 pt-[24px] pb-[40px]">
        <div className="max-w-[1080px] mx-auto">
          <h3 className="font-semibold text-[20px] leading-[1.2] text-[#1c2d3f] mb-[8px] sm:mb-1 sm:font-medium sm:text-[32px] sm:leading-[36px]">Your Emotional Regulation and Impulse Control</h3>
          <p className="[font-family:var(--font-geologica)] font-light text-[16px] leading-[1.2] text-[#485664] mb-[20px] sm:mb-[36px] sm:text-sm">Your high ADHD traits may significantly influence your emotional experiences and reactions. You may:</p>
          <ul className="space-y-2.5 mb-[36px]">
            {[
              "Experience intense emotional highs and lows, sometimes reacting impulsively",
              "Struggle with frustration and impatience, making it difficult to regulate emotions in stressful situations",
              "Feel overwhelmed by minor setbacks or unexpected changes",
              "Find it challenging to control impulsive behaviors such as interrupting conversations or making snap decisions",
            ].map((item) => (
              <li key={item} className="flex items-center space-x-2.5 text-[#485664] mb-[8px] sm:mb-[16px]">
                <BulletIcon /> {item}
              </li>
            ))}
          </ul>
          <p className="font-medium text-[16px] leading-[22px] text-[#1c2d3f] sm:text-sm">
            While emotional regulation may be difficult, learning self-awareness techniques and coping strategies can help create more emotional stability.
          </p>
        </div>
      </section>
    </>
  );
}

function LowContent() {
  return (
    <>
      <section className="px-[19px] sm:px-6 pt-[40px] pb-[11px] sm:pb-[40px]">
        <div className="max-w-[1080px] mx-auto">
          <h3 className="font-semibold text-[20px] leading-[1.2] text-[#1c2d3f] mb-1 sm:font-medium sm:text-[32px] sm:leading-[36px]">Your Cognitive and Behavioral Strengths</h3>
          <ul className="space-y-2.5">
            {[
              "Strong ability to sustain attention and complete tasks",
              "Consistent and reliable in personal and professional responsibilities",
              "Good impulse control and measured decision-making",
              "Effective time management and organizational skills",
            ].map((item) => (
              <li key={item} className="flex items-center space-x-3 font-medium text-[#485664] mb-[12px] sm:mb-[16px] sm:text-sm">
                <CheckIcon /> <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="px-[19px] sm:px-6 pt-[24px] pb-[40px]">
        <div className="max-w-[1080px] mx-auto">
          <h3 className="font-semibold text-[20px] leading-[1.2] text-[#1c2d3f] mb-[8px] sm:mb-3 sm:font-medium sm:text-[32px] sm:leading-[36px]">Your Emotional Regulation and Impulse Control</h3>
          <p className="text-gray-500 leading-relaxed">
            Your low ADHD traits suggest strong emotional regulation in most situations. You are generally able to manage stress, frustration, and unexpected changes without significant difficulty. Maintaining healthy routines and mindfulness practices can help preserve this stability.
          </p>
        </div>
      </section>
    </>
  );
}

export default function ReportPage() {
  const router = useRouter();
  const [data, setData] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let attemptToken: string | null = null;
    try { attemptToken = localStorage.getItem("attemptToken"); } catch { /* private mode */ }
    const load = attemptToken
      ? api.linkAttempt(attemptToken).then((res) => { try { localStorage.removeItem("attemptToken"); } catch { /* private mode */ } return res; })
      : api.getMe();
    load
      .then((res) => setData(res))
      .catch((err) => { if (err?.status === 401) router.push("/login"); })
      .finally(() => setLoading(false));
  }, [router]);

if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Loading your report…</p>
      </div>
    );
  }

  if (!data?.latestAttempt) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
          <p className="text-gray-500 mb-6">You haven&apos;t taken the quiz yet.</p>
          <button
            onClick={() => router.push("/quiz")}
            className="w-full bg-[#116a73] hover:bg-[#0d5a61] text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            Take the Test
          </button>
        </div>
      </div>
    );
  }

  const { result, score, maxScore } = data.latestAttempt;
  const isHigh = result === "HIGH";
  const scorePercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="flex-1 bg-white">
<div className="bg-[#f1f4f7] px-[19px] sm:px-6 pt-[40px] pb-[30px] sm:pb-[23px]">
        <div className="max-w-[1080px] mx-auto flex flex-col sm:flex-row items-center space-y-[45px] sm:space-y-0 sm:space-x-6">
          <div className="flex-1">
            <h1 className="font-semibold text-[24px] leading-[1.2] text-center text-[#1c2d3f] sm:text-[48px] sm:leading-[58px] sm:text-left -mt-[15px] sm:-mt-[16px]">Your ADHD score</h1>
            <p className="[font-family:var(--font-geologica)] font-medium text-[18px] leading-[1.2] text-center text-[#485664] mt-[5px] sm:mt-2 sm:text-[32px] sm:text-left">
              {isHigh ? "High ADHD Traits" : "Low ADHD Traits"}
            </p>
          </div>
          <ScoreGauge scorePercent={scorePercent} />
        </div>
      </div>

      <div className="px-[19px] sm:px-6 pt-[21px] pb-[20px] sm:py-[40px]">
        <div className="max-w-[1080px] mx-auto">
          <p className="font-medium sm:text-[20px] text-[#1c2d3f] max-w-[966px]">
            Your full assessment results include IQ score, cognitive strengths profile, worldwide percentile rankings, and an in-depth breakdown of performance.
          </p>
        </div>
      </div>

      <div className="px-[19px] sm:px-6 pt-0 pb-[8px] sm:pb-[40px]">
        <div className="max-w-[1080px] mx-auto">
          <div className="border-l-4 border-[#87b3dc] py-0 px-[8px] sm:py-[12px] sm:px-[16px]">
            <h3 className="font-semibold text-[20px] leading-[1.2] text-[#1c2d3f] mb-5 sm:font-medium sm:text-[32px] sm:leading-[36px]">Understanding Your Score</h3>
            <p className="text-[#485664] sm:leading-[28px]">
              {isHigh
                ? "Your score suggests that you exhibit high ADHD traits, meaning that attention difficulties, impulsivity, hyperactivity, and executive dysfunction significantly impact daily life. While these challenges can be frustrating, they are not insurmountable. Many individuals with high ADHD traits develop effective coping mechanisms that allow them to manage difficulties while harnessing their unique strengths."
                : "Your score suggests minimal ADHD traits. You show a strong ability to focus, self-regulate, and manage daily responsibilities. While occasional challenges may arise, they are unlikely to significantly impact your daily functioning."}
            </p>
          </div>
        </div>
      </div>

      {isHigh ? <HighContent /> : <LowContent />}

      <div className="px-[19px] sm:px-6 pt-[60px] pb-[106px]">
        <div className="max-w-[1080px] mx-auto">
          <h3 className="font-semibold text-[19px] leading-[1.2] text-center text-[#04182c] mb-[15px] px-[15px] sm:mb-[48px] sm:px-0 sm:font-medium sm:text-[32px] sm:leading-[36px]">Frequently asked questions</h3>
          <FaqAccordion items={isHigh ? HIGH_FAQS : LOW_FAQS} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
