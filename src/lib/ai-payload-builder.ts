import type { EnrichedSajuResult, FiveElements, TenGodDistribution } from "@/modules/saju/types";
import type { RomanceAnalysis, RomanceScores } from "@/lib/romance-scorer";
import { calcTotalLoveCount } from "@/lib/prompt-love-count";

export interface AIPayload {
  사주데이터: {
    일간: string;
    일간오행: string;
    강약: string;
    오행분포: FiveElements;
    십성분포: TenGodDistribution;
    도화살: { count: number; strength: string };
  };
  점수: RomanceScores;
  해석: {
    매력지수: { title: string; description: string }[];
    연애스타일: { title: string; description: string }[];
    이상형: { title: string; description: string }[];
    주의사항: { title: string; description: string }[];
  };
  근거: string[];
  연애횟수: {
    totalLoveCount: number;
    remainingLoveCount: number;
    pastLoveCount: number;
  };
}

export function buildAIPayload(
  enriched: EnrichedSajuResult,
  analysis: RomanceAnalysis,
  pastLoveCount: number,
): AIPayload {
  const totalLoveCount = calcTotalLoveCount(enriched);
  const remainingLoveCount = Math.max(1, totalLoveCount - pastLoveCount);

  return {
    사주데이터: {
      일간: enriched.일주.천간,
      일간오행: enriched.일간오행,
      강약: enriched.강약,
      오행분포: enriched.오행,
      십성분포: enriched.십성분포,
      도화살: { count: enriched.도화살.count, strength: enriched.도화살.strength },
    },
    점수: analysis.scores,
    해석: analysis.interpretations,
    근거: analysis.matchedRules.map((r) => r.id),
    연애횟수: {
      totalLoveCount,
      remainingLoveCount,
      pastLoveCount,
    },
  };
}

// 오행 이름 매핑 (쉬운 말)
const 오행이름: Record<string, string> = {
  목: '나무의 기운', 화: '불의 기운', 토: '흙의 기운',
  금: '쇠의 기운', 수: '물의 기운',
};

// 오행 상생 (나를 생하는 기운)
const 상생맵: Record<string, string> = {
  목: '수', 화: '목', 토: '화', 금: '토', 수: '금',
};

// 오행 상극 (나를 극하는 기운)
const 상극맵: Record<string, string> = {
  목: '금', 화: '수', 토: '목', 금: '화', 수: '토',
};

/**
 * 룰 엔진 결과로부터 LoveCountResult의 대부분을 사전 조립
 * AI 호출 없이 즉시 반환 가능한 구조
 */
