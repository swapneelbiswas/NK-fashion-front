import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AclService } from '@services/acl/acl.service';
import { AuthState } from '@services/auth/auth-role';
import { AuthStateService } from '@services/auth/auth-state';

/**
 * Guard for section entry routes (/admin, /manager, /cashier, /customer).
 * - If user is logged in with the matching role, directs to their default dashboard.
 * - If unauthenticated or wrong role, allows the login view for that section to render.
 */
@Injectable({ providedIn: 'root' })
export class SectionEntryGuard implements CanActivate {
  constructor(
    private authState: AuthStateService,
    private aclService: AclService,
    private router: Router,
  ) {}

  /**
   * Evaluates if section can be activated or redirects.
   *
   * @param route - The activated route snapshot.
   * @returns Observable of boolean or UrlTree.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.authState.whenReady().pipe(
      map((): boolean | UrlTree => {
        const targetRole: string = (route.data['role'] || route.routeConfig?.path || 'admin') as string;
        const canonicalTarget: string = this.aclService.resolveCanonicalRole(targetRole);
        const state: AuthState | null = this.authState.get();

        if (state) {
          const canonicalUserRole: string = this.aclService.resolveCanonicalRole(state.role);
          if (canonicalUserRole === canonicalTarget) {
            // Already logged in as this role -> go to default dashboard
            const defaultRoute: string = this.aclService.getDefaultRoute(canonicalUserRole);
            return this.router.parseUrl(defaultRoute);
          }
        }

        // Allow login screen to render
        return true;
      }),
    );
  }
}

