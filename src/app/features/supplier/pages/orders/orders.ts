import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { OrderService } from '../../../../core/services/order.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-supplier-orders',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class SupplierOrdersComponent {
  private readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);

  protected readonly search = signal('');
  protected readonly statusFilter = signal('all');

  protected readonly filteredOrders = computed(() => {
    const supId = this.auth.currentSupplier()?.id;
    const q = this.search().trim().toLowerCase();
    const st = this.statusFilter();

    return this.orderService.orders().filter((o) => {
      if (o.supplierId !== supId) return false;
      if (st !== 'all' && o.status !== st) return false;
      if (q) {
        const text = `${o.orderNumber} ${o.buyerName} ${o.pickupBranchName} ${o.items.map((i) => i.productName).join(' ')}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  });
}

