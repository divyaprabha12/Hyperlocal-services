import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header';
import { SidebarComponent } from './sidebar';
import { SidebarService } from '../core/services/sidebar.service';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, HeaderComponent, RouterOutlet],
  template: `
    <div class="layout-shell">
      <app-header></app-header>

      <div class="workspace-shell">
        <app-sidebar class="sidebar-host"></app-sidebar>

        <div class="content-shell">
          <main class="content-main" [class.dashboard-scroll]="allowMainScroll()">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-shell {
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bg-base);
    }
    .workspace-shell {
      flex: 1;
      min-height: 0;
      display: flex;
      overflow: hidden;
    }
    .sidebar-host {
      flex: 0 0 auto;
      height: 100%;
    }
    .content-shell {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }
    .content-main {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      position: relative;
      padding: 0;
    }
    .content-main.dashboard-scroll {
      overflow-y: auto;
    }
    @media (max-width: 1023px) {
      .content-main { padding: 0; }
    }
  `]
})
export class AppLayoutComponent {
  readonly sidebarService = inject(SidebarService);
  private readonly router = inject(Router);

  allowMainScroll(): boolean {
    return this.router.url.includes('/dashboard');
  }
}
