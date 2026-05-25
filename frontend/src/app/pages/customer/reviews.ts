import { Component, inject, signal } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-customer-reviews',
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <main style="padding:28px 32px;">

          <!-- Header -->
          <div style="margin-bottom:24px;">
            <h1 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin:0 0 4px;">My Reviews</h1>
            <p style="font-size:13px;color:var(--text-secondary);margin:0;">Leave feedback on completed dispatches and read your past evaluations.</p>
          </div>

          <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:20px;align-items:start;" class="reviews-grid">

            <!-- Submit Review Form -->
            <div class="card" style="display:flex;flex-direction:column;gap:14px;">
              <h2 style="font-size:13px;font-weight:700;color:var(--text-primary);margin:0;border-bottom:1px solid var(--border);padding-bottom:10px;">Review Recent Booking</h2>

              <div>
                <label class="label">Select Service Visit</label>
                <select [(ngModel)]="bookingId" class="input" style="font-size:12.5px;">
                  <option value="">Select past service visit...</option>
                  <option *ngFor="let b of mockBookings" [value]="b.id">#{{ b.id }} - {{ b.service }} (by {{ b.provider }})</option>
                </select>
              </div>

              <!-- Star Rating selector -->
              <div>
                <label class="label">Star Evaluation</label>
                <div style="display:flex;gap:6px;">
                  <button *ngFor="let s of [1,2,3,4,5]" (click)="stars.set(s)"
                          style="font-size:24px;background:none;border:none;cursor:pointer;padding:0;transition:transform 0.1s;"
                          [style.color]="s <= stars() ? '#D98C36' : 'var(--text-muted)'"
                          onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">★</button>
                </div>
              </div>

              <div>
                <label class="label">Review Comments</label>
                <textarea [(ngModel)]="comment" class="input" rows="4" placeholder="How was the service? Mention tool kit details, clean up habits, or professional conduct..."></textarea>
              </div>

              <!-- Photo Attachments -->
              <div>
                <label class="label">Attach Work Photos (Optional)</label>
                <div style="border:1px dashed var(--border);border-radius:10px;padding:16px;text-align:center;background:var(--bg-raised);cursor:pointer;" (click)="uploadPhotos()">
                  <span style="font-size:20px;display:block;margin-bottom:2px;">🖼️</span>
                  <span style="font-size:12px;color:var(--text-secondary);font-weight:500;">Attach work snaps (e.g. fixed pipes, neat wiring)</span>
                </div>
              </div>

              <div style="display:flex;justify-content:flex-end;border-top:1px solid var(--border);padding-top:12px;">
                <button (click)="submitReview()" class="btn btn-primary btn-sm">Post Review</button>
              </div>
            </div>

            <!-- Past Reviews Log -->
            <div class="card" style="display:flex;flex-direction:column;gap:14px;">
              <h2 style="font-size:13px;font-weight:700;color:var(--text-primary);margin:0;border-bottom:1px solid var(--border);padding-bottom:10px;">My Reviews History</h2>

              <div *ngIf="reviews().length === 0" style="padding:32px;text-align:center;border:1px dashed var(--border);border-radius:10px;">
                <p style="font-size:12.5px;color:var(--text-secondary);margin:0;">No reviews written yet.</p>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;">
                <div *ngFor="let r of reviews()" style="border:1px solid var(--border);border-radius:10px;padding:12px;background:var(--bg-raised);display:flex;flex-direction:column;gap:6px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:12px;font-weight:600;color:var(--text-primary);">{{ r.service }}</span>
                    <span style="color:#D98C36;font-size:12px;font-weight:700;">★ {{ r.stars }}</span>
                  </div>
                  <p style="font-size:11px;color:var(--text-muted);margin:0 0 2px;">Provider: {{ r.provider }}</p>
                  <p style="font-size:12.5px;color:var(--text-secondary);margin:0;line-height:1.4;">"{{ r.comment }}"</p>
                </div>
              </div>
            </div>

          </div>

        </main>
  `,
  styles: [`
    .label { display: block; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
    @media (max-width: 860px) { .reviews-grid { grid-template-columns: 1fr !important; } }
  `]
})
export class CustomerReviewsPage {
  bookingId = '';
  readonly sidebarService = inject(SidebarService);
  stars = signal(5);
  comment = '';

  mockBookings = [
    { id: 'BKN4802', service: 'Electrician Board Fix', provider: 'Suresh Electrician' },
    { id: 'BKN3921', service: 'Deep Kitchen Plumbing', provider: 'Arvind Plumber' }
  ];

  reviews = signal<any[]>([
    { id: 'REV-921', service: 'Plumbing Service', provider: 'Arvind Plumber', stars: 5, comment: 'Suresh was absolutely fantastic! Cleaned up the bathroom floor after fixing the drain leak.' }
  ]);

  uploadPhotos(): void {
    alert('Select up to 4 images of the completed work.');
  }

  submitReview(): void {
    if (!this.bookingId || !this.comment) {
      alert('Please select a past booking and write comments before posting.');
      return;
    }
    const b = this.mockBookings.find(k => k.id === this.bookingId);
    this.reviews.update(list => [
      { id: 'REV-' + Math.floor(100+Math.random()*900), service: b?.service, provider: b?.provider, stars: this.stars(), comment: this.comment },
      ...list
    ]);
    alert('Review posted successfully! Your feedback is highly valued.');
    this.bookingId = '';
    this.comment = '';
  }
}
