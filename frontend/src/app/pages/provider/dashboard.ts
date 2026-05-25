import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar';
import { HeaderComponent } from '../../shared/header';
import { ProviderService } from '../../core/services/provider.service';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-provider-dashboard',
  imports: [RouterLink, NgIf, NgFor],
  template: `
    <main style="padding:32px;max-width:1400px;margin:0 auto;width:100%;box-sizing:border-box;">

          <!-- Header -->
          <div style="margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
              <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.03em;margin:0 0 4px;color:var(--text-primary);">
                Partner Console
              </h1>
              <p style="font-size:14.5px;color:var(--text-secondary);margin:0;">
                Overview of dispatch operations, payout ledger limits, and average user reviews.
              </p>
            </div>
            <a routerLink="/provider/jobs" class="btn btn-primary btn-sm">Dispatch Jobs Pipeline →</a>
          </div>

          <!-- KPI Stats Overview (Fills width comfortably) -->
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:16px;margin-bottom:28px;" class="stats-grid">
            <div class="card" style="padding:20px;">
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Net Earnings</div>
              <div style="font-size:28px;font-weight:800;color:var(--text-primary);line-height:1;">₹{{ earnings() }}</div>
              <div style="font-size:12.5px;color:var(--text-secondary);margin-top:6px;">after platform commissions</div>
            </div>
            <div class="card" style="padding:20px;">
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Completed Jobs</div>
              <div style="font-size:28px;font-weight:800;color:var(--success);line-height:1;">{{ completedCount() }}</div>
              <div style="font-size:12.5px;color:var(--text-secondary);margin-top:6px;">100% dispatch success</div>
            </div>
            <div class="card" style="padding:20px;">
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Active Pipeline</div>
              <div style="font-size:28px;font-weight:800;color:var(--warning);line-height:1;">{{ activeJobsCount() }}</div>
              <div style="font-size:12.5px;color:var(--text-secondary);margin-top:6px;">assigned active jobs</div>
            </div>
            <div class="card" style="padding:20px;">
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Rating Analytics</div>
              <div style="font-size:28px;font-weight:800;color:var(--text-primary);line-height:1;">★ {{ rating() }}</div>
              <div style="font-size:12.5px;color:var(--text-secondary);margin-top:6px;">top-tier partner index</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1.8fr 1.2fr;gap:20px;align-items:start;" class="layout-grid">

            <!-- Left Column: Active Jobs & Booking Trends -->
            <div style="display:flex;flex-direction:column;gap:20px;">
              <!-- Booking Trends / Weekly Performance -->
              <div class="card">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
                  <h2 style="font-size:16px;font-weight:800;color:var(--text-primary);margin:0;letter-spacing:-0.02em;">Booking Trends</h2>
                  <span style="font-size:12.5px;color:var(--text-muted);">Weekly Performance (₹)</span>
                </div>
                <div style="display:flex;align-items:flex-end;gap:14px;height:120px;padding:0 8px 6px;">
                  <div *ngFor="let day of weeklyPerformance" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
                    <span style="font-size:10.5px;color:var(--text-secondary);font-weight:600;">₹{{ day.val }}</span>
                    <div [style.height.px]="(day.val/maxDaily)*80" [style.background]="day.val > 0 ? 'var(--accent)' : 'var(--border)'" style="width:100%;border-radius:4px 4px 0 0;min-height:3px;"></div>
                    <span style="font-size:11px;color:var(--text-muted);font-weight:600;">{{ day.name }}</span>
                  </div>
                </div>
              </div>

              <!-- Active Jobs List -->
              <div class="card">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                  <h2 style="font-size:16px;font-weight:800;color:var(--text-primary);margin:0;letter-spacing:-0.02em;">Active Dispatch Jobs</h2>
                  <a routerLink="/provider/jobs" style="font-size:13.5px;color:var(--accent);text-decoration:none;font-weight:700;">Job Control Panel →</a>
                </div>

                <div *ngIf="activeJobs().length === 0" style="padding:40px;text-align:center;border:1px dashed var(--border);border-radius:12px;">
                  <p style="font-size:14px;color:var(--text-muted);margin:0;">No active dispatches right now. Go to Job Pipeline to accept leads.</p>
                </div>

                <div style="display:flex;flex-direction:column;" *ngIf="activeJobs().length > 0">
                  <div *ngFor="let b of activeJobs()" class="table-row" style="padding:14px 0;display:flex;align-items:center;justify-content:space-between;gap:14px;">
                    <div style="flex:1;min-width:0;">
                      <p style="font-size:14px;font-weight:700;color:var(--text-primary);margin:0 0 2px;">{{ b.service?.name }}</p>
                      <p style="font-size:12.5px;color:var(--text-muted);margin:0;">Client: {{ b.customer?.name }} · Location: {{ b.customer?.phone }}</p>
                    </div>
                    <div style="text-align:right;flex-shrink:0;">
                      <p style="font-size:14.5px;font-weight:800;color:var(--text-primary);margin:0 0 2px;">₹{{ b.totalAmount }}</p>
                      <span [class]="statusBadge(b.status)">{{ b.status.replace('_',' ') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Payout Summary & Ratings Analytics -->
            <div style="display:flex;flex-direction:column;gap:20px;">
              <!-- Payout Summary -->
              <div class="card">
                <h3 style="font-size:14.5px;font-weight:800;color:var(--text-primary);margin:0 0 12px;letter-spacing:-0.01em;">Payout Settlement Summary</h3>
                <div style="display:flex;flex-direction:column;gap:10px;font-size:13px;">
                  <div style="display:flex;justify-content:space-between;">
                    <span style="color:var(--text-secondary);">Last Settled Payout:</span>
                    <span style="font-weight:700;color:var(--text-primary);">₹3,840</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;">
                    <span style="color:var(--text-secondary);">Next Settlement Date:</span>
                    <span style="font-weight:600;color:var(--text-primary);">Daily at 6:00 PM</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:8px;margin-top:2px;">
                    <span style="color:var(--text-secondary);">Active Bank:</span>
                    <span style="font-weight:600;color:var(--text-primary);">SBI ···· 1042</span>
                  </div>
                </div>
              </div>

              <!-- Ratings Analytics summary -->
              <div class="card" style="text-align:center;padding:24px 16px;">
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Customer Rating Score</div>
                <div style="font-size:36px;font-weight:800;color:var(--text-primary);line-height:1;margin-bottom:6px;">★ 4.90</div>
                <div style="font-size:12.5px;color:var(--text-secondary);">Calculated from 38 verified dispatches</div>
              </div>
            </div>

          </div>

        </main>
  `,
  styles: [`
    @media (max-width: 900px) {
      .stats-grid { grid-template-columns: 1fr 1fr !important; }
      .layout-grid { grid-template-columns: 1fr !important; }
    }
  `]
})
export class ProviderDashboardPage implements OnInit {
  private readonly providerService = inject(ProviderService);
  readonly authService = inject(AuthService);
  readonly sidebarService = inject(SidebarService);

