import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageHelper } from '../../common/helpers/message.helper';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageHelper: MessageHelper = inject(MessageHelper);

  return next(req).pipe(catchError((error) => {

    if (error instanceof HttpErrorResponse) {
      messageHelper.display(error.error.message, 'error');
    }

    return throwError(() => error);

  }));
}
