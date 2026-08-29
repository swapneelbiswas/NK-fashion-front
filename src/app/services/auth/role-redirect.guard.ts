import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthStateService } from '@services/auth/auth-state';
import { AppRoutes } from '@utils/constants';

/**
 *
 */
@Injectable({ providedIn: 'root' })
export class RoleRedirectGuard implements CanActivate {
  constructor(
    private authState: AuthStateService,
    private router: Router,
  ) {}

  /**
   * Waits for the startup auth check before deciding, so a not-yet-loaded
   * session isn't mistaken for a signed-out one.
   *
   * @returns -
   */
  canActivate(): Observable<UrlTree> {
    return this.authState.whenReady().pipe(map(() => this.decide()));
  }

  /**
   * @returns -
   */
  private decide(): UrlTree {
    // eslint-disable-next-line @typescript-eslint/typedef
    const state = this.authState.get();

    if (!state) {
      return this.router.parseUrl(`/${AppRoutes.LANDING}`);
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
        return this.router.parseUrl(`/${AppRoutes.LANDING}`);
    }
  }
}
