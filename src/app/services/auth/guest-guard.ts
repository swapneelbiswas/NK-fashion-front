import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthState } from '@services/auth/auth-role';
import { AuthStateService } from '@services/auth/auth-state';
import { AppRoutes } from '@utils/constants';

/**
 * Guard that protects guest-only routes (landing, login).
 *
 * If the user is already authenticated, they are redirected to their
 * role-based home page instead of seeing the login/landing screen.
 */
@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(
    private authState: AuthStateService,
    private router: Router,
  ) {}

  /**
   * Waits for the startup auth check before deciding, so a not-yet-loaded
   * session isn't mistaken for a signed-out one.
   *
   * @returns `true` if the user is not authenticated, otherwise a `UrlTree`
   * redirecting to the user's role-based home page.
   */
  canActivate(): Observable<boolean | UrlTree> {
    return this.authState.whenReady().pipe(map(() => this.decide()));
  }

  /**
   * @returns `true` if the user is not authenticated, otherwise a `UrlTree`
   * redirecting to the user's role-based home page.
   */
  private decide(): boolean | UrlTree {
    const state: AuthState | null = this.authState.get();

    if (!state) {
      return true;
    }

    switch (state.role) {
      case 'admin':
        return this.router.parseUrl(
          `/${AppRoutes.ADMIN}/${AppRoutes.ADMIN_CHILDREN.SUMMARY}`,
        );
      case 'leader':
        return this.router.parseUrl(
          `/${AppRoutes.LEADER}/${AppRoutes.LEADER_CHILDREN.SUMMARY}`,
        );
      case 'staff':
        return this.router.parseUrl(
          `/${AppRoutes.STAFF}/${AppRoutes.STAFF_CHILDREN.DELIVERY_REQUEST}`,
        );
      case 'hospital-staff':
        return this.router.parseUrl(
          `/${AppRoutes.HOSPITAL_STAFF}/${AppRoutes.HOSPITAL_STAFF_CHILDREN.AFTER_DELIVERY}`,
        );
      default:
        return true;
    }
  }
}
