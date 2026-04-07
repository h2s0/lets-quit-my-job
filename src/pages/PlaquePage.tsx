import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import type { FormData } from '../types';
import { formatTenure } from '../utils/calc';
import './PlaquePage.css';

export default function PlaquePage() {
  const { state: data } = useLocation() as { state: FormData | null };
  const navigate = useNavigate();

  if (!data) return <Navigate to="/" replace />;

  const tenure = formatTenure(data.startDate, data.endDate);

  return (
    <div className="p-page">
      <div className="p-card">
        <div className="p-corner tl" /><div className="p-corner tr" />
        <div className="p-corner bl" /><div className="p-corner br" />

        <div className="p-hline" style={{ marginTop: '16px' }} />
        <div className="p-stars">
          <span>★</span><span>★</span><span>★</span>
        </div>
        <div className="p-badge-title">감 사 패</div>
        <div className="p-stars">
          <span>★</span><span>★</span><span>★</span>
        </div>
        <div className="p-hline" />

        <div className="p-name">{data.name} 님</div>
        {(data.team || data.position) && (
          <div className="p-meta">
            {[data.team, data.position].filter(Boolean).join(' · ')}
          </div>
        )}

        <p className="p-text">
          재직해 주신 <strong>{tenure}</strong> 동안<br />
          수고 많으셨습니다.<br /><br />
          {data.name}님 같은 인재를 만난 것은<br />
          <strong>{data.company}</strong>에게 큰 행운이었습니다.<br /><br />
          앞으로의 여정을 진심으로 응원합니다.
        </p>

        <button className="p-cta" onClick={() => navigate('/severance', { state: data })}>
          퇴 직 금 수 령 하 기 →
        </button>
      </div>
    </div>
  );
}
