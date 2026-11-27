import { Routes } from '@angular/router';
import { BuyerLayoutComponent } from './shared/layouts/buyer-layout/buyer-layout';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'supplier',
    loadChildren: () =>
      import('./features/supplier/supplier.routes').then((m) => m.SUPPLIER_ROUTES),
  },
  {
    path: '',
    component: BuyerLayoutComponent,
    loadChildren: () =>
      import('./features/buyer/buyer.routes').then((m) => m.BUYER_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
