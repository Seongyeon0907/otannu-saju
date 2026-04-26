export interface SajuPillar {
  천간: string;
  지지: string;
  label: string; // e.g. "갑자"
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
  mbti: string;
  pastLoveCount: number;
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
  mbtiComparison: string;
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
