import { useState } from 'react';
import NumberFlow from '@number-flow/react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { FormData } from '@/types';
import {
  calcSeverance,
  calcSeveranceProjection,
  isEligible,
} from '@/utils/calc';
import { formatDate } from '@/utils/date';
import { formatMoney } from '@/utils/money';
import MoneyRain from '@/components/MoneyRain';
import CompanySeal from '@/components/CompanySeal';
import { Button, Typography } from '@/components/ui';
import '@/pages/SeverancePage.css';

export default function SeverancePage() {
  const { state: data } = useLocation() as { state: FormData | null };
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!data) return <Navigate to="/" replace />;

  const eligible = isEligible(data.startDate, data.endDate);
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('링크를 복사하지 못했습니다. 주소창의 주소를 복사해주세요.');
    }
  };

  const actions = (
    <>
      <Button className="sv-share" variant="outline" fullWidth onClick={handleShare}>
        {copied ? '링크 복사 완료' : '동료에게 퇴사 권유하기'}
      </Button>
      <nav className="sv-actions" aria-label="결과 화면 이동">
        <Button variant="secondary" onClick={() => navigate('/plaque', { state: data })}>이전으로</Button>
        <Button onClick={() => navigate('/', { replace: true })}>처음부터</Button>
      </nav>
    </>
  );

  if (!eligible) {
    const { daysLeft, targetDate, amount } = calcSeveranceProjection(
      data.monthlySalary,
      data.startDate,
      data.endDate,
    );

    return (
      <main className="sv-page sv-page--pending">
        <div className="sv-pending-art-clip" aria-hidden="true">
          <img className="sv-pending-art" src="/pending-burst-calendars.webp" alt="" />
        </div>
        <article className="sv-document sv-document--pending">
          <header className="sv-document-header">
            <Typography as="h1" variant="heading-lg" serif>퇴직금존버통지서</Typography>
            <div className="sv-double-rule" />
          </header>

          <dl className="sv-personal">
            <div><Typography as="dt" variant="caption" serif>성명</Typography><Typography as="dd" variant="caption" serif>{data.name}</Typography></div>
            <div><Typography as="dt" variant="caption" serif>소속 회사</Typography><Typography as="dd" variant="caption" serif>{data.company}</Typography></div>
            <div><Typography as="dt" variant="caption" serif>근무 기간</Typography><Typography as="dd" variant="caption" serif>{formatDate(data.startDate)} ~ {formatDate(data.endDate)}</Typography></div>
          </dl>

          <section className="sv-countdown" aria-labelledby="countdown-label">
            <img className="sv-calendar sv-calendar--one" src="/pending-calendar-1.webp" alt="" aria-hidden="true" />
            <img className="sv-calendar sv-calendar--two" src="/pending-calendar-2.webp" alt="" aria-hidden="true" />
            <img className="sv-calendar sv-calendar--three" src="/pending-calendar-3.webp" alt="" aria-hidden="true" />
            <Typography id="countdown-label" variant="body-lg" serif>퇴직금 수령까지</Typography>
            <div className="sv-burst-lines" aria-hidden="true" />
            <Typography as="div" variant="display" serif className="sv-days"><span>D-</span><NumberFlow value={daysLeft} /></Typography>
          </section>

          <dl className="sv-summary">
            <div><Typography as="dt" variant="caption" serif>수령 가능일</Typography><Typography as="dd" variant="body-sm" serif>{formatDate(targetDate)}</Typography></div>
            <div><Typography as="dt" variant="caption" serif>그때 예상 퇴직금</Typography><Typography as="dd" variant="body-sm" serif>{formatMoney(amount)}원</Typography></div>
          </dl>

          <div className="sv-patience">
            <Typography as="strong" variant="body-lg" serif>조금만 더 버티십시오.</Typography>
            <Typography as="span" variant="heading-sm" serif className="sv-patience-seal" aria-hidden="true">존버</Typography>
          </div>

          <Typography variant="caption" serif className="sv-patience-copy">지금의 인내가<br />내일의 통장에 입금됩니다.</Typography>

          <Typography variant="caption" serif leading="relaxed" className="sv-disclaimer">본 결과는 예상 금액이며, 실제 정산 시 변동될 수 있습니다.</Typography>
        </article>
        {actions}
      </main>
    );
  }

  const amount = calcSeverance(data.monthlySalary, data.startDate, data.endDate);

  return (
    <main className="sv-page">
      <MoneyRain />
      <article className="sv-document">
        <header className="sv-document-header">
          <Typography as="h1" variant="heading-lg" serif>퇴직금명세서</Typography>
          <div className="sv-double-rule" />
        </header>

        <dl className="sv-personal">
          <div><Typography as="dt" variant="caption" serif>성명</Typography><Typography as="dd" variant="caption" serif>{data.name}</Typography></div>
          <div><Typography as="dt" variant="caption" serif>소속 회사</Typography><Typography as="dd" variant="caption" serif>{data.company}</Typography></div>
          <div><Typography as="dt" variant="caption" serif>근무 기간</Typography><Typography as="dd" variant="caption" serif>{formatDate(data.startDate)} ~ {formatDate(data.endDate)}</Typography></div>
        </dl>

        <section className="sv-total" aria-labelledby="total-label">
          <Typography id="total-label" variant="body-lg" serif>예상 퇴직금</Typography>
          <Typography as="div" variant="display" serif className="sv-total-value">
            <NumberFlow value={amount} format={{ style: 'decimal' }} locales="ko-KR" />
            <Typography as="span" variant="heading-md" serif>원</Typography>
          </Typography>
        </section>

        <Typography variant="caption" serif leading="loose" className="sv-disclaimer">
          ※ 본 명세서는 예상 퇴직금이며,<br />
          정산 시 변동될 수 있습니다.
        </Typography>

        <footer className="sv-confirmation">
          <Typography as="time" variant="body-sm" serif dateTime={data.endDate}>{formatDate(data.endDate, 'korean')}</Typography>
          <div>
            <Typography as="strong" variant="body-sm" serif>{data.company}</Typography>
            <CompanySeal company={data.company} />
          </div>
        </footer>
      </article>
      {actions}
    </main>
  );
}
