import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupplierUser } from '../../../../core/models';
import { PortalService } from '../../../../core/services/portal.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-admin-suppliers',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss',
})
export class AdminSuppliersComponent {
  protected readonly portal = inject(PortalService);

  protected readonly search = signal('');
  protected readonly statusFilter = signal('all');
  protected readonly selectedSupplier = signal<SupplierUser | null>(null);
  protected readonly rejectionReason = signal('');
  protected readonly feedback = signal('');

  protected readonly filteredSuppliers = computed(() => {
    const q = this.search().trim().toLowerCase();
    const st = this.statusFilter();
    return this.portal.suppliers().filter((s) => {
      if (st !== 'all' && s.approvalStatus !== st) return false;
      if (q && !`${s.businessName} ${s.ownerName} ${s.email} ${s.nicNumber}`.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  protected inspect(sup: SupplierUser): void {
    this.selectedSupplier.set(sup);
    this.rejectionReason.set(sup.rejectionReason ?? '');
  }

  protected approve(sup: SupplierUser): void {
    if (!confirm(`Approve supplier "${sup.businessName}"?`)) return;
    this.portal.setSupplierApproval(sup.id, 'Approved');
    this.selectedSupplier.set({ ...sup, approvalStatus: 'Approved' });
    this.feedback.set(`${sup.businessName} approved for Supplier Portal access.`);
  }

  protected reject(sup: SupplierUser): void {
    const reason = this.rejectionReason().trim();
    if (!reason) {
      this.feedback.set('Please enter a rejection reason before rejecting.');
      return;
    }
    if (!confirm(`Reject supplier "${sup.businessName}"?`)) return;
    this.portal.setSupplierApproval(sup.id, 'Rejected', reason);
    this.selectedSupplier.set({ ...sup, approvalStatus: 'Rejected', rejectionReason: reason });
    this.feedback.set(`${sup.businessName} marked as Rejected.`);
  }
}

