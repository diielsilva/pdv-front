import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sessionGuard: CanActivateChildFn = (route, state) => {
  const loginService = inject(AuthService)
  const router = inject(Router)

  if (loginService.hasOnlineUser()) {
    return true
  }

  router.navigate([''])
  return false
};
