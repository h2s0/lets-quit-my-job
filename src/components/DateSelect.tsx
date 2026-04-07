import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateSelect.css';

// 한국어 locale 직접 정의 (date-fns 의존성 없이)
registerLocale('ko', {
  localize: {
    month: (n: number) => ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'][n],
    day: (n: number) => ['일','월','화','수','목','금','토'][n],
    ordinalNumber: (n: number) => `${n}`,
    era: () => '',
    quarter: (n: number) => `${n}분기`,
    dayPeriod: () => '',
  },
  formatLong: {
    date: () => 'yyyy. MM. dd',
    time: () => 'HH:mm',
    dateTime: () => 'yyyy. MM. dd HH:mm',
  },
  match: {
    month: () => ({ value: 0, rest: '' } as never),
    day: () => ({ value: 0, rest: '' } as never),
    ordinalNumber: () => ({ value: 0, rest: '' } as never),
    era: () => ({ value: 0, rest: '' } as never),
    quarter: () => ({ value: 0, rest: '' } as never),
    dayPeriod: () => ({ value: 0, rest: '' } as never),
  },
  options: { weekStartsOn: 0 as const, firstWeekContainsDate: 1 },
} as never);

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function toDate(val: string): Date | null {
  if (!val) return null;
  const d = new Date(val + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function toStr(d: Date | null): string {
  if (!d) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export default function DateSelect({ value, onChange, placeholder = '날짜 선택' }: Props) {
  return (
    <DatePicker
      locale="ko"
      selected={toDate(value)}
      onChange={(d) => onChange(toStr(d))}
      dateFormat="yyyy. MM. dd"
      placeholderText={placeholder}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      className="ds-input"
      wrapperClassName="ds-wrapper"
      calendarClassName="ds-calendar"
    />
  );
}
