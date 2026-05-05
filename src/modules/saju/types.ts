export interface SajuPillar {
  천간: string;
  지지: string;
  label: string; // e.g. "갑자"
}

// 십성 (Ten Gods)
export type TenGodName = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '칠살' | '정관' | '편인' | '정인';

// 십성 카테고리
export type TenGodCategory = '비겁' | '식상' | '재성' | '관성' | '인성';

// 강약 (Day Master Strength)
export type DayMasterStrength = '신강' | '신약' | '중화';

// 확장된 기둥 정보
export interface EnrichedPillar extends SajuPillar {
  천간십성: TenGodName | null; // null for 일주 천간 (자기 자신)
  지지십성: TenGodName[];      // via 지장간
  지장간: string[];
  십이운성: string;
  납음: string;
}

// 십성 분포
export interface TenGodDistribution {
  비겁: number;  // 비견 + 겁재
  식상: number;  // 식신 + 상관
  재성: number;  // 편재 + 정재
  관성: number;  // 칠살 + 정관
  인성: number;  // 편인 + 정인
}

// 도화살 상세 분석
export interface DoHwaSalAnalysis {
  count: number;
  positions: ('년지' | '월지' | '일지' | '시지')[];
  strength: '없음' | '약' | '중' | '강' | '극강';
}

// 확장된 사주 결과
export interface EnrichedSajuResult extends SajuResult {
  년주: EnrichedPillar;
  월주: EnrichedPillar;
  일주: EnrichedPillar;
  시주: EnrichedPillar | null;
  십성분포: TenGodDistribution;
  강약: DayMasterStrength;
  일간오행: string;
  도화살: DoHwaSalAnalysis;
}

export interface SajuResult {
  년주: SajuPillar;
  월주: SajuPillar;
  일주: SajuPillar;
  시주: SajuPillar | null; // null if user selected "모름"
  오행: FiveElements;
}

export interface FiveElements {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

export interface AnalysisResult {
  probability: number;
  explanation: string;
}

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: string | null; // 시진 key or null for "모름"
}

// 연애 횟수 분석용 입력
export interface LoveCountInput extends BirthInput {
  pastLoveCount: number;
  analysisType?: "love-count" | "solo-escape";
}

// 개별 연애 예측
export interface LovePrediction {
  순번: number;
  키워드: string;
  설명: string;
}

// 연애 횟수 분석 결과 (AI 응답 구조)
export interface LoveCountResult {
  totalLoveCount: number;
  remainingLoveCount: number;
  eachLove: LovePrediction[];
  peerComparison: string;
  datingStyle: string;
  mainEnergy: { 기운: string; 설명: string };
  lackingEnergy: { 기운: string; 설명: string };
  avoidType: { 유형: string; 설명: string };
  idealType: { 유형: string; 설명: string };
  threeYearForecast: {
    year1: { 년도: number; 운세: string };
    year2: { 년도: number; 운세: string };
    year3: { 년도: number; 운세: string };
  };
}

// 월별 연애운
export interface MonthlyLuck {
  month: number;        // 1-12
  score: number;        // 0-100
  description: string;
}

// 미래 파트너 예측
export interface FuturePartner {
  personality: string;
  meetingPlace: string;
  appearance: string;
}

// 솔로 탈출 시기 분석 결과
export interface SoloEscapeResult {
  bestMonth: number;
  monthlyLuck: MonthlyLuck[];
  futurePartner: FuturePartner;
  summary: string;
}
