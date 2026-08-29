/**
 * Determines whether a delivery response has non-empty notes.
 *
 * @param response - Any delivery response object that may carry a notes field
 * @param response.notes - Optional notes string attached to the response
 * @returns `true` if the response contains a non-empty notes string
 */
export function hasNotes(response: { notes?: string }): boolean {
  return !!response.notes?.trim();
}
