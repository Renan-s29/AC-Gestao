import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed: string[] = route.data['roles'] || [];
  if (!auth.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }
  if (allowed.length === 0) return true;
  if (auth.getRole() === 'admin') return true;
  if (allowed.includes(auth.getRole())) return true;
  router.navigateByUrl('/dashboard');
  return false;
};
