import { Component, signal, inject } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-provider-portfolio',
  imports: [FormsModule, NgFor],
  template: `
    <main style="padding:28px 32px;">

          <!-- Header -->
          <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
              <h1 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin:0 0 3px;">Work Portfolio</h1>
              <p style="font-size:13px;color:var(--text-secondary);margin:0;">Upload before/after work snapshots and show off certifications to win high-paying customers.</p>
            </div>
            <button (click)="uploadNew()" class="btn btn-primary btn-sm">+ Upload New Sample</button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;" class="portfolio-grid">
            <div *ngFor="let p of samples()" class="card" style="display:flex;flex-direction:column;gap:12px;">
              
              <!-- Before / After Grid Visual -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                  <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:4px;">BEFORE</span>
                  <div style="background:var(--bg-overlay);border:1px solid var(--border);border-radius:8px;height:140px;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--text-secondary);overflow:hidden;position:relative;">
                    <img [src]="p.beforeImg" style="width:100%;height:100%;object-fit:cover;">
                  </div>
                </div>
                <div>
                  <span style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;display:block;margin-bottom:4px;">AFTER</span>
                  <div style="background:var(--bg-overlay);border:1px solid var(--border);border-radius:8px;height:140px;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--text-secondary);overflow:hidden;position:relative;">
                    <img [src]="p.afterImg" style="width:100%;height:100%;object-fit:cover;">
                  </div>
                </div>
              </div>

              <!-- Details info -->
              <div>
                <h3 style="font-size:13.5px;font-weight:700;color:var(--text-primary);margin:0 0 2px;">{{ p.title }}</h3>
                <p style="font-size:12px;color:var(--text-secondary);margin:0 0 8px;">{{ p.description }}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-muted);">
                  <span>Client Rating: ★ {{ p.rating }}</span>
                  <button (click)="removeSample(p)" class="btn btn-danger btn-sm" style="padding:4px 8px;font-size:11px;">Delete Sample</button>
                </div>
              </div>

            </div>
          </div>

        </main>
  `,
  styles: [`
    @media (max-width: 768px) { .portfolio-grid { grid-template-columns: 1fr !important; } }
  `]
})
export class ProviderPortfolioPage {
  readonly sidebarService = inject(SidebarService);
  samples = signal<any[]>([
    {
      title: 'Kitchen Tap Upgrade',
      description: 'Replaced rusted iron pipes with premium anti-corrosive brass taps and aligned drain lines.',
      beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop',
      afterImg: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&auto=format&fit=crop',
      rating: '5.0'
    },
    {
      title: 'Commercial Board Rewiring',
      description: 'Overhauled burned main switchboard, sorted circuit links, and installed automated RCCB breakers.',
      beforeImg: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=400&auto=format&fit=crop',
      afterImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop',
      rating: '4.8'
    }
  ]);

  uploadNew(): void {
    alert('Attach "Before Work" and "After Work" snapshots. The platform automatically compresses files for mobile viewing.');
  }

  removeSample(p: any): void {
    if (!confirm('Are you sure you want to delete this portfolio work sample?')) return;
    this.samples.update(list => list.filter(k => k !== p));
  }
}
