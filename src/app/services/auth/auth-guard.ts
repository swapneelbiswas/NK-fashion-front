import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthState } from '@services/auth/auth-role';
import { AuthStateService } from '@services/auth/auth-state';
import { AppRoutes } from '@utils/constants';

/**
 * Guard that protects role-based routes.
 *
 * This guard ensures that:
 * - The user is authenticated
 * - The user is only allowed to access routes that match their role
 *
 * If the user is not logged in or tries to access a route
 * that does not match their role, they are redirected
 * to the appropriate page.
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authState: AuthStateService,
    private router: Router,
  ) {}

  /**
   * Waits for the startup auth check before deciding, so a not-yet-loaded
   * session isn't mistaken for a signed-out one.
   *
   * @param route The activated route snapshot being accessed.
   * @returns `true` if the route is allowed for the current user, otherwise `false`.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authState.whenReady().pipe(map(() => this.decide(route)));
  }

  /**
   * Determines whether the requested route can be activated
   * based on the current user's role.
   *
   * @param route The activated route snapshot being accessed.
   * @returns `true` if the route is allowed for the current user, otherwise `false`.
   */
  private decide(route: ActivatedRouteSnapshot): boolean {
    const state: AuthState | null = this.authState.get();

    if (!state) {
      this.router.navigate([AppRoutes.LANDING]);
      return false;
    }

    const url: string = route.pathFromRoot
      .map((r) => r.routeConfig?.path)
      .filter((p) => !!p)
      .join('/');

    // Role-based redirects
    switch (state.role) {
      case 'admin':
        if (!url.startsWith(AppRoutes.ADMIN)) {
          this.router.navigate([AppRoutes.ADMIN, AppRoutes.ADMIN_CHILDREN.SUMMARY]);
          return false;
        }
        break;

      case 'manager':
      case 'leader':
        if (!url.startsWith(AppRoutes.MANAGER) && !url.startsWith(AppRoutes.LEADER)) {
          this.router.navigate([
            AppRoutes.MANAGER,
            AppRoutes.MANAGER_CHILDREN.SUMMARY,
          ]);
          return false;
        }
        break;

      case 'cashier':
      case 'staff':
        if (!url.startsWith(AppRoutes.CASHIER) && !url.startsWith(AppRoutes.STAFF)) {
          this.router.navigate([
            AppRoutes.CASHIER,
            AppRoutes.CASHIER_CHILDREN.TERMINAL,
          ]);
          return false;
        }
        break;

      case 'customer':
      case 'hospital-staff':
        if (!url.startsWith(AppRoutes.CUSTOMER) && !url.startsWith(AppRoutes.HOSPITAL_STAFF)) {
          this.router.navigate([
            AppRoutes.CUSTOMER,
            AppRoutes.CUSTOMER_CHILDREN.PORTAL,
          ]);
          return false;
        }
        break;
    }
    return true;
  }
}

