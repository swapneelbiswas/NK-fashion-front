import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateMetalPurityRequest,
  CreateMetalRateRequest,
  CreateMetalTypeRequest,
  MetalPurityResponse,
  MetalRateResponse,
  MetalTypeResponse,
} from '@models/nk-fashion.model';

/**
 * Service for managing precious metal types, purities, and rates.
 */
@Injectable({ providedIn: 'root' })
export class MetalService {
  private readonly typesUrl: string = '/api/metaltypes';
  private readonly puritiesUrl: string = '/api/metalpurities';
  private readonly ratesUrl: string = '/api/metalrates';

  constructor(private readonly http: HttpClient) {}

  /**
   * Lists all precious metal types.
   *
   * @returns Observable emitting metal types.
   */
  public getMetalTypes(): Observable<MetalTypeResponse[]> {
    return this.http.get<MetalTypeResponse[]>(this.typesUrl, {
      withCredentials: true,
    });
  }

  /**
   * Retrieves a metal type by ID.
   *
   * @param id Metal type identifier.
   * @returns Observable emitting the metal type.
   */
  public getMetalTypeById(id: number): Observable<MetalTypeResponse> {
    return this.http.get<MetalTypeResponse>(`${this.typesUrl}/${id}`, {
      withCredentials: true,
    });
  }

  /**
   * Creates a new metal type.
   *
   * @param payload Metal type creation payload.
   * @returns Observable emitting the created metal type.
   */
  public createMetalType(
    payload: CreateMetalTypeRequest,
  ): Observable<MetalTypeResponse> {
    return this.http.post<MetalTypeResponse>(this.typesUrl, payload, {
      withCredentials: true,
    });
  }

  /**
   * Lists all metal purities.
   *
   * @returns Observable emitting metal purities.
   */
  public getMetalPurities(): Observable<MetalPurityResponse[]> {
    return this.http.get<MetalPurityResponse[]>(this.puritiesUrl, {
      withCredentials: true,
    });
  }

  /**
   * Retrieves a metal purity by ID.
   *
   * @param id Metal purity identifier.
   * @returns Observable emitting the metal purity.
   */
  public getMetalPurityById(id: number): Observable<MetalPurityResponse> {
    return this.http.get<MetalPurityResponse>(`${this.puritiesUrl}/${id}`, {
      withCredentials: true,
    });
  }

  /**
   * Creates a new metal purity linked to a metal type.
   *
   * @param payload Metal purity creation payload.
   * @returns Observable emitting the created metal purity.
   */
  public createMetalPurity(
    payload: CreateMetalPurityRequest,
  ): Observable<MetalPurityResponse> {
    return this.http.post<MetalPurityResponse>(this.puritiesUrl, payload, {
      withCredentials: true,
    });
  }

  /**
   * Lists all historical and active metal rates.
   *
   * @returns Observable emitting metal rates.
   */
  public getMetalRates(): Observable<MetalRateResponse[]> {
    return this.http.get<MetalRateResponse[]>(this.ratesUrl, {
      withCredentials: true,
    });
  }

  /**
   * Gets the currently applicable metal rate for a given metal type, purity, and currency.
   *
   * @param metalTypeId Metal type identifier.
   * @param metalPurityId Metal purity identifier.
   * @param currencyCode Optional 3-letter currency code (defaults to AUD on server).
   * @returns Observable emitting the active metal rate.
   */
  public getCurrentMetalRate(
    metalTypeId: number,
    metalPurityId: number,
    currencyCode?: string,
  ): Observable<MetalRateResponse> {
    let params: HttpParams = new HttpParams()
      .set('metalTypeId', metalTypeId)
      .set('metalPurityId', metalPurityId);
    if (currencyCode && currencyCode.trim().length > 0) {
      params = params.set('currencyCode', currencyCode.trim());
    }

    return this.http.get<MetalRateResponse>(`${this.ratesUrl}/current`, {
      withCredentials: true,
      params,
    });
  }

  /**
   * Creates a new metal rate entry and updates the rate timeline.
   *
   * @param payload Metal rate creation payload.
   * @returns Observable emitting the created metal rate.
   */
  public createMetalRate(
    payload: CreateMetalRateRequest,
  ): Observable<MetalRateResponse> {
    return this.http.post<MetalRateResponse>(this.ratesUrl, payload, {
      withCredentials: true,
    });
  }
}

