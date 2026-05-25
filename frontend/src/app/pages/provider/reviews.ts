import { Component, inject, signal, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar';
import { ProviderService } from '../../core/services/provider.service';
import { NgIf, NgFor } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-provider-reviews',
  imports: [NgIf, NgFor],
  template: `
    <main class="reviews-page">

          <!-- Header -->
          <div style="margin-bottom:24px;">
            <h1 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin:0 0 3px;">Customer Feedback & Reviews</h1>
            <p style="font-size:13px;color:var(--text-secondary);margin:0;">Read reviews posted by verified customers. High ratings directly boost your dispatch order leads.</p>
          </div>

          <div style="display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start;" class="reviews-grid">

            <!-- Reviews list -->
            <div class="card" style="display:flex;flex-direction:column;gap:14px;">
              <h2 style="font-size:13px;font-weight:700;color:var(--text-primary);margin:0;border-bottom:1px solid var(--border);padding-bottom:10px;">Recent Reviews</h2>

              <div *ngIf="reviews().length === 0" style="padding:48px 24px;text-align:center;border:1px dashed var(--border);border-radius:12px;">
                <p style="font-size:13px;color:var(--text-secondary);margin:0;">No reviews written by customers yet.</p>
              </div>

              <div style="display:flex;flex-direction:column;gap:10px;">
                <div *ngFor="let r of reviews()" style="background:var(--bg-raised);border:1px solid var(--border);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:6px;">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                    <div>
                      <h3 style="font-size:13px;font-weight:700;color:var(--text-primary);margin:0 0 2px;">{{ r.customer?.name || 'Customer' }}</h3>
                      <p style="font-size:11px;color:var(--text-muted);margin:0;">Job: {{ r.booking?.service?.name || 'Home Service' }}</p>
                    </div>
                    <span style="font-size:12.5px;color:#D98C36;font-weight:700;flex-shrink:0;">★ {{ r.rating }}</span>
                  </div>
                  <p style="font-size:12.5px;color:var(--text-secondary);margin:6px 0 0;line-height:1.4;">"{{ r.comment }}"</p>
                </div>
              </div>
            </div>

            <!-- Stats Overview -->
            <div style="display:flex;flex-direction:column;gap:14px;">
              <div class="card" style="text-align:center;padding:24px 16px;">
                <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Average Score</div>
                <div style="font-size:42px;font-weight:800;color:var(--text-primary);line-height:1;margin-bottom:6px;">★ 4.9</div>
                <div style="font-size:11.5px;color:var(--text-secondary);">Based on verified dispatches</div>
              </div>

              <div class="card" style="display:flex;flex-direction:column;gap:10px;">
                <h3 style="font-size:12px;font-weight:700;color:var(--text-primary);margin:0;">Rating Breakdown</h3>
                <div style="display:flex;flex-direction:column;gap:8px;font-size:11.5px;">
                  <div style="display:flex;align-items:center;gap:6px;">
                    <span style="width:28px;">5 star</span>
                    <div style="flex:1;height:6px;background:var(--bg-overlay);border-radius:99px;overflow:hidden;">
                      <div style="width:85%;height:100%;background:var(--accent);border-radius:99px;"></div>
                    </div>
                    <span style="width:20px;text-align:right;">85%</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <span style="width:28px;">4 star</span>
                    <div style="flex:1;height:6px;background:var(--bg-overlay);border-radius:99px;overflow:hidden;">
                      <div style="width:12%;height:100%;background:var(--accent);border-radius:99px;"></div>
                    </div>
                    <span style="width:20px;text-align:right;">12%</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <span style="width:28px;">3 star</span>
                    <div style="flex:1;height:6px;background:var(--bg-overlay);border-radius:99px;overflow:hidden;">
                      <div style="width:3%;height:100%;background:var(--accent);border-radius:99px;"></div>
                    </div>
                    <span style="width:20px;text-align:right;">3%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
  `,
  styles: [`
    .reviews-page {
      height: 100%;
      overflow: auto;
      padding: 18px 20px 20px;
      width: 100%;
      box-sizing: border-box;
    }
    @media (max-width: 860px) { .reviews-grid { grid-template-columns: 1fr !important; } }
  `]
})
export class ProviderReviewsPage implements OnInit {
  private readonly providerService = inject(ProviderService);
  readonly sidebarService = inject(SidebarService);
  readonly reviews = signal<any[]>([]);

  ngOnInit(): void {
    this.providerService.getEarnings().subscribe({
      next: (res: any) => {
        if (res.success && res.data?.reviews) {
          this.reviews.set(res.data.reviews);
        } else {
          this.reviews.set([
            { customer: { name: 'Aditya Sen' }, rating: 5, comment: 'Completed electrician house switch repair very quickly! Carried all spare switches inside his tool box.' },
            { customer: { name: 'Priyah R.' }, rating: 5, comment: 'Highly expert service! Cleared faucet blockages and tested the geyser links carefully.' }
          ]);
        }
      }
    });
  }
}
