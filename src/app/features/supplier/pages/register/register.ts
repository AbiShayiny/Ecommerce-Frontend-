import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { PortalService } from '../../../../core/services/portal.service';

@Component({
  selector: 'app-supplier-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class SupplierRegisterComponent {
  private readonly portal = inject(PortalService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly businessName = signal('');
  protected readonly businessType = signal('Private Limited (Pvt Ltd)');
  protected readonly businessRegNo = signal('');
  protected readonly email = signal('');
  protected readonly phone = signal('');
  protected readonly businessAddress = signal('');
  protected readonly district = signal('');
  protected readonly city = signal('');
  protected readonly businessDescription = signal('');

  protected readonly ownerName = signal('');
  protected readonly nicNumber = signal('');
  protected readonly ownerEmail = signal('');
  protected readonly ownerMobile = signal('');
  protected readonly residentialAddress = signal('');

  protected readonly nicFrontFileName = signal('');
  protected readonly nicBackFileName = signal('');
  protected readonly businessRegDocName = signal('');

  protected readonly error = signal('');
  protected readonly submitted = signal(false);

  protected onFile(target: 'front' | 'back' | 'reg', event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]?.name ?? '';
    if (target === 'front') this.nicFrontFileName.set(file);
    else if (target === 'back') this.nicBackFileName.set(file);
    else this.businessRegDocName.set(file);
  }

  protected submit(): void {
    if (
      !this.businessName().trim() ||
      !this.businessRegNo().trim() ||
      !this.email().trim() ||
      !this.phone().trim() ||
      !this.businessAddress().trim() ||
      !this.district().trim() ||
      !this.city().trim() ||
      !this.businessDescription().trim() ||
      !this.ownerName().trim() ||
      !this.nicNumber().trim() ||
      !this.ownerEmail().trim() ||
      !this.ownerMobile().trim() ||
      !this.residentialAddress().trim() ||
      !this.nicFrontFileName() ||
      !this.nicBackFileName() ||
      !this.businessRegDocName()
    ) {
      this.error.set('Please complete all required business, owner, and verification document fields.');
      return;
    }

    this.error.set('');
    const created = this.portal.registerSupplier({
      businessName: this.businessName().trim(),
      businessType: this.businessType(),
      businessRegNo: this.businessRegNo().trim(),
      email: this.email().trim(),
      phone: this.phone().trim(),
      businessAddress: this.businessAddress().trim(),
      district: this.district().trim(),
      city: this.city().trim(),
      businessDescription: this.businessDescription().trim(),
      ownerName: this.ownerName().trim(),
      ownerEmail: this.ownerEmail().trim(),
      ownerMobile: this.ownerMobile().trim(),
      nicNumber: this.nicNumber().trim(),
      residentialAddress: this.residentialAddress().trim(),
      nicFrontFileName: this.nicFrontFileName(),
      nicBackFileName: this.nicBackFileName(),
      businessRegDocName: this.businessRegDocName(),
    });

    this.auth.currentSupplier.set(created);
    this.submitted.set(true);
  }

  protected goToPending(): void {
    void this.router.navigate(['/supplier/pending-approval']);
  }
}

