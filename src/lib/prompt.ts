import type { SajuResult } from "@/modules/saju/types";

export function buildPrompt(saju: SajuResult): string {
  const 시주정보 = saju.시주
    ? `- 시주: ${saju.시주.label} (${saju.시주.천간}${saju.시주.지지})`
    : "- 시주: 정보 없음 (태어난 시간 모름)";

  return `당신은 재미있고 위트있는 사주팔자 전문가입니다. 주어진 사주 데이터를 분석하여 이 사람의 "게이 확률"을 판별해주세요.

이것은 100% 재미와 엔터테인먼트 목적입니다. 사주의 음양, 오행, 천간지지의 조합을 창의적으로 해석하여 재미있는 결과를 만들어주세요.

[사주 데이터]
- 년주: ${saju.년주.label} (${saju.년주.천간}${saju.년주.지지})
- 월주: ${saju.월주.label} (${saju.월주.천간}${saju.월주.지지})
- 일주: ${saju.일주.label} (${saju.일주.천간}${saju.일주.지지})
${시주정보}

[오행 분포]
- 목(木): ${saju.오행.목}
- 화(火): ${saju.오행.화}
- 토(土): ${saju.오행.토}
- 금(金): ${saju.오행.금}
- 수(水): ${saju.오행.수}

[규칙]
1. 게이 확률은 0~100 사이의 정수로 표현하세요
2. 사주의 요소들을 실제 사주 용어를 사용하여 근거로 제시하세요
3. 톤은 유머러스하고 친근하게, 하지만 사주 해석은 그럴듯하게 작성하세요
4. explanation은 3~4문장으로 사주 근거를 설명하세요
5. comment는 한줄 코멘트로, 임팩트 있고 재밌게 작성하세요
6. 반드시 한국어로 작성하세요

반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "probability": number,
  "explanation": "string",
  "comment": "string"
}`;
}
