import { Location } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '@services/auth/auth-state';
import {
  GlobalUiService,
  SESSION_EXPIRED_CODE,
} from '@utils/global/global-service';
import { CommonLabels } from '@utils/ln/jp-localization';

/**
 * Global HTTP interceptor that handles 401 Unauthorized responses.
 *
 * When a 401 is received from any API call, this interceptor clears
 * the authentication state, which triggers the RoleRouteEnforcer to
 * redirect the user to the landing/login page automatically.
 *
 * @param req - The HTTP request
 * @param next - The next HTTP handler
 * @returns Observable of HTTP events
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState: AuthStateService = inject(AuthStateService);
  const globalUi: GlobalUiService = inject(GlobalUiService);
  const location: Location = inject(Location);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authState.clear();
        const path: string = location.path();
        const isGuestPage: boolean =
          !path ||
          path === '/' ||
          path.includes('/landing') ||
          path.includes('/login');
        if (!isGuestPage) {
          globalUi.showCard(
            CommonLabels.SESSION_EXPIRED_MESSAGE,
            SESSION_EXPIRED_CODE,
            '/landing',
          );
        }
      }
      return throwError(() => error);
    }),
  );
};
