import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TopnavComponent } from '../../shared/topnav';
import { FooterComponent } from '../../shared/footer';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [TopnavComponent, FooterComponent, NgFor],
  template: `
    <div style="min-height:100vh;background:var(--bg-base);">
      <app-topnav></app-topnav>
      <main style="max-width:1120px;margin:0 auto;padding:48px 24px;">
        <header style="margin-bottom:32px;">
          <h1 style="font-size:26px;font-weight:700;letter-spacing:-0.02em;margin:0 0 6px;">All Services</h1>
          <p style="font-size:14px;color:var(--text-secondary);margin:0;">Transparent, baseline pricing — final cost depends on job complexity.</p>
        </header>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">
          <div *ngFor="let s of services" style="background:var(--bg-surface);border:1px solid var(--border);border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:12px;transition:border-color 0.15s;" class="svc-card">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
              <div>
                <span class="badge badge-neutral" style="margin-bottom:8px;font-size:10px;">{{ s.category }}</span>
                <h3 style="font-size:14px;font-weight:600;color:var(--text-primary);margin:0 0 4px;">{{ s.name }}</h3>
                <p style="font-size:12px;color:var(--text-secondary);margin:0;line-height:1.6;">{{ s.desc }}</p>
              </div>
            </div>
            <div style="border-top:1px solid var(--border);padding-top:12px;display:flex;align-items:center;justify-content:space-between;">
              <div>
                <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Base rate</div>
                <div style="font-size:16px;font-weight:700;color:var(--text-primary);">₹{{ s.price }}<span style="font-size:11px;font-weight:400;color:var(--text-muted);">/hr</span></div>
              </div>
              <button (click)="book(s.category)" class="btn btn-ghost btn-sm">Find Pros →</button>
            </div>
          </div>
        </div>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`.svc-card:hover { border-color: var(--border-hover); }`]
})
export class CategoriesPage {
  private readonly router = inject(Router);

  services = [
    { name: 'House Wiring & Fuse Repair', category: 'Electrician', price: 250, desc: 'Circuit troubleshooting, smart switch installation, board replacements and lighting setups.' },
    { name: 'Leaking Pipes & Tap Fixes', category: 'Plumber', price: 150, desc: 'Fixture installation, pipeline unclogging, sealing leaks and kitchen drain fixes.' },
    { name: 'Deep Home Cleaning', category: 'Cleaner', price: 500, desc: 'Full-room sanitation, window polishing, sofa washing and kitchen degreasing.' },
    { name: 'Custom Cabinetry & Furniture', category: 'Carpenter', price: 300, desc: 'Furniture alignment, wardrobe modifications, lock replacements.' },
    { name: 'Interior Wall Painting', category: 'Painter', price: 800, desc: 'Wall putty, interior/exterior painting, dampness treatment and texture overlays.' },
    { name: 'AC Jet Wash & Gas Refill', category: 'AC Technician', price: 350, desc: 'High-pressure cleaning of filters, coils, gas detection and duct repairs.' },
    { name: 'General Drilling & Mounting', category: 'Home Repair', price: 120, desc: 'TV wall mount, mirror installation, drywall drilling and structural fittings.' },
  ];

  book(cat: string): void {
    this.router.navigate(['/customer/search'], { queryParams: { cat: cat.toLowerCase().replace(' ', '_') } });
  }
}
