import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar';
import { BookingService } from '../../core/services/booking.service';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-customer-booking-tracking',
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <main style="padding:32px 28px;max-width:1100px;">

          <!-- Loading -->
          <div *ngIf="loading()" style="padding:60px;text-align:center;">
            <div class="spinner" style="margin:0 auto 12px;"></div>
            <p style="font-size:13px;color:var(--text-muted);">Loading booking…</p>
          </div>

          <ng-container *ngIf="!loading() && booking()">
            <!-- Page header -->
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:24px;flex-wrap:wrap;">
              <div>
                <span style="font-size:11px;color:var(--text-muted);font-weight:500;">Booking #{{ booking()._id.slice(-8).toUpperCase() }}</span>
                <h1 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin:4px 0 0;">{{ booking().service?.name || 'Service Booking' }}</h1>
              </div>
              <span [class]="statusBadge(booking().status)" style="font-size:12px;padding:4px 12px;">{{ booking().status.replace('_',' ') }}</span>
            </div>

            <div style="display:grid;grid-template-columns:1fr 320px;gap:20px;align-items:start;" class="track-grid">

              <!-- Left column -->
              <div style="display:flex;flex-direction:column;gap:16px;">

                <!-- Progress tracker -->
                <div class="card">
                  <h2 class="section-title">Booking Progress</h2>
                  <div style="display:flex;align-items:flex-start;gap:0;position:relative;padding:4px 0;">
                    <ng-container *ngFor="let step of steps; let i=index; let last=last">
                      <div style="flex:1;display:flex;flex-direction:column;align-items:center;position:relative;z-index:1;">
                        <div [style.background]="stepDone(i) ? 'var(--accent)' : 'var(--bg-overlay)'"
                             [style.border]="stepDone(i) ? 'none' : '1px solid var(--border)'"
                             style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:8px;transition:background 0.3s;">
                          <svg *ngIf="stepDone(i)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          <span *ngIf="!stepDone(i)" style="font-size:11px;font-weight:600;color:var(--text-muted);">{{ i+1 }}</span>
                        </div>
                        <span style="font-size:11px;color:var(--text-secondary);text-align:center;font-weight:500;">{{ step }}</span>
                      </div>
                      <div *ngIf="!last" [style.background]="stepDone(i) ? 'var(--accent)' : 'var(--border)'" style="flex:1;height:1px;margin-top:14px;transition:background 0.3s;max-width:60px;align-self:flex-start;"></div>
                    </ng-container>
                  </div>
                </div>

                <!-- GPS Map canvas -->
                <div class="card" *ngIf="booking().status==='accepted' || booking().status==='in_progress'">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                    <h2 class="section-title" style="margin:0;">Live Tracking</h2>
                    <div style="display:flex;align-items:center;gap:5px;">
                      <span style="width:6px;height:6px;background:var(--success);border-radius:50%;display:inline-block;animation:ping 1s infinite;"></span>
                      <span style="font-size:11px;color:var(--success);font-weight:500;">Connected</span>
                    </div>
                  </div>
                  <div style="background:var(--bg-raised);border:1px solid var(--border);border-radius:10px;overflow:hidden;position:relative;">
                    <canvas #map style="width:100%;height:260px;display:block;"></canvas>
                    <div style="position:absolute;bottom:10px;left:10px;background:rgba(11,16,32,0.9);border:1px solid var(--border);border-radius:8px;padding:8px 12px;">
                      <p style="font-size:11px;color:var(--text-secondary);margin:0;">{{ trackMsg() }}</p>
                    </div>
                  </div>
                </div>

                <!-- OTP panel -->
                <div *ngIf="booking().status==='accepted' || booking().status==='in_progress'"
                     style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.18);border-radius:12px;padding:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
                  <div>
                    <p style="font-size:13px;font-weight:600;color:#FBBF24;margin:0 0 4px;">🔐 Arrival OTP</p>
                    <p style="font-size:12px;color:var(--text-secondary);margin:0;">Share this with the provider when they arrive at your door.</p>
                  </div>
                  <div style="background:var(--bg-base);border:1px solid var(--border);border-radius:10px;padding:12px 20px;text-align:center;flex-shrink:0;">
                    <div style="font-size:10px;color:var(--text-muted);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px;">OTP</div>
                    <div style="font-size:26px;font-weight:700;color:var(--text-primary);letter-spacing:0.12em;">{{ booking().otp || '5829' }}</div>
                  </div>
                </div>

                <!-- Payment -->
                <div *ngIf="booking().status==='completed' && !booking().payment?.isPaid"
                     style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.18);border-radius:12px;padding:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
                  <div>
                    <p style="font-size:13px;font-weight:600;color:#34D399;margin:0 0 4px;">Payment Due</p>
                    <p style="font-size:12px;color:var(--text-secondary);margin:0;">Job completed. Release payment of <strong>₹{{ booking().totalAmount }}</strong>.</p>
                  </div>
                  <button (click)="pay()" class="btn btn-success" style="flex-shrink:0;">Pay ₹{{ booking().totalAmount }}</button>
                </div>

                <!-- Review -->
                <div class="card" *ngIf="booking().status==='completed' && booking().payment?.isPaid">
                  <h2 class="section-title">Rate this Service</h2>
                  <div *ngIf="!reviewDone()">
                    <div style="display:flex;gap:6px;margin-bottom:12px;">
                      <button *ngFor="let s of [1,2,3,4,5]" (click)="rating.set(s)"
                              style="font-size:22px;background:none;border:none;cursor:pointer;transition:transform 0.1s;"
                              [style.color]="s<=rating() ? '#FBBF24' : 'var(--text-muted)'"
                              onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">★</button>
                    </div>
                    <textarea [(ngModel)]="comment" class="input" style="margin-bottom:10px;" placeholder="Describe your experience…" rows="3"></textarea>
                    <button (click)="submitReview()" class="btn btn-primary btn-sm">Submit Review</button>
                  </div>
                  <div *ngIf="reviewDone()" style="display:flex;align-items:center;gap:8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span style="font-size:13px;color:var(--text-secondary);">Review submitted — thank you!</span>
                  </div>
                </div>

              </div>

              <!-- Chat panel -->
              <div class="card" style="display:flex;flex-direction:column;height:480px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border);">
                  <h2 class="section-title" style="margin:0;">Job Chat</h2>
                  <span style="font-size:11px;color:var(--text-muted);">{{ booking().provider?.businessName || 'Provider' }}</span>
                </div>

                <!-- Messages -->
                <div #chatEl style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding-right:2px;">
                  <div *ngFor="let msg of chatService.activeMessages()"
                       style="display:flex;"
                       [style.justifyContent]="msg.senderId===authService.currentUser()?._id ? 'flex-end' : 'flex-start'">
                    <div style="max-width:80%;padding:8px 12px;border-radius:10px;font-size:13px;line-height:1.5;"
                         [style.background]="msg.senderId===authService.currentUser()?._id ? 'var(--accent)' : 'var(--bg-overlay)'"
                         [style.color]="msg.senderId===authService.currentUser()?._id ? '#fff' : 'var(--text-primary)'"
                         [style.borderBottomRightRadius]="msg.senderId===authService.currentUser()?._id ? '2px' : '10px'"
                         [style.borderBottomLeftRadius]="msg.senderId===authService.currentUser()?._id ? '10px' : '2px'">
                      {{ msg.message }}
                    </div>
                  </div>
                </div>

                <!-- Input -->
                <form (ngSubmit)="send()" style="display:flex;gap:6px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
                  <input type="text" [(ngModel)]="msgText" name="msg" placeholder="Type a message…" class="input" style="font-size:12px;padding:8px 10px;">
                  <button type="submit" class="btn btn-primary btn-sm" style="flex-shrink:0;">Send</button>
                </form>
              </div>

            </div>
          </ng-container>
        </main>
  `,
  styles: [`
    @keyframes ping { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @media (max-width: 860px) { .track-grid { grid-template-columns: 1fr !important; } }
  `]
})
export class CustomerBookingTrackingPage implements OnInit, OnDestroy, AfterViewChecked {
  private readonly bookingService = inject(BookingService);
  readonly sidebarService = inject(SidebarService);
  readonly chatService = inject(ChatService);
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly booking = signal<any>(null);
  readonly loading = signal(true);
  readonly trackMsg = signal('Waiting for provider to dispatch…');
  readonly rating = signal(5);
  readonly reviewDone = signal(false);

  msgText = ''; comment = '';

  readonly steps = ['Requested', 'Assigned', 'En Route', 'Complete'];

  @ViewChild('chatEl') private chatEl!: ElementRef;
  @ViewChild('map') private mapEl!: ElementRef;

  private pollTimer: any;
  private animTimer: any;
  private provX = 40; private provY = 220;
  private custX = 0; private custY = 0;
  private mapW = 0; private mapH = 0;
  private animPoints: {x:number,y:number}[] = [];
  private animIdx = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadBooking(id);
    // FIX: use joinBookingRoom (correct method name)
    this.chatService.joinBookingRoom(id);

    this.pollTimer = setInterval(() => this.loadBooking(id, false), 7000);
  }

  ngAfterViewChecked(): void {
    // Auto-scroll chat
    if (this.chatEl) {
      try { this.chatEl.nativeElement.scrollTop = this.chatEl.nativeElement.scrollHeight; } catch {}
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.pollTimer);
    clearInterval(this.animTimer);
    this.chatService.disconnectSocket();
  }

  loadBooking(id: string, setLoading = true): void {
    if (setLoading) this.loading.set(true);
    this.bookingService.getBookingDetails(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.booking.set(res.data);
          if (setLoading) {
            this.loading.set(false);
            setTimeout(() => this.initMap(), 100);
          }
        } else if (setLoading) {
          this.loading.set(false);
        }
      },
      error: () => { if (setLoading) this.loading.set(false); }
    });
  }

  stepDone(i: number): boolean {
    const status = this.booking()?.status;
    const order: Record<string, number> = { pending: 0, accepted: 1, in_progress: 2, completed: 3 };
    return (order[status] ?? -1) >= i;
  }

  statusBadge(status: string): string {
    const m: Record<string, string> = {
      pending: 'badge badge-amber', accepted: 'badge badge-blue',
      in_progress: 'badge badge-purple', completed: 'badge badge-green', cancelled: 'badge badge-red',
    };
    return m[status] ?? 'badge badge-neutral';
  }

  // FIX: correct method signature — sendMessage(bookingId, senderId, recipientId, message)
  send(): void {
    if (!this.msgText.trim() || !this.booking()) return;
    const b = this.booking();
    const me = this.authService.currentUser()?._id ?? '';
    const recipient = b.providerId ?? b.provider?._id ?? '';
    this.chatService.sendMessage(b._id, me, recipient, this.msgText.trim());
    this.msgText = '';
  }

  // FIX: use simulatePayment (correct method name)
  pay(): void {
    this.bookingService.simulatePayment(this.booking()._id).subscribe({
      next: (res: any) => { if (res.success) this.loadBooking(this.booking()._id, false); }
    });
  }

  submitReview(): void {
    this.bookingService.submitReview({
      bookingId: this.booking()._id,
      rating: this.rating(),
      comment: this.comment
    }).subscribe({
      next: (res: any) => { if (res.success) this.reviewDone.set(true); }
    });
  }

  private initMap(): void {
    if (!this.mapEl) return;
    const canvas: HTMLCanvasElement = this.mapEl.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.mapW = canvas.width;
    this.mapH = canvas.height;
    this.custX = this.mapW - 50;
    this.custY = 50;
    this.provX = 50;
    this.provY = this.mapH - 50;
    this.drawMap(this.provX, this.provY);

    if (this.booking()?.status === 'in_progress') this.startAnimation();
    else this.trackMsg.set('Provider accepted — dispatching soon.');
  }

  private drawMap(px: number, py: number): void {
    const canvas: HTMLCanvasElement = this.mapEl?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Road path
    const midX = 50 + (this.custX - 50) / 2;
    ctx.strokeStyle = '#1B2238';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(50, this.provY);
    ctx.lineTo(midX, this.provY);
    ctx.lineTo(midX, this.custY);
    ctx.lineTo(this.custX, this.custY);
    ctx.stroke();

    // Route dashes
    ctx.strokeStyle = 'rgba(59,130,246,0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(50, this.provY);
    ctx.lineTo(midX, this.provY);
    ctx.lineTo(midX, this.custY);
    ctx.lineTo(this.custX, this.custY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Customer pin
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath(); ctx.arc(this.custX, this.custY, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HOME', this.custX, this.custY - 14);

    // Provider dot
    ctx.fillStyle = '#10B981';
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('PRO', px, py - 16);
  }

  private startAnimation(): void {
    clearInterval(this.animTimer);
    const midX = 50 + (this.custX - 50) / 2;
    this.animPoints = [];
    for (let x = 50; x <= midX; x += 3) this.animPoints.push({ x, y: this.provY });
    for (let y = this.provY; y >= this.custY; y -= 3) this.animPoints.push({ x: midX, y });
    for (let x = midX; x <= this.custX; x += 3) this.animPoints.push({ x, y: this.custY });
    this.animIdx = 0;

    this.animTimer = setInterval(() => {
      if (this.animIdx >= this.animPoints.length) {
        clearInterval(this.animTimer);
        this.trackMsg.set('Arrived — share OTP to start the job.');
        return;
      }
      const p = this.animPoints[this.animIdx++];
      this.drawMap(p.x, p.y);
      const rem = Math.round(((this.animPoints.length - this.animIdx) / this.animPoints.length) * 100);
      this.trackMsg.set(`En route — ~${Math.ceil(rem / 15) + 1} min away`);
    }, 180);
  }
}
