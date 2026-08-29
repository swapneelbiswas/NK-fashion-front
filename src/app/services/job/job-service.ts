import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  filter,
  interval,
  map,
  Observable,
  switchMap,
  take,
  takeWhile,
  timeout,
} from 'rxjs';
import { environment } from '@env/environment';
import { JobStatusCheckResponse } from '@models/jobs.model';

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = environment.api_url;
  constructor(private http: HttpClient) {}

  private readonly TERMINAL_STATES = new Set(['SUCCESS', 'FAILED', 'DEAD']);

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

  /**
   * Polls the job status until it reaches a terminal state.
   *
   * @param jobId - ID of the job to poll
   * @returns Observable emitting `true` if job succeeded, errors otherwise
   */
  pollJobUntilDone(jobId: string): Observable<boolean> {
    return interval(3000).pipe(
      switchMap(() => this.getJobStatus(jobId)),

      // Keep polling until a terminal state is reached
      takeWhile((res) => !this.TERMINAL_STATES.has(res.status_type), true),

      // Emit only SUCCESS downstream
      filter((res) => res.status_type === 'SUCCESS' && res.status === true),

      map(() => true),

      // Complete after first SUCCESS
      take(1),
      timeout(20000),
    );
  }
}
