import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'https://hyperlocal-services.onrender.com/api';

  // Global authentication signals
  readonly currentUser = signal<any | null>(null);
  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly authLoading = signal<boolean>(false);

  // Computed states
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isCustomer = computed(() => this.currentUser()?.role === 'customer');
  readonly isProvider = computed(() => this.currentUser()?.role === 'provider');
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    // If token exists, load current profile on startup
    if (this.token()) {
      this.loadProfile().subscribe({
        error: () => this.logout()
      });
    }
  }

  register(data: any): Observable<any> {
    this.authLoading.set(true);
    return this.http.post<any>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => {
        if (res.success && res.token) {
          this.setSession(res.token, res.user);
        }
        this.authLoading.set(false);
      }),
      catchError(err => {
        this.authLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  login(credentials: any): Observable<any> {
    this.authLoading.set(true);
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.token) {
          this.setSession(res.token, res.user);
        }
        this.authLoading.set(false);
      }),
      catchError(err => {
        this.authLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  loadProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`).pipe(
      tap(res => {
        if (res.success) {
          this.currentUser.set(res.user);
        }
      }),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  updateProfile(updates: any): Observable<any> {
    // Determine path based on role
    const path = this.isProvider() ? '/provider/onboard' : '/auth/me';
    return this.http.put<any>(`${this.apiUrl}${path}`, updates).pipe(
      tap(res => {
        if (res.success) {
          this.currentUser.update(user => {
            if (this.isProvider()) {
              return { ...user, providerProfile: res.data };
            }
            return { ...user, ...res.user };
          });
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(jwtToken: string, userDetails: any): void {
    localStorage.setItem('token', jwtToken);
    this.token.set(jwtToken);
    this.currentUser.set(userDetails);
  }
}
