import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
          <main class="content-main">
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
      overflow-x: hidden;
      background: var(--bg-base);
      max-width: 100vw;
    }
    .workspace-shell {
      flex: 1;
      min-height: 0;
      display: flex;
      overflow: hidden;
      overflow-x: hidden;
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
      overflow-y: auto;
      position: relative;
      padding: 0;
    }
    @media (max-width: 1023px) {
      .sidebar-host {
        width: 0;
        flex: 0 0 0px;
        overflow: visible;
      }
      .content-main { padding: 0; }
    }
  `]
})
export class AppLayoutComponent {
  readonly sidebarService = inject(SidebarService);
}
