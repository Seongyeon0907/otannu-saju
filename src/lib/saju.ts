import { Solar } from "lunar-typescript";
import { 시진목록 } from "@/modules/saju/constants";
import type { SajuResult, SajuPillar, FiveElements, BirthInput } from "@/modules/saju/types";

// 한자 → 한글 매핑
const 천간map: Record<string, string> = {
  甲: "갑", 乙: "을", 丙: "병", 丁: "정", 戊: "무",
  己: "기", 庚: "경", 辛: "신", 壬: "임", 癸: "계",
};

const 지지map: Record<string, string> = {
  子: "자", 丑: "축", 寅: "인", 卯: "묘", 辰: "진", 巳: "사",
  午: "오", 未: "미", 申: "신", 酉: "유", 戌: "술", 亥: "해",
};

function toPillar(gan: string, zhi: string): SajuPillar {
  const 천간 = 천간map[gan];
  const 지지 = 지지map[zhi];
  return { 천간, 지지, label: 천간 + 지지 };
}

/**
 * 사주팔자 전체 계산 (lunar-typescript 만세력 기반)
 * 절기 기준 년주/월주, 정확한 일주 계산
 */
export function calculateSaju(input: BirthInput): SajuResult {
  // 시간 결정: 시진 key → 시간대 중간값
  let hour = 0;
  let hasHour = false;
  if (input.hour) {
    const hourInfo = 시진목록.find((h) => h.key === input.hour);
    if (hourInfo) {
      // 지지idx 0=자시(23시), 1=축시(1시), ... 매핑
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

  const 년주 = toPillar(bazi.getYearGan(), bazi.getYearZhi());
  const 월주 = toPillar(bazi.getMonthGan(), bazi.getMonthZhi());
  const 일주 = toPillar(bazi.getDayGan(), bazi.getDayZhi());
  const 시주 = hasHour
    ? toPillar(bazi.getTimeGan(), bazi.getTimeZhi())
    : null;

  // 오행 분포 계산
  const pillars = [년주, 월주, 일주, ...(시주 ? [시주] : [])];
  const 오행 = calcFiveElements(pillars);

  return { 년주, 월주, 일주, 시주, 오행 };
}

const 천간오행: Record<string, keyof FiveElements> = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토",
  기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};

const 지지오행: Record<string, keyof FiveElements> = {
  자: "수", 축: "토", 인: "목", 묘: "목", 진: "토", 사: "화",
  오: "화", 미: "토", 신: "금", 유: "금", 술: "토", 해: "수",
};

function calcFiveElements(pillars: SajuPillar[]): FiveElements {
  const elements: FiveElements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const pillar of pillars) {
    elements[천간오행[pillar.천간]]++;
    elements[지지오행[pillar.지지]]++;
  }
  return elements;
}
