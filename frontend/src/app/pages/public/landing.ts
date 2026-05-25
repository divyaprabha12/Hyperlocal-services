import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer';
import { TopnavComponent } from '../../shared/topnav';

@Component({
  selector: 'app-landing',
  imports: [TopnavComponent, FooterComponent, RouterLink, NgFor],
  template: `
    <div class="landing-shell" id="top">
      <app-topnav></app-topnav>

      <section class="hero-section">
        <div class="hero-bg-orb orb-one"></div>
        <div class="hero-bg-orb orb-two"></div>

        <div class="hero-inner">
          <div class="hero-copy">
            <div class="eyebrow">Premium home services network</div>
            <h1>Book verified home professionals with a polished, concierge-style experience.</h1>
            <p>
              Hyperlocal combines rich provider profiles, live tracking, and OTP-secured completion into one premium service journey for modern households.
            </p>

            <div class="hero-actions">
              <a routerLink="/categories" class="btn btn-primary btn-lg">Explore Services</a>
              <a routerLink="/register" [queryParams]="{ role: 'provider' }" class="btn btn-ghost btn-lg">Join as Provider</a>
            </div>

            <div class="hero-stats">
              <div *ngFor="let s of stats" class="hero-stat">
                <strong>{{ s.value }}</strong>
                <span>{{ s.label }}</span>
              </div>
            </div>
          </div>

          <div class="hero-showcase">
            <div class="showcase-card primary-card">
              <div class="card-kicker">Live booking intelligence</div>
              <h3>Trusted service in a few taps</h3>
              <p>Compare ratings, response time, completion history, and transparent hourly pricing before you book.</p>
              <div class="mini-list">
                <div class="mini-row" *ngFor="let provider of topProviders">
                  <span class="mini-avatar">{{ provider.emoji }}</span>
                  <div>
                    <strong>{{ provider.name }}</strong>
                    <span>{{ provider.cat.replace('_', ' ') }} · {{ provider.dist }} km</span>
                  </div>
                  <b>₹{{ provider.rate }}/hr</b>
                </div>
              </div>
            </div>

            <div class="showcase-card floating-card">
              <div class="card-kicker">Why it feels premium</div>
              <div class="feature-pill" *ngFor="let feature of features">
                <span></span>
                <div>
                  <strong>{{ feature.title }}</strong>
                  <small>{{ feature.desc }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="category-section" id="services">
        <div class="section-head">
          <div>
            <span class="section-kicker">Popular categories</span>
            <h2>High-demand services curated for fast booking.</h2>
          </div>
          <a routerLink="/categories" class="section-link">View all services</a>
        </div>

        <div class="category-grid">
          <button *ngFor="let c of categories" type="button" class="category-card" (click)="goCategory(c.id)">
            <div class="category-icon">{{ c.emoji }}</div>
            <strong>{{ c.name }}</strong>
            <span>From ₹{{ c.from }}/hr</span>
          </button>
        </div>
      </section>

      <section class="experience-strip" id="how">
        <div class="experience-inner">
          <div class="section-head compact">
            <div>
              <span class="section-kicker">How it works</span>
              <h2>A cleaner flow from search to secure completion.</h2>
            </div>
          </div>

          <div class="steps-grid">
            <div *ngFor="let step of steps; let i = index" class="step-card">
              <div class="step-index">0{{ i + 1 }}</div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="testimonial-section">
        <div class="section-head">
          <div>
            <span class="section-kicker">Customer reviews</span>
            <h2>Premium service should feel effortless and accountable.</h2>
          </div>
        </div>

        <div class="testimonial-grid">
          <div *ngFor="let t of testimonials" class="testimonial-card">
            <div class="testimonial-top">
              <span class="testimonial-avatar">{{ t.initials }}</span>
              <div>
                <strong>{{ t.name }}</strong>
                <span>{{ t.city }}</span>
              </div>
              <b>5.0</b>
            </div>
            <p>"{{ t.comment }}"</p>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="cta-card">
          <span class="section-kicker">For professionals</span>
          <h2>Present your business with a stronger profile and a steadier pipeline.</h2>
          <p>Join the verified partner network and turn your storefront, ratings, and compliance profile into a premium customer-facing presence.</p>
          <div class="hero-actions center">
            <a routerLink="/register" [queryParams]="{ role: 'provider' }" class="btn btn-primary btn-lg">Join as Provider</a>
            <a routerLink="/about" class="btn btn-ghost btn-lg">Learn More</a>
          </div>
        </div>
      </section>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .landing-shell {
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(223, 113, 85, 0.08), transparent 28%),
        linear-gradient(180deg, #faf7f1 0%, #f6f1e8 100%);
      color: var(--text-primary);
    }
    .hero-section,
    .category-section,
    .testimonial-section,
    .cta-section {
      max-width: 1220px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
    }
    .hero-section {
      padding-top: 52px;
      padding-bottom: 72px;
      overflow: hidden;
    }
    .hero-inner {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(420px, 0.92fr);
      gap: 34px;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    .hero-copy {
      animation: fadeRise 0.7s ease both;
    }
    .eyebrow,
    .section-kicker,
    .card-kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 34px;
      padding: 0 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(230, 226, 216, 0.9);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 800;
      margin-bottom: 16px;
    }
    .hero-copy h1 {
      margin: 0 0 14px;
      font-size: clamp(32px, 4.4vw, 40px);
      line-height: 1.03;
      letter-spacing: -0.045em;
      max-width: 680px;
      font-weight: 700;     
      text-wrap: balance;
    }
    .hero-copy p {
      margin: 0 0 22px;
      font-size: 15px;
      line-height: 1.8;
      color: var(--text-secondary);
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 28px;
    }
    .hero-actions.center {
      justify-content: center;
    }
    .hero-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      max-width: 720px;
    }
    .hero-stat {
      padding: 16px 18px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(230, 226, 216, 0.9);
      backdrop-filter: blur(10px);
      animation: fadeRise 0.8s ease both;
    }
    .hero-stat strong {
      display: block;
      margin-bottom: 4px;
      font-size: 22px;
      letter-spacing: -0.03em;
    }
    .hero-stat span {
      color: var(--text-muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
    }
    .hero-showcase {
      position: relative;
      min-height: 540px;
      animation: fadeRise 0.9s ease both;
    }
    .showcase-card {
      border-radius: 28px;
      border: 1px solid rgba(230, 226, 216, 0.9);
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(18px);
      box-shadow: 0 24px 48px rgba(37, 40, 38, 0.08);
    }
    .primary-card {
      padding: 24px;
      position: absolute;
      inset: 18px 0 0 18px;
    }
    .primary-card h3 {
      margin: 0 0 8px;
      font-size: 26px;
      letter-spacing: -0.03em;
    }
    .primary-card p {
      margin: 0 0 18px;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.7;
      max-width: 420px;
    }
    .mini-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .mini-row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 14px 16px;
      border-radius: 18px;
      background: linear-gradient(135deg, #fffefb, #f7f1e8);
      border: 1px solid rgba(230, 226, 216, 0.9);
    }
    .mini-avatar {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: rgba(74, 107, 83, 0.12);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .mini-row strong,
    .feature-pill strong,
    .testimonial-top strong {
      display: block;
      color: var(--text-primary);
    }
    .mini-row span,
    .feature-pill small,
    .testimonial-top span {
      color: var(--text-muted);
      font-size: 12px;
    }
    .mini-row b {
      color: var(--accent);
      font-size: 13px;
    }
    .floating-card {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 292px;
      padding: 18px;
      animation: floatCard 5s ease-in-out infinite;
    }
    .feature-pill {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(230, 226, 216, 0.9);
    }
    .feature-pill:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .feature-pill span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--warning));
      margin-top: 5px;
      flex-shrink: 0;
    }
    .hero-bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(12px);
      opacity: 0.45;
      pointer-events: none;
      animation: orbit 12s ease-in-out infinite;
    }
    .orb-one {
      width: 260px;
      height: 260px;
      background: rgba(223, 113, 85, 0.16);
      top: 24px;
      right: 12%;
    }
    .orb-two {
      width: 220px;
      height: 220px;
      background: rgba(74, 107, 83, 0.14);
      bottom: 40px;
      left: 48%;
      animation-delay: -4s;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 20px;
      margin-bottom: 24px;
    }
    .section-head.compact {
      margin-bottom: 18px;
    }
    .section-head h2,
    .cta-card h2 {
      margin: 0;
      font-size: clamp(24px, 3vw, 35px);
      font-weight: 700;
      line-height: 1.08;
      letter-spacing: -0.04em;
      max-width: 700px;
    }
    .section-link {
      color: var(--accent);
      text-decoration: none;
      font-weight: 700;
      font-size: 13px;
    }
    .category-section {
      padding-bottom: 70px;
      scroll-margin-top: 96px;
    }
    .category-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 14px;
    }
    .category-card {
      text-align: left;
      border: 1px solid rgba(230, 226, 216, 0.9);
      background: rgba(255, 255, 255, 0.74);
      border-radius: 22px;
      padding: 18px;
      cursor: pointer;
      transition: 0.22s ease;
      font-family: inherit;
    }
    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 30px rgba(37, 40, 38, 0.08);
      background: #fff;
    }
    .category-icon {
      width: 52px;
      height: 52px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(74, 107, 83, 0.12), rgba(198, 124, 56, 0.14));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 16px;
    }
    .category-card strong {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      color: var(--text-primary);
    }
    .category-card span {
      font-size: 12px;
      color: var(--text-muted);
    }
    .experience-strip {
      padding: 26px 24px 74px;
      scroll-margin-top: 96px;
    }
    .experience-inner {
      max-width: 1220px;
      margin: 0 auto;
      background: linear-gradient(135deg, #314939, #24352a 72%);
      border-radius: 32px;
      padding: 28px;
      position: relative;
      overflow: hidden;
    }
    .experience-inner::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, rgba(255,255,255,0.14), transparent 32%);
      pointer-events: none;
    }
    .experience-inner .section-kicker,
    .experience-inner h2,
    .step-card h3,
    .step-card p {
      position: relative;
      z-index: 1;
    }
    .experience-inner .section-kicker {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.1);
      color: #d6e6d8;
    }
    .experience-inner h2 {
      color: #fff8ef;
      max-width: 560px;
    }
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
    .step-card {
      padding: 18px;
      border-radius: 22px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(8px);
      animation: fadeRise 0.7s ease both;
    }
    .step-index {
      width: 44px;
      height: 44px;
      border-radius: 16px;
      background: rgba(255,255,255,0.14);
      color: #fff8ef;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      margin-bottom: 16px;
    }
    .step-card h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: #fff8ef;
    }
    .step-card p {
      margin: 0;
      font-size: 13px;
      line-height: 1.65;
      color: rgba(255, 248, 239, 0.76);
    }
    .testimonial-section {
      padding-bottom: 72px;
    }
    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    .testimonial-card {
      padding: 20px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.74);
      border: 1px solid rgba(230, 226, 216, 0.9);
      box-shadow: 0 14px 28px rgba(37, 40, 38, 0.05);
    }
    .testimonial-top {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 14px;
    }
    .testimonial-avatar {
      width: 42px;
      height: 42px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(74, 107, 83, 0.12), rgba(198, 124, 56, 0.14));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
      font-weight: 800;
    }
    .testimonial-top b {
      color: var(--warning);
      font-size: 13px;
    }
    .testimonial-card p {
      margin: 0;
      font-size: 13px;
      line-height: 1.8;
      color: var(--text-secondary);
    }
    .cta-section {
      padding-bottom: 72px;
    }
    .cta-card {
      padding: 34px;
      border-radius: 32px;
      background: linear-gradient(135deg, #fffefb, #f6efe4);
      border: 1px solid rgba(230, 226, 216, 0.9);
      text-align: center;
      box-shadow: 0 20px 40px rgba(37, 40, 38, 0.06);
    }
    .cta-card p {
      max-width: 700px;
      margin: 14px auto 24px;
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.75;
    }
    @keyframes fadeRise {
      from {
        opacity: 0;
        transform: translateY(18px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes floatCard {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes orbit {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      50% { transform: translate3d(12px, -18px, 0) scale(1.06); }
    }
    @media (max-width: 1080px) {
      .hero-inner,
      .category-grid,
      .steps-grid,
      .testimonial-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .hero-showcase {
        min-height: auto;
      }
      .primary-card,
      .floating-card {
        position: relative;
        inset: auto;
        width: auto;
      }
      .hero-showcase {
        display: grid;
        gap: 16px;
      }
    }
    @media (max-width: 720px) {
      .hero-section,
      .category-section,
      .testimonial-section,
      .cta-section {
        padding-inline: 16px;
      }
      .hero-inner,
      .hero-stats,
      .category-grid,
      .steps-grid,
      .testimonial-grid {
        grid-template-columns: 1fr;
      }
      .hero-copy h1 {
        max-width: 100%;
      }
      .section-head {
        align-items: start;
        flex-direction: column;
      }
      .experience-strip {
        padding-inline: 16px;
      }
      .experience-inner,
      .cta-card {
        padding: 22px;
      }
    }
  `]
})
export class LandingPage {
  readonly router = inject(Router);

