"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 시진목록 } from "@/modules/saju/constants";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 80 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export default function InputPage() {
  const router = useRouter();
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");
  const [hour, setHour] = useState<string>("모름");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("사주를 펼치는 중...");

  const days = year && month
    ? Array.from({ length: getDaysInMonth(Number(year), Number(month)) }, (_, i) => i + 1)
    : Array.from({ length: 31 }, (_, i) => i + 1);

  const isValid = year !== "" && month !== "" && day !== "";

  const loadingMessages = [
    "사주를 펼치는 중...",
    "천간지지를 분석하는 중...",
    "오행의 기운을 읽는 중...",
    "게이더를 가동하는 중...",
    "결과를 정리하는 중...",
  ];

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);

    // Cycle through loading messages
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[msgIdx]);
    }, 1500);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: Number(year),
          month: Number(month),
          day: Number(day),
          hour: hour === "모름" ? null : hour,
        }),
      });

      if (!res.ok) throw new Error("분석 실패");
      const data = await res.json();

      // Store result in sessionStorage and navigate
      sessionStorage.setItem("otannu-result", JSON.stringify(data));
      router.push("/result/view");
    } catch {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
      setLoading(false);
    } finally {
      clearInterval(interval);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-5">
        <div className="text-center space-y-6 animate-fade-up">
          <div className="relative h-16 w-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-[3px] border-purple-accent/20" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-purple-accent animate-spin" />
          </div>
          <div className="space-y-2">
            <p
              key={loadingText}
              className="text-base font-medium text-ink animate-fade-up"
            >
              {loadingText}
            </p>
            <p className="text-sm text-ink-faint">잠시만 기다려주세요</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-10">
      {/* Header */}
      <div className="text-center space-y-3 mb-10 animate-fade-up">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 text-ink-muted hover:text-ink transition-colors p-2"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <p className="text-purple-accent text-sm font-medium tracking-wider">STEP 1</p>
        <h1 className="text-[24px] font-bold text-ink">
          생년월일시를 알려주세요
        </h1>
        <p className="text-[14px] text-ink-muted">
          양력 기준으로 입력해주세요
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6 animate-fade-up stagger-1">
        {/* 년도 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-light">태어난 년도</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-14 px-4 rounded-xl bg-warm-surface border border-warm-border text-ink text-lg appearance-none focus:outline-none focus:border-purple-accent/50 focus:ring-2 focus:ring-purple-accent/10 transition-all"
          >
            <option value="">선택</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
        </div>

        {/* 월 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-light">태어난 월</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-14 px-4 rounded-xl bg-warm-surface border border-warm-border text-ink text-lg appearance-none focus:outline-none focus:border-purple-accent/50 focus:ring-2 focus:ring-purple-accent/10 transition-all"
          >
            <option value="">선택</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
        </div>

        {/* 일 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-light">태어난 일</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value ? Number(e.target.value) : "")}
            className="w-full h-14 px-4 rounded-xl bg-warm-surface border border-warm-border text-ink text-lg appearance-none focus:outline-none focus:border-purple-accent/50 focus:ring-2 focus:ring-purple-accent/10 transition-all"
          >
            <option value="">선택</option>
            {days.map((d) => (
              <option key={d} value={d}>{d}일</option>
            ))}
          </select>
        </div>

        {/* 시간 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-light">태어난 시간</label>
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="w-full h-14 px-4 rounded-xl bg-warm-surface border border-warm-border text-ink text-lg appearance-none focus:outline-none focus:border-purple-accent/50 focus:ring-2 focus:ring-purple-accent/10 transition-all"
          >
            <option value="모름">모르겠어요</option>
            {시진목록.map((h) => (
              <option key={h.key} value={h.key}>{h.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-10 pb-10 animate-fade-up stagger-3">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full h-14 text-base font-bold rounded-2xl text-white shadow-xl transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: isValid
              ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
              : "#333",
          }}
        >
          결과 보기
        </button>
      </div>
    </main>
  );
}
