import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';
import { AuthService } from '../../core/services/auth.service';
import { ProviderService } from '../../core/services/provider.service';
import { ProviderKycDetails, ProviderSettingsService } from '../../core/services/provider-settings.service';

@Component({
  selector: 'app-provider-kyc',
  imports: [FormsModule, NgIf],
  template: `
    <main class="kyc-page">
      <div class="page-header">
        <div>
          <h1>KYC Verification Centre</h1>
          <p>Add your compliance details once, review them clearly, and edit only when something changes.</p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" (click)="editing.set(true)">
          {{ hasAnyDetails() ? 'Edit KYC Details' : 'Add KYC Details' }}
        </button>
      </div>

      <div class="kyc-grid">
        <section class="card panel-card">
          <div class="panel-header">
            <div>
              <h2>Compliance Details</h2>
              <p>{{ editing() ? 'Update the compliance package below.' : 'View the currently stored KYC package.' }}</p>
            </div>
            <span class="status-pill" [class.verified]="status() === 'verified'" [class.rejected]="status() === 'rejected'">
              {{ statusLabel() }}
            </span>
          </div>

          <div *ngIf="!editing()" class="view-stack">
            <div class="detail-grid">
              <div class="detail-card">
                <span class="detail-label">Aadhaar number</span>
                <strong>{{ kycDetails.aadhaarNo || 'Not added' }}</strong>
              </div>
              <div class="detail-card">
                <span class="detail-label">PAN number</span>
                <strong>{{ kycDetails.panNo || 'Not added' }}</strong>
              </div>
            </div>

            <div class="document-grid">
              <div class="document-card">
                <div class="document-top">
                  <span>Aadhaar card copy</span>
                  <button type="button" class="link-btn" (click)="editing.set(true)">{{ kycDetails.aadhaarDocName ? 'Edit' : 'Add' }}</button>
                </div>
                <p>{{ kycDetails.aadhaarDocName || 'No file added yet' }}</p>
              </div>
              <div class="document-card">
                <div class="document-top">
                  <span>PAN card copy</span>
                  <button type="button" class="link-btn" (click)="editing.set(true)">{{ kycDetails.panDocName ? 'Edit' : 'Add' }}</button>
                </div>
                <p>{{ kycDetails.panDocName || 'No file added yet' }}</p>
              </div>
              <div class="document-card">
                <div class="document-top">
                  <span>Selfie verification</span>
                  <button type="button" class="link-btn" (click)="editing.set(true)">{{ kycDetails.selfieAdded ? 'Edit' : 'Add' }}</button>
                </div>
                <p>{{ kycDetails.selfieDocName || 'No selfie added yet' }}</p>
              </div>
              <div class="document-card">
                <div class="document-top">
                  <span>Address proof</span>
                  <button type="button" class="link-btn" (click)="editing.set(true)">{{ kycDetails.addressProofAdded ? 'Edit' : 'Add' }}</button>
                </div>
                <p>{{ kycDetails.addressProofName || 'No address proof added yet' }}</p>
              </div>
            </div>

            <div class="view-footer">
              <div>
                <span class="detail-label">Last submitted</span>
                <strong>{{ kycDetails.submittedAt || 'Not submitted yet' }}</strong>
              </div>
              <button type="button" class="btn btn-ghost btn-sm" (click)="editing.set(true)">
                {{ hasAnyDetails() ? 'Edit Details' : 'Add Details' }}
              </button>
            </div>
          </div>

          <div *ngIf="editing()" class="edit-stack">
            <div class="form-grid">
              <div>
                <label class="label">Aadhaar card number (12 digit)</label>
                <input type="text" [(ngModel)]="kycDetails.aadhaarNo" class="input" maxlength="14">
              </div>
              <div>
                <label class="label">PAN registration number (10 digit)</label>
                <input type="text" [(ngModel)]="kycDetails.panNo" class="input" maxlength="10">
              </div>
            </div>

            <div class="document-grid">
              <div class="upload-card">
                <span class="upload-title">Aadhaar card copy</span>
                <p>{{ kycDetails.aadhaarDocName || 'Front and back copy not added yet.' }}</p>
                <button type="button" class="btn btn-ghost btn-sm" (click)="uploadDoc('aadhaar')">{{ kycDetails.aadhaarDocName ? 'Edit File' : 'Add File' }}</button>
              </div>
              <div class="upload-card">
                <span class="upload-title">PAN card copy</span>
                <p>{{ kycDetails.panDocName || 'PAN copy not added yet.' }}</p>
                <button type="button" class="btn btn-ghost btn-sm" (click)="uploadDoc('pan')">{{ kycDetails.panDocName ? 'Edit File' : 'Add File' }}</button>
              </div>
              <div class="upload-card">
                <span class="upload-title">Selfie verification</span>
                <p>{{ kycDetails.selfieDocName || 'Selfie proof not added yet.' }}</p>
                <button type="button" class="btn btn-ghost btn-sm" (click)="uploadDoc('selfie')">{{ kycDetails.selfieAdded ? 'Edit File' : 'Add File' }}</button>
              </div>
              <div class="upload-card">
                <span class="upload-title">Address proof</span>
                <p>{{ kycDetails.addressProofName || 'Address proof not added yet.' }}</p>
                <button type="button" class="btn btn-ghost btn-sm" (click)="uploadDoc('address')">{{ kycDetails.addressProofAdded ? 'Edit File' : 'Add File' }}</button>
              </div>
            </div>

            <div class="edit-actions">
              <button type="button" class="btn btn-ghost btn-sm" (click)="cancelEdit()">Cancel</button>
              <button type="button" class="btn btn-primary btn-sm" (click)="submitKyc()">
                {{ hasAnyDetails() ? 'Save KYC Details' : 'Submit KYC Details' }}
              </button>
            </div>
          </div>
        </section>

        <section class="card panel-card summary-card">
          <div class="panel-header">
            <div>
              <h2>Verification Status</h2>
              <p>Track what has been added and what still needs attention.</p>
            </div>
          </div>

          <div class="summary-banner" [class.verified]="status() === 'verified'" [class.rejected]="status() === 'rejected'">
            <strong>{{ statusLabel() }}</strong>
            <p>{{ statusMessage() }}</p>
          </div>

          <div class="summary-list">
            <div class="summary-row">
              <span>Aadhaar details</span>
              <strong>{{ kycDetails.aadhaarNo ? 'Added' : 'Pending' }}</strong>
            </div>
            <div class="summary-row">
              <span>PAN details</span>
              <strong>{{ kycDetails.panNo ? 'Added' : 'Pending' }}</strong>
            </div>
            <div class="summary-row">
              <span>Selfie verification</span>
              <strong>{{ kycDetails.selfieAdded ? 'Added' : 'Pending' }}</strong>
            </div>
            <div class="summary-row">
              <span>Address proof</span>
              <strong>{{ kycDetails.addressProofAdded ? 'Added' : 'Pending' }}</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  `,
  styles: [`
    .kyc-page {
      padding: 32px;
      max-width: 1240px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
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
    .kyc-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
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
      margin-bottom: 20px;
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
    .status-pill {
      min-height: 32px;
      padding: 0 12px;
      border-radius: 999px;
      background: #fff6ea;
      color: #b86c26;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }
    .status-pill.verified {
      background: #edf7ef;
      color: #427353;
    }
    .status-pill.rejected {
      background: #fff0ed;
      color: #c16055;
    }
    .detail-grid,
    .form-grid,
    .document-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .detail-card,
    .document-card,
    .upload-card {
      border-radius: 18px;
      border: 1px solid var(--border);
      background: var(--bg-raised);
      padding: 16px;
    }
    .detail-label {
      display: block;
      margin-bottom: 8px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      font-weight: 800;
    }
    .detail-card strong,
    .document-card span,
    .upload-title {
      display: block;
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 700;
    }
    .document-card p,
    .upload-card p {
      margin: 10px 0 0;
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .document-top {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
    }
    .link-btn {
      border: none;
      background: none;
      color: var(--accent);
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      padding: 0;
    }
    .view-stack,
    .edit-stack {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .view-footer,
    .edit-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding-top: 4px;
    }
    .summary-card {
      position: sticky;
      top: 100px;
    }
    .summary-banner {
      padding: 18px;
      border-radius: 20px;
      background: #fff6ea;
      color: #b86c26;
      margin-bottom: 18px;
    }
    .summary-banner.verified {
      background: #edf7ef;
      color: #427353;
    }
    .summary-banner.rejected {
      background: #fff0ed;
      color: #c16055;
    }
    .summary-banner strong {
      display: block;
      margin-bottom: 6px;
      font-size: 16px;
    }
    .summary-banner p {
      margin: 0;
      font-size: 13px;
      line-height: 1.55;
    }
    .summary-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
      color: var(--text-secondary);
    }
    .summary-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .summary-row strong {
      color: var(--text-primary);
    }

    @media (max-width: 960px) {
      .kyc-grid,
      .detail-grid,
      .form-grid,
      .document-grid {
        grid-template-columns: 1fr;
      }
      .summary-card {
        position: static;
      }
    }
  `]
})
export class ProviderKycPage implements OnInit {
  private readonly providerService = inject(ProviderService);
  readonly sidebarService = inject(SidebarService);
  readonly auth = inject(AuthService);
  private readonly providerSettings = inject(ProviderSettingsService);

