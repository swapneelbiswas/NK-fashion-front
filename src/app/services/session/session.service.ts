import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { SessionListResponse } from '@models/session.model';

/**
 * Service responsible for session-related API operations.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the list of active sessions for a given user.
   *
   * @param userId - The user ID to fetch sessions for
   * @param hospitalId - Optional hospital primary key (`id`, not `hospital_id`)
   * @param role - Optional role: '2' = ADMIN_STAFF, '3' = HOSPITAL_STAFF
   * @param page - Optional 1-based page number; omitted for the first page
   * @returns An observable containing the session list response
   */
  getUserSessions(
    userId: string,
    hospitalId?: string,
    role?: string,
    page?: number,
  ): Observable<SessionListResponse> {
    const params: {
      user_id: string;
      hospital_id?: string;
      role?: string;
      page?: number;
    } = {
      user_id: userId,
    };

    if (hospitalId && hospitalId.trim().length > 0) {
      params.hospital_id = hospitalId.trim();
    }

    if (role && role.trim().length > 0) {
      params.role = role.trim();
    }

    if (page && page > 1) {
      params.page = page;
    }

    return this.http.get<SessionListResponse>(
      `${this.apiUrl}/session/get_user_sessions`,
      {
        withCredentials: true,
        params,
      },
    );
  }
}
