import { Routes } from '@angular/router';
import { buyerAuthGuard } from '../../core/guards/auth.guards';
import { CartComponent } from './pages/cart/cart';
import { CheckoutComponent } from './pages/checkout/checkout';
import { HomeComponent } from './pages/home/home';
import { MyOrdersComponent } from './pages/my-orders/my-orders';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation';
import { OrderDetailComponent } from './pages/order-detail/order-detail';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { ProductsComponent } from './pages/products/products';

export const BUYER_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'BIDLIFY — Electronics E-Commerce (Click & Collect)',
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Shop All Electronics — BIDLIFY',
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    title: 'Product Details — BIDLIFY',
  },
  {
    path: 'categories',
    component: ProductsComponent,
    title: 'Electronics Categories — BIDLIFY',
  },
  {
    path: 'categories/:slug',
    component: ProductsComponent,
    title: 'Electronics Category — BIDLIFY',
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [buyerAuthGuard],
    title: 'Shopping Cart — BIDLIFY',
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [buyerAuthGuard],
    title: 'Checkout (Click & Collect) — BIDLIFY',
  },
  {
    path: 'order-confirmation/:id',
    component: OrderConfirmationComponent,
    canActivate: [buyerAuthGuard],
    title: 'Order Confirmation — BIDLIFY',
  },
  {
    path: 'orders',
    component: MyOrdersComponent,
    canActivate: [buyerAuthGuard],
    title: 'My Orders — BIDLIFY',
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
    canActivate: [buyerAuthGuard],
    title: 'Order Details — BIDLIFY',
  },
];

