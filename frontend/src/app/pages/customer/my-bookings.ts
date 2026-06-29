import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DatePipe } from '@angular/common';

interface ReviewModal { bookingId: string; serviceName: string; providerName: string; }
interface ComplaintModal { bookingId: string; serviceName: string; providerName: string; }

@Component({
  selector: 'app-my-bookings',
  imports: [RouterLink, FormsModule, NgIf, NgFor, DatePipe],
  template: `
    <main class="bookings-main">

          <!-- Header -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px;">
            <div>
              <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.03em;margin:0 0 4px;color:var(--text-primary);">My Bookings</h1>
              <p style="font-size:14.5px;color:var(--text-secondary);margin:0;">Track active dispatches and review completed service history.</p>
            </div>
            <a routerLink="/customer/search" class="btn btn-primary btn-sm">+ Book New Service</a>
          </div>

          <!-- Tabs -->
          <div class="tabs-bar">
            <button (click)="activeTab.set('active')"
                    [style.color]="activeTab() === 'active' ? 'var(--accent)' : 'var(--text-muted)'"
                    [style.borderBottomColor]="activeTab() === 'active' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">
              Active Requests ({{ activeBookings().length }})
            </button>
            <button (click)="activeTab.set('completed')"
                    [style.color]="activeTab() === 'completed' ? 'var(--accent)' : 'var(--text-muted)'"
                    [style.borderBottomColor]="activeTab() === 'completed' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">
              Completed ({{ completedBookings().length }})
            </button>
            <button (click)="activeTab.set('past')"
                    [style.color]="activeTab() === 'past' ? 'var(--accent)' : 'var(--text-muted)'"
                    [style.borderBottomColor]="activeTab() === 'past' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">
              Cancelled / Rejected ({{ pastBookings().length }})
            </button>
          </div>

          <!-- ── ACTIVE TAB ── -->
          <div *ngIf="activeTab() === 'active'">
            <div *ngIf="activeBookings().length === 0" style="padding:64px 24px;text-align:center;border:1px dashed var(--border);border-radius:16px;background:var(--bg-surface);">
              <p style="font-size:15px;color:var(--text-secondary);margin:0 0 16px;">No active service requests right now.</p>
              <a routerLink="/customer/search" class="btn btn-primary btn-sm">Find a Provider</a>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(340px,1fr));gap:16px;">
              <div *ngFor="let b of activeBookings()" class="card" style="display:flex;flex-direction:column;gap:14px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                  <div>
                    <span [class]="statusBadge(b.status)" style="margin-bottom:8px;display:inline-block;">{{ b.status.replace('_',' ') }}</span>
                    <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin:0;">{{ b.service?.name || 'Service Request' }}</h3>
                  </div>
                  <span style="font-size:16px;font-weight:800;color:var(--text-primary);">₹{{ b.totalAmount }}</span>
                </div>
                <div style="border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:10px 0;display:flex;flex-direction:column;gap:5px;font-size:13px;color:var(--text-secondary);">
                  <div style="display:flex;justify-content:space-between;"><span>Date:</span><span style="color:var(--text-primary);font-weight:600;">{{ b.bookingDate | date:'d MMM yyyy' }}</span></div>
                  <div style="display:flex;justify-content:space-between;"><span>Time Slot:</span><span style="color:var(--text-primary);font-weight:600;">{{ b.timeSlot }}</span></div>
                  <div style="display:flex;justify-content:space-between;"><span>Provider:</span><span style="color:var(--text-primary);font-weight:600;">{{ b.provider?.businessName || 'Suresh Electrician' }}</span></div>
                </div>
                <div style="display:flex;gap:8px;">
                  <a [routerLink]="['/customer/bookings', b._id]" class="btn btn-primary btn-sm" style="flex:1;">Track & Chat</a>
                  <button *ngIf="b.status === 'pending'" (click)="cancelBooking(b._id)" class="btn btn-danger btn-sm">Cancel</button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── COMPLETED TAB ── -->
          <div *ngIf="activeTab() === 'completed'">
            <div *ngIf="completedBookings().length === 0" style="padding:64px 24px;text-align:center;border:1px dashed var(--border);border-radius:16px;background:var(--bg-surface);">
              <p style="font-size:15px;color:var(--text-secondary);margin:0;">No completed bookings yet.</p>
            </div>

            <div style="display:flex;flex-direction:column;gap:16px;">
              <div *ngFor="let b of completedBookings()" class="card completed-row">
                <!-- Service icon & name -->
                <div style="width:48px;height:48px;border-radius:12px;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">
                  {{ catEmoji(b.service?.category) }}
                </div>
                <div style="flex:1;min-width:180px;">
                  <p style="font-size:15px;font-weight:700;color:var(--text-primary);margin:0 0 3px;">{{ b.service?.name || 'Home Service' }}</p>
                  <p style="font-size:13px;color:var(--text-muted);margin:0;">{{ b.bookingDate | date:'d MMM yyyy' }} · {{ b.provider?.businessName || 'Service Provider' }}</p>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                  <span style="font-size:16px;font-weight:800;color:var(--text-primary);">₹{{ b.totalAmount }}</span>
                  <span class="badge badge-green">Completed</span>
                </div>

                <!-- Action Buttons -->
                <div class="completed-actions">
                  <!-- Review Button or submitted state -->
                  <button *ngIf="!hasReviewed(b._id)"
                          (click)="openReviewModal(b)"
                          class="btn btn-sm"
                          style="background:var(--accent-dim);color:var(--accent);border:1px solid #D5E8CE;font-weight:700;">
                    ★ Write Review
                  </button>
                  <span *ngIf="hasReviewed(b._id)" class="badge badge-green" style="padding:6px 12px;font-size:12px;">
                    ✓ Review Submitted
                  </span>

                  <!-- Complaint Button or raised state -->
                  <button *ngIf="!hasComplained(b._id)"
                          (click)="openComplaintModal(b)"
                          class="btn btn-sm"
                          style="background:#FFF5F4;color:var(--danger);border:1px solid #FCDFD9;font-weight:700;">
                    ⚠ Raise Complaint
                  </button>
                  <span *ngIf="hasComplained(b._id)" class="badge badge-red" style="padding:6px 12px;font-size:12px;">
                    ✓ Complaint Raised
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── PAST (CANCELLED) TAB ── -->
          <div *ngIf="activeTab() === 'past'">
            <div *ngIf="pastBookings().length === 0" style="padding:64px 24px;text-align:center;border:1px dashed var(--border);border-radius:16px;background:var(--bg-surface);">
              <p style="font-size:15px;color:var(--text-secondary);margin:0;">No cancelled or rejected bookings.</p>
            </div>
            <div class="card" style="padding:0;overflow:hidden;" *ngIf="pastBookings().length > 0">
              <table style="width:100%;border-collapse:collapse;text-align:left;font-size:13.5px;">
                <thead>
                  <tr style="background:var(--bg-raised);border-bottom:1px solid var(--border);">
                    <th style="padding:12px 16px;color:var(--text-muted);font-weight:700;font-size:11px;text-transform:uppercase;">Service</th>
                    <th style="padding:12px 16px;color:var(--text-muted);font-weight:700;font-size:11px;text-transform:uppercase;">Date</th>
                    <th style="padding:12px 16px;color:var(--text-muted);font-weight:700;font-size:11px;text-transform:uppercase;">Provider</th>
                    <th style="padding:12px 16px;color:var(--text-muted);font-weight:700;font-size:11px;text-transform:uppercase;">Amount</th>
                    <th style="padding:12px 16px;color:var(--text-muted);font-weight:700;font-size:11px;text-transform:uppercase;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let b of pastBookings()" class="table-row">
                    <td style="padding:14px 16px;color:var(--text-primary);font-weight:600;">{{ b.service?.name || 'Home Service' }}</td>
                    <td style="padding:14px 16px;color:var(--text-secondary);">{{ b.bookingDate | date:'d MMM yyyy' }}</td>
                    <td style="padding:14px 16px;color:var(--text-secondary);">{{ b.provider?.businessName || 'Service Provider' }}</td>
                    <td style="padding:14px 16px;color:var(--text-primary);font-weight:700;">₹{{ b.totalAmount }}</td>
                    <td style="padding:14px 16px;"><span [class]="statusBadge(b.status)">{{ b.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>

    <!-- ═══════════════ REVIEW MODAL ═══════════════ -->
    <div *ngIf="reviewModal()" style="position:fixed;inset:0;background:rgba(42,46,43,0.35);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;" (click)="reviewModal.set(null)">
      <div class="card" style="width:100%;max-width:500px;background:#FFFFFF;box-shadow:0 20px 60px rgba(0,0,0,0.12);display:flex;flex-direction:column;gap:16px;" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--border);padding-bottom:12px;">
          <div>
            <h2 style="font-size:16px;font-weight:800;color:var(--text-primary);margin:0 0 3px;letter-spacing:-0.02em;">Write a Review</h2>
            <p style="font-size:13px;color:var(--text-muted);margin:0;">{{ reviewModal()?.serviceName }}</p>
          </div>
          <button (click)="reviewModal.set(null)" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Star Rating -->
        <div>
          <label class="label">Star Rating</label>
          <div style="display:flex;gap:8px;margin-top:6px;">
            <button *ngFor="let star of [1,2,3,4,5]"
                    (click)="reviewStars.set(star)"
                    style="background:none;border:none;cursor:pointer;font-size:28px;padding:2px;transition:transform 0.1s;"
                    [style.transform]="reviewStars() >= star ? 'scale(1.1)' : 'scale(1)'">
              <span [style.color]="reviewStars() >= star ? '#F5A623' : '#D5CEBF'">★</span>
            </button>
          </div>
          <p *ngIf="reviewStars() > 0" style="font-size:12px;color:var(--text-muted);margin:4px 0 0;">
            {{ ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewStars()] }}
          </p>
        </div>

        <!-- Written feedback -->
        <div>
          <label class="label">Written Feedback</label>
          <textarea [(ngModel)]="reviewText" class="input" rows="4"
                    placeholder="Describe the quality of the service, technician's professionalism, punctuality, and overall experience..."></textarea>
        </div>

        <!-- Image upload -->
        <div>
          <label class="label">Optional Photo (Work done)</label>
          <div (click)="triggerUpload('review-img')" style="border:1px dashed var(--border);border-radius:10px;padding:14px;text-align:center;cursor:pointer;background:var(--bg-raised);font-size:13px;color:var(--text-muted);">
            📸 Click to attach photo of completed work
          </div>
        </div>

        <!-- Actions -->
        <div style="display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border);padding-top:12px;">
          <button (click)="reviewModal.set(null)" class="btn btn-ghost btn-sm">Cancel</button>
          <button (click)="submitReview()" class="btn btn-primary btn-sm" [disabled]="reviewStars() === 0">
            Submit Review
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════ COMPLAINT MODAL ═══════════════ -->
    <div *ngIf="complaintModal()" style="position:fixed;inset:0;background:rgba(42,46,43,0.35);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;" (click)="complaintModal.set(null)">
      <div class="card" style="width:100%;max-width:540px;background:#FFFFFF;box-shadow:0 20px 60px rgba(0,0,0,0.12);display:flex;flex-direction:column;gap:16px;max-height:90vh;overflow-y:auto;" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--border);padding-bottom:12px;position:sticky;top:0;background:#FFFFFF;z-index:1;padding-top:4px;">
          <div>
            <h2 style="font-size:16px;font-weight:800;color:var(--text-primary);margin:0 0 3px;letter-spacing:-0.02em;">Raise a Complaint</h2>
            <p style="font-size:13px;color:var(--text-muted);margin:0;">{{ complaintModal()?.serviceName }} · Booking Ref: {{ complaintModal()?.bookingId?.slice(-6)?.toUpperCase() }}</p>
          </div>
          <button (click)="complaintModal.set(null)" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Category -->
        <div>
          <label class="label">Complaint Category</label>
          <select [(ngModel)]="complaintCategory" class="input">
            <option value="">Select category...</option>
            <option value="poor_service">Poor Service Quality</option>
            <option value="fraud">Fraud / Overcharging</option>
            <option value="late_arrival">Late Arrival</option>
            <option value="incomplete_work">Incomplete Work</option>
            <option value="overpricing">Overpricing / Cash Demands</option>
            <option value="rude_behavior">Rude Behavior</option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label class="label">Detailed Description</label>
          <textarea [(ngModel)]="complaintText" class="input" rows="4"
                    placeholder="Provide a detailed description of the issue. Include what happened, when, and how it affected your experience..."></textarea>
        </div>

        <!-- Booking Reference (read-only) -->
        <div>
          <label class="label">Booking Reference ID</label>
          <input type="text" [value]="complaintModal()?.bookingId" class="input" readonly style="background:var(--bg-overlay);color:var(--text-muted);cursor:not-allowed;font-family:monospace;font-size:12.5px;">
        </div>

        <!-- Upload area -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div (click)="triggerUpload('complaint-img')" style="border:1px dashed var(--border);border-radius:10px;padding:14px;text-align:center;cursor:pointer;background:var(--bg-raised);font-size:13px;color:var(--text-muted);">
            📸 Attach Photos
          </div>
          <div (click)="triggerUpload('complaint-vid')" style="border:1px dashed var(--border);border-radius:10px;padding:14px;text-align:center;cursor:pointer;background:var(--bg-raised);font-size:13px;color:var(--text-muted);">
            🎥 Attach Video Clip
          </div>
        </div>

        <div style="background:#FFF5F4;border:1px solid #FCDFD9;border-radius:10px;padding:12px;font-size:12.5px;color:var(--danger);">
          ⚠️ Your complaint will be sent directly to the admin moderation team. Complaints are investigated within 48 hours. You can only raise one complaint per booking.
        </div>

        <!-- Actions -->
        <div style="display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border);padding-top:12px;">
          <button (click)="complaintModal.set(null)" class="btn btn-ghost btn-sm">Cancel</button>
          <button (click)="submitComplaint()" class="btn btn-sm" style="background:var(--danger);color:#FFFFFF;" [disabled]="!complaintCategory || !complaintText">
            Submit Complaint
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bookings-main {
      padding: 28px 24px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .tabs-bar {
      display: flex;
      gap: 2px;
      border-bottom: 2px solid var(--border);
      margin-bottom: 24px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .tabs-bar::-webkit-scrollbar { display: none; }
    .tab-btn {
      background: none; border: none; border-bottom: 2px solid transparent;
      font-size: 13.5px; font-weight: 600; cursor: pointer;
      padding: 10px 14px; font-family: inherit; outline: none;
      transition: all 0.15s; white-space: nowrap; flex-shrink: 0;
    }
    .tab-btn:hover { color: var(--text-primary) !important; }
    .completed-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .completed-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    @media (max-width: 768px) {
      .bookings-main { padding: 16px; }
      .tab-btn { font-size: 12.5px; padding: 8px 10px; }
      .completed-row { flex-direction: column; align-items: flex-start; gap: 10px; }
      .completed-actions { width: 100%; justify-content: flex-end; flex-wrap: wrap; }
    }
  `]
})
export class MyBookingsPage implements OnInit {
  private readonly bookingService = inject(BookingService);
  readonly sidebarService = inject(SidebarService);

