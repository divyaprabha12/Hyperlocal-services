import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://hyperlocal-services.onrender.com/api';
  private socket!: Socket;

  // Active chat and tracking signals
  readonly activeMessages = signal<any[]>([]);
  readonly activeProviderLocation = signal<{ lat: number; lng: number } | null>(null);

  constructor() {
    this.initSocket();
  }

  private initSocket(): void {
    this.socket = io('https://hyperlocal-services.onrender.com', {
      autoConnect: false
    });

    this.socket.on('connect', () => {
      console.log('Socket.io connection established.');
    });

    this.socket.on('receive_chat_message', (msg: any) => {
      this.activeMessages.update(msgs => [...msgs, msg]);
    });

    this.socket.on('provider_location_changed', (loc: { lat: number; lng: number }) => {
      this.activeProviderLocation.set(loc);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.io connection closed.');
    });
  }

  connectSocket(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnectSocket(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  joinBookingRoom(bookingId: string): void {
    this.connectSocket();
    this.socket.emit('join_booking_room', { bookingId });
    this.activeMessages.set([]); // Clear active messages before loading history
    
    // Load historical logs
    this.loadHistory(bookingId).subscribe(res => {
      if (res.success) {
        this.activeMessages.set(res.data);
      }
    });
  }

  sendMessage(bookingId: string, senderId: string, recipientId: string, message: string): void {
    if (this.socket.connected) {
      this.socket.emit('send_chat_message', { bookingId, senderId, recipientId, message });
    } else {
      // HTTP Fallback
      this.http.post<any>(`${this.apiUrl}/chat`, { bookingId, recipientId, message }).subscribe(res => {
        if (res.success) {
          this.activeMessages.update(msgs => [...msgs, res.data]);
        }
      });
    }
  }

  updateProviderLocation(bookingId: string, lat: number, lng: number): void {
    this.socket.emit('update_provider_location', { bookingId, lat, lng });
  }

  private loadHistory(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chat/${bookingId}`);
  }
}
