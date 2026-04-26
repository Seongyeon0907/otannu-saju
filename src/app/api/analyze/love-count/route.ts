import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { calculateSaju } from "@/lib/saju";
import { buildLoveCountPrompt } from "@/lib/prompt-love-count";
import type { LoveCountInput, LoveCountResult } from "@/modules/saju/types";

export const maxDuration = 60;

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
    const prompt = buildLoveCountPrompt(saju, body.mbti, body.pastLoveCount);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let result: LoveCountResult;
    try {
      result = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const fixed = jsonMatch[0].replace(/"\s*\n\s*"/g, '",\n"');
        result = JSON.parse(fixed);
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

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
