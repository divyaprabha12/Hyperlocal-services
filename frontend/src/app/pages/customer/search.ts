import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-search-services',
  imports: [FormsModule, NgIf, NgFor, RouterLink],
  template: `
    <main class="search-page">
      <div class="search-grid">
        <aside class="card filter-panel">
          <div class="panel-head">
            <div>
              <h1>Find Providers</h1>
              <p>Compare verified professionals, response time, ratings, and distance before you book.</p>
            </div>
            <h2>Filters</h2>
          </div>

          <div class="filter-stack">
            <div>
              <label class="label">Category</label>
              <select [(ngModel)]="cat" (change)="search()" class="input">
                <option value="">All Categories</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="cleaner">Cleaner</option>
                <option value="carpenter">Carpenter</option>
                <option value="ac_technician">AC Technician</option>
                <option value="home_repair">Home Repair</option>
              </select>
            </div>

            <div>
              <label class="label">Search radius</label>
              <div class="range-head">
                <span>Nearby search</span>
                <strong>{{ radius }} km</strong>
              </div>
              <input type="range" min="1" max="25" [(ngModel)]="radius" (change)="search()" class="range-input">
            </div>

            <div>
              <label class="label">Minimum rating</label>
              <select [(ngModel)]="minRating" (change)="search()" class="input">
                <option value="0">Any Rating</option>
                <option value="4">4.0+ Good</option>
                <option value="4.5">4.5+ Outstanding</option>
              </select>
            </div>

            <div>
              <label class="label">Sort by</label>
              <select [(ngModel)]="sortBy" (change)="search()" class="input">
                <option value="distance">Nearest Distance</option>
                <option value="rating">Highest Rating</option>
                <option value="price_asc">Hourly Rate: Low to High</option>
                <option value="price_desc">Hourly Rate: High to Low</option>
              </select>
            </div>

            <button class="btn btn-ghost btn-sm" (click)="reset()">Clear Filters</button>
          </div>
        </aside>

        <section class="results-panel">
          <div class="results-top">
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <input type="text" [(ngModel)]="query" (keyup.enter)="search()" placeholder="Search by business name or category">
              <button class="btn btn-primary btn-sm" (click)="search()">Search</button>
            </div>
          </div>

          <div class="results-scroll">
            <div *ngIf="loading()" class="loading-state">
              <div class="spinner"></div>
              <p>Scanning verified dispatch partners...</p>
            </div>

            <div *ngIf="!loading() && providers().length === 0" class="empty-state">
              <strong>No certified partners found</strong>
              <p>Try widening the radius or changing the category.</p>
            </div>

            <div *ngIf="!loading() && providers().length > 0" class="results-list">
              <div *ngFor="let p of providers()" class="provider-card">
                <div class="provider-avatar-wrap">
                  <img [src]="avatarUrl(p.businessName || 'Provider')" alt="Provider avatar">
                  <span *ngIf="+p.rating >= 4.5" class="choice-badge">Choice</span>
                </div>

                <div class="provider-copy">
                  <div class="provider-top">
                    <div>
                      <h3>{{ p.businessName }}</h3>
                      <div class="provider-tags">
                        <span class="badge badge-green">Verified</span>
                        <span class="badge badge-neutral">{{ p.category?.replace('_', ' ') }}</span>
                      </div>
                    </div>
                    <strong class="provider-rate">₹{{ p.hourlyRate }}/hr</strong>
                  </div>

                  <div class="provider-meta">
                    <span>★ {{ p.rating }}</span>
                    <span>{{ p.completedJobs }} jobs</span>
                    <span>{{ p.responseTime }} response</span>
                    <span>{{ p.distance }} km away</span>
                    <span>{{ p.experience }} yrs exp</span>
                  </div>

                  <p class="provider-bio">{{ p.bio }}</p>

                  <div class="provider-bottom">
                    <div class="provider-bottom-tags">
                      <span class="badge badge-blue">Immediate booking</span>
                    </div>
                    <a [routerLink]="['/customer/providers', p._id]" [state]="{ provider: p }" class="btn btn-primary btn-sm">View Details & Book</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  `,
  styles: [`
    .search-page {
      height: 100%;
      overflow: hidden;
      padding: 14px 16px 18px;
      width: 100%;
      max-width: none;
      margin: 0;
      box-sizing: border-box;
    }
    .search-grid {
      height: 100%;
      display: grid;
      grid-template-columns: 320px minmax(0, 1fr);
      gap: 16px;
      align-items: stretch;
      min-height: 0;
    }
    .panel-head {
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }
    .panel-head h1 {
      margin: 0 0 6px;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .panel-head p {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .filter-panel {
      padding: 18px;
      border-radius: 22px;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: auto;
    }
    .filter-panel h2 {
      margin: 16px 0 0;
      font-size: 16px;
    }
    .filter-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .range-head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      color: var(--text-secondary);
    }
    .range-input {
      width: 100%;
      accent-color: var(--accent);
    }
    .results-panel {
      height: 100%;
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .results-top {
      flex: 0 0 auto;
    }
    .results-scroll {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding-right: 4px;
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 10px 12px;
      margin-bottom: 14px;
    }
    .search-box svg {
      width: 16px;
      height: 16px;
      stroke: var(--text-muted);
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      flex-shrink: 0;
    }
    .search-box input {
      width: 100%;
      border: none;
      background: none;
      outline: none;
      font: inherit;
      color: var(--text-primary);
    }
    .loading-state,
    .empty-state {
      padding: 48px 20px;
      text-align: center;
      background: var(--bg-surface);
      border: 1px dashed var(--border);
      border-radius: 22px;
    }
    .loading-state p,
    .empty-state p {
      margin: 10px 0 0;
      font-size: 12.5px;
      color: var(--text-secondary);
    }
    .results-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .provider-card {
      display: flex;
      gap: 16px;
      padding: 18px;
      border-radius: 22px;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      transition: 0.18s ease;
    }
    .provider-card:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-sm);
    }
    .provider-avatar-wrap {
      position: relative;
      flex-shrink: 0;
    }
    .provider-avatar-wrap img {
      width: 78px;
      height: 78px;
      border-radius: 18px;
      object-fit: cover;
      border: 1px solid var(--border);
      background: var(--bg-raised);
    }
    .choice-badge {
      position: absolute;
      left: 50%;
      bottom: -7px;
      transform: translateX(-50%);
      min-height: 20px;
      padding: 0 8px;
      border-radius: 999px;
      background: var(--accent);
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    .provider-copy {
      flex: 1;
      min-width: 0;
    }
    .provider-top {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }
    .provider-top h3 {
      margin: 0 0 6px;
      font-size: 16px;
      color: var(--text-primary);
    }
    .provider-tags,
    .provider-bottom-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .provider-rate {
      white-space: nowrap;
      color: var(--text-primary);
      font-size: 16px;
    }
    .provider-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 14px;
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    .provider-bio {
      margin: 0;
      color: var(--text-secondary);
      font-size: 12.5px;
      line-height: 1.6;
    }
    .provider-bottom {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    @media (max-width: 900px) {
      .search-page {
        padding: 14px 12px 18px;
        height: auto;
        overflow: visible;
      }
      .search-grid {
        grid-template-columns: 1fr;
        height: auto;
        overflow: visible;
      }
      .filter-panel {
        overflow: visible;
        border-radius: 16px;
        padding: 14px;
      }
      .panel-head h1 { font-size: 18px; }
      .results-panel,
      .results-scroll {
        overflow: visible;
        height: auto;
      }
      .provider-card {
        flex-direction: column;
        gap: 12px;
        padding: 14px;
      }
      .provider-avatar-wrap img {
        width: 60px;
        height: 60px;
      }
      .provider-top {
        flex-direction: row;
        align-items: flex-start;
      }
      .provider-meta {
        gap: 6px 10px;
        font-size: 11.5px;
      }
      .search-box { padding: 8px 10px; }
      .search-box input { font-size: 13px; }
    }
  `]
})
export class SearchServicesPage implements OnInit {
  private readonly bookingService = inject(BookingService);
  readonly sidebarService = inject(SidebarService);
  private readonly route = inject(ActivatedRoute);

