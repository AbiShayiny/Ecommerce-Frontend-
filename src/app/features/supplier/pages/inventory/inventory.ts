import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-supplier-inventory',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class SupplierInventoryComponent {
  private readonly auth = inject(AuthService);
  protected readonly catalog = inject(CatalogService);
  protected readonly feedback = signal('');

  protected readonly myProducts = computed(() => {
    const supId = this.auth.currentSupplier()?.id;
    return this.catalog.products().filter((p) => p.supplierId === supId);
  });

  protected readonly lowStockCount = computed(
    () => this.myProducts().filter((p) => p.stock <= 10).length,
  );

  protected getStockStatus(stock: number): string {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
  }

  protected changeStock(productId: string, nextValue: number): void {
    const safe = Math.max(0, Math.floor(Number(nextValue) || 0));
    this.catalog.updateStock(productId, safe);
    this.feedback.set('Stock updated and synchronized.');
    setTimeout(() => this.feedback.set(''), 2000);
  }
}

