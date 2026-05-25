import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TopnavComponent } from '../../shared/topnav';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [TopnavComponent, FormsModule, NgIf, RouterLink],
  template: `
    <div style="min-height:100vh;background:var(--bg-base);display:flex;flex-direction:column;">
      <app-topnav></app-topnav>

      <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:40px 24px;">
        <div style="width:100%;max-width:380px;">

          <!-- Header -->
          <div style="text-align:center;margin-bottom:32px;">
            <div style="width:40px;height:40px;background:var(--accent);border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.02em;margin:0 0 6px;color:var(--text-primary);">Welcome back</h1>
            <p style="font-size:13px;color:var(--text-secondary);margin:0;">Sign in to your Hyperlocal account</p>
          </div>

          <!-- Error -->
          <div *ngIf="error()" style="background:rgba(194,77,61,0.08);border:1px solid rgba(194,77,61,0.2);border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:13px;color:var(--danger);">
            {{ error() }}
          </div>

          <!-- Form -->
          <form (ngSubmit)="submit()" style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <label style="display:block;font-size:12px;font-weight:500;color:var(--text-secondary);margin-bottom:6px;">Email</label>
              <input type="email" [(ngModel)]="email" name="email" required class="input" placeholder="you@example.com">
            </div>
            <div>
              <label style="display:block;font-size:12px;font-weight:500;color:var(--text-secondary);margin-bottom:6px;">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required class="input" placeholder="••••••••">
            </div>

            <button type="submit" [disabled]="authService.authLoading()" class="btn btn-primary" style="width:100%;margin-top:4px;padding:10px;">
              <span *ngIf="authService.authLoading()" class="spinner" style="width:14px;height:14px;border-width:2px;"></span>
              <span>{{ authService.authLoading() ? 'Signing in…' : 'Sign In' }}</span>
            </button>
          </form>

          <!-- Demo logins -->
          <div style="margin-top:28px;border-top:1px solid var(--border);padding-top:20px;">
            <p style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;text-align:center;margin-bottom:10px;">Quick demo access</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
              <button (click)="demo('alex@gmail.com','alex123')" class="btn btn-ghost btn-sm" style="font-size:11px;">Customer</button>
              <button (click)="demo('david.electric@gmail.com','david123')" class="btn btn-ghost btn-sm" style="font-size:11px;">Provider</button>
              <button (click)="demo('admin@hyperlocal.com','admin123')" class="btn btn-ghost btn-sm" style="font-size:11px;">Admin</button>
            </div>
          </div>

          <p style="font-size:13px;color:var(--text-muted);text-align:center;margin-top:20px;">
            No account? <a routerLink="/register" style="color:var(--accent);text-decoration:none;font-weight:500;">Register</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginPage {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly error = signal<string | null>(null);

  submit(): void {
    if (!this.email || !this.password) return;
    this.error.set(null);
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => this.redirect(res.user.role),
      error: (err: any) => this.error.set(err.error?.message || 'Invalid credentials.')
    });
  }

  demo(email: string, pass: string): void {
    this.email = email; this.password = pass; this.submit();
  }

  private redirect(role: string): void {
    const map: Record<string, string> = { customer: '/customer/dashboard', provider: '/provider/dashboard', admin: '/admin/dashboard' };
    this.router.navigate([map[role] ?? '/']);
  }
}
