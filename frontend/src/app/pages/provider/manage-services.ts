import { Component, inject, signal, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar';
import { HeaderComponent } from '../../shared/header';
import { ProviderService } from '../../core/services/provider.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SidebarService } from '../../core/services/sidebar.service';

interface OfferedService {
  id: string;
  name: string;
  category: string;
  price: number;
  hourlyRate: number;
  experience: number;
  specialization: string;
  serviceArea: string;
  description: string;
  active: boolean;
}

@Component({
  selector: 'app-provider-manage-services',
  imports: [FormsModule, NgIf, NgFor],
  template: `
    <main style="padding:32px;max-width:1400px;margin:0 auto;width:100%;box-sizing:border-box;">

          <!-- Header -->
          <div style="margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
              <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.03em;margin:0 0- 4px;color:var(--text-primary);">
                Manage Business Services
              </h1>
              <p style="font-size:14.5px;color:var(--text-secondary);margin:0;">
                Configure the specific services you offer, set standard hourly rates, add experience tags, and toggle availability.
              </p>
            </div>
            <button (click)="openAddModal.set(true)" class="btn btn-primary btn-sm">+ Add Custom Service</button>
          </div>

          <!-- Main Layout Grid -->
          <div style="display:grid;grid-template-columns:1fr;gap:24px;">

            <!-- Active Services Deck -->
            <div class="card" style="padding:24px;">
              <h2 style="font-size:16px;font-weight:800;color:var(--text-primary);margin:0 0 16px;letter-spacing:-0.02em;">
                Your Service Offerings
              </h2>

              <div *ngIf="services().length === 0" style="padding:48px 24px;text-align:center;border:1px dashed var(--border);border-radius:12px;">
                <p style="font-size:14px;color:var(--text-muted);margin:0 0 12px;">You haven't listed any active business services yet.</p>
                <button (click)="openAddModal.set(true)" class="btn btn-primary btn-sm">Add First Service</button>
              </div>

              <!-- Grid of Gorgeous Service Cards -->
              <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:16px;" class="services-grid">
                <div *ngFor="let s of services()" class="card" style="background:var(--bg-raised);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:12px;position:relative;">
                  
                  <!-- Top icon & status toggle -->
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div style="width:42px;height:42px;background:var(--bg-surface);border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;">
                      {{ getServiceIcon(s.category) }}
                    </div>
                    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12.5px;font-weight:600;color:var(--text-secondary);">
                      <input type="checkbox" [checked]="s.active" (change)="toggleActive(s)" style="accent-color:var(--accent);width:15px;height:15px;">
                      <span>{{ s.active ? 'Active' : 'Paused' }}</span>
                    </label>
                  </div>

                  <!-- Details -->
                  <div>
                    <h3 style="font-size:15px;font-weight:800;color:var(--text-primary);margin:0 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                      {{ s.name }}
                    </h3>
                    <span class="badge badge-neutral" style="text-transform:uppercase;font-size:9.5px;margin-bottom:8px;">
                      {{ s.category }}
                    </span>
                    <p style="font-size:13px;color:var(--text-secondary);margin:6px 0;line-height:1.4;height:54px;overflow:hidden;text-overflow:ellipsis;">
                      {{ s.description }}
                    </p>
                  </div>

                  <!-- Rate / Specs Grid -->
                  <div style="border-top:1px solid var(--border);padding-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12.5px;">
                    <div>
                      <span style="color:var(--text-muted);font-size:10px;font-weight:700;display:block;">HOURLY RATE</span>
                      <span style="font-weight:800;color:var(--text-primary);">₹{{ s.hourlyRate }}/hr</span>
                    </div>
                    <div>
                      <span style="color:var(--text-muted);font-size:10px;font-weight:700;display:block;">EXPERIENCE</span>
                      <span style="font-weight:700;color:var(--text-primary);">{{ s.experience }} Years</span>
                    </div>
                  </div>

                  <div style="border-top:1px solid var(--border);padding-top:10px;display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:var(--text-muted);">
                    <span>📍 {{ s.serviceArea }}</span>
                    <button (click)="deleteService(s)" class="btn btn-ghost btn-sm" style="color:var(--danger);border-color:#FCDFD9;padding:2px 8px;font-size:11px;">Remove</button>
                  </div>

                </div>
              </div>
            </div>

          </div>

          <!-- Add Modal Dialog -->
          <div *ngIf="openAddModal()" style="position:fixed;inset:0;background:rgba(42,46,43,0.3);z-index:90;display:flex;align-items:center;justify-content:center;padding:20px;">
            <div class="card" style="width:100%;max-width:540px;background:#FFFFFF;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:14px;">
              <h2 style="font-size:16px;font-weight:800;color:var(--text-primary);margin:0;border-bottom:1px solid var(--border);padding-bottom:10px;">
                Add New Service Offering
              </h2>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                  <label class="label">Service Name</label>
                  <input type="text" [(ngModel)]="newForm.name" class="input" placeholder="e.g. Inverter switchboard upgrade">
                </div>
                <div>
                  <label class="label">Category</label>
                  <select [(ngModel)]="newForm.category" class="input">
                    <option value="electrician">Electrician</option>
                    <option value="plumber">Plumber</option>
                    <option value="cleaner">Cleaner</option>
                    <option value="carpenter">Carpenter</option>
                    <option value="ac_technician">AC Technician</option>
                    <option value="home_repair">Home Repair</option>
                  </select>
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                  <label class="label">Standard Pricing (₹)</label>
                  <input type="number" [(ngModel)]="newForm.price" class="input" placeholder="e.g. 450">
                </div>
                <div>
                  <label class="label">Hourly Charge (₹ / hr)</label>
                  <input type="number" [(ngModel)]="newForm.hourlyRate" class="input" placeholder="e.g. 200">
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div>
                  <label class="label">Experience required (Years)</label>
                  <input type="number" [(ngModel)]="newForm.experience" class="input" placeholder="e.g. 5">
                </div>
                <div>
                  <label class="label">Service Coverage Area</label>
                  <input type="text" [(ngModel)]="newForm.serviceArea" class="input" placeholder="e.g. Bangalore South">
                </div>
              </div>

              <div>
                <label class="label">Specialization Tag</label>
                <input type="text" [(ngModel)]="newForm.specialization" class="input" placeholder="e.g. High voltage diagnostics">
              </div>

              <div>
                <label class="label">Service Description</label>
                <textarea [(ngModel)]="newForm.description" class="input" rows="3" placeholder="Briefly describe what this task covers, materials needed..."></textarea>
              </div>

              <div style="display:flex;justify-content:flex-end;gap:10px;border-top:1px solid var(--border);padding-top:12px;">
                <button (click)="openAddModal.set(false)" class="btn btn-ghost btn-sm">Cancel</button>
                <button (click)="addService()" class="btn btn-primary btn-sm">List Service</button>
              </div>
            </div>
          </div>

        </main>
  `,
  styles: [`
    @media (max-width: 900px) {
      .services-grid { grid-template-columns: 1fr !important; }
    }
  `]
})
export class ProviderManageServicesPage implements OnInit {
  private readonly providerService = inject(ProviderService);
  readonly sidebarService = inject(SidebarService);
  readonly auth = inject(AuthService);

  readonly services = signal<OfferedService[]>([]);
  readonly openAddModal = signal(false);

  newForm = {
    name: '',
    category: 'electrician',
    price: 450,
    hourlyRate: 200,
    experience: 5,
    specialization: '',
    serviceArea: 'Bangalore South',
    description: '',
    active: true
  };

  ngOnInit(): void {
    this.services.set([
      {
        id: '1',
        name: 'Residential Switchboard Rewiring & Fixes',
        category: 'electrician',
        price: 350,
        hourlyRate: 150,
        experience: 5,
        specialization: 'High voltage switch repairs',
        serviceArea: 'Bangalore East',
        description: 'Complete replacement of burnt terminal fuses, checking loop connections, and installing secure switches.',
        active: true
      },
      {
        id: '2',
        name: 'Kitchen Sink Tap & Piping Overhaul',
        category: 'plumber',
        price: 480,
        hourlyRate: 180,
        experience: 6,
        specialization: 'Anti-corrosive brass installations',
        serviceArea: 'Indiranagar, Koramangala',
        description: 'Removing legacy rusted joints, replacing pipe lines with anti-rust brass faucets, and testing high pressure outflow.',
        active: true
      },
      {
        id: '3',
        name: 'Deep Balcony Cleaning & Degreasing',
        category: 'cleaner',
        price: 950,
        hourlyRate: 220,
        experience: 3,
        specialization: 'High-pressure floor wash',
        serviceArea: 'Bangalore South',
        description: 'Washing tiled surfaces with eco-friendly chemical washes, cleaning iron railings, and sorting floor blockages.',
        active: false
      }
    ]);
  }

  getServiceIcon(cat: string): string {
    const map: Record<string, string> = { electrician: '⚡', plumber: '🔧', cleaner: '🧹', carpenter: '🪚', ac_technician: '❄️', home_repair: '🏠' };
    return map[cat] ?? '🔩';
  }

  toggleActive(s: OfferedService): void {
    s.active = !s.active;
    alert(`Service status successfully changed to ${s.active ? 'ACTIVE' : 'PAUSED'}.`);
  }

  deleteService(s: OfferedService): void {
    if (!confirm('Are you sure you want to remove this service list?')) return;
    this.services.update(list => list.filter(item => item.id !== s.id));
  }

  addService(): void {
    if (!this.newForm.name || !this.newForm.description) {
      alert('Please fill out the service name and description.');
      return;
    }
    const item: OfferedService = {
      id: Math.random().toString(),
      ...this.newForm
    };
    this.services.update(list => [...list, item]);
    alert('Service listed successfully! Customers will see this inside your service profile.');
    this.openAddModal.set(false);
    // Reset form
    this.newForm = {
      name: '',
      category: 'electrician',
      price: 450,
      hourlyRate: 200,
      experience: 5,
      specialization: '',
      serviceArea: 'Bangalore South',
      description: '',
      active: true
    };
  }
}
