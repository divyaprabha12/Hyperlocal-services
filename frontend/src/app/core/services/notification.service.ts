import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://hyperlocal-services.onrender.com/api';

  readonly notifications = signal<any[]>([]);
  readonly unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  loadNotifications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/notifications`).pipe(
      tap(res => {
        if (res.success) {
          this.notifications.set(res.data);
        }
      })
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/notifications/${id}/read`, {}).pipe(
      tap(() => {
        this.notifications.update(notifs => 
          notifs.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
      })
    );
  }
}
