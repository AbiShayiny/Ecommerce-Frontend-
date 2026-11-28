import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../../../core/models';
import { OrderService } from '../../../../core/services/order.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DecimalPipe, FormsModule, StatusBadgeComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class AdminOrdersComponent {
  protected readonly orderService = inject(OrderService);

  protected readonly search = signal('');
  protected readonly statusFilter = signal('all');
  protected readonly paymentFilter = signal('all');
  protected readonly dateFilter = signal('');
  protected readonly selectedOrder = signal<Order | null>(null);

  protected readonly filteredOrders = computed(() => {
    const q = this.search().trim().toLowerCase();
    const st = this.statusFilter();
    const pay = this.paymentFilter();
    const dt = this.dateFilter();

    return this.orderService.orders().filter((o) => {
      if (st !== 'all' && o.status !== st) return false;
      if (pay !== 'all' && o.paymentStatus !== pay) return false;
      if (dt && o.createdAt !== dt) return false;
      if (q && !`${o.orderNumber} ${o.buyerName} ${o.supplierName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  protected updateStatus(order: Order, nextStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, nextStatus);
    this.selectedOrder.set({ ...order, status: nextStatus });
  }
}

