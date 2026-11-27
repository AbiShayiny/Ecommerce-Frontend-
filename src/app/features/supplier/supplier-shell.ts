import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { PortalLayoutComponent, PortalNavItem } from '../../shared/layouts/portal-layout/portal-layout';

@Component({
  selector: 'app-supplier-shell',
  standalone: true,
  imports: [PortalLayoutComponent],
  template: `
    <app-portal-layout
      portalTitle="Supplier Portal"
      [userName]="auth.currentSupplier()?.businessName || 'Supplier'"
      [userSubtitle]="auth.currentSupplier()?.ownerName || ''"
      [navItems]="navItems()"
      (signOut)="onSignOut()"
    />
  `,
})
export class SupplierShellComponent {
  protected readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly navItems = computed<PortalNavItem[]>(() => {
    const supId = this.auth.currentSupplier()?.id;
    const pendingOrders = this.orderService
      .orders()
      .filter((o) => o.supplierId === supId && o.status !== 'Collected' && o.status !== 'Cancelled')
      .length;

    return [
      { label: 'Dashboard', route: '/supplier/dashboard' },
      { label: 'My Products', route: '/supplier/products' },
      { label: 'Add Product', route: '/supplier/products/new' },
      { label: 'Inventory / Stock', route: '/supplier/inventory' },
      { label: 'Orders', route: '/supplier/orders', badge: pendingOrders },
      { label: 'Payment & Settlement', route: '/supplier/payments' },
      { label: 'Supplier Profile', route: '/supplier/profile' },
    ];
  });

  protected onSignOut(): void {
    this.auth.signOutSupplier();
    void this.router.navigate(['/supplier/login']);
  }
}

