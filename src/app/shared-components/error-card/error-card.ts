import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@utils/constants';

/**
 *
 */
@Component({
  selector: 'app-error-card',
  imports: [],
  templateUrl: './error-card.html',
  styleUrl: './error-card.scss',
})
export class ErrorCard {
  @Input() errorCode!: string;
  @Input() message!: string;

  // Event to notify parent that OK was pressed
  @Output() ok = new EventEmitter<void>();

  redirectUrl: string = AppRoutes.LANDING;

  constructor(private router: Router) {}

  /**
   *
   */
  onOk(): void {
    this.ok.emit();
    this.router.navigate([this.redirectUrl]);
  }
}
