import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import NumberFlow from "@number-flow/react";
import type { FormData } from "../types";
import {
  calcSeverance,
  calcSeveranceProjection,
  isEligible,
  formatMoney,
} from "../utils/calc";
import MoneyRain from "../components/MoneyRain";
import "./SeverancePage.css";

export default function SeverancePage() {
  const { state: data } = useLocation() as { state: FormData | null };
  const [copied, setCopied] = useState(false);

  if (!data) return <Navigate to="/" replace />;

  const eligible = isEligible(data.startDate, data.endDate);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.origin + "/");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!eligible) {
    const { daysLeft, targetDate, amount } = calcSeveranceProjection(
      data.monthlySalary,
      data.startDate,
      data.endDate,
    );

    return (
      <div className="sv-page">
        <div className="sv-card">
          <div className="sv-header">
            <span>— 퇴 직 금 존 버 계 산 기 —</span>
          </div>

          <div className="sv-main">
            <div className="sv-congrats">💪 조금만 더, {data.name} {data.position}!</div>

            <div className="sv-amount-box sv-amount-box--pending">
              <div className="sv-amount-label">퇴직금 수령까지</div>
              <NumberFlow className="sv-amount-number sv-days-number" value={daysLeft} />
              <div className="sv-amount-unit">일 남음</div>
            </div>

            <div className="sv-projection">
              <div className="sv-projection-row">
                <span className="sv-projection-label">수령 가능일</span>
                <span className="sv-projection-value">{targetDate}</span>
              </div>
              <div className="sv-projection-row">
                <span className="sv-projection-label">예상 퇴직금</span>
                <span className="sv-projection-value sv-projection-amount">
                  {formatMoney(amount)}원
                </span>
              </div>
              <div className="sv-projection-note">
                * 현재 월 급여({formatMoney(data.monthlySalary)}원) 기준
              </div>
            </div>

            <div className="sv-info">
              <span>{data.company}</span>
              <span>{data.startDate} ~ {data.endDate}</span>
            </div>
          </div>

          <button className="sv-restart" onClick={handleShare}>
            {copied ? "링크복사완료 ✓" : "동료에게 퇴사 권유하기 →"}
          </button>
        </div>
      </div>
    );
  }

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
            <NumberFlow
              className="sv-amount-number"
              value={amount}
              format={{ style: "decimal" }}
              locales="ko-KR"
            />
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
          {copied ? "링크복사완료 ✓" : "동료에게 퇴사 권 유하기 →"}
        </button>
      </div>
    </div>
  );
}
