import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../common/dtos/login/login.request';
import { LoginResponse } from '../../common/dtos/login/login.response';
import { constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${constants.api}/login`
  private httpClient = inject(HttpClient)

  public login(login: string, password: string): Observable<LoginResponse> {
    const requestBody: LoginRequest = { login, password }
    return this.httpClient.post<LoginResponse>(this.baseUrl, requestBody)
  }

  public logout(): void {
    localStorage.clear()
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

  public onSuccessfulLogin(loginResponse: LoginResponse): void {
    localStorage.setItem('token', loginResponse.token)
    localStorage.setItem('role', loginResponse.role)
  }

  public getToken(): string {
    const token = localStorage.getItem('token')
    return token === null ? '' : token
  }

}
