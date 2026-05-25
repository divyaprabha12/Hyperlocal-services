import { Component, inject, signal, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar';
import { ProviderService } from '../../core/services/provider.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-provider-jobs',
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <main style="padding:28px 32px;">

          <!-- Header -->
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:28px;flex-wrap:wrap;">
            <div>
              <h1 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin:0 0 4px;">Job Pipeline</h1>
              <p style="font-size:13px;color:var(--text-secondary);margin:0;">Manage pending leads and coordinate active customer visits.</p>
            </div>

            <!-- Availability toggle -->
            <div style="display:flex;align-items:center;gap:10px;background:var(--bg-surface);border:1px solid var(--border);border-radius:10px;padding:8px 14px;">
              <span style="font-size:12px;color:var(--text-secondary);">My Availability:</span>
              <button (click)="toggleOnline()"
                [style.background]="isOnline() ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)'"
                [style.color]="isOnline() ? '#34D399' : '#F87171'"
                [style.borderColor]="isOnline() ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'"
                style="border:1px solid;border-radius:8px;padding:4px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.15s;">
                {{ isOnline() ? '● Online' : '● Offline' }}
              </button>
            </div>
          </div>

          <!-- OTP entry panel -->
          <div *ngIf="otpBookingId()" style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.18);border-radius:10px;padding:16px;margin-bottom:20px;">
            <p style="font-size:13px;font-weight:600;color:#FBBF24;margin:0 0 4px;">Enter Customer OTP</p>
            <p style="font-size:12px;color:var(--text-secondary);margin:0 0 10px;">Ask the customer for the 4-digit completion code shown on their tracking screen.</p>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="text" [(ngModel)]="otpInput" maxlength="4" class="input" style="width:100px;font-size:16px;font-weight:700;letter-spacing:0.12em;text-align:center;padding:8px 10px;" placeholder="0000">
              <button (click)="confirmOtp()" class="btn btn-primary btn-sm">Confirm Completion</button>
              <button (click)="otpBookingId.set(null)" class="btn btn-ghost btn-sm">Cancel</button>
            </div>
            <p *ngIf="otpErr()" style="font-size:12px;color:#F87171;margin:8px 0 0;">{{ otpErr() }}</p>
          </div>

          <!-- Tabs -->
          <div style="display:flex;gap:6px;border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:20px;">
            <button (click)="activeTab.set('pending')" 
                    [style.color]="activeTab() === 'pending' ? 'var(--text-primary)' : 'var(--text-muted)'"
                    [style.borderColor]="activeTab() === 'pending' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">Pending Requests ({{ pendingJobs().length }})</button>
            <button (click)="activeTab.set('active')" 
                    [style.color]="activeTab() === 'active' ? 'var(--text-primary)' : 'var(--text-muted)'"
                    [style.borderColor]="activeTab() === 'active' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">Active Pipeline ({{ activeJobs().length }})</button>
            <button (click)="activeTab.set('completed')" 
                    [style.color]="activeTab() === 'completed' ? 'var(--text-primary)' : 'var(--text-muted)'"
                    [style.borderColor]="activeTab() === 'completed' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">Completed ({{ completedJobs().length }})</button>
          </div>

          <!-- Lists based on activeTab -->
          <div>
            <div *ngIf="activeTab() === 'pending'">
              <div *ngIf="pendingJobs().length === 0" style="padding:48px;text-align:center;border:1px dashed var(--border);border-radius:12px;background:var(--bg-surface);">
                <p style="font-size:13px;color:var(--text-muted);margin:0;">No new leads or booking requests at the moment.</p>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;">
                <div *ngFor="let b of pendingJobs()" style="background:var(--bg-surface);border:1px solid var(--border);border-radius:10px;padding:16px;">
                  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">
                    <div style="flex:1;min-width:200px;">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                        <span class="badge badge-amber">New Lead</span>
                        <span style="font-size:11px;color:var(--text-muted);">{{ b.service?.category }}</span>
                      </div>
                      <p style="font-size:14px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">{{ b.service?.name }}</p>
                      <p style="font-size:12px;color:var(--text-secondary);margin:0 4px 0 0;">Customer: {{ b.customer?.name }} · {{ b.timeSlot }}</p>
                      <p style="font-size:11px;color:var(--text-muted);margin:4px 0 0;">📍 Address: {{ b.address?.street }}, {{ b.address?.city || 'Bangalore' }}</p>
                    </div>
                    <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
                      <button (click)="setStatus(b._id,'accepted')" class="btn btn-success btn-sm">Accept & Bid</button>
                      <button (click)="setStatus(b._id,'rejected')" class="btn btn-danger btn-sm">Decline</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="activeTab() === 'active'">
              <div *ngIf="activeJobs().length === 0" style="padding:48px;text-align:center;border:1px dashed var(--border);border-radius:12px;background:var(--bg-surface);">
                <p style="font-size:13px;color:var(--text-muted);margin:0;">No active dispatches or ongoing visits.</p>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;">
                <div *ngFor="let b of activeJobs()" style="background:var(--bg-surface);border:1px solid var(--border);border-radius:10px;padding:16px;">
                  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">
                    <div style="flex:1;min-width:200px;">
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                        <span [class]="statusBadge(b.status)">{{ b.status.replace('_',' ') }}</span>
                        <span style="font-size:11px;color:var(--text-muted);">{{ b.service?.category }}</span>
                      </div>
                      <p style="font-size:14px;font-weight:600;color:var(--text-primary);margin:0 0 2px;">{{ b.service?.name }}</p>
                      <p style="font-size:12px;color:var(--text-secondary);margin:0 4px 0 0;">Customer: {{ b.customer?.name }} · {{ b.timeSlot }}</p>
                      <p style="font-size:11px;color:var(--text-muted);margin:4px 0 0;">📍 Address: {{ b.address?.street }}, {{ b.address?.city || 'Bangalore' }}</p>
                    </div>
                    <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
                      <button *ngIf="b.status === 'accepted'" (click)="setStatus(b._id,'in_progress')" class="btn btn-primary btn-sm">Dispatch & Start Travel</button>
                      <button *ngIf="b.status === 'in_progress'" (click)="openOtp(b._id)" class="btn btn-sm" style="background:rgba(245,158,11,0.1);color:#FBBF24;border:1px solid rgba(245,158,11,0.2);">Confirm Completion (OTP)</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="activeTab() === 'completed'">
              <div *ngIf="completedJobs().length === 0" style="padding:48px;text-align:center;border:1px dashed var(--border);border-radius:12px;background:var(--bg-surface);">
                <p style="font-size:13px;color:var(--text-muted);margin:0;">No completed job history.</p>
              </div>

              <div style="background:var(--bg-surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
                <table style="width:100%;border-collapse:collapse;text-align:left;font-size:13px;">
                  <thead>
                    <tr style="background:var(--bg-raised);border-bottom:1px solid var(--border);">
                      <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Service</th>
                      <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Customer</th>
                      <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Payout</th>
                      <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let b of completedJobs()" class="table-row">
                      <td style="padding:12px 16px;color:var(--text-primary);font-weight:500;">{{ b.service?.name }}</td>
                      <td style="padding:12px 16px;color:var(--text-secondary);">{{ b.customer?.name }}</td>
                      <td style="padding:12px 16px;color:var(--text-primary);font-weight:600;">₹{{ b.totalAmount }}</td>
                      <td style="padding:12px 16px;"><span class="badge badge-green">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
  `,
  styles: [`
    .tab-btn {
      background: none; border: none; font-size: 13px; font-weight: 600; cursor: pointer;
      padding: 6px 12px; border-bottom: 2px solid transparent; transition: all 0.12s;
      font-family: inherit; outline: none;
    }
  `]
})
export class ProviderJobsPage implements OnInit {
  private readonly providerService = inject(ProviderService);
  readonly sidebarService = inject(SidebarService);
  readonly authService = inject(AuthService);

  readonly pendingJobs = signal<any[]>([]);
  readonly activeJobs = signal<any[]>([]);
  readonly completedJobs = signal<any[]>([]);
  readonly activeTab = signal<'pending' | 'active' | 'completed'>('pending');
  readonly isOnline = signal(true);

  readonly otpBookingId = signal<string | null>(null);
  readonly otpErr = signal<string | null>(null);
  otpInput = '';

  ngOnInit(): void { this.load(); }

  load(): void {
    this.providerService.getBookings().subscribe({
      next: (res: any) => {
        if (res.success) {
          const all: any[] = res.data;
          this.pendingJobs.set(all.filter(b => b.status === 'pending'));
          this.activeJobs.set(all.filter(b => b.status === 'accepted' || b.status === 'in_progress'));
          this.completedJobs.set(all.filter(b => b.status === 'completed' || b.status === 'rejected'));
        }
      }
    });
  }

  statusBadge(status: string): string {
    const m: Record<string, string> = {
      pending: 'badge badge-amber', accepted: 'badge badge-blue',
      in_progress: 'badge badge-purple', completed: 'badge badge-green',
      rejected: 'badge badge-red', cancelled: 'badge badge-red'
    };
    return m[status] ?? 'badge badge-neutral';
  }

  toggleOnline(): void {
    const next = !this.isOnline();
    this.providerService.updateAvailability({ isAvailableNow: next }).subscribe({
      next: (res: any) => { if (res.success) this.isOnline.set(next); }
    });
  }

  setStatus(id: string, status: string): void {
    this.providerService.updateBookingStatus(id, status).subscribe({
      next: (res: any) => { if (res.success) this.load(); }
    });
  }

  openOtp(id: string): void {
    this.otpBookingId.set(id);
    this.otpInput = '';
    this.otpErr.set(null);
  }

  confirmOtp(): void {
    if (!this.otpBookingId() || !this.otpInput) return;
    this.otpErr.set(null);
    this.providerService.updateBookingStatus(this.otpBookingId()!, 'completed', this.otpInput).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.otpBookingId.set(null);
          this.load();
        } else {
          this.otpErr.set(res.message || 'Invalid OTP. Please try again.');
        }
      },
      error: () => this.otpErr.set('Invalid OTP. Please verify with customer.')
    });
  }
}
