"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type AuthResponse } from "../../lib/api";

function ScoreGauge({ scorePercent }: { scorePercent: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(scorePercent)));
  const blend = Math.max(0, (5 - Math.abs(clamped - 50)) / 5);
  const cx = 122 - 4 * blend, cy = 108;
  const needleAngle = 137.04 + (clamped / 100) * 265.92;
  const rotation = needleAngle - 158 + blend;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 241 194" style={{ width: 240 }}>
        <path d="M41.8286 182.677C25.1509 164.445 15.0098 140.368 15.0098 113.973C15.0098 57.0573 62.165 10.9177 120.334 10.9177C178.503 10.9177 225.658 57.0573 225.658 113.973C225.658 140.368 215.517 164.445 198.839 182.677" stroke="#C4D2E9" strokeWidth="21.8353" fill="none" strokeLinecap="round"/>
        <path d="M41.8286 182.677C25.1509 164.444 15.0098 140.368 15.0098 113.973C15.0098 108.21 15.4932 102.558 16.4224 97.0533" stroke="#8CC9AD" strokeWidth="21.8353" fill="none" strokeLinecap="round"/>
        <path d="M199.054 182.677C215.732 164.444 225.873 140.368 225.873 113.973C225.873 108.21 225.39 102.558 224.46 97.0533" stroke="#E66642" strokeWidth="21.8353" fill="none" strokeLinecap="round"/>
        <path d="M75.4062 20.7395C89.0348 14.4403 104.267 10.9177 120.339 10.9177C136.412 10.9177 151.644 14.4403 165.272 20.7395" stroke="#DDCF64" strokeWidth="21.8353" fill="none" strokeLinecap="round"/>
        <path d="M7.64885 85.4952L4.91524 96.0651L26.055 101.532L28.7886 90.9624L18.2188 88.2288L7.64885 85.4952ZM63.9777 26.5096L69.7364 35.7851L69.7364 35.7851L63.9777 26.5096ZM18.2188 88.2288L28.7886 90.9624C34.7446 67.9329 49.6258 48.2708 69.7364 35.7851L63.9777 26.5096L58.2191 17.2342C33.5218 32.5676 15.064 56.8236 7.64885 85.4952L18.2188 88.2288ZM63.9777 26.5096L69.7364 35.7851C72.8804 33.8331 76.1506 32.0578 79.5323 30.4734L74.9005 20.587L70.2686 10.7005C66.1094 12.6492 62.0869 14.8329 58.2191 17.2342L63.9777 26.5096Z" fill="#A9C98C"/>
        <path d="M232.539 85.4952L235.272 96.0651L214.132 101.532L211.399 90.9624L221.969 88.2288L232.539 85.4952ZM176.21 26.5096L170.451 35.7851L170.451 35.7851L176.21 26.5096ZM221.969 88.2288L211.399 90.9624C205.443 67.9329 190.562 48.2708 170.451 35.7851L176.21 26.5096L181.968 17.2342C206.666 32.5676 225.124 56.8236 232.539 85.4952L221.969 88.2288ZM176.21 26.5096L170.451 35.7851C167.307 33.8331 164.037 32.0578 160.655 30.4734L165.287 20.587L169.919 10.7005C174.078 12.6492 178.101 14.8329 181.968 17.2342L176.21 26.5096Z" fill="#E6AA42"/>
        <path d="M0.427734 96.7972L31.2148 100.038" stroke="#f0f2f5" strokeWidth="8.18825"/>
        <path d="M240.252 98.4177L209.465 101.658" stroke="#f0f2f5" strokeWidth="8.18825"/>
        <path d="M80.5078 36.5778L66.8544 8.79419" stroke="#f0f2f5" strokeWidth="8.18825"/>
        <path d="M160.857 36.5778L174.511 8.79419" stroke="#f0f2f5" strokeWidth="8.18825"/>
        <g transform={`translate(${cx}, ${cy}) rotate(${rotation.toFixed(2)}) scale(0.88) translate(-82, -18)`}>
          <path d="M83.821 7.86661C82.7085 6.12506 81.2451 4.58784 79.5145 3.34286C77.7839 2.09786 75.8201 1.16951 73.7352 0.610883C71.6504 0.0522536 69.4855 -0.125699 67.3642 0.087202C65.243 0.300095 63.2071 0.899665 61.3728 1.85163L0.000684707 51.3102L78.3291 28.3628C80.1646 27.4127 81.7628 26.1288 83.0323 24.5842C84.3018 23.0397 85.2178 21.2649 85.7279 19.3614C86.2379 17.4579 86.332 15.4629 86.0048 13.4905C85.6777 11.5182 84.9356 9.6071 83.821 7.86661Z" fill="#18334D"/>
        </g>
      </svg>
      <p className="text-2xl font-bold text-[#04182c] -mt-4">
        {clamped}{" "}<span className="text-gray-400 text-lg font-normal">/ 100</span>
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
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen(open === item.q ? null : item.q)}
            aria-expanded={open === item.q}
            className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-[#04182c]"
          >
            <span>{item.q}</span>
            <span className={`ml-4 flex-shrink-0 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center transition-transform ${open === item.q ? "rotate-180" : ""}`}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          {open === item.q && <p className="pb-4 text-sm text-gray-500 leading-relaxed">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="flex-shrink-0 mt-0.5">
      <circle cx="9" cy="9" r="8.5" stroke="#2a9d8f" strokeWidth="1"/>
      <path d="M5.5 9L7.5 11L12.5 7" stroke="#2a9d8f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BulletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0 mt-1">
      <circle cx="8" cy="8" r="3" fill="#9ca3af"/>
    </svg>
  );
}

