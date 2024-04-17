import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SecurityService } from '../services/security.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const securityService: SecurityService = inject(SecurityService);
  const router: Router = inject(Router);
  const token: string = securityService.getSession();

  if (token !== '') {
    const newRequest = req.clone({ headers: req.headers.append('Authorization', `Bearer ${token}`) });
    return next(newRequest).pipe(catchError((error) => {

      if (error instanceof HttpErrorResponse) {

        if (error.status === 401 || error.status === 403) {
          securityService.logout();
          router.navigate(['']);
        }

      }

      return throwError(() => error);
    }))
  }

  return next(req);
};
