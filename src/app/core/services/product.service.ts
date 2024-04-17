import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductRequest } from '../../common/dtos/products/product.request';
import { Product } from '../models/product';
import { Pageable } from '../utils/pageable';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url: string = `${environment.api}/products`;

  public constructor(private httpClient: HttpClient) { }

  public save(dto: ProductRequest): Observable<Product> {
    return this.httpClient.post<Product>(this.url, dto);
  }

  public findActive(page: number): Observable<Pageable<Product>> {
    return this.httpClient.get<Pageable<Product>>(`${this.url}/active?page=${this.calculatePage(page)}`);
  }

  public findInactive(page: number): Observable<Pageable<Product>> {
    return this.httpClient.get<Pageable<Product>>(`${this.url}/inactive?page=${this.calculatePage(page)}`);
  }

  public search(description: string, page: number): Observable<Pageable<Product>> {
    return this.httpClient.get<Pageable<Product>>(`${this.url}/active/search?description=${description}&page=${this.calculatePage(page)}`);
  }

  public findActiveById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.url}/active/${id}`);
  }

  public update(id: number, dto: ProductRequest): Observable<Product> {
    return this.httpClient.put<Product>(`${this.url}/${id}`, dto);
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

  public reactivate(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.url}/${id}`, null);
  }

  private calculatePage(page: number): number {
    return page - 1;
  }
}
