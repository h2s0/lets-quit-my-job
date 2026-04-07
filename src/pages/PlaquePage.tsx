import type { FormData } from '../types';
import { formatTenure } from '../utils/calc';
import './PlaquePage.css';

interface Props {
  data: FormData;
  onNext: () => void;
}

export default function PlaquePage({ data, onNext }: Props) {
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
        <div className="p-subtitle">{data.name.replace(/\s/g, '').toUpperCase()}</div>

        <p className="p-text">
          재직해 주신 <strong>{tenure}</strong> 동안<br />
          수고 많으셨습니다.<br /><br />
          귀하 같은 인재를 만난 것은<br />
          <strong>{data.company}</strong>에게<br />
          큰 행운이었습니다.<br /><br />
          앞으로의 여정을 진심으로<br />
          응원합니다.
        </p>

        <div className="p-seal">
          <span className="p-seal-text">{data.company}<br />직인</span>
        </div>

        <button className="p-cta" onClick={onNext}>
          퇴 직 금 수 령 하 기 →
        </button>
      </div>
    </div>
  );
}
