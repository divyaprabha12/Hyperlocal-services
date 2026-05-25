import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-customer-provider-profile',
  imports: [FormsModule, NgIf, NgFor, DatePipe, RouterLink],
  template: `
    <main style="padding:32px 28px;max-width:1000px;">

          <a routerLink="/customer/search" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--text-muted);text-decoration:none;margin-bottom:20px;border-radius:6px;" onmouseover="this.style.color='var(--text-primary)'" onmouseout="this.style.color='var(--text-muted)'">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to search
          </a>

          <div *ngIf="loading()" style="padding:60px;text-align:center;">
            <div class="spinner" style="margin:0 auto 12px;"></div>
            <p style="font-size:13px;color:var(--text-muted);">Loading profile…</p>
          </div>

          <div *ngIf="!loading() && provider()" style="display:grid;grid-template-columns:1fr 320px;gap:20px;align-items:start;" class="profile-grid">

            <!-- Left -->
            <div style="display:flex;flex-direction:column;gap:16px;">

              <!-- Hero card -->
              <div class="card">
                <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;">
                  <img [src]="provider().user?.avatar || 'https://api.dicebear.com/8.x/initials/svg?seed='+(provider().businessName||'P')" class="avatar" style="width:56px;height:56px;border-radius:14px;">
                  <div style="flex:1;min-width:200px;">
                    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px;">
                      <h1 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin:0;">{{ provider().businessName }}</h1>
                      <span class="badge badge-green">Verified</span>
                    </div>
                    <p style="font-size:13px;color:var(--text-secondary);margin:0 0 10px;text-transform:capitalize;">{{ provider().category?.replace('_',' ') }} Specialist</p>
                    <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
                      <div style="display:flex;align-items:center;gap:4px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <span style="font-size:13px;font-weight:600;color:var(--text-primary);">{{ provider().rating || '5.0' }}</span>
                        <span style="font-size:12px;color:var(--text-muted);">({{ reviews().length }} reviews)</span>
                      </div>
                      <span style="font-size:13px;color:var(--text-secondary);">{{ provider().distance || '0.8' }} km away</span>
                      <span style="font-size:14px;font-weight:700;color:var(--text-primary);">₹{{ provider().hourlyRate }}<span style="font-size:11px;font-weight:400;color:var(--text-muted);">/hr</span></span>
                    </div>
                  </div>
                  <button (click)="toggleFav()" [class]="isFav() ? 'btn btn-sm' : 'btn btn-ghost btn-sm'"
                    [style.background]="isFav() ? 'rgba(239,68,68,0.1)' : ''"
                    [style.color]="isFav() ? '#F87171' : ''"
                    [style.borderColor]="isFav() ? 'rgba(239,68,68,0.2)' : ''">
                    {{ isFav() ? '♥ Saved' : '♡ Save' }}
                  </button>
                </div>
              </div>

              <!-- Bio -->
              <div class="card">
                <h2 class="section-title">About</h2>
                <p style="font-size:13px;color:var(--text-secondary);line-height:1.7;margin:0;">
                  {{ provider().bio || 'Experienced certified specialist with professional tools and government-verified background check. Available for routine maintenance, emergency repairs, and installation work.' }}
                </p>
              </div>

              <!-- Reviews -->
              <div class="card">
                <h2 class="section-title">Customer Reviews</h2>

                <div *ngIf="reviews().length===0" style="padding:24px;text-align:center;border:1px dashed var(--border);border-radius:8px;">
                  <p style="font-size:13px;color:var(--text-muted);margin:0;">No reviews yet — be the first to book!</p>
                </div>

                <div style="display:flex;flex-direction:column;">
                  <div *ngFor="let r of reviews()" class="table-row" style="padding:14px 0;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                      <span style="font-size:13px;font-weight:500;color:var(--text-primary);">{{ r.customerId?.name || 'Customer' }}</span>
                      <div style="display:flex;align-items:center;gap:2px;">
                        <span *ngFor="let s of stars(r.rating)" style="font-size:12px;color:#FBBF24;">★</span>
                        <span *ngFor="let s of emptyStars(r.rating)" style="font-size:12px;color:var(--text-muted);">★</span>
                      </div>
                    </div>
                    <p style="font-size:12px;color:var(--text-secondary);margin:0;line-height:1.6;">{{ r.comment }}</p>
                    <span style="font-size:11px;color:var(--text-muted);">{{ r.createdAt | date:'d MMM yyyy' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking panel -->
            <div style="position:sticky;top:24px;">
              <div class="card">
                <h2 class="section-title">Schedule Booking</h2>

                <div *ngIf="bookErr()" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:10px;margin-bottom:12px;font-size:12px;color:#F87171;">{{ bookErr() }}</div>
                <div *ngIf="bookOk()" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:8px;padding:10px;margin-bottom:12px;font-size:12px;color:#34D399;">{{ bookOk() }}</div>

                <form (ngSubmit)="book()" style="display:flex;flex-direction:column;gap:10px;">
                  <div>
                    <label style="display:block;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:5px;">Street Address</label>
                    <input type="text" [(ngModel)]="street" name="street" required class="input" style="font-size:12px;" placeholder="Flat, building, street name">
                  </div>
                  <div>
                    <label style="display:block;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:5px;">Date</label>
                    <input type="date" [(ngModel)]="bookDate" name="date" required class="input" style="font-size:12px;">
                  </div>
                  <div>
                    <label style="display:block;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:5px;">Time Slot</label>
                    <select [(ngModel)]="slot" name="slot" class="input" style="font-size:12px;padding:7px 10px;">
                      <option>09:00 AM – 12:00 PM</option>
                      <option>12:00 PM – 03:00 PM</option>
                      <option>03:00 PM – 06:00 PM</option>
                      <option>06:00 PM – 09:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label style="display:block;font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:5px;">Notes (optional)</label>
                    <textarea [(ngModel)]="notes" name="notes" class="input" style="font-size:12px;min-height:70px;" placeholder="Describe the issue…"></textarea>
                  </div>

                  <div style="border-top:1px solid var(--border);padding-top:10px;display:flex;flex-direction:column;gap:5px;font-size:12px;">
                    <div style="display:flex;justify-content:space-between;color:var(--text-muted);"><span>Hourly rate</span><span>₹{{ provider().hourlyRate }}</span></div>
                    <div style="display:flex;justify-content:space-between;color:var(--text-muted);"><span>Platform fee</span><span>₹50</span></div>
                    <div style="display:flex;justify-content:space-between;font-weight:700;color:var(--text-primary);padding-top:5px;border-top:1px solid var(--border);"><span>Estimate</span><span>₹{{ provider().hourlyRate + 50 }}</span></div>
                  </div>

                  <button type="submit" class="btn btn-primary" style="width:100%;margin-top:4px;">Confirm Booking</button>
                </form>
              </div>
            </div>
          </div>
        </main>
  `,
  styles: [`
    @media (max-width: 860px) { .profile-grid { grid-template-columns: 1fr !important; } }
  `]
})
export class CustomerProviderProfilePage implements OnInit {
  private readonly bookingService = inject(BookingService);
  readonly sidebarService = inject(SidebarService);
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly provider = signal<any>(null);
  readonly reviews = signal<any[]>([]);
  readonly isFav = signal(false);
  readonly loading = signal(true);
  readonly bookErr = signal<string | null>(null);
  readonly bookOk = signal<string | null>(null);

