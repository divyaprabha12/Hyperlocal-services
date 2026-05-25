import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a routerLink="/" class="brand-link">
            <span class="footer-logo">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </span>
            <span class="brand-copy">
              <strong>Hyperlocal</strong>
              <small>Premium Home Services</small>
            </span>
          </a>
          <p>Verified home professionals, clear pricing, live tracking, and OTP-secured completion for a more reliable local service experience.</p>
        </div>

        <div class="footer-columns">
          <div>
            <h4>Platform</h4>
            <button type="button" (click)="goToSection('top')">Home</button>
            <button type="button" (click)="goToSection('services')">Services</button>
            <button type="button" (click)="goToSection('how')">How it works</button>
            <button type="button" (click)="goAbout()">About</button>
          </div>

          <div>
            <h4>Categories</h4>
            <button type="button" (click)="searchCat('electrician')">Electrician</button>
            <button type="button" (click)="searchCat('plumber')">Plumber</button>
            <button type="button" (click)="searchCat('cleaner')">Cleaner</button>
            <button type="button" (click)="searchCat('ac_technician')">AC Service</button>
          </div>

          <div>
            <h4>Contact</h4>
            <a href="mailto:support@hyperlocal.in">support@hyperlocal.in</a>
            <a href="tel:+918067890123">+91 80 6789 0123</a>
            <span>Bangalore · Chennai · Hyderabad</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 Hyperlocal Services Private Limited.</span>
        <div class="footer-legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      margin-top: 32px;
      padding: 34px 24px 22px;
      background: linear-gradient(180deg, #fffefb, #f5efe6);
      border-top: 1px solid rgba(230, 226, 216, 0.9);
    }
    .footer-inner {
      max-width: 1220px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 28px;
      align-items: start;
    }
    .brand-link {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      margin-bottom: 16px;
    }
    .footer-logo {
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
    .footer-logo svg {
      width: 16px;
      height: 16px;
      stroke: #fff;
      fill: none;
      stroke-width: 2.3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .brand-copy {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .brand-copy strong {
      font-size: 19px;
      color: var(--text-primary);
      letter-spacing: -0.03em;
    }
    .brand-copy small {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 800;
    }
    .footer-brand p {
      margin: 0;
      max-width: 420px;
      color: var(--text-secondary);
      font-size: 13px;
      line-height: 1.7;
    }
    .footer-columns {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    .footer-columns h4 {
      margin: 0 0 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
    }
    .footer-columns a,
    .footer-columns button,
    .footer-columns span {
      display: block;
      margin-bottom: 10px;
      font-size: 13px;
      color: var(--text-secondary);
      text-decoration: none;
      background: none;
      border: none;
      padding: 0;
      text-align: left;
      font-family: inherit;
      cursor: pointer;
    }
    .footer-columns a:hover,
    .footer-columns button:hover {
      color: var(--accent);
    }
    .footer-bottom {
      max-width: 1220px;
      margin: 24px auto 0;
      padding-top: 18px;
      border-top: 1px solid rgba(230, 226, 216, 0.9);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      font-size: 12px;
      color: var(--text-muted);
    }
    .footer-legal {
      display: flex;
      gap: 14px;
    }
    .footer-legal a {
      color: var(--text-muted);
      text-decoration: none;
    }
    .footer-legal a:hover {
      color: var(--accent);
    }
    @media (max-width: 860px) {
      .footer-inner,
      .footer-columns {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {
  private readonly router = inject(Router);

  goToSection(fragment: string): void {
    this.router.navigate(['/'], { fragment });
  }

  goAbout(): void {
    this.router.navigate(['/about']);
  }

  searchCat(cat: string): void {
    this.router.navigate(['/customer/search'], { queryParams: { cat } });
  }
}
