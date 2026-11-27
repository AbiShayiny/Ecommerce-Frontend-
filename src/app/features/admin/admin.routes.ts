import { Routes } from '@angular/router';
import { adminAuthGuard } from '../../core/guards/auth.guards';
import { AdminShellComponent } from './admin-shell';
import { AdminCategoriesComponent } from './pages/categories/categories';
import { AdminDashboardComponent } from './pages/dashboard/dashboard';
import { AdminLoginComponent } from './pages/login/login';
import { AdminNotificationsComponent } from './pages/notifications/notifications';
import { AdminOrdersComponent } from './pages/orders/orders';
import { AdminProductsComponent } from './pages/products/products';
import { AdminReportsComponent } from './pages/reports/reports';
import { AdminReviewsComponent } from './pages/reviews/reviews';
import { AdminSuppliersComponent } from './pages/suppliers/suppliers';
import { AdminUsersComponent } from './pages/users/users';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: AdminLoginComponent, title: 'Admin Login — BIDLIFY' },
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard — BIDLIFY' },
      { path: 'suppliers', component: AdminSuppliersComponent, title: 'Supplier Approvals — BIDLIFY' },
      { path: 'users', component: AdminUsersComponent, title: 'User Management — BIDLIFY' },
      { path: 'products', component: AdminProductsComponent, title: 'Product Management — BIDLIFY' },
      { path: 'categories', component: AdminCategoriesComponent, title: 'Category Management — BIDLIFY' },
      { path: 'orders', component: AdminOrdersComponent, title: 'Order Management — BIDLIFY' },
      { path: 'reviews', component: AdminReviewsComponent, title: 'Reviews Moderation — BIDLIFY' },
      { path: 'notifications', component: AdminNotificationsComponent, title: 'Notifications — BIDLIFY' },
      { path: 'reports', component: AdminReportsComponent, title: 'Reports & Analytics — BIDLIFY' },
    ],
  },
];

