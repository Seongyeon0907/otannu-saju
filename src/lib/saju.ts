import {
  천간, 지지, 천간오행, 지지오행,
  월간시작, 시간시작, 시진목록,
} from "@/modules/saju/constants";
import type { SajuResult, SajuPillar, FiveElements, BirthInput } from "@/modules/saju/types";

/**
 * 년주 계산
 * 기준: 1924년 = 갑자년 (index 0)
 * 실제로는 입춘(2/4경) 기준이지만 간소화하여 양력 기준으로 계산
 */
function calcYearPillar(year: number): SajuPillar {
  const idx = ((year - 4) % 60 + 60) % 60;
  return {
    천간: 천간[idx % 10],
    지지: 지지[idx % 12],
    label: 천간[idx % 10] + 지지[idx % 12],
  };
}

/**
 * 월주 계산
 * 인월(1월/양력2월)부터 시작
 * 월지: 인(1월), 묘(2월), 진(3월), ... 축(12월)
 */
function calcMonthPillar(year: number, month: number): SajuPillar {
  const yearStemIdx = ((year - 4) % 10 + 10) % 10;
  // 월지 인덱스: 1월→인(2), 2월→묘(3), ... 11월→자(0), 12월→축(1)
  const monthBranchIdx = (month + 1) % 12;
  // 월간: 년간에 따른 시작값 + (월-1)
  const startStem = 월간시작[yearStemIdx];
  const monthStemIdx = (startStem + (month - 1)) % 10;

  return {
    천간: 천간[monthStemIdx],
    지지: 지지[monthBranchIdx],
    label: 천간[monthStemIdx] + 지지[monthBranchIdx],
  };
}

/**
 * 일주 계산
 * 기준일: 1900년 1월 1일 = 갑자일 (간소화된 계산)
 * 실제 만세력과 1-2일 차이가 있을 수 있음
 */
function calcDayPillar(year: number, month: number, day: number): SajuPillar {
  // 기준: 1900-01-31 = 갑자일 (index 0)
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const idx = ((diffDays % 60) + 60) % 60;

  return {
    천간: 천간[idx % 10],
    지지: 지지[idx % 12],
    label: 천간[idx % 10] + 지지[idx % 12],
  };
}

/**
 * 시주 계산
 */
function calcHourPillar(dayStem: string, hourKey: string): SajuPillar {
  const hourInfo = 시진목록.find((h) => h.key === hourKey);
  if (!hourInfo) throw new Error(`Invalid hour key: ${hourKey}`);

  const dayStemIdx = 천간.indexOf(dayStem as typeof 천간[number]);
  const startStem = 시간시작[dayStemIdx];
  const hourStemIdx = (startStem + hourInfo.지지idx) % 10;

  return {
    천간: 천간[hourStemIdx],
    지지: 지지[hourInfo.지지idx],
    label: 천간[hourStemIdx] + 지지[hourInfo.지지idx],
  };
}

/**
 * 오행 분포 계산
 */
function calcFiveElements(pillars: SajuPillar[]): FiveElements {
  const elements: FiveElements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  for (const pillar of pillars) {
    const stemElement = 천간오행[pillar.천간] as keyof FiveElements;
    const branchElement = 지지오행[pillar.지지] as keyof FiveElements;
    elements[stemElement]++;
    elements[branchElement]++;
  }

  return elements;
}

/**
 * 사주팔자 전체 계산
 */
export function calculateSaju(input: BirthInput): SajuResult {
  const 년주 = calcYearPillar(input.year);
  const 월주 = calcMonthPillar(input.year, input.month);
  const 일주 = calcDayPillar(input.year, input.month, input.day);
  const 시주 = input.hour ? calcHourPillar(일주.천간, input.hour) : null;

  const pillars = [년주, 월주, 일주];
  if (시주) pillars.push(시주);

  const 오행 = calcFiveElements(pillars);

  return { 년주, 월주, 일주, 시주, 오행 };
}
