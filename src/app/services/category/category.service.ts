import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@models/nk-fashion.model';

/**
 * Service for managing hierarchical product categories via /api/categories.
 */
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl: string = '/api/categories';

  constructor(private readonly http: HttpClient) {}

  /**
   * Retrieves all categories as a nested tree (including inactive categories).
   *
   * @returns Observable emitting the nested category tree.
   */
  public getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.apiUrl, {
      withCredentials: true,
    });
  }

  /**
   * Retrieves only active categories as a nested tree.
   *
   * @returns Observable emitting the active nested category tree.
   */
  public getActiveCategoryTree(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.apiUrl}/tree`, {
      withCredentials: true,
    });
  }

  /**
   * Retrieves a single category by ID.
   *
   * @param id Category identifier.
   * @returns Observable emitting the matching category.
   */
  public getCategoryById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  /**
   * Creates a new category.
   *
   * @param payload Category creation payload.
   * @returns Observable emitting the created category.
   */
  public createCategory(
    payload: CreateCategoryRequest,
  ): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.apiUrl, payload, {
      withCredentials: true,
    });
  }

  /**
   * Updates an existing category.
   *
   * @param id Category identifier.
   * @param payload Updated category fields.
   * @returns Observable emitting the updated category.
   */
  public updateCategory(
    id: number,
    payload: UpdateCategoryRequest,
  ): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, payload, {
      withCredentials: true,
    });
  }

  /**
   * Soft-deletes (deactivates) a category by ID.
   *
   * @param id Category identifier.
   * @returns Observable completing when deactivation succeeds.
   */
  public deactivateCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}

