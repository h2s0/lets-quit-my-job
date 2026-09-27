export function formatDotDate(date: string): string {
  return date.replaceAll('-', '.');
}

export function formatKoreanDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
}

export function parseDate(date: string): Date | null {
  if (!date) return null;
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function formatDateValue(date: Date | null): string {
  if (!date) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatTenure(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years}년`);
  if (months > 0) parts.push(`${months}개월`);
  return parts.join(' ') || '1개월 미만';
}
