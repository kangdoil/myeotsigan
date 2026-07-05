// 로컬스토리지 키 상수
export const STORAGE_KEYS = {
  SALARY: 'myeotsigan_salary',               // 연봉 (만 원)
  HOURLY_WAGE: 'myeotsigan_hourly_wage',      // 시급 (원)
  ONBOARDING_DONE: 'myeotsigan_onboarding_done',
  TOTAL_BUY_MINUTES: 'myeotsigan_total_buy_minutes', // 살래요 누적 노동 시간 (분)
} as const;

export function getStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
}

export function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 스토리지 쓰기 실패 무시
  }
}

export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // 스토리지 삭제 실패 무시
  }
}
