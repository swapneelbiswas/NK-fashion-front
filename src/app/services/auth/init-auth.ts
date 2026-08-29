import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { AuthService } from '@services/auth/auth-service';
import { AuthStateService } from '@services/auth/auth-state';

/**
 * Initializes authentication state on app startup.
 *
 * Calls the `AuthService.me()` endpoint to restore the user's session
 * from an HttpOnly cookie and updates the `AuthStateService`.
 *
 * @param auth The authentication service used to call the backend.
 * @param authState The service managing the client-side authentication state.
 * @returns A function that returns a Promise which resolves when the auth state is initialized.
 */
export function initAuth(
  auth: AuthService,
  authState: AuthStateService,
): () => Promise<void> {
  return (): Promise<void> => {
    return firstValueFrom(
      auth.me().pipe(
        tap((state) => {
          if (state) {
            authState.set(state);
          } else {
            authState.clear();
          }
        }),
        catchError(() => {
          authState.clear();
          return of(null);
        }),
      ),
    ).then(() => {
      authState.markReady();
    });
  };
}
