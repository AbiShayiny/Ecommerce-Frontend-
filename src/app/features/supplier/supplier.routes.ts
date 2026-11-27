import { Routes } from '@angular/router';
import { approvedSupplierGuard } from '../../core/guards/auth.guards';
import { SupplierShellComponent } from './supplier-shell';
import { SupplierDashboardComponent } from './pages/dashboard/dashboard';
import { SupplierInventoryComponent } from './pages/inventory/inventory';
import { SupplierLoginComponent } from './pages/login/login';
import { SupplierOrderDetailComponent } from './pages/order-detail/order-detail';
import { SupplierOrdersComponent } from './pages/orders/orders';
import { SupplierPaymentsComponent } from './pages/payments/payments';
import { PendingApprovalComponent } from './pages/pending-approval/pending-approval';
import { ProductFormComponent } from './pages/product-form/product-form';
import { SupplierProductsComponent } from './pages/products/products';
import { SupplierProfileComponent } from './pages/profile/profile';
import { SupplierRegisterComponent } from './pages/register/register';

export const SUPPLIER_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: SupplierLoginComponent, title: 'Supplier Login — BIDLIFY' },
  { path: 'register', component: SupplierRegisterComponent, title: 'Supplier Registration — BIDLIFY' },
  { path: 'pending-approval', component: PendingApprovalComponent, title: 'Pending Approval — BIDLIFY' },
  {
    path: '',
    component: SupplierShellComponent,
    canActivate: [approvedSupplierGuard],
    children: [
      { path: 'dashboard', component: SupplierDashboardComponent, title: 'Supplier Dashboard — BIDLIFY' },
      { path: 'profile', component: SupplierProfileComponent, title: 'Supplier Profile — BIDLIFY' },
      { path: 'products', component: SupplierProductsComponent, title: 'My Products — BIDLIFY' },
      { path: 'products/new', component: ProductFormComponent, title: 'Add Product — BIDLIFY' },
      { path: 'products/:id/edit', component: ProductFormComponent, title: 'Edit Product — BIDLIFY' },
      { path: 'inventory', component: SupplierInventoryComponent, title: 'Inventory Management — BIDLIFY' },
      { path: 'orders', component: SupplierOrdersComponent, title: 'Supplier Orders — BIDLIFY' },
      { path: 'orders/:id', component: SupplierOrderDetailComponent, title: 'Order Details — BIDLIFY' },
      { path: 'payments', component: SupplierPaymentsComponent, title: 'Payment & Settlement — BIDLIFY' },
    ],
  },
];

