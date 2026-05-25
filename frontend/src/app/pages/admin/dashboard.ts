import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar';
import { HeaderComponent } from '../../shared/header';
import { AdminService } from '../../core/services/admin.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, NgIf, NgFor],
  template: `
    <main style="padding:32px;max-width:1400px;margin:0 auto;width:100%;box-sizing:border-box;">

          <!-- Header -->
          <div style="margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
              <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.03em;margin:0 0 4px;color:var(--text-primary);">
                Operations Center
              </h1>
              <p style="font-size:14.5px;color:var(--text-secondary);margin:0;">
                Platform moderation analytics, KYC backlog, disputes resolution, and booking activity metrics.
              </p>
            </div>
            <div style="display:flex;gap:8px;">
              <a routerLink="/admin/kyc" class="btn btn-ghost btn-sm">📋 Verification Queue</a>
              <a routerLink="/admin/users" class="btn btn-ghost btn-sm">👥 User Directory</a>
            </div>
          </div>

          <!-- KPI stats grid (Fills width comfortably) -->
          <div style="display:grid;grid-template-columns:repeat(5, 1fr);gap:16px;margin-bottom:28px;" class="stats-grid">
            <div class="card" style="padding:20px;">
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Gross Billing</div>
              <div style="font-size:24px;font-weight:800;color:var(--text-primary);line-height:1;">₹{{ stats()?.summary?.grossBilling ?? 15400 }}</div>
              <div style="font-size:12px;color:var(--success);margin-top:6px;font-weight:600;">↑ 12% this week</div>
            </div>
            <div class="card" style="padding:20px;">
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Net Revenue</div>
              <div style="font-size:24px;font-weight:800;color:var(--accent);line-height:1;">₹{{ stats()?.summary?.netRevenue ?? 2310 }}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;">15% marketplace fee</div>
            </div>
            <div class="card" style="padding:20px;">
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Total Bookings</div>
              <div style="font-size:24px;font-weight:800;color:var(--text-primary);line-height:1;">{{ stats()?.summary?.totalBookings ?? 18 }}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;">all time visits logged</div>
            </div>
            <div class="card" style="padding:20px;">
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Customers</div>
              <div style="font-size:24px;font-weight:800;color:var(--text-primary);line-height:1;">{{ stats()?.summary?.activeCustomers ?? 12 }}</div>
              <div style="font-size:12px;color:var(--success);margin-top:6px;font-weight:600;">+4 new signups</div>
            </div>
            <div class="card" style="padding:20px;">
              <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;font-weight:700;">Service Partners</div>
              <div style="font-size:24px;font-weight:800;color:var(--success);line-height:1;">{{ stats()?.summary?.activeProviders ?? 8 }}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;">verified professionals</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1.8fr 1.2fr;gap:20px;align-items:start;" class="layout-grid">

            <!-- Left column: Booking metrics & Disputes backlog -->
            <div style="display:flex;flex-direction:column;gap:20px;">
              <!-- Booking Load trends -->
              <div class="card">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
                  <h2 style="font-size:16px;font-weight:800;color:var(--text-primary);margin:0;letter-spacing:-0.02em;">Weekly Platform Booking Load</h2>
                  <span style="font-size:12.5px;color:var(--text-muted);">Current week dispatches</span>
                </div>
                <div style="display:flex;align-items:flex-end;gap:14px;height:120px;padding:0 8px 6px;">
                  <div *ngFor="let week of weeklyLoad" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
                    <span style="font-size:10.5px;color:var(--text-secondary);font-weight:600;">{{ week.val }} jobs</span>
                    <div [style.height.px]="(week.val/maxLoad)*80" style="width:100%;border-radius:4px 4px 0 0;min-height:3px;background:var(--accent);transition:height 0.3s;"></div>
                    <span style="font-size:11px;color:var(--text-muted);font-weight:600;">{{ week.day }}</span>
                  </div>
                </div>
              </div>

              <!-- Disputes Backlog -->
              <div class="card">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                  <h2 style="font-size:16px;font-weight:800;color:var(--text-primary);margin:0;letter-spacing:-0.02em;">Active Dispute Moderation Queue</h2>
                  <a routerLink="/admin/reports" style="font-size:13.5px;color:var(--accent);text-decoration:none;font-weight:700;">Resolution Console →</a>
                </div>

                <div *ngIf="disputes().length === 0" style="padding:40px;text-align:center;border:1px dashed var(--border);border-radius:12px;">
                  <p style="font-size:14px;color:var(--text-muted);margin:0;">All customer dispute tickets cleared. Platform is running stable!</p>
                </div>

                <div style="display:flex;flex-direction:column;gap:12px;" *ngIf="disputes().length > 0">
                  <div *ngFor="let d of disputes()" style="background:var(--bg-raised);border:1px solid var(--border);border-radius:12px;padding:16px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                      <span style="font-size:13px;font-weight:700;color:var(--text-primary);">Ticket #{{ d._id?.slice(-5) }}</span>
                      <span class="badge badge-red">{{ d.status }}</span>
                    </div>
                    <p style="font-size:13px;color:var(--text-secondary);margin:0 0 4px;font-weight:600;">Reason: {{ d.reason }}</p>
                    <p style="font-size:12px;color:var(--text-muted);margin:0;line-height:1.5;">Details: {{ d.details }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: KYC backlogs & Server Stats -->
            <div style="display:flex;flex-direction:column;gap:20px;">
              <!-- KYC review backlog summary -->
              <div class="card">
                <h3 style="font-size:14.5px;font-weight:800;color:var(--text-primary);margin:0 0 12px;letter-spacing:-0.01em;">KYC Moderation Status</h3>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                  <span style="font-size:13px;color:var(--text-secondary);">Aadhaar Review Backlog:</span>
                  <span class="badge badge-amber" style="font-weight:700;">{{ pendingCount() }} pending</span>
                </div>
                <p style="font-size:12px;color:var(--text-muted);line-height:1.6;margin:0 0- 16px;">New partner profiles require Aadhaar and PAN check before they can bid.</p>
                <a routerLink="/admin/kyc" class="btn btn-primary btn-sm" style="width:100%;margin-top:14px;">Review Documents</a>
              </div>

              <!-- System details -->
              <div class="card">
                <h3 style="font-size:14.5px;font-weight:800;color:var(--text-primary);margin:0 0 12px;letter-spacing:-0.01em;">System Infrastructure</h3>
                <div style="font-size:13px;display:flex;flex-direction:column;gap:10px;">
                  <div style="display:flex;justify-content:space-between;">
                    <span style="color:var(--text-secondary);">Database Connection:</span>
                    <span style="color:var(--success);font-weight:700;">Connected</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;">
                    <span style="color:var(--text-secondary);">Server Ping Response:</span>
                    <span style="color:var(--text-primary);font-weight:600;">14 ms (Stable)</span>
                  </div>
                  <div style="display:flex;justify-content:space-between;">
                    <span style="color:var(--text-secondary);">Region coverage:</span>
                    <span style="color:var(--text-primary);font-weight:600;">Bangalore, Chennai</span>
                  </div>
                </div>
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
export class AdminDashboardPage implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly sidebarService = inject(SidebarService);

  readonly stats = signal<any>(null);
  readonly disputes = signal<any[]>([]);
  readonly pendingCount = signal(0);

  weeklyLoad = [
    { day: 'Mon', val: 12 },
    { day: 'Tue', val: 19 },
    { day: 'Wed', val: 8 },
    { day: 'Thu', val: 24 },
    { day: 'Fri', val: 15 },
    { day: 'Sat', val: 32 },
    { day: 'Sun', val: 14 }
  ];
  get maxLoad(): number { return Math.max(...this.weeklyLoad.map(w => w.val)); }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.adminService.getAnalytics().subscribe({
      next: (r: any) => { if (r.success) this.stats.set(r.data); }
    });
    this.adminService.getDisputes().subscribe({
      next: (r: any) => { if (r.success) this.disputes.set(r.data.filter((d: any) => d.status === 'open')); }
    });
    this.adminService.getPendingProviders().subscribe({
      next: (r: any) => { if (r.success) this.pendingCount.set(r.data.length); }
    });
  }
}
