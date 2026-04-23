"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      {/* Hero — payment-push style (mysterious single figure) */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full aspect-[3/4]">
          <img
            src="/hero/payment-push.png"
            alt="오탠누 사주"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          {/* Purple tint overlay for branding */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-accent/20 via-transparent to-transparent mix-blend-overlay" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 text-center space-y-3">
          <p className="text-sm font-medium text-white/50 tracking-widest uppercase">Otannu Saju</p>
          <h1 className="text-[34px] font-bold text-white leading-snug drop-shadow-lg">
            나, 혹시<br />
            <span className="text-rainbow">게이</span>일까?
          </h1>
          <p className="text-[16px] font-medium text-white/55 leading-relaxed">
            사주팔자로 알아보는<br />
            나의 게이 확률
          </p>
        </div>
      </div>

      <div className="px-5 pb-52">
        <div className="space-y-14 pt-10 animate-fade-up">

          {/* Social proof */}
          <div className="text-center space-y-3">
            <h2 className="text-[22px] font-bold text-ink">
              사주로 보는 <span className="text-purple-accent">게이 확률</span> 테스트
            </h2>
            <p className="text-[16px] text-ink-muted leading-relaxed">
              생년월일시만 입력하면<br />
              사주팔자 분석으로 게이 확률을 알려드려요
            </p>
          </div>

          {/* Feature cards — dark grid (itz-type style) */}
          <div className="space-y-5">
            <h2 className="text-[22px] font-bold text-ink text-center">
              이런 걸 알 수 있어요
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-2 rounded-2xl overflow-hidden relative min-h-[120px]">
                <img src="/features/gaydar.png" alt="게이 확률" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative p-4 flex flex-col justify-end h-full">
                  <p className="text-[18px] font-bold text-white">🌈 게이 확률은?</p>
                  <p className="text-[13px] text-white/70 mt-0.5">사주팔자가 말해주는 확률</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden relative min-h-[120px]">
                <img src="/features/dna.png" alt="오행 분석" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative p-3 flex flex-col justify-end h-full text-center">
                  <p className="text-[14px] font-bold text-white">🧬 오행<br/>분석</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden relative min-h-[120px]">
                <img src="/features/queen.png" alt="퀴어 기운" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative p-3 flex flex-col justify-end h-full text-center">
                  <p className="text-[14px] font-bold text-white">👑 퀴어<br/>기운</p>
                </div>
              </div>
              <div className="col-span-2 rounded-2xl overflow-hidden relative min-h-[120px]">
                <img src="/features/ideal-type.png" alt="사주 해설" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative p-4 flex flex-col justify-end h-full">
                  <p className="text-[18px] font-bold text-white">🔮 사주 해설</p>
                  <p className="text-[13px] text-white/70 mt-0.5">왜 이 확률이 나왔는지</p>
                </div>
              </div>
              <div className="col-span-3 rounded-2xl overflow-hidden relative min-h-[120px]">
                <img src="/features/crush.png" alt="공유하기" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative p-4 flex flex-col justify-end h-full">
                  <p className="text-[18px] font-bold text-white">📲 친구한테 공유하기</p>
                  <p className="text-[13px] text-white/70 mt-0.5">카카오톡, 트위터로 바로 공유</p>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="space-y-5">
            <h2 className="text-[22px] font-bold text-ink text-center">어떻게 하는 거예요?</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-2xl bg-warm-card border border-warm-border p-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-soft text-purple-accent text-sm font-bold shrink-0">1</span>
                <p className="text-[16px] text-ink">생년월일시를 입력해요</p>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-warm-card border border-warm-border p-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-soft text-purple-accent text-sm font-bold shrink-0">2</span>
                <p className="text-[16px] text-ink">AI가 사주팔자를 분석해요</p>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-warm-card border border-warm-border p-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-soft text-purple-accent text-sm font-bold shrink-0">3</span>
                <p className="text-[16px] text-ink">게이 확률과 해설을 알려드려요</p>
              </div>
            </div>
          </div>

          {/* Preview images */}
          <div className="space-y-5">
            <p className="text-center text-[16px] text-ink-muted">이런 결과를 받아볼 수 있어요 👇</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-warm-border">
                <img src="/preview/appearance.png" alt="결과 예시 1" className="w-full" />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-warm-border">
                <img src="/preview/personality.png" alt="결과 예시 2" className="w-full" />
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-2xl bg-warm-card border border-warm-border p-5 text-[14px] text-ink-muted leading-relaxed text-center">
            <p>이 서비스는 <span className="font-bold text-ink">100% 재미 목적</span>으로 제공됩니다.</p>
            <p className="mt-1">실제 성적 지향과는 아무런 관련이 없어요 😊</p>
          </div>

        </div>
      </div>

      {/* Floating bottom CTA */}
      <div className="fixed z-40 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px]">
        <div className="absolute -top-10 left-0 right-0 h-10 bg-gradient-to-t from-[#050505] to-transparent" />
        <div className="bg-[#050505] px-5 pb-2 pt-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}>
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
      <footer className="py-10 pb-28 text-center text-xs text-ink-faint space-y-2">
        <p>&copy; 2026 오탠누 사주</p>
      </footer>
    </main>
  );
}
