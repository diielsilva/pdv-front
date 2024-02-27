import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const authService = inject(AuthService)
  const token = authService.getToken()

  if (token !== '') {
    const newRequest = req.clone({ headers: req.headers.append('Authorization', `Bearer ${token}`) })
    return next(newRequest).pipe(catchError((error) => {

      if (error instanceof HttpErrorResponse) {

        if (error.status === 401 || error.status === 403) {
          authService.logout()
          router.navigate([''])
        }

      }

      return throwError(() => error)
    }))
  }

  return next(req);
};
