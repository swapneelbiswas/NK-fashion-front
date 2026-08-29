import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoleAclConfig } from '@models/acl.model';
import { AuthLoginRequest } from '@models/auth.model';

import { AclService } from '@services/acl/acl.service';
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
    private aclService: AclService,
  ) {}

  /**
   * Statically simulates sending login credentials to the authentication API.
   *
   * @param data Login request payload containing user credentials.
   * @returns Observable emitting the simulated login response auth state.
   */
  loginApi(data: AuthLoginRequest): Observable<AuthState> {
    const roleId: string = data.role; // e.g. '0', '1', '2', '3'
    const role: UserType = (ROLE_MAP[roleId] || (data.role as UserType) || 'customer') as UserType;
    const canonicalRole: string = this.aclService.resolveCanonicalRole(role);
    const roleAcl: RoleAclConfig | null = this.aclService.getRoleConfigSync(canonicalRole);


    const userName: string = roleAcl?.name || 'NK Fashions User';
    const loginId: string = data.user_id || data.branch_code || `${canonicalRole}_user`;
    const allowedPages: string[] = roleAcl?.allowedPages || [];
    const permissions: Record<string, boolean> = (roleAcl?.permissions as Record<string, boolean>) || {};

    const state: AuthState = {
      role: canonicalRole as UserType,
      user_name: userName,
      login_id: loginId,
      allowedPages,
      allowedActions: ['create', 'read', 'update', 'delete'],
      permissions,
      hospital_code: data.hospital_code,
      branch_code: data.branch_code,
      branch_name: data.branch_code ? `Store ${data.branch_code}` : 'Sydney Flagship Store',
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

