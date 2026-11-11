import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStateService } from '@services/auth/auth-state';
import { ErrorCard } from '@shared-components/error-card/error-card';
import { LoaderComponent } from '@shared-components/loader/loader';
import { GlobalUiService } from '@utils/global/global-service';

/**
 * Root component of the application.
 *
 * Acts as the main entry point and hosts the router outlet
 * for rendering routed views. Also defines the application
 * title as a reactive signal.
 */
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ErrorCard,
    LoaderComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /**
   * True once the startup auth check has resolved. The root route's
   * RoleRedirectGuard blocks on the same check before it lets any route
   * render, so this covers the resulting blank gap with the shared loader.
   */
  authReady = signal(false);

  constructor(
    public ui: GlobalUiService,
    private authState: AuthStateService,
  ) {
    this.authState
      .whenReady()
      .subscribe(() => this.authReady.set(true));
  }

  /**
   * Reactive application title.
   */
  protected readonly title = signal('nk-fashion');

  /**
   * Clears the current global UI error signal.
   */
  handleErrorOk(): void {
    this.ui.clear();
  }
}