  readonly bookings = signal<any[]>([]);
  readonly activeJobs = signal<any[]>([]);
  readonly activeJobsCount = signal(0);
  readonly completedCount = signal(0);
  readonly earnings = signal(3840);
  readonly rating = signal(4.90);

  weeklyPerformance = [
    { name: 'Mon', val: 560 },
    { name: 'Tue', val: 840 },
    { name: 'Wed', val: 0 },
    { name: 'Thu', val: 1200 },
    { name: 'Fri', val: 750 },
    { name: 'Sat', val: 1800 },
    { name: 'Sun', val: 950 }
  ];
  get maxDaily(): number { return Math.max(...this.weeklyPerformance.map(d => d.val)); }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.providerService.getBookings().subscribe({
      next: (res: any) => {
        if (res.success) {
          const all: any[] = res.data;
          this.bookings.set(all);
          const activeList = all.filter(b => ['accepted', 'in_progress'].includes(b.status));
          this.activeJobs.set(activeList.slice(0, 3));
          this.activeJobsCount.set(activeList.length);
          this.completedCount.set(all.filter(b => b.status === 'completed').length);
        }
      }
    });

    this.providerService.getEarnings().subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.earnings.set(res.data.totalEarnings ?? res.data.earnings ?? 3840);
          this.rating.set(res.data.rating ?? 4.90);
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
}
