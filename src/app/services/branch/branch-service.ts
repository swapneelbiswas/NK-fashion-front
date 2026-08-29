import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import {
  BranchListResponse,
  BranchListResponseBranch,
  BranchUpdateRequest,
  BranchUpdateResponse,
  CreateBranchRequest,
  CreateBranchResponse,
} from '@models/branch.model';

/**
 * Service responsible for branch-related API operations.
 */
@Injectable({ providedIn: 'root' })
export class BranchService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the complete list of hospitals.
   *
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @param searchValue - Search term to filter hospitals
   * @returns An observable containing an array of hospital data
   */
  getBranchList(
    page: number = 1,
    limit: number = 50,
    searchValue?: string,
  ): Observable<{
    data: BranchListResponseBranch[];
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
      hospital_status?: string;
    } = {
      page,
      limit,
    };

    if (searchValue && searchValue.trim().length > 0) {
      params.name_search = searchValue.trim();
    }

    return this.http
      .get<BranchListResponse>(`${this.apiUrl}/branch`, {
        withCredentials: true,
        params,
      })
      .pipe(
        map((res) => {
          const totalPages: number = Math.ceil(res.total_count / limit);

          return {
            data: res.branch_list ?? [],
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
   * Resolves a single branch's display name from its id.
   *
   * Used to fill in the branch name for sessions restored from `/auth/whoami`,
   * which only returns `branch_id`. Failures resolve to `null` so a missing or
   * forbidden branch never blocks app startup.
   *
   * @param branchId - The branch UUID (or user defined branch id) to look up
   * @returns An observable of the branch name, or `null` when it can't be resolved
   */
  getBranchName(branchId: string): Observable<string | null> {
    return this.http
      .get<BranchListResponse>(`${this.apiUrl}/branch`, {
        withCredentials: true,
        params: { branch_id: branchId, page: 1, limit: 1 },
      })
      .pipe(
        map((res) => {
          const branches: BranchListResponseBranch[] = res.branch_list ?? [];
          const match: BranchListResponseBranch | undefined =
            branches.find(
              (b) => b.id === branchId || b.branch_id === branchId,
            ) ?? branches[0];

          return match?.branch_name ?? null;
        }),
        catchError(() => of(null)),
      );
  }

  /**
   * Creates a new branch.
   *
   * @param data - The request payload used to create a branch
   * @returns An observable containing the created branch information
   */
  create(data: CreateBranchRequest): Observable<CreateBranchResponse> {
    return this.http.post<CreateBranchResponse>(
      `${this.apiUrl}/branch/create`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Updates an existing branch with the provided data.
   *
   * @param data - The payload containing updated branch information
   * @returns An Observable of the updated branch response
   */
  update(data: BranchUpdateRequest): Observable<BranchUpdateResponse> {
    return this.http.put<BranchUpdateResponse>(
      `${this.apiUrl}/branch/update`,
      data,
      { withCredentials: true },
    );
  }
}
