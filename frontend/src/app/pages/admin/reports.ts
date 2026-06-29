import { Component, inject, signal, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { NgIf, NgFor } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-admin-reports',
  imports: [NgIf, NgFor],
  template: `
    <main class="reports-page">
      <div style="margin-bottom:24px;">
        <h1 style="font-size:22px;font-weight:800;letter-spacing:-0.03em;margin:0 0 4px;color:var(--text-primary);">Platform Disputes & Moderation</h1>
        <p style="font-size:13.5px;color:var(--text-secondary);margin:0;">Moderate escalations raised by customers regarding pricing, behavior, or incomplete service visits.</p>
      </div>
      <div class="card" style="padding:0;overflow:hidden;">
        <div style="padding:16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
          <h2 style="font-size:13px;font-weight:700;color:var(--text-primary);margin:0;">Dispute Resolution Backlog</h2>
          <span class="badge badge-amber">{{ reports().length }} open disputes</span>
        </div>
        <div *ngIf="reports().length === 0" style="padding:48px 24px;text-align:center;">
          <p style="font-size:13px;color:var(--text-muted);margin:0;">All customer disputes settled. Backlog cleared!</p>
        </div>
        <div class="reports-table">
          <table style="width:100%;border-collapse:collapse;text-align:left;font-size:13px;">
            <thead>
              <tr style="background:var(--bg-raised);border-bottom:1px solid var(--border);">
                <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Dispute Ticket</th>
                <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Customer</th>
                <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Category</th>
                <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Written Details</th>
                <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Status</th>
                <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of reports()" class="table-row">
                <td style="padding:12px 16px;font-weight:600;color:var(--text-primary);">#{{ r._id?.slice(-5) }}</td>
                <td style="padding:12px 16px;color:var(--text-secondary);">{{ r.customerName || 'Aditya Sen' }}</td>
                <td style="padding:12px 16px;color:var(--text-secondary);text-transform:capitalize;">{{ r.reason }}</td>
                <td style="padding:12px 16px;color:var(--text-secondary);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ r.details }}</td>
                <td style="padding:12px 16px;"><span class="badge badge-red">{{ r.status }}</span></td>
                <td style="padding:12px 16px;display:flex;gap:6px;">
                  <button (click)="resolve(r._id)" class="btn btn-success btn-sm">Settle Ticket</button>
                  <button (click)="refund(r._id)" class="btn btn-ghost btn-sm">Trigger Refund</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards list -->
        <div class="reports-cards" style="display:none;flex-direction:column;gap:12px;padding:16px;">
          <div *ngFor="let r of reports()" style="background:var(--bg-raised);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong style="font-size:14px;color:var(--text-primary);">#{{ r._id?.slice(-5) }}</strong>
              <span class="badge badge-red">{{ r.status }}</span>
            </div>
            <div style="font-size:12.5px;color:var(--text-secondary);">
              <p style="margin:2px 0;"><span style="color:var(--text-muted);">Customer:</span> {{ r.customerName || 'Aditya Sen' }}</p>
              <p style="margin:2px 0;"><span style="color:var(--text-muted);">Category:</span> {{ r.reason }}</p>
              <p style="margin:6px 0 0;line-height:1.4;background:var(--bg-surface);padding:8px;border-radius:6px;border:1px solid var(--border);">{{ r.details }}</p>
            </div>
            <div style="display:flex;gap:8px;margin-top:4px;">
              <button (click)="resolve(r._id)" class="btn btn-success btn-sm" style="flex:1;">Settle</button>
              <button (click)="refund(r._id)" class="btn btn-ghost btn-sm" style="flex:1;">Refund</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .reports-page {
      padding: 24px 28px;
      width: 100%;
      box-sizing: border-box;
    }
    @media (max-width: 768px) {
      .reports-page { padding: 16px; }
      .reports-table { display: none; }
      .reports-cards { display: flex !important; }
    }
  `]
})
export class AdminReportsPage implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly sidebarService = inject(SidebarService);
  readonly reports = signal<any[]>([]);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.adminService.getDisputes().subscribe({
      next: (res: any) => {
        if (res.success) {
          const live = res.data || [];
          const seeded = [
            {
              _id: 'DSP-8921',
              customerName: 'Aditya Sen',
              reason: 'pricing discrepancy',
              details: 'Provider requested an extra convenience charge beyond the quoted hourly rate after arrival.',
              status: 'open'
            },
            {
              _id: 'DSP-7364',
              customerName: 'Priya Sharma',
              reason: 'incomplete service',
              details: 'Pipe leakage reduced but not fully resolved. Customer requested a revisit or partial refund.',
              status: 'open'
            },
            {
              _id: 'DSP-6418',
              customerName: 'Rahul Verma',
              reason: 'behavior complaint',
              details: 'Customer reported repeated delay without proactive communication from the assigned partner.',
              status: 'open'
            }
          ];
          this.reports.set(live.length ? live : seeded);
        }
      }
    });
  }

  resolve(id: string): void {
    this.adminService.resolveDispute(id, 'resolved', 'Settled by platform moderator').subscribe({ next: () => this.load() });
  }

  refund(id: string): void {
    alert('Simulated customer refund transaction dispatched to gateway!');
    this.adminService.resolveDispute(id, 'resolved', 'Refund processed and dispute settled').subscribe({ next: () => this.load() });
  }
}
