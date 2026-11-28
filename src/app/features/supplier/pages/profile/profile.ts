import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { PortalService } from '../../../../core/services/portal.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-supplier-profile',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class SupplierProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly portal = inject(PortalService);

  protected readonly supplier = this.auth.currentSupplier;

  protected readonly businessName = signal(this.supplier()?.businessName ?? '');
  protected readonly phone = signal(this.supplier()?.phone ?? '');
  protected readonly businessAddress = signal(this.supplier()?.businessAddress ?? '');
  protected readonly city = signal(this.supplier()?.city ?? '');
  protected readonly ownerName = signal(this.supplier()?.ownerName ?? '');
  protected readonly residentialAddress = signal(this.supplier()?.residentialAddress ?? '');
  protected readonly savedMessage = signal('');

  protected saveProfile(): void {
    const sup = this.supplier();
    if (!sup) return;

    const updated = this.portal.updateSupplierProfile(sup.id, {
      businessName: this.businessName().trim(),
      phone: this.phone().trim(),
      businessAddress: this.businessAddress().trim(),
      city: this.city().trim(),
      ownerName: this.ownerName().trim(),
      residentialAddress: this.residentialAddress().trim(),
    });

    if (updated) {
      this.auth.currentSupplier.set(updated);
      this.savedMessage.set('Supplier profile updated successfully.');
    }
  }
}

