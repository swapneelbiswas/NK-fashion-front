import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, take } from 'rxjs';
import { AuthState } from '@services/auth/auth-role';
import { AuthStateService } from '@services/auth/auth-state';

export interface GlobalErrorState {
  type: 'card';
  message: string;
  code?: string;
}

/**
 * Code the session-expired card is tagged with. It marks the one card whose
 * message stops being true as soon as the user is authenticated again.
 */
export const SESSION_EXPIRED_CODE: string = '401';

/**
 *
 */
@Injectable({ providedIn: 'root' })
export class GlobalUiService {
  public errorSubject = new BehaviorSubject<GlobalErrorState | null>(null);
  private currentUrl: string | null = null;

  // Reactive signal derived from BehaviorSubject
  errorSignal = signal<GlobalErrorState | null>(null);

  // List of base paths where we do NOT want alerts
  private excludePages = ['/landing', '/login'];

  constructor(
    private router: Router,
    private authState: AuthStateService,
  ) {
    // Keep signal in sync with BehaviorSubject
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // eslint-disable-next-line @typescript-eslint/typedef
        this.currentUrl = event.urlAfterRedirects; // <-- this gives "/landing" after redirect
      });
    this.errorSubject.subscribe((value) => this.errorSignal.set(value));

    // The session-expired card only holds true while there is no session, so a
    // fresh login — here, on startup, or synced from another tab — retires it
    // instead of leaving it on screen until はい is pressed. Other cards (500,
    // etc.) are unrelated to the session and are left alone.
    this.authState.auth$.subscribe((state: AuthState | null): void => {
      if (!state) return;
      if (this.errorSignal()?.code === SESSION_EXPIRED_CODE) {
        this.clear();
      }
    });
  }

  /**
   *
   * @param message - The error message to display in the card.
   * @param code - Optional error code to display in the card (e.g., '401', '500').
   * @param preNavigateTo - Optional URL to navigate to after the user dismisses the card.
   */
  showCard(message: string, code: string, preNavigateTo?: string): void {
    if (preNavigateTo) {
      this.router.navigate([preNavigateTo]).then(() => {
        const error: GlobalErrorState = { type: 'card', message, code };
        this.errorSignal.set(error);
        this.errorSubject.next(error);
      });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/typedef
    const trigger = () => {
      if (!this.shouldShowAlert()) return;

      const error: GlobalErrorState = { type: 'card', message, code };
      this.errorSignal.set(error);
      this.errorSubject.next(error);
    };

    if (this.currentUrl) {
      trigger();
      return;
    }

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => trigger());
  }

  /**
   *
   */
  clear(): void {
    this.errorSignal.set(null);
    this.errorSubject.next(null);
  }

  /**
   *
   * @returns Whether the error alert should be shown based on the current route.
   * This can be used in the template to conditionally display the alert.
   */
  private shouldShowAlert(): boolean {
    return !this.excludePages.some(
      (path) => this.currentUrl?.startsWith(path) ?? false,
    );
  }
}
