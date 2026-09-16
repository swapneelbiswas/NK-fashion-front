import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HealthStatus {
  status: string;
  timestamp?: string;
  version?: string;
  [key: string]: unknown;
}

/**
 * Calls the .NET Health Check API to verify backend connectivity.
 */
@Injectable({ providedIn: 'root' })
export class HealthCheckService {
  private readonly apiUrl = '/api/healthcheck';

  constructor(private http: HttpClient) {}

  /**
   * Performs a GET request to the health check endpoint.
   * @returns Observable of HealthStatus returned by the API.
   */
  public getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(this.apiUrl);
  }
}
