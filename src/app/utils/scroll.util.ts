/**
 * Checks if a scrollable element is scrolled close to the bottom.
 *
 * @param event - The scroll event from the scrollable element
 * @param threshold - Buffer in pixels from the bottom (defaults to 1)
 * @returns `true` if the element has reached the bottom threshold
 */
export function isScrolledToBottom(event: Event, threshold: number = 1): boolean {
  const element: HTMLElement = event.target as HTMLElement;
  return element.scrollHeight - element.scrollTop <= element.clientHeight + threshold;
}
