import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SaleDetailsResponse } from '../../common/dtos/sales/sale-details.response';
import { SaleRequest } from '../../common/dtos/sales/sale.request';
import { Sale } from '../models/sale';
import { Pageable } from '../utils/pageable';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  protected baseUrl = `${environment.api}/sales`
  protected httpClient = inject(HttpClient)

  public save(saleRequest: SaleRequest): Observable<Sale> {
    return this.httpClient.post<Sale>(this.baseUrl, saleRequest)
  }

  public findActive(page: number): Observable<Pageable<Sale>> {
    return this.httpClient.get<Pageable<Sale>>(`${this.baseUrl}/active?page=${this.calculatePage(page)}`)
  }

  public findActiveByDate(date: Date): Observable<Sale[]> {
    const isoDate = date.toISOString().replace('Z', '')
    return this.httpClient.get<Sale[]>(`${this.baseUrl}/active/search?date=${isoDate}`)
  }

  public details(id: number): Observable<SaleDetailsResponse> {
    return this.httpClient.get<SaleDetailsResponse>(`${this.baseUrl}/details/${id}`)
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }

  private calculatePage(page: number): number {
    return page - 1
  }

}
