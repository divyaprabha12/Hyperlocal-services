import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://hyperlocal-services.onrender.com/api/admin';

  getPendingProviders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/providers/pending`);
  }

  verifyProvider(id: string, status: 'verified' | 'rejected'): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/providers/${id}/verify`, { status });
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }

  updateUserStatus(id: string, status: 'active' | 'suspended'): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/status`, { status });
  }

  getDisputes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/disputes`);
  }

  resolveDispute(id: string, status: string, resolutionDetails: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/disputes/${id}`, { status, resolutionDetails });
  }

  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/analytics`);
  }
}
