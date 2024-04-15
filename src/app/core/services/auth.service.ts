import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../common/dtos/login/login.request';
import { LoginResponse } from '../../common/dtos/login/login.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.api}/login`
  private httpClient = inject(HttpClient)

  public login(dto: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.baseUrl, dto)
  }

  public logout(): void {
    localStorage.clear()
  }

  public onSuccessfulLogin(dto: LoginResponse): void {
    localStorage.setItem('token', dto.token)
    localStorage.setItem('role', dto.role)
  }

  public getToken(): string {
    const token = localStorage.getItem('token')
    return token === null ? '' : token
  }

  public hasOnlineUser(): boolean {
    return localStorage.getItem('token') !== null
  }

  public isUserAnAdmin(): boolean {
    return this.hasOnlineUser() && localStorage.getItem('role') === 'ADMIN'
  }

  public isUserAManager(): boolean {
    return this.hasOnlineUser() && localStorage.getItem('role') === 'MANAGER'
  }

}
