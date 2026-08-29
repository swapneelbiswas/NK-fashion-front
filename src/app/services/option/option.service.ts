import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { JobStatusCheckResponse } from '@models/jobs.model';
import {
  OptionListResponseInfo,
  CreateOptionRequest,
  CreateOptionResponse,
  OptionUpdateResponse,
  OptionUpdateRequest,
} from '@models/option.model';

/**
 * Option responsible for branch-related API operations.
 */
@Injectable({ providedIn: 'root' })
export class OptionService {
  private readonly apiUrl = environment.api_url;

  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieves a paginated list of options from the backend.
   *
   * @param page - Current page number
   * @param limit - Number of items per page
   * @param searchValue - Optional search string to filter options by name
   * @param optionType - Filter options by type (日額 / 販売)
   * @returns An observable containing option data and pagination details
   */
  getAll(
    page: number,
    limit: number,
    searchValue?: string,
    optionType?: string, // 日額 / 販売
  ): Observable<{
    data: OptionListResponseInfo[];
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
      option_type?: string;
    } = {
      page,
      limit,
    };

    if (searchValue && searchValue.trim()) {
      params.name_search = searchValue.trim();
    }

    if (optionType && optionType.trim().length > 0) {
      params.option_type = optionType.trim();
    }

    return this.http
      .get<{
        status_code: number;
        result: string;
        total_count: number;
        option_list: OptionListResponseInfo[];
      }>(`${this.apiUrl}/option/get_all_option`, {
        withCredentials: true,
        params,
      })
      .pipe(
        map((res) => {
          const totalPages: number = Math.ceil(res.total_count / limit);

          return {
            data: res.option_list ?? [],
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
   * Creates a new option.
   *
   * @param data - Request payload
   * @returns Observable create response
   */
  create(data: CreateOptionRequest): Observable<CreateOptionResponse> {
    return this.http.post<CreateOptionResponse>(
      `${this.apiUrl}/option/create_option`,
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
  update(data: OptionUpdateRequest): Observable<OptionUpdateResponse> {
    return this.http.put<OptionUpdateResponse>(
      `${this.apiUrl}/option/update_option`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Retrieves background job status.
   *
   * @param jobId - Job unique identifier
   * @returns Observable job status response
   */
  getJobStatus(jobId: string): Observable<JobStatusCheckResponse> {
    return this.http.get<JobStatusCheckResponse>(
      `${this.apiUrl}/jobs/get_status/${jobId}`,
      { withCredentials: true },
    );
  }
}
