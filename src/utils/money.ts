export function formatMoney(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

export function formatKoreanMoney(amount: number): string {
  if (!amount || amount <= 0) return '';

  const uk = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);
  const rest = amount % 10_000;
  const parts: string[] = [];

  if (uk > 0) parts.push(`${uk.toLocaleString()}억`);
  if (man > 0) parts.push(`${man.toLocaleString()}만`);
  if (rest > 0) parts.push(rest.toLocaleString());

  return `${parts.join(' ')}원`;
}
