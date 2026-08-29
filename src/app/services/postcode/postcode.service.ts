import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PostcodeResult {
  prefecture?: string;
  city?: string;
  suburb?: string;
  street_address?: string | null;
}

/** Service for resolving Japanese postal codes to address data via the teraren API. */
@Injectable({ providedIn: 'root' })
export class PostcodeService {
  /** @param http - Angular HTTP client for making API requests. */
  constructor(private http: HttpClient) {}

  /**
   * Looks up address data for a 7-digit Japanese postal code.
   * @param code - The 7-digit postal code (digits only, no hyphens).
   * @returns Observable resolving to prefecture, city, suburb, and street address fields.
   */
  lookup(code: string): Observable<PostcodeResult> {
    return this.http.get<PostcodeResult>(`https://postcode.teraren.com/postcodes/${code}.json`);
  }
}
