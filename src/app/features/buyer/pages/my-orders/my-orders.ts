import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { OrderService } from '../../../../core/services/order.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [RouterLink, DecimalPipe, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.scss',
})
export class MyOrdersComponent {
  private readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly buyerOrders = computed(() => {
    const buyer = this.auth.currentBuyer();
    if (!buyer) return [];
    return this.orderService
      .orders()
      .filter((o) => o.buyerId === buyer.id || o.buyerEmail === buyer.email);
  });

  protected browseShop(): void {
    void this.router.navigate(['/products']);
  }
}

