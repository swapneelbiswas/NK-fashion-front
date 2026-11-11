import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateJewelleryDetailRequest,
  CreateJewelleryItemRequest,
  GetJewelleryItemsQuery,
  JewelleryDetailResponse,
  JewelleryItemResponse,
  PagedJewelleryItemResponse,
  UpdateJewelleryItemStatusRequest,
} from '@models/nk-fashion.model';

/**
 * Service for managing jewellery variant configurations and individually tracked items.
 */
@Injectable({ providedIn: 'root' })
export class JewelleryService {
  private readonly detailsUrl: string = '/api/jewellerydetails';
  private readonly itemsUrl: string = '/api/jewellery-items';

  constructor(private readonly http: HttpClient) {}

  /**
   * Lists all jewellery detail configurations.
   *
   * @returns Observable emitting jewellery detail configurations.
   */
  public getJewelleryDetails(): Observable<JewelleryDetailResponse[]> {
    return this.http.get<JewelleryDetailResponse[]>(this.detailsUrl, {
      withCredentials: true,
    });
  }

  /**
   * Retrieves a jewellery detail configuration by ID.
   *
   * @param id Jewellery detail identifier.
   * @returns Observable emitting the jewellery detail configuration.
   */
  public getJewelleryDetailById(
    id: number,
  ): Observable<JewelleryDetailResponse> {
    return this.http.get<JewelleryDetailResponse>(`${this.detailsUrl}/${id}`, {
      withCredentials: true,
    });
  }

  /**
   * Creates a jewellery configuration for a product variant.
   *
   * @param payload Jewellery detail creation payload.
   * @returns Observable emitting the created jewellery detail.
   */
  public createJewelleryDetail(
    payload: CreateJewelleryDetailRequest,
  ): Observable<JewelleryDetailResponse> {
    return this.http.post<JewelleryDetailResponse>(this.detailsUrl, payload, {
      withCredentials: true,
    });
  }

  /**
   * Searches, filters, sorts, and paginates individually tracked jewellery items.
   *
   * @param query Optional filter, sort, and pagination parameters.
   * @returns Observable emitting a paged jewellery item list.
   */
  public getJewelleryItems(
    query?: GetJewelleryItemsQuery,
  ): Observable<PagedJewelleryItemResponse> {
    let params: HttpParams = new HttpParams();
    if (query) {
      if (query.search && query.search.trim().length > 0) {
        params = params.set('search', query.search.trim());
      }
      if (query.metalTypeId !== undefined && query.metalTypeId !== null) {
        params = params.set('metalTypeId', query.metalTypeId);
      }
      if (query.metalPurityId !== undefined && query.metalPurityId !== null) {
        params = params.set('metalPurityId', query.metalPurityId);
      }
      if (query.status !== undefined && query.status !== null) {
        params = params.set('status', query.status);
      }
      if (query.minPrice !== undefined && query.minPrice !== null) {
        params = params.set('minPrice', query.minPrice);
      }
      if (query.maxPrice !== undefined && query.maxPrice !== null) {
        params = params.set('maxPrice', query.maxPrice);
      }
      if (query.sortBy) {
        params = params.set('sortBy', query.sortBy);
      }
      if (query.page !== undefined && query.page !== null) {
        params = params.set('page', query.page);
      }
      if (query.pageSize !== undefined && query.pageSize !== null) {
        params = params.set('pageSize', query.pageSize);
      }
    }

    return this.http.get<PagedJewelleryItemResponse>(this.itemsUrl, {
      withCredentials: true,
      params,
    });
  }

  /**
   * Retrieves an individually tracked jewellery item by ID.
   *
   * @param id Jewellery item identifier.
   * @returns Observable emitting the jewellery item.
   */
  public getJewelleryItemById(id: number): Observable<JewelleryItemResponse> {
    return this.http.get<JewelleryItemResponse>(`${this.itemsUrl}/${id}`, {
      withCredentials: true,
    });
  }

  /**
   * Looks up a jewellery item by its Code 128 barcode.
   *
   * @param barcode Barcode string (e.g. NKJ...).
   * @returns Observable emitting the matching jewellery item.
   */
  public getJewelleryItemByBarcode(
    barcode: string,
  ): Observable<JewelleryItemResponse> {
    return this.http.get<JewelleryItemResponse>(
      `${this.itemsUrl}/barcode/${encodeURIComponent(barcode.trim())}`,
      { withCredentials: true },
    );
  }

  /**
   * Creates and prices an individually tracked jewellery item under a jewellery detail config.
   *
   * @param jewelleryDetailId Parent jewellery detail identifier.
   * @param payload Jewellery item creation payload.
   * @returns Observable emitting the created and priced jewellery item.
   */
  public createJewelleryItem(
    jewelleryDetailId: number,
    payload: CreateJewelleryItemRequest,
  ): Observable<JewelleryItemResponse> {
    return this.http.post<JewelleryItemResponse>(
      `${this.itemsUrl}/${jewelleryDetailId}`,
      payload,
      { withCredentials: true },
    );
  }

  /**
   * Updates the inventory status of a jewellery item.
   *
   * @param id Jewellery item identifier.
   * @param payload Status update payload.
   * @returns Observable emitting the updated jewellery item.
   */
  public updateJewelleryItemStatus(
    id: number,
    payload: UpdateJewelleryItemStatusRequest,
  ): Observable<JewelleryItemResponse> {
    return this.http.patch<JewelleryItemResponse>(
      `${this.itemsUrl}/${id}/status`,
      payload,
      { withCredentials: true },
    );
  }
}

