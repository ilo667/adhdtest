"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type AuthResponse } from "../../lib/api";
import { BrainsMateLogo } from "../../components/BrainIcon";

function ScoreGauge({ scorePercent }: { scorePercent: number }) {
  const cx = 100, cy = 92, r = 67, sw = 14;
  const clamped = Math.max(0, Math.min(100, Math.round(scorePercent)));

  const pt = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(rad)).toFixed(2)} ${(cy + r * Math.sin(rad)).toFixed(2)}`;
  };
  const arc = (a: number, b: number) => `M ${pt(a)} A ${r} ${r} 0 0 1 ${pt(b)}`;

  const segments = [
    { a: 183, b: 213, color: "#8CC9AD" },
    { a: 219, b: 249, color: "#A9C98C" },
    { a: 255, b: 285, color: "#DDCF64" },
    { a: 291, b: 321, color: "#E6AA42" },
    { a: 327, b: 357, color: "#E66642" },
  ];

  const needleAngle = 180 + (clamped / 100) * 180;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="22 15 156 84" className="w-52">
        <path d={arc(180, 358)} stroke="#e9eaec" strokeWidth={sw} fill="none" strokeLinecap="butt" />
        {segments.map((s, i) => (
          <path key={i} d={arc(s.a, s.b)} stroke={s.color} strokeWidth={sw} fill="none" strokeLinecap="round" />
        ))}
        <g transform={`translate(${cx}, ${cy}) rotate(${(needleAngle + 27.44).toFixed(2)}) scale(0.63) translate(0, -51.3102)`}>
          <path d="M83.821 7.86661C82.7085 6.12506 81.2451 4.58784 79.5145 3.34286C77.7839 2.09786 75.8201 1.16951 73.7352 0.610883C71.6504 0.0522536 69.4855 -0.125699 67.3642 0.087202C65.243 0.300095 63.2071 0.899665 61.3728 1.85163L0.000684707 51.3102L78.3291 28.3628C80.1646 27.4127 81.7628 26.1288 83.0323 24.5842C84.3018 23.0397 85.2178 21.2649 85.7279 19.3614C86.2379 17.4579 86.332 15.4629 86.0048 13.4905C85.6777 11.5182 84.9356 9.6071 83.821 7.86661Z" fill="#18334D" />
        </g>
        <circle cx={cx} cy={cy} r="5" fill="#18334D" />
      </svg>
      <p className="text-2xl font-bold text-[#04182c]">
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
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-gray-100">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-[#04182c]"
          >
            <span>{item.q}</span>
            <span className={`ml-4 flex-shrink-0 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center transition-transform ${open === i ? "rotate-180" : ""}`}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          {open === i && <p className="pb-4 text-sm text-gray-500 leading-relaxed">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="9" cy="9" r="8.5" stroke="#2a9d8f" strokeWidth="1"/>
      <path d="M5.5 9L7.5 11L12.5 7" stroke="#2a9d8f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BulletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-1">
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
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#04182c]">
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
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
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
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#04182c]">
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
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <p className="text-gray-400">Loading your report…</p>
      </div>
    );
  }

  if (!data?.latestAttempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4">
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

  const { result, score, max_score } = data.latestAttempt;
  const isHigh = result === "HIGH";
  const scorePercent = Math.round((score / max_score) * 100);

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <BrainsMateLogo size={22} />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#04182c] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>
      </header>

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

      <footer className="bg-[#04182c] px-6 py-8 mt-4">
        <div className="max-w-2xl mx-auto">
          <BrainsMateLogo size={22} white />
          <p className="text-gray-400 text-xs mt-3">All rights reserved 2026</p>
        </div>
      </footer>
    </div>
  );
}
