"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-5 pt-20 pb-40">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0518] via-[#050505] to-[#050505]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-purple-accent/10 blur-[100px]" />

        <div className="relative z-10 text-center space-y-8 animate-fade-up">
          {/* Logo / Brand */}
          <div className="space-y-3">
            <p className="text-purple-accent text-sm font-medium tracking-widest uppercase">
              Otannu Saju
            </p>
            <h1 className="text-[36px] font-bold text-ink leading-tight">
              나, 혹시<br />
              <span className="text-rainbow">게이</span>일까?
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-[16px] text-ink-muted leading-relaxed">
            사주팔자로 알아보는<br />
            나의 게이 확률
          </p>

          {/* Fun tags */}
          <div className="flex flex-wrap justify-center gap-2 animate-fade-up stagger-2">
            {["사주", "오행", "음양", "게이더", "확률"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-soft text-purple-accent border border-purple-accent/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-ink-faint animate-fade-up stagger-3">
            * 100% 재미로 보는 사주 서비스입니다
          </p>
        </div>
      </div>

      {/* Floating bottom CTA */}
      <div className="fixed z-40 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent h-32 -top-10" />
        <div className="relative px-5 pb-8 pt-2" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
          <button
            onClick={() => router.push("/input")}
            className="w-full h-14 text-base font-bold rounded-2xl text-white shadow-xl transition-all active:scale-[0.97] glow-purple"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
            }}
          >
            내 게이 확률 알아보기
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-10 pb-28 text-center text-xs text-ink-faint space-y-2">
        <p>&copy; 2026 오탠누 사주</p>
      </footer>
    </main>
  );
}