  readonly status = signal<'pending' | 'verified' | 'rejected'>('pending');
  readonly editing = signal(false);

  private readonly defaultKyc: ProviderKycDetails = {
    aadhaarNo: '',
    panNo: '',
    selfieAdded: false,
    addressProofAdded: false,
    aadhaarDocName: '',
    panDocName: '',
    selfieDocName: '',
    addressProofName: '',
    status: 'pending',
    submittedAt: ''
  };

  kycDetails = this.providerSettings.getKycDetails(this.defaultKyc);
  private lastSavedSnapshot = JSON.stringify(this.kycDetails);

  ngOnInit(): void {
    const currentStatus = (this.auth.currentUser()?.providerProfile?.kycStatus || this.kycDetails.status || 'pending') as 'pending' | 'verified' | 'rejected';
    this.status.set(currentStatus);
    if (!this.hasAnyDetails()) {
      this.editing.set(true);
    }
  }

  hasAnyDetails(): boolean {
    return !!(this.kycDetails.aadhaarNo || this.kycDetails.panNo || this.kycDetails.aadhaarDocName || this.kycDetails.panDocName);
  }

  statusLabel(): string {
    if (this.status() === 'verified') return 'KYC verified';
    if (this.status() === 'rejected') return 'Needs resubmission';
    return this.hasAnyDetails() ? 'Under review' : 'Not submitted';
  }