function HighContent() {
  return (
    <>
      <section className="px-6 py-8 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#04182c] mb-3">Your Cognitive and Behavioral Strengths</h2>
        <p className="text-sm text-gray-500 mb-4">Despite these challenges, you possess real strengths:</p>
        <ul className="space-y-2.5">
          {[
            "Strong creative problem-solving abilities, adaptability, and enthusiasm",
            "Ability to think outside the box, offering innovative solutions others would not consider",
            "Highly energetic and passionate, bringing enthusiasm into projects and conversations",
            "Resilience — pushing forward despite setbacks",
            "Ability to hyperfocus on areas of interest can serve as a valuable asset when properly channeled",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-[#04182c]">
              <CheckIcon /> {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="px-6 py-8 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#04182c] mb-2">Your Emotional Regulation and Impulse Control</h2>
        <p className="text-sm text-gray-500 mb-4">Your high ADHD traits may significantly influence your emotional experiences and reactions. You may:</p>
        <ul className="space-y-2.5 mb-4">
          {[
            "Experience intense emotional highs and lows, sometimes reacting impulsively",
            "Struggle with frustration and impatience, making it difficult to regulate emotions in stressful situations",
            "Feel overwhelmed by minor setbacks or unexpected changes",
            "Find it challenging to control impulsive behaviors such as interrupting conversations or making snap decisions",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-gray-500">
              <BulletIcon /> {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500 italic">
          While emotional regulation may be difficult, learning self-awareness techniques and coping strategies can help create more emotional stability.
        </p>
      </section>
    </>
  );
}

function LowContent() {
  return (
    <>
      <section className="px-6 py-8 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#04182c] mb-4">Your Cognitive and Behavioral Strengths</h2>
        <ul className="space-y-2.5">
          {[
            "Strong ability to sustain attention and complete tasks",
            "Consistent and reliable in personal and professional responsibilities",
            "Good impulse control and measured decision-making",
            "Effective time management and organizational skills",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-[#04182c]">
              <CheckIcon /> {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="px-6 py-8 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#04182c] mb-3">Your Emotional Regulation and Impulse Control</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Your low ADHD traits suggest strong emotional regulation in most situations. You are generally able to manage stress, frustration, and unexpected changes without significant difficulty. Maintaining healthy routines and mindfulness practices can help preserve this stability.
        </p>
      </section>
    </>
  );
}

export default function ReportPage() {
  const router = useRouter();
  const [data, setData] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const attemptToken = localStorage.getItem("attemptToken");
    const load = attemptToken
      ? api.linkAttempt(attemptToken).then((res) => { localStorage.removeItem("attemptToken"); return res; })
      : api.getMe();
    load
      .then((res) => setData(res))
      .catch((err) => { if (err?.status === 401) router.push("/login"); })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    await api.logout().catch(() => {});
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
        <p className="text-gray-400">Loading your report…</p>
      </div>
    );
  }

  if (!data?.latestAttempt) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f0f2f5] px-4">
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
  const scorePercent = Math.round((score / maxScore) * 100);

  return (
    <div className="flex-1 bg-white">
      <div className="flex justify-end px-6 py-2 border-b border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#04182c] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>
      </div>

      <div className="bg-[#f0f2f5] px-6 py-8">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#04182c]">Your ADHD score</h1>
            <p className="text-[#1066b9] font-semibold text-lg mt-1">
              {isHigh ? "High ADHD Traits" : "Low ADHD Traits"}
            </p>
          </div>
          <ScoreGauge scorePercent={scorePercent} />
        </div>
      </div>

      <div className="px-6 py-6 border-b border-gray-100 max-w-2xl mx-auto w-full">
        <p className="text-sm text-gray-500 leading-relaxed">
          Your full assessment results include IQ score, cognitive strengths profile, worldwide percentile rankings, and an in-depth breakdown of performance.
        </p>
      </div>

      <div className="px-6 py-6 border-b border-gray-100 max-w-2xl mx-auto w-full">
        <div className="border-l-4 border-[#1066b9] pl-4">
          <h2 className="text-base font-bold text-[#04182c] mb-2">Understanding Your Score</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {isHigh
              ? "Your score suggests that you exhibit high ADHD traits, meaning that attention difficulties, impulsivity, hyperactivity, and executive dysfunction significantly impact daily life. While these challenges can be frustrating, they are not insurmountable. Many individuals with high ADHD traits develop effective coping mechanisms that allow them to manage difficulties while harnessing their unique strengths."
              : "Your score suggests minimal ADHD traits. You show a strong ability to focus, self-regulate, and manage daily responsibilities. While occasional challenges may arise, they are unlikely to significantly impact your daily functioning."}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        {isHigh ? <HighContent /> : <LowContent />}

        <section className="px-6 py-8 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#04182c] text-center mb-6">Frequently asked questions</h2>
          <FaqAccordion items={isHigh ? HIGH_FAQS : LOW_FAQS} />
        </section>

      </div>

    </div>
  );
}
