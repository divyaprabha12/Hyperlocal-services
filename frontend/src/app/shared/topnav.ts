import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-topnav',
  imports: [RouterLink, NgIf],
  template: `
    <header class="public-topnav">
      <div class="topnav-inner">
        <a routerLink="/" class="topnav-brand">
          <span class="topnav-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </span>
          <span class="topnav-copy">
            <strong>Hyperlocal</strong>
            <small>Premium Home Services</small>
          </span>
        </a>

        <nav class="topnav-links">
          <button type="button" class="nav-link nav-button" (click)="goToSection('top')">Home</button>
          <button type="button" class="nav-link nav-button" (click)="goToSection('services')">Services</button>
          <button type="button" class="nav-link nav-button" (click)="goAbout()">About</button>
        </nav>

        <div class="topnav-actions">
          <ng-container *ngIf="!auth.isAuthenticated()">
            <a routerLink="/login" class="btn btn-ghost btn-sm">Sign In</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Get Started</a>
          </ng-container>
          <ng-container *ngIf="auth.isAuthenticated()">
            <button type="button" class="btn btn-primary btn-sm" (click)="goDashboard()">Dashboard</button>
          </ng-container>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .public-topnav {
      position: sticky;
      top: 0;
      z-index: 60;
      background: rgba(250, 247, 241, 0.9);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(230, 226, 216, 0.9);
    }
    .topnav-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .topnav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      flex-shrink: 0;
    }
    .topnav-logo {
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
    .topnav-logo svg {
      width: 18px;
      height: 18px;
      stroke: #fff;
      fill: none;
      stroke-width: 2.3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .topnav-copy {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .topnav-copy strong {
      font-size: 21px;
      color: var(--text-primary);
      letter-spacing: -0.04em;
    }
    .topnav-copy small {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 800;
    }
    .topnav-links {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      flex: 1;
      
    }
    .nav-link {
      min-height: 38px;
      padding: 0 14px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #345a3e;
      text-decoration: none;
      font-size: 16px;
      font-weight: 800;
      transition: 0.18s ease;
    }
    .nav-button {
      border: none;
      background: transparent;
      font-family: inherit;
      cursor: pointer;
    }
    .nav-link:hover {
      background: rgba(255,255,255,0.68);
      color: var(--text-primary);
      box-shadow: 0 10px 18px rgba(37, 40, 38, 0.06);
    }
    .topnav-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
    }
    @media (max-width: 820px) {
      .topnav-inner {
        flex-wrap: wrap;
        justify-content: center;
      }
      .topnav-links {
        order: 3;
        width: 100%;
      }
    }
  `]
})
export class TopnavComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  goDashboard(): void {
    const role = this.auth.currentUser()?.role;
    const routes: Record<string, string> = {
      provider: '/provider/dashboard',
      admin: '/admin/dashboard',
      customer: '/customer/dashboard'
    };
    this.router.navigate([routes[role ?? ''] ?? '/customer/dashboard']);
  }

  goToSection(fragment: string): void {
    this.router.navigate(['/'], { fragment });
  }

  goAbout(): void {
    this.router.navigate(['/about']);
  }
}
