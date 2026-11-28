import { Injectable, computed, signal } from '@angular/core';
import { MOCK_ADMIN_USER, MOCK_BUYERS, MOCK_SUPPLIERS } from '../data/mock-data';
import { AdminUser, BuyerUser, SupplierUser } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentBuyer = signal<BuyerUser | null>(null);
  readonly currentSupplier = signal<SupplierUser | null>(null);
  readonly currentAdmin = signal<AdminUser | null>(null);

  readonly googleModalOpen = signal<boolean>(false);
  private pendingBuyerAction: (() => void) | null = null;

  readonly isBuyerSignedIn = computed(() => this.currentBuyer() !== null);
  readonly isApprovedSupplier = computed(
    () => this.currentSupplier()?.approvalStatus === 'Approved',
  );
  readonly isAdminSignedIn = computed(() => this.currentAdmin() !== null);

  openGoogleSignIn(afterSignIn?: () => void): void {
    this.pendingBuyerAction = afterSignIn ?? null;
    this.googleModalOpen.set(true);
  }

  closeGoogleSignIn(): void {
    this.googleModalOpen.set(false);
    this.pendingBuyerAction = null;
  }

  signInBuyerWithGoogle(email?: string, name?: string): void {
    const baseBuyer = MOCK_BUYERS[0];
    const buyer: BuyerUser = {
      ...baseBuyer,
      name: name?.trim() || baseBuyer.name,
      email: email?.trim() || baseBuyer.email,
    };
    this.currentBuyer.set(buyer);
    this.googleModalOpen.set(false);
    const callback = this.pendingBuyerAction;
    this.pendingBuyerAction = null;
    callback?.();
  }

  signOutBuyer(): void {
    this.currentBuyer.set(null);
  }

  loginSupplier(
    email: string,
    _password: string,
    allSuppliers: SupplierUser[] = MOCK_SUPPLIERS,
  ): { ok: boolean; message: string; supplier?: SupplierUser } {
    const match = allSuppliers.find(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!match) {
      return { ok: false, message: 'No supplier account found with that email address.' };
    }
    if (match.approvalStatus === 'Pending') {
      this.currentSupplier.set(match);
      return {
        ok: false,
        message: 'Your supplier account is currently pending Admin approval.',
        supplier: match,
      };
    }
    if (match.approvalStatus === 'Rejected') {
      return {
        ok: false,
        message: 'Your supplier application was rejected. Please contact BIDLIFY support.',
        supplier: match,
      };
    }
    this.currentSupplier.set(match);
    return { ok: true, message: 'Signed in successfully.', supplier: match };
  }

  signOutSupplier(): void {
    this.currentSupplier.set(null);
  }

  loginAdmin(email: string, _password: string): { ok: boolean; message: string } {
    if (!email.trim().includes('@')) {
      return { ok: false, message: 'Enter a valid Admin email address.' };
    }
    this.currentAdmin.set({
      ...MOCK_ADMIN_USER,
      email: email.trim(),
    });
    return { ok: true, message: 'Signed in to BIDLIFY Admin.' };
  }

  signOutAdmin(): void {
    this.currentAdmin.set(null);
  }
}

