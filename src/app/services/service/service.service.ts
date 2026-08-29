import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';

import {
  ServiceListResponseService,
  CreateServiceRequest,
  CreateServiceResponse,
  ServiceUpdateResponse,
  UpdateServiceRequest,
} from '@models/service.model';

/**
 * Service responsible for branch-related API operations.
 */
@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly apiUrl = environment.api_url;

  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieves a paginated list of service from the backend.
   *
   * @param page - Current page number
   * @param limit - Number of items per page
   * @returns An observable containing service data and pagination details
   * @param searchValue - Optional search string to filter services by name
   */
  getAll(
    page: number,
    limit: number,
    searchValue?: string,
  ): Observable<{
    data: ServiceListResponseService[];
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
        service_list: ServiceListResponseService[];
      }>(`${this.apiUrl}/service/get_all`, {
        withCredentials: true,
        params,
      })
      .pipe(
        map((res) => {
          const totalPages: number = Math.ceil(res.total_count / limit);

          return {
            data: res.service_list ?? [],
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
   * Creates a new service.
   *
   * @param data Request payload
   * @returns Observable create response
   */
  create(data: CreateServiceRequest): Observable<CreateServiceResponse> {
    return this.http.post<CreateServiceResponse>(
      `${this.apiUrl}/service/create`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Updates an existing service with the provided data.
   *
   * @param data - The payload containing updated service information
   * @returns An Observable of the updated service response
   */
  update(data: UpdateServiceRequest): Observable<ServiceUpdateResponse> {
    return this.http.put<ServiceUpdateResponse>(
      `${this.apiUrl}/service/update`,
      data,
      { withCredentials: true },
    );
  }
}
