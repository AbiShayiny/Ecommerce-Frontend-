import { Injectable, signal } from '@angular/core';
import { MOCK_ORDERS, MOCK_PAYMENT_CONFIG } from '../data/mock-data';
import {
  Order,
  OrderStatus,
  PaymentConfig,
  PaymentVerificationStatus,
} from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  readonly orders = signal<Order[]>([...MOCK_ORDERS]);
  readonly paymentConfig = signal<PaymentConfig>({ ...MOCK_PAYMENT_CONFIG });

  getOrderById(id: string): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }

  createOrder(payload: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order {
    const orderNumber = `BLF-2026-${1003 + this.orders().length}`;
    const created: Order = {
      ...payload,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.orders.update((list) => [created, ...list]);
    return created;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.orders.update((list) =>
      list.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }

  updatePaymentVerification(
    orderId: string,
    paymentStatus: PaymentVerificationStatus,
  ): void {
    this.orders.update((list) =>
      list.map((o) => {
        if (o.id !== orderId) {
          return o;
        }
        const nextOrderStatus: OrderStatus =
          paymentStatus === 'Verified' &&
          (o.status === 'Pending Payment' || o.status === 'Payment Submitted')
            ? 'Confirmed'
            : o.status;
        return { ...o, paymentStatus, status: nextOrderStatus };
      }),
    );
  }

  updatePaymentConfig(patch: Partial<PaymentConfig>): void {
    this.paymentConfig.update((cfg) => ({ ...cfg, ...patch }));
  }
}

