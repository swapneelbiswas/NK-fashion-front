import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { JobStatusCheckResponse } from '@models/jobs.model';
import {
  RoomListResponse,
  RoomListResponseInfo,
  CreateRoomRequest,
  CreateRoomResponse,
  UpdateRoomRequest,
  RoomUpdateResponse,
} from '@models/room.model';

/**
 * RoomService responsible for room-related API operations.
 */
@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the complete list of hospitals.
   *
   * @param hospitalId - Hospital ID to filter rooms
   * @param branchId - Branch ID to filter rooms
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   * @param searchValue - Search term to filter hospitals
   * @returns An observable containing an array of hospital data
   */
  getRoomList(
    hospitalId: string,
    branchId: string,
    page: number,
    limit: number,
    searchValue?: string,
  ): Observable<{
    data: RoomListResponseInfo[];
    pagination: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
    };
  }> {
    const params: {
      hospital_id: string;
      branch_id: string;
      branchId: string;
      page: number;
      limit: number;
      name_search?: string;
      hospital_status?: string;
    } = {
      hospital_id: hospitalId,
      branch_id: branchId,
      branchId,
      page,
      limit,
    };

    if (searchValue && searchValue.trim().length > 0) {
      params.name_search = searchValue.trim();
    }

    return this.http
      .get<RoomListResponse>(`${this.apiUrl}/room/get_all`, {
        withCredentials: true,
        params,
      })
      .pipe(
        map((res) => {
          const totalPages: number = Math.ceil(res.total_count / limit);

          return {
            data: res.data ?? [],
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
   * Creates a new room.
   *
   * @param data - The request payload used to create a room
   * @returns An observable containing the created room information
   */
  createRoom(data: CreateRoomRequest): Observable<CreateRoomResponse> {
    return this.http.post<CreateRoomResponse>(
      `${this.apiUrl}/room/create`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Update room information.
   *
   * @param data - Room update request payload
   * @returns Observable containing update response
   */
  updateRoom(data: UpdateRoomRequest): Observable<RoomUpdateResponse> {
    return this.http.put<RoomUpdateResponse>(
      `${this.apiUrl}/room/update`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Retrieves the current status of a background job.
   *
   * @param jobId - Unique identifier of the job
   * @returns Observable containing the job status response
   */
  getJobStatus(jobId: string): Observable<JobStatusCheckResponse> {
    return this.http.get<JobStatusCheckResponse>(
      `${this.apiUrl}/jobs/get_status/${jobId}`,
      { withCredentials: true },
    );
  }
}
