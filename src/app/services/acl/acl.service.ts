import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AclActionRequest, AclJobResponse, AclListResponse, AclPageRequest } from '@models/acl.model';

/**
 * Acl service responsible for role-permission (ACL) API operations.
 */
@Injectable({ providedIn: 'root' })
export class AclService {
  private readonly apiUrl = environment.api_url;

  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieves the permission matrix (allowed actions/pages per role) from the backend.
   *
   * @returns An observable containing the list of role permissions
   */
  getAllPermissions(): Observable<AclListResponse> {
    return this.http.get<AclListResponse>(
      `${this.apiUrl}/acl/get_all_permissions`,
      { withCredentials: true },
    );
  }

  /**
   * Grants an action permission to a role.
   *
   * @param data - Role id and action key to add
   * @returns Observable job response
   */
  addAction(data: AclActionRequest): Observable<AclJobResponse> {
    return this.http.post<AclJobResponse>(
      `${this.apiUrl}/acl/add_action`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Revokes an action permission from a role.
   *
   * @param data - Role id and action key to remove
   * @returns Observable job response
   */
  removeAction(data: AclActionRequest): Observable<AclJobResponse> {
    return this.http.delete<AclJobResponse>(
      `${this.apiUrl}/acl/remove_action`,
      { withCredentials: true, body: data },
    );
  }

  /**
   * Grants a page permission to a role.
   *
   * @param data - Role id and page key to add
   * @returns Observable job response
   */
  addPage(data: AclPageRequest): Observable<AclJobResponse> {
    return this.http.post<AclJobResponse>(
      `${this.apiUrl}/acl/add_page`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Revokes a page permission from a role.
   *
   * @param data - Role id and page key to remove
   * @returns Observable job response
   */
  removePage(data: AclPageRequest): Observable<AclJobResponse> {
    return this.http.delete<AclJobResponse>(
      `${this.apiUrl}/acl/remove_page`,
      { withCredentials: true, body: data },
    );
  }
}
