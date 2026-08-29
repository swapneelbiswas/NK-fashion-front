import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';

import {
  DropdownListResponse,
  DropdownPageInfo,
  DropdownResponseInfo,
  RoomNumberInfo,
} from '@models/dropdown.model';
import { DropdownTable, DROPDOWN_TABLE } from '@utils/dropdown/dropdown-tables';

/**
 * Service responsible for dropdown-related API operations.
 */
@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a list of dropdown options, optionally paginated.
   *
   * @param table_name - table name to fetch dropdown list (e.g., 'hospital', 'service', etc.)
   * @param id - optional id to fetch dropdown list
   * @param limit - optional number of items to fetch
   * @param after - optional cursor for pagination
   * @returns An observable containing a map of table names to their paginated dropdown data
   */
  getDropDownList(
    table_name: DropdownTable,
    id?: string,
    limit?: number,
    after?: number,
  ): Observable<{ [key: string]: DropdownPageInfo }> {
    const params: {
      table?: string;
      id?: string;
      limit?: string;
      after?: string;
    } = {};

    if (table_name && table_name.trim().length > 0) {
      params.table = table_name.trim();
    }
    if (id && id.trim().length > 0) {
      params.id = id.trim();
    }
    if (limit !== undefined) {
      params.limit = String(limit);
    }
    if (after !== undefined) {
      params.after = String(after);
    }

    return this.http
      .get<DropdownListResponse>(`${this.apiUrl}/dropdown/get_all_dropdowns`, {
        withCredentials: true,
        params,
      })
      .pipe(map((res) => res.dropdown_list ?? {}));
  }
  /**
   * Retrieves a list of dropdown options, optionally paginated.
   *
   * @param table_name - table name to fetch dropdown list (rooms.)
   * @param hospital_id - optional hospital_id to fetch dropdown list
   * @param id - optional field id to filter results (e.g. floor field_id to get room numbers)
   * @param limit - optional number of items to fetch
   * @param after - optional cursor for pagination
   * @returns An observable containing a map of table names to their paginated dropdown data
   */
  getDropDownListWithHospitalId(
    table_name: DropdownTable,
    hospital_id?: string,
    id?: string,
    limit?: number,
    after?: number,
  ): Observable<{ [key: string]: DropdownPageInfo }> {
    const params: {
      table?: string;
      hospital_id?: string;
      id?: string;
      limit?: string;
      after?: string;
    } = {};

    if (table_name && table_name.trim().length > 0) {
      params.table = table_name.trim();
    }
    if (hospital_id && hospital_id.trim().length > 0) {
      params.hospital_id = hospital_id.trim();
    }
    if (id && id.trim().length > 0) {
      params.id = id.trim();
    }
    if (limit !== undefined) {
      params.limit = String(limit);
    }
    if (after !== undefined) {
      params.after = String(after);
    }

    return this.http
      .get<DropdownListResponse>(`${this.apiUrl}/dropdown/get_all_dropdowns`, {
        withCredentials: true,
        params,
      })
      .pipe(map((res) => res.dropdown_list ?? {}));
  }

  /**
   * Fetches room numbers for a specific floor.
   *
   * @param hospital_id - hospital id to scope the request
   * @param field_id - floor field_id whose room numbers should be returned
   * @returns An observable of RoomNumberInfo items
   */
  getRoomsList(hospital_id?: string, field_id?: string): Observable<RoomNumberInfo[]> {
    return this.getDropDownListWithHospitalId(DROPDOWN_TABLE.ROOM, hospital_id, field_id).pipe(
      map((res) => (res[DROPDOWN_TABLE.ROOM]?.items ?? []).flatMap((item) => item.room_number ?? [])),
    );
  }

  /**
   * Fetches the list of hospital classifications for the given hospital.
   *
   * @param hospital_id - The hospital UUID to scope the request.
   * @returns An observable of DropdownResponseInfo items (field_id = id, field_name = classification_name).
   */
  getClassifications(hospital_id: string): Observable<DropdownResponseInfo[]> {
    return this.getDropDownListWithHospitalId(DROPDOWN_TABLE.HOSPITAL_CLASSIFICATION, hospital_id).pipe(
      map((res) => res[DROPDOWN_TABLE.HOSPITAL_CLASSIFICATION]?.items ?? []),
    );
  }

  /**
   * Fetches room numbers belonging to a specific classification.
   *
   * @param classification_id - The classification UUID to filter rooms by.
   * @returns An observable of DropdownResponseInfo items (field_id = id, field_name = room_number).
   */
  getClassificationRooms(classification_id: string): Observable<DropdownResponseInfo[]> {
    return this.http
      .get<DropdownListResponse>(
        `${this.apiUrl}/dropdown/get_all_dropdowns`,
        { withCredentials: true, params: { table: DROPDOWN_TABLE.CLASSIFICATION_ROOM, classification_id } },
      )
      .pipe(map((res) => res.dropdown_list?.[DROPDOWN_TABLE.CLASSIFICATION_ROOM]?.items ?? []));
  }
}
