import type { SajuResult, LoveCountResult, LovePrediction } from "@/modules/saju/types";
import {
  datingStyleData,
  mainEnergyData,
  lackingEnergyData,
  avoidTypeData,
  idealTypeData,
  lovePredictionPool,
  getPeerComparison,
  threeYearForecastData,
} from "./love-count-data";

/**
 * 총 연애 횟수를 사주 데이터 기반으로 계산
 */
function calcTotalLoveCount(saju: SajuResult): number {
  const pillars = [saju.년주, saju.월주, saju.일주, ...(saju.시주 ? [saju.시주] : [])];

  let count = 4;

  // 도화살 (자/오/묘/유)
  const 도화지지 = ["자", "오", "묘", "유"];
  count += pillars.filter((p) => 도화지지.includes(p.지지)).length;

  // 오행 중 화 + 수 비율
  const total = Object.values(saju.오행).reduce((sum, v) => sum + v, 0);
  const 수화합 = saju.오행.수 + saju.오행.화;
  if (수화합 >= total * 0.5) count += 2;
  else if (수화합 >= total * 0.35) count += 1;

  // 음간 비율
  const 음간 = ["을", "정", "기", "신", "계"];
  const 음count = pillars.filter((p) => 음간.includes(p.천간)).length;
  if (음count >= pillars.length * 0.5) count += 1;

  // 오행 균형도
  const values = Object.values(saju.오행);
  const avg = total / 5;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / 5;
  if (variance <= 0.5) count += 1;

  return Math.max(3, Math.min(12, count));
}

/**
 * 오행 분포에서 가장 강한/약한 기운 찾기
 */
function getStrongestElement(saju: SajuResult): string {
  const entries = Object.entries(saju.오행) as [string, number][];
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function getWeakestElement(saju: SajuResult): string {
  const entries = Object.entries(saju.오행) as [string, number][];
  return entries.sort((a, b) => a[1] - b[1])[0][0];
}

/**
 * 사주 기둥별 오행 시퀀스 생성 (연애 예측 배정용)
 */
function getElementSequence(saju: SajuResult): string[] {
  const 천간오행: Record<string, string> = {
    갑: "목", 을: "목", 병: "화", 정: "화", 무: "토",
    기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
  };

  const pillars = [saju.년주, saju.월주, saju.일주, ...(saju.시주 ? [saju.시주] : [])];
  const seq: string[] = [];

  // 각 기둥의 천간 오행을 시퀀스에 추가
  for (const p of pillars) {
    seq.push(천간오행[p.천간]);
  }
  // 각 기둥의 지지 오행도 추가
  const 지지오행: Record<string, string> = {
    자: "수", 축: "토", 인: "목", 묘: "목", 진: "토", 사: "화",
    오: "화", 미: "토", 신: "금", 유: "금", 술: "토", 해: "수",
  };
  for (const p of pillars) {
    seq.push(지지오행[p.지지]);
  }

  return seq;
}

/**
 * 연애 예측 리스트 생성
 */
function buildEachLove(saju: SajuResult, totalCount: number, pastCount: number): LovePrediction[] {
  const elementSeq = getElementSequence(saju);
  const allElements = ["목", "화", "토", "금", "수"];
  const used = new Map<string, number>(); // element -> pool index used

  const predictions: LovePrediction[] = [];

  for (let i = 0; i < totalCount; i++) {
    // 어떤 오행의 풀에서 가져올지 결정
    const element = elementSeq[i % elementSeq.length];
    const poolIdx = used.get(element) ?? 0;
    const pool = lovePredictionPool[element];
    const template = pool[poolIdx % pool.length];
    used.set(element, poolIdx + 1);

    const isPast = i + 1 <= pastCount;

    predictions.push({
      순번: i + 1,
      키워드: template.키워드,
      설명: isPast ? template.설명_past : template.설명_future,
    });
  }

  return predictions;
}

/**
 * 사주 + 과거 연애 횟수로 결과를 조립
 */
export function buildLoveCountResult(
  saju: SajuResult,
  pastLoveCount: number,
): LoveCountResult {
  const totalLoveCount = calcTotalLoveCount(saju);
  const remainingLoveCount = Math.max(1, totalLoveCount - pastLoveCount);

  const strongest = getStrongestElement(saju);
  const weakest = getWeakestElement(saju);

  const currentYear = new Date().getFullYear();
  const forecasts = threeYearForecastData[strongest];

  return {
    totalLoveCount,
    remainingLoveCount,
    eachLove: buildEachLove(saju, totalLoveCount, pastLoveCount),
    peerComparison: getPeerComparison(totalLoveCount),
    datingStyle: datingStyleData[strongest],
    mainEnergy: mainEnergyData[strongest],
    lackingEnergy: lackingEnergyData[weakest],
    avoidType: avoidTypeData[strongest],
    idealType: idealTypeData[strongest],
    threeYearForecast: {
      year1: { 년도: currentYear, 운세: forecasts[0] },
      year2: { 년도: currentYear + 1, 운세: forecasts[1] },
      year3: { 년도: currentYear + 2, 운세: forecasts[2] },
    },
  };
}
