export interface BuyerUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  status: 'Active' | 'Suspended';
  ordersCount: number;
  joinedAt: string;
}

export type SupplierApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface SupplierUser {
  id: string;
  businessName: string;
  businessType?: string;
  businessRegNo: string;
  email: string;
  phone: string;
  businessAddress: string;
  district?: string;
  city?: string;
  businessDescription?: string;
  ownerName: string;
  ownerEmail?: string;
  ownerMobile?: string;
  nicNumber: string;
  residentialAddress: string;
  nicFrontFileName: string;
  nicBackFileName: string;
  businessRegDocName?: string;
  approvalStatus: SupplierApprovalStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin';
  permissions: string[];
}

export interface AppNotification {
  id: string;
  recipientRole: 'supplier' | 'admin' | 'buyer' | 'all';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
}

