import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent],
  templateUrl: './pending-approval.html',
  styleUrl: './pending-approval.scss',
})
export class PendingApprovalComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.signOutSupplier();
    void this.router.navigate(['/supplier/login']);
  }
}

