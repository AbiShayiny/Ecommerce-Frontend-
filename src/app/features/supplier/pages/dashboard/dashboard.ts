import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { OrderService } from '../../../../core/services/order.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-supplier-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe, StatusBadgeComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class SupplierDashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly catalog = inject(CatalogService);
  private readonly orderService = inject(OrderService);

  protected readonly supplier = this.auth.currentSupplier;

  protected readonly myProducts = computed(() => {
    const id = this.supplier()?.id;
    return this.catalog.products().filter((p) => p.supplierId === id);
  });

  protected readonly activeCount = computed(
    () => this.myProducts().filter((p) => (p.approvalStatus ?? (p.active ? 'Active' : 'Pending')) === 'Active').length,
  );

  protected readonly pendingProductCount = computed(
    () => this.myProducts().filter((p) => p.approvalStatus === 'Pending').length,
  );

  protected readonly myOrders = computed(() => {
    const id = this.supplier()?.id;
    return this.orderService.orders().filter((o) => o.supplierId === id);
  });

  protected readonly pendingOrdersCount = computed(
    () => this.myOrders().filter((o) => o.status !== 'Collected' && o.status !== 'Cancelled').length,
  );

  protected readonly completedOrdersCount = computed(
    () => this.myOrders().filter((o) => o.status === 'Collected').length,
  );

  protected readonly totalRevenue = computed(() =>
    this.myOrders().reduce((sum, o) => sum + o.totalAmount, 0),
  );

  protected readonly lowStockProducts = computed(() =>
    this.myProducts().filter((p) => p.stock <= 10),
  );

  protected readonly recentOrders = computed(() => this.myOrders().slice(0, 5));
}

