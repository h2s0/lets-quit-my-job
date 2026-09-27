/** 재직일수 */
export function calcDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** 퇴직금 수급 자격 (재직 365일 이상) */
export function isEligible(startDate: string, endDate: string): boolean {
  return calcDays(startDate, endDate) >= 365;
}

/**
 * 퇴직금 계산
 * = (3개월 급여 합계 / 3개월 총일수) × 30 × (재직일수 / 365)
 * 1년 미만 근무 시 0 반환
 */
export function calcSeverance(monthlySalary: number, startDate: string, endDate: string): number {
  const workDays = calcDays(startDate, endDate);
  if (workDays < 365) return 0;

  const end = new Date(endDate);
  const threeMonthsAgo = new Date(end);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const threeMonthDays = Math.floor(
    (end.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dailyAvgWage = (monthlySalary * 3) / threeMonthDays;
  return Math.floor(dailyAvgWage * 30 * (workDays / 365));
}

/**
 * 1년 미만 근무자 대상: 1년 채울 때까지 남은 일수 + 그 시점의 예상 퇴직금
 */
export function calcSeveranceProjection(
  monthlySalary: number,
  startDate: string,
  endDate: string,
): { daysLeft: number; targetDate: string; amount: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const targetDate = new Date(start);
  targetDate.setFullYear(targetDate.getFullYear() + 1);

  const daysLeft = Math.max(
    0,
    Math.ceil((targetDate.getTime() - end.getTime()) / (1000 * 60 * 60 * 24)),
  );

  // 1년 시점 기준 3개월 평균임금
  const threeMonthsAgo = new Date(targetDate);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const threeMonthDays = Math.floor(
    (targetDate.getTime() - threeMonthsAgo.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dailyAvgWage = (monthlySalary * 3) / threeMonthDays;
  const amount = Math.floor(dailyAvgWage * 30); // workDays/365 = 1 at exactly 1 year

  return {
    daysLeft,
    targetDate: targetDate.toISOString().slice(0, 10),
    amount,
  };
}
