import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Toaster notification component displayed at the top-right of the page.
 */
@Component({
  selector: 'app-toaster',
  imports: [CommonModule],
  templateUrl: './toaster.html',
  styleUrl: './toaster.scss',
})
export class Toaster implements OnChanges {
  @Input() message: string | null = null;
  @Input() type: 'error' | 'success' | 'info' = 'error';

  visible = false;

  /**
   * @param changes - detected input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && this.message) {
      this.visible = true;
    } else if (changes['message'] && !this.message) {
      this.visible = false;
    }
  }
}
