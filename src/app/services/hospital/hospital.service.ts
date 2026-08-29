import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import {
  HospitalListResponseInfo,
  CreateHospitalRequest,
  CreateHospitalResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  HospitalUpdateRequest,
  HospitalUpdateResponse,
  HospitalPasswordResponse,
} from '@models/hospital.model';

/**
 * Service responsible for hospital-related API operations.
 */
@Injectable({ providedIn: 'root' })
export class HospitalService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the complete list of hospitals.
   *
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @param searchValue - Search term to filter hospitals
   * @param hospitalStatus - Optional status filter (e.g., in use, inactive)
   * @param branch_id - optional branch id to filter hospitals
   * @param leader_id - optional leader id to filter hospitals
   * @returns An observable containing an array of hospital data
   */
  getHospitalByBranch(
    page: number,
    limit: number,
    searchValue?: string,
    hospitalStatus?: string, // 使用中 / 非使用
    branch_id?: string,
    leader_id?: string,
  ): Observable<{
    data: HospitalListResponseInfo[];
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
      branch_id?: string;
      leader_id?: string;
    } = {
      page,
      limit,
    };

    if (searchValue && searchValue.trim().length > 0) {
      params.name_search = searchValue.trim();
    }
    if (branch_id && branch_id.trim().length > 0) {
      params.branch_id = branch_id.trim();
    }
    if (leader_id && leader_id.trim().length > 0) {
      params.leader_id = leader_id.trim();
    }

    if (hospitalStatus && hospitalStatus.trim().length > 0) {
      params.hospital_status = hospitalStatus.trim();
    }

    return this.http
      .get<{
        status_code: number;
        result: string;
        total_count: number;
        page_keys: string;
        hospital_list: HospitalListResponseInfo[];
      }>(`${this.apiUrl}/hospital/get_all`, {
        withCredentials: true,
        params,
      })
      .pipe(
        map((res) => {
          const totalPages: number = Math.ceil(res.total_count / limit);

          return {
            data: res.hospital_list ?? [],
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
   * Retrieves the hospital password by ID and branch.
   *
   * @param hospital_id - The ID of the targeted hospital
   * @param branch_id - Optional branch ID to filter
   * @returns An observable containing the hospital's password data
   */
  getHospitalPassword(
    hospital_id: string,
    branch_id?: string,
  ): Observable<HospitalPasswordResponse> {
    const params: {
      hospital_id?: string;
      branch_id?: string;
    } = {};

    if (branch_id && branch_id.trim().length > 0) {
      params.branch_id = branch_id.trim();
    }

    if (hospital_id && hospital_id.trim().length > 0) {
      params.hospital_id = hospital_id.trim();
    }

    return this.http.get<HospitalPasswordResponse>(
      `${this.apiUrl}/hospital/password`,
      {
        withCredentials: true,
        params,
      },
    );
  }

  /**
   * Creates a new hospital.
   *
   * @param data - The request payload used to create a hospital
   * @returns An observable containing the created hospital information
   */
  create(data: CreateHospitalRequest): Observable<CreateHospitalResponse> {
    return this.http.post<CreateHospitalResponse>(
      `${this.apiUrl}/hospital/create`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Update hospital information.
   *
   * @param data - Hospital update request payload
   * @returns Observable containing update response
   */
  update(data: HospitalUpdateRequest): Observable<HospitalUpdateResponse> {
    return this.http.put<HospitalUpdateResponse>(
      `${this.apiUrl}/hospital/update`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * update hospital password for staff.
   *
   * @param data - The request payload used to update hospital password
   * @returns An observable containing the update hospital password information
   */
  update_password(
    data: UpdatePasswordRequest,
  ): Observable<UpdatePasswordResponse> {
    return this.http.put<UpdatePasswordResponse>(
      `${this.apiUrl}/hospital/update_password`,
      data,
      { withCredentials: true },
    );
  }
}
