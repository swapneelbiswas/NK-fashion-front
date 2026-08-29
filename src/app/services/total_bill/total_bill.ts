/* eslint-disable jsdoc/require-jsdoc */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface TotalBillResponse {
  status_code: number;
  result: string;
  service_day_count: number;
  total_service_bill: number;
  total_option_bill: number;
  total_bill: number;
}

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class TotalBillService {
  private apiUrl = environment.api_url;

  constructor(private http: HttpClient) {}

  getTotalBill(
    hospitalId: string | null,
    branchId: string | null,
    startDate: string | null,
    endDate: string | null,
    billingDeadline?: string | null,
    patientName?: string | null,
  ): Observable<TotalBillResponse> {
    const params: Record<string, string> = {};

    if (hospitalId) params['hospital_id'] = hospitalId;
    if (branchId) params['branch_id'] = branchId;

    if (startDate) params['start_date'] = startDate;
    if (endDate) params['end_date'] = endDate;
    if (billingDeadline) params['billing_deadline'] = billingDeadline;
    if (patientName) params['patient_name'] = patientName;

    return this.http.get<TotalBillResponse>(
      `${this.apiUrl}/delivery_request/get_total_bill`,
      { withCredentials: true, params },
    );
  }
}
