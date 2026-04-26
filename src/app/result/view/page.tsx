"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnalysisResult } from "@/modules/saju/types";

interface ResultData {
  saju: {
    년주: string;
    월주: string;
    일주: string;
    시주: string;
    오행: { 목: number; 화: number; 토: number; 금: number; 수: number };
  };
  result: AnalysisResult;
}

function ProbabilityCircle({ value }: { value: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // Color based on probability
  const getColor = (p: number) => {
    if (p >= 80) return "#EC4899"; // pink
    if (p >= 60) return "#8B5CF6"; // purple
    if (p >= 40) return "#6366F1"; // indigo
    return "#6B7280"; // gray
  };

  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={getColor(value)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            animation: "circular-fill 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
            filter: `drop-shadow(0 0 10px ${getColor(value)}40)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[48px] font-bold text-ink animate-count-up"
          style={{ animationDelay: "0.3s" }}
        >
          {value}
          <span className="text-[24px]">%</span>
        </span>
      </div>
    </div>
  );
}

function FiveElementsBar({ elements }: { elements: ResultData["saju"]["오행"] }) {
  const items = [
    { key: "목", label: "목(木)", color: "#22C55E", emoji: "🌳" },
    { key: "화", label: "화(火)", color: "#EF4444", emoji: "🔥" },
    { key: "토", label: "토(土)", color: "#EAB308", emoji: "🏔" },
    { key: "금", label: "금(金)", color: "#A1A1AA", emoji: "⚔️" },
    { key: "수", label: "수(水)", color: "#3B82F6", emoji: "💧" },
  ] as const;

  const max = Math.max(...Object.values(elements), 1);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.key} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
          <span className="text-lg w-6">{item.emoji}</span>
          <span className="text-xs text-ink-muted w-14">{item.label}</span>
          <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full animate-bar-fill"
              style={{
                width: `${(elements[item.key as keyof typeof elements] / max) * 100}%`,
                backgroundColor: item.color,
                animationDelay: `${0.5 + i * 0.1}s`,
              }}
            />
          </div>
          <span className="text-sm font-medium text-ink w-4 text-right">
            {elements[item.key as keyof typeof elements]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("otannu-result");
    if (!stored) {
      router.replace("/");
      return;
    }
    setData(JSON.parse(stored));
    // Delay content reveal for dramatic effect
    setTimeout(() => setShowContent(true), 300);
  }, [router]);

  if (!data) return null;

  const { saju, result } = data;

  const handleShareTwitter = () => {
    const text = `나의 게이 확률은 ${result.probability}%! 🌈\n\n오탠누 사주로 알아보기 👇`;
    const url = window.location.origin;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleShareKakao = () => {
    // Kakao SDK share - fallback to copy link if SDK not loaded
    if (typeof window !== "undefined" && window.Kakao?.Share) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "오탠누 사주 | 게이 확률 테스트",
          description: `나의 게이 확률은 ${result.probability}%!`,
          imageUrl: `${window.location.origin}/og-image.png`,
          link: {
            mobileWebUrl: window.location.origin,
            webUrl: window.location.origin,
          },
        },
        buttons: [
          {
            title: "나도 해보기",
            link: {
              mobileWebUrl: window.location.origin,
              webUrl: window.location.origin,
            },
          },
        ],
      });
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.origin);
      alert("링크가 복사되었습니다! 카카오톡에 붙여넣기 해주세요.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    alert("링크가 복사되었습니다!");
  };

  return (
    <main className="min-h-screen px-5 py-10 pb-32">
      {showContent && (
        <>
          {/* Header */}
          <div className="text-center space-y-2 mb-8 animate-fade-up">
            <p className="text-purple-accent text-sm font-medium tracking-wider">RESULT</p>
            <h1 className="text-[24px] font-bold text-ink">사주 분석 결과</h1>
          </div>

          {/* Probability Circle */}
          <div className="mb-8 animate-scale-reveal" style={{ animationDelay: "0.2s" }}>
            <p className="text-center text-sm text-ink-muted mb-4">나의 게이 확률은</p>
            <ProbabilityCircle value={result.probability} />
          </div>

          {/* Saju Details Card */}
          <div
            className="rounded-2xl bg-warm-card border border-warm-border p-5 mb-6 animate-card-reveal"
            style={{ animationDelay: "1s" }}
          >
            <h3 className="text-sm font-bold text-purple-accent mb-4">사주팔자</h3>
            <div className="grid grid-cols-4 gap-3 text-center mb-5">
              {[
                { label: "년주", value: saju.년주 },
                { label: "월주", value: saju.월주 },
                { label: "일주", value: saju.일주 },
                { label: "시주", value: saju.시주 },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-xs text-ink-faint">{item.label}</p>
                  <p className="text-lg font-bold text-ink">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Five Elements */}
            <h3 className="text-sm font-bold text-purple-accent mb-3">오행 분포</h3>
            <FiveElementsBar elements={saju.오행} />
          </div>

          {/* Explanation Card */}
          <div
            className="rounded-2xl bg-warm-card border border-warm-border p-5 mb-10 animate-card-reveal"
            style={{ animationDelay: "1.2s" }}
          >
            <h3 className="text-sm font-bold text-purple-accent mb-3">사주 해설</h3>
            <p className="text-[15px] text-ink-light leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* Disclaimer */}
          <p
            className="text-center text-xs text-ink-faint mb-8 animate-fade-up"
            style={{ animationDelay: "1.4s" }}
          >
            * 이 결과는 재미 목적으로만 제공됩니다
          </p>

          {/* Share Buttons */}
          <div
            className="space-y-3 animate-fade-up"
            style={{ animationDelay: "1.5s" }}
          >
            <button
              onClick={handleShareKakao}
              className="w-full h-13 text-base font-bold rounded-2xl bg-[#FEE500] text-[#191919] transition-all active:scale-[0.97]"
            >
              카카오톡으로 공유하기
            </button>
            <button
              onClick={handleShareTwitter}
              className="w-full h-13 text-base font-bold rounded-2xl bg-[#1DA1F2] text-white transition-all active:scale-[0.97]"
            >
              트위터로 공유하기
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full h-13 text-base font-bold rounded-2xl bg-warm-card border border-warm-border text-ink transition-all active:scale-[0.97]"
            >
              링크 복사하기
            </button>
          </div>

          {/* Try again CTA */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/input")}
              className="text-purple-accent text-sm font-medium hover:underline"
            >
              다시 해보기 &rarr;
            </button>
          </div>
        </>
      )}
    </main>
  );
}
