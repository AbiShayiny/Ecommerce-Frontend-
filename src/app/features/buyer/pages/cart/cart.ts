import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, DecimalPipe, EmptyStateComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent {
  protected readonly cart = inject(CartService);
  private readonly router = inject(Router);

  protected increment(productId: string, currentQty: number, maxStock: number): void {
    if (currentQty < maxStock) {
      this.cart.updateQuantity(productId, currentQty + 1);
    }
  }

  protected decrement(productId: string, currentQty: number): void {
    if (currentQty > 1) {
      this.cart.updateQuantity(productId, currentQty - 1);
    }
  }

  protected removeItem(productId: string): void {
    this.cart.removeItem(productId);
  }

  protected continueShopping(): void {
    void this.router.navigate(['/products']);
  }
}

