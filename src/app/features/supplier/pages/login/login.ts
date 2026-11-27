import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { PortalService } from '../../../../core/services/portal.service';

@Component({
  selector: 'app-supplier-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class SupplierLoginComponent {
  private readonly auth = inject(AuthService);
  private readonly portal = inject(PortalService);
  private readonly router = inject(Router);

  protected readonly email = signal('supplier@bidlify.lk');
  protected readonly password = signal('Supplier@2026');
  protected readonly error = signal('');

  protected login(): void {
    if (!this.email().trim() || !this.password().trim()) {
      this.error.set('Please enter both email and password.');
      return;
    }

    const res = this.auth.loginSupplier(
      this.email(),
      this.password(),
      this.portal.suppliers(),
    );

    if (res.supplier?.approvalStatus === 'Pending') {
      void this.router.navigate(['/supplier/pending-approval']);
      return;
    }

    if (!res.ok) {
      this.error.set(res.message);
      return;
    }

    this.error.set('');
    void this.router.navigate(['/supplier/dashboard']);
  }
}

