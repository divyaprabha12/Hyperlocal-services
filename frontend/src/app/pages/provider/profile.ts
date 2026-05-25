import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import {
  ProviderPaymentDetails,
  ProviderProfileDraft,
  ProviderSettingsService
} from '../../core/services/provider-settings.service';

type ProfileSection = 'business' | 'account' | 'payments' | 'security' | 'notifications';

@Component({
  selector: 'app-provider-profile',
  imports: [FormsModule, NgIf, TitleCasePipe],
  template: `
    <main class="profile-page">
      <section class="profile-hero card">
        <div class="hero-band"></div>
        <div class="hero-body">
          <div class="hero-avatar">
            <span>{{ initials() }}</span>
            <div class="hero-badge">{{ kycBadge() }}</div>
          </div>

          <div class="hero-copy">
            <div class="hero-topline">Provider workspace</div>
            <h1>{{ businessName }}</h1>
            <p>{{ serviceDesc }}</p>
            <div class="hero-meta">
              <span>{{ auth.currentUser()?.role | titlecase }}</span>
              <span>{{ experienceYears }} years experience</span>
              <span>{{ serviceRadius }} km service radius</span>
            </div>
          </div>

          <div class="hero-status">
            <div class="status-chip" [class.verified]="isKycVerified()">
              {{ isKycVerified() ? 'KYC verified' : 'Profile in setup' }}
            </div>
            <button type="button" class="btn btn-primary btn-sm" (click)="saveAll()">Save Profile</button>
          </div>
        </div>
      </section>

      <section class="profile-grid">
        <aside class="card nav-card">
          <button type="button" class="settings-nav-btn" [class.active]="activeSection() === 'business'" (click)="activeSection.set('business')">
            <span class="nav-kicker">01</span>
            <span>Business Profile</span>
          </button>
          <button type="button" class="settings-nav-btn" [class.active]="activeSection() === 'account'" (click)="activeSection.set('account')">
            <span class="nav-kicker">02</span>
            <span>Account Contacts</span>
          </button>
          <button type="button" class="settings-nav-btn" [class.active]="activeSection() === 'payments'" (click)="activeSection.set('payments')">
            <span class="nav-kicker">03</span>
            <span>Payment Accounts</span>
          </button>
          <button type="button" class="settings-nav-btn" [class.active]="activeSection() === 'security'" (click)="activeSection.set('security')">
            <span class="nav-kicker">04</span>
            <span>Security</span>
          </button>
          <button type="button" class="settings-nav-btn" [class.active]="activeSection() === 'notifications'" (click)="activeSection.set('notifications')">
            <span class="nav-kicker">05</span>
            <span>Notifications</span>
          </button>

          <div class="nav-summary">
            <span class="summary-label">Active payout mode</span>
            <strong>{{ paymentDetails.preferredMode === 'upi' ? 'UPI settlement' : 'Bank settlement' }}</strong>
            <span class="summary-subtle">{{ maskedAccount() }}</span>
          </div>
        </aside>

        <div class="content-stack">
          <section *ngIf="activeSection() === 'business'" class="card section-card">
            <div class="section-header">
              <div>
                <h2>Business Front Details</h2>
                <p>Shape how your business appears to customers and dispatch teams.</p>
              </div>
            </div>

            <div class="grid-form">
              <div>
                <label class="label">Business / shop name</label>
                <input type="text" [(ngModel)]="businessName" class="input">
              </div>
              <div>
                <label class="label">Years of experience</label>
                <input type="number" [(ngModel)]="experienceYears" class="input">
              </div>
              <div>
                <label class="label">Business office address</label>
                <input type="text" [(ngModel)]="address" class="input">
              </div>
              <div>
                <label class="label">Service radius coverage (km)</label>
                <input type="number" [(ngModel)]="serviceRadius" class="input">
              </div>
              <div class="full-width">
                <label class="label">Short service description</label>
                <input type="text" [(ngModel)]="serviceDesc" class="input">
              </div>
              <div class="full-width">
                <label class="label">Business overview</label>
                <textarea [(ngModel)]="businessOverview" class="input" rows="5"></textarea>
              </div>
            </div>
          </section>

          <section *ngIf="activeSection() === 'account'" class="card section-card">
            <div class="section-header">
              <div>
                <h2>Account Contacts</h2>
                <p>Keep your operating contact information clean and easy to reach.</p>
              </div>
            </div>

            <div class="grid-form">
              <div>
                <label class="label">Primary contact name</label>
                <input type="text" [(ngModel)]="name" class="input">
              </div>
              <div>
                <label class="label">Primary phone</label>
                <input type="text" [(ngModel)]="phone" class="input">
              </div>
              <div>
                <label class="label">Alternate phone</label>
                <input type="text" [(ngModel)]="altPhone" class="input">
              </div>
              <div>
                <label class="label">Support email</label>
                <input type="email" [(ngModel)]="supportEmail" class="input">
              </div>
              <div class="full-width">
                <label class="label">Login email</label>
                <input type="email" [value]="auth.currentUser()?.email" class="input readonly-input" readonly>
              </div>
            </div>
          </section>

          <section *ngIf="activeSection() === 'payments'" class="card section-card">
            <div class="section-header">
              <div>
                <h2>Payment Account Details</h2>
                <p>Maintain the bank or UPI details used for provider payouts from here.</p>
              </div>
              <div class="inline-chip">{{ paymentDetails.preferredMode === 'upi' ? 'UPI preferred' : 'Bank preferred' }}</div>
            </div>

            <div class="grid-form">
              <div>
                <label class="label">Account holder name</label>
                <input type="text" [(ngModel)]="paymentDetails.accountHolder" class="input">
              </div>
              <div>
                <label class="label">Bank name</label>
                <input type="text" [(ngModel)]="paymentDetails.bankName" class="input">
              </div>
              <div>
                <label class="label">Bank account number</label>
                <input type="text" [(ngModel)]="paymentDetails.accountNumber" class="input">
              </div>
              <div>
                <label class="label">IFSC code</label>
                <input type="text" [(ngModel)]="paymentDetails.ifscCode" class="input">
              </div>
              <div>
                <label class="label">Branch name</label>
                <input type="text" [(ngModel)]="paymentDetails.branchName" class="input">
              </div>
              <div>
                <label class="label">UPI ID</label>
                <input type="text" [(ngModel)]="paymentDetails.upiId" class="input">
              </div>
              <div class="full-width">
                <label class="label">Preferred settlement mode</label>
                <div class="choice-row">
                  <button type="button" class="choice-pill" [class.active]="paymentDetails.preferredMode === 'bank'" (click)="paymentDetails.preferredMode = 'bank'">Bank transfer</button>
                  <button type="button" class="choice-pill" [class.active]="paymentDetails.preferredMode === 'upi'" (click)="paymentDetails.preferredMode = 'upi'">UPI payout</button>
                </div>
              </div>
            </div>

            <div class="account-preview">
              <div>
                <span class="preview-label">Payout account preview</span>
                <strong>{{ paymentDetails.accountHolder || 'Account holder' }}</strong>
                <p>{{ paymentDetails.bankName || 'Bank name' }} · {{ maskedAccount() }}</p>
              </div>
              <div class="preview-side">
                <span>{{ paymentDetails.ifscCode || 'IFSC' }}</span>
                <span>{{ paymentDetails.upiId || 'UPI ID not added' }}</span>
              </div>
            </div>
          </section>

          <section *ngIf="activeSection() === 'security'" class="card section-card">
            <div class="section-header">
              <div>
                <h2>Security Credentials</h2>
                <p>Update your login password without affecting business or payout settings.</p>
              </div>
            </div>

            <div class="grid-form">
              <div>
                <label class="label">Current password</label>
                <input type="password" [(ngModel)]="currPassword" class="input" placeholder="********">
              </div>
              <div>
                <label class="label">New password</label>
                <input type="password" [(ngModel)]="newPassword" class="input" placeholder="********">
              </div>
            </div>

            <div class="section-actions">
              <button type="button" class="btn btn-primary btn-sm" (click)="updatePassword()">Update Password</button>
            </div>
          </section>

          <section *ngIf="activeSection() === 'notifications'" class="card section-card">
            <div class="section-header">
              <div>
                <h2>Notifications</h2>
                <p>Control the operational alerts you want to receive.</p>
              </div>
            </div>

            <div class="toggle-list">
              <div class="toggle-row">
                <div>
                  <strong>Instant SMS dispatch alerts</strong>
                  <p>Get a text when a new nearby booking or assignment is ready.</p>
                </div>
                <input type="checkbox" [(ngModel)]="alertSms" class="toggle-checkbox">
              </div>

              <div class="toggle-row">
                <div>
                  <strong>Payout settlement notifications</strong>
                  <p>Receive settlement and withdrawal updates for your active payout account.</p>
                </div>
                <input type="checkbox" [(ngModel)]="alertPayout" class="toggle-checkbox">
              </div>
            </div>
          </section>

          <div class="section-actions sticky-actions">
            <button type="button" class="btn btn-ghost btn-sm" (click)="resetDraft()">Reset Draft</button>
            <button type="button" class="btn btn-primary btn-sm" (click)="saveAll()">Save Changes</button>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .profile-page {
      height: 100%;
      overflow: auto;
      padding: 14px 16px 18px;
      max-width: none;
      margin: 0;
      width: 100%;
      box-sizing: border-box;
    }
    .profile-hero {
      overflow: hidden;
      margin-bottom: 16px;
      padding: 0;
      border-radius: 22px;
    }
    .hero-band {
      height: 36px;
     
    }
    .hero-body {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 18px;
      align-items: center;
      padding: 0 20px 18px;
      margin-top: -22px;
    }
    .hero-avatar {
      width: 74px;
      height: 74px;
      border-radius: 22px;
      background: linear-gradient(135deg, #4f7a58, #36533e);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.04em;
      border: 4px solid var(--bg-surface);
      position: relative;
      box-shadow: 0 14px 26px rgba(63, 95, 72, 0.18);
    }
    .hero-badge {
      position: absolute;
      right: -5px;
      bottom: -5px;
      min-width: 28px;
      height: 28px;
      border-radius: 999px;
      background: #fff2e8;
      color: #ce7b39;
      border: 3px solid var(--bg-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      padding: 0 8px;
    }
    .hero-copy h1 {
      font-size: 20px;
      line-height: 1.15;
      margin: 0 0 4px;
      color: var(--text-primary);
      letter-spacing: -0.03em;
    }
    .hero-copy p {
      margin: 0 0 10px;
      font-size: 13px;
      color: var(--text-secondary);
      max-width: 620px;
      line-height: 1.55;
    }
    .hero-topline {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--accent);
      font-weight: 800;
      margin-bottom: 6px;
    }
    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .hero-meta span,
    .inline-chip,
    .status-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 30px;
      padding: 0 11px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }
    .hero-meta span {
      background: var(--bg-raised);
      color: var(--text-secondary);
    }
    .hero-status {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }
    .status-chip {
      background: #f7eadf;
      color: #a26022;
    }
    .status-chip.verified {
      background: #edf7ef;
      color: #3b7250;
    }
    .inline-chip {
      background: var(--bg-raised);
      color: var(--text-secondary);
    }
    .profile-grid {
      display: grid;
      grid-template-columns: 270px 1fr;
      gap: 16px;
      align-items: start;
    }
    .nav-card {
      padding: 14px;
      position: sticky;
      top: 80px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .settings-nav-btn {
      width: 100%;
      border: none;
      border-radius: 16px;
      background: transparent;
      color: var(--text-secondary);
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      text-align: left;
      transition: 0.18s ease;
    }
    .settings-nav-btn:hover {
      background: var(--bg-raised);
      color: var(--text-primary);
    }
    .settings-nav-btn.active {
      background: linear-gradient(135deg, rgba(79, 122, 88, 0.12), rgba(205, 122, 58, 0.08));
      color: var(--text-primary);
      box-shadow: inset 0 0 0 1px rgba(79, 122, 88, 0.12);
    }
    .nav-kicker {
      width: 30px;
      height: 30px;
      border-radius: 11px;
      background: var(--bg-base);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      color: var(--accent);
      flex-shrink: 0;
    }
    .nav-summary {
      margin-top: 8px;
      padding: 14px;
      border-radius: 16px;
      background: linear-gradient(180deg, var(--bg-raised), rgba(79, 122, 88, 0.05));
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .summary-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      font-weight: 800;
    }
    .summary-subtle {
      font-size: 12px;
      color: var(--text-secondary);
    }
    .content-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .section-card {
      padding: 20px;
      border-radius: 22px;
    }
    .section-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 14px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .section-header h2 {
      margin: 0 0 6px;
      font-size: 17px;
      line-height: 1.1;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    .section-header p {
      margin: 0;
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.55;
    }
    .grid-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .readonly-input {
      background: var(--bg-base);
      color: var(--text-muted);
      cursor: not-allowed;
    }
    .choice-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .choice-pill {
      min-height: 40px;
      padding: 0 16px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      color: var(--text-secondary);
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.18s ease;
    }
    .choice-pill.active {
      border-color: rgba(79, 122, 88, 0.25);
      background: rgba(79, 122, 88, 0.12);
      color: var(--accent);
    }
    .account-preview {
      margin-top: 16px;
      padding: 16px 18px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(79, 122, 88, 0.1), rgba(205, 122, 58, 0.06));
      border: 1px solid rgba(79, 122, 88, 0.14);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .preview-label {
      display: block;
      margin-bottom: 6px;
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 800;
    }
    .account-preview strong {
      display: block;
      font-size: 15px;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    .account-preview p,
    .preview-side span {
      margin: 0;
      font-size: 12.5px;
      color: var(--text-secondary);
    }
    .preview-side {
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: right;
    }
    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
    }
    .toggle-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .toggle-row strong {
      display: block;
      font-size: 14px;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    .toggle-row p {
      margin: 0;
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .toggle-checkbox {
      width: 18px;
      height: 18px;
      accent-color: var(--accent);
      cursor: pointer;
      flex-shrink: 0;
    }
    .section-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .sticky-actions {
      padding-top: 4px;
      padding-bottom: 4px;
    }
    @media (max-width: 980px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
      .nav-card {
        position: static;
      }
      .hero-body {
        grid-template-columns: 1fr;
        justify-items: start;
      }
      .hero-status {
        align-items: flex-start;
      }
      .grid-form {
        grid-template-columns: 1fr;
      }
      .full-width {
        grid-column: auto;
      }
      .account-preview {
        flex-direction: column;
        align-items: flex-start;
      }
      .preview-side {
        text-align: left;
      }
    }
  `]
})
export class ProviderProfilePage {
  readonly auth = inject(AuthService);
  readonly sidebarService = inject(SidebarService);
  private readonly providerSettings = inject(ProviderSettingsService);

