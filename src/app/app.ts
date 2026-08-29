import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '@services/auth/auth-service';
import { AuthStateService } from '@services/auth/auth-state';
import { ErrorCard } from '@shared-components/error-card/error-card';
import { Header } from '@shared-components/header/header';
import { LoaderComponent } from '@shared-components/loader/loader';
import { Sidebar } from '@shared-components/sidebar/sidebar';
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
    Header,
    ErrorCard,
    Sidebar,
    LoaderComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  showHeader = false;
  showSidebar = false;

  /**
   * True once the startup auth check has resolved. The root route's
   * RoleRedirectGuard blocks on the same check before it lets any route
   * render, so this covers the resulting blank gap with the shared loader.
   */
  authReady = signal(false);

  constructor(
    public ui: GlobalUiService,
    private auth: AuthService,
    private authState: AuthStateService,
    private router: Router,
  ) {
    this.authState
      .whenReady()
      .subscribe(() => this.authReady.set(true));

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const ne: NavigationEnd = event as NavigationEnd;
        const url: string = ne.urlAfterRedirects || ne.url;
        this.showHeader = !url.includes('/login') && !url.includes('/landing');
        this.showSidebar = this.showHeader && !url.includes('/admin/acl');
      });
  }
  /**
   * Reactive application title.
   */
  protected readonly title = signal('nk-fashion');

  /**
   *
   */
  handleErrorOk(): void {
    this.ui.clear();
  }
}
