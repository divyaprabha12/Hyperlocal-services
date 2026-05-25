import { Routes } from '@angular/router';
import { authGuard, customerGuard, providerGuard, adminGuard, nonAuthGuard } from './core/guards/auth.guard';
import { AppLayoutComponent } from './shared/layout';

export const routes: Routes = [
  // Public
  { path: '', loadComponent: () => import('./pages/public/landing').then(m => m.LandingPage) },
  { path: 'categories', loadComponent: () => import('./pages/public/categories').then(m => m.CategoriesPage) },
  { path: 'about', loadComponent: () => import('./pages/public/about').then(m => m.AboutPage) },
  { path: 'login', loadComponent: () => import('./pages/auth/login').then(m => m.LoginPage), canActivate: [nonAuthGuard] },
  { path: 'register', loadComponent: () => import('./pages/auth/register').then(m => m.RegisterPage), canActivate: [nonAuthGuard] },

  // Authenticated Layout
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      // Customer
      { path: 'customer/dashboard', loadComponent: () => import('./pages/customer/dashboard').then(m => m.CustomerDashboardPage), canActivate: [customerGuard] },
      { path: 'customer/search', loadComponent: () => import('./pages/customer/search').then(m => m.SearchServicesPage), canActivate: [customerGuard] },
      { path: 'customer/bookings', loadComponent: () => import('./pages/customer/my-bookings').then(m => m.MyBookingsPage), canActivate: [customerGuard] },
      { path: 'customer/bookings/:id', loadComponent: () => import('./pages/customer/booking-tracking').then(m => m.CustomerBookingTrackingPage), canActivate: [customerGuard] },
      { path: 'customer/providers/:id', loadComponent: () => import('./pages/customer/provider-profile').then(m => m.CustomerProviderProfilePage), canActivate: [customerGuard] },
      { path: 'customer/complaints', loadComponent: () => import('./pages/customer/complaints').then(m => m.CustomerComplaintsPage), canActivate: [customerGuard] },
      { path: 'customer/reviews', loadComponent: () => import('./pages/customer/reviews').then(m => m.CustomerReviewsPage), canActivate: [customerGuard] },
      { path: 'customer/profile', loadComponent: () => import('./pages/customer/profile').then(m => m.CustomerProfilePage), canActivate: [customerGuard] },

      // Provider
      { path: 'provider/dashboard', loadComponent: () => import('./pages/provider/dashboard').then(m => m.ProviderDashboardPage), canActivate: [providerGuard] },
      { path: 'provider/jobs', loadComponent: () => import('./pages/provider/jobs').then(m => m.ProviderJobsPage), canActivate: [providerGuard] },
      { path: 'provider/earnings', loadComponent: () => import('./pages/provider/earnings').then(m => m.ProviderEarningsPage), canActivate: [providerGuard] },
      { path: 'provider/manage-services', loadComponent: () => import('./pages/provider/manage-services').then(m => m.ProviderManageServicesPage), canActivate: [providerGuard] },
      { path: 'provider/portfolio', loadComponent: () => import('./pages/provider/portfolio').then(m => m.ProviderPortfolioPage), canActivate: [providerGuard] },
      { path: 'provider/kyc', loadComponent: () => import('./pages/provider/kyc').then(m => m.ProviderKycPage), canActivate: [providerGuard] },
      { path: 'provider/reviews', loadComponent: () => import('./pages/provider/reviews').then(m => m.ProviderReviewsPage), canActivate: [providerGuard] },
      { path: 'provider/profile', loadComponent: () => import('./pages/provider/profile').then(m => m.ProviderProfilePage), canActivate: [providerGuard] },

      // Admin
      { path: 'admin/dashboard', loadComponent: () => import('./pages/admin/dashboard').then(m => m.AdminDashboardPage), canActivate: [adminGuard] },
      { path: 'admin/kyc', loadComponent: () => import('./pages/admin/kyc').then(m => m.AdminKycPage), canActivate: [adminGuard] },
      { path: 'admin/profile', loadComponent: () => import('./pages/admin/profile').then(m => m.AdminProfilePage), canActivate: [adminGuard] },
      { path: 'admin/users', loadComponent: () => import('./pages/admin/users').then(m => m.AdminUsersPage), canActivate: [adminGuard] },
      { path: 'admin/reports', loadComponent: () => import('./pages/admin/reports').then(m => m.AdminReportsPage), canActivate: [adminGuard] },
    ]
  },

  { path: '**', redirectTo: '' }
];
