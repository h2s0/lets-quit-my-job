import { useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import type { FormData } from '../types';
import { formatTenure, isEligible } from '../utils/calc';
import CompanySeal from '../components/CompanySeal';
import './PlaquePage.css';

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error('저장 시간이 초과되었습니다.')), ms);
    }),
  ]);
}

export default function PlaquePage() {
  const { state: data } = useLocation() as { state: FormData | null };
  const navigate = useNavigate();
  const plaqueRef = useRef<HTMLElement>(null);
  const [saving, setSaving] = useState(false);

  if (!data) return <Navigate to="/" replace />;

  const tenure = formatTenure(data.startDate, data.endDate);
  const eligible = isEligible(data.startDate, data.endDate);

  const handleSaveImage = async () => {
    if (!plaqueRef.current || saving) return;
    setSaving(true);
    try {
      const dataUrl = await withTimeout(
        // Google Fonts를 @import로 불러오고 있어서, html-to-image가 폰트를 임베드하려고
        // 시도하는 과정(크로스오리진 스타일시트 파싱)에서 간헐적으로 멈추는 경우가 있어
        // skipFonts로 그 단계를 건너뛴다. 화면에 이미 렌더링된 폰트를 그대로 캡처하므로
        // 결과물에는 영향이 없다. 혹시 모를 다른 원인의 멈춤에 대비해 타임아웃도 건다.
        toPng(plaqueRef.current, { pixelRatio: 2, cacheBust: true, skipFonts: true }),
        10000,
      );
      const link = document.createElement('a');
      link.download = `${data.company}_${data.name}_감사패.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-page">
      <section className="p-award" aria-labelledby="plaque-title" ref={plaqueRef}>
        <div className="p-engraving">
          <div className="p-emblem" aria-hidden="true">
            <img src="/plaque-emblem-selected.webp" alt="" />
          </div>
          <h1 id="plaque-title">감사패</h1>
          <div className="p-rule" />
          <p className="p-recipient">{[data.position, data.name].filter(Boolean).join(' ')}</p>
          <p className="p-message">
            재직해 주신 <strong>{tenure}</strong> 동안<br />
            수고 많으셨습니다.<br />
            {data.name}님 같은 인재를 만난 것은<br />
            <strong>{data.company}</strong>에게 큰 행운이었습니다.<br />
            앞으로의 여정을<br />
            진심으로 응원합니다.
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
      <button
        className="p-save"
        type="button"
        onClick={handleSaveImage}
        disabled={saving}
        aria-label={saving ? '감사패 이미지 저장 중' : '감사패 이미지로 저장'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
    </main>
  );
}
