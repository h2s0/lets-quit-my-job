import type { ResignationFormData } from '@/types';

function isResignationFormData(value: unknown): value is ResignationFormData {
  return (
    typeof value === 'object'
    && value !== null
    && 'company' in value
    && typeof value.company === 'string'
    && 'team' in value
    && typeof value.team === 'string'
    && 'position' in value
    && typeof value.position === 'string'
    && 'name' in value
    && typeof value.name === 'string'
    && 'monthlySalary' in value
    && typeof value.monthlySalary === 'number'
    && 'startDate' in value
    && typeof value.startDate === 'string'
    && 'endDate' in value
    && typeof value.endDate === 'string'
    && 'reason' in value
    && typeof value.reason === 'string'
  );
}

export function getResignationRouteData(state: unknown): ResignationFormData | null {
  return isResignationFormData(state) ? state : null;
}
