import { CommonLabels } from '@utils/ln/jp-localization';

/**
 * Formats a floor string so that it displays with a single '階' suffix without
 * duplicating it if the API already returns '階' (e.g. '3階' vs '3').
 *
 * @param floor - The raw floor string from the API or user input (e.g. '3', '3階', or null)
 * @returns The formatted floor string with a single '階' suffix (e.g. '3階' or '')
 */
export function formatFloor(floor?: string | null): string {
  if (!floor) return String();
  const trimmed: string = floor.trim();
  if (!trimmed) return String();
  return trimmed.endsWith('階') ? trimmed : `${trimmed}${CommonLabels.FLOOR_SUFFIX}`;
}
