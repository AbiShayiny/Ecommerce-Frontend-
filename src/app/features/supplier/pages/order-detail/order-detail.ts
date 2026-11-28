import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderStatus } from '../../../../core/models';
import { OrderService } from '../../../../core/services/order.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-supplier-order-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class SupplierOrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  protected readonly orderId = signal('');
  protected readonly statusHistory = signal<string[]>([]);
  protected readonly order = computed(() =>
    this.orderService.getOrderById(this.orderId()),
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.orderId.set(id);
      const found = this.orderService.getOrderById(id);
      if (found) {
        this.statusHistory.set([`Initial status: ${found.status} (${found.createdAt})`]);
      }
    });
  }

  protected updateStatus(nextStatus: OrderStatus): void {
    const current = this.order();
    if (!current || current.status === nextStatus) return;
    this.orderService.updateOrderStatus(current.id, nextStatus);
    this.statusHistory.update((h) => [
      ...h,
      `Updated to ${nextStatus} (${new Date().toLocaleTimeString()})`,
    ]);
  }
}

