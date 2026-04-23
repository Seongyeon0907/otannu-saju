import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { calculateSaju } from "@/lib/saju";
import { buildPrompt } from "@/lib/prompt";
import type { BirthInput, AnalysisResult } from "@/modules/saju/types";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body: BirthInput = await req.json();

    // Validate input
    if (!body.year || !body.month || !body.day) {
      return NextResponse.json(
        { error: "생년월일을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // Calculate saju
    const saju = calculateSaju(body);

    // Build prompt and call Claude
    const prompt = buildPrompt(saju);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Parse response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let result: AnalysisResult;
    try {
      result = JSON.parse(responseText);
    } catch {
      // If JSON parsing fails, try to extract from markdown code block
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
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
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
