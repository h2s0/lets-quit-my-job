import { useState } from 'react';
import type { FormData } from '../types';
import './ResignationPage.css';

interface Props {
  onSubmit: (data: FormData) => void;
}

const today = new Date().toISOString().slice(0, 10);

export default function ResignationPage({ onSubmit }: Props) {
  const [form, setForm] = useState<FormData>({
    company: '',
    name: '',
    monthlySalary: 0,
    startDate: '',
    endDate: today,
    reason: '일신상의 이유로 사직하고자 하오니 허락하여 주시기 바랍니다.',
  });

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = key === 'monthlySalary' ? Number(e.target.value.replace(/,/g, '')) : e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
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
    onSubmit(form);
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
              type="number"
              placeholder="3,500,000"
              value={form.monthlySalary || ''}
              onChange={set('monthlySalary')}
              min={0}
            />
          </div>

          <div className="r-field">
            <label className="r-label">재직 기간</label>
            <div className="r-period">
              <input
                className="r-input r-date"
                type="date"
                value={form.startDate}
                onChange={set('startDate')}
              />
              <span className="r-tilde">~</span>
              <input
                className="r-input r-date"
                type="date"
                value={form.endDate}
                onChange={set('endDate')}
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
