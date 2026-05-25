import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TopnavComponent } from '../../shared/topnav';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [TopnavComponent, FormsModule, NgIf, RouterLink],
  template: `
    <div style="min-height:100vh;background:var(--bg-base);display:flex;flex-direction:column;">
      <app-topnav></app-topnav>

      <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:40px 24px;">
        <div style="width:100%;max-width:420px;">

          <div style="text-align:center;margin-bottom:28px;">
            <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin:0 0 6px;color:var(--text-primary);">Create account</h1>
            <p style="font-size:13px;color:var(--text-secondary);margin:0;">Join Hyperlocal as a customer or partner</p>
          </div>

          <div *ngIf="error()" style="background:rgba(194,77,61,0.08);border:1px solid rgba(194,77,61,0.2);border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:13px;color:var(--danger);">
            {{ error() }}
          </div>

          <!-- Role toggle -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:20px;background:var(--bg-surface);border:1px solid var(--border);border-radius:10px;padding:4px;">
            <button type="button" (click)="role.set('customer')"
              [style.background]="role()==='customer' ? 'var(--bg-overlay)' : 'transparent'"
              [style.color]="role()==='customer' ? 'var(--text-primary)' : 'var(--text-muted)'"
              style="padding:7px;border:none;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:inherit;">
              Customer
            </button>
            <button type="button" (click)="role.set('provider')"
              [style.background]="role()==='provider' ? 'var(--bg-overlay)' : 'transparent'"
              [style.color]="role()==='provider' ? 'var(--text-primary)' : 'var(--text-muted)'"
              style="padding:7px;border:none;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.15s;font-family:inherit;">
              Service Partner
            </button>
          </div>

          <form (ngSubmit)="submit()" style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <div>
                <label style="display:block;font-size:12px;font-weight:500;color:var(--text-secondary);margin-bottom:5px;">Full Name</label>
                <input type="text" [(ngModel)]="name" name="name" required class="input" placeholder="Ramesh Kumar">
              </div>
              <div>
                <label style="display:block;font-size:12px;font-weight:500;color:var(--text-secondary);margin-bottom:5px;">Phone</label>
                <input type="tel" [(ngModel)]="phone" name="phone" required class="input" placeholder="+91 98765 43210">
              </div>
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:500;color:var(--text-secondary);margin-bottom:5px;">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required class="input" placeholder="ramesh@gmail.com">
            </div>

            <div>
              <label style="display:block;font-size:12px;font-weight:500;color:var(--text-secondary);margin-bottom:5px;">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required class="input" placeholder="Min 6 characters">
            </div>

            <div *ngIf="role()==='provider'">
              <label style="display:block;font-size:12px;font-weight:500;color:var(--text-secondary);margin-bottom:5px;">Service Category</label>
              <select [(ngModel)]="category" name="category" class="input">
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="cleaner">Cleaner</option>
                <option value="carpenter">Carpenter</option>
                <option value="ac_technician">AC Technician</option>
                <option value="home_repair">Home Repair</option>
              </select>
            </div>

            <button type="submit" [disabled]="authService.authLoading()" class="btn btn-primary" style="width:100%;margin-top:4px;padding:10px;">
              <span *ngIf="authService.authLoading()" class="spinner" style="width:14px;height:14px;border-width:2px;"></span>
              <span>{{ authService.authLoading() ? 'Creating account…' : 'Create Account' }}</span>
            </button>
          </form>

          <p style="font-size:13px;color:var(--text-muted);text-align:center;margin-top:20px;">
            Already registered? <a routerLink="/login" style="color:var(--accent);text-decoration:none;font-weight:500;">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterPage {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  name = ''; email = ''; password = ''; phone = ''; category = 'electrician';
  readonly role = signal<'customer' | 'provider'>('customer');
  readonly error = signal<string | null>(null);

  constructor() {
    this.route.queryParams.subscribe(p => {
      if (p['role'] === 'provider') this.role.set('provider');
    });
  }

  submit(): void {
    if (!this.name || !this.email || !this.password || !this.phone) return;
    this.error.set(null);
    const payload: any = { name: this.name, email: this.email, password: this.password, phone: this.phone, role: this.role() };
    if (this.role() === 'provider') payload.category = this.category;

    this.authService.register(payload).subscribe({
      next: () => this.router.navigate([this.role() === 'provider' ? '/provider/dashboard' : '/customer/dashboard']),
      error: (err: any) => this.error.set(err.error?.message || 'Registration failed.')
    });
  }
}
