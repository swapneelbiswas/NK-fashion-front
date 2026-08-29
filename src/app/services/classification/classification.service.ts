import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';

/** A single room entry within a classification. */
export interface ClassificationRoom {
  room_id: string;
  room_number: string;
}

/** A single classification entry returned by the list API. */
export interface ClassificationResponseInfo {
  classification_id: string;
  hospital_id: string;
  classification_name: string;
  rooms: ClassificationRoom[];
}

/** Request body for POST hospital/classification. */
export interface CreateClassificationRequest {
  hospital_id: string;
  branch_id: string;
  classification_name: string;
  room_numbers: string[];
}

/** Request body for PUT hospital/classification. */
export interface UpdateClassificationRequest {
  classification_id: string;
  classification_name: string | null;
  room_numbers: string[] | null;
}

interface ClassificationListResponse {
  status_code: 200;
  result: 'OK';
  total_count: number;
  classifications: ClassificationResponseInfo[];
}

interface CreateClassificationResponse {
  status_code: 200;
  result: 'OK';
  classification_id: string;
  job_id: string;
}

interface UpdateClassificationResponse {
  status_code: 200;
  result: 'OK';
  job_id: string;
}

/**
 * ClassificationService handles all classification-related API operations.
 */
@Injectable({ providedIn: 'root' })
export class ClassificationService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the paginated list of classifications for a hospital.
   *
   * @param hospitalId - Hospital ID to filter classifications
   * @param page - 1-based page number
   * @param limit - Number of items per page
   * @param nameSearch - Optional partial match on classification_name
   * @returns Observable containing classification data and pagination info
   */
  getClassificationList(
    hospitalId: string,
    page: number,
    limit: number,
    nameSearch?: string,
  ): Observable<{
    data: ClassificationResponseInfo[];
    pagination: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
    };
  }> {
    const params: {
      hospital_id: string;
      page: number;
      limit: number;
      name_search?: string;
    } = { hospital_id: hospitalId, page, limit };

    if (nameSearch && nameSearch.trim().length > 0) {
      params.name_search = nameSearch.trim();
    }

    return this.http
      .get<ClassificationListResponse>(`${this.apiUrl}/hospital/classification`, {
        withCredentials: true,
        params,
      })
      .pipe(
        map((res) => ({
          data: res.classifications ?? [],
          pagination: {
            page,
            limit,
            total_items: res.total_count,
            total_pages: Math.ceil(res.total_count / limit),
          },
        })),
      );
  }

  /**
   * Creates a new classification.
   *
   * @param data - Request payload for classification creation
   * @returns Observable containing the creation response with job_id
   */
  createClassification(
    data: CreateClassificationRequest,
  ): Observable<CreateClassificationResponse> {
    return this.http.post<CreateClassificationResponse>(
      `${this.apiUrl}/hospital/classification`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Updates an existing classification.
   *
   * @param data - Request payload for classification update
   * @returns Observable containing the update response with job_id
   */
  updateClassification(
    data: UpdateClassificationRequest,
  ): Observable<UpdateClassificationResponse> {
    return this.http.put<UpdateClassificationResponse>(
      `${this.apiUrl}/hospital/classification`,
      data,
      { withCredentials: true },
    );
  }
}
