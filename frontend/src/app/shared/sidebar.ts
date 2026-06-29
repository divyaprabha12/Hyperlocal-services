import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../core/services/auth.service';
import { SidebarService } from '../core/services/sidebar.service';

interface NavItem {
  label: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIf, NgFor, TitleCasePipe],
  template: `
    <aside class="sidebar-shell" [class.collapsed]="sidebarService.isCollapsed()">
      <nav class="nav-stack">
        <ng-container *ngFor="let item of navItems()">
          <a [routerLink]="item.route"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: item.exact === true }"
             class="nav-item"
             (click)="profileOpen.set(false)">
            <span class="nav-icon" [innerHTML]="getIcon(item.label)"></span>
            <span class="nav-text" *ngIf="!sidebarService.isCollapsed()">{{ item.label }}</span>
          </a>
        </ng-container>

        <!-- Direct Log Out link at bottom of sidebar stack -->
        <button type="button" class="nav-item logout-nav-btn" (click)="logout()" style="width:100%;text-align:left;border:none;background:transparent;cursor:pointer;font-family:inherit;margin-top:auto;display:flex;align-items:center;padding:0 14px;">
          <span class="nav-icon" [innerHTML]="logoutIcon()" style="color:var(--danger);"></span>
          <span class="nav-text" *ngIf="!sidebarService.isCollapsed()" style="color:var(--danger);font-weight:700;">Log Out</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="profile-menu" *ngIf="profileOpen()" [class.compact]="sidebarService.isCollapsed()" (click)="$event.stopPropagation()">
          <div class="menu-user">
            <div class="menu-avatar">{{ initials() }}</div>
            <div class="menu-copy">
              <strong>{{ authService.currentUser()?.name || 'User' }}</strong>
              <span>{{ authService.currentUser()?.role | titlecase }}</span>
              <small>{{ authService.currentUser()?.email }}</small>
            </div>
          </div>

          <a [routerLink]="profileRoute()" (click)="profileOpen.set(false)" class="menu-item">
            <span class="menu-icon" [innerHTML]="profileIcon()"></span>
            Profile Settings
          </a>

          <button type="button" (click)="logout()" class="menu-item danger-item">
            <span class="menu-icon" [innerHTML]="logoutIcon()"></span>
            Log Out
          </button>
        </div>

        <button type="button" class="profile-bar" [class.compact]="sidebarService.isCollapsed()" (click)="toggleProfileMenu($event)">
          <span class="profile-avatar">{{ initials() }}</span>
          <span class="profile-copy" *ngIf="!sidebarService.isCollapsed()">
            <strong>{{ authService.currentUser()?.name || 'User' }}</strong>
            <span>{{ authService.currentUser()?.role | titlecase }}</span>
          </span>
          <svg *ngIf="!sidebarService.isCollapsed()" class="profile-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" [style.transform]="profileOpen() ? 'rotate(180deg)' : 'rotate(0deg)'">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
      </div>
    </aside>

    <div *ngIf="sidebarService.isMobileOpen()" class="mobile-overlay" (click)="sidebarService.isMobileOpen.set(false)">
      <div class="mobile-drawer" (click)="$event.stopPropagation()">
        <nav class="mobile-nav" style="display:flex;flex-direction:column;height:100%;">
          <a *ngFor="let item of navItems()"
             [routerLink]="item.route"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: item.exact === true }"
             class="nav-item mobile-link"
             (click)="sidebarService.isMobileOpen.set(false)">
            <span class="nav-icon" [innerHTML]="getIcon(item.label)"></span>
            <span class="nav-text">{{ item.label }}</span>
          </a>

          <!-- Direct Log Out link in mobile drawer -->
          <button type="button" class="nav-item mobile-link" (click)="logout(); sidebarService.isMobileOpen.set(false)" style="width:100%;text-align:left;border:none;cursor:pointer;font-family:inherit;margin-top:auto;display:flex;align-items:center;background:var(--bg-base);padding:0 14px;min-height:48px;border-radius:16px;">
            <span class="nav-icon" [innerHTML]="logoutIcon()" style="color:var(--danger);"></span>
            <span class="nav-text" style="color:var(--danger);font-weight:700;">Log Out</span>
          </button>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-shell {
      width: 248px;
      height: 100%;
      background: linear-gradient(180deg, #fffdf8 0%, #f8f4eb 100%);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: width 0.24s ease;
      padding: 18px 12px 14px;
      overflow: visible;
      position: relative;
      z-index: 25;
    }
    .sidebar-shell.collapsed {
      width: 82px;
      padding: 18px 8px 14px;
    }
    .nav-stack {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
      overflow-y: auto;
      padding-right: 2px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .nav-stack::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
    }
    .sidebar-shell.collapsed .nav-stack {
      align-items: center;
      overflow-y: hidden;
      padding-right: 0;
      gap: 10px;
    }
    .nav-item {
      min-height: 48px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 14px;
      text-decoration: none;
      color: var(--text-secondary);
      position: relative;
      transition: 0.18s ease;
      overflow: visible;
    }
    .nav-item:hover {
      background: var(--bg-surface);
      color: var(--text-primary);
      box-shadow: 0 8px 18px rgba(37, 40, 38, 0.05);
    }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(74, 107, 83, 0.12), rgba(198, 124, 56, 0.12));
      color: var(--text-primary);
      border: 1px solid rgba(74, 107, 83, 0.12);
    }
    .sidebar-shell.collapsed .nav-item {
      width: 52px;
      min-height: 52px;
      justify-content: center;
      padding: 0;
      border-radius: 18px;
    }
    .sidebar-shell.collapsed .nav-item.active {
      background: linear-gradient(135deg, rgba(74, 107, 83, 0.16), rgba(198, 124, 56, 0.12));
      border-color: rgba(74, 107, 83, 0.18);
      box-shadow: 0 10px 18px rgba(37, 40, 38, 0.08);
    }
    .nav-icon,
    .menu-icon {
      width: 18px;
      min-width: 18px;
      height: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #4a6b53;
    }
    .nav-item.active .nav-icon,
    .nav-item:hover .nav-icon {
      color: #35523d;
    }
    .nav-icon svg,
    .menu-icon svg,
    .profile-arrow,
    .mobile-toggle svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
      stroke: currentColor;
      stroke-width: 0;
    }
    .profile-arrow,
    .mobile-toggle svg {
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .nav-text {
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sidebar-footer {
      position: relative;
      padding-top: 12px;
      margin-top: 12px;
      border-top: 1px solid var(--border);
      flex-shrink: 0;
      overflow: visible;
    }
    .profile-bar {
      width: 100%;
      min-height: 58px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 12px;
      cursor: pointer;
      transition: 0.18s ease;
      font-family: inherit;
    }
    .profile-bar:hover {
      background: var(--bg-raised);
    }
    .profile-bar.compact {
      justify-content: center;
      padding: 0;
    }
    .profile-avatar,
    .menu-avatar {
      width: 38px;
      height: 38px;
      border-radius: 14px;
      background: linear-gradient(135deg, #55795d, #42614a);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .profile-copy,
    .menu-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: left;
    }
    .profile-copy strong,
    .menu-copy strong {
      font-size: 13px;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .profile-copy span,
    .menu-copy span,
    .menu-copy small {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .profile-arrow {
      margin-left: auto;
      color: var(--text-muted);
      transition: transform 0.18s ease;
      flex-shrink: 0;
    }
    .profile-menu {
      position: absolute;
      left: 0;
      right: 0;
      bottom: calc(100% + 10px);
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      box-shadow: var(--shadow);
      padding: 12px;
      z-index: 20;
    }
    .profile-menu.compact {
      left: calc(100% + 12px);
      right: auto;
      bottom: 0;
      width: 244px;
    }
    .menu-user {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 4px 2px 12px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 8px;
    }
    .menu-item {
      width: 100%;
      min-height: 44px;
      padding: 0 12px;
      border-radius: 14px;
      text-decoration: none;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.18s ease;
    }
    .menu-item:hover {
      background: var(--bg-raised);
      color: var(--text-primary);
    }
    .danger-item {
      color: var(--danger);
    }
    .danger-item:hover {
      background: rgba(181, 77, 64, 0.08);
    }
    .mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(20, 24, 30, 0.28);
      z-index: 99;
    }
    .mobile-drawer {
      width: 260px;
      height: 100%;
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      padding: 16px 12px;
    }
    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .mobile-link {
      background: var(--bg-base);
    }
    @media (max-width: 1023px) {
      .sidebar-shell { display: none; }
    }
  `]
})
export class SidebarComponent {
  readonly authService = inject(AuthService);
  readonly sidebarService = inject(SidebarService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);

