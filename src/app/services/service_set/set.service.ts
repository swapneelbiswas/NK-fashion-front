import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  CreateSetRequest,
  CreateSetResponse,
  UpdateSetRequest,
  SetUpdateResponse,
  SetListResponseSet,
} from '@models/set.model';

/**
 *
 */
@Injectable({ providedIn: 'root' })
export class SetService {
  private readonly apiUrl = environment.api_url;

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all sets by service with pagination and optional search.
   *
   * @param serviceId - Service ID
   * @param page - Current page number
   * @param limit - Items per page
   * @param searchValue - Optional search keyword
   * @param setStatus - Optional search keyword
   * @returns Observable of set list response
   */
  getAllSetsByService(
    serviceId: string,
    page: number,
    limit: number,
    searchValue?: string,
    setStatus?: string,
  ): Observable<{
    data: SetListResponseSet[];
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
      set_status?: string;
    } = {
      page,
      limit,
    };

    if (searchValue && searchValue.trim().length > 0) {
      params.name_search = searchValue.trim();
    }

    if (setStatus && setStatus.trim().length > 0) {
      params.set_status = setStatus.trim();
    }

    return this.http
      .get<{
        status_code: number;
        result: string;
        total_count: number;
        page_keys: string;
        set_list: SetListResponseSet[];
      }>(`${this.apiUrl}/set/${serviceId}`, {
        withCredentials: true,
        params,
      })
      .pipe(
        map((res) => {
          const totalPages: number = Math.ceil(res.total_count / limit);
          return {
            data: res.set_list ?? [],
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
   * Create a new set.
   *
   * @param data - Create set request payload
   * @returns Observable of create set response
   */
  create(data: CreateSetRequest): Observable<CreateSetResponse> {
    return this.http.post<CreateSetResponse>(
      `${this.apiUrl}/set/create`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Update an existing set.
   *
   * @param data - Update set request payload
   * @returns Observable of update set response
   */
  update(data: UpdateSetRequest): Observable<SetUpdateResponse> {
    return this.http.put<SetUpdateResponse>(
      `${this.apiUrl}/set/update`,
      data,
      { withCredentials: true },
    );
  }
}
