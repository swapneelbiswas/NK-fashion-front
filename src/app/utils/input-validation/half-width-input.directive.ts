import { Directive, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

// eslint-disable-next-line no-restricted-syntax -- single empty-string literal, reused below instead of repeating disables.
const EMPTY_STRING: string = '';

/**
 * Converts full-width (zenkaku) characters — digits, letters, symbols
 * (U+FF01-FF5E), and the ideographic space "　" (U+3000) — to their
 * half-width (hankaku) equivalents. Japanese kana/kanji fall outside
 * these ranges and pass through unchanged.
 *
 * @param value - the raw input string, possibly null or undefined.
 * @returns the half-width converted string, or an empty string when value is falsy.
 */
export function toHalfWidth(value: string | null | undefined): string {
  if (!value) return EMPTY_STRING;

  return value
    .replace(/[！-～]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xfee0),
    )
    .replace(/　/g, ' ');
}

/**
 * Reusable input behavior: applies toHalfWidth() to a text input as the
 * user types — e.g. "３３３３" becomes "3333". Works with both reactive
 * forms (formControlName) and template-driven forms (ngModel) since both
 * are exposed through NgControl.
 *
 * Skips `number` inputs, since the browser already restricts them to plain
 * half-width digits.
 *
 * Also strips a leading space as it's typed, and trims a trailing space
 * on blur — mid-string spaces (e.g. multi-word names) are left alone while
 * typing.
 *
 * Usage: <input type="text" formControlName="branch_code" appHalfWidth />
 * Also works on <textarea appHalfWidth>.
 */
@Directive({
  selector: 'input[appHalfWidth], textarea[appHalfWidth]',
  standalone: true,
})
export class HalfWidthInputDirective {
  constructor(@Optional() private ngControl: NgControl | null) {}

  /**
   * Converts the input's current value to half-width and strips a leading space.
   *
   * @param event - the native `input` event fired on each keystroke.
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input: HTMLInputElement | HTMLTextAreaElement =
      event.target as HTMLInputElement | HTMLTextAreaElement;
    if (input.type === 'number') return;

    const converted: string = toHalfWidth(input.value).replace(
      /^\s+/,
      EMPTY_STRING,
    );
    this.applyIfChanged(input, converted);
  }

  /**
   * Trims a trailing space from the input's value once the user leaves it.
   *
   * @param event - the native `blur` event.
   */
  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input: HTMLInputElement | HTMLTextAreaElement =
      event.target as HTMLInputElement | HTMLTextAreaElement;
    if (input.type === 'number') return;

    this.applyIfChanged(input, input.value.trim());
  }

  /**
   * Writes the converted value back to the input and the bound control,
   * preserving the caret position, but only when the value actually changed.
   *
   * @param input - the input or textarea element being edited.
   * @param converted - the half-width converted value to apply.
   */
  private applyIfChanged(
    input: HTMLInputElement | HTMLTextAreaElement,
    converted: string,
  ): void {
    if (converted === input.value) return;

    const caretPosition: number | null = input.selectionStart;
    input.value = converted;
    if (caretPosition !== null) {
      input.setSelectionRange(caretPosition, caretPosition);
    }

    this.ngControl?.control?.setValue(converted);
  }
}
