"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function hourToSijin(h: number): string {
  if (h === 23 || h === 0) return "자시";
  if (h >= 1 && h <= 2) return "축시";
  if (h >= 3 && h <= 4) return "인시";
  if (h >= 5 && h <= 6) return "묘시";
  if (h >= 7 && h <= 8) return "진시";
  if (h >= 9 && h <= 10) return "사시";
  if (h >= 11 && h <= 12) return "오시";
  if (h >= 13 && h <= 14) return "미시";
  if (h >= 15 && h <= 16) return "신시";
  if (h >= 17 && h <= 18) return "유시";
  if (h >= 19 && h <= 20) return "술시";
  return "해시";
}

function parseBirthDate(input: string): { year: number; month: number; day: number } | null {
  if (input.length !== 6) return null;
  const yy = parseInt(input.slice(0, 2), 10);
  const mm = parseInt(input.slice(2, 4), 10);
  const dd = parseInt(input.slice(4, 6), 10);
  if (isNaN(yy) || isNaN(mm) || isNaN(dd)) return null;
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const year = yy <= 30 ? 2000 + yy : 1900 + yy;
  return { year, month: mm, day: dd };
}

type AnalysisType = "love-count" | "solo-escape";

export default function LoveInputPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [birthDate, setBirthDate] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");
  const [knowsTime, setKnowsTime] = useState(true);
  const [analysisType, setAnalysisType] = useState<AnalysisType | "">("");
  const [pastLoveCount, setPastLoveCount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("사주를 펼치는 중...");

  const parsed = parseBirthDate(birthDate);

  const loadingMessages = [
    "사주를 펼치는 중...",
    "연애 기운을 분석하는 중...",
    "오행의 연애 패턴을 읽는 중...",
    "남은 인연을 계산하는 중...",
    "결과를 정리하는 중...",
  ];

  const handleSubmit = async (type: AnalysisType, loveCount?: number) => {
    if (!parsed) return;
    setLoading(true);

    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[msgIdx]);
    }, 1500);

    try {
      const res = await fetch("/api/analyze/love-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: parsed.year,
          month: parsed.month,
          day: parsed.day,
          hour: knowsTime && birthHour !== "" ? hourToSijin(Number(birthHour)) : null,
          pastLoveCount: loveCount ?? 0,
          analysisType: type,
        }),
      });

      if (!res.ok) throw new Error("분석 실패");
      const data = await res.json();

      sessionStorage.setItem("otannu-love-result", JSON.stringify({
        ...data,
        analysisType: type,
        pastLoveCount: loveCount ?? 0,
      }));
      router.push("/love/result");
    } catch {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);
    } finally {
      clearInterval(interval);
    }
  };

  const selectClass = "w-full h-14 px-4 rounded-xl bg-warm-surface border border-warm-border text-ink text-lg appearance-none focus:outline-none focus:border-purple-accent/50 focus:ring-2 focus:ring-purple-accent/10 transition-all";

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="absolute top-4 left-4 text-ink-muted hover:text-ink transition-colors p-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-5">
        <div className="text-center space-y-6 animate-fade-up">
          <div className="relative h-16 w-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-[3px] border-purple-accent/20" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-purple-accent animate-spin" />
          </div>
          <div className="space-y-2">
            <p key={loadingText} className="text-base font-medium text-ink animate-fade-up">
              {loadingText}
            </p>
            <p className="text-sm text-ink-faint">잠시만 기다려주세요</p>
          </div>
        </div>
      </main>
    );
  }

  // Step 1: 생년월일
  if (step === 1) {
    return (
      <main className="min-h-screen px-5 py-10">
        <div className="text-center space-y-3 mb-10 animate-fade-up">
          <BackButton onClick={() => router.back()} />
          <p className="text-purple-accent text-sm font-medium tracking-wider">STEP 1</p>
          <h1 className="text-[24px] font-bold text-ink">생년월일을 알려주세요</h1>
          <p className="text-[14px] text-ink-muted">양력 기준으로 입력해주세요</p>
        </div>

        <div className="space-y-6 animate-fade-up stagger-1">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-light">생년월일 (양력)</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value.replace(/\D/g, ""))}
              placeholder="예: 000712"
              className={selectClass}
            />
            {birthDate.length === 6 && !parsed && (
              <p className="text-sm text-red-400">올바른 생년월일을 입력해주세요</p>
            )}
          </div>
        </div>

        <div className="mt-10 pb-10 animate-fade-up stagger-3">
          <button
            onClick={() => setStep(2)}
            disabled={!parsed}
            className="w-full h-14 text-base font-bold rounded-2xl text-white shadow-xl transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: parsed ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "#333" }}
          >
            다음
          </button>
        </div>
      </main>
    );
  }

  // Step 2: 태어난 시간
  if (step === 2) {
    return (
      <main className="min-h-screen px-5 py-10">
        <div className="text-center space-y-3 mb-10 animate-fade-up">
          <BackButton onClick={() => setStep(1)} />
          <p className="text-purple-accent text-sm font-medium tracking-wider">STEP 2</p>
          <h1 className="text-[24px] font-bold text-ink">태어난 시간을 알려주세요</h1>
        </div>

        <div className="space-y-6 animate-fade-up stagger-1">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={birthHour}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                if (v === "" || (Number(v) >= 0 && Number(v) <= 23)) setBirthHour(v);
              }}
              placeholder="00"
              className={`${selectClass} text-center`}
            />
            <span className="text-lg font-medium text-ink shrink-0">시</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={birthMinute}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                if (v === "" || (Number(v) >= 0 && Number(v) <= 59)) setBirthMinute(v);
              }}
              placeholder="00"
              className={`${selectClass} text-center`}
            />
            <span className="text-lg font-medium text-ink shrink-0">분</span>
          </div>

          <button
            onClick={() => { setKnowsTime(false); setBirthHour(""); setBirthMinute(""); setStep(3); }}
            className="w-full text-left text-[15px] text-ink-muted hover:text-ink transition-colors flex items-center gap-1"
          >
            태어난 시간을 몰라요
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="mt-10 pb-10 animate-fade-up stagger-3">
          <button
            onClick={() => { setKnowsTime(true); setStep(3); }}
            disabled={birthHour === ""}
            className="w-full h-14 text-base font-bold rounded-2xl text-white shadow-xl transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: birthHour !== "" ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "#333" }}
          >
            다음
          </button>
        </div>
      </main>
    );
  }

  // Step 3: 타입 선택
  if (step === 3) {
    return (
      <main className="min-h-screen px-5 py-10">
        <div className="text-center space-y-3 mb-10 animate-fade-up">
          <BackButton onClick={() => setStep(2)} />
          <p className="text-purple-accent text-sm font-medium tracking-wider">STEP 3</p>
          <h1 className="text-[24px] font-bold text-ink">
            어떤 사주를 봐줄까?
          </h1>
          <p className="text-[14px] text-ink-muted">궁금한 걸 골라봐</p>
        </div>

        <div className="space-y-4 animate-fade-up stagger-1">
          {/* 남은 연애 횟수 */}
          <button
            onClick={() => { setAnalysisType("love-count"); setStep(4); }}
            className={`w-full text-left rounded-2xl border p-5 transition-all active:scale-[0.98] ${
              analysisType === "love-count"
                ? "border-purple-accent bg-purple-soft"
                : "border-warm-border bg-warm-card hover:border-purple-accent/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">💜</span>
              <div className="space-y-1">
                <p className="text-[16px] font-bold text-ink">남은 연애 횟수</p>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  나는 앞으로 몇번 더 연애를 하게 될지,<br />
                  3년 연애운은 어떤지<br />
                  그리고 만나면 안되는 유형을 알려줘요.
                </p>
              </div>
            </div>
          </button>

          {/* 솔로 탈출 시기 */}
          <button
            onClick={() => { setAnalysisType("solo-escape"); handleSubmit("solo-escape"); }}
            className={`w-full text-left rounded-2xl border p-5 transition-all active:scale-[0.98] ${
              analysisType === "solo-escape"
                ? "border-purple-accent bg-purple-soft"
                : "border-warm-border bg-warm-card hover:border-purple-accent/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">🔮</span>
              <div className="space-y-1">
                <p className="text-[16px] font-bold text-ink">솔로 탈출 시기</p>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  내가 올해 중 언제 솔로탈출 하게 될지 알려줘요.<br />
                  그리고 내 미래 남친은 어떻게 생겼는지<br />
                  어디서 만나게 될지도 알려줘요!
                </p>
              </div>
            </div>
          </button>
        </div>
      </main>
    );
  }

  // Step 4: 과거 연애 횟수 (남은 연애 횟수 선택 시에만)
  return (
    <main className="min-h-screen px-5 py-10">
      <div className="text-center space-y-3 mb-10 animate-fade-up">
        <BackButton onClick={() => setStep(3)} />
        <p className="text-purple-accent text-sm font-medium tracking-wider">STEP 4</p>
        <h1 className="text-[24px] font-bold text-ink">
          과거 연애 횟수를 알려주세요
        </h1>
        <p className="text-[14px] text-ink-muted">
          사귀지는 않았더라도 정말 마음을<br />주었던 인연도 카운트해서 입력해주세요
        </p>
      </div>

      <div className="space-y-6 animate-fade-up stagger-1">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-light">과거 연애 횟수</label>
          <select value={pastLoveCount} onChange={(e) => setPastLoveCount(e.target.value ? Number(e.target.value) : "")} className={selectClass}>
            <option value="">선택</option>
            {Array.from({ length: 21 }, (_, i) => (
              <option key={i} value={i}>{i}번</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 pb-10 animate-fade-up stagger-3">
        <button
          onClick={() => handleSubmit("love-count", Number(pastLoveCount))}
          disabled={pastLoveCount === ""}
          className="w-full h-14 text-base font-bold rounded-2xl text-white shadow-xl transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: pastLoveCount !== "" ? "linear-gradient(135deg, #8B5CF6, #EC4899)" : "#333" }}
        >
          결과 보기
        </button>
      </div>
    </main>
  );
}
