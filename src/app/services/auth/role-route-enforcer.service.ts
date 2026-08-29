import { Injectable } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { combineLatest, filter, Observable, switchMap, take } from 'rxjs';
import { AuthState, UserType } from '@services/auth/auth-role';
import { AuthStateService } from '@services/auth/auth-state';
import { AppRoutes } from '@utils/constants';

/** Maps a role to its top-level route path segment. */
const ROLE_SEGMENT: Record<UserType, string> = {
  admin: AppRoutes.ADMIN,
  leader: AppRoutes.LEADER,
  staff: AppRoutes.STAFF,
  'hospital-staff': AppRoutes.HOSPITAL_STAFF,
};

/** Maps a role to its default landing page once authenticated. */
const ROLE_HOME: Record<UserType, string> = {
  admin: `/${AppRoutes.ADMIN}/${AppRoutes.ADMIN_CHILDREN.SUMMARY}`,
  leader: `/${AppRoutes.LEADER}/${AppRoutes.LEADER_CHILDREN.SUMMARY}`,
  staff: `/${AppRoutes.STAFF}/${AppRoutes.STAFF_CHILDREN.DELIVERY_REQUEST}`,
  'hospital-staff': `/${AppRoutes.HOSPITAL_STAFF}/${AppRoutes.HOSPITAL_STAFF_CHILDREN.AFTER_DELIVERY}`,
};

const PUBLIC_PREFIXES: string[] = [`/${AppRoutes.LANDING}`, '/login'];

/**
 * Service that enforces role-based routing.
 *
 * Since the initial auth check now runs in the background instead of
 * blocking app bootstrap, the router may briefly land the user on a
 * public route (or bounce them to `/landing`) before that check resolves.
 * This service listens for auth state changes and corrects the route
 * once the real state is known:
 * - Authenticated on a public route → sent to their role's dashboard.
 * - Authenticated on a route for a different role → sent to their own.
 * - Session cleared (logout / 401) while on a protected route → sent to `/landing`.
 */
@Injectable({ providedIn: 'root' })
export class RoleRouteEnforcer {
  /**
   * Creates the RoleRouteEnforcer and starts listening
   * for authentication state changes.
   *
   * @param authState Service that provides the current authentication state.
   * @param router Angular router used to perform navigation.
   */
  constructor(
    private authState: AuthStateService,
    private router: Router,
  ) {
    // Wait for both the startup auth check AND the initial navigation to
    // settle before reacting. Waiting on the auth check alone isn't enough:
    // this service is constructed (and subscribes) during app bootstrap,
    // earlier than RoleGuard/PageGuard subscribe to that same signal, so a
    // naive `whenReady()` gate would still fire before the guarded
    // navigation commits its URL — `router.url` would read stale, this
    // service would wrongly conclude "wrong route for this role", and
    // hijack the still-in-flight navigation to the role's home page.
    // Waiting for the router to reach NavigationEnd/Cancel/Error guarantees
    // `router.url` reflects the guards' actual decision before we check it.
    const initialNavigationSettled$: Observable<
      NavigationEnd | NavigationCancel | NavigationError
    > = this.router.events.pipe(
      filter(
        (e): e is NavigationEnd | NavigationCancel | NavigationError =>
          e instanceof NavigationEnd ||
          e instanceof NavigationCancel ||
          e instanceof NavigationError,
      ),
      take(1),
    );

    combineLatest([this.authState.whenReady(), initialNavigationSettled$])
      .pipe(switchMap(() => this.authState.auth$))
      .subscribe((state) => this.enforce(state));
  }

  /**
   * @param state - The latest authentication state, or `null` if signed out.
   */
  private enforce(state: AuthState | null): void {
    const url: string = this.router.url;

    if (!state) {
      const onPublicRoute: boolean = PUBLIC_PREFIXES.some((prefix) =>
        url.startsWith(prefix),
      );
      if (!onPublicRoute) {
        this.router.navigate([`/${AppRoutes.LANDING}`]);
      }
      return;
    }

    const ownSegment: string = ROLE_SEGMENT[state.role];
    if (!ownSegment || url.startsWith(`/${ownSegment}`)) return;

    this.router.navigateByUrl(ROLE_HOME[state.role]);
  }
}
