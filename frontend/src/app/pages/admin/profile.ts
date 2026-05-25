import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';

type AdminSection = 'profile' | 'moderation' | 'security';

@Component({
  selector: 'app-admin-profile',
  imports: [FormsModule, NgIf],
  template: `
    <main class="admin-profile-page">
      <section class="admin-hero card">
        <div>
          <div class="hero-kicker">Admin workspace</div>
          <h1>{{ name }}</h1>
          <p>Control your admin identity, moderation preferences, and security settings from one compact panel.</p>
        </div>
        <div class="hero-badge">Operations Admin</div>
      </section>

      <section class="admin-grid">
        <aside class="card admin-nav">
          <button type="button" class="nav-btn" [class.active]="activeSection() === 'profile'" (click)="activeSection.set('profile')">Profile Details</button>
          <button type="button" class="nav-btn" [class.active]="activeSection() === 'moderation'" (click)="activeSection.set('moderation')">Moderation Defaults</button>
          <button type="button" class="nav-btn" [class.active]="activeSection() === 'security'" (click)="activeSection.set('security')">Security</button>
        </aside>

        <div class="admin-stack">
          <section *ngIf="activeSection() === 'profile'" class="card panel-card">
            <div class="panel-head">
              <h2>Profile Details</h2>
              <p>Used across the admin header and moderation screens.</p>
            </div>
            <div class="form-grid">
              <div>
                <label class="label">Full name</label>
                <input class="input" [(ngModel)]="name">
              </div>
              <div>
                <label class="label">Primary email</label>
                <input class="input readonly-input" [value]="email" readonly>
              </div>
              <div class="full-span">
                <label class="label">Ops contact number</label>
                <input class="input" [(ngModel)]="phone">
              </div>
            </div>
            <div class="panel-actions">
              <button class="btn btn-primary btn-sm" (click)="save()">Save Settings</button>
            </div>
          </section>

          <section *ngIf="activeSection() === 'moderation'" class="card panel-card">
            <div class="panel-head">
              <h2>Moderation Defaults</h2>
              <p>Set the behavior expected for KYC and dispute operations.</p>
            </div>
            <div class="toggle-list">
              <div class="toggle-row">
                <div>
                  <strong>Priority alerts for new disputes</strong>
                  <p>Highlight urgent dispute tickets first in the moderation queue.</p>
                </div>
                <input type="checkbox" [(ngModel)]="priorityAlerts" class="toggle-checkbox">
              </div>
              <div class="toggle-row">
                <div>
                  <strong>Email summary every evening</strong>
                  <p>Receive a daily moderation digest with dispute and KYC counts.</p>
                </div>
                <input type="checkbox" [(ngModel)]="dailyDigest" class="toggle-checkbox">
              </div>
            </div>
            <div class="panel-actions">
              <button class="btn btn-primary btn-sm" (click)="save()">Save Settings</button>
            </div>
          </section>

          <section *ngIf="activeSection() === 'security'" class="card panel-card">
            <div class="panel-head">
              <h2>Security</h2>
              <p>Update your password for admin console access.</p>
            </div>
            <div class="form-grid">
              <div>
                <label class="label">Current password</label>
                <input type="password" class="input" [(ngModel)]="currentPassword" placeholder="********">
              </div>
              <div>
                <label class="label">New password</label>
                <input type="password" class="input" [(ngModel)]="newPassword" placeholder="********">
              </div>
            </div>
            <div class="panel-actions">
              <button class="btn btn-primary btn-sm" (click)="updatePassword()">Update Password</button>
            </div>
          </section>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .admin-profile-page {
      height: 100%;
      overflow: auto;
      padding: 14px 16px 18px;
      width: 100%;
      max-width: none;
      margin: 0;
      box-sizing: border-box;
    }
    .admin-hero {
      padding: 18px 20px;
      border-radius: 22px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
    }
    .hero-kicker {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--accent);
      font-weight: 800;
      margin-bottom: 6px;
    }
    .admin-hero h1 {
      margin: 0 0 6px;
      font-size: 22px;
      letter-spacing: -0.03em;
    }
    .admin-hero p {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 560px;
    }
    .hero-badge {
      min-height: 34px;
      padding: 0 14px;
      border-radius: 999px;
      background: rgba(74, 107, 83, 0.12);
      color: var(--accent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      white-space: nowrap;
    }
    .admin-grid {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 16px;
    }
    .admin-nav {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: sticky;
      top: 80px;
    }
    .nav-btn {
      border: none;
      background: transparent;
      border-radius: 16px;
      padding: 12px 14px;
      text-align: left;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-secondary);
      cursor: pointer;
      transition: 0.18s ease;
    }
    .nav-btn:hover,
    .nav-btn.active {
      background: linear-gradient(135deg, rgba(74, 107, 83, 0.1), rgba(198, 124, 56, 0.08));
      color: var(--text-primary);
    }
    .admin-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .panel-card {
      padding: 20px;
      border-radius: 22px;
    }
    .panel-head {
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }
    .panel-head h2 {
      margin: 0 0 6px;
      font-size: 17px;
    }
    .panel-head p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 12.5px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .full-span {
      grid-column: 1 / -1;
    }
    .readonly-input {
      background: var(--bg-base);
      color: var(--text-muted);
      cursor: not-allowed;
    }
    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .toggle-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
    }
    .toggle-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .toggle-row strong {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
      color: var(--text-primary);
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
      flex-shrink: 0;
    }
    .panel-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
    @media (max-width: 860px) {
      .admin-grid,
      .form-grid {
        grid-template-columns: 1fr;
      }
      .admin-nav {
        position: static;
      }
      .full-span {
        grid-column: auto;
      }
      .admin-hero {
        flex-direction: column;
        align-items: start;
      }
    }
  `]
})
export class AdminProfilePage {
  readonly auth = inject(AuthService);
  readonly sidebarService = inject(SidebarService);
  readonly activeSection = signal<AdminSection>('profile');

  name = this.auth.currentUser()?.name || 'Sarah Jenkins';
  email = this.auth.currentUser()?.email || 'admin@hyperlocal.in';
  phone = this.auth.currentUser()?.phone || '+91 90000 11223';

  priorityAlerts = true;
  dailyDigest = true;
  currentPassword = '';
  newPassword = '';

  save(): void {
    alert('Admin settings saved.');
  }

  updatePassword(): void {
    if (!this.currentPassword || !this.newPassword) {
      alert('Please enter both current and new password.');
      return;
    }
    this.currentPassword = '';
    this.newPassword = '';
    alert('Admin password updated.');
  }
}