  private readonly fallbackProviders = [
    {
      _id: 'mock-1',
      businessName: 'Suresh Electricals',
      category: 'electrician',
      hourlyRate: 280,
      rating: 4.9,
      distance: 1.2,
      experience: 6,
      completedJobs: 42,
      bio: 'Certified residential electrician with same-day wiring, switchboard, and safety repairs.',
      user: { avatar: '', name: 'Suresh Electricals' }
    },
    {
      _id: 'mock-2',
      businessName: 'Manoj Plumbing Works',
      category: 'plumber',
      hourlyRate: 180,
      rating: 4.8,
      distance: 0.8,
      experience: 7,
      completedJobs: 36,
      bio: 'Specialist in leaks, geyser lines, tap replacements, and clean bathroom repairs.',
      user: { avatar: '', name: 'Manoj Plumbing Works' }
    },
    {
      _id: 'mock-3',
      businessName: 'Ravi AC Services',
      category: 'ac_technician',
      hourlyRate: 350,
      rating: 4.9,
      distance: 2.1,
      experience: 8,
      completedJobs: 58,
      bio: 'Premium AC maintenance, gas refill, and cooling performance diagnosis for homes.',
      user: { avatar: '', name: 'Ravi AC Services' }
    },
    {
      _id: 'mock-4',
      businessName: 'Deepak Home Care',
      category: 'home_repair',
      hourlyRate: 150,
      rating: 4.7,
      distance: 1.5,
      experience: 5,
      completedJobs: 28,
      bio: 'Reliable all-round home repair partner for fixtures, fittings, and small restoration jobs.',
      user: { avatar: '', name: 'Deepak Home Care' }
    },
    {
      _id: 'mock-5',
      businessName: 'Priya Clean Living',
      category: 'cleaner',
      hourlyRate: 260,
      rating: 4.8,
      distance: 2.4,
      experience: 4,
      completedJobs: 33,
      bio: 'Detailed kitchen, bathroom, sofa, and move-in cleaning with professional supplies.',
      user: { avatar: '', name: 'Priya Clean Living' }
    },
    {
      _id: 'mock-6',
      businessName: 'Arun Woodcraft',
      category: 'carpenter',
      hourlyRate: 320,
      rating: 4.6,
      distance: 3.0,
      experience: 9,
      completedJobs: 24,
      bio: 'Furniture repair, shelf fitting, hinge adjustment, and custom woodwork support.',
      user: { avatar: '', name: 'Arun Woodcraft' }
    }
  ];

