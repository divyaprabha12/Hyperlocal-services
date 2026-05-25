import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';

type CustomerSection = 'personal' | 'security' | 'locations' | 'preferences';

@Component({
  selector: 'app-customer-profile',
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <main class="customer-profile-page">
      <section class="customer-hero card">
        <div class="hero-copy">
          <div class="hero-kicker">Customer settings</div>
          <h1>{{ name || 'Customer Account' }}</h1>
          <p>Manage your personal details, saved places, and booking preferences from one clean panel.</p>
        </div>
        <div class="hero-avatar-block">
          <img [src]="avatarUrl()" alt="Avatar">
          <button class="btn btn-ghost btn-sm" (click)="uploadPhoto()">Upload Avatar</button>
        </div>
      </section>

      <section class="settings-grid">
        <aside class="card settings-nav">
          <button type="button" class="settings-nav-btn" [class.active]="activeSection() === 'personal'" (click)="activeSection.set('personal')">
            <span class="nav-kicker">01</span>
            <span>Personal Details</span>
          </button>
          <button type="button" class="settings-nav-btn" [class.active]="activeSection() === 'security'" (click)="activeSection.set('security')">
            <span class="nav-kicker">02</span>
            <span>Security</span>
          </button>
          <button type="button" class="settings-nav-btn" [class.active]="activeSection() === 'locations'" (click)="activeSection.set('locations')">
            <span class="nav-kicker">03</span>
            <span>Saved Locations</span>
          </button>
          <button type="button" class="settings-nav-btn" [class.active]="activeSection() === 'preferences'" (click)="activeSection.set('preferences')">
            <span class="nav-kicker">04</span>
            <span>Preferences</span>
          </button>
        </aside>

        <div class="settings-panels">
          <section *ngIf="activeSection() === 'personal'" class="card panel-card">
            <div class="panel-head">
              <h2>Personal Details</h2>
              <p>Keep your account information current for smoother booking updates.</p>
            </div>

            <div class="form-grid">
              <div>
                <label class="label">Full name</label>
                <input type="text" [(ngModel)]="name" class="input">
              </div>
              <div>
                <label class="label">Primary phone</label>
                <input type="text" [(ngModel)]="phone" class="input">
              </div>
              <div class="full-span">
                <label class="label">Email address</label>
                <input type="email" [(ngModel)]="email" class="input readonly-input" readonly>
              </div>
            </div>

            <div class="panel-actions">
              <button class="btn btn-primary btn-sm" (click)="saveProfile()">Save Changes</button>
            </div>
          </section>

          <section *ngIf="activeSection() === 'security'" class="card panel-card">
            <div class="panel-head">
              <h2>Security Credentials</h2>
              <p>Update your password without affecting bookings or saved places.</p>
            </div>

            <div class="form-grid">
              <div>
                <label class="label">Current password</label>
                <input type="password" [(ngModel)]="currPassword" class="input" placeholder="********">
              </div>
              <div>
                <label class="label">New password</label>
                <input type="password" [(ngModel)]="newPassword" class="input" placeholder="********">
              </div>
              <div class="full-span">
                <label class="label">Confirm new password</label>
                <input type="password" [(ngModel)]="confirmPassword" class="input" placeholder="********">
              </div>
            </div>

            <div class="panel-actions">
              <button class="btn btn-primary btn-sm" (click)="updatePassword()">Update Password</button>
            </div>
          </section>

          <section *ngIf="activeSection() === 'locations'" class="card panel-card">
            <div class="panel-head inline-head">
              <div>
                <h2>Saved Locations</h2>
                <p>Store your most-used addresses for quicker bookings.</p>
              </div>
              <button class="btn btn-ghost btn-sm" (click)="addAddress()">Add New</button>
            </div>

            <div class="location-list">
              <div *ngFor="let addr of addresses" class="location-card">
                <div>
                  <span class="location-tag">{{ addr.tag }}</span>
                  <strong>{{ addr.street }}</strong>
                  <p>{{ addr.city }}, {{ addr.state }} - {{ addr.pincode }}</p>
                </div>
                <button class="btn btn-danger btn-sm" (click)="deleteAddress(addr)">Remove</button>
              </div>
            </div>
          </section>

          <section *ngIf="activeSection() === 'preferences'" class="card panel-card">
            <div class="panel-head">
              <h2>Booking Preferences</h2>
              <p>Choose how you want to receive updates and confirmations.</p>
            </div>

            <div class="toggle-list">
              <div class="toggle-row">
                <div>
                  <strong>WhatsApp dispatch alerts</strong>
                  <p>Receive booking and technician arrival updates on WhatsApp.</p>
                </div>
                <input type="checkbox" [(ngModel)]="prefWhatsapp" class="toggle-checkbox">
              </div>

              <div class="toggle-row">
                <div>
                  <strong>Email booking receipts</strong>
                  <p>Get an email summary when a visit is completed and paid.</p>
                </div>
                <input type="checkbox" [(ngModel)]="prefEmail" class="toggle-checkbox">
              </div>
            </div>

            <div class="panel-actions">
              <button class="btn btn-primary btn-sm" (click)="savePreferences()">Save Preferences</button>
            </div>
          </section>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .customer-profile-page {
      height: 100%;
      overflow: auto;
      padding: 14px 16px 18px;
      width: 100%;
      max-width: none;
      margin: 0;
      box-sizing: border-box;
    }
    .customer-hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 18px 20px;
      margin-bottom: 16px;
      border-radius: 22px;
    }
    .hero-kicker {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 800;
      margin-bottom: 6px;
    }
    .customer-hero h1 {
      margin: 0 0 6px;
      font-size: 22px;
      letter-spacing: -0.03em;
    }
    .customer-hero p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.6;
      max-width: 520px;
    }
    .hero-avatar-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .hero-avatar-block img {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: var(--bg-raised);
    }
    .settings-grid {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 16px;
      align-items: start;
    }
    .settings-nav {
      padding: 14px;
      position: sticky;
      top: 80px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .settings-nav-btn {
      border: none;
      border-radius: 16px;
      background: transparent;
      color: var(--text-secondary);
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      transition: 0.18s ease;
    }
    .settings-nav-btn:hover {
      background: var(--bg-raised);
      color: var(--text-primary);
    }
    .settings-nav-btn.active {
      background: linear-gradient(135deg, rgba(74, 107, 83, 0.1), rgba(198, 124, 56, 0.08));
      color: var(--text-primary);
    }
    .nav-kicker {
      width: 30px;
      height: 30px;
      border-radius: 11px;
      background: var(--bg-base);
      color: var(--accent);
      font-size: 11px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .settings-panels {
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
    .inline-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
    }
    .panel-head h2 {
      margin: 0 0 6px;
      font-size: 17px;
      letter-spacing: -0.02em;
    }
    .panel-head p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 12.5px;
      line-height: 1.55;
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
    .panel-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
    .location-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .location-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      padding: 16px;
      border-radius: 18px;
      background: var(--bg-raised);
      border: 1px solid var(--border);
    }
    .location-tag {
      display: inline-block;
      margin-bottom: 6px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      font-weight: 800;
    }
    .location-card strong {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
      color: var(--text-primary);
    }
    .location-card p {
      margin: 0;
      font-size: 12.5px;
      color: var(--text-secondary);
    }
    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    @media (max-width: 860px) {
      .customer-hero,
      .settings-grid,
      .form-grid {
        grid-template-columns: 1fr;
      }
      .customer-hero {
        flex-direction: column;
        align-items: start;
      }
      .settings-nav {
        position: static;
      }
      .full-span {
        grid-column: auto;
      }
      .location-card,
      .inline-head {
        flex-direction: column;
        align-items: start;
      }
    }
  `]
})
export class CustomerProfilePage {
  readonly auth = inject(AuthService);
  readonly sidebarService = inject(SidebarService);
  readonly activeSection = signal<CustomerSection>('personal');

  name = this.auth.currentUser()?.name || 'Alex Rivera';
  email = this.auth.currentUser()?.email || 'alex@gmail.com';
  phone = this.auth.currentUser()?.phone || '+91 8877665544';

  currPassword = '';
  newPassword = '';
  confirmPassword = '';

  prefWhatsapp = true;
  prefEmail = true;

  addresses = [
    { tag: 'Home', street: 'Flats 204, Shanti Enclave, Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034' },
    { tag: 'Office', street: 'Tower C, Tech Park, Whitefield', city: 'Bangalore', state: 'Karnataka', pincode: '560066' }
  ];

  avatarUrl(): string {
    return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(this.name || 'User')}&backgroundColor=4e6f57&textColor=ffffff`;
  }

  uploadPhoto(): void {
    alert('Avatar upload triggers the standard file selector.');
  }

  saveProfile(): void {
    alert('Profile data saved successfully.');
  }

  updatePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    alert('Account password updated successfully.');
    this.currPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  addAddress(): void {
    const street = prompt('Enter street address:');
    if (!street) return;
    this.addresses.push({
      tag: 'Other',
      street,
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    });
  }

  deleteAddress(addr: any): void {
    this.addresses = this.addresses.filter(a => a !== addr);
  }

  savePreferences(): void {
    alert('Notification settings updated.');
  }
}
