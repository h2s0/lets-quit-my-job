export interface FormData {
  company: string;
  name: string;
  monthlySalary: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export type Page = 'resignation' | 'plaque' | 'severance';