  stats = [
    { value: '12,500+', label: 'jobs completed' },
    { value: '350+', label: 'verified providers' },
    { value: '4.8', label: 'average rating' },
    { value: '<20 min', label: 'average response' }
  ];

  categories = [
    { id: 'electrician', name: 'Electrician', from: 250, emoji: '⚡' },
    { id: 'plumber', name: 'Plumber', from: 150, emoji: '🔧' },
    { id: 'cleaner', name: 'Cleaner', from: 300, emoji: '🧹' },
    { id: 'carpenter', name: 'Carpenter', from: 300, emoji: '🪚' },
    { id: 'painter', name: 'Painter', from: 500, emoji: '🎨' },
    { id: 'ac_technician', name: 'AC Service', from: 350, emoji: '❄️' },
    { id: 'home_repair', name: 'Home Repair', from: 120, emoji: '🏠' },
    { id: 'pest_control', name: 'Pest Control', from: 400, emoji: '🐜' },
    { id: 'water_tank', name: 'Water Tank', from: 200, emoji: '🚿' },
    { id: 'cctv', name: 'CCTV / Security', from: 500, emoji: '📷' }
  ];

  steps = [
    { title: 'Search and compare', desc: 'Browse verified professionals by specialty, price, distance, and quality signals before booking.' },
    { title: 'Book in seconds', desc: 'Choose the best slot and confirm instantly with transparent pricing and polished provider cards.' },
    { title: 'Track in real time', desc: 'Follow arrival progress, get alerts, and keep everything in one reliable in-app journey.' },
    { title: 'Pay after completion', desc: 'Use OTP-secured confirmation so payment is released only after the job is properly done.' }
  ];

