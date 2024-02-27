import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingHelper } from '../../common/helpers/loading.helper';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingHelper = inject(LoadingHelper)
  loadingHelper.displayLoading()
  return next(req).pipe(finalize(() => loadingHelper.hiddenLoading()));
};
