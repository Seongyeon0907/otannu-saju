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
  comment: string;
}

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: string | null; // 시진 key or null for "모름"
}
