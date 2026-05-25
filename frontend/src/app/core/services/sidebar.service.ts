import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  readonly isCollapsed = signal<boolean>(localStorage.getItem('sidebar_collapsed') === 'true');

  toggle(): void {
    const next = !this.isCollapsed();
    this.isCollapsed.set(next);
    localStorage.setItem('sidebar_collapsed', String(next));
  }
}
