import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateProductRequest,
  CreateProductVariantRequest,
  GetProductsQuery,
  ProductResponse,
  ProductVariantResponse,
  UpdateProductRequest,
  UpdateProductVariantRequest,
} from '@models/nk-fashion.model';

/**
 * Service for managing products and product variants via /api/products.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl: string = '/api/products';

  constructor(private readonly http: HttpClient) {}

  /**
   * Searches and lists products with optional filters.
   *
   * @param query Optional filter parameters.
   * @returns Observable emitting matching products ordered by name.
   */
  public getProducts(query?: GetProductsQuery): Observable<ProductResponse[]> {
    let params: HttpParams = new HttpParams();
    if (query) {
      if (query.search && query.search.trim().length > 0) {
        params = params.set('search', query.search.trim());
      }
      if (query.categoryId !== undefined && query.categoryId !== null) {
        params = params.set('categoryId', query.categoryId);
      }
      if (query.brandId !== undefined && query.brandId !== null) {
        params = params.set('brandId', query.brandId);
      }
      if (query.productType !== undefined && query.productType !== null) {
        params = params.set('productType', query.productType);
      }
      if (query.isActive !== undefined && query.isActive !== null) {
        params = params.set('isActive', query.isActive);
      }
      if (query.isFeatured !== undefined && query.isFeatured !== null) {
        params = params.set('isFeatured', query.isFeatured);
      }
    }

    return this.http.get<ProductResponse[]>(this.apiUrl, {
      withCredentials: true,
      params,
    });
  }

  /**
   * Retrieves a single product by ID.
   *
   * @param id Product identifier.
   * @returns Observable emitting the matching product.
   */
  public getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  /**
   * Creates a new product.
   *
   * @param payload Product creation payload.
   * @returns Observable emitting the created product.
   */
  public createProduct(
    payload: CreateProductRequest,
  ): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, payload, {
      withCredentials: true,
    });
  }

  /**
   * Updates an existing product.
   *
   * @param id Product identifier.
   * @param payload Updated product fields.
   * @returns Observable emitting the updated product.
   */
  public updateProduct(
    id: number,
    payload: UpdateProductRequest,
  ): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, payload, {
      withCredentials: true,
    });
  }

  /**
   * Lists all variants belonging to a product.
   *
   * @param productId Parent product identifier.
   * @returns Observable emitting variants ordered by size and colour.
   */
  public getProductVariants(
    productId: number,
  ): Observable<ProductVariantResponse[]> {
    return this.http.get<ProductVariantResponse[]>(
      `${this.apiUrl}/${productId}/variants`,
      { withCredentials: true },
    );
  }

  /**
   * Retrieves a specific product variant by ID.
   *
   * @param productId Parent product identifier.
   * @param id Variant identifier.
   * @returns Observable emitting the matching variant.
   */
  public getProductVariantById(
    productId: number,
    id: number,
  ): Observable<ProductVariantResponse> {
    return this.http.get<ProductVariantResponse>(
      `${this.apiUrl}/${productId}/variants/${id}`,
      { withCredentials: true },
    );
  }

  /**
   * Creates a new variant under a product.
   *
   * @param productId Parent product identifier.
   * @param payload Variant creation payload.
   * @returns Observable emitting the created variant.
   */
  public createProductVariant(
    productId: number,
    payload: CreateProductVariantRequest,
  ): Observable<ProductVariantResponse> {
    return this.http.post<ProductVariantResponse>(
      `${this.apiUrl}/${productId}/variants`,
      payload,
      { withCredentials: true },
    );
  }

  /**
   * Updates an existing product variant.
   *
   * @param productId Parent product identifier.
   * @param id Variant identifier.
   * @param payload Updated variant fields.
   * @returns Observable emitting the updated variant.
   */
  public updateProductVariant(
    productId: number,
    id: number,
    payload: UpdateProductVariantRequest,
  ): Observable<ProductVariantResponse> {
    return this.http.put<ProductVariantResponse>(
      `${this.apiUrl}/${productId}/variants/${id}`,
      payload,
      { withCredentials: true },
    );
  }

  /**
   * Soft-deletes (deactivates) a product variant.
   *
   * @param productId Parent product identifier.
   * @param id Variant identifier.
   * @returns Observable completing when deactivation succeeds.
   */
  public deactivateProductVariant(
    productId: number,
    id: number,
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${productId}/variants/${id}`,
      { withCredentials: true },
    );
  }
}

