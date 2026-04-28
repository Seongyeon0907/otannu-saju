import { NextRequest, NextResponse } from "next/server";
import { calculateSaju } from "@/lib/saju";
import { buildLoveCountResult } from "@/lib/love-count-builder";
import type { LoveCountInput } from "@/modules/saju/types";

export async function POST(req: NextRequest) {
  try {
    const body: LoveCountInput = await req.json();

    if (!body.year || !body.month || !body.day || !body.mbti) {
      return NextResponse.json(
        { error: "생년월일과 MBTI를 모두 입력해주세요." },
        { status: 400 },
      );
    }

    if (body.pastLoveCount == null || body.pastLoveCount < 0) {
      return NextResponse.json(
        { error: "과거 연애 횟수를 입력해주세요." },
        { status: 400 },
      );
    }

    const saju = calculateSaju(body);
    const result = buildLoveCountResult(saju, body.mbti, body.pastLoveCount);

    return NextResponse.json({
      saju: {
        년주: saju.년주.label,
        월주: saju.월주.label,
        일주: saju.일주.label,
        시주: saju.시주?.label ?? "모름",
        오행: saju.오행,
      },
      result,
    });
  } catch (error) {
    console.error("Love count analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
