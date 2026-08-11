import { useState } from 'react';
import NumberFlow from '@number-flow/react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { FormData } from '../types';
import {
  calcSeverance,
  calcSeveranceProjection,
  formatMoney,
  isEligible,
} from '../utils/calc';
import MoneyRain from '../components/MoneyRain';
import './SeverancePage.css';

function dotDate(date: string) {
  return date.replaceAll('-', '.');
}

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
      <nav className="sv-actions" aria-label="결과 화면 이동">
        <button className="action-secondary" type="button" onClick={() => navigate('/plaque', { state: data })}>이전으로</button>
        <button className="action-primary" type="button" onClick={() => navigate('/', { replace: true })}>처음부터</button>
      </nav>
      <button className="sv-share" type="button" onClick={handleShare}>
        {copied ? '링크 복사 완료' : '동료에게 공유하기'}
      </button>
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
          <img className="sv-pending-art" src="/pending-burst-calendars.png" alt="" />
        </div>
        <article className="sv-document sv-document--pending">
          <header className="sv-document-header">
            <h1>퇴직금존버통지서</h1>
            <div className="sv-double-rule" />
          </header>

          <dl className="sv-personal">
            <div><dt>성명</dt><dd>{data.name}</dd></div>
            <div><dt>소속 회사</dt><dd>{data.company}</dd></div>
            <div><dt>근무 기간</dt><dd>{dotDate(data.startDate)} ~ {dotDate(data.endDate)}</dd></div>
          </dl>

          <section className="sv-countdown" aria-labelledby="countdown-label">
            <img className="sv-calendar sv-calendar--one" src="/pending-calendar-1.png" alt="" aria-hidden="true" />
            <img className="sv-calendar sv-calendar--two" src="/pending-calendar-2.png" alt="" aria-hidden="true" />
            <img className="sv-calendar sv-calendar--three" src="/pending-calendar-3.png" alt="" aria-hidden="true" />
            <p id="countdown-label">퇴직금 수령까지</p>
            <div className="sv-burst-lines" aria-hidden="true" />
            <div className="sv-days"><span>D-</span><NumberFlow value={daysLeft} /></div>
          </section>

          <dl className="sv-summary">
            <div><dt>수령 가능일</dt><dd>{dotDate(targetDate)}</dd></div>
            <div><dt>그때 예상 퇴직금</dt><dd>{formatMoney(amount)}원</dd></div>
          </dl>

          <div className="sv-patience">
            <strong>조금만 더 버티십시오.</strong>
            <span className="sv-patience-seal" aria-hidden="true">존버</span>
          </div>

          <p className="sv-patience-copy">지금의 인내가<br />내일의 통장에 입금됩니다.</p>

          <p className="sv-disclaimer">본 결과는 예상 금액이며, 실제 정산 시 변동될 수 있습니다.</p>
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
          <h1>퇴직금명세서</h1>
          <div className="sv-double-rule" />
        </header>

        <dl className="sv-personal">
          <div><dt>성명</dt><dd>{data.name}</dd></div>
          <div><dt>소속 회사</dt><dd>{data.company}</dd></div>
          <div><dt>근무 기간</dt><dd>{dotDate(data.startDate)} ~ {dotDate(data.endDate)}</dd></div>
        </dl>

        <section className="sv-total" aria-labelledby="total-label">
          <p id="total-label">예상 퇴직금</p>
          <div className="sv-total-value">
            <NumberFlow value={amount} format={{ style: 'decimal' }} locales="ko-KR" />
            <span>원</span>
          </div>
        </section>

        <p className="sv-disclaimer">※ 본 명세서는 예상 퇴직금이며, 정산 시 변동될 수 있습니다.</p>

        <footer className="sv-confirmation">
          <time dateTime={data.endDate}>{dotDate(data.endDate)}</time>
          <div>
            <strong>{data.company}</strong>
            <span className="sv-confirm-seal" aria-label={`${data.company} 직인`}>
              <img src="/company-seal-ring.png" alt="" aria-hidden="true" />
              <span>{data.company}</span>
            </span>
          </div>
        </footer>
      </article>
      {actions}
    </main>
  );
}
