"use client";

import { useRouter } from "next/navigation";

export default function LoveLanding() {
  const router = useRouter();

  return (
    <main className="h-screen overflow-hidden">
      {/* Hero */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full aspect-[3/4]">
          <img
            src="/hero/payment-push.png"
            alt="오탠누 사주"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-accent/20 via-transparent to-transparent mix-blend-overlay" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 text-center space-y-3">
          <h1 className="text-[34px] font-bold text-white leading-snug drop-shadow-lg">
            남은 연애,<br />
            <span className="text-rainbow">몇 번</span>일까?
          </h1>
          <p className="text-[16px] font-medium text-white/55 leading-relaxed">
            사주로 남은 연애 횟수를<br />
            알 수 있대!
          </p>
        </div>
      </div>

      <div className="px-5 pb-52">
        <div className="space-y-14 pt-10 animate-fade-up">
          <div className="text-center space-y-3">
            <h2 className="text-[22px] font-bold text-ink">
              사주로 보는 <span className="text-purple-accent">남은 연애 횟수</span>
            </h2>
            <p className="text-[16px] text-ink-muted leading-relaxed">
              생년월일시 + MBTI만 입력하면<br />
              사주 분석으로 남은 연애 횟수를 알려드려요
            </p>
          </div>
        </div>
      </div>

      {/* Floating bottom CTA */}
      <div className="fixed z-40 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px]">
        <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="bg-[#050505] px-5 pb-2 pt-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
          <button
            onClick={() => router.push("/love/input")}
            className="w-full h-14 text-base font-bold rounded-2xl text-white shadow-xl transition-all active:scale-[0.97] glow-purple"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
            }}
          >
            내 남은 연애 횟수 알아보기
          </button>
        </div>
      </div>
    </main>
  );
}
