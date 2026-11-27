import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../core/models';
import { CatalogService } from '../../../../core/services/catalog.service';
import { PortalService } from '../../../../core/services/portal.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [DecimalPipe, FormsModule, StatusBadgeComponent],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class AdminProductsComponent {
  protected readonly catalog = inject(CatalogService);
  protected readonly portal = inject(PortalService);

  protected readonly search = signal('');
  protected readonly categoryFilter = signal('all');
  protected readonly supplierFilter = signal('all');
  protected readonly statusFilter = signal('all');
  protected readonly selectedProduct = signal<Product | null>(null);
  protected readonly rejectionReason = signal('');
  protected readonly feedback = signal('');

  protected readonly filteredProducts = computed(() => {
    const q = this.search().trim().toLowerCase();
    const cat = this.categoryFilter();
    const sup = this.supplierFilter();
    const st = this.statusFilter();

    return this.catalog.products().filter((p) => {
      if (cat !== 'all' && p.categorySlug !== cat) return false;
      if (sup !== 'all' && p.supplierId !== sup) return false;
      const status = this.getStatus(p);
      if (st !== 'all' && status !== st) return false;
      if (q && !`${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  protected getStatus(p: Product): string {
    return p.approvalStatus ?? (p.active ? 'Active' : 'Pending');
  }

  protected getSpecs(p: Product): [string, string][] {
    return Object.entries(p.specs);
  }

  protected inspect(p: Product): void {
    this.selectedProduct.set(p);
    this.rejectionReason.set(p.rejectionReason ?? '');
  }

  protected approve(p: Product): void {
    this.catalog.approveProduct(p.id);
    this.selectedProduct.set({ ...p, approvalStatus: 'Active', active: true });
    this.feedback.set(`"${p.name}" approved and published to Buyer Shop.`);
  }

  protected reject(p: Product): void {
    const reason = this.rejectionReason().trim();
    if (!reason) {
      this.feedback.set('Please enter a rejection reason.');
      return;
    }
    this.catalog.rejectProduct(p.id, reason);
    this.selectedProduct.set({ ...p, approvalStatus: 'Rejected', active: false, rejectionReason: reason });
    this.feedback.set(`"${p.name}" rejected and hidden from Buyer Shop.`);
  }

  protected toggleActive(p: Product): void {
    this.catalog.toggleProductActive(p.id);
    this.selectedProduct.set({ ...p, active: !p.active });
  }
}

