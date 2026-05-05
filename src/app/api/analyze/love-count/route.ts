import { NextRequest, NextResponse } from "next/server";
import { enrichSajuData } from "@/lib/saju-engine";
import { analyzeRomance } from "@/lib/romance-scorer";
import { buildAIPayload, buildPrefilledResult } from "@/lib/ai-payload-builder";
import { buildLoveCountResult } from "@/lib/love-count-builder";
import { calcSoloEscapeResult } from "@/lib/solo-escape-data";
import type { LoveCountInput } from "@/modules/saju/types";

export async function POST(req: NextRequest) {
  try {
    const body: LoveCountInput = await req.json();

    if (!body.year || !body.month || !body.day) {
      return NextResponse.json(
        { error: "생년월일을 모두 입력해주세요." },
        { status: 400 },
      );
    }

    if (body.pastLoveCount == null || body.pastLoveCount < 0) {
      return NextResponse.json(
        { error: "과거 연애 횟수를 입력해주세요." },
        { status: 400 },
      );
    }

    // 1. 확장 사주 계산 (십성, 강약, 도화살)
    const enriched = enrichSajuData(body);

    // 2. 로맨스 룰 엔진 (점수 + 룰 매칭)
    const analysis = analyzeRomance(enriched);

    // 3. AI 페이로드 조립
    const payload = buildAIPayload(enriched, analysis, body.pastLoveCount);

    // 4. 룰 엔진 결과로 텍스트 조립 (AI 호출 없이 즉시 응답)
    const result = buildPrefilledResult(payload);

    // 5. eachLove는 기존 빌더의 오행 기반 예측 풀에서 가져오기
    const legacyResult = buildLoveCountResult(enriched, body.pastLoveCount);
    result.eachLove = legacyResult.eachLove;

    // 십성 상세 (각 기둥별)
    const pillars = [enriched.년주, enriched.월주, enriched.일주, ...(enriched.시주 ? [enriched.시주] : [])];
    const allTenGods = pillars.flatMap((p) => [p.천간십성, ...p.지지십성].filter(Boolean));
    const uniqueTenGods = [...new Set(allTenGods)];

    return NextResponse.json({
      saju: {
        년주: enriched.년주.label,
        월주: enriched.월주.label,
        일주: enriched.일주.label,
        시주: enriched.시주?.label ?? "모름",
        오행: enriched.오행,
        일간오행: enriched.일간오행,
        강약: enriched.강약,
        십성분포: enriched.십성분포,
        도화살: enriched.도화살,
        십성목록: uniqueTenGods,
      },
      scores: analysis.scores,
      matchedRules: analysis.matchedRules.map((r) => r.id),
      interpretations: analysis.interpretations,
      result,
      ...(body.analysisType === "solo-escape" ? { soloEscape: calcSoloEscapeResult(enriched) } : {}),
    });
  } catch (error) {
    console.error("Love count analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
