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
    일간오행: string;
    강약: string;
    십성분포: { 비겁: number; 식상: number; 재성: number; 관성: number; 인성: number };
    도화살: { count: number; positions: string[]; strength: string };
    십성목록: string[];
  };
  scores: { 매력지수: number; 연애운총점: number };
  matchedRules: string[];
  interpretations: {
    매력지수: { title: string; description: string }[];
    연애스타일: { title: string; description: string }[];
    이상형: { title: string; description: string }[];
    주의사항: { title: string; description: string }[];
  };
  result: LoveCountResult;
  pastLoveCount: number;
  analysisType?: "love-count" | "solo-escape";
  soloEscape?: {
    bestMonth: number;
    monthlyLuck: { month: number; score: number; description: string }[];
    futurePartner: { personality: string; meetingPlace: string; appearance: string };
    summary: string;
  };
}

// ── Story slide definitions ──

interface Slide {
  title: string;
  render: (data: ResultData) => React.ReactNode;
  paywall?: boolean;
}

// ── Shared lookup tables ──

const 오행이름: Record<string, string> = {
  목: '나무', 화: '불', 토: '흙', 금: '쇠', 수: '물',
};

const 십성설명: Record<string, string> = {
  '비견': '나와 같은 기운이야. 독립적이고 자존감이 강한 사람이야.',
  '겁재': '경쟁의 기운이야. 승부욕이 있고 적극적으로 움직이는 사람이야.',
  '식신': '표현의 기운이야. 창의적이고 감각이 뛰어난 사람이야.',
  '상관': '자유의 기운이야. 자유분방하고 예술적 감각이 돋보이는 사람이야.',
  '편재': '큰 재물의 기운이야. 통이 크고 돈 쓰는 걸 즐기는 사람이야.',
  '정재': '안정 재물의 기운이야. 꼼꼼하고 실속을 챙기는 사람이야.',
  '칠살': '권력의 기운이야. 카리스마가 있고 리더십이 강한 사람이야.',
  '정관': '정의의 기운이야. 원칙적이고 책임감이 강한 사람이야.',
  '편인': '독특한 학문의 기운이야. 남다른 사고방식을 가진 사람이야.',
  '정인': '마음이 어질고 생각이 깊으며 이해심이 많은 사람이야.',
};

const 일간성격: Record<string, string> = {
  목: '성장을 추구하고 자유를 존중하는 사람이야',
  화: '열정적이고 밝은 에너지로 주변을 환하게 만드는 사람이야',
  토: '안정적이고 믿음직한 존재감을 가진 사람이야',
  금: '기준이 확고하고 원칙을 중요시하는 사람이야',
  수: '감수성이 풍부하고 깊은 감정을 가진 사람이야',
};

// ── Shared slide helpers ──

