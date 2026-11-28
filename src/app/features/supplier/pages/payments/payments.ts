import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { OrderService } from '../../../../core/services/order.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-supplier-payments',
  standalone: true,
  imports: [DecimalPipe, StatusBadgeComponent],
  templateUrl: './payments.html',
  styleUrl: './payments.scss',
})
export class SupplierPaymentsComponent {
  private readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);

  protected readonly commissionRate = 0.05;

  protected readonly supplierOrders = computed(() => {
    const supId = this.auth.currentSupplier()?.id;
    return this.orderService.orders().filter((o) => o.supplierId === supId);
  });

  protected readonly grossEarnings = computed(() =>
    this.supplierOrders().reduce((sum, o) => sum + o.totalAmount, 0),
  );

  protected readonly totalCommission = computed(() =>
    Math.round(this.grossEarnings() * this.commissionRate),
  );

  protected readonly netEarnings = computed(
    () => this.grossEarnings() - this.totalCommission(),
  );

  protected verifyPayment(orderId: string): void {
    this.orderService.updatePaymentVerification(orderId, 'Verified');
  }
}

