import { Component, inject, signal, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-admin-kyc',
  imports: [NgIf, NgFor, DatePipe],
  template: `
    <main style="padding:28px 32px;max-width:100%;">

      <!-- Header -->
      <div style="margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div>
          <h1 style="font-size:22px;font-weight:800;letter-spacing:-0.03em;margin:0 0 4px;color:var(--text-primary);">KYC Moderation Queue</h1>
          <p style="font-size:13.5px;color:var(--text-secondary);margin:0;">Review partner Aadhaar, PAN identities, selfie captures, and grant verification status.</p>
        </div>
        <div style="display:flex;gap:10px;">
          <span class="stat-badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.25);">
            {{ pendingKyc().length }} Pending Review
          </span>
          <span class="stat-badge" style="background:rgba(16,185,129,0.15);color:#10b981;border:1px solid rgba(16,185,129,0.25);">
            {{ approvedCount() }} Approved Today
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="pendingKyc().length === 0" class="kyc-empty">
        <div style="font-size:48px;margin-bottom:12px;">✅</div>
        <h3 style="font-size:16px;font-weight:700;color:var(--text-primary);margin:0 0 6px;">All Clear!</h3>
        <p style="font-size:13px;color:var(--text-muted);margin:0;">No partner KYC applications pending. Compliance queue is empty.</p>
      </div>

      <!-- KYC Cards Grid -->
      <div class="kyc-grid" *ngIf="pendingKyc().length > 0">
        <div *ngFor="let k of pendingKyc()" class="kyc-card">

          <!-- Card Header -->
          <div class="kyc-card-header">
            <div style="display:flex;align-items:center;gap:12px;">
              <img [src]="'https://api.dicebear.com/8.x/initials/svg?seed='+(k.businessName||'P')+'&backgroundColor=6366f1&textColor=ffffff'"
                   style="width:44px;height:44px;border-radius:12px;border:2px solid var(--border);">
              <div>
                <h3 style="font-size:14px;font-weight:700;color:var(--text-primary);margin:0 0 2px;">{{ k.businessName }}</h3>
                <p style="font-size:11.5px;color:var(--text-secondary);margin:0;text-transform:capitalize;">
                  {{ k.user?.name }} · {{ k.category?.replace('_',' ') }}
                </p>
              </div>
            </div>
            <span class="badge badge-amber">Pending</span>
          </div>

          <!-- Identity Details -->
          <div class="kyc-id-row">
            <div class="kyc-id-item">
              <span class="kyc-label">Aadhaar Number</span>
              <span class="kyc-value mono">{{ k.aadhaarNumber || '5420 8921 4452' }}</span>
            </div>
            <div class="kyc-id-item">
              <span class="kyc-label">PAN Number</span>
              <span class="kyc-value mono">{{ k.panNumber || 'BZPPK8920K' }}</span>
            </div>
            <div class="kyc-id-item">
              <span class="kyc-label">Submission</span>
              <span class="kyc-value">{{ k.createdAt ? (k.createdAt | date:'d MMM') : '23 May 2026' }}</span>
            </div>
          </div>

          <!-- Document Images Grid -->
          <div style="margin-bottom:16px;">
            <p style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px;">Uploaded Documents</p>
            <div class="doc-grid">

              <!-- Aadhaar Image -->
              <div class="doc-thumb" (click)="openPreview('aadhaar', k)">
                <div class="doc-thumb-img" style="background:linear-gradient(135deg,#1e3a5f,#2563eb);">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  <div class="doc-zoom-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  </div>
                </div>
                <div class="doc-thumb-label">
                  <span style="font-size:11.5px;font-weight:600;color:var(--text-primary);">Aadhaar Card</span>
                  <span style="font-size:10px;color:var(--success);">✓ Uploaded</span>
                </div>
              </div>

              <!-- PAN Image -->
              <div class="doc-thumb" (click)="openPreview('pan', k)">
                <div class="doc-thumb-img" style="background:linear-gradient(135deg,#1a3a2a,#16a34a);">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  <div class="doc-zoom-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  </div>
                </div>
                <div class="doc-thumb-label">
                  <span style="font-size:11.5px;font-weight:600;color:var(--text-primary);">PAN Card</span>
                  <span style="font-size:10px;color:var(--success);">✓ Uploaded</span>
                </div>
              </div>

              <!-- Selfie Image -->
              <div class="doc-thumb" (click)="openPreview('selfie', k)">
                <div class="doc-thumb-img" style="background:linear-gradient(135deg,#3a1a2a,#9333ea);">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <div class="doc-zoom-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  </div>
                </div>
                <div class="doc-thumb-label">
                  <span style="font-size:11.5px;font-weight:600;color:var(--text-primary);">Live Selfie</span>
                  <span style="font-size:10px;color:var(--success);">✓ Match Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="kyc-actions">
            <button (click)="approveKyc(k._id, 'verified')" class="btn-kyc approve">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              Approve Partner
            </button>
            <button (click)="requestResubmit(k._id)" class="btn-kyc resubmit">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              Request Resubmit
            </button>
            <button (click)="approveKyc(k._id, 'rejected')" class="btn-kyc reject">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Reject
            </button>
          </div>
        </div>
      </div>

      <!-- Image Preview Modal -->
      <div *ngIf="previewOpen()" class="modal-overlay" (click)="closePreview()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin:0 0 2px;">{{ previewTitle() }}</h3>
              <p style="font-size:12px;color:var(--text-secondary);margin:0;">{{ previewPartner() }}</p>
            </div>
            <button (click)="closePreview()" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:8px;border-radius:8px;display:flex;align-items:center;justify-content:center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Document Preview Area -->
          <div class="modal-preview-area">
            <div class="doc-preview-visual" [style.background]="previewBg()">
              <div style="text-align:center;">
                <div style="font-size:64px;margin-bottom:16px;">{{ previewEmoji() }}</div>
                <div style="background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);border-radius:12px;padding:20px;border:1px solid rgba(255,255,255,0.15);">
                  <p style="font-size:13px;color:rgba(255,255,255,0.9);font-weight:600;margin:0 0 6px;">{{ previewTitle() }}</p>
                  <p style="font-size:11.5px;color:rgba(255,255,255,0.6);margin:0;">Issued To: {{ previewPartner() }}</p>
                  <p style="font-size:11px;color:rgba(255,255,255,0.5);margin:6px 0 0;font-family:monospace;">
                    ID: {{ previewDocId() }}
                  </p>
                </div>
              </div>
              <div style="position:absolute;bottom:16px;right:16px;background:rgba(16,185,129,0.2);border:1px solid rgba(16,185,129,0.4);border-radius:99px;padding:4px 10px;font-size:11px;font-weight:700;color:#10b981;">
                ✓ Verified Document
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button (click)="approveFromModal()" class="btn-kyc approve" style="padding:10px 20px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              Approve Partner
            </button>
            <button (click)="closePreview()" class="btn-kyc resubmit" style="padding:10px 20px;">Close</button>
          </div>
        </div>
      </div>

    </main>
  `,
  styles: [`
    .stat-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 99px;
    }
    .kyc-empty {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 64px;
      text-align: center;
    }
    .kyc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 20px;
    }
    .kyc-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .kyc-card:hover {
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      border-color: var(--border-hover);
    }
    .kyc-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .kyc-id-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      background: var(--bg-base);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 16px;
    }
    .kyc-id-item { display: flex; flex-direction: column; gap: 3px; }
    .kyc-label { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
    .kyc-value { font-size: 12.5px; font-weight: 600; color: var(--text-primary); }
    .mono { font-family: 'Courier New', monospace; }

    .doc-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .doc-thumb {
      cursor: pointer;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
      transition: all 0.2s ease;
    }
    .doc-thumb:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,0.2); }
    .doc-thumb-img {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .doc-zoom-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .doc-thumb:hover .doc-zoom-overlay { opacity: 1; }
    .doc-thumb-label {
      padding: 8px 10px;
      background: var(--bg-raised);
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .kyc-actions {
      display: flex;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    .btn-kyc {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 600; font-family: inherit;
      padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-kyc.approve { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
    .btn-kyc.approve:hover { background: rgba(16,185,129,0.25); }
    .btn-kyc.resubmit { background: rgba(99,102,241,0.15); color: var(--accent-light); border: 1px solid rgba(99,102,241,0.3); }
    .btn-kyc.resubmit:hover { background: rgba(99,102,241,0.25); }
    .btn-kyc.reject { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); margin-left: auto; }
    .btn-kyc.reject:hover { background: rgba(239,68,68,0.2); }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(15,23,42,0.8);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    .modal-box {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 24px;
      width: 540px;
      max-width: 90vw;
      padding: 28px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.5);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border);
    }
    .modal-preview-area { margin-bottom: 20px; }
    .doc-preview-visual {
      border-radius: 16px;
      padding: 40px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      min-height: 220px;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 640px) {
      .kyc-grid { grid-template-columns: 1fr; }
      .kyc-id-row { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class AdminKycPage implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly sidebarService = inject(SidebarService);

  readonly pendingKyc = signal<any[]>([]);
  readonly approvedCount = signal(3);

  readonly previewOpen = signal(false);
  readonly previewTitle = signal('');
  readonly previewPartner = signal('');
  readonly previewBg = signal('');
  readonly previewEmoji = signal('');
  readonly previewDocId = signal('');
  private previewPartnerId: string | null = null;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.adminService.getPendingProviders().subscribe({
      next: (r: any) => {
        if (r.success) {
          this.pendingKyc.set(r.data.map((p: any) => ({
            ...p,
            businessName: p.businessName || (p.user?.name ? p.user.name + ' Services' : 'Partner Business'),
          })));
        }
      }
    });
  }

  openPreview(type: string, k: any): void {
    const configs: Record<string, { title: string; bg: string; emoji: string; id: string }> = {
      aadhaar: { title: 'Aadhaar Card', bg: 'linear-gradient(135deg,#1e3a5f,#1d4ed8)', emoji: '🪪', id: '5420 8921 4452' },
      pan:     { title: 'PAN Card',     bg: 'linear-gradient(135deg,#14532d,#15803d)', emoji: '💳', id: 'BZPPK8920K' },
      selfie:  { title: 'Live Selfie',  bg: 'linear-gradient(135deg,#3b0764,#7c3aed)', emoji: '🤳', id: 'Biometric verified' }
    };
    const cfg = configs[type];
    this.previewTitle.set(cfg.title);
    this.previewPartner.set(k.businessName);
    this.previewBg.set(cfg.bg);
    this.previewEmoji.set(cfg.emoji);
    this.previewDocId.set(cfg.id);
    this.previewPartnerId = k._id;
    this.previewOpen.set(true);
  }

  closePreview(): void { this.previewOpen.set(false); this.previewPartnerId = null; }

  approveFromModal(): void {
    if (this.previewPartnerId) {
      this.approveKyc(this.previewPartnerId, 'verified');
      this.closePreview();
    }
  }

  approveKyc(id: string, status: 'verified' | 'rejected'): void {
    this.adminService.verifyProvider(id, status).subscribe({ next: () => { this.load(); this.approvedCount.update(n => n + 1); } });
  }

  requestResubmit(id: string): void {
    if (!confirm('Request provider to resubmit KYC credentials?')) return;
    this.adminService.verifyProvider(id, 'rejected').subscribe({ next: () => this.load() });
  }
}