  readonly activeBookings = signal<any[]>([]);
  readonly completedBookings = signal<any[]>([]);
  readonly pastBookings = signal<any[]>([]);
  readonly activeTab = signal<'active' | 'completed' | 'past'>('active');

  // Review modal state
  readonly reviewModal = signal<ReviewModal | null>(null);
  readonly reviewStars = signal(0);
  reviewText = '';

  // Complaint modal state
  readonly complaintModal = signal<ComplaintModal | null>(null);
  complaintCategory = '';
  complaintText = '';

  // LocalStorage persistence for one-time submissions
  private reviewedSet = new Set<string>(JSON.parse(localStorage.getItem('reviewed_bookings') || '[]'));
  private complainedSet = new Set<string>(JSON.parse(localStorage.getItem('complained_bookings') || '[]'));

  ngOnInit(): void { this.load(); }

  load(): void {
    this.bookingService.getBookings().subscribe({
      next: (res: any) => {
        if (!res.success) return;
        const all: any[] = res.data;
        const activeStatuses = ['pending', 'accepted', 'in_progress'];
        this.activeBookings.set(all.filter(b => activeStatuses.includes(b.status)));
        this.completedBookings.set(all.filter(b => b.status === 'completed'));
        this.pastBookings.set(all.filter(b => ['cancelled', 'rejected'].includes(b.status)));
      }
    });
  }

