import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormData } from '../types';
import DateSelect from '../components/DateSelect';
import './ResignationPage.css';

const today = new Date().toISOString().slice(0, 10);

function formatKoreanDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
}

export default function ResignationPage() {
  const navigate = useNavigate();
  const [stamped, setStamped] = useState(false);
  const [stampRun, setStampRun] = useState(0);
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

  const set = (key: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = key === 'monthlySalary'
      ? Number(event.target.value.replace(/[^0-9]/g, ''))
      : event.target.value;
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const toKoreanMoney = (amount: number): string => {
    if (!amount || amount <= 0) return '';
    const uk = Math.floor(amount / 100_000_000);
    const man = Math.floor((amount % 100_000_000) / 10_000);
    const rest = amount % 10_000;
    const parts: string[] = [];
    if (uk > 0) parts.push(`${uk.toLocaleString()}억`);
    if (man > 0) parts.push(`${man.toLocaleString()}만`);
    if (rest > 0) parts.push(rest.toLocaleString());
    return `${parts.join(' ')}원`;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.company || !form.name || !form.monthlySalary || !form.startDate || !form.endDate) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      alert('입사일이 퇴사일보다 앞이어야 합니다.');
      return;
    }
    navigate('/plaque', { state: form });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStamped(false);
    setStampRun(0);
    setForm((previous) => ({ ...previous, name: event.target.value }));
  };

  const handleStamp = () => {
    if (!form.name.trim()) {
      alert('도장을 찍을 이름을 먼저 입력해주세요.');
      return;
    }
    setStamped(false);
    window.requestAnimationFrame(() => {
      setStampRun((previous) => previous + 1);
      setStamped(true);
    });
  };

  return (
    <main className="r-page">
      <form className="r-document" onSubmit={handleSubmit}>
        <header className="r-header">
          <p className="r-kicker">RESIGNATION LETTER</p>
          <h1 className="r-title">사 직 서</h1>
          <div className="r-double-rule" />
        </header>

        <section className="r-fields" aria-label="사직 정보 입력">
          <div className="r-table">
            <label htmlFor="company">소속 회사</label>
            <input id="company" type="text" placeholder="회사명을 입력하세요" value={form.company} onChange={set('company')} required />

            <label htmlFor="team">소속 팀</label>
            <input id="team" type="text" placeholder="팀명을 입력하세요" value={form.team} onChange={set('team')} />

            <label htmlFor="position">직급</label>
            <input id="position" type="text" placeholder="직급" value={form.position} onChange={set('position')} />

            <label htmlFor="name">성명</label>
            <input id="name" type="text" placeholder="이름" value={form.name} onChange={handleNameChange} required />
          </div>

          <div className="r-lines">
            <div className="r-line-field">
              <label htmlFor="salary">월 급여</label>
              <div className="r-line-control">
                <input
                  id="salary"
                  type="text"
                  inputMode="numeric"
                  placeholder="3,500,000"
                  value={form.monthlySalary ? form.monthlySalary.toLocaleString() : ''}
                  onChange={set('monthlySalary')}
                  required
                />
                <span>원</span>
              </div>
              {form.monthlySalary > 0 && <small>{toKoreanMoney(form.monthlySalary)}</small>}
            </div>

            <div className="r-line-field">
              <span className="r-line-label">입사일자</span>
              <DateSelect value={form.startDate} onChange={(value) => setForm((previous) => ({ ...previous, startDate: value }))} />
            </div>

            <div className="r-line-field">
              <span className="r-line-label">최종근무일</span>
              <DateSelect value={form.endDate} onChange={(value) => setForm((previous) => ({ ...previous, endDate: value }))} />
            </div>
          </div>

          <div className="r-reason">
            <label htmlFor="reason">사직 사유</label>
            <textarea id="reason" rows={4} value={form.reason} onChange={set('reason')} />
          </div>

          <p className="r-declaration">
            본인은 위와 같은 사유로 사직하고자 하오니<br />허락하여 주시기 바랍니다.
          </p>

          <div className="r-signature">
            <time dateTime={today}>{formatKoreanDate(today)}</time>
            <div className="r-applicant">
              <span>신청인</span>
              <strong>{form.name || '○ ○ ○'}</strong>
              <button
                className={`r-name-seal${stamped ? ' is-stamped' : ''}`}
                type="button"
                onClick={handleStamp}
                aria-label={stamped ? `${form.name} 도장 찍힘, 다시 찍기` : '신청인 도장 찍기'}
              >
                <span>{form.name.trim() ? form.name.slice(0, 3) : '도장'}</span>
              </button>
              <img
                key={stampRun}
                className={`r-stamp-tool${stampRun > 0 ? ' is-running' : ''}`}
                src="/resignation-stamp.png"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        <button className="r-submit" type="submit">사직서 제출하기</button>
      </form>
    </main>
  );
}
