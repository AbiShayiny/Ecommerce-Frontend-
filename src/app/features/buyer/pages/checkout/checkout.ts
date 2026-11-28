import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { OrderService } from '../../../../core/services/order.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule, EmptyStateComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent {
  protected readonly auth = inject(AuthService);
  protected readonly cart = inject(CartService);
  protected readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly contactName = signal(this.auth.currentBuyer()?.name ?? '');
  protected readonly contactEmail = signal(this.auth.currentBuyer()?.email ?? '');
  protected readonly contactPhone = signal('+94 77 123 4567');
  protected readonly selectedBranchId = signal(this.cart.selectedBranchId());
  protected readonly paymentMethod = signal('Merchant QR / Bank Transfer');
  protected readonly paymentReference = signal('');
  protected readonly paymentReceiptName = signal('');
  protected readonly formError = signal('');

  protected onBranchChange(branchId: string): void {
    this.selectedBranchId.set(branchId);
    this.cart.selectedBranchId.set(branchId);
  }

  protected onReceiptSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.paymentReceiptName.set(file ? file.name : '');
  }

  protected placeOrder(): void {
    const name = this.contactName().trim();
    const email = this.contactEmail().trim();
    const phone = this.contactPhone().trim();
    const branch = this.cart.branches().find((b) => b.id === this.selectedBranchId());

    if (!name || !email || !phone) {
      this.formError.set('Please complete all required buyer contact fields.');
      return;
    }
    if (!branch) {
      this.formError.set('Please select a Click & Collect branch.');
      return;
    }
    const items = this.cart.items();
    if (items.length === 0) {
      this.formError.set('Your cart is empty.');
      return;
    }

    this.formError.set('');
    const buyer = this.auth.currentBuyer();
    const hasRef = Boolean(this.paymentReference().trim() || this.paymentReceiptName());

    const created = this.orderService.createOrder({
      buyerId: buyer?.id ?? 'buyer-01',
      buyerName: name,
      buyerEmail: email,
      supplierId: items[0].supplierId,
      supplierName: items[0].supplierName,
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.name,
        quantity: i.quantity,
        unitPrice: i.price,
        imageUrl: i.imageUrl,
      })),
      totalAmount: this.cart.subtotal(),
      pickupBranchId: branch.id,
      pickupBranchName: branch.name,
      pickupAddress: branch.address,
      status: hasRef ? 'Payment Submitted' : 'Pending Payment',
      paymentMethod: this.paymentMethod(),
      paymentReference: this.paymentReference().trim() || undefined,
      paymentReceiptName: this.paymentReceiptName() || undefined,
      paymentStatus: 'Pending',
    });

    this.cart.clearCart();
    void this.router.navigate(['/order-confirmation', created.id]);
  }

  protected backToShop(): void {
    void this.router.navigate(['/products']);
  }
}

