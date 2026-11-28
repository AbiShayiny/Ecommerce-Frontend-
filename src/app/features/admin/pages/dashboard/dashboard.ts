import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../../core/services/catalog.service';
import { OrderService } from '../../../../core/services/order.service';
import { PortalService } from '../../../../core/services/portal.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe, StatusBadgeComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboardComponent {
  protected readonly portal = inject(PortalService);
  protected readonly catalog = inject(CatalogService);
  protected readonly orderService = inject(OrderService);

  protected readonly pendingProducts = computed(
    () => this.catalog.products().filter((p) => p.approvalStatus === 'Pending').length,
  );

  protected readonly completedOrders = computed(
    () => this.orderService.orders().filter((o) => o.status === 'Collected').length,
  );

  protected readonly totalRevenue = computed(() =>
    this.orderService.orders().reduce((sum, o) => sum + o.totalAmount, 0),
  );

  protected readonly recentOrders = computed(() => this.orderService.orders().slice(0, 4));
  protected readonly recentSuppliers = computed(() => this.portal.suppliers().slice(0, 4));

  protected readonly categoryBreakdown = computed(() => {
    const products = this.catalog.products();
    return this.catalog.categories().map((c) => {
      const count = products.filter((p) => p.categoryId === c.id).length;
      const pct = products.length ? Math.round((count / products.length) * 100) : 0;
      return { name: c.name, count, pct };
    });
  });

  protected readonly monthlySales = [
    { month: 'Aug', value: 420000, pct: 48 },
    { month: 'Sep', value: 580000, pct: 66 },
    { month: 'Oct', value: 710000, pct: 82 },
    { month: 'Nov', value: 865000, pct: 100 },
  ];
}

