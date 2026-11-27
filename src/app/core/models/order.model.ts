export interface PickupBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  hours: string;
}

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  maxStock: number;
}

export interface PaymentConfig {
  showPaymentQr: boolean;
  qrLabel: string;
  allowReferenceSubmission: boolean;
  allowReceiptUpload: boolean;
  instructions: string;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Payment Submitted'
  | 'Confirmed'
  | 'Ready for Pickup'
  | 'Collected'
  | 'Cancelled';

export type PaymentVerificationStatus = 'Pending' | 'Verified' | 'Flagged';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  totalAmount: number;
  pickupBranchId: string;
  pickupBranchName: string;
  pickupAddress: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentReference?: string;
  paymentReceiptName?: string;
  paymentStatus: PaymentVerificationStatus;
  createdAt: string;
}