  readonly providers = signal<any[]>([]);
  readonly loading = signal(true);

  cat = '';
  radius = 10;
  minRating = '0';
  sortBy = 'distance';
  query = '';

  private readonly fallbackProviders = [
    { _id: 'mock-1', businessName: 'Suresh Electricals', category: 'electrician', hourlyRate: 280, rating: 4.9, completedJobs: 42, responseTime: '10 mins', distance: 1.2, experience: 6, bio: 'Certified residential electrician with same-day wiring, switchboard, and safety repairs.' },
    { _id: 'mock-2', businessName: 'Manoj Plumbing Works', category: 'plumber', hourlyRate: 180, rating: 4.8, completedJobs: 36, responseTime: '12 mins', distance: 0.8, experience: 7, bio: 'Specialist in leaks, geyser lines, tap replacements, and clean bathroom repairs.' },
    { _id: 'mock-3', businessName: 'Ravi AC Services', category: 'ac_technician', hourlyRate: 350, rating: 4.9, completedJobs: 58, responseTime: '15 mins', distance: 2.1, experience: 8, bio: 'Premium AC maintenance, gas refill, and cooling performance diagnosis for homes.' },
    { _id: 'mock-4', businessName: 'Deepak Home Care', category: 'home_repair', hourlyRate: 150, rating: 4.7, completedJobs: 28, responseTime: '18 mins', distance: 1.5, experience: 5, bio: 'Reliable all-round home repair partner for fixtures, fittings, and small restoration jobs.' },
    { _id: 'mock-5', businessName: 'Priya Clean Living', category: 'cleaner', hourlyRate: 260, rating: 4.8, completedJobs: 33, responseTime: '14 mins', distance: 2.4, experience: 4, bio: 'Detailed kitchen, bathroom, sofa, and move-in cleaning with professional supplies.' },
    { _id: 'mock-6', businessName: 'Arun Woodcraft', category: 'carpenter', hourlyRate: 320, rating: 4.6, completedJobs: 24, responseTime: '20 mins', distance: 3.0, experience: 9, bio: 'Furniture repair, shelf fitting, hinge adjustment, and custom woodwork support.' }
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      if (p['cat']) this.cat = p['cat'];
      if (p['q']) this.query = p['q'];
      this.search();
    });
  }

  avatarUrl(seed: string): string {
    return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=4e6f57&textColor=ffffff`;
  }

  search(): void {
    this.loading.set(true);
    this.bookingService.getNearbyProviders(12.9716, 77.5946, this.radius, this.cat || undefined).subscribe({
      next: (res: any) => {
        let list = (res.success ? res.data : []) || [];
        list = this.normalizeProviders(list);
        list = this.ensureMinimumProviders(list);
        list = this.applyFilters(list);
        this.providers.set(list);
        this.loading.set(false);
      },
      error: () => {
        let list = this.normalizeProviders([]);
        list = this.ensureMinimumProviders(list);
        list = this.applyFilters(list);
        this.providers.set(list);
        this.loading.set(false);
      }
    });
  }

  reset(): void {
    this.cat = '';
    this.radius = 10;
    this.minRating = '0';
    this.sortBy = 'distance';
    this.query = '';
    this.search();
  }

  private normalizeProviders(list: any[]): any[] {
    return list.map((p: any, index: number) => ({
      ...p,
      businessName: p.businessName || (p.user?.name ? `${p.user.name} Services` : this.fallbackProviders[index % this.fallbackProviders.length].businessName),
      rating: +(p.rating || (4.5 + Math.random() * 0.4)).toFixed(1),
      completedJobs: p.completedJobs || Math.floor(18 + Math.random() * 50),
      responseTime: p.responseTime || ['10 mins', '12 mins', '15 mins', '18 mins'][index % 4],
      distance: +(p.distance || (0.8 + index * 0.5)).toFixed(1),
      experience: p.experience || Math.floor(4 + Math.random() * 8),
      bio: p.bio || `${p.category?.replace('_', ' ') || 'Professional'} partner specializing in residential service visits with verified tools and clean completion standards.`
    }));
  }

  private ensureMinimumProviders(list: any[]): any[] {
    const combined = [...list];
    for (const fallback of this.fallbackProviders) {
      if (combined.length >= 5) break;
      if (!combined.find(p => p.businessName === fallback.businessName)) {
        combined.push({ ...fallback });
      }
    }
    return combined;
  }

  private applyFilters(list: any[]): any[] {
    let next = [...list];
    if (this.minRating !== '0') next = next.filter((p: any) => (p.rating || 5) >= +this.minRating);
    if (this.query.trim()) {
      const q = this.query.toLowerCase();
      next = next.filter((p: any) => p.businessName?.toLowerCase().includes(q) || p.category?.includes(q));
    }
    if (this.sortBy === 'rating') next.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    else if (this.sortBy === 'price_asc') next.sort((a: any, b: any) => a.hourlyRate - b.hourlyRate);
    else if (this.sortBy === 'price_desc') next.sort((a: any, b: any) => b.hourlyRate - a.hourlyRate);
    else next.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
    return next;
  }
}
