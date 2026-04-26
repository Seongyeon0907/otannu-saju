import type { SajuResult } from "@/modules/saju/types";

/**
 * 총 연애 횟수를 사주 데이터 기반으로 사전 계산 (LLM 수학 부담 제거)
 */
export function calcTotalLoveCount(saju: SajuResult): number {
  const pillars = [saju.년주, saju.월주, saju.일주, ...(saju.시주 ? [saju.시주] : [])];

  let count = 4; // 기본값

  // 도화살 (자/오/묘/유) 개수 × 1
  const 도화지지 = ["자", "오", "묘", "유"];
  const 도화count = pillars.filter((p) => 도화지지.includes(p.지지)).length;
  count += 도화count;

  // 오행 중 화 + 수 비율이 높으면 추가
  const total = Object.values(saju.오행).reduce((sum, v) => sum + v, 0);
  const 수화합 = saju.오행.수 + saju.오행.화;
  if (수화합 >= total * 0.5) count += 2;
  else if (수화합 >= total * 0.35) count += 1;

  // 음간 비율이 높으면 +1
  const 음간 = ["을", "정", "기", "신", "계"];
  const 음count = pillars.filter((p) => 음간.includes(p.천간)).length;
  if (음count >= pillars.length * 0.5) count += 1;

  // 오행이 고르게 분포하면 +1
  const values = Object.values(saju.오행);
  const avg = total / 5;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / 5;
  if (variance <= 0.5) count += 1;

  // 3~12 범위로 클램프
  return Math.max(3, Math.min(12, count));
}

export function buildLoveCountPrompt(
  saju: SajuResult,
  mbti: string,
  pastLoveCount: number,
): string {
  const pillars = [saju.년주, saju.월주, saju.일주, ...(saju.시주 ? [saju.시주] : [])];

  const 시주정보 = saju.시주
    ? `시주: ${saju.시주.label} (${saju.시주.천간}${saju.시주.지지})`
    : "시주: 정보 없음 (태어난 시간 모름)";

  const 오행entries = Object.entries(saju.오행) as [string, number][];
  const sorted = [...오행entries].sort((a, b) => b[1] - a[1]);
  const 최강 = sorted[0];
  const 최약 = sorted[sorted.length - 1];

  // 도화살 체크
  const 도화지지 = ["자", "오", "묘", "유"];
  const 도화count = pillars.filter((p) => 도화지지.includes(p.지지)).length;

  // 총 연애 횟수 사전 계산
  const totalLoveCount = calcTotalLoveCount(saju);
  const remainingLoveCount = Math.max(1, totalLoveCount - pastLoveCount);

  const currentYear = new Date().getFullYear();

  // 오행별 연애 해석 힌트
  const 오행연애힌트: Record<string, string> = {
    목: "나무의 기운 → 성장하는 사랑, 자유를 존중하는 연애 스타일",
    화: "불의 기운 → 뜨겁고 화끈한 연애, 눈에 보이는 것 없이 빠져듦",
    토: "흙의 기운 → 안정적이고 헌신적인 사랑, 한번 좋아하면 오래감",
    금: "쇠의 기운 → 높은 기준과 이상형, 까다롭지만 진심이면 올인",
    수: "물의 기운 → 감성적이고 깊은 연애, 밀당의 달인",
  };

  return `## 역할
너는 친구에게 사주 봐주는 느낌의 유머러스한 연애 사주 해설가야.
사주팔자의 기운 분포를 보고 연애 운세를 재미있게 풀어주는 게 네 역할이야.

## 사주 데이터

년주: ${saju.년주.label} (${saju.년주.천간}${saju.년주.지지})
월주: ${saju.월주.label} (${saju.월주.천간}${saju.월주.지지})
일주: ${saju.일주.label} (${saju.일주.천간}${saju.일주.지지})
${시주정보}

오행 분포: 목(${saju.오행.목}) 화(${saju.오행.화}) 토(${saju.오행.토}) 금(${saju.오행.금}) 수(${saju.오행.수})
→ 가장 강한 기운: ${최강[0]}(${최강[1]}) / 가장 약한 기운: ${최약[0]}(${최약[1]})
→ 도화 기운: ${도화count}개

## 사용자 정보
MBTI: ${mbti}
과거 연애 횟수: ${pastLoveCount}회

## 사전 계산된 값 (반드시 이 값을 사용해)
totalLoveCount: ${totalLoveCount}
remainingLoveCount: ${remainingLoveCount}

## 해설 작성 규칙

1. 톤은 확신에 찬 단정형이야. "~일 수 있어" 가 아니라 "~인 거야", "~한 사주야" 처럼.
2. 친구한테 말하듯 반말로 말해. 그렇지만, 사주 해석 자체는 그럴듯하게 써.
3. 사주 전문 용어(천간, 지지, 오행, 십성, 합, 충 등)는 절대 쓰지 마. "물의 기운", "불의 기운" 같은 쉬운 말로만 풀어.
4. 각 연애별 키워드는 감성적이고 재미있게 (예: "운명적 만남", "폭풍 같은 사랑", "짧지만 강렬한 불꽃")
5. MBTI 비교는 실제 통계가 아니라 재미있는 느낌으로 만들어. 예: "${mbti}는 평균 N.N번인데 너는..."
6. 오행 해석 참고:
${오행entries.map(([name, val]) => `   - ${name}(${val}): ${오행연애힌트[name]}`).join("\n")}
7. 모든 텍스트 필드는 2~3문장으로 간결하게.
8. eachLove 배열은 반드시 ${totalLoveCount}개 만들어. 순번은 1부터 시작.
9. 과거 연애(1~${pastLoveCount}번째)는 과거형으로, 미래 연애(${pastLoveCount + 1}번째~)는 미래형으로 써.
10. threeYearForecast의 년도는 ${currentYear}, ${currentYear + 1}, ${currentYear + 2}로 해.

## 출력 형식

아래 JSON 형식으로만 응답해. 다른 텍스트, 마크다운, 설명 없이 순수 JSON만:
{
  "totalLoveCount": ${totalLoveCount},
  "remainingLoveCount": ${remainingLoveCount},
  "eachLove": [
    { "순번": 1, "키워드": "키워드", "설명": "2-3문장 설명" },
    ...
  ],
  "peerComparison": "또래 비교 2-3문장",
  "mbtiComparison": "MBTI 비교 2-3문장",
  "datingStyle": "연애 유형 설명 2-3문장",
  "mainEnergy": { "기운": "예: 화(火)", "설명": "연애에서 이 기운이 어떻게 발현되는지 2-3문장" },
  "lackingEnergy": { "기운": "예: 금(金)", "설명": "부족한 기운이 연애에 어떤 영향인지 2-3문장" },
  "avoidType": { "유형": "예: 과도한 통제광", "설명": "왜 피해야 하는지 2-3문장" },
  "idealType": { "유형": "예: 따뜻한 현실주의자", "설명": "왜 만나야 하는지 2-3문장" },
  "threeYearForecast": {
    "year1": { "년도": ${currentYear}, "운세": "올해 연애운 2-3문장" },
    "year2": { "년도": ${currentYear + 1}, "운세": "내년 연애운 2-3문장" },
    "year3": { "년도": ${currentYear + 2}, "운세": "내후년 연애운 2-3문장" }
  }
}`;
}
