import { Injectable, computed, signal } from '@angular/core';
import { MOCK_PICKUP_BRANCHES } from '../data/mock-data';
import { CartItem, PickupBranch, Product } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);
  readonly branches = signal<PickupBranch[]>([...MOCK_PICKUP_BRANCHES]);
  readonly selectedBranchId = signal<string>(MOCK_PICKUP_BRANCHES[0].id);

  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  readonly selectedBranch = computed(
    () =>
      this.branches().find((b) => b.id === this.selectedBranchId()) ??
      this.branches()[0],
  );

  addItem(product: Product, quantity = 1): void {
    this.items.update((list) => {
      const existing = list.find((i) => i.productId === product.id);
      if (existing) {
        return list.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxStock) }
            : i,
        );
      }
      return [
        ...list,
        {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          imageUrl: product.imageUrl,
          supplierId: product.supplierId,
          supplierName: product.supplierName,
          quantity: Math.min(quantity, product.stock),
          maxStock: product.stock,
        },
      ];
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update((list) =>
      list.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, i.maxStock) }
          : i,
      ),
    );
  }

  removeItem(productId: string): void {
    this.items.update((list) => list.filter((i) => i.productId !== productId));
  }

  clearCart(): void {
    this.items.set([]);
  }
}

