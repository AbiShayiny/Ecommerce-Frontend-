import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CatalogService } from '../../core/services/catalog.service';
import { PortalService } from '../../core/services/portal.service';
import { PortalLayoutComponent, PortalNavItem } from '../../shared/layouts/portal-layout/portal-layout';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [PortalLayoutComponent],
  styles: [':host { --bidlify-navy: #242424; --bidlify-navy-dark: #1a1a1a; }'],
  template: `
    <app-portal-layout
      portalTitle="Admin Portal"
      [userName]="auth.currentAdmin()?.name || 'Admin'"
      [userSubtitle]="auth.currentAdmin()?.email || ''"
      [navItems]="navItems()"
      (signOut)="onSignOut()"
    />
  `,
})
export class AdminShellComponent {
  protected readonly auth = inject(AuthService);
  private readonly portal = inject(PortalService);
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);

  protected readonly navItems = computed<PortalNavItem[]>(() => {
    const pendingSuppliers = this.portal.pendingSuppliersCount();
    const pendingProducts = this.catalog
      .products()
      .filter((p) => p.approvalStatus === 'Pending').length;

    return [
      { label: 'Dashboard', route: '/admin/dashboard' },
      { label: 'Supplier Approvals', route: '/admin/suppliers', badge: pendingSuppliers },
      { label: 'User Management', route: '/admin/users' },
      { label: 'Product Approvals', route: '/admin/products', badge: pendingProducts },
      { label: 'Categories', route: '/admin/categories' },
      { label: 'Orders', route: '/admin/orders' },
      { label: 'Reviews Moderation', route: '/admin/reviews' },
      { label: 'Notifications', route: '/admin/notifications' },
      { label: 'Reports & Analytics', route: '/admin/reports' },
    ];
  });

  protected onSignOut(): void {
    this.auth.signOutAdmin();
    void this.router.navigate(['/admin/login']);
  }
}