  activeSection = signal<ProfileSection>('business');

  private readonly draftDefaults: ProviderProfileDraft = {
    businessName: this.auth.currentUser()?.providerProfile?.businessName || 'Miller Electric & Smart Automation',
    experienceYears: this.auth.currentUser()?.providerProfile?.experienceYears || 8,
    address: 'Indiranagar Main Road, Indiranagar, Bangalore',
    serviceRadius: 8,
    serviceDesc: 'Professional home repairs, geyser servicing, copper piping, and smart electrical alignment work.',
    businessOverview: 'Running a reliable neighborhood service business with verified tooling, fast dispatch response, and disciplined completion updates for homeowners.',
    contactName: this.auth.currentUser()?.name || 'David Miller',
    phone: this.auth.currentUser()?.phone || '+91 88776 65544',
    altPhone: '+91 99887 22004',
    supportEmail: this.auth.currentUser()?.email || 'provider@hyperlocal.app',
    alertSms: true,
    alertPayout: true
  };

  private readonly paymentDefaults: ProviderPaymentDetails = {
    accountHolder: this.auth.currentUser()?.name || 'David Miller',
    bankName: 'State Bank of India',
    accountNumber: 'XXXXXX1042',
    ifscCode: 'SBIN0001042',
    branchName: 'Indiranagar',
    upiId: 'davidmiller@okaxis',
    preferredMode: 'bank'
  };

