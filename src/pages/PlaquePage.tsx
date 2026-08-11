import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { FormData } from '../types';
import { formatTenure, isEligible } from '../utils/calc';
import CompanySeal from '../components/CompanySeal';
import './PlaquePage.css';

export default function PlaquePage() {
  const { state: data } = useLocation() as { state: FormData | null };
  const navigate = useNavigate();

  if (!data) return <Navigate to="/" replace />;

  const tenure = formatTenure(data.startDate, data.endDate);
  const eligible = isEligible(data.startDate, data.endDate);

  return (
    <main className="p-page">
      <section className="p-award" aria-labelledby="plaque-title">
        <div className="p-engraving">
          <div className="p-emblem" aria-hidden="true">
            <img src="/plaque-emblem-selected.png" alt="" />
          </div>
          <h1 id="plaque-title">감사패</h1>
          <div className="p-rule" />
          <p className="p-recipient">{[data.position, data.name].filter(Boolean).join(' ')}</p>
          <p className="p-message">
            <span>재직해 주신 <strong>{tenure}</strong> 동안<br />수고 많으셨습니다.</span>
            <span>{data.name}님 같은 인재를 만난 것은<br /><strong>{data.company}에게</strong><br />큰 행운이었습니다.</span>
            <span>앞으로의 여정을<br />진심으로 응원합니다.</span>
          </p>
          <div className="p-company">
            <span className="p-company-copy">
              <strong>{data.company}</strong>
              <span>{data.team} 일동</span>
            </span>
            <CompanySeal company={data.company} />
          </div>
        </div>
      </section>

      <nav className="p-actions" aria-label="감사패 단계 이동">
        <button className="action-secondary" type="button" onClick={() => navigate('/')}>이전으로</button>
        <button
          className="action-primary"
          type="button"
          onClick={() => navigate('/severance', { state: data })}
        >
          {eligible ? '퇴직금 확인하기' : '존버 D-day 확인하기'}
        </button>
      </nav>
    </main>
  );
}
