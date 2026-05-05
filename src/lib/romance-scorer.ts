import type { EnrichedSajuResult } from "@/modules/saju/types";
import { ROMANCE_RULES, type RomanceRule } from "@/modules/saju/romance-rules";

export interface MatchedRule {
  id: string;
  category: RomanceRule['category'];
  weight: number;
  interpretation: { title: string; description: string };
  tags: string[];
}

export interface RomanceScores {
  매력지수: number;        // 0-100
  연애운총점: number;      // 0-100
}

export interface RomanceAnalysis {
  scores: RomanceScores;
  matchedRules: MatchedRule[];
  interpretations: {
    매력지수: { title: string; description: string }[];
    연애스타일: { title: string; description: string }[];
    이상형: { title: string; description: string }[];
    주의사항: { title: string; description: string }[];
  };
}

/**
 * 매력지수 점수 계산 (룰 기반, 0-100)
 */
function calcCharmScore(data: EnrichedSajuResult, matched: MatchedRule[]): number {
  let score = 50; // base

  // 도화살 기반
  const 도화점수: Record<string, number> = { '없음': 0, '약': 10, '중': 15, '강': 20, '극강': 25 };
  score += 도화점수[data.도화살.strength] ?? 0;

  // 식상 (표현력)
  score += data.십성분포.식상 * 5;

  // 매력지수 카테고리 매칭 룰 weight 합산
  const charmRules = matched.filter(r => r.category === '매력지수');
  score += charmRules.reduce((sum, r) => sum + r.weight, 0);

  // 일간 modifier
  if (data.일간오행 === '화') score += 3;
  if (data.일간오행 === '수') score += 3;

  return Math.max(0, Math.min(100, score));
}

/**
 * 연애운 총점 계산 (룰 기반, 0-100)
 */
function calcRomanceScore(data: EnrichedSajuResult): number {
  let score = 50; // base

  // 도화살
  score += data.도화살.count * 5;

  // 오행 수+화 비율 (감성+열정)
  const total = Object.values(data.오행).reduce((s, v) => s + v, 0);
  const 수화비율 = (data.오행.수 + data.오행.화) / (total || 1);
  if (수화비율 >= 0.5) score += 10;
  else if (수화비율 >= 0.35) score += 5;

  // 십성분포 균형 보너스
  const distValues = Object.values(data.십성분포);
  const avg = distValues.reduce((s, v) => s + v, 0) / 5;
  const variance = distValues.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / 5;
  if (variance <= 1) score += 8; // 균형 잡힌 사주
  else if (variance <= 2) score += 4;

  // 강약 modifier
  if (data.강약 === '중화') score += 5; // 중화가 연애에 유리
  if (data.강약 === '신강') score += 2;

  // 재성/관성 존재 (연애 인연)
  if (data.십성분포.재성 >= 1) score += 5;
  if (data.십성분포.관성 >= 1) score += 3;

  return Math.max(0, Math.min(100, score));
}

/**
 * 메인 분석 함수: 룰 매칭 + 점수 계산
 * 결정론적 — 같은 입력이면 항상 같은 결과
 */
export function analyzeRomance(data: EnrichedSajuResult): RomanceAnalysis {
  // 모든 룰 평가
  const matchedRules: MatchedRule[] = [];

  for (const rule of ROMANCE_RULES) {
    if (rule.condition(data)) {
      matchedRules.push({
        id: rule.id,
        category: rule.category,
        weight: rule.weight,
        interpretation: rule.interpretation,
        tags: rule.tags,
      });
    }
  }

  // 카테고리별 해석 그룹핑
  const interpretations: RomanceAnalysis['interpretations'] = {
    매력지수: [],
    연애스타일: [],
    이상형: [],
    주의사항: [],
  };

  for (const rule of matchedRules) {
    interpretations[rule.category].push(rule.interpretation);
  }

  // 점수 계산
  const scores: RomanceScores = {
    매력지수: calcCharmScore(data, matchedRules),
    연애운총점: calcRomanceScore(data),
  };

  return { scores, matchedRules, interpretations };
}
