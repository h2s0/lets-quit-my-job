import type { FormData } from '../types';
import { calcSeverance, formatMoney } from '../utils/calc';
import MoneyRain from '../components/MoneyRain';
import './SeverancePage.css';

interface Props {
  data: FormData;
  onRestart: () => void;
}

export default function SeverancePage({ data, onRestart }: Props) {
  const amount = calcSeverance(data.monthlySalary, data.startDate, data.endDate);

  return (
    <div className="sv-page">
      <MoneyRain />

      <div className="sv-card">
        <div className="sv-header">
          <span>— 퇴 직 금 영 수 증 —</span>
        </div>

        <div className="sv-main">
          <div className="sv-congrats">🎉 수고하셨습니다, {data.name} 님!</div>

          <div className="sv-amount-box">
            <div className="sv-amount-label">최 종 퇴 직 금</div>
            <div className="sv-amount-number">
              {formatMoney(amount)}
            </div>
            <div className="sv-amount-unit">원 ( KRW )</div>
          </div>

          <div className="sv-info">
            <span>{data.company}</span>
            <span>{data.startDate} ~ {data.endDate}</span>
          </div>
        </div>

        <button className="sv-restart" onClick={onRestart}>
          동 료 에 게 퇴 사 권 유 하 기 →
        </button>
      </div>
    </div>
  );
}
