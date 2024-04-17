import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../../common/dtos/login/login.request';
import { LoginResponse } from '../../common/dtos/login/login.response';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private url: string = `${environment.api}/login`;

  public constructor(private httpClient: HttpClient) { }

  public login(dto: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.url, dto);
  }

  public logout(): void {
    localStorage.clear();
  }

  public initSession(dto: LoginResponse): void {
    localStorage.setItem('token', dto.token);
    localStorage.setItem('role', dto.role);
  }

  public getSession(): string {
    const token: string | null = localStorage.getItem('token');
    return token === null ? '' : token;
  }

  public hasActiveSession(): boolean {
    return localStorage.getItem('token') !== null;
  }

  public isSessionBelongsToAnAdmin(): boolean {
    return this.hasActiveSession() && localStorage.getItem('role') === 'ADMIN';
  }

  public isSessionBelongsToAManager(): boolean {
    return this.hasActiveSession() && localStorage.getItem('role') === 'MANAGER';
  }

}
