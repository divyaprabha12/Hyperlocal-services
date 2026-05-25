import { Component, inject, signal } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar';
import { BookingService } from '../../core/services/booking.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, UpperCasePipe } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-customer-complaints',
  imports: [FormsModule, NgIf, NgFor, UpperCasePipe],
  template: `
    <main class="complaints-page">

          <!-- Header -->
          <div style="margin-bottom:24px;">
            <h1 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin:0 0 4px;">Disputes & Support</h1>
            <p style="font-size:13px;color:var(--text-secondary);margin:0;">Raise complaints, report fraudulent bookings, or ask for operational assistance.</p>
          </div>

          <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:20px;align-items:start;" class="complaints-grid">

            <!-- File Complaint Card -->
            <div class="card" style="display:flex;flex-direction:column;gap:14px;">
              <h2 style="font-size:13px;font-weight:700;color:var(--text-primary);margin:0;border-bottom:1px solid var(--border);padding-bottom:10px;">Raise a New Dispute Ticket</h2>
              
              <div>
                <label class="label">Related Booking</label>
                <select [(ngModel)]="bookingId" class="input" style="font-size:12.5px;">
                  <option value="">Select completed or active booking...</option>
                  <option *ngFor="let b of mockBookings" [value]="b.id">#{{ b.id }} - {{ b.service }} (₹{{ b.amount }})</option>
                </select>
              </div>

              <div>
                <label class="label">Dispute Category</label>
                <select [(ngModel)]="category" class="input" style="font-size:12.5px;">
                  <option value="poor_service">Poor / Incomplete Service Quality</option>
                  <option value="late_arrival">Late Arrival / No Show</option>
                  <option value="pricing_issue">Pricing Discrepancies / Overcharging</option>
                  <option value="fraud">Fraudulent / Dubious Activity</option>
                  <option value="rude_behavior">Rude Behavior / Abusive Conduct</option>
                </select>
              </div>

              <div>
                <label class="label">Brief Explanation</label>
                <textarea [(ngModel)]="details" class="input" rows="4" placeholder="Detail the timeline, pricing dispute, or specific behavior observed..."></textarea>
              </div>

              <!-- Media proof upload mock -->
              <div>
                <label class="label">Supporting Media Proof (Images / Videos)</label>
                <div style="border:1px dashed var(--border);border-radius:10px;padding:20px;text-align:center;background:var(--bg-raised);cursor:pointer;" (click)="uploadProof()">
                  <span style="font-size:24px;display:block;margin-bottom:4px;">📸</span>
                  <span style="font-size:12px;color:var(--text-secondary);font-weight:500;">Attach work snapshots, bills, or video proof</span>
                  <p style="font-size:10.5px;color:var(--text-muted);margin:4px 0 0;">Max 10MB per file. Multi-file selection supported.</p>
                </div>
              </div>

              <div style="display:flex;justify-content:flex-end;border-top:1px solid var(--border);padding-top:12px;">
                <button (click)="submitTicket()" class="btn btn-primary btn-sm">Submit Ticket</button>
              </div>
            </div>

            <!-- Active Tickets Tracking -->
            <div class="card" style="display:flex;flex-direction:column;gap:14px;">
              <h2 style="font-size:13px;font-weight:700;color:var(--text-primary);margin:0;border-bottom:1px solid var(--border);padding-bottom:10px;">My Support Tickets</h2>

              <div *ngIf="tickets().length === 0" style="padding:32px;text-align:center;border:1px dashed var(--border);border-radius:10px;">
                <p style="font-size:12.5px;color:var(--text-secondary);margin:0;">No complaints raised yet.</p>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;">
                <div *ngFor="let t of tickets()" style="border:1px solid var(--border);border-radius:10px;padding:12px;background:var(--bg-raised);display:flex;flex-direction:column;gap:8px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:11.5px;font-weight:600;color:var(--text-primary);">Ticket #{{ t.id }}</span>
                    <span [class]="t.status === 'Open' ? 'badge badge-amber' : 'badge badge-green'">{{ t.status }}</span>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);">
                    <p style="margin:0 0 2px;"><span style="color:var(--text-muted);">Category:</span> {{ t.category.replace('_', ' ') | uppercase }}</p>
                    <p style="margin:0;"><span style="color:var(--text-muted);">Explanation:</span> {{ t.details }}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
  `,
  styles: [`
    .complaints-page {
      height: 100%;
      overflow: auto;
      padding: 18px 20px 20px;
      width: 100%;
      box-sizing: border-box;
    }
    .label { display: block; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
    @media (max-width: 860px) { .complaints-grid { grid-template-columns: 1fr !important; } }
  `]
})
export class CustomerComplaintsPage {
  bookingId = '';
  readonly sidebarService = inject(SidebarService);
  category = 'poor_service';
  details = '';

  mockBookings = [
    { id: 'BKN4802', service: 'Electrician Power Board Replacement', amount: 350 },
    { id: 'BKN3921', service: 'Deep Kitchen Plumbing Repair', amount: 180 }
  ];

  tickets = signal<any[]>([
    { id: 'TCK-8921', category: 'pricing_issue', details: 'Provider demanded ₹200 extra beyond standard bid rate for travel convenience.', status: 'Open' }
  ]);

  uploadProof(): void {
    alert('File selector opened. Attach photos, work receipts, or WhatsApp chats for immediate moderation review.');
  }

  submitTicket(): void {
    if (!this.bookingId || !this.details) {
      alert('Please fill out all the fields before submitting.');
      return;
    }
    this.tickets.update(list => [
      { id: 'TCK-' + Math.floor(1000 + Math.random() * 9000), category: this.category, details: this.details, status: 'Open' },
      ...list
    ]);
    alert('Support ticket created successfully! Platform moderators will review details within 2 hours.');
    this.bookingId = '';
    this.details = '';
  }
}
