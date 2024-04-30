import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserPerformanceRequest } from '../../common/dtos/users/user-performance.request';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  protected url: string = `${environment.api}/reports`;

  public constructor(private httpClient: HttpClient) { }

  public saleReport(id: number): Observable<Blob> {
    return this.generate(`${this.url}/sale/${id}`);
  }

  public todaysReport(date: Date): Observable<Blob> {
    const isoDate: string = date.toISOString().replace('Z', '');
    return this.generate(`${this.url}/sales/by-date?date=${isoDate}`);
  }

  public inventoryReport(): Observable<Blob> {
    return this.generate(`${this.url}/goods`);
  }

  public performanceReport(dto: UserPerformanceRequest): Observable<Blob> {
    const isoDate: string = dto.start.toISOString().replace('Z', '');
    return this.generate(`${this.url}/user/${dto.userId}/performance?start=${isoDate}`);
  }

  private generate(url: string): Observable<Blob> {
    return this.httpClient.get<Blob>(url, {
      responseType: 'blob' as 'json', headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf'
      }
    });
  }
}
