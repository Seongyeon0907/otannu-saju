"use client";

import { useRouter } from "next/navigation";

const reviews = [
  { name: "s***", tag: "고마워💜", text: "재미로 해본건데 남은 연애 횟수가 3번이래요 ㅋㅋㅋㅋ 근데 지금까지 사귄 사람 수가 진짜 맞아서 소름돋았어요.. 이상형도 딱 제 전 애인이라 돈 아깝지 않았습니다ㅠㅠ" },
  { name: "ye**", tag: "재밌어😀", text: "와 ㅋㅋㅋㅋㅋㅋㅋ 남은 연애 횟수 5번 나왔는데 아직 한번도 안사귀어봤거든요..?" },
  { name: "m***", tag: "힘난다💪", text: "솔탈 시기 보고 왔는데 올해 안에 만난다고 해서 힘이 나네요.... 작년에도 비슷한거 봤엇는데 여기가 젤 자세하게 알려줘서 좋았어요 ㅎㅎ" },
  { name: "jh**", tag: "도움돼🍀", text: "절대 만나면 안되는 사람 유형 보고 소름돋음... 전 애인이랑 완전 똑같아서 진짜 울뻔했어요ㅠㅠ 미리 알았으면 안만났을텐데 다음엔 꼭 참고할게요" },
  { name: "p***", tag: "재밌어😀", text: "친구들이랑 같이 했는데 저만 연애 횟수 1번 남았대요 ㅋㅋㅋㅋㅋ 걔네는 다 3번 4번인데 저는 1번이라 약간 서럽긴한데 그 한번이 운명이면 좋겟다.." },
  { name: "k***", tag: "아쉬워🤔", text: "내용은 되게 좋았는데 좀 더 길었으면 좋겠어요... 맞는 부분도 있고 아닌 부분도 있어서 반반인듯?? 근데 이상형 부분은 찐으로 맞아서 놀랐음" },
  { name: "h***", tag: "고마워💜", text: "여태 봤던곳중에서 제일 정확했어요 ㅠㅠ 지금 좋아하는 사람이 있는데 그 사람 특징이랑 너무 비슷하게 나와서 용기내볼려구요.. 고마워요 진짜" },
  { name: "do**", tag: "힘난다💪", text: "아직 연애 안해봐서 몰겠지만 남은횟수 7번이래요 많은건가..?? 암튼 앞으로가 기대됩니다 ㅎㅎ" },
];

export default function LoveLanding() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-y-auto">
      {/* Hero */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full aspect-[3/4]">
          <img
            src="/hero/payment-push.png"
            alt="퀴어 사주"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-accent/20 via-transparent to-transparent mix-blend-overlay" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 text-center space-y-3">
          <h1 className="text-[60px] font-bold text-white leading-snug drop-shadow-lg" style={{ fontFamily: "'GraceSerif', serif" }}>
            이쪽 사주<br />
          </h1>
          <p className="text-[16px] font-medium text-white/55 leading-relaxed">
            사주광인 이쪽 개발자가 만든 게이 사주
          </p>
        </div>
      </div>

      {/* Reviews */}
      <div className="px-5 pt-8 pb-28">
        <div className="text-center space-y-2 mb-5">
          <p className="text-[14px] text-ink-muted">이미 사주를 본 <span className="text-purple-accent">738명</span>의 후기 중 일부</p>
        </div>
        <div className="relative h-[300px] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#050505] to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#050505] to-transparent z-10" />
          <div className="animate-review-scroll">
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} className="bg-warm-card rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-ink-muted">{r.name}</span>
                    <span className="text-[12px] bg-white/10 rounded-full px-2 py-0.5 text-ink-light">{r.tag}</span>
                  </div>
                  <span className="text-yellow-400 text-[14px]">★★★★★</span>
                </div>
                <p className="text-[14px] text-ink-light leading-relaxed">{r.text}</p>
              </div>
            ))}
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
            연애운 보러가기
          </button>
        </div>
      </div>
    </main>
  );
}
