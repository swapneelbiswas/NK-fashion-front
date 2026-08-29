import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonLabels } from '@utils/ln/jp-localization';

/**
 * DateTimeFormat pipe.
 * Transforms a date string or Date object into a formatted string,
 * preserving the timezone if present in the input.
 * Returns 'Unknown' if the value is invalid or empty.
 */
@Pipe({
  name: 'keepTimezone',
  standalone: true,
})
export class DateTimeFormat implements PipeTransform {
  /**
   * Transforms a date string or Date object into a formatted string.
   *
   * @param value - The date to format (string or Date)
   * @param format - Date format pattern (default: 'yyyy/MM/dd H:mm')
   * @param locale - Locale string (default: 'en-US')
   * @returns Formatted date string, or 'Unknown' if value is invalid
   */
  transform(
    value: string | Date,
    format: string = 'yyyy/MM/dd H:mm',
    locale: string = 'en-US',
  ): string {
    if (!value) return 'Unknown';

    return formatDate(value, format, locale, this.extractTimezoneOffset(value));
  }

  /**
   * Extracts timezone offset from a date string, if present.
   *
   * @param value - The date string or Date object
   * @returns Timezone offset as '+HHMM' or undefined
   */
  private extractTimezoneOffset(value: string | Date): string | undefined {
    if (typeof value === 'string') {
      const match: RegExpMatchArray | null = value.match(
        /([+-]\d{2}):?(\d{2})$/,
      );
      if (match) {
        return `${match[1]}${match[2]}`;
      }
    }
    return undefined;
  }
}
/**
 * Formats a Date object into an English date string.
 *
 * @param date - The date to format
 * @returns Formatted date string in English format (e.g., "Aug 29 (Saturday)")
 */
export function formatJapaneseDate(date: Date): string {
  const weekdays: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const months: string[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const monthName: string = months[date.getMonth()];
  const day: number = date.getDate();
  const weekday: string = weekdays[date.getDay()];

  return `${monthName} ${day} (${weekday})`;
}

/**
 * Formats a Date object into a date and time string.
 *
 * @param date - The date to format
 * @returns Formatted date and time string in English format (e.g., "Aug 29 (Saturday) 14:30")
 */
export function formatJapaneseDateTime(date: Date): string {
  const datePart: string = formatJapaneseDate(date);
  const hours: string = date.getHours().toString().padStart(2, '0');
  const minutes: string = date.getMinutes().toString().padStart(2, '0');

  return `${datePart} ${hours}:${minutes}`;
}

/**
 * Formats a Date as a YYYY-MM-DD string for API payloads.
 *
 * @param date - The date to format
 * @returns The formatted date string (e.g., 2026-05-19)
 */
export function formatPayloadDate(date: Date): string {
  const y: number = date.getFullYear();
  const m: string = String(date.getMonth() + 1).padStart(2, '0');
  const d: string = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Converts a YYYY-MM-DD string to standard display format (e.g., 2026/05/19).
 *
 * @param dateStr - The YYYY-MM-DD date string, or null/undefined
 * @param placeholder - Returned when dateStr is empty (default: 'Select date')
 * @returns The formatted date string, or the placeholder
 */
export function displayDate(
  dateStr: string | null | undefined,
  placeholder: string = CommonLabels.DATE_PLACEHOLDER,
): string {
  if (!dateStr) return placeholder;
  const [y, m, d]: string[] = dateStr.split('-');
  return `${y}/${m}/${d}`;
}
