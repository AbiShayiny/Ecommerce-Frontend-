import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortalService } from '../../../../core/services/portal.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';

interface UnifiedUser {
  id: string;
  name: string;
  email: string;
  role: 'Buyer' | 'Supplier';
  status: string;
  detail: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class AdminUsersComponent {
  private readonly portal = inject(PortalService);

  protected readonly search = signal('');
  protected readonly roleFilter = signal('all');
  protected readonly statusFilter = signal('all');
  protected readonly selectedUser = signal<UnifiedUser | null>(null);

  protected readonly users = computed<UnifiedUser[]>(() => {
    const buyers: UnifiedUser[] = this.portal.buyers().map((b) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      role: 'Buyer',
      status: b.status,
      detail: `Google Sign-In Buyer • ${b.ordersCount} order(s) • Joined ${b.joinedAt}`,
    }));
    const suppliers: UnifiedUser[] = this.portal.suppliers().map((s) => ({
      id: s.id,
      name: s.ownerName,
      email: s.email,
      role: 'Supplier',
      status: s.approvalStatus,
      detail: `${s.businessName} • NIC: ${s.nicNumber}`,
    }));
    return [...buyers, ...suppliers];
  });

  protected readonly filteredUsers = computed(() => {
    const q = this.search().trim().toLowerCase();
    const role = this.roleFilter();
    const st = this.statusFilter();
    return this.users().filter((u) => {
      if (role !== 'all' && u.role !== role) return false;
      if (st !== 'all' && u.status !== st) return false;
      if (q && !`${u.name} ${u.email}`.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  protected toggleBuyer(id: string): void {
    this.portal.toggleBuyerStatus(id);
  }
}

