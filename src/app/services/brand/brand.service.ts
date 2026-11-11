import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BrandResponse,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '@models/nk-fashion.model';

/**
 * Service for managing product brands via /api/brands.
 */
@Injectable({ providedIn: 'root' })
export class BrandService {
  private readonly apiUrl: string = '/api/brands';

  constructor(private readonly http: HttpClient) {}

  /**
   * Lists all brands ordered by name.
   *
   * @returns Observable emitting the list of brands.
   */
  public getBrands(): Observable<BrandResponse[]> {
    return this.http.get<BrandResponse[]>(this.apiUrl, {
      withCredentials: true,
    });
  }

  /**
   * Retrieves a single brand by its ID.
   *
   * @param id Brand identifier.
   * @returns Observable emitting the matching brand.
   */
  public getBrandById(id: number): Observable<BrandResponse> {
    return this.http.get<BrandResponse>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  /**
   * Creates a new brand.
   *
   * @param payload Brand creation payload.
   * @returns Observable emitting the created brand.
   */
  public createBrand(payload: CreateBrandRequest): Observable<BrandResponse> {
    return this.http.post<BrandResponse>(this.apiUrl, payload, {
      withCredentials: true,
    });
  }

  /**
   * Updates an existing brand.
   *
   * @param id Brand identifier.
   * @param payload Updated brand fields.
   * @returns Observable emitting the updated brand.
   */
  public updateBrand(
    id: number,
    payload: UpdateBrandRequest,
  ): Observable<BrandResponse> {
    return this.http.put<BrandResponse>(`${this.apiUrl}/${id}`, payload, {
      withCredentials: true,
    });
  }

  /**
   * Soft-deletes (deactivates) a brand by ID.
   *
   * @param id Brand identifier.
   * @returns Observable completing when deactivation succeeds.
   */
  public deactivateBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}

