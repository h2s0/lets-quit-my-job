import DatePicker, { registerLocale } from 'react-datepicker';
import { formatDateValue, parseDate } from '@/utils/date';
import { inputClassName } from '@/components/ui';
import '@/components/DateSelect.css';

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
  id?: string;
  invalid?: boolean;
  describedBy?: string;
}

export default function DateSelect({
  value,
  onChange,
  placeholder = '날짜 선택',
  id,
  invalid = false,
  describedBy,
}: Props) {
  return (
    <DatePicker
      id={id}
      ariaInvalid={invalid ? 'true' : 'false'}
      ariaDescribedBy={describedBy}
      locale="ko"
      selected={parseDate(value)}
      onChange={(date: Date | null) => onChange(formatDateValue(date))}
      dateFormat="yyyy. MM. dd"
      placeholderText={placeholder}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      className={inputClassName({
        variant: 'document',
        inputSize: 'sm',
        invalid,
        className: 'ds-input font-serif tracking-wide',
      })}
      wrapperClassName="ds-wrapper"
      calendarClassName="ds-calendar"
      popperClassName="ds-popper"
      popperPlacement="bottom-start"
      portalId="date-picker-root"
    />
  );
}
