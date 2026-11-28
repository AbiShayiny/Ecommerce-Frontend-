import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const buyerAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isBuyerSignedIn()) {
    return true;
  }
  auth.openGoogleSignIn(() => {
    void router.navigateByUrl(state.url);
  });
  return false;
};

export const approvedSupplierGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isApprovedSupplier()) {
    return true;
  }
  return router.createUrlTree(['/supplier/login']);
};

export const adminAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdminSignedIn()) {
    return true;
  }
  return router.createUrlTree(['/admin/login']);
};

