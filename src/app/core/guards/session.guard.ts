import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { SecurityService } from '../services/security.service';

export const sessionGuard: CanActivateChildFn = () => {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (securityService.hasActiveSession()) {
    return true;
  }

  router.navigate(['']);
  
  return false;
};
