import { Injectable } from '@angular/core';
import { filter, map, Observable, take } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthState, UserType } from '@services/auth/auth-role';

/**
 * Service to manage and share authentication-related state
 * such as the current user's role across the application.
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private state$ = new BehaviorSubject<AuthState | null>(null);
  private ready$ = new BehaviorSubject<boolean>(false);

  /**
   * Current auth state stream.
   */
  auth$ = this.state$.asObservable();

  /**
   * Marks the initial startup auth check (`/auth/whoami`) as complete.
   * Guards wait on this via `whenReady()` so they don't decide based on
   * the default `null` state before that check has actually resolved.
   */
  markReady(): void {
    this.ready$.next(true);
  }

  /**
   * Resolves once the initial startup auth check has completed, so guards
   * can rely on `get()` reflecting the real session state instead of the
   * default `null`.
   *
   * @returns An Observable that emits once when auth state is ready.
   */
  whenReady(): Observable<void> {
    return this.ready$.pipe(
      filter(Boolean),
      take(1),
      map(() => undefined),
    );
  }

  /**
   * Indicates whether a user is currently authenticated.
   *
   * @returns `true` if an authentication state exists, otherwise `false`.
   */
  get isLoggedIn(): boolean {
    return this.state$.value !== null;
  }

  /**
   * Updates the current authentication state.
   *
   * @param state The authenticated user state including role, permissions, and allowed pages.
   */
  set(state: AuthState): void {
    this.state$.next(state);
  }

  /**
   * Returns the current authentication state.
   *
   * @returns The current AuthState if logged in, otherwise null.
   */
  get(): AuthState | null {
    return this.state$.value;
  }

  /**
   * Clears auth state on logout.
   */
  clear(): void {
    this.state$.next(null);
  }

  /**
   * Returns the role of the currently authenticated user.
   *
   * @returns The user's role if logged in, otherwise `null`.
   */
  get role(): UserType | null {
    return this.state$.value?.role ?? null;
  }

  /**
   * Checks whether the current user is allowed to perform a specific action.
   *
   * @param action The action identifier to check (for example, `branch:create`).
   * @returns `true` if the action is allowed for the current user, otherwise `false`.
   */
  hasAction(action: string): boolean {
    return this.state$.value?.allowedActions.includes(action) ?? false;
  }

  /**
   * Checks whether the current user has access to a specific page.
   *
   * @param page The page identifier to check (for example, `top` or `branch-list`).
   * @returns `true` if the page is allowed for the current user, otherwise `false`.
   */
  hasPage(page: string): boolean {
    return this.state$.value?.allowedPages.includes(page) ?? false;
  }
  /**
   *
   * @returns - role of the user
   */
  get roleBasePath(): string | null {
    const role: string | null = this.role;
    return role ? `/${role}` : null;
  }
}