  topProviders = [
    { name: 'Suresh Electricals', cat: 'electrician', dist: 1.2, rate: 280, emoji: '⚡' },
    { name: 'Manoj Plumbing', cat: 'plumber', dist: 0.8, rate: 180, emoji: '🔧' },
    { name: 'Ravi AC Services', cat: 'ac_technician', dist: 2.1, rate: 350, emoji: '❄️' },
    { name: 'Deepak Home Care', cat: 'home_repair', dist: 1.5, rate: 150, emoji: '🏠' }
  ];

  features = [
    { title: 'Verified provider identity', desc: 'KYC-backed trust and cleaner accountability.' },
    { title: 'Elegant storefront profiles', desc: 'Better business presentation before a customer books.' },
    { title: 'Completion with OTP control', desc: 'Release payment only after the job is confirmed.' }
  ];

  testimonials = [
    { initials: 'AK', name: 'Arjun Kumar', city: 'Bangalore', comment: 'The experience felt much more premium than a basic marketplace. Clear profiles, fast booking, and strong service quality.' },
    { initials: 'PS', name: 'Priya Sharma', city: 'Chennai', comment: 'The provider arrived on time, communication was smooth, and the OTP flow made payment feel safe and professional.' },
    { initials: 'RV', name: 'Rahul Verma', city: 'Hyderabad', comment: 'The app finally makes local home services feel polished instead of chaotic. I could compare and book with confidence.' }
  ];

  goCategory(id: string): void {
    this.router.navigate(['/customer/search'], { queryParams: { cat: id } });
  }
}
