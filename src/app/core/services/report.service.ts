import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from '../constants/constants';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  protected baseUrl = `${constants.api}/reports`
  protected httpClient = inject(HttpClient)

  public generateSaleReport(sale: Sale): Observable<Blob> {
    return this.httpClient.get<Blob>(`${this.baseUrl}/sale/${sale.id}`, {
      responseType: 'blob' as 'json', headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf'
      }
    })
  }

  public generateReportByDate(date: Date): Observable<Blob> {
    const isoDate = date.toISOString().replace('Z', '')
    return this.httpClient.get<Blob>(`${this.baseUrl}/sales/by-date?date=${isoDate}`, {
      responseType: 'blob' as 'json', headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf'
      }
    })
  }
}
