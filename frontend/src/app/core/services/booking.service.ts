import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/customer';

  // Search providers with filters
  searchProviders(params: {
    query?: string;
    category?: string;
    minRating?: number;
    maxPrice?: number;
    lat?: number;
    lng?: number;
  }): Observable<any> {
    let httpParams = new HttpParams();
    if (params.query) httpParams = httpParams.set('query', params.query);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.minRating) httpParams = httpParams.set('minRating', params.minRating.toString());
    if (params.maxPrice) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    if (params.lat) httpParams = httpParams.set('lat', params.lat.toString());
    if (params.lng) httpParams = httpParams.set('lng', params.lng.toString());

    return this.http.get<any>(`${this.apiUrl}/providers/search`, { params: httpParams });
  }

  // Get nearby providers
  getNearbyProviders(lat: number, lng: number, radius: number = 10, category?: string): Observable<any> {
    let httpParams = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString())
      .set('radiusInKm', radius.toString());
    
    if (category) {
      httpParams = httpParams.set('category', category);
    }
    return this.http.get<any>(`${this.apiUrl}/providers/nearby`, { params: httpParams });
  }

  // Create booking
  createBooking(bookingData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bookings`, bookingData);
  }

  // Get customer booking history
  getBookings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings`);
  }

  // Get single booking details
  getBookingDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings/${id}`);
  }

  // Cancel booking
  cancelBooking(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bookings/${id}/cancel`, {});
  }

  // Complete simulated payment
  simulatePayment(bookingId: string, gateway: string = 'stripe_simulated'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payments/create`, { bookingId, gateway });
  }

  // Submit review
  submitReview(reviewData: { bookingId: string; rating: number; comment: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reviews`, reviewData);
  }

  // Get provider details (for profiles page)
  getProviderProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/providers/${id}`);
  }

  // Toggle favorite provider
  toggleFavorite(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/providers/${id}/favorite`, {});
  }
}
