import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProviderService } from '../../core/services/provider.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';
import { ProviderSettingsService } from '../../core/services/provider-settings.service';

@Component({
  selector: 'app-provider-earnings',
  imports: [NgIf, NgFor, DatePipe, RouterLink],
  template: `
    <main class="payout-page">
      <div class="page-header">
        <div>
          <h1>Payout Console</h1>
          <p>Only payout activity is shown here. Payment account details are managed from your profile settings.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/provider/profile" class="btn btn-ghost btn-sm">Manage Payment Account</a>
          <button type="button" (click)="requestWithdrawal()" class="btn btn-primary btn-sm">Request Payout</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="card stat-card">
          <span class="stat-label">Available balance</span>
          <strong>₹{{ availableBalance() }}</strong>
          <p>Ready for withdrawal</p>
        </div>
        <div class="card stat-card">
          <span class="stat-label">Last settled payout</span>
          <strong>₹{{ lastSettledAmount() }}</strong>
          <p>{{ lastSettledDate() }}</p>
        </div>
        <div class="card stat-card">
          <span class="stat-label">Next settlement</span>
          <strong>Daily at 6:00 PM</strong>
          <p>{{ preferredModeLabel() }}</p>
        </div>
      </div>

      <div class="content-grid">
        <section class="card panel-card">
          <div class="panel-header">
            <div>
              <h2>Payout Account in Use</h2>
              <p>The active settlement destination used for provider withdrawals.</p>
            </div>
            <span class="mode-badge">{{ preferredModeLabel() }}</span>
          </div>

          <div class="account-grid">
            <div class="account-tile">
              <span class="tile-label">Account holder</span>
              <strong>{{ paymentDetails.accountHolder }}</strong>
              <p>{{ paymentDetails.bankName }}</p>
            </div>
            <div class="account-tile">
              <span class="tile-label">Bank account</span>
              <strong>{{ maskedAccount() }}</strong>
              <p>{{ paymentDetails.ifscCode }} · {{ paymentDetails.branchName }}</p>
            </div>
            <div class="account-tile">
              <span class="tile-label">UPI backup</span>
              <strong>{{ paymentDetails.upiId || 'Not added yet' }}</strong>
              <p>Used when UPI payout mode is selected</p>
            </div>
          </div>
        </section>

        <section class="card panel-card">
          <div class="panel-header">
            <div>
              <h2>Payout Timeline</h2>
              <p>Recent payout and withdrawal movement only.</p>
            </div>
          </div>

          <div *ngIf="ledger().length === 0" class="empty-state">
            No payout transactions recorded yet.
          </div>

          <div *ngIf="ledger().length > 0" class="timeline">
            <div *ngFor="let entry of ledger()" class="timeline-row">
              <div class="timeline-dot"></div>
              <div class="timeline-copy">
                <strong>{{ entry.type }}</strong>
                <p>{{ entry.date | date:'dd MMM yyyy' }} · Reference {{ entry.id }}</p>
              </div>
              <div class="timeline-amount">₹{{ entry.amount }}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  `,
  styles: [`
    .payout-page {
      padding: 32px;
      max-width: 1240px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .page-header h1 {
      margin: 0 0 6px;
      font-size: 28px;
      color: var(--text-primary);
      letter-spacing: -0.03em;
    }
    .page-header p {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }
    .header-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    .stat-card {
      padding: 22px;
      border-radius: 22px;
    }
    .stat-label {
      display: block;
      margin-bottom: 10px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      font-weight: 800;
    }
    .stat-card strong {
      display: block;
      font-size: 28px;
      line-height: 1.05;
      color: var(--text-primary);
      margin-bottom: 6px;
    }
    .stat-card p {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1.1fr 1.3fr;
      gap: 20px;
      align-items: start;
    }
    .panel-card {
      padding: 24px;
      border-radius: 24px;
    }
    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 18px;
    }
    .panel-header h2 {
      margin: 0 0 6px;
      font-size: 18px;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    .panel-header p {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .mode-badge {
      min-height: 32px;
      padding: 0 12px;
      border-radius: 999px;
      background: rgba(79, 122, 88, 0.12);
      color: var(--accent);
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .account-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .account-tile {
      padding: 16px 18px;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--bg-raised), rgba(79, 122, 88, 0.06));
      border: 1px solid var(--border);
    }
    .tile-label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      font-weight: 800;
      margin-bottom: 8px;
    }
    .account-tile strong {
      display: block;
      font-size: 16px;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    .account-tile p {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .empty-state {
      padding: 34px 18px;
      text-align: center;
      border-radius: 20px;
      border: 1px dashed var(--border);
      color: var(--text-muted);
      font-size: 14px;
    }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .timeline-row {
      display: grid;
      grid-template-columns: 16px 1fr auto;
      gap: 14px;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
    }
    .timeline-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .timeline-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 4px rgba(79, 122, 88, 0.12);
    }
    .timeline-copy strong {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
      color: var(--text-primary);
    }
    .timeline-copy p {
      margin: 0;
      font-size: 12.5px;
      color: var(--text-secondary);
    }
    .timeline-amount {
      font-size: 16px;
      font-weight: 800;
      color: var(--success);
      white-space: nowrap;
    }

    @media (max-width: 960px) {
      .stats-grid,
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 768px) {
      .payout-page {
        padding: 16px;
      }
      .page-header h1 {
        font-size: 24px;
      }
      .stat-card {
        padding: 16px;
        border-radius: 16px;
      }
      .panel-card {
        padding: 18px;
        border-radius: 18px;
      }
    }
  `]
})
export class ProviderEarningsPage implements OnInit {
  private readonly providerService = inject(ProviderService);
  readonly sidebarService = inject(SidebarService);
  private readonly providerSettings = inject(ProviderSettingsService);

  readonly ledger = signal<any[]>([]);
  readonly availableBalance = signal(3840);
  readonly lastSettledAmount = signal(1500);
  readonly lastSettledDate = signal('Yesterday, 6:00 PM');

  paymentDetails = this.providerSettings.getPaymentDetails({
    accountHolder: 'David Miller',
    bankName: 'State Bank of India',
    accountNumber: 'XXXXXX1042',
    ifscCode: 'SBIN0001042',
    branchName: 'Indiranagar',
    upiId: 'davidmiller@okaxis',
    preferredMode: 'bank'
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.providerService.getEarnings().subscribe({
      next: (res: any) => {
        if (!res.success || !res.data) return;

        this.availableBalance.set(res.data.netEarnings ?? 3840);
        this.ledger.set([
          { id: 'PO89034', date: new Date(Date.now() - 86400000), type: 'Daily payout settled', amount: 1500 },
          { id: 'PO88921', date: new Date(Date.now() - 172800000), type: 'Withdrawal processed', amount: 840 },
          { id: 'PO88456', date: new Date(Date.now() - 345600000), type: 'Daily payout settled', amount: 180 },
          { id: 'PO87654', date: new Date(Date.now() - 518400000), type: 'Withdrawal processed', amount: 1320 }
        ]);
      }
    });
  }

  preferredModeLabel(): string {
    return this.paymentDetails.preferredMode === 'upi' ? 'UPI payout mode' : 'Bank payout mode';
  }

  maskedAccount(): string {
    const suffix = (this.paymentDetails.accountNumber || '').slice(-4);
    return suffix ? `A/C ending ${suffix}` : 'No account added';
  }

  requestWithdrawal(): void {
    alert(`Payout request created for ${this.paymentDetails.accountHolder}. Funds will be sent using your active ${this.paymentDetails.preferredMode.toUpperCase()} mode.`);
  }
}
