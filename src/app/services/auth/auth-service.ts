import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthLoginRequest } from '@models/auth.model';
import { AuthState, ROLE_MAP, UserType } from '@services/auth/auth-role';
import { AuthStateService } from '@services/auth/auth-state';
import { BranchService } from '@services/branch/branch-service';
import { GlobalUiService } from '@utils/global/global-service';

/**
 * Authentication service for login and logout (statically simulated).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'nk_auth_state';

  constructor(
    private http: HttpClient,
    private ui: GlobalUiService,
    private authState: AuthStateService,
    private branchService: BranchService,
  ) {}

  /**
   * Statically simulates sending login credentials to the authentication API.
   *
   * @param data Login request payload containing user credentials.
   * @returns Observable emitting the simulated login response auth state.
   */
  loginApi(data: AuthLoginRequest): Observable<AuthState> {
    const roleId: string = data.role; // e.g. '0', '1', '2', '3'
    const role: UserType = ROLE_MAP[roleId] || 'hospital-staff';

    let allowedPages: string[] = [];
    let userName: string = 'NK Fashions User';
    let loginId: string = data.user_id || 'user_123';

    if (role === 'admin') {
      userName = 'System Admin';
      allowedPages = [
        'summary-list',
        'branch-list',
        'hospital-list',
        'leader-list',
        'service-list',
        'option-list',
        'user-list',
        'bill-closing'
      ];
    } else if (role === 'leader') {
      userName = 'Store Manager';
      loginId = data.user_id || 'manager_123';
      allowedPages = [
        'summary-list',
        'completed-distribution-list',
        'incomplete-distribution-list',
        'user-list',
        'hospital-list',
        'service-list',
        'option-list',
        'bill-closing'
      ];
    } else if (role === 'staff') {
      userName = 'POS Cashier';
      loginId = data.branch_code || 'pos_123';
      allowedPages = [
        'delivery-request-list',
        'completed-distribution-list',
        'incomplete-distribution-list',
        'user-list',
        'hospital-list',
        'service-list',
        'option-list'
      ];
    } else if (role === 'hospital-staff') {
      userName = 'Registered Customer';
      loginId = data.branch_code || 'customer_123';
      allowedPages = [
        'after-delivery-list',
        'user-list',
        'hospital-staff-classification-list',
        'option-list',
        'invoice-confirmation-list'
      ];
    }

    const state: AuthState = {
      role,
      user_name: userName,
      login_id: loginId,
      allowedPages,
      allowedActions: ['create', 'read', 'update', 'delete'],
      hospital_code: data.hospital_code,
      branch_code: data.branch_code,
      branch_name: data.branch_code ? `Store ${data.branch_code}` : undefined,
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    return of(state);
  }

  /**
   * Fetches the currently authenticated user from local storage session simulation.
   *
   * @returns An Observable that emits the current user's `AuthState` if logged in, or `null`.
   */
  me(): Observable<AuthState | null> {
    const raw: string | null = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      return of(null);
    }
    try {
      const state: AuthState = JSON.parse(raw);
      return of(state);
    } catch {
      return of(null);
    }
  }

  /**
   * Statically simulates logout.
   *
   * @returns Observable that completes when logout succeeds
   */
  logout(): Observable<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    return of(undefined);
  }
}