  private readonly savedDraft = this.providerSettings.getProfileDraft(this.draftDefaults);
  paymentDetails = this.providerSettings.getPaymentDetails(this.paymentDefaults);

  businessName = this.savedDraft.businessName;
  experienceYears = this.savedDraft.experienceYears;
  address = this.savedDraft.address;
  serviceRadius = this.savedDraft.serviceRadius;
  serviceDesc = this.savedDraft.serviceDesc;
  businessOverview = this.savedDraft.businessOverview;
  name = this.savedDraft.contactName;
  phone = this.savedDraft.phone;
  altPhone = this.savedDraft.altPhone;
  supportEmail = this.savedDraft.supportEmail;
  alertSms = this.savedDraft.alertSms;
  alertPayout = this.savedDraft.alertPayout;

  currPassword = '';
  newPassword = '';

  initials(): string {
    const base = this.name || this.businessName || 'U';
    const parts = base.trim().split(' ').filter(Boolean);
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : base[0].toUpperCase();
  }

  kycBadge(): string {
    return this.isKycVerified() ? '✓' : '…';
  }

  isKycVerified(): boolean {
    return this.auth.currentUser()?.providerProfile?.kycStatus === 'verified';
  }

  maskedAccount(): string {
    const raw = this.paymentDetails.accountNumber || '';
    const suffix = raw.slice(-4);
    return suffix ? `A/C ending ${suffix}` : 'No account number';
  }

