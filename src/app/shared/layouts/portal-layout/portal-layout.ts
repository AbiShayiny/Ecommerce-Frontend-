import { Component, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

export interface PortalNavItem {
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-portal-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './portal-layout.html',
  styleUrl: './portal-layout.scss',
})
export class PortalLayoutComponent {
  readonly portalTitle = input.required<string>();
  readonly userName = input<string>('Portal User');
  readonly userSubtitle = input<string>('');
  readonly navItems = input.required<PortalNavItem[]>();
  readonly signOut = output<void>();

  protected readonly sidebarOpen = signal(false);

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}