function buildSajuAnalysisSlides(data: ResultData): Slide[] {
  const r = data.result;
  return [
    // Day master detail
    {
      title: '사주 분석',
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
            🌿
          </div>
          <h3 className="text-xl font-bold text-ink text-center">
            {오행이름[data.saju.일간오행] ?? data.saju.일간오행}의 기운을 가진<br />너는...
          </h3>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {일간성격[data.saju.일간오행] ?? '독특한 기운을 가진 사람이야'}
          </p>
        </div>
      ),
    },
    // Main energy
    {
      title: '주요 기운',
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
            ✨
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-ink-muted">{오행이름[data.saju.일간오행] ?? data.saju.일간오행}의 기운이 강해요</p>
            <h3 className="text-2xl font-bold text-purple-accent">{r.mainEnergy.기운}</h3>
          </div>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.mainEnergy.설명}
          </p>
        </div>
      ),
    },
    // 십성 overview
    {
      title: '십성 분석',
      render: () => (
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-bold text-ink text-center mb-4">네 사주에 있는 십성</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
            {data.saju.십성목록.map((name, i) => (
              <div
                key={name}
                className="rounded-xl bg-warm-card border border-warm-border p-4 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="text-sm font-bold text-purple-accent mb-1">{name}</p>
                <p className="text-sm text-ink-light leading-relaxed">
                  {십성설명[name] ?? '특별한 기운을 가지고 있어.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];
}

function buildEnergyDetailSlides(data: ResultData): Slide[] {
  const r = data.result;
  return [
    // Transition - deep dive
    {
      title: '심층 분석',
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
            🔍
          </div>
          <h3 className="text-xl font-bold text-ink text-center">좀 더 사주를 뜯어볼까?</h3>
          <p className="text-[15px] text-ink-light leading-relaxed text-center animate-fade-up">
            어떤 기운을 쓰는지,<br />어떤 기운이 부족한지 살펴보자
          </p>
        </div>
      ),
    },
    // Main energy detail
    {
      title: '주로 쓰는 기운',
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
            ✨
          </div>
          <h3 className="text-xl font-bold text-ink text-center">
            네가 주로 사용하는 기운은<br /><span className="text-purple-accent">{r.mainEnergy.기운}</span>이야
          </h3>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.mainEnergy.설명}
          </p>
        </div>
      ),
    },
    // Love pattern
    {
      title: '연애 패턴',
      render: () => {
        const firstStyle = data.interpretations.연애스타일?.[0];
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
            <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
              💜
            </div>
            <h3 className="text-lg font-bold text-ink text-center">
              이 기운을 잘 쓰는 사람들은<br />연애를 할 때 보통 이렇더라고
            </h3>
            {firstStyle && (
              <div className="rounded-xl bg-warm-card border border-warm-border p-4 w-full animate-fade-up">
                <p className="text-sm font-bold text-purple-accent mb-1">{firstStyle.title}</p>
                <p className="text-sm text-ink-light leading-relaxed">{firstStyle.description}</p>
              </div>
            )}
          </div>
        );
      },
    },
    // Lacking energy
    {
      title: '부족한 기운',
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
            너한테 부족한 기운은 <span className="font-bold">{r.lackingEnergy.기운}</span>이야
          </p>
        </div>
      ),
    },
    // Love difficulty
    {
      title: '연애 어려움',
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-3xl">
            🌙
          </div>
          <h3 className="text-lg font-bold text-ink text-center">
            {r.lackingEnergy.기운}이 부족한 사람들은<br />연애를 할 때 이런 어려움을<br />만나게 돼
          </h3>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.lackingEnergy.설명}
          </p>
        </div>
      ),
    },
  ];
}

function buildCompatibilitySlides(data: ResultData): Slide[] {
  const r = data.result;
  return [
    // Avoid type
    {
      title: '이 사람은 피해',
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-3xl">
            🚫
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-ink-muted">이런 사람은 피하면 좋아</p>
            <h3 className="text-xl font-bold text-red-400">{r.avoidType.유형}</h3>
          </div>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.avoidType.설명}
          </p>
        </div>
      ),
    },
    // Ideal type intro
    {
      title: '이런 사람 만나',
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-3xl">
            💚
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-ink-muted">너는 이런 사람을 만나야 할 것 같아</p>
            <h3 className="text-xl font-bold text-green-400">{r.idealType.유형}</h3>
          </div>
        </div>
      ),
    },
    // Ideal type reason
    {
      title: '만나야 하는 이유',
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-3xl">
            💚
          </div>
          <h3 className="text-xl font-bold text-green-400 text-center">{r.idealType.유형}</h3>
          <p className="text-[15px] text-ink-light leading-relaxed text-center">
            {r.idealType.설명}
          </p>
        </div>
      ),
    },
  ];
}

