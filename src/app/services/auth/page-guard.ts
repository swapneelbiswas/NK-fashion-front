import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Route, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthState } from '@services/auth/auth-role';
import { AuthStateService } from '@services/auth/auth-state';
import { AppRoutes } from '@utils/constants';

/** Maps a role to its top-level route path segment. */
const ROLE_SEGMENT: Record<string, string> = {
  admin: AppRoutes.ADMIN,
  leader: AppRoutes.LEADER,
  staff: AppRoutes.STAFF,
  'hospital-staff': AppRoutes.HOSPITAL_STAFF,
};

/**
 * Guard that enforces page-level access control on child routes.
 *
 * Each child route declares a `data.page` key. If the authenticated user's
 * `allowedPages` does not include that key, they are redirected to the
 * first page under their role that they ARE allowed to see. Routes
 * without `data.page` are always accessible.
 */
@Injectable({ providedIn: 'root' })
export class PageGuard implements CanActivateChild {
  constructor(
    private authState: AuthStateService,
    private router: Router,
  ) {}

  /**
   * Waits for the startup auth check before deciding, so a not-yet-loaded
   * session isn't mistaken for a signed-out one.
   *
   * @param childRoute - The child route being activated.
   * @returns `true` if the page is allowed, otherwise a `UrlTree` redirect.
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
  ): Observable<boolean | UrlTree> {
    return this.authState
      .whenReady()
      .pipe(map(() => this.decide(childRoute)));
  }

  /**
   * @param childRoute - The child route being activated.
   * @returns `true` if the page is allowed, otherwise a `UrlTree` redirect.
   */
  private decide(childRoute: ActivatedRouteSnapshot): boolean | UrlTree {
    const page: string | undefined = childRoute.data['page'];

    // No page restriction declared — always allow
    if (!page) return true;

    const state: AuthState | null = this.authState.get();

    // No auth state — RoleGuard handles the unauthenticated redirect
    if (!state) return true;

    if (state.allowedPages.includes(page)) return true;

    const fallback: UrlTree = this.fallbackFor(state.role, state.allowedPages);
    return fallback;
  }

  /**
   * Finds the first child route under the user's role segment whose page
   * key is present in `allowedPages`.
   *
   * Redirecting to a hardcoded per-role "home" page here would create an
   * infinite loop with `GuestGuard` whenever that home page itself isn't
   * in `allowedPages` (GuestGuard sends authenticated users back to that
   * same home page, which this guard would block again). Searching for
   * any allowed page avoids that.
   *
   * @param role - The authenticated user's role string.
   * @param allowedPages - Pages the user is permitted to access.
   * @returns A `UrlTree` to the first allowed page, or `/landing` (after
   * clearing the session) if the role has no accessible page at all.
   */
  private fallbackFor(role: string, allowedPages: string[]): UrlTree {
    const roleSegment: string | undefined = ROLE_SEGMENT[role];
    const roleRoute: Route | undefined = roleSegment
      ? this.router.config.find((r) => r.path === roleSegment)
      : undefined;

    const match: Route | undefined = roleRoute?.children?.find(
      (child) =>
        typeof child.path === 'string' &&
        !child.path.includes(':') &&
        !!child.data?.['page'] &&
        allowedPages.includes(child.data['page']),
    );

    if (roleSegment && match) {
      return this.router.parseUrl(`/${roleSegment}/${match.path}`);
    }

    // No accessible page for this role — clear the invalid/misconfigured
    // session instead of sending an authenticated user to /landing, which
    // GuestGuard would just bounce back into the same dead end.
    console.warn('[PageGuard] no accessible page for role', role, allowedPages);
    this.authState.clear();
    return this.router.parseUrl(`/${AppRoutes.LANDING}`);
  }
}
