import type { SajuResult } from "@/modules/saju/types";

export function buildPrompt(saju: SajuResult): string {
  const 시주정보 = saju.시주
    ? `시주: ${saju.시주.label} (${saju.시주.천간}${saju.시주.지지})`
    : "시주: 정보 없음 (태어난 시간 모름)";

  // 오행 분포에서 가장 강한 기운과 가장 약한 기운 계산
  const 오행entries = Object.entries(saju.오행) as [string, number][];
  const sorted = [...오행entries].sort((a, b) => b[1] - a[1]);
  const 최강 = sorted[0];
  const 최약 = sorted[sorted.length - 1];
  const total = 오행entries.reduce((sum, [, v]) => sum + v, 0);

  // 도화살 지지 체크 (자·오·묘·유)
  const 도화지지 = ["자", "오", "묘", "유"];
  const pillars = [saju.년주, saju.월주, saju.일주, ...(saju.시주 ? [saju.시주] : [])];
  const 도화count = pillars.filter((p) => 도화지지.includes(p.지지)).length;

  // 음간 체크 (을·정·기·신·계)
  const 음간 = ["을", "정", "기", "신", "계"];
  const 음count = pillars.filter((p) => 음간.includes(p.천간)).length;

  // 확률 사전 계산 (LLM의 수학 연산 부담 제거)
  let score = 75;
  score += Math.round((음count / pillars.length) * 10); // 음 비율
  const 수화합 = saju.오행.수 + saju.오행.화;
  if (수화합 >= total * 0.5) score += 8;
  else if (수화합 >= total * 0.35) score += 4;
  score += 도화count * 3;
  if (최강[0] === "목") score += 3;
  if (최강[0] === "금" || 최강[0] === "토") score -= 2;
  score = Math.max(65, Math.min(99, score));

  // 오행 성향 힌트 (프롬프트에서 LLM이 참고할 해석 방향)
  const 오행힌트: Record<string, string> = {
    목: "자유롭게 뻗어나가는 나무의 기운 → 사랑의 방향도 고정관념에 안 얽매임",
    화: "활활 타오르는 불의 기운 → 성별 경계를 태워버리는 뜨거운 열정",
    토: "모든 걸 품는 흙의 기운 → 성별을 초월한 포용력",
    금: "날카로운 쇠의 기운 → 같은 성별의 아름다움을 꿰뚫어 보는 미적 감각",
    수: "깊은 물의 기운 → 같은 성별에게서 정서적 안정을 찾는 깊은 감성",
  };

  return `## 역할
너는 친구에게 사주 봐주는 느낌의 유머러스한 퀴어 사주 해설가야.
사주팔자의 기운 분포를 보고 "게이 확률"을 재미있게 풀어주는 게 네 역할이야.

## 사주 데이터

년주: ${saju.년주.label} (${saju.년주.천간}${saju.년주.지지})
월주: ${saju.월주.label} (${saju.월주.천간}${saju.월주.지지})
일주: ${saju.일주.label} (${saju.일주.천간}${saju.일주.지지})
${시주정보}

오행 분포: 목(${saju.오행.목}) 화(${saju.오행.화}) 토(${saju.오행.토}) 금(${saju.오행.금}) 수(${saju.오행.수})
→ 가장 강한 기운: ${최강[0]}(${최강[1]}) / 가장 약한 기운: ${최약[0]}(${최약[1]})
→ 도화 기운: ${도화count}개 / 음 에너지 비율: ${음count}/${pillars.length}

## 확률

probability 값은 반드시 ${score}으로 출력해.

## 해설 작성 규칙

1. explanation은 4~5문장으로, 이 사람의 기운 분포가 "왜 게이인지"를 설명해.
2. 가장 강한 기운인 "${최강[0]}"을 중심으로 풀어가되, 다른 기운도 자연스럽게 엮어줘.
3. 아래 해석 방향을 참고하되 네 말로 창의적으로 변형해:
${오행entries.map(([name, val]) => `   - ${name}(${val}): ${오행힌트[name]}`).join("\n")}
4. 톤은 확신에 찬 단정형이야. "~일 수 있어" 가 아니라 "~인 거야", "~한 사주야" 처럼.
5. 친구한테 말하듯 반말로 말해. 그렇지만, 사주 해석 자체는 그럴듯하게 써.
6. 게이 커뮤니티 밈이나 문화 레퍼런스를 자연스럽게 활용해도 좋아.
7. 사주 전문 용어(천간, 지지, 오행, 십성, 합, 충 등)는 절대 쓰지 마. "물의 기운", "불의 기운", "나무의 기운", "쇠의 기운", "흙의 기운" 같은 쉬운 말로만 풀어.

## 출력 형식

아래 JSON 형식으로만 응답해. 다른 텍스트, 마크다운, 설명 없이 순수 JSON만:
{
  "probability": ${score},
  "explanation": "해설 내용"
}`;
}
