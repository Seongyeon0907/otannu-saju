import { Solar } from "lunar-typescript";
import {
  시진목록,
  천간오행 as 천간오행맵,
  지지오행 as 지지오행맵,
  십성맵,
  십성카테고리,
  십이운성맵,
  월령득령,
} from "@/modules/saju/constants";
import type {
  BirthInput,
  FiveElements,
  EnrichedPillar,
  EnrichedSajuResult,
  TenGodName,
  TenGodCategory,
  TenGodDistribution,
  DayMasterStrength,
  DoHwaSalAnalysis,
} from "@/modules/saju/types";

// 한자 → 한글 매핑
const 천간한글: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무",
  己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
};

const 지지한글: Record<string, string> = {
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사",
  午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
};

/**
 * Chinese 십성 문자열을 Korean TenGodName으로 변환
 */
function toKoreanShiShen(chinese: string): TenGodName {
  return (십성맵[chinese] ?? chinese) as TenGodName;
}

/**
 * Korean 십성을 카테고리로 분류
 */
function toCategory(name: TenGodName): TenGodCategory {
  return (십성카테고리[name] ?? '비겁') as TenGodCategory;
}

/**
 * Chinese 십이운성을 Korean으로 변환
 */
function toKoreanDiShi(chinese: string): string {
  return 십이운성맵[chinese] ?? chinese;
}

/**
 * 지장간 Chinese 천간 배열을 Korean으로 변환
 */
function toKoreanHideGan(arr: string[]): string[] {
  return arr.map((g) => 천간한글[g] ?? g);
}

/**
 * 십성 분포 계산 — 모든 기둥의 천간/지지 십성을 카테고리별로 집계
 */
function calcTenGodDistribution(pillars: EnrichedPillar[]): TenGodDistribution {
  const dist: TenGodDistribution = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };

  for (const p of pillars) {
    // 천간 십성 (일주는 null — 자기 자신)
    if (p.천간십성) {
      dist[toCategory(p.천간십성)]++;
    }
    // 지지 십성 (지장간 기반)
    for (const s of p.지지십성) {
      dist[toCategory(s)]++;
    }
  }

  return dist;
}

/**
 * 강약 판단 (신강/신약/중화)
 * 월령 득령 여부 + 비겁/인성 지원 수로 결정
 */
function calcDayMasterStrength(
  일간오행: string,
  월지: string,
  dist: TenGodDistribution,
): DayMasterStrength {
  let score = 0;

  // 1. 월령 득령 체크 (월지의 강한 오행이 일간 오행과 같으면 +2)
  const 월지강오행 = 월령득령[월지] ?? [];
  if (월지강오행.includes(일간오행)) {
    score += 2;
  }

  // 2. 비겁 수 (같은 오행 = 나를 돕는 세력)
  score += dist.비겁;

  // 3. 인성 수 (나를 생하는 오행 = 나를 돕는 세력)
  score += dist.인성;

  // 4. 관성/재성은 나를 약하게 함
  score -= dist.관성;
  score -= Math.floor(dist.재성 / 2);

  if (score >= 4) return '신강';
  if (score <= 1) return '신약';
  return '중화';
}

/**
 * 도화살 상세 분석
 * 도화 지지: 자, 오, 묘, 유
 */
function analyzeDoHwaSal(
  pillars: { 지지: string }[],
  hasSiju: boolean,
): DoHwaSalAnalysis {
  const 도화지지 = ['자', '오', '묘', '유'];
  const positionNames: ('년지' | '월지' | '일지' | '시지')[] = ['년지', '월지', '일지', '시지'];
  const positions: ('년지' | '월지' | '일지' | '시지')[] = [];

  pillars.forEach((p, i) => {
    if (도화지지.includes(p.지지)) {
      positions.push(positionNames[i]);
    }
  });

  const count = positions.length;
  const strengthMap: Record<number, DoHwaSalAnalysis['strength']> = {
    0: '없음', 1: '약', 2: '중', 3: '강', 4: '극강',
  };
  const maxCount = hasSiju ? 4 : 3;
  const strength = strengthMap[Math.min(count, 4)] ?? '극강';

  return { count, positions, strength };
}

/**
 * 오행 분포 계산
 */
function calcFiveElements(pillars: { 천간: string; 지지: string }[]): FiveElements {
  const elements: FiveElements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const p of pillars) {
    const cKey = 천간오행맵[p.천간] as keyof FiveElements;
    const zKey = 지지오행맵[p.지지] as keyof FiveElements;
    if (cKey) elements[cKey]++;
    if (zKey) elements[zKey]++;
  }
  return elements;
}

