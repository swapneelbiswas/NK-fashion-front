import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

/**
 * Creates a validator function that checks whether a control's value
 * exceeds the specified maximum length.
 *
 * @param max - The maximum allowed number of characters.
 * @returns {ValidatorFn} A validator function that returns an error
 * object if the value length exceeds the limit, otherwise null.
 */
export function maxLengthFromConfig(max: number): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;

    return control.value.length > max ? { maxLengthExceeded: true } : null;
  };
}

/**
 * Validator for a FormArray that requires at least one control to hold a
 * non-empty (trimmed) value.
 *
 * @returns {ValidatorFn} A validator function that returns an error object
 * if every control in the array is empty, otherwise null.
 */
export function atLeastOneRequired(): ValidatorFn {
  return (control: AbstractControl) => {
    const formArray: FormArray = control as FormArray;
    const hasValue: boolean = !!formArray.controls?.some(
      (c) => (c.value ?? String()).toString().trim().length > 0,
    );

    return hasValue ? null : { atLeastOneRequired: true };
  };
}

/**
 * Group-level validator that requires two sibling controls to hold the
 * same (trimmed) value, e.g. a password and its confirmation field.
 *
 * @param controlKey - Name of the primary control (e.g. 'password').
 * @param matchingControlKey - Name of the control that must match it.
 * @returns {ValidatorFn} A validator function that sets the error on the
 * group when the values differ, otherwise null.
 */
export function passwordsMatch(
  controlKey: string,
  matchingControlKey: string,
): ValidatorFn {
  return (group: AbstractControl) => {
    const controlValue: string = (group.get(controlKey)?.value ?? String())
      .toString()
      .trim();
    const matchingValue: string = (
      group.get(matchingControlKey)?.value ?? String()
    )
      .toString()
      .trim();

    if (!matchingValue || controlValue === matchingValue) return null;

    return { passwordMismatch: true };
  };
}
