import { Injectable, computed, signal } from '@angular/core';
import {
  MOCK_BUYERS,
  MOCK_NOTIFICATIONS,
  MOCK_SUPPLIERS,
} from '../data/mock-data';
import {
  AppNotification,
  BuyerUser,
  SupplierApprovalStatus,
  SupplierUser,
} from '../models';

@Injectable({ providedIn: 'root' })
export class PortalService {
  readonly suppliers = signal<SupplierUser[]>([...MOCK_SUPPLIERS]);
  readonly buyers = signal<BuyerUser[]>([...MOCK_BUYERS]);
  readonly notifications = signal<AppNotification[]>([...MOCK_NOTIFICATIONS]);

  readonly pendingSuppliersCount = computed(
    () => this.suppliers().filter((s) => s.approvalStatus === 'Pending').length,
  );

  registerSupplier(
    payload: Omit<SupplierUser, 'id' | 'approvalStatus' | 'createdAt'>,
  ): SupplierUser {
    const created: SupplierUser = {
      ...payload,
      id: `sup-${Date.now()}`,
      approvalStatus: 'Pending',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.suppliers.update((list) => [created, ...list]);
    this.addNotification({
      recipientRole: 'admin',
      title: 'New Supplier Registration',
      message: `${created.businessName} registered and awaits Admin approval.`,
      type: 'warning',
    });
    return created;
  }

  setSupplierApproval(
    supplierId: string,
    status: SupplierApprovalStatus,
    rejectionReason?: string,
  ): void {
    this.suppliers.update((list) =>
      list.map((s) =>
        s.id === supplierId
          ? {
              ...s,
              approvalStatus: status,
              rejectionReason: status === 'Rejected' ? rejectionReason : undefined,
            }
          : s,
      ),
    );
  }

  updateSupplierProfile(supplierId: string, patch: Partial<SupplierUser>): SupplierUser | undefined {
    let updated: SupplierUser | undefined;
    this.suppliers.update((list) =>
      list.map((s) => {
        if (s.id !== supplierId) return s;
        updated = { ...s, ...patch };
        return updated;
      }),
    );
    return updated;
  }

  toggleBuyerStatus(buyerId: string): void {
    this.buyers.update((list) =>
      list.map((b) =>
        b.id === buyerId
          ? { ...b, status: b.status === 'Active' ? 'Suspended' : 'Active' }
          : b,
      ),
    );
  }

  getNotificationsFor(role: 'supplier' | 'admin'): AppNotification[] {
    return this.notifications().filter((n) => n.recipientRole === role);
  }

  markNotificationRead(id: string): void {
    this.notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  addNotification(
    payload: Omit<AppNotification, 'id' | 'read' | 'createdAt'>,
  ): void {
    const created: AppNotification = {
      ...payload,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    this.notifications.update((list) => [created, ...list]);
  }
}

