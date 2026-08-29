import { Injectable } from '@angular/core';
import { AuthService } from '@services/auth/auth-service';
import { AuthStateService } from '@services/auth/auth-state';

/**
 * Keeps authentication state in sync across browser tabs
 * using the BroadcastChannel API.
 */
@Injectable({ providedIn: 'root' })
export class SessionSyncService {
  private channel = new BroadcastChannel('auth');

  constructor(
    private auth: AuthService,
    private authState: AuthStateService,
  ) {
    this.channel.onmessage = () => {
      this.sync();
    };
  }

  /**
   * Notifies all open tabs that authentication state has changed.
   */
  notifyChange() {
    this.channel.postMessage('changed');
  }

  /**
   * Syncs authentication state by calling the backend
   * and updating the shared AuthStateService.
   */
  sync() {

    this.auth.me().subscribe((state) => {
      if (state) {
        this.authState.set(state);
      } else {
        this.authState.clear();
      }
    });
  }
}
