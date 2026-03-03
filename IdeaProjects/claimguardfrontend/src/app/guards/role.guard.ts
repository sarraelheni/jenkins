import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, Role } from '../services/auth.service';

export const roleGuard = (allowed: Role[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (auth.hasRole(allowed)) return true;

    // redirect to "their" home
    const role = auth.currentUser?.role;
    if (role === 'CLIENT') router.navigate(['/client']);
    else if (role === 'AGENT') router.navigate(['/agent']);
    else if (role === 'ADMIN') router.navigate(['/admin']);
    else router.navigate(['/login']);

    return false;
  };
};
