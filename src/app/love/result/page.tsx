"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { LoveCountResult } from "@/modules/saju/types";

interface ResultData {
  saju: {
    년주: string;
    월주: string;
    일주: string;
    시주: string;
    오행: { 목: number; 화: number; 토: number; 금: number; 수: number };
  };
  result: LoveCountResult;
}

// ── Story slide definitions ──

interface Slide {
  title: string;
  render: (data: ResultData) => React.ReactNode;
}

function buildSlides(data: ResultData): Slide[] {
  const r = data.result;

  return [
    // 1. 총 연애 횟수
    {
      title: "총 연애 횟수",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <p className="text-ink-muted text-base">네 사주에 있는 총 연애 횟수는</p>
          <div className="relative">
            <span className="text-[96px] font-bold text-ink animate-count-up animate-number-glow">
              {r.totalLoveCount}
            </span>
            <span className="text-[32px] font-bold text-ink-muted ml-1">번</span>
          </div>
          <p className="text-ink-faint text-sm">사주팔자가 말해주는 숫자야</p>
        </div>
      ),
    },
    // 2. 남은 연애 횟수
    {
      title: "남은 연애 횟수",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <p className="text-ink-muted text-base">앞으로 남은 연애는</p>
          <div className="relative">
            <span className="text-[96px] font-bold text-purple-accent animate-count-up animate-number-glow">
              {r.remainingLoveCount}
            </span>
            <span className="text-[32px] font-bold text-ink-muted ml-1">번</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-faint">
            <span>전체 {r.totalLoveCount}번</span>
            <span className="w-1 h-1 rounded-full bg-ink-faint" />
            <span>사용 {r.totalLoveCount - r.remainingLoveCount}번</span>
          </div>
          {/* Mini progress bar */}
          <div className="w-48 h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full animate-bar-fill"
              style={{
                width: `${(r.remainingLoveCount / r.totalLoveCount) * 100}%`,
                background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
              }}
            />
          </div>
        </div>
      ),
    },
    // 3. 각 연애 예측
    {
      title: "연애 타임라인",
      render: () => {
        const pastCount = r.totalLoveCount - r.remainingLoveCount;
        return (
          <div className="flex flex-col h-full">
            <p className="text-ink-muted text-sm mb-4 text-center">내 사주에 있는 {r.totalLoveCount}번의 연애</p>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
              {r.eachLove.map((love, i) => {
                const isPast = love.순번 <= pastCount;
                return (
                  <div
                    key={love.순번}
                    className={`rounded-xl border p-4 transition-all animate-fade-up ${
                      isPast
                        ? "bg-white/[0.02] border-warm-border opacity-50"
                        : "bg-purple-soft border-purple-accent/20"
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isPast ? "bg-ink-ghost text-ink-faint" : "bg-purple-accent/20 text-purple-accent"
                      }`}>
                        {love.순번}번째
                      </span>
                      <span className={`text-sm font-bold ${isPast ? "text-ink-faint" : "text-ink"}`}>
                        {love.키워드}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isPast ? "text-ink-faint" : "text-ink-light"}`}>
                      {love.설명}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
    },
    // 4. 또래 비교
    {
      title: "또래 비교",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
            👥
          </div>
          <h3 className="text-xl font-bold text-ink text-center">또래에 비해서는...</h3>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.peerComparison}
          </p>
        </div>
      ),
    },
    // 5. MBTI 비교
    {
      title: "MBTI 비교",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
            🧠
          </div>
          <h3 className="text-xl font-bold text-ink text-center">같은 MBTI에 비해서는...</h3>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.mbtiComparison}
          </p>
        </div>
      ),
    },
    // 6. 연애 유형
    {
      title: "연애 유형",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
            💜
          </div>
          <h3 className="text-xl font-bold text-ink text-center">연애할 때 나의 유형</h3>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.datingStyle}
          </p>
        </div>
      ),
    },
    // 7. 주로 사용하는 기운
    {
      title: "주요 기운",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
            ✨
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-ink-muted">주로 사용하는 기운</p>
            <h3 className="text-2xl font-bold text-purple-accent">{r.mainEnergy.기운}</h3>
          </div>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.mainEnergy.설명}
          </p>
        </div>
      ),
    },
    // 8. 부족한 기운
    {
      title: "부족한 기운",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-3xl">
            🌙
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-ink-muted">부족한 기운</p>
            <h3 className="text-2xl font-bold text-ink-muted">{r.lackingEnergy.기운}</h3>
          </div>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.lackingEnergy.설명}
          </p>
        </div>
      ),
    },
    // 9. 피해야 할 사람
    {
      title: "이 사람은 피해",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-3xl">
            🚫
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-ink-muted">이런 사람은 피하자</p>
            <h3 className="text-xl font-bold text-red-400">{r.avoidType.유형}</h3>
          </div>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.avoidType.설명}
          </p>
        </div>
      ),
    },
    // 10. 만나야 할 사람
    {
      title: "이런 사람 만나",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-3xl">
            💚
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-ink-muted">너는 이런 사람을 만나야 해</p>
            <h3 className="text-xl font-bold text-green-400">{r.idealType.유형}</h3>
          </div>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.idealType.설명}
          </p>
        </div>
      ),
    },
    // 11. 3년간 연애운
    {
      title: "3년 연애운",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-5 px-2">
          <h3 className="text-xl font-bold text-ink text-center">앞으로 3년간의 연애운</h3>
          <div className="w-full space-y-3">
            {[r.threeYearForecast.year1, r.threeYearForecast.year2, r.threeYearForecast.year3].map(
              (forecast, i) => (
                <div
                  key={forecast.년도}
                  className="rounded-xl bg-warm-card border border-warm-border p-4 animate-fade-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <p className="text-sm font-bold text-purple-accent mb-1">{forecast.년도}년</p>
                  <p className="text-sm text-ink-light leading-relaxed">{forecast.운세}</p>
                </div>
              ),
            )}
          </div>
        </div>
      ),
    },
  ];
}

// ── Story progress bar ──

function StoryProgressBar({
  total,
  current,
  onSegmentClick,
}: {
  total: number;
  current: number;
  onSegmentClick: (idx: number) => void;
}) {
  return (
    <div className="flex gap-1 px-3 pt-3 pb-2">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onSegmentClick(i)}
          className="flex-1 h-[3px] rounded-full transition-all duration-300 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: i < current ? "100%" : i === current ? "100%" : "0%",
              background:
                i <= current
                  ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
                  : "transparent",
              opacity: i < current ? 0.5 : 1,
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ── Share slide ──

function ShareSlide({ result, onRetry }: { result: LoveCountResult; onRetry: () => void }) {
  const handleShareTwitter = () => {
    const text = `내 사주에 남은 연애는 ${result.remainingLoveCount}번! (총 ${result.totalLoveCount}번 중)\n\n오탠누 사주로 알아보기 👇`;
    const url = window.location.origin + "/love";
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const handleShareKakao = () => {
    if (typeof window !== "undefined" && window.Kakao?.Share) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "오탠누 사주 | 남은 연애 횟수",
          description: `내 남은 연애는 ${result.remainingLoveCount}번! (총 ${result.totalLoveCount}번)`,
          imageUrl: `${window.location.origin}/og-image.png`,
          link: {
            mobileWebUrl: window.location.origin + "/love",
            webUrl: window.location.origin + "/love",
          },
        },
        buttons: [
          {
            title: "나도 해보기",
            link: {
              mobileWebUrl: window.location.origin + "/love",
              webUrl: window.location.origin + "/love",
            },
          },
        ],
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + "/love");
      alert("링크가 복사되었습니다! 카카오톡에 붙여넣기 해주세요.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + "/love");
    alert("링크가 복사되었습니다!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-5 px-2">
      <div className="text-center space-y-2 animate-fade-up">
        <p className="text-sm text-ink-muted">결과를 친구에게 공유해보세요</p>
        <h3 className="text-2xl font-bold text-ink">
          남은 연애 <span className="text-purple-accent">{result.remainingLoveCount}번</span>
        </h3>
      </div>

      <div className="w-full space-y-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
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

      <button
        onClick={onRetry}
        className="text-purple-accent text-sm font-medium hover:underline mt-2"
      >
        다시 해보기 &rarr;
      </button>

      <p className="text-xs text-ink-faint text-center mt-4">
        * 이 결과는 재미 목적으로만 제공됩니다
      </p>
    </div>
  );
}

// ── Main page ──

export default function LoveResultPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  useEffect(() => {
    const stored = sessionStorage.getItem("otannu-love-result");
    if (!stored) {
      router.replace("/love");
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  const slides = data ? buildSlides(data) : [];
  const totalSlides = slides.length; // 11 content slides
  const isShareSlide = currentSlide >= totalSlides;

  const goTo = useCallback(
    (idx: number) => {
      const maxIdx = totalSlides; // last idx = share slide
      const clamped = Math.max(0, Math.min(maxIdx, idx));
      setDirection(clamped > currentSlide ? "next" : "prev");
      setCurrentSlide(clamped);
    },
    [currentSlide, totalSlides],
  );

  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width * 0.3) {
        goTo(currentSlide - 1);
      } else {
        goTo(currentSlide + 1);
      }
    },
    [currentSlide, goTo],
  );

  // Swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentSlide + 1);
      else goTo(currentSlide - 1);
    }
    setTouchStart(null);
  };

  if (!data) return null;

  return (
    <main className="h-screen flex flex-col bg-[#050505] overflow-hidden">
      {/* Progress bar */}
      <StoryProgressBar
        total={totalSlides + 1}
        current={currentSlide}
        onSegmentClick={goTo}
      />

      {/* Slide counter */}
      <div className="px-4 pb-2 flex items-center justify-between">
        <p className="text-xs text-ink-faint">
          {isShareSlide ? "공유" : slides[currentSlide].title}
        </p>
        <p className="text-xs text-ink-faint">
          {Math.min(currentSlide + 1, totalSlides + 1)} / {totalSlides + 1}
        </p>
      </div>

      {/* Story content area */}
      <div
        className="flex-1 relative px-5 pb-6 cursor-pointer select-none"
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          key={currentSlide}
          className={`absolute inset-0 px-5 pb-6 flex flex-col ${
            direction === "next" ? "animate-story-enter-next" : "animate-story-enter-prev"
          }`}
        >
          {isShareSlide ? (
            <ShareSlide
              result={data.result}
              onRetry={() => router.push("/love/input")}
            />
          ) : (
            slides[currentSlide].render(data)
          )}
        </div>
      </div>

      {/* Navigation hint */}
      <div className="px-5 pb-4 flex justify-between text-xs text-ink-ghost">
        {currentSlide > 0 ? <span>&larr; 이전</span> : <span />}
        {!isShareSlide ? <span>다음 &rarr;</span> : <span />}
      </div>
    </main>
  );
}
