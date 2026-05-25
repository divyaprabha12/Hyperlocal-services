import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://hyperlocal-services.onrender.com/api/provider';

  onboard(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/onboard`, data);
  }

  getBookings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings`);
  }

  updateBookingStatus(id: string, status: string, otp?: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bookings/${id}/status`, { status, otp });
  }

  getEarnings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/earnings`);
  }

  updateAvailability(data: { days?: string[]; slots?: string[]; isAvailableNow?: boolean }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/availability`, data);
  }

  uploadPortfolioItem(item: { title: string; imageUrl: string; description?: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/portfolio`, item);
  }
}
