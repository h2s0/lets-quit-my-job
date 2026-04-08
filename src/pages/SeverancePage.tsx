import { useState } from "react";
import type { FormData } from "../types";
import { calcSeverance, formatMoney } from "../utils/calc";
import MoneyRain from "../components/MoneyRain";
import "./SeverancePage.css";

interface Props {
  data: FormData;
  onRestart: () => void;
}

export default function SeverancePage({ data, onRestart }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.origin + '/';
    if (navigator.share) {
      await navigator.share({ title: '나도 퇴사할래', url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const amount = calcSeverance(
    data.monthlySalary,
    data.startDate,
    data.endDate,
  );

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
            <div className="sv-amount-number">{formatMoney(amount)}</div>
            <div className="sv-amount-unit">원 ( KRW )</div>
          </div>

          <div className="sv-info">
            <span>{data.company}</span>
            <span>
              {data.startDate} ~ {data.endDate}
            </span>
          </div>
        </div>

        <button className="sv-restart" onClick={handleShare}>
          {copied ? "링 크 복 사 완 료 ✓" : "동 료 에 게 퇴 사 권 유 하 기 →"}
        </button>
        <button className="sv-back" onClick={onRestart}>
          처 음 으 로
        </button>
      </div>
    </div>
  );
}
