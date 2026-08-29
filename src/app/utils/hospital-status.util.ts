export type HospitalStatus = '0' | '1';

export const HOSPITAL_STATUS_MAP: Record<
  HospitalStatus,
  { label: string; color: string }
> = {
  '0': {
    label: '非使用',
    color: '#4787FF',
  },
  '1': {
    label: '使用中',
    color: '#0FB95E',
  },
} as const;

/**
 * Resolves the string label representation of a hospital status code.
 *
 * @param status - The numeric status code (e.g. '0' or '1')
 * @returns The Japanese localized label string
 */
export function getHospitalStatusLabel(status?: string): string {
  return HOSPITAL_STATUS_MAP[status as HospitalStatus]?.label ?? '非使用';
}

/**
 * Resolves the hex outline color representation of a hospital status code.
 *
 * @param status - The numeric status code (e.g. '0' or '1')
 * @returns The hex representation string mapping to that status
 */
export function getHospitalStatusColor(status?: string): string {
  return HOSPITAL_STATUS_MAP[status as HospitalStatus]?.color ?? '#4787FF';
}
