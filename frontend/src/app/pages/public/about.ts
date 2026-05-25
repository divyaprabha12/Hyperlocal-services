import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopnavComponent } from '../../shared/topnav';
import { FooterComponent } from '../../shared/footer';
import { NgFor } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { inject } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [TopnavComponent, FooterComponent, RouterLink, NgFor],
  template: `
    <div class="about-shell">
      <app-topnav></app-topnav>

      <main class="about-main">
        <header class="about-hero">
          <span class="hero-kicker">About Hyperlocal</span>
          <h3>Trusted local services with a cleaner, safer booking experience.</h3>
          <p>
            We connect homeowners with verified professionals through transparent pricing,
            real-time coordination, and completion controls that keep every booking accountable.
          </p>
        </header>

        <section class="pillars-grid">
          <article *ngFor="let pillar of pillars; let i = index" class="pillar-card" [style.animationDelay]="(i * 90) + 'ms'">
            <div class="pillar-top">
              <div class="pillar-icon" [innerHTML]="pillar.icon"></div>
              <h2>{{ pillar.title }}</h2>
            </div>
            <p>{{ pillar.desc }}</p>
          </article>
        </section>

        <section class="about-cta">
          <div class="cta-card">
            <p>Ready to experience the difference?</p>
            <div class="cta-actions">
              <a routerLink="/register" class="btn btn-primary">Get Started</a>
              <a routerLink="/categories" class="btn btn-ghost">Browse Services</a>
            </div>
          </div>
        </section>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .about-shell {
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(223, 113, 85, 0.06), transparent 24%),
        linear-gradient(180deg, #faf7f1 0%, #f6f1e8 100%);
    }
    .about-main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 34px 24px 64px;
    }
    .about-hero {
      max-width: 760px;
      margin-bottom: 28px;
      animation: fadeRise 0.65s ease both;
    }
    .hero-kicker {
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      padding: 0 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.72);
      border: 1px solid rgba(230, 226, 216, 0.9);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 16px;
    }
    .about-hero h3 {
      font-weight: 700;
      margin: 0 0 12px;
      font-size: clamp(34px, 4vw, 52px);
      line-height: 1.04;
      letter-spacing: -0.045em;
      color: var(--text-primary);
    }
    .about-hero p {
      margin: 0;
      font-size: 16px;
      line-height: 1.75;
      color: var(--text-secondary);
      max-width: 700px;
    }
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      margin-bottom: 36px;
    }
    .pillar-card {
      padding: 26px 28px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.82);
      border: 1px solid rgba(230, 226, 216, 0.92);
      box-shadow: 0 18px 36px rgba(37, 40, 38, 0.05);
      transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
      animation: fadeRise 0.65s ease both;
    }
    .pillar-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 42px rgba(37, 40, 38, 0.09);
      border-color: rgba(74, 107, 83, 0.2);
    }
    .pillar-top {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }
    .pillar-icon {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      background: #ffffff;
      color: #4a6b53;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.22s ease, background 0.22s ease;
    }
    .pillar-card:hover .pillar-icon {
      transform: scale(1.06) rotate(-4deg);
      background: rgba(74, 107, 83, 0.06);
      border-color: rgba(74, 107, 83, 0.3);
    }
    .pillar-icon :is(svg) {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.9;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .pillar-card h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.2;
      color: #2e4835;
      letter-spacing: -0.02em;
    }
    .pillar-card p {
      margin: 0;
      font-size: 14px;
      line-height: 1.8;
      color: var(--text-secondary);
    }
    .about-cta {
      animation: fadeRise 0.75s ease both;
    }
    .cta-card {
      padding: 28px;
      border-radius: 28px;
      background: linear-gradient(135deg, #fffefb, #f6efe4);
      border: 1px solid rgba(230, 226, 216, 0.9);
      box-shadow: 0 18px 36px rgba(37, 40, 38, 0.05);
      text-align: center;
    }
    .cta-card p {
      margin: 0 0 16px;
      font-size: 16px;
      color: var(--text-secondary);
    }
    .cta-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
    @keyframes fadeRise {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (max-width: 820px) {
      .pillars-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 720px) {
      .about-main {
        padding: 26px 16px 52px;
      }
      .pillar-card,
      .cta-card {
        padding: 22px;
      }
    }
  `]
})
export class AboutPage {
  private readonly sanitizer = inject(DomSanitizer);

  pillars = [
    {
      title: 'Verified professionals only',
      icon: this.svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
      desc: 'Every provider on Hyperlocal completes government ID verification, background screening, and skill evaluation before going live on the platform.'
    },
    {
      title: 'Real-time GPS tracking',
      icon: this.svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'),
      desc: 'Track your assigned professional the moment a booking is accepted, so arrival feels predictable instead of uncertain.'
    },
    {
      title: 'OTP-secured job completion',
      icon: this.svg('<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
      desc: 'Every booking closes with a secure completion code, giving customers control before a job is marked finished and payment is released.'
    },
    {
      title: 'Transparent pricing',
      icon: this.svg('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
      desc: 'Base rates and booking charges stay visible upfront, so there are fewer surprises and clearer expectations before work begins.'
    }
  ];

  private svg(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4a6b53" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`
    );
  }
}
