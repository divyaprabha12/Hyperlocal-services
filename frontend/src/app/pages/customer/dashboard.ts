import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar';
import { HeaderComponent } from '../../shared/header';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-dashboard',
  imports: [RouterLink, NgIf, NgFor, DatePipe],
  template: `
    <main class="cust-dash">

          <!-- Header -->
          <div style="margin-bottom:24px;">
            <h1 style="font-size:22px;font-weight:800;letter-spacing:-0.03em;margin:0 0 4px;color:var(--text-primary);">
              Good {{ greeting }}, {{ firstName }}
            </h1>
            <p style="font-size:13.5px;color:var(--text-secondary);margin:0;">
              Operational overview of your household visits, service spending, and support tickets.
            </p>
          </div>

          <!-- KPI stats grid -->
          <div class="dash-stats-grid">
            <div class="card" style="padding:18px;">
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;font-weight:700;">Total Spent</div>
              <div style="font-size:26px;font-weight:800;color:var(--text-primary);line-height:1;">₹{{ totalSpent() }}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:5px;">on verified dispatches</div>
            </div>
            <div class="card" style="padding:18px;">
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;font-weight:700;">Active Requests</div>
              <div style="font-size:26px;font-weight:800;color:var(--accent);line-height:1;">{{ activeCount() }}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:5px;">scheduled technician visits</div>
            </div>
            <div class="card" style="padding:18px;">
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;font-weight:700;">Visits Logged</div>
              <div style="font-size:26px;font-weight:800;color:var(--success);line-height:1;">{{ completedCount() }}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:5px;">jobs fully completed</div>
            </div>
            <div class="card" style="padding:18px;">
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;font-weight:700;">Support Tickets</div>
              <div style="font-size:26px;font-weight:800;color:var(--danger);line-height:1;">1</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:5px;">active dispute review</div>
            </div>
          </div>

          <div class="dash-layout-grid">
            
            <!-- Left Column: Bookings & Spend Trends -->
            <div style="display:flex;flex-direction:column;gap:20px;">
              <!-- Spending trends -->
              <div class="card">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                  <h2 style="font-size:15px;font-weight:800;color:var(--text-primary);margin:0;letter-spacing:-0.02em;">Spending Analytics</h2>
                  <span style="font-size:12px;color:var(--text-muted);">6-Month Log</span>
                </div>
                <div style="display:flex;align-items:flex-end;gap:10px;height:110px;padding:0 4px 6px;overflow:hidden;">
                  <div *ngFor="let m of spendingTrend" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;">
                    <span style="font-size:10px;color:var(--text-secondary);font-weight:600;white-space:nowrap;">₹{{ m.val }}</span>
                    <div [style.height.px]="(m.val/maxSpend)*72" [style.background]="m.current ? 'var(--accent)' : 'var(--border)'" style="width:100%;border-radius:4px 4px 0 0;min-height:3px;"></div>
                    <span style="font-size:10px;color:var(--text-muted);font-weight:600;">{{ m.mo }}</span>
                  </div>
                </div>
              </div>

              <!-- Active & Recent Bookings -->
              <div class="card">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                  <h2 style="font-size:15px;font-weight:800;color:var(--text-primary);margin:0;letter-spacing:-0.02em;">Recent Household Bookings</h2>
                  <a routerLink="/customer/bookings" style="font-size:13px;color:var(--accent);text-decoration:none;font-weight:700;white-space:nowrap;">View →</a>
                </div>

                <div *ngIf="recentBookings().length===0" style="padding:36px;text-align:center;border:1px dashed var(--border);border-radius:12px;">
                  <p style="font-size:14px;color:var(--text-muted);margin:0 0 12px;">No bookings logged yet.</p>
                  <a routerLink="/customer/search" class="btn btn-primary btn-sm">Find nearby Partner</a>
                </div>

                <div style="display:flex;flex-direction:column;">
                  <div *ngFor="let b of recentBookings()" class="table-row booking-row">
                    <div class="booking-icon">
                      {{ catEmoji(b.service?.category) }}
                    </div>
                    <div style="flex:1;min-width:0;">
                      <p style="font-size:13.5px;font-weight:700;color:var(--text-primary);margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                        {{ b.service?.name || 'Service Dispatch' }}
                      </p>
                      <p style="font-size:12px;color:var(--text-muted);margin:0;">{{ b.bookingDate | date:'d MMM yyyy' }} · {{ b.timeSlot }}</p>
                    </div>
                    <div class="booking-meta">
                      <span style="font-size:14px;font-weight:800;color:var(--text-primary);white-space:nowrap;">₹{{ b.totalAmount }}</span>
                      <span [class]="statusBadge(b.status)">{{ b.status.replace('_',' ') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Dispute status & Interactions -->
            <div style="display:flex;flex-direction:column;gap:20px;">
              <!-- Dispute Status Ticket -->
              <div class="card">
                <h3 style="font-size:14px;font-weight:800;color:var(--text-primary);margin:0 0 12px;letter-spacing:-0.01em;">Active Dispute Status</h3>
                <div style="border:1px solid var(--border);border-radius:12px;padding:14px;background:var(--bg-raised);display:flex;flex-direction:column;gap:8px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                    <span style="font-size:12px;font-weight:700;color:var(--text-primary);">Ticket #TCK-8921</span>
                    <span class="badge badge-amber">Open Review</span>
                  </div>
                  <p style="font-size:12.5px;color:var(--text-secondary);margin:0;">Category: PRICING DISCREPANCY</p>
                  <p style="font-size:12px;color:var(--text-muted);margin:0;line-height:1.5;">"Provider requested cash convenience charge beyond hourly rate."</p>
                </div>
              </div>

              <!-- Recent Interactions -->
              <div class="card">
                <h3 style="font-size:14px;font-weight:800;color:var(--text-primary);margin:0 0 12px;letter-spacing:-0.01em;">Recent Provider Interactions</h3>
                <div style="display:flex;flex-direction:column;gap:10px;">
                  <div style="display:flex;align-items:center;gap:10px;background:var(--bg-raised);padding:10px;border-radius:8px;border:1px solid var(--border);">
                    <img src="https://api.dicebear.com/8.x/initials/svg?seed=Suresh&backgroundColor=5e7c5a&textColor=ffffff" style="width:30px;height:30px;border-radius:50%;flex-shrink:0;">
                    <div style="flex:1;min-width:0;">
                      <p style="font-size:12.5px;font-weight:700;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">Suresh Kumar (Electrician)</p>
                      <p style="font-size:11px;color:var(--text-muted);margin:0;">Completed visit 2 days ago</p>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:10px;background:var(--bg-raised);padding:10px;border-radius:8px;border:1px solid var(--border);">
                    <img src="https://api.dicebear.com/8.x/initials/svg?seed=Arvind&backgroundColor=5e7c5a&textColor=ffffff" style="width:30px;height:30px;border-radius:50%;flex-shrink:0;">
                    <div style="flex:1;min-width:0;">
                      <p style="font-size:12.5px;font-weight:700;margin:0;">Arvind Plumber</p>
                      <p style="font-size:11px;color:var(--text-muted);margin:0;">Completed plumbing fixup 1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
  `,
  styles: [`
    .cust-dash {
      padding: 28px 24px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .dash-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 24px;
    }
    .dash-layout-grid {
      display: grid;
      grid-template-columns: 1.8fr 1.2fr;
      gap: 20px;
      align-items: start;
    }
    .booking-row {
      padding: 12px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .booking-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--bg-overlay);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    .booking-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
    @media (max-width: 768px) {
      .cust-dash { padding: 16px; }
      .dash-stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
      .dash-layout-grid { grid-template-columns: 1fr; gap: 16px; }
      .booking-meta { flex-direction: column; align-items: flex-end; gap: 4px; }
    }
    @media (max-width: 420px) {
      .dash-stats-grid { grid-template-columns: 1fr 1fr; }
    }`]
})
export class CustomerDashboardPage implements OnInit {
  readonly auth = inject(AuthService);
  readonly sidebarService = inject(SidebarService);
  private readonly bookingService = inject(BookingService);

