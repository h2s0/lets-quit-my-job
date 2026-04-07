import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormData } from '../types';
import DateSelect from '../components/DateSelect';
import './ResignationPage.css';

const today = new Date().toISOString().slice(0, 10);

export default function ResignationPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    company: '',
    team: '',
    position: '',
    name: '',
    monthlySalary: 0,
    startDate: '',
    endDate: today,
    reason: '일신상의 이유로 사직하고자 하오니 허락하여 주시기 바랍니다.',
  });

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = key === 'monthlySalary' ? Number(e.target.value.replace(/[^0-9]/g, '')) : e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const toKoreanMoney = (n: number): string => {
    if (!n || n <= 0) return '';
    const uk = Math.floor(n / 100_000_000);
    const man = Math.floor((n % 100_000_000) / 10_000);
    const rest = n % 10_000;
    const parts: string[] = [];
    if (uk > 0) parts.push(`${uk.toLocaleString()}억`);
    if (man > 0) parts.push(`${man.toLocaleString()}만`);
    if (rest > 0) {
      const cheon = Math.floor(rest / 1000);
      const baek = Math.floor((rest % 1000) / 100);
      const sip = Math.floor((rest % 100) / 10);
      const il = rest % 10;
      let s = '';
      if (cheon) s += `${cheon}천`;
      if (baek) s += `${baek}백`;
      if (sip) s += `${sip}십`;
      if (il) s += `${il}`;
      parts.push(s);
    }
    return parts.join(' ') + '원';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.name || !form.monthlySalary || !form.startDate || !form.endDate) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      alert('입사일이 퇴사일보다 앞이어야 합니다.');
      return;
    }
    navigate('/plaque', { state: form });
  };

  return (
    <div className="r-page">
      <form className="r-card" onSubmit={handleSubmit}>
        <div className="r-header">
          <div className="r-deco" />
          <h1 className="r-title">사 직 서</h1>
          <div className="r-deco" />
        </div>
        <div className="r-divider" />

        <div className="r-body">
          <div className="r-field">
            <label className="r-label">소속 회사</label>
            <input
              className="r-input"
              type="text"
              placeholder="(주) ○○○○"
              value={form.company}
              onChange={set('company')}
            />
          </div>

          <div className="r-row">
            <div className="r-field">
              <label className="r-label">소속 팀</label>
              <input
                className="r-input"
                type="text"
                placeholder="개발팀"
                value={form.team}
                onChange={set('team')}
              />
            </div>
            <div className="r-field">
              <label className="r-label">직 급</label>
              <input
                className="r-input"
                type="text"
                placeholder="대리"
                value={form.position}
                onChange={set('position')}
              />
            </div>
          </div>

          <div className="r-field">
            <label className="r-label">성 명</label>
            <input
              className="r-input"
              type="text"
              placeholder="홍 길 동"
              value={form.name}
              onChange={set('name')}
            />
          </div>

          <div className="r-field">
            <label className="r-label">최근 월 급여 (원)</label>
            <input
              className="r-input"
              type="text"
              inputMode="numeric"
              placeholder="3,500,000"
              value={form.monthlySalary ? form.monthlySalary.toLocaleString() : ''}
              onChange={set('monthlySalary')}
            />
            {form.monthlySalary > 0 && (
              <span className="r-salary-hint">{toKoreanMoney(form.monthlySalary)}</span>
            )}
          </div>

          <div className="r-field">
            <label className="r-label">재직 기간</label>
            <div className="r-period">
              <DateSelect
                value={form.startDate}
                onChange={(val) => setForm((prev) => ({ ...prev, startDate: val }))}
              />
              <span className="r-tilde">~</span>
              <DateSelect
                value={form.endDate}
                onChange={(val) => setForm((prev) => ({ ...prev, endDate: val }))}
              />
            </div>
          </div>

          <div className="r-ruling" />

          <div className="r-field">
            <label className="r-label">사직 사유</label>
            <textarea
              className="r-textarea"
              rows={4}
              value={form.reason}
              onChange={set('reason')}
            />
          </div>
        </div>

        <button className="r-btn" type="submit">
          <span className="stamp-dot" />
          퇴 사 하 기
          <span className="stamp-dot" />
        </button>
      </form>
    </div>
  );
}
