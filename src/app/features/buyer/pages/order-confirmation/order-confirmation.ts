import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [RouterLink, DecimalPipe, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.scss',
})
export class OrderConfirmationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  protected readonly orderId = signal('');
  protected readonly order = computed(() =>
    this.orderService.getOrderById(this.orderId()),
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.orderId.set(params.get('id') ?? '');
    });
  }

  protected goToOrders(): void {
    void this.router.navigate(['/orders']);
  }
}

