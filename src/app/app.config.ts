import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '@routing/app.routes';
import { AuthService } from '@services/auth/auth-service';
import { AuthStateService } from '@services/auth/auth-state';
import { authInterceptor } from '@services/auth/auth.interceptor';
import { initAuth } from '@services/auth/init-auth';
import { RoleRouteEnforcer } from '@services/auth/role-route-enforcer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    provideAppInitializer(() => {
      const auth: AuthService = inject(AuthService);
      const authState: AuthStateService = inject(AuthStateService);

      // Fire-and-forget: bootstrap must not wait on this network round
      // trip. Guards run with whatever auth state is available synchronously;
      // RoleRouteEnforcer (below) corrects the route once this resolves.
      void initAuth(auth, authState)();
    }),
    provideAppInitializer(() => {
      // Eagerly instantiate so its constructor starts listening for auth
      // state changes from app startup, not just on first injection.
      inject(RoleRouteEnforcer);
    }),
  ],
};