export function buildPrefilledResult(payload: AIPayload): import("@/modules/saju/types").LoveCountResult {
  const { totalLoveCount, remainingLoveCount, pastLoveCount } = payload.연애횟수;
  const 일간오행 = payload.사주데이터.일간오행;
  const 일간기운 = 오행이름[일간오행] ?? 일간오행;
  const currentYear = new Date().getFullYear();

  // 부족한 오행 계산
  const 오행 = payload.사주데이터.오행분포;
  const sorted = Object.entries(오행).sort((a, b) => a[1] - b[1]);
  const 최약오행 = sorted[0][0];
  const 최약기운 = 오행이름[최약오행] ?? 최약오행;

  // datingStyle from matched 연애스타일 rules
  const datingStyle = payload.해석.연애스타일.length > 0
    ? payload.해석.연애스타일.map(h => h.description).join(' ')
    : `${일간기운}이 강한 사주라 연애에서도 그 기운이 그대로 나타나는 거야.`;

  // avoidType from matched 주의사항 rules
  const avoidRule = payload.해석.주의사항[0];
  const avoidType = avoidRule
    ? { 유형: avoidRule.title, 설명: avoidRule.description }
    : { 유형: `${오행이름[상극맵[일간오행]]} 강한 사람`, 설명: `${오행이름[상극맵[일간오행]]}이 강한 사람과는 에너지가 충돌할 수 있어. 장기적으로 마찰이 생길 수 있으니 조심해.` };

  // idealType from matched 이상형 rules
  const idealRule = payload.해석.이상형[0];
  const idealType = idealRule
    ? { 유형: idealRule.title, 설명: idealRule.description }
    : { 유형: `${오행이름[상생맵[일간오행]]} 가진 사람`, 설명: `${오행이름[상생맵[일간오행]]}을 가진 사람이 너를 가장 잘 받쳐줄 수 있어.` };

  // peerComparison
  const peerComparison = totalLoveCount <= 4
    ? `또래 평균이 3-4번인데 너는 ${totalLoveCount}번이야. 양보다 질을 추구하는 타입이라 한번 사귀면 깊게 가는 사주야.`
    : totalLoveCount <= 7
    ? `또래 평균이 3-4번인데 너는 ${totalLoveCount}번이라 꽤 풍부한 연애를 하게 되는 사주야. 그만큼 다양한 경험을 통해 진짜 인연을 찾아가는 과정인 거야.`
    : `또래 평균이 3-4번인데 너는 ${totalLoveCount}번이라 완전 연애 부자야. 사주에 연애 기운이 넘쳐흐르는 거야. 그만큼 사람에게 끌리는 매력이 있다는 뜻이야.`;

  return {
    totalLoveCount,
    remainingLoveCount,
    eachLove: [], // AI가 채울 부분
    peerComparison,
    datingStyle,
    mainEnergy: { 기운: 일간기운, 설명: payload.해석.매력지수.map(h => h.description).join(' ').slice(0, 150) || `${일간기운}이 연애에서도 그대로 발현되는 사주야.` },
    lackingEnergy: { 기운: 최약기운, 설명: `${최약기운}이 부족해서 연애에서 그 부분이 아쉬울 수 있어. 하지만 부족한 기운은 좋은 인연을 통해 채워질 수 있어.` },
    avoidType,
    idealType,
    threeYearForecast: {
      year1: { 년도: currentYear, 운세: `올해는 네 매력이 빛을 발하기 시작하는 해야. 새로운 인연을 만날 가능성이 있어.` },
      year2: { 년도: currentYear + 1, 운세: `내년은 연애운이 더 활발해지는 시기야. 좋은 사람을 만날 가능성이 높아.` },
      year3: { 년도: currentYear + 2, 운세: `${currentYear + 2}년은 안정적인 관계를 다져나가는 해가 될 거야.` },
    },
  };
}

/**
 * AI에게 보낼 간결한 프롬프트 — eachLove 키워드+설명만 생성 요청
 */
export function buildConstrainedPrompt(payload: AIPayload): string {
  const { totalLoveCount, remainingLoveCount, pastLoveCount } = payload.연애횟수;
  const 일간기운 = 오행이름[payload.사주데이터.일간오행] ?? payload.사주데이터.일간오행;

  const 스타일힌트 = payload.해석.연애스타일.slice(0, 2).map(h => h.title).join(', ');
  const 강약설명 = payload.사주데이터.강약 === '신강' ? '에너지 강한' : payload.사주데이터.강약 === '신약' ? '에너지 부드러운' : '균형 잡힌';

  return `사주 기반 연애 예측을 만들어줘. 반말로, 친구에게 말하듯 확신 있게.
사주 전문 용어 금지. "물의 기운" 같은 쉬운 말만 써.

이 사람: ${일간기운}, ${강약설명} 사주, 매력 에너지 ${payload.사주데이터.도화살.strength}
스타일: ${스타일힌트}
총 연애 ${totalLoveCount}번, 과거 ${pastLoveCount}번, 남은 ${remainingLoveCount}번

각 연애마다 감성적 키워드(4-6글자)와 설명(1-2문장)을 만들어.
과거(1~${pastLoveCount}번)는 과거형, 미래(${pastLoveCount + 1}~${totalLoveCount}번)는 미래형으로.

순수 JSON만 응답. 다른 텍스트 없이:
[${Array.from({ length: totalLoveCount }, (_, i) => `{"순번":${i + 1},"키워드":"","설명":""}`).join(',')}]`;
}
