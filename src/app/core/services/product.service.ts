import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRequest } from '../../common/dtos/products/product.request';
import { constants } from '../constants/constants';
import { Product } from '../models/product';
import { Pageable } from '../utils/pageable';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${constants.api}/products`
  private httpClient = inject(HttpClient)

  public save(description: string, amount: number, price: number): Observable<Product> {
    const requestBody: ProductRequest = { description, amount, price }
    return this.httpClient.post<Product>(this.baseUrl, requestBody)
  }

  public findActive(page: number): Observable<Pageable<Product>> {
    return this.httpClient.get<Pageable<Product>>(`${this.baseUrl}/active?page=${this.calculatePage(page)}`)
  }

  public findInactive(page: number): Observable<Pageable<Product>> {
    return this.httpClient.get<Pageable<Product>>(`${this.baseUrl}/inactive?page=${this.calculatePage(page)}`)
  }

  public findActiveByDescriptionContaining(description: string, page: number): Observable<Pageable<Product>> {
    return this.httpClient.get<Pageable<Product>>(`${this.baseUrl}/active/search?description=${description}&page=${this.calculatePage(page)}`)
  }

  public findActiveById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/active/${id}`)
  }

  public update(id: number, description: string, amount: number, price: number): Observable<Product> {
    const requestBody: ProductRequest = { description, amount, price }
    return this.httpClient.put<Product>(`${this.baseUrl}/${id}`, requestBody)
  }

  public delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }

  public reactivate(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/${id}`, null)
  }

  private calculatePage(page: number): number {
    return page - 1
  }
}
