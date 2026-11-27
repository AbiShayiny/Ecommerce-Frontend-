import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../../core/services/catalog.service';
import { OrderService } from '../../../../core/services/order.service';
import { PortalService } from '../../../../core/services/portal.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class AdminReportsComponent {
  private readonly orderService = inject(OrderService);
  private readonly catalog = inject(CatalogService);
  private readonly portal = inject(PortalService);

  protected readonly dateRange = signal('30d');

  protected readonly totalRevenue = computed(() =>
    this.orderService.orders().reduce((sum, o) => sum + o.totalAmount, 0),
  );

  protected readonly totalOrders = computed(() => this.orderService.orders().length);

  protected readonly supplierPerformance = computed(() =>
    this.portal.suppliers().map((s) => {
      const orders = this.orderService.orders().filter((o) => o.supplierId === s.id);
      const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      return { name: s.businessName, orders: orders.length, revenue };
    }),
  );

  protected readonly topProducts = computed(() =>
    [...this.catalog.products()]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 5),
  );

  protected readonly monthlyTrends = [
    { month: 'Aug 2026', sales: 420000, pct: 49 },
    { month: 'Sep 2026', sales: 580000, pct: 67 },
    { month: 'Oct 2026', sales: 710000, pct: 82 },
    { month: 'Nov 2026', sales: 865000, pct: 100 },
  ];
}

