import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  readonly isCollapsed = signal<boolean>(localStorage.getItem('sidebar_collapsed') === 'true');
  readonly isMobileOpen = signal<boolean>(false);

  toggle(): void {
    if (window.innerWidth <= 1023) {
      this.isMobileOpen.update(v => !v);
    } else {
      const next = !this.isCollapsed();
      this.isCollapsed.set(next);
      localStorage.setItem('sidebar_collapsed', String(next));
    }
  }
}