  readonly recentBookings = signal<any[]>([]);
  readonly totalBookings = signal(0);
  readonly activeCount = signal(0);
  readonly completedCount = signal(0);
  readonly totalSpent = signal(0);

  get greeting(): string {
    const h = new Date().getHours();
    return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  }
  get firstName(): string { return this.auth.currentUser()?.name?.split(' ')[0] ?? 'there'; }

  spendingTrend = [
    { mo: 'Dec', val: 480, current: false },
    { mo: 'Jan', val: 320, current: false },
    { mo: 'Feb', val: 650, current: false },
    { mo: 'Mar', val: 280, current: false },
    { mo: 'Apr', val: 720, current: false },
    { mo: 'May', val: 540, current: true },
  ];
  get maxSpend(): number { return Math.max(...this.spendingTrend.map(m => m.val)); }

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe({
      next: (res: any) => {
        if (!res.success) return;
        const all: any[] = res.data;
        const active = ['pending', 'accepted', 'in_progress'];
        this.totalBookings.set(all.length);
        this.activeCount.set(all.filter(b => active.includes(b.status)).length);
        this.completedCount.set(all.filter(b => b.status === 'completed').length);
        this.totalSpent.set(all.filter(b => b.status === 'completed').reduce((s: number, b: any) => s + (b.totalAmount || 0), 0));
        this.recentBookings.set(all.slice(0, 5));
      }
    });
  }

  statusBadge(s: string): string {
    const m: Record<string, string> = { pending: 'badge badge-amber', accepted: 'badge badge-blue', in_progress: 'badge badge-purple', completed: 'badge badge-green', cancelled: 'badge badge-red' };
    return m[s] ?? 'badge badge-neutral';
  }

  catEmoji(cat: string): string {
    const m: Record<string, string> = { electrician: '⚡', plumber: '🔧', cleaner: '🧹', carpenter: '🪚', painter: '🎨', ac_technician: '❄️', home_repair: '🏠' };
    return m[cat] ?? '🔩';
  }
}
