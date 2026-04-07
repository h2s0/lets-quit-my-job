import { Routes, Route, Navigate } from 'react-router-dom';
import ResignationPage from './pages/ResignationPage';
import PlaquePage from './pages/PlaquePage';
import SeverancePage from './pages/SeverancePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ResignationPage />} />
      <Route path="/plaque" element={<PlaquePage />} />
      <Route path="/severance" element={<SeverancePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
