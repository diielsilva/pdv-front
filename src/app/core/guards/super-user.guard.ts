import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../services/security.service';

export const superUserGuard: CanActivateFn = () => {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (securityService.isSessionBelongsToAnAdmin() || securityService.isSessionBelongsToAManager()) {
    return true;
  }

  router.navigate(['']);

  return false;
};
