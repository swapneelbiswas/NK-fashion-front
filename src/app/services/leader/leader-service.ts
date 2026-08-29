import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  CreateLeaderRequest,
  CreateLeaderResponse,
  LeaderDetailsResponse,
  LeaderListResponseLeader,
  LeaderUpdateRequest,
  LeaderUpdateResponse,
} from '@models/leader.model';

/**
 * Service responsible for leader-related API operations.
 */
@Injectable({
  providedIn: 'root',
})
export class LeaderService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the complete list of leaders.
   *
   * @param page - Current page number
   * @param limit - Number of items per page
   * @param searchValue Optional branch name filter
   * @returns Observable emitting an array of leaders
   */
  getAllLeaders(
    page: number,
    limit: number,
    searchValue?: string,
  ): Observable<{
    data: LeaderListResponseLeader[];
    pagination: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
    };
  }> {
    const params: {
      page: number;
      limit: number;
      name_search?: string;
    } = {
      page,
      limit,
    };

    if (searchValue && searchValue.trim().length > 0) {
      params.name_search = searchValue.trim();
    }

    return this.http
      .get<{
        status_code: number;
        result: string;
        total_count: number;
        page_keys: string;
        leader_list: LeaderListResponseLeader[];
      }>(`${this.apiUrl}/leader`, {
        withCredentials: true,
        params,
      })
      .pipe(
        map((res) => {
          const totalPages: number = Math.ceil(res.total_count / limit);

          return {
            data: res.leader_list ?? [],
            pagination: {
              page,
              limit,
              total_items: res.total_count,
              total_pages: totalPages,
            },
          };
        }),
      );
  }

  /**
   * Creates a new leader.
   *
   * @param data - The request payload used to create a leader
   * @returns An observable containing the created leader information
   */
  create(data: CreateLeaderRequest): Observable<CreateLeaderResponse> {
    return this.http.post<CreateLeaderResponse>(
      `${this.apiUrl}/leader/create`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Updates an existing option with the provided data.
   *
   * @param data - The payload containing updated option information
   * @returns An Observable of the updated option response
   */
  update(data: LeaderUpdateRequest): Observable<LeaderUpdateResponse> {
    return this.http.put<LeaderUpdateResponse>(
      `${this.apiUrl}/leader/update`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Retrieves the complete list of leaders.
   *
   * @param email - The email of the leader to retrieve details for
   * @param leader_id - The ID of the leader to retrieve details for (optional)
   * @returns Observable emitting an array of leaders
   */
  getLeaderDetails(
    email: string,
    leader_id?: string,
  ): Observable<LeaderDetailsResponse> {
    const params: {
      email?: string;
      leader_id?: string;
    } = {};

    if (leader_id && leader_id.trim().length > 0) {
      params.leader_id = leader_id.trim();
    }
    if (email && email.trim().length > 0) {
      params.email = email.trim();
    }

    return this.http.get<LeaderDetailsResponse>(
      `${this.apiUrl}/leader/get_details`,
      {
        withCredentials: true,
        params,
      },
    );
  }
}
