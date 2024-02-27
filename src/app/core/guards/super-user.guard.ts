import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const superUserGuard: CanActivateFn = (route, state) => {
  const loginService = inject(AuthService)
  const router = inject(Router)

  if (loginService.isUserAnAdmin() || loginService.isUserAManager()) {
    return true
  }

  router.navigate([''])

  return false;
};
