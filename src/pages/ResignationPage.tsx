import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FormData } from '../types';
import DateSelect from '../components/DateSelect';
import './ResignationPage.css';

const today = new Date().toISOString().slice(0, 10);

type RequiredField = 'company' | 'team' | 'position' | 'name' | 'monthlySalary' | 'startDate' | 'endDate';
type ValidationField = RequiredField | 'stamp';
type ValidationErrors = Partial<Record<ValidationField, true>>;

function formatKoreanDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
}

export default function ResignationPage() {
  const navigate = useNavigate();
  const [stamped, setStamped] = useState(false);
  const [stampRun, setStampRun] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formMessage, setFormMessage] = useState('');
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
    if (key in errors) {
      setErrors((previous) => ({ ...previous, [key]: undefined }));
      setFormMessage('');
    }
  };

  const focusFirstError = (nextErrors: ValidationErrors) => {
    const order: ValidationField[] = ['company', 'team', 'position', 'name', 'monthlySalary', 'startDate', 'endDate', 'stamp'];
    const first = order.find((field) => nextErrors[field]);
    const ids: Record<ValidationField, string> = {
      company: 'company',
      team: 'team',
      position: 'position',
      name: 'name',
      monthlySalary: 'salary',
      startDate: 'start-date',
      endDate: 'end-date',
      stamp: 'applicant-seal',
    };

    if (first) window.requestAnimationFrame(() => document.getElementById(ids[first])?.focus());
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
    const nextErrors: ValidationErrors = {};
    if (!form.company.trim()) nextErrors.company = true;
    if (!form.team.trim()) nextErrors.team = true;
    if (!form.position.trim()) nextErrors.position = true;
    if (!form.name.trim()) nextErrors.name = true;
    if (form.monthlySalary <= 0) nextErrors.monthlySalary = true;
    if (!form.startDate) nextErrors.startDate = true;
    if (!form.endDate) nextErrors.endDate = true;
    if (!stamped) nextErrors.stamp = true;

    const invalidDateOrder = form.startDate && form.endDate
      && new Date(form.startDate) >= new Date(form.endDate);
    if (invalidDateOrder) {
      nextErrors.startDate = true;
      nextErrors.endDate = true;
    }

    if (Object.keys(nextErrors).length > 0) {
      const invalidInputs = Object.keys(nextErrors).filter((field) => field !== 'stamp');
      setErrors(nextErrors);
      setFormMessage(invalidDateOrder
        ? '입사일은 최종근무일보다 앞이어야 합니다.'
        : invalidInputs.length > 0
          ? '붉게 표시된 항목을 입력해주세요.'
          : '');
      focusFirstError(nextErrors);
      return;
    }
    navigate('/plaque', { state: form });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStamped(false);
    setStampRun(0);
    setErrors((previous) => ({ ...previous, name: undefined, stamp: undefined }));
    setFormMessage('');
    setForm((previous) => ({ ...previous, name: event.target.value }));
  };

  const handleStamp = () => {
    if (!form.name.trim()) {
      const nextErrors: ValidationErrors = { ...errors, name: true, stamp: true };
      setErrors(nextErrors);
      setFormMessage('신청인 이름을 입력한 뒤 도장을 찍어주세요.');
      focusFirstError(nextErrors);
      return;
    }
    setStamped(false);
    window.requestAnimationFrame(() => {
      setStampRun((previous) => previous + 1);
      setStamped(true);
      setErrors((previous) => ({ ...previous, stamp: undefined }));
      setFormMessage('');
    });
  };

  return (
    <main className="r-page">
      <form className="r-document" onSubmit={handleSubmit} noValidate>
        <header className="r-header">
          <p className="r-kicker">RESIGNATION LETTER</p>
          <h1 className="r-title">사 직 서</h1>
          <div className="r-double-rule" />
        </header>

        <section className="r-fields" aria-label="사직 정보 입력">
          <div className="r-table">
            <label htmlFor="company">소속 회사</label>
            <input className={errors.company ? 'is-invalid' : ''} id="company" type="text" placeholder="회사명을 입력하세요" value={form.company} onChange={set('company')} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? 'form-validation-message' : undefined} required />

            <label htmlFor="team">소속 팀</label>
            <input className={errors.team ? 'is-invalid' : ''} id="team" type="text" placeholder="팀명을 입력하세요" value={form.team} onChange={set('team')} aria-invalid={Boolean(errors.team)} aria-describedby={errors.team ? 'form-validation-message' : undefined} required />

            <label htmlFor="position">직급</label>
            <input className={errors.position ? 'is-invalid' : ''} id="position" type="text" placeholder="직급" value={form.position} onChange={set('position')} aria-invalid={Boolean(errors.position)} aria-describedby={errors.position ? 'form-validation-message' : undefined} required />

            <label htmlFor="name">성명</label>
            <input className={errors.name ? 'is-invalid' : ''} id="name" type="text" placeholder="이름" value={form.name} onChange={handleNameChange} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'form-validation-message' : undefined} required />
          </div>

          <div className="r-lines">
            <div className={`r-line-field${errors.monthlySalary ? ' is-invalid' : ''}`}>
              <label htmlFor="salary">월 급여</label>
              <div className="r-line-control">
                <input
                  id="salary"
                  type="text"
                  inputMode="numeric"
                  placeholder="3,500,000"
                  value={form.monthlySalary ? form.monthlySalary.toLocaleString() : ''}
                  onChange={set('monthlySalary')}
                  aria-invalid={Boolean(errors.monthlySalary)}
                  aria-describedby={errors.monthlySalary ? 'form-validation-message' : undefined}
                  required
                />
                <span>원</span>
              </div>
              {form.monthlySalary > 0 && <small>{toKoreanMoney(form.monthlySalary)}</small>}
            </div>

            <div className={`r-line-field${errors.startDate ? ' is-invalid' : ''}`}>
              <label className="r-line-label" htmlFor="start-date">입사일자</label>
              <DateSelect
                id="start-date"
                value={form.startDate}
                invalid={Boolean(errors.startDate)}
                describedBy={errors.startDate ? 'form-validation-message' : undefined}
                onChange={(value) => {
                  setForm((previous) => ({ ...previous, startDate: value }));
                  setErrors((previous) => ({ ...previous, startDate: undefined, endDate: undefined }));
                  setFormMessage('');
                }}
              />
            </div>

            <div className={`r-line-field${errors.endDate ? ' is-invalid' : ''}`}>
              <label className="r-line-label" htmlFor="end-date">최종근무일</label>
              <DateSelect
                id="end-date"
                value={form.endDate}
                invalid={Boolean(errors.endDate)}
                describedBy={errors.endDate ? 'form-validation-message' : undefined}
                onChange={(value) => {
                  setForm((previous) => ({ ...previous, endDate: value }));
                  setErrors((previous) => ({ ...previous, startDate: undefined, endDate: undefined }));
                  setFormMessage('');
                }}
              />
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
            <div className={`r-applicant${errors.stamp ? ' is-invalid' : ''}`}>
              <span>신청인</span>
              <strong>{form.name || '○ ○ ○'}</strong>
              <button
                className={`r-name-seal${stamped ? ' is-stamped' : ''}`}
                id="applicant-seal"
                type="button"
                onClick={handleStamp}
                aria-label={stamped ? `${form.name} 도장 찍힘, 다시 찍기` : '신청인 도장 찍기'}
                aria-describedby={errors.stamp ? 'stamp-validation-message' : undefined}
              >
                <span>{form.name.trim() ? form.name.slice(0, 6) : '도장'}</span>
              </button>
              <img
                key={stampRun}
                className={`r-stamp-tool${stampRun > 0 ? ' is-running' : ''}`}
                src="/resignation-stamp.webp"
                alt=""
                aria-hidden="true"
              />
            </div>
            {errors.stamp && <small className="r-stamp-error" id="stamp-validation-message">신청인 도장을 찍어주세요.</small>}
          </div>
        </section>

        {formMessage && <p className="r-form-error" id="form-validation-message" role="alert">{formMessage}</p>}
        <button className="r-submit" type="submit">사직서 제출하기</button>
      </form>
    </main>
  );
}
