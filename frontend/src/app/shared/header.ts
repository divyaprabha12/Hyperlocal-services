import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { SidebarService } from '../core/services/sidebar.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgIf, NgFor],
  template: `
    <header class="header-shell">
      <div class="header-left">
        <button type="button" (click)="toggleSidebar($event)" class="header-icon-btn" [attr.aria-label]="sidebarService.isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <line x1="3" x2="21" y1="6" y2="6"></line>
            <line x1="3" x2="21" y1="12" y2="12"></line>
            <line x1="3" x2="21" y1="18" y2="18"></line>
          </svg>
        </button>

        <a routerLink="/" class="brand-link">
          <span class="brand-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </span>
          <span class="brand-copy">
            <strong>Hyperlocal</strong>
            
          </span>
        </a>
      </div>

      <div class="header-right">
        <button type="button" (click)="toggleNotif($event)" class="header-icon-btn notif-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span *ngIf="unreadCount() > 0" class="notif-badge">{{ unreadCount() }}</span>
        </button>

        <div *ngIf="openNotif()" class="notif-dropdown">
          <div class="dropdown-head">
            <h3>Notifications</h3>
            <button type="button" class="dropdown-link" (click)="markRead()">Mark all as read</button>
          </div>
          <div class="notif-list">
            <div *ngFor="let n of notifications()" class="notif-item" [class.unread]="!n.read">
              <div class="notif-icon">
                <svg *ngIf="n.type==='booking'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path>
                </svg>
                <svg *ngIf="n.type==='payment'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div class="notif-copy">
                <p>{{ n.title }}</p>
                <span>{{ n.message }}</span>
                <small>{{ n.time }}</small>
              </div>
              <div *ngIf="!n.read" class="notif-dot"></div>
            </div>
          </div>
        </div>

        <div class="profile-wrap">
          <button type="button" (click)="toggleMenu($event)" class="profile-trigger" [attr.aria-expanded]="openMenu()">
            <img [src]="avatarUrl()" alt="Profile">
          </button>

          <div *ngIf="openMenu()" class="profile-dropdown">
            <div class="profile-head">
              <div class="profile-meta">
                <strong>{{ authService.currentUser()?.name || 'User' }}</strong>
                <span>{{ authService.currentUser()?.role || 'Guest' }}</span>
                <small>{{ authService.currentUser()?.email || 'user@hyperlocal.app' }}</small>
              </div>
            </div>

            <a [routerLink]="profileRoute()" (click)="openMenu.set(false)" class="dd-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              My Profile
            </a>

            <a [routerLink]="settingsRoute()" (click)="openMenu.set(false)" class="dd-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Account Settings
            </a>

            <button type="button" (click)="logout()" class="dd-item dd-danger">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-shell {
      height: 68px;
      padding: 0 20px;
      border-bottom: 1px solid var(--border);
      background: rgba(247, 245, 240, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .header-left,
    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
    }
    .header-icon-btn {
      width: 40px;
      height: 40px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      color: var(--text-secondary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.18s ease;
      position: relative;
    }
    .header-icon-btn:hover {
      color: var(--text-primary);
      border-color: var(--border-hover);
      background: var(--bg-raised);
    }
    .header-icon-btn svg,
    .notif-icon svg,
    .dd-item svg,
    .brand-logo svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
    }
    .brand-logo {
      width: 40px;
      height: 40px;
      border-radius: 14px;
      background: linear-gradient(135deg, #5d8667, #42614a);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 20px rgba(66, 97, 74, 0.22);
      flex-shrink: 0;
    }
    .brand-logo svg {
      width: 16px;
      height: 16px;
      stroke: #fff;
    }
    .brand-copy {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .brand-copy strong {
      font-size: 19px;
      line-height: 1;
      letter-spacing: -0.03em;
      color: var(--text-primary);
    }
    .brand-copy span {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .notif-badge {
      position: absolute;
      top: 3px;
      right: 3px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 999px;
      background: var(--accent);
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--bg-base);
    }
    .notif-dropdown,
    .profile-dropdown {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 320px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      box-shadow: var(--shadow);
      overflow: hidden;
      z-index: 200;
      animation: dropIn 0.18s ease;
    }
    .notif-dropdown { right: 56px; }
    .dropdown-head,
    .profile-head {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .dropdown-head h3 {
      margin: 0;
      font-size: 14px;
      color: var(--text-primary);
    }
    .dropdown-link {
      border: none;
      background: none;
      color: var(--accent);
      cursor: pointer;
      font-size: 11px;
      font-weight: 700;
      font-family: inherit;
    }
    .notif-list {
      max-height: 340px;
      overflow-y: auto;
    }
    .notif-item {
      padding: 14px 16px;
      display: flex;
      gap: 12px;
      border-bottom: 1px solid var(--border);
      align-items: flex-start;
      background: var(--bg-surface);
    }
    .notif-item.unread { background: rgba(74, 107, 83, 0.05); }
    .notif-item:last-child { border-bottom: none; }
    .notif-icon {
      width: 34px;
      height: 34px;
      border-radius: 12px;
      background: var(--bg-raised);
      color: var(--accent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .notif-copy { flex: 1; min-width: 0; }
    .notif-copy p {
      margin: 0 0 4px;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .notif-copy span,
    .notif-copy small {
      display: block;
      color: var(--text-secondary);
      font-size: 12px;
      line-height: 1.5;
    }
    .notif-copy small {
      margin-top: 5px;
      color: var(--text-muted);
      font-size: 10px;
    }
    .notif-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      margin-top: 8px;
      flex-shrink: 0;
    }
    .profile-trigger {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid var(--border);
      background: transparent;
      padding: 0;
      cursor: pointer;
      overflow: hidden;
      transition: 0.18s ease;
    }
    .profile-trigger:hover {
      border-color: var(--accent);
    }
    .profile-trigger img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .profile-meta {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }
    .profile-meta strong {
      font-size: 14px;
      color: var(--text-primary);
    }
    .profile-meta span,
    .profile-meta small {
      color: var(--text-secondary);
      font-size: 12px;
      text-transform: capitalize;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .profile-meta small {
      color: var(--text-muted);
      text-transform: none;
    }
    .dd-item {
      width: calc(100% - 16px);
      margin: 8px;
      min-height: 44px;
      padding: 0 12px;
      border: none;
      border-radius: 14px;
      background: transparent;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      font-family: inherit;
      text-align: left;
      cursor: pointer;
      transition: 0.18s ease;
    }
    .dd-item:hover {
      background: var(--bg-raised);
      color: var(--text-primary);
    }
    .dd-danger {
      color: var(--danger);
    }
    .dd-danger:hover {
      background: rgba(181, 77, 64, 0.08);
    }
    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 768px) {
      .brand-copy span { display: none; }
      .brand-copy strong { font-size: 17px; }
      .notif-dropdown { right: 0; width: 300px; }
      .profile-dropdown { width: 280px; }
    }
  `]
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  readonly sidebarService = inject(SidebarService);
  private readonly router = inject(Router);

  readonly openMenu = signal(false);
  readonly openNotif = signal(false);
  readonly notifications = signal<any[]>([]);

  constructor() {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const role = this.authService.currentUser()?.role;
    if (role === 'provider') {
      this.notifications.set([
        { type: 'booking', title: 'New Booking Assigned', message: 'Ramesh Kumar booked you for tomorrow at 10:00 AM.', time: '2m ago', read: false },
        { type: 'payment', title: 'Payout Processed', message: 'Rs 1,500 has been deposited to your bank account.', time: '1h ago', read: false },
        { type: 'booking', title: 'Service Completed', message: 'Customer approved your final OTP verification.', time: '2d ago', read: true }
      ]);
    } else if (role === 'admin') {
      this.notifications.set([
        { type: 'booking', title: 'New KYC Pending Review', message: 'Ramesh Kumar submitted documents for shop verification.', time: '4m ago', read: false },
        { type: 'payment', title: 'High Ticket Dispute Raised', message: 'Ticket #4920 has been logged by Aditya Sen regarding behavior.', time: '2h ago', read: false },
        { type: 'booking', title: 'Platform Clearance', message: 'Audit clear: compliance queue backlog under check.', time: '3d ago', read: true }
      ]);
    } else {
      this.notifications.set([
        { type: 'booking', title: 'Booking Confirmed', message: 'Your booking with Ramesh Plumber is scheduled for tomorrow at 10:00 AM.', time: '10m ago', read: false },
        { type: 'payment', title: 'Payment Successful', message: 'Rs 1,500 has been securely processed for plumbing service.', time: '4h ago', read: false },
        { type: 'booking', title: 'Leave a Review', message: 'Please share your experience on the completed visit.', time: '1d ago', read: true }
      ]);
    }
  }

  unreadCount(): number {
    return this.notifications().filter(n => !n.read).length;
  }

  avatarUrl(): string {
    const name = this.authService.currentUser()?.name || 'U';
    return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4a6b53&textColor=ffffff`;
  }

  toggleSidebar(event: Event): void {
    event.stopPropagation();
    this.sidebarService.toggle();
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.openMenu.update(v => !v);
    this.openNotif.set(false);
  }

  toggleNotif(event: Event): void {
    event.stopPropagation();
    this.openNotif.update(v => !v);
    this.openMenu.set(false);
  }

  markRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.openMenu.set(false);
    this.openNotif.set(false);
  }

  profileRoute(): string {
    const role = this.authService.currentUser()?.role;
    if (role === 'provider') return '/provider/profile';
    if (role === 'admin') return '/admin/profile';
    return '/customer/profile';
  }

  settingsRoute(): string {
    const role = this.authService.currentUser()?.role;
    if (role === 'provider') return '/provider/profile';
    if (role === 'admin') return '/admin/profile';
    return '/customer/profile';
  }

  logout(): void {
    this.openMenu.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