  street = ''; bookDate = ''; slot = '09:00 AM – 12:00 PM'; notes = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadProfile(id);
  }

  loadProfile(id: string): void {
    const navProvider = history.state?.provider;
    if (navProvider?._id === id) {
      this.setProviderData(navProvider, this.mockReviews(navProvider));
      return;
    }

    const fallback = this.fallbackProviders.find(provider => provider._id === id);
    if (fallback) {
      this.setProviderData(fallback, this.mockReviews(fallback));
      return;
    }

    this.bookingService.getProviderProfile(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.setProviderData(res.data.provider, res.data.reviews || []);
        }
        this.loading.set(false);
      },
      error: () => {
        if (navProvider) {
          this.setProviderData(navProvider, this.mockReviews(navProvider));
        } else {
          this.loading.set(false);
          this.router.navigate(['/customer/search']);
        }
      }
    });
  }

  private setProviderData(provider: any, reviews: any[]): void {
    this.provider.set(provider);
    this.reviews.set(reviews);
    const favs = this.authService.currentUser()?.favorites || [];
    this.isFav.set(favs.includes(provider._id));
    this.loading.set(false);
  }

  private mockReviews(provider: any): any[] {
    return [
      {
        customerId: { name: 'Alex Rivera' },
        rating: provider.rating || 5,
        comment: `Very smooth experience with ${provider.businessName}. Clean work, clear communication, and punctual arrival.`,
        createdAt: new Date().toISOString()
      },
      {
        customerId: { name: 'Priya Sharma' },
        rating: Math.max(4, Math.round(provider.rating || 5)),
        comment: 'Professional visit and good finishing quality. Would book again.',
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
      }
    ];
  }

  toggleFav(): void {
    if (!this.provider()) return;
    if (String(this.provider()._id).startsWith('mock-')) {
      this.isFav.update(value => !value);
      return;
    }
    this.bookingService.toggleFavorite(this.provider()._id).subscribe({
      next: (res: any) => {
        if (res.success) this.isFav.set(res.isFavorited ?? !this.isFav());
      }
    });
  }

  book(): void {
    if (!this.street || !this.bookDate) { this.bookErr.set('Please fill in address and date.'); return; }
    this.bookErr.set(null); this.bookOk.set(null);

    if (String(this.provider()._id).startsWith('mock-')) {
      this.bookOk.set('Booking confirmed! Redirecting…');
      setTimeout(() => this.router.navigate(['/customer/dashboard']), 1200);
      return;
    }

    const payload = {
      providerId: this.provider()._id,
      serviceName: this.provider().category === 'electrician' ? 'House Wiring & Repair' : 'Home Service',
      category: this.provider().category,
      basePrice: this.provider().hourlyRate,
      bookingDate: new Date(this.bookDate),
      timeSlot: this.slot,
      address: { street: this.street, city: 'Bangalore', state: 'Karnataka', zip: '560001' },
      totalAmount: this.provider().hourlyRate + 50,
      notes: this.notes
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.bookOk.set('Booking confirmed! Redirecting…');
          setTimeout(() => this.router.navigate(['/customer/dashboard']), 1400);
        }
      },
      error: (err: any) => this.bookErr.set(err.error?.message || 'Booking failed. Try again.')
    });
  }

  stars(n: number): number[] { return Array(Math.round(n)).fill(0); }
  emptyStars(n: number): number[] { return Array(5 - Math.round(n)).fill(0); }
}
