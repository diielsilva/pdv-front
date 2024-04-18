import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingHelper } from '../../common/helpers/loading.helper';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingHelper: LoadingHelper = inject(LoadingHelper);
  loadingHelper.display();

  return next(req).pipe(finalize(() => loadingHelper.hidden()));
};
