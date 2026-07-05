// 시급 계산 관련 유틸리티

// 법정 월 근무시간: 209시간 (주 40시간 + 주휴수당 기준)
const MONTHLY_WORK_HOURS = 209;
const MONTHS_PER_YEAR = 12;
const ANNUAL_WORK_HOURS = MONTHLY_WORK_HOURS * MONTHS_PER_YEAR; // 2508시간

/**
 * 연봉(만 원)을 시급(원)으로 변환
 */
export function calcHourlyWage(salaryManwon: number): number {
  const salaryWon = salaryManwon * 10000;
  return Math.round(salaryWon / ANNUAL_WORK_HOURS);
}

/**
 * 가격을 노동 시간(분)으로 환산
 */
export function calcWorkMinutes(priceWon: number, hourlyWage: number): number {
  if (hourlyWage <= 0) return 0;
  return Math.round((priceWon / hourlyWage) * 60);
}

/**
 * 분을 "N시간 N분" 형태의 문자열로 변환
 */
export function formatWorkTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

/**
 * 숫자를 한국 원화 형식으로 포맷 (예: 50000 → "50,000원")
 */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}
