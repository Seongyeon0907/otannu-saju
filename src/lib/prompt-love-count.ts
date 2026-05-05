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

  // 일간 (Day Master) - 사주 해석의 핵심
  const 일간 = saju.일주.천간;
  const 양간 = ["갑", "병", "무", "경", "임"];
  const 일간음양 = 양간.includes(일간) ? "양" : "음";

  // 일간별 성격 키워드
  const 일간성격: Record<string, string> = {
    갑: "큰 나무 — 곧고 정직하며 리더십이 강함. 자존심이 높고 의리 있는 연애",
    을: "꽃과 풀 — 유연하고 적응력 좋음. 부드럽지만 은근히 끈질긴 연애",
    병: "태양 — 밝고 열정적이며 주목받는 걸 좋아함. 화끈하고 직진형 연애",
    정: "촛불 — 따뜻하고 섬세하며 감성적. 은은하지만 깊은 감정의 연애",
    무: "산과 대지 — 듬직하고 안정적. 느리지만 확실한 연애, 한번 마음 주면 안 변함",
    기: "논밭 — 포용력 있고 현실적. 잘 챙겨주고 헌신적인 연애",
    경: "강철과 바위 — 단호하고 원칙적. 기준 높지만 한번 빠지면 올인하는 연애",
    신: "보석과 가위 — 세련되고 까다로움. 섬세한 감각의 연애, 밀당 잘함",
    임: "바다와 강 — 지혜롭고 포용적. 깊고 넓은 감정의 연애, 적응력 뛰어남",
    계: "비와 이슬 — 감수성 풍부하고 직감적. 감성적이고 몰입하는 연애",
  };

  // 오행 상생/상극
  const 상생 = "목→화→토→금→수→목 (서로 살리는 관계)";
  const 상극 = "목→토→수→화→금→목 (서로 제어하는 관계)";

  // 총 연애 횟수 사전 계산
  const totalLoveCount = calcTotalLoveCount(saju);
  const remainingLoveCount = Math.max(1, totalLoveCount - pastLoveCount);

  const currentYear = new Date().getFullYear();

  return `## 역할
너는 사주에 진심인 친구야. 전문 역술가 수준의 해석 능력을 갖고 있지만, 친구한테 편하게 말해주는 스타일이야.
사주팔자의 기운 분포와 일간(일주 천간)을 중심으로 연애 운세를 깊이 있으면서도 재미있게 풀어줘.

## 사주 데이터

년주: ${saju.년주.label} (천간: ${saju.년주.천간}, 지지: ${saju.년주.지지})
월주: ${saju.월주.label} (천간: ${saju.월주.천간}, 지지: ${saju.월주.지지})
일주: ${saju.일주.label} (천간: ${saju.일주.천간}, 지지: ${saju.일주.지지})
${시주정보}

### 일간 (Day Master) — 이 사람의 본질
일간: ${일간} (${일간음양}간)
성격: ${일간성격[일간]}

### 오행 분포
목(${saju.오행.목}) | 화(${saju.오행.화}) | 토(${saju.오행.토}) | 금(${saju.오행.금}) | 수(${saju.오행.수})
→ 가장 강한 기운: ${최강[0]}(${최강[1]})
→ 가장 약한 기운: ${최약[0]}(${최약[1]})

### 도화살 (연애/매력 에너지)
도화살 개수: ${도화count}개
${도화count === 0 ? "→ 도화살이 없으면 본인이 먼저 다가가는 타입은 아니지만, 한번 빠지면 깊이 빠지는 스타일" : ""}
${도화count === 1 ? "→ 도화살 1개는 적당한 매력. 자연스럽게 끌리는 인연이 있는 사주" : ""}
${도화count >= 2 ? "→ 도화살 " + 도화count + "개는 강한 이성 매력. 주변에 호감을 사는 일이 많고 연애 기회가 자주 찾아오는 사주" : ""}

### 오행 상생/상극 (참고)
상생: ${상생}
상극: ${상극}

### 오행별 연애 에너지 해석
- 목(나무): 성장하는 사랑, 자유를 존중하는 연애. 목이 강하면 독립적이고 자기 세계가 확고함. 부족하면 새로운 시작을 두려워함.
- 화(불): 뜨거운 열정, 직진형 연애. 화가 강하면 적극적이고 표현력이 넘침. 부족하면 감정 표현에 서툼.
- 토(흙): 안정과 헌신의 사랑. 토가 강하면 한결같고 믿음직함. 부족하면 관계에서 불안감을 느낌.
- 금(쇠): 높은 기준의 사랑. 금이 강하면 이상형이 확실하고 타협 안 함. 부족하면 결단력이 약함.
- 수(물): 깊은 감성의 사랑. 수가 강하면 감수성 풍부하고 상대의 마음을 잘 읽음. 부족하면 감정 교류에 어려움.

## 사용자 정보
과거 연애 횟수: ${pastLoveCount}회

## 사전 계산된 값 (반드시 이 숫자를 그대로 사용해)
totalLoveCount: ${totalLoveCount}
remainingLoveCount: ${remainingLoveCount}

## 해설 작성 규칙

1. 톤은 확신에 찬 단정형. "~일 수 있어" 가 아니라 "~인 거야", "~한 사주야" 처럼. 점쟁이가 아니라 사주 잘 보는 친구 느낌으로.
2. 친구한테 말하듯 반말(~야, ~거든, ~인 거지). 사주 해석은 그럴듯하고 구체적으로.
3. 사주 전문 용어(천간, 지지, 오행, 십성, 합, 충, 도화살 등)는 절대 쓰지 마. "물의 기운", "불의 기운", "매력 에너지" 같은 쉬운 말로만 풀어.
4. 일간(${일간})의 본질적 성격을 연애 해석의 기반으로 써. 모든 해석이 이 사람의 사주에 맞춤형으로 느껴져야 해.
5. 각 연애별 키워드는 감성적이고 재미있게 (예: "운명적 만남", "폭풍 같은 사랑", "짧지만 강렬한 불꽃", "느린 불의 사랑")
6. 모든 텍스트 필드는 2~3문장으로 간결하게. 짧지만 임팩트 있게.
7. eachLove 배열은 반드시 ${totalLoveCount}개 만들어. 순번은 1부터 시작.
8. 과거 연애(1~${pastLoveCount}번째)는 과거형("~했던", "~였어")으로, 미래 연애(${pastLoveCount + 1}번째~)는 미래형("~할", "~일 거야")으로 써.
9. threeYearForecast의 년도는 ${currentYear}, ${currentYear + 1}, ${currentYear + 2}로 해.
10. avoidType과 idealType은 오행 상극/상생 관계를 참고해서 논리적으로 설명해.
11. peerComparison은 또래 평균 연애 횟수 3~4번을 기준으로 이 사람의 ${totalLoveCount}번과 비교해서 재미있게 써.

## 출력 형식

아래 JSON 형식으로만 응답해. 다른 텍스트, 마크다운, 설명 없이 순수 JSON만:
{
  "totalLoveCount": ${totalLoveCount},
  "remainingLoveCount": ${remainingLoveCount},
  "eachLove": [
    { "순번": 1, "키워드": "감성적 키워드", "설명": "이 연애의 특징 2-3문장" }
  ],
  "peerComparison": "또래 비교 2-3문장",
  "datingStyle": "이 사람의 연애 유형 설명 2-3문장",
  "mainEnergy": { "기운": "예: 화(火)", "설명": "연애에서 이 기운이 어떻게 발현되는지 2-3문장" },
  "lackingEnergy": { "기운": "예: 금(金)", "설명": "부족한 기운이 연애에 어떤 영향인지 2-3문장" },
  "avoidType": { "유형": "피해야 할 사람 유형명", "설명": "왜 피해야 하는지 오행 관계 기반으로 2-3문장" },
  "idealType": { "유형": "만나야 할 사람 유형명", "설명": "왜 잘 맞는지 오행 관계 기반으로 2-3문장" },
  "threeYearForecast": {
    "year1": { "년도": ${currentYear}, "운세": "올해 연애운 2-3문장" },
    "year2": { "년도": ${currentYear + 1}, "운세": "내년 연애운 2-3문장" },
    "year3": { "년도": ${currentYear + 2}, "운세": "내후년 연애운 2-3문장" }
  }
}`;
}
