import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  protected url: string = `${environment.api}/sales`;

  public constructor(private httpClient: HttpClient) { }

  public save(dto: SaleRequest): Observable<Sale> {
    return this.httpClient.post<Sale>(this.url, dto);
  }

  public findActive(page: number): Observable<Pageable<Sale>> {
    return this.httpClient.get<Pageable<Sale>>(`${this.url}/active?page=${this.calculatePage(page)}`);
  }

  public search(date: Date): Observable<Sale[]> {
    const isoDate = date.toISOString().replace('Z', '');
    return this.httpClient.get<Sale[]>(`${this.url}/active/search?date=${isoDate}`);
  }

  public details(id: number): Observable<SaleDetailsResponse> {
    return this.httpClient.get<SaleDetailsResponse>(`${this.url}/details/${id}`);
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

  private calculatePage(page: number): number {
    return page - 1;
  }

}