  hasReviewed(bookingId: string): boolean { return this.reviewedSet.has(bookingId); }
  hasComplained(bookingId: string): boolean { return this.complainedSet.has(bookingId); }

  openReviewModal(b: any): void {
    this.reviewStars.set(0);
    this.reviewText = '';
    this.reviewModal.set({
      bookingId: b._id,
      serviceName: b.service?.name || 'Home Service',
      providerName: b.provider?.businessName || 'Service Provider'
    });
  }

  openComplaintModal(b: any): void {
    this.complaintCategory = '';
    this.complaintText = '';
    this.complaintModal.set({
      bookingId: b._id,
      serviceName: b.service?.name || 'Home Service',
      providerName: b.provider?.businessName || 'Service Provider'
    });
  }

  submitReview(): void {
    const modal = this.reviewModal();
    if (!modal || this.reviewStars() === 0) return;
    // Mark as reviewed
    this.reviewedSet.add(modal.bookingId);
    localStorage.setItem('reviewed_bookings', JSON.stringify([...this.reviewedSet]));
    this.reviewModal.set(null);
    alert(`Thank you! Your ${this.reviewStars()}-star review has been submitted. It will appear on the provider's profile after verification.`);
  }

  submitComplaint(): void {
    const modal = this.complaintModal();
    if (!modal || !this.complaintCategory || !this.complaintText) return;
    // Mark as complained
    this.complainedSet.add(modal.bookingId);
    localStorage.setItem('complained_bookings', JSON.stringify([...this.complainedSet]));
    this.complaintModal.set(null);
    alert('Complaint submitted successfully. Our admin moderation team will review and respond within 48 business hours. A confirmation email has been sent.');
  }

  triggerUpload(type: string): void {
    alert(`File selector triggered for ${type} attachment.`);
  }

  cancelBooking(id: string): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    this.bookingService.cancelBooking(id).subscribe({ next: () => this.load() });
  }

  statusBadge(status: string): string {
    const m: Record<string, string> = {
      pending: 'badge badge-amber', accepted: 'badge badge-blue',
      in_progress: 'badge badge-purple', completed: 'badge badge-green',
      cancelled: 'badge badge-red', rejected: 'badge badge-red'
    };
    return m[status] ?? 'badge badge-neutral';
  }

  catEmoji(cat: string): string {
    const m: Record<string, string> = { electrician: '⚡', plumber: '🔧', cleaner: '🧹', carpenter: '🪚', painter: '🎨', ac_technician: '❄️', home_repair: '🏠' };
    return m[cat] ?? '🔩';
  }
}
