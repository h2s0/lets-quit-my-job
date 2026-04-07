import { useState } from 'react';
import type { FormData, Page } from './types';
import ResignationPage from './pages/ResignationPage';
import PlaquePage from './pages/PlaquePage';
import SeverancePage from './pages/SeverancePage';

const defaultData: FormData = {
  company: '',
  name: '',
  monthlySalary: 0,
  startDate: '',
  endDate: '',
  reason: '',
};

export default function App() {
  const [page, setPage] = useState<Page>('resignation');
  const [formData, setFormData] = useState<FormData>(defaultData);

  const handleResignSubmit = (data: FormData) => {
    setFormData(data);
    setPage('plaque');
  };

  const handleNext = () => setPage('severance');

  const handleRestart = () => {
    setFormData(defaultData);
    setPage('resignation');
  };

  if (page === 'resignation') return <ResignationPage onSubmit={handleResignSubmit} />;
  if (page === 'plaque') return <PlaquePage data={formData} onNext={handleNext} />;
  return <SeverancePage data={formData} onRestart={handleRestart} />;
}
