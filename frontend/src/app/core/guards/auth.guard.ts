import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isCustomer()) {
    return true;
  }

  router.navigate([authService.isAuthenticated() ? '/login' : '/login']);
  return false;
};

export const providerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isProvider()) {
    return true;
  }

  router.navigate([authService.isAuthenticated() ? '/login' : '/login']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  router.navigate([authService.isAuthenticated() ? '/login' : '/login']);
  return false;
};

export const nonAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redirect based on role
  if (authService.isCustomer()) {
    router.navigate(['/customer/dashboard']);
  } else if (authService.isProvider()) {
    router.navigate(['/provider/dashboard']);
  } else if (authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
  }
  return false;
};