  saveAll(): void {
    const draft: ProviderProfileDraft = {
      businessName: this.businessName,
      experienceYears: this.experienceYears,
      address: this.address,
      serviceRadius: this.serviceRadius,
      serviceDesc: this.serviceDesc,
      businessOverview: this.businessOverview,
      contactName: this.name,
      phone: this.phone,
      altPhone: this.altPhone,
      supportEmail: this.supportEmail,
      alertSms: this.alertSms,
      alertPayout: this.alertPayout
    };

    this.providerSettings.saveProfileDraft(draft);
    this.providerSettings.savePaymentDetails(this.paymentDetails);

    this.auth.currentUser.update(user => {
      if (!user) return user;
      return {
        ...user,
        name: this.name,
        phone: this.phone,
        providerProfile: {
          ...user.providerProfile,
          businessName: this.businessName,
          experienceYears: this.experienceYears
        }
      };
    });

    alert('Provider profile and payment account details saved.');
  }

  resetDraft(): void {
    const freshDraft = this.providerSettings.getProfileDraft(this.draftDefaults);
    const freshPayment = this.providerSettings.getPaymentDetails(this.paymentDefaults);

    this.businessName = freshDraft.businessName;
    this.experienceYears = freshDraft.experienceYears;
    this.address = freshDraft.address;
    this.serviceRadius = freshDraft.serviceRadius;
    this.serviceDesc = freshDraft.serviceDesc;
    this.businessOverview = freshDraft.businessOverview;
    this.name = freshDraft.contactName;
    this.phone = freshDraft.phone;
    this.altPhone = freshDraft.altPhone;
    this.supportEmail = freshDraft.supportEmail;
    this.alertSms = freshDraft.alertSms;
    this.alertPayout = freshDraft.alertPayout;
    this.paymentDetails = freshPayment;
  }

  updatePassword(): void {
    if (!this.currPassword || !this.newPassword) {
      alert('Enter both current and new password.');
      return;
    }
    this.currPassword = '';
    this.newPassword = '';
    alert('Password updated. Use the new password for your next login.');
  }
}