  readonly profileOpen = signal(false);
  readonly navItems = signal<NavItem[]>([]);

  constructor() {
    this.buildNav(this.authService.currentUser()?.role);
  }

  @HostListener('document:click')
  closeProfileMenu(): void {
    this.profileOpen.set(false);
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.profileOpen.update(v => !v);
  }

  initials(): string {
    const name = this.authService.currentUser()?.name || 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name[0].toUpperCase();
  }

  profileRoute(): string {
    const role = this.authService.currentUser()?.role;
    if (role === 'provider') return '/provider/profile';
    if (role === 'admin') return '/admin/profile';
    return '/customer/profile';
  }

  logout(): void {
    this.profileOpen.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  profileIcon(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 20h16v-2c0-2.67-5.33-4-8-4s-8 1.33-8 4z"></path><circle cx="12" cy="8" r="4"></circle></svg>');
  }

  logoutIcon(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5v3H3v4h7z"></path><path d="M17 3H8a2 2 0 0 0-2 2v2h2V5h9v14H8v-2H6v2a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path></svg>');
  }

  private buildNav(role: string | undefined): void {
    const customer: NavItem[] = [
      { label: 'Dashboard', route: '/customer/dashboard', exact: true },
      { label: 'Find Providers', route: '/customer/search', exact: true },
      { label: 'My Bookings', route: '/customer/bookings', exact: true },
      { label: 'Complaints', route: '/customer/complaints', exact: true },
      { label: 'Reviews', route: '/customer/reviews', exact: true }
    ];
    const provider: NavItem[] = [
      { label: 'Dashboard', route: '/provider/dashboard', exact: true },
      { label: 'Job Pipeline', route: '/provider/jobs', exact: true },
      { label: 'Manage Services', route: '/provider/manage-services', exact: true },
      { label: 'Business Profile', route: '/provider/profile', exact: true },
      { label: 'Payments & Payouts', route: '/provider/earnings', exact: true },
      { label: 'KYC Management', route: '/provider/kyc', exact: true },
      { label: 'Portfolio Uploads', route: '/provider/portfolio', exact: true },
      { label: 'Reviews & Feedback', route: '/provider/reviews', exact: true }
    ];
    const admin: NavItem[] = [
      { label: 'Dashboard', route: '/admin/dashboard', exact: true },
      { label: 'KYC Queue', route: '/admin/kyc', exact: true },
      { label: 'Users Directory', route: '/admin/users', exact: true },
      { label: 'Disputes Moderation', route: '/admin/reports', exact: true }
    ];

    if (role === 'provider') this.navItems.set(provider);
    else if (role === 'admin') this.navItems.set(admin);
    else this.navItems.set(customer);
  }

  getIcon(label: string): SafeHtml {
    const map: Record<string, string> = {
      'Dashboard': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="8" rx="1.5"></rect><rect x="14" y="3" width="7" height="5" rx="1.5"></rect><rect x="14" y="12" width="7" height="9" rx="1.5"></rect><rect x="3" y="15" width="7" height="6" rx="1.5"></rect></svg>',
      'Find Providers': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
      'My Bookings': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4M16 3v4M4 10h16M8 14h4M8 17h7"></path></svg>',
      'Complaints': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5M12 16h.01"></path></svg>',
      'Reviews': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.8 5.67 6.25.91-4.52 4.4 1.07 6.22L12 17.27 6.4 20.2l1.07-6.22-4.52-4.4 6.25-.91z"></path></svg>',
      'Job Pipeline': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 6h16v3H4zm0 5h12v3H4zm0 5h16v3H4z"></path></svg>',
      'Manage Services': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m19.14 12.94.04-.94-.04-.94 2.03-1.58-1.92-3.32-2.39.96a7.98 7.98 0 0 0-1.63-.94L14.86 2h-3.72l-.37 2.18c-.58.22-1.13.53-1.63.94l-2.39-.96-1.92 3.32 2.03 1.58-.04.94.04.94-2.03 1.58 1.92 3.32 2.39-.96c.5.4 1.05.72 1.63.94l.37 2.18h3.72l.37-2.18c.58-.22 1.13-.54 1.63-.94l2.39.96 1.92-3.32zM13 15.5A3.5 3.5 0 1 1 13 8.5a3.5 3.5 0 0 1 0 7z"></path></svg>',
      'Business Profile': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 20h16v-2.5c0-2.67-5.33-4-8-4s-8 1.33-8 4zM12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></svg>',
      'Payments & Payouts': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 7H3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zm0 2H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zm-5 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path></svg>',
      'KYC Management': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m12 2 8 4v6c0 5-3.44 9.74-8 11-4.56-1.26-8-6-8-11V6zm-1 13 5-5-1.41-1.41L11 12.17l-1.59-1.58L8 12z"></path></svg>',
      'Portfolio Uploads': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 14-4.5-6-3 4-2-2L5 17z"></path></svg>',
      'Reviews & Feedback': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>',
      'KYC Queue': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m12 2 8 4v6c0 5-3.44 9.74-8 11-4.56-1.26-8-6-8-11V6zm1 12h-2v-2h2zm0-4h-2V7h2z"></path></svg>',
      'Users Directory': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.67 0-8 1.34-8 4v2h14v-2c0-2.66-5.33-4-8-4zm8 0c-.29 0-.62.02-.97.05A5.94 5.94 0 0 1 17 17v2h7v-2c0-2.66-5.33-4-8-4z"></path></svg>',
      'Disputes Moderation': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 7h2v6h-2zm0 8h2v2h-2z"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path></svg>'
    };
    return this.sanitizer.bypassSecurityTrustHtml(map[label] ?? '');
  }
}
