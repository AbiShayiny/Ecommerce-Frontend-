import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-supplier-products',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule, StatusBadgeComponent, EmptyStateComponent],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class SupplierProductsComponent {
  private readonly auth = inject(AuthService);
  protected readonly catalog = inject(CatalogService);

  protected readonly search = signal('');
  protected readonly categoryFilter = signal('all');
  protected readonly statusFilter = signal('all');

  protected readonly filteredProducts = computed(() => {
    const supId = this.auth.currentSupplier()?.id;
    const q = this.search().trim().toLowerCase();
    const cat = this.categoryFilter();
    const st = this.statusFilter();

    return this.catalog.products().filter((p) => {
      if (p.supplierId !== supId) return false;
      if (cat !== 'all' && p.categorySlug !== cat) return false;
      const status = this.getStatus(p);
      if (st !== 'all' && status !== st) return false;
      if (q && !`${p.name} ${p.brand} ${p.sku}`.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  protected getStatus(p: Product): string {
    return p.approvalStatus ?? (p.active ? 'Active' : 'Pending');
  }

  protected deleteProduct(p: Product): void {
    if (confirm(`Delete "${p.name}" from your electronics catalog?`)) {
      this.catalog.deleteProduct(p.id);
    }
  }
}