function buildForecastSlide(data: ResultData): Slide[] {
  const r = data.result;
  return [
    {
      title: '3년 연애운',
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

// ── Love Count slides (original flow) ──

function buildLoveCountSlides(data: ResultData): Slide[] {
  const r = data.result;
  const { pastLoveCount } = data;

  const slides: Slide[] = [];

  // Slide 1: Intro
  slides.push({
    title: '시작',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <h2 className="text-2xl font-bold text-ink text-center leading-snug animate-fade-up">
          너는 연애<br />몇번 더 하게 될까?
        </h2>
        <p className="text-[15px] text-ink-light text-center leading-relaxed animate-fade-up" style={{ animationDelay: '0.15s' }}>
          너의 사주와 네가 알려준 정보를<br />바탕으로 자세히 풀어줄게!
        </p>
      </div>
    ),
  });

  // Slide 2: Past love count
  slides.push({
    title: '과거 연애',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <p className="text-ink-muted text-base animate-fade-up">이전에</p>
        <div className="relative animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-[72px] font-bold text-ink">{pastLoveCount}</span>
          <span className="text-[28px] font-bold text-ink-muted ml-1">번</span>
        </div>
        <p className="text-ink-muted text-base animate-fade-up" style={{ animationDelay: '0.2s' }}>연애를 했다고?</p>
        <p className="text-ink-faint text-sm animate-fade-up" style={{ animationDelay: '0.3s' }}>
          그럼 앞으로 몇 번이나 연애를 더 하게 될까?
        </p>
      </div>
    ),
  });

  // Slide 3: Remaining count reveal
  slides.push({
    title: '남은 연애 횟수',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <p className="text-ink-muted text-base">남은 연애 횟수는...</p>
        <div className="relative">
          <span className="text-[96px] font-bold text-purple-accent animate-count-up animate-number-glow">
            {r.remainingLoveCount}
          </span>
          <span className="text-[32px] font-bold text-ink-muted ml-1">번</span>
        </div>
      </div>
    ),
  });

  // Slide 4: Total count
  slides.push({
    title: '총 연애 횟수',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <p className="text-ink-muted text-base">네 사주에 있는 총 연애 횟수야</p>
        <div className="relative">
          <span className="text-[96px] font-bold text-ink animate-count-up animate-number-glow">
            {r.totalLoveCount}
          </span>
          <span className="text-[32px] font-bold text-ink-muted ml-1">번</span>
        </div>
        {/* Progress bar: remaining / total */}
        <div className="w-full max-w-[240px] space-y-2">
          <div className="flex justify-between text-xs text-ink-faint">
            <span>사용 {r.totalLoveCount - r.remainingLoveCount}번</span>
            <span>남은 {r.remainingLoveCount}번</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full animate-bar-fill"
              style={{
                width: `${(r.remainingLoveCount / r.totalLoveCount) * 100}%`,
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              }}
            />
          </div>
        </div>
        <p className="text-[13px] text-ink-faint leading-relaxed text-center px-4">
          참고로 연애 횟수는 진짜 마음이 있었던 관계만 세고 있어.<br />
          여태까지 했던 연애 횟수와 다르다면 진심이 아니었거나,<br />
          아니면 인연을 그냥 흘려보낸 건 아닌지 한번 생각해보면 좋을 것 같다!
        </p>
      </div>
    ),
  });

  // Slide 5: Love timeline intro
  slides.push({
    title: '연애 타임라인',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
          💜
        </div>
        <p className="text-[15px] text-ink-light leading-relaxed text-center animate-fade-up">
          그럼 네 사주에 있는<br />
          <span className="text-purple-accent font-bold">{r.totalLoveCount}번</span>의 연애는<br />
          어떤 연애일지 한번 읽어줄게!
        </p>
      </div>
    ),
  });

  // ── PAYWALL STARTS FROM SLIDE 6 ──
  const freeCount = slides.length;

  // Slide 6: Love overview (good/bad grid)
  slides.push({
    title: '연애 한눈에 보기',
    render: () => (
      <div className="flex flex-col h-full">
        <p className="text-ink-muted text-sm mb-4 text-center">내 사주에 있는 {r.totalLoveCount}번의 연애</p>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 gap-2">
            {r.eachLove.map((love, i) => {
              const isPast = love.순번 <= pastLoveCount;
              return (
                <div
                  key={love.순번}
                  className={`rounded-xl border p-3 animate-fade-up ${
                    isPast
                      ? 'bg-white/[0.02] border-warm-border opacity-50'
                      : 'bg-purple-soft border-purple-accent/20'
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                    isPast ? 'bg-ink-ghost text-ink-faint' : 'bg-purple-accent/20 text-purple-accent'
                  }`}>
                    {love.순번}번째
                  </span>
                  <p className={`text-sm font-bold ${isPast ? 'text-ink-faint' : 'text-ink'}`}>
                    {love.키워드}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ),
  });

  // Slides 7..N: Individual love details (DYNAMIC)
  r.eachLove.forEach((love) => {
    const isPast = love.순번 <= pastLoveCount;
    slides.push({
      title: `${love.순번}번째 연애`,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full space-y-5 px-2">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            isPast ? 'bg-ink-ghost text-ink-faint' : 'bg-purple-accent/20 text-purple-accent'
          }`}>
            {love.순번}번째 연애 {isPast ? '(지나간 연애)' : '(다가올 연애)'}
          </span>
          <h3 className={`text-2xl font-bold text-center ${isPast ? 'text-ink-muted' : 'text-ink'}`}>
            {love.키워드}
          </h3>
          <p className={`text-[15px] leading-relaxed text-center ${isPast ? 'text-ink-faint' : 'text-ink-light'}`}>
            {love.설명}
          </p>
        </div>
      ),
    });
  });

  // Peer comparison
  slides.push({
    title: '또래 비교',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
          👥
        </div>
        <h3 className="text-xl font-bold text-ink text-center">또래에 비해서는...</h3>
        {/* Simple bar chart */}
        <div className="w-full space-y-4 px-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-ink-light">또래 평균</span>
              <span className="text-ink-muted font-bold">3~4번</span>
            </div>
            <div className="w-full h-6 rounded-lg bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-lg animate-bar-fill flex items-center justify-end pr-2"
                style={{ width: '45%', background: 'rgba(255,255,255,0.1)' }}
              >
                <span className="text-xs text-ink-faint">3~4</span>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-ink-light">나</span>
              <span className="text-purple-accent font-bold">{r.totalLoveCount}번</span>
            </div>
            <div className="w-full h-6 rounded-lg bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-lg animate-bar-fill flex items-center justify-end pr-2"
                style={{
                  width: `${Math.min((r.totalLoveCount / 10) * 100, 100)}%`,
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  animationDelay: '0.15s',
                }}
              >
                <span className="text-xs text-white font-bold">{r.totalLoveCount}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[15px] text-ink-light leading-relaxed text-center mt-2">
          {r.peerComparison}
        </p>
      </div>
    ),
  });

  // Compatibility transition
  slides.push({
    title: '궁합 분석',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
          🔮
        </div>
        <p className="text-[15px] text-ink-light leading-relaxed text-center animate-fade-up">
          이제 너와 잘 맞는 사람과<br />안 맞는 사람에 대해 알아보자
        </p>
      </div>
    ),
  });

  // Dating style summary
  slides.push({
    title: '연애 스타일',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
          💜
        </div>
        <h3 className="text-xl font-bold text-ink text-center">연애를 할 때 너는<br />어떤 사람인지 살펴볼게</h3>
        <p className="text-[15px] text-ink-light leading-relaxed text-center">
          {r.datingStyle}
        </p>
      </div>
    ),
  });

  // Shared helpers (all paywalled)
  slides.push(...buildSajuAnalysisSlides(data));
  slides.push(...buildEnergyDetailSlides(data));
  slides.push(...buildCompatibilitySlides(data));
  slides.push(...buildForecastSlide(data));

  // Set paywall flag on all slides after the free section
  for (let i = freeCount; i < slides.length; i++) {
    slides[i].paywall = true;
  }

  return slides;
}

// ── Solo Escape slides (new flow) ──

function buildSoloEscapeSlides(data: ResultData): Slide[] {
  const soloEscape = data.soloEscape;
  const slides: Slide[] = [];

  // 1. Intro (free)
  slides.push({
    title: '시작',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <h2 className="text-2xl font-bold text-ink text-center leading-snug animate-fade-up">
          솔로 탈출 시기를<br />알아볼게!
        </h2>
        <p className="text-[15px] text-ink-light text-center leading-relaxed animate-fade-up" style={{ animationDelay: '0.15s' }}>
          너의 사주를 분석해서<br />언제 솔로를 탈출하게 될지 알려줄게
        </p>
      </div>
    ),
  });

  // 2. Best Month Reveal (free)
  slides.push({
    title: '솔탈 가능성 가장 높은 달',
    render: () => {
      const bestMonth = soloEscape?.bestMonth;
      const bestMonthData = soloEscape?.monthlyLuck?.find((m) => m.month === bestMonth);
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
          <p className="text-ink-muted text-base">솔탈 가능성 가장 높은 달은...</p>
          <div className="relative">
            <span className="text-[96px] font-bold text-purple-accent animate-count-up animate-number-glow">
              {bestMonth}
            </span>
            <span className="text-[32px] font-bold text-ink-muted ml-1">월</span>
          </div>
          {bestMonthData && (
            <p className="text-[15px] text-ink-light leading-relaxed text-center">
              {bestMonthData.description}
            </p>
          )}
        </div>
      );
    },
  });

  // 3. Future Partner Transition (free)
  slides.push({
    title: '곧 만나게 될 사람',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
          💫
        </div>
        <h3 className="text-xl font-bold text-ink text-center animate-fade-up">
          곧 만나게 될 사람은<br />어떤 사람일까?
        </h3>
      </div>
    ),
  });

  // ── PAYWALL STARTS HERE ──
  const freeCount = slides.length;

  // 4. Partner Personality (paywall)
  slides.push({
    title: '만나게 될 사람의 성격',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
          🧠
        </div>
        <h3 className="text-xl font-bold text-ink text-center">만나게 될 사람의 성격</h3>
        <p className="text-[15px] text-ink-light leading-relaxed text-center">
          {soloEscape?.futurePartner?.personality}
        </p>
      </div>
    ),
  });

  // 5. Partner Meeting Place (paywall)
  slides.push({
    title: '어디서 만나게 될까?',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
          📍
        </div>
        <h3 className="text-xl font-bold text-ink text-center">어디서 만나게 될까?</h3>
        <p className="text-[15px] text-ink-light leading-relaxed text-center">
          {soloEscape?.futurePartner?.meetingPlace}
        </p>
      </div>
    ),
  });

  // 6. Partner Appearance (paywall)
  slides.push({
    title: '그 사람의 외모는?',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
          👤
        </div>
        <h3 className="text-xl font-bold text-ink text-center">그 사람의 외모는?</h3>
        <p className="text-[15px] text-ink-light leading-relaxed text-center">
          {soloEscape?.futurePartner?.appearance}
        </p>
      </div>
    ),
  });

  // 7. Compatibility (paywall)
  slides.push(...buildCompatibilitySlides(data));

  // 8. Monthly Chart (paywall)
  slides.push({
    title: '월별 연애운',
    render: () => {
      const monthlyLuck = soloEscape?.monthlyLuck ?? [];
      const bestMonth = soloEscape?.bestMonth;
      const maxScore = Math.max(...monthlyLuck.map((m) => m.score), 1);
      return (
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-bold text-ink text-center mb-4">월별로 보는 연애운</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-hide">
            {monthlyLuck.map((m, i) => {
              const isBest = m.month === bestMonth;
              const barWidth = (m.score / maxScore) * 100;
              return (
                <div
                  key={m.month}
                  className="flex items-center gap-3 animate-fade-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className={`text-sm w-8 text-right font-bold ${isBest ? 'text-purple-accent' : 'text-ink-muted'}`}>
                    {m.month}월
                  </span>
                  <div className="flex-1 h-7 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full animate-bar-fill"
                      style={{
                        width: `${barWidth}%`,
                        background: isBest
                          ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                  <span className={`text-sm w-8 font-bold ${isBest ? 'text-purple-accent' : 'text-ink-faint'}`}>
                    {m.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  });

  // 9. Saju analysis + energy (paywall)
  slides.push(...buildSajuAnalysisSlides(data));
  slides.push(...buildEnergyDetailSlides(data));

  // 10. 3-year forecast (paywall)
  slides.push(...buildForecastSlide(data));

  // 11. Summary (paywall)
  slides.push({
    title: '사주 해석 요약',
    render: () => (
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-2">
        <div className="w-16 h-16 rounded-full bg-purple-soft flex items-center justify-center text-3xl">
          📋
        </div>
        <h3 className="text-xl font-bold text-ink text-center">사주 해석 요약</h3>
        <p className="text-[15px] text-ink-light leading-relaxed text-center">
          {soloEscape?.summary}
        </p>
      </div>
    ),
  });

  // Set paywall flag on all slides after the free section
  for (let i = freeCount; i < slides.length; i++) {
    slides[i].paywall = true;
  }

  return slides;
}

// ── Main buildSlides dispatcher ──

function buildSlides(data: ResultData): Slide[] {
  if (data.analysisType === "solo-escape") {
    return buildSoloEscapeSlides(data);
  }
  return buildLoveCountSlides(data);
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
  const [paid, setPaid] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("otannu-love-result");
    if (!stored) {
      router.replace("/love");
      return;
    }
    setData(JSON.parse(stored));

    // 결제 후 리다이렉트 시 paid=true 파라미터 확인
    const url = new URL(window.location.href);
    if (url.searchParams.get("paid") === "true") {
      setPaid(true);
      // URL에서 파라미터 제거
      url.searchParams.delete("paid");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [router]);

  const handlePayment = async () => {
    if (!phone.replace(/-/g, "").match(/^01[0-9]{8,9}$/)) {
      alert("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentId = crypto.randomUUID();
      sessionStorage.setItem("otannu-payment-id", paymentId);

      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          phone,
          analysisType: data?.analysisType || "love-count",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "결제 요청 실패");
      }

      const { payurl } = await res.json();
      window.location.href = payurl;
    } catch (error) {
      alert(error instanceof Error ? error.message : "결제 요청 중 오류가 발생했습니다.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const slides = data ? buildSlides(data) : [];
  const totalSlides = slides.length;
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
        {(() => {
          const isPaywalled = !isShareSlide && slides[currentSlide]?.paywall && !paid;
          return (
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
                <div className="relative flex-1 flex flex-col">
                  <div className={isPaywalled ? "blur-md pointer-events-none select-none flex-1 flex flex-col" : "flex-1 flex flex-col"}>
                    {slides[currentSlide].render(data)}
                  </div>
                  {isPaywalled && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <div className="bg-[#050505]/80 backdrop-blur-sm rounded-2xl p-6 mx-4 text-center space-y-4 border border-warm-border">
                        <div className="w-12 h-12 rounded-full bg-purple-soft flex items-center justify-center text-2xl mx-auto">
                          🔒
                        </div>
                        <h3 className="text-lg font-bold text-ink">전체 결과를 확인해보세요</h3>
                        <p className="text-sm text-ink-muted">
                          결제 후 모든 사주 분석 결과를<br />확인할 수 있어요
                        </p>
                        {showPhoneInput ? (
                          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="휴대폰 번호 (01012345678)"
                              className="w-full h-12 px-4 rounded-xl bg-warm-surface border border-warm-border text-ink text-base text-center focus:outline-none focus:border-purple-accent/50"
                            />
                            <button
                              onClick={handlePayment}
                              disabled={paymentLoading}
                              className="w-full h-14 text-base font-bold rounded-2xl text-white shadow-xl transition-all active:scale-[0.97] disabled:opacity-50"
                              style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}
                            >
                              {paymentLoading ? "결제 준비 중..." : "13,900원 결제하기"}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPhoneInput(true);
                            }}
                            className="w-full h-14 text-base font-bold rounded-2xl text-white shadow-xl transition-all active:scale-[0.97]"
                            style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}
                          >
                            13,900원 결제하고 전체 결과 보기
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Navigation hint */}
      <div className="px-5 pb-4 flex justify-between text-xs text-ink-ghost">
        {currentSlide > 0 ? <span>&larr; 이전</span> : <span />}
        {!isShareSlide ? <span>다음 &rarr;</span> : <span />}
      </div>
    </main>
  );
}
