import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { FormData } from '../types';
import { formatTenure, isEligible } from '../utils/calc';
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
          <h1 id="plaque-title">감 사 패</h1>
          <div className="p-rule" />
          <h2>{data.name} 님</h2>
          {(data.team || data.position) && (
            <p className="p-meta">{[data.team, data.position].filter(Boolean).join(' · ')}</p>
          )}
          <p className="p-message">
            <span>재직해 주신 <strong>{tenure}</strong> 동안<br />수고 많으셨습니다.</span>
            <span>{data.name}님 같은 인재를 만난 것은<br /><strong>{data.company}에게</strong><br />큰 행운이었습니다.</span>
            <span>앞으로의 여정을<br />진심으로 응원합니다.</span>
          </p>
          <div className="p-company">
            <span>{data.company}</span>
            <span className="p-company-seal" aria-hidden="true">
              <b>{data.company.replace(/\s*주식회사$/, '')}</b>
              {data.company.includes('주식회사') && <small>주식회사</small>}
            </span>
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
