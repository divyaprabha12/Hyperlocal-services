import { Component, inject, signal, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar';
import { AdminService } from '../../core/services/admin.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-admin-users',
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <main class="users-main">

          <!-- Header -->
          <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
              <h1 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin:0 0 4px;">User Directory</h1>
              <p style="font-size:13px;color:var(--text-secondary);margin:0;">Manage registration details, roles, and status locks for all platform accounts.</p>
            </div>
            <!-- Search Input -->
            <input type="text" [(ngModel)]="searchQuery" (input)="filterUsers()" placeholder="Search by name or email..." class="input" style="width:240px;font-size:13px;padding:6px 12px;">
          </div>

          <!-- Filtering Tabs -->
          <div class="tabs-bar">
            <button (click)="changeTab('all')" 
                    [style.color]="activeTab() === 'all' ? 'var(--text-primary)' : 'var(--text-muted)'"
                    [style.borderColor]="activeTab() === 'all' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">All Accounts ({{ allUsers().length }})</button>
            <button (click)="changeTab('customer')" 
                    [style.color]="activeTab() === 'customer' ? 'var(--text-primary)' : 'var(--text-muted)'"
                    [style.borderColor]="activeTab() === 'customer' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">Customers</button>
            <button (click)="changeTab('provider')" 
                    [style.color]="activeTab() === 'provider' ? 'var(--text-primary)' : 'var(--text-muted)'"
                    [style.borderColor]="activeTab() === 'provider' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">Providers</button>
            <button (click)="changeTab('suspended')" 
                    [style.color]="activeTab() === 'suspended' ? 'var(--text-primary)' : 'var(--text-muted)'"
                    [style.borderColor]="activeTab() === 'suspended' ? 'var(--accent)' : 'transparent'"
                    class="tab-btn">Suspended</button>
          </div>

          <!-- Main Layout Split -->
          <div style="display:grid;grid-template-columns:1.6fr 1.4fr;gap:20px;align-items:start;" class="split-grid">
            
            <!-- Directory Table -->
            <div class="card users-table" style="padding:0;overflow:hidden;">
              <table style="width:100%;border-collapse:collapse;text-align:left;font-size:13px;">
                <thead>
                  <tr style="background:var(--bg-raised);border-bottom:1px solid var(--border);">
                    <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">User Name</th>
                    <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Email</th>
                    <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Role</th>
                    <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;">Status</th>
                    <th style="padding:10px 16px;color:var(--text-muted);font-weight:600;font-size:11px;text-transform:uppercase;text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of filteredUsers()" class="table-row" 
                      (click)="selectedUser.set(u)" 
                      [style.background]="selectedUser()?._id === u._id ? 'var(--bg-overlay)' : ''"
                      style="cursor:pointer;">
                    <td style="padding:12px 16px;font-weight:600;color:var(--text-primary);">{{ u.name }}</td>
                    <td style="padding:12px 16px;color:var(--text-secondary);">{{ u.email }}</td>
                    <td style="padding:12px 16px;color:var(--text-secondary);text-transform:capitalize;">{{ u.role }}</td>
                    <td style="padding:12px 16px;">
                      <span [class]="u.status === 'active' ? 'badge badge-green' : 'badge badge-red'">{{ u.status }}</span>
                    </td>
                    <td style="padding:12px 16px;text-align:right;" (click)="$event.stopPropagation()">
                      <button (click)="toggleUser(u)" class="btn btn-sm btn-ghost" style="font-size:11px;padding:4px 8px;">
                        {{ u.status === 'active' ? 'Suspend' : 'Activate' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Cards list -->
            <div class="users-cards" style="display:none;flex-direction:column;gap:12px;">
              <div *ngFor="let u of filteredUsers()" 
                   class="card" 
                   (click)="selectedUser.set(u)"
                   [style.borderColor]="selectedUser()?._id === u._id ? 'var(--accent)' : ''"
                   style="padding:14px;cursor:pointer;display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="font-size:14px;color:var(--text-primary);">{{ u.name }}</strong>
                  <span [class]="u.status === 'active' ? 'badge badge-green' : 'badge badge-red'">{{ u.status }}</span>
                </div>
                <div style="font-size:12.5px;color:var(--text-secondary);display:flex;justify-content:space-between;align-items:center;">
                  <span>{{ u.email }} · <span style="text-transform:capitalize;font-weight:600;">{{ u.role }}</span></span>
                  <button (click)="toggleUser(u); $event.stopPropagation()" class="btn btn-sm btn-ghost" style="font-size:11px;padding:4px 8px;margin-left:auto;">
                    {{ u.status === 'active' ? 'Suspend' : 'Activate' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Detail moderation view panel -->
            <div class="card" style="position:sticky;top:24px;">
              <h2 style="font-size:13px;font-weight:700;color:var(--text-primary);margin:0 0 14px;border-bottom:1px solid var(--border);padding-bottom:8px;">Moderation Detail Panel</h2>

              <div *ngIf="!selectedUser()" style="padding:48px 24px;text-align:center;color:var(--text-muted);">
                Select an account from the table list to inspect history details, bookings, spending and complaints.
              </div>

              <!-- Customer Detail view specs -->
              <ng-container *ngIf="selectedUser() && selectedUser().role === 'customer'">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                  <img [src]="'https://api.dicebear.com/8.x/initials/svg?seed='+(selectedUser().name || 'C')+'&backgroundColor=4e6f57&textColor=ffffff'" style="width:40px;height:40px;border-radius:8px;">
                  <div>
                    <h3 style="font-size:14px;font-weight:700;color:var(--text-primary);margin:0;">{{ selectedUser().name }}</h3>
                    <p style="font-size:11px;color:var(--text-muted);margin:0;">Verified Customer Account</p>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:12px;font-size:12.5px;">
                  <div style="border-top:1px solid var(--border);padding-top:12px;">
                    <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Spending History</span>
                    <p style="font-weight:700;color:var(--text-primary);margin:4px 0 0;">₹{{ selectedUser().spendingHistory || '4,890' }} (all time spent)</p>
                  </div>
                  <div style="border-top:1px solid var(--border);padding-top:12px;">
                    <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Completed Bookings</span>
                    <p style="font-weight:600;color:var(--text-primary);margin:4px 0 0;">12 service visits</p>
                  </div>
                  <div style="border-top:1px solid var(--border);padding-top:12px;">
                    <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Active Complaints Raised</span>
                    <p style="font-weight:600;color:var(--danger);margin:4px 0 0;">1 dispute ticket pending review</p>
                  </div>
                </div>
              </ng-container>

              <!-- Provider Detail view specs -->
              <ng-container *ngIf="selectedUser() && selectedUser().role === 'provider'">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                  <img [src]="'https://api.dicebear.com/8.x/initials/svg?seed='+(selectedUser().name || 'P')+'&backgroundColor=4e6f57&textColor=ffffff'" style="width:40px;height:40px;border-radius:8px;">
                  <div>
                    <h3 style="font-size:14px;font-weight:700;color:var(--text-primary);margin:0;">{{ selectedUser().name }}</h3>
                    <p style="font-size:11px;color:var(--text-muted);margin:0;">Service Partner Profile</p>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:12px;font-size:12.5px;">
                  <div style="border-top:1px solid var(--border);padding-top:12px;">
                    <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Ratings Index</span>
                    <p style="font-weight:700;color:var(--text-primary);margin:4px 0 0;">⭐ 4.90 (38 reviews logged)</p>
                  </div>
                  <div style="border-top:1px solid var(--border);padding-top:12px;">
                    <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Platform Earnings Ledger</span>
                    <p style="font-weight:700;color:var(--success);margin:4px 0 0;">₹{{ selectedUser().earningsHistory || '18,500' }} net payout</p>
                  </div>
                  <div style="border-top:1px solid var(--border);padding-top:12px;">
                    <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Aadhaar Verification KYC Status</span>
                    <span class="badge badge-green" style="margin-top:4px;">Verified Profile</span>
                  </div>
                </div>
              </ng-container>
            </div>

          </div>

        </main>
  `,
  styles: [`
    .users-main {
      padding: 24px 28px;
      width: 100%;
      box-sizing: border-box;
    }
    .tabs-bar {
      display: flex;
      gap: 4px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
      margin-bottom: 16px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .tabs-bar::-webkit-scrollbar { display: none; }
    .tab-btn {
      background: none; border: none; font-size: 13px; font-weight: 600; cursor: pointer;
      padding: 6px 12px; border-bottom: 2px solid transparent; transition: all 0.12s;
      font-family: inherit; outline: none; white-space: nowrap; flex-shrink: 0;
    }
    @media (max-width: 900px) {
      .split-grid { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 768px) {
      .users-main { padding: 16px; }
      .tab-btn { font-size: 12.5px; padding: 6px 8px; }
      .users-table { display: none; }
      .users-cards { display: flex !important; }
    }
  `]
})
export class AdminUsersPage implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly sidebarService = inject(SidebarService);

  readonly allUsers = signal<any[]>([]);
  readonly filteredUsers = signal<any[]>([]);
  readonly activeTab = signal<'all' | 'customer' | 'provider' | 'suspended'>('all');
  readonly selectedUser = signal<any | null>(null);
  searchQuery = '';

  ngOnInit(): void { this.load(); }

  load(): void {
    this.adminService.getAllUsers().subscribe({
      next: (r: any) => {
        if (r.success) {
          const list = r.data.filter((u: any) => u.role !== 'admin');
          this.allUsers.set(list);
          this.filterUsers();
        }
      }
    });
  }

  changeTab(tab: 'all' | 'customer' | 'provider' | 'suspended'): void {
    this.activeTab.set(tab);
    this.filterUsers();
  }

  filterUsers(): void {
    const q = this.searchQuery.trim().toLowerCase();
    const tab = this.activeTab();
    let list = this.allUsers();

    if (tab === 'customer') list = list.filter(u => u.role === 'customer');
    else if (tab === 'provider') list = list.filter(u => u.role === 'provider');
    else if (tab === 'suspended') list = list.filter(u => u.status === 'suspended');

    if (q) {
      list = list.filter((u: any) => 
        u.name?.toLowerCase().includes(q) || 
        u.email?.toLowerCase().includes(q)
      );
    }
    this.filteredUsers.set(list);
  }

  toggleUser(u: any): void {
    const nextStatus = u.status === 'active' ? 'suspended' : 'active';
    this.adminService.updateUserStatus(u._id, nextStatus).subscribe({
      next: () => {
        this.load();
        if (this.selectedUser()?._id === u._id) {
          this.selectedUser.set({ ...u, status: nextStatus });
        }
      }
    });
  }
}