/**
 * 메인 enrichment 함수
 * BirthInput으로부터 십성/강약/도화살이 포함된 확장 사주 결과를 반환
 */
export function enrichSajuData(input: BirthInput): EnrichedSajuResult {
  // 시간 결정
  let hour = 0;
  let hasHour = false;
  if (input.hour) {
    const hourInfo = 시진목록.find((h) => h.key === input.hour);
    if (hourInfo) {
      const hourMap = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
      hour = hourMap[hourInfo.지지idx];
      hasHour = true;
    }
  }

  const solar = hasHour
    ? Solar.fromYmdHms(input.year, input.month, input.day, hour, 0, 0)
    : Solar.fromYmd(input.year, input.month, input.day);

  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();

  // 기본 기둥 데이터 + 십성/지장간/십이운성/납음 추출
  const 년주: EnrichedPillar = {
    천간: 천간한글[bazi.getYearGan()],
    지지: 지지한글[bazi.getYearZhi()],
    label: 천간한글[bazi.getYearGan()] + 지지한글[bazi.getYearZhi()],
    천간십성: toKoreanShiShen(bazi.getYearShiShenGan()),
    지지십성: (bazi.getYearShiShenZhi() as string[]).map(toKoreanShiShen),
    지장간: toKoreanHideGan(bazi.getYearHideGan() as string[]),
    십이운성: toKoreanDiShi(bazi.getYearDiShi()),
    납음: bazi.getYearNaYin(),
  };

  const 월주: EnrichedPillar = {
    천간: 천간한글[bazi.getMonthGan()],
    지지: 지지한글[bazi.getMonthZhi()],
    label: 천간한글[bazi.getMonthGan()] + 지지한글[bazi.getMonthZhi()],
    천간십성: toKoreanShiShen(bazi.getMonthShiShenGan()),
    지지십성: (bazi.getMonthShiShenZhi() as string[]).map(toKoreanShiShen),
    지장간: toKoreanHideGan(bazi.getMonthHideGan() as string[]),
    십이운성: toKoreanDiShi(bazi.getMonthDiShi()),
    납음: bazi.getMonthNaYin(),
  };

  const 일주: EnrichedPillar = {
    천간: 천간한글[bazi.getDayGan()],
    지지: 지지한글[bazi.getDayZhi()],
    label: 천간한글[bazi.getDayGan()] + 지지한글[bazi.getDayZhi()],
    천간십성: null, // 일주 천간은 자기 자신 (일간)
    지지십성: (bazi.getDayShiShenZhi() as string[]).map(toKoreanShiShen),
    지장간: toKoreanHideGan(bazi.getDayHideGan() as string[]),
    십이운성: toKoreanDiShi(bazi.getDayDiShi()),
    납음: bazi.getDayNaYin(),
  };

  let 시주: EnrichedPillar | null = null;
  if (hasHour) {
    시주 = {
      천간: 천간한글[bazi.getTimeGan()],
      지지: 지지한글[bazi.getTimeZhi()],
      label: 천간한글[bazi.getTimeGan()] + 지지한글[bazi.getTimeZhi()],
      천간십성: toKoreanShiShen(bazi.getTimeShiShenGan()),
      지지십성: (bazi.getTimeShiShenZhi() as string[]).map(toKoreanShiShen),
      지장간: toKoreanHideGan(bazi.getTimeHideGan() as string[]),
      십이운성: toKoreanDiShi(bazi.getTimeDiShi()),
      납음: bazi.getTimeNaYin(),
    };
  }

  // 일간 오행
  const 일간 = 일주.천간;
  const 일간오행 = 천간오행맵[일간];

  // 오행 분포
  const allPillars = [년주, 월주, 일주, ...(시주 ? [시주] : [])];
  const 오행 = calcFiveElements(allPillars);

  // 십성 분포
  const 십성분포 = calcTenGodDistribution(allPillars);

  // 강약 판단
  const 강약 = calcDayMasterStrength(일간오행, 월주.지지, 십성분포);

  // 도화살 분석
  const 도화살 = analyzeDoHwaSal(allPillars, hasHour);

  return {
    년주,
    월주,
    일주,
    시주,
    오행,
    십성분포,
    강약,
    일간오행,
    도화살,
  };
}