  statusMessage(): string {
    if (this.status() === 'verified') {
      return 'Your identity package is complete and visible as verified across provider flows.';
    }
    if (this.status() === 'rejected') {
      return 'A submitted document needs correction. Edit the KYC details and resubmit the updated files.';
    }
    return this.hasAnyDetails()
      ? 'Documents are added and waiting for review.'
      : 'No KYC package has been submitted yet. Add the details to continue.';
  }

  uploadDoc(type: 'aadhaar' | 'pan' | 'selfie' | 'address'): void {
    if (type === 'aadhaar') this.kycDetails.aadhaarDocName = 'aadhaar-front-back.pdf';
    if (type === 'pan') this.kycDetails.panDocName = 'pan-card.pdf';
    if (type === 'selfie') {
      this.kycDetails.selfieAdded = true;
      this.kycDetails.selfieDocName = 'selfie-verification.jpg';
    }
    if (type === 'address') {
      this.kycDetails.addressProofAdded = true;
      this.kycDetails.addressProofName = 'electricity-bill.pdf';
    }
    alert(`${type.toUpperCase()} document added to the KYC package.`);
  }

  cancelEdit(): void {
    this.kycDetails = JSON.parse(this.lastSavedSnapshot);
    this.editing.set(!this.hasAnyDetails());
  }

  submitKyc(): void {
    if (!this.kycDetails.aadhaarNo || !this.kycDetails.panNo) {
      alert('Please enter both Aadhaar and PAN details.');
      return;
    }

    this.kycDetails.status = 'pending';
    this.kycDetails.submittedAt = new Date().toLocaleString();
    this.providerSettings.saveKycDetails(this.kycDetails);
    this.lastSavedSnapshot = JSON.stringify(this.kycDetails);

    this.providerService.onboard({ kycStatus: 'pending' }).subscribe({
      next: () => {
        this.status.set('pending');
        this.editing.set(false);
        alert('KYC details saved and submitted for review.');
      }
    });
  }
}
