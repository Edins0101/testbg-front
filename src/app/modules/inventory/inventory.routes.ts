import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./products/product-list.component').then(m => m.ProductListComponent) },
  { path: 'products/new', loadComponent: () => import('./products/product-form.component').then(m => m.ProductFormComponent) },
  { path: 'products/:id/edit', loadComponent: () => import('./products/product-form.component').then(m => m.ProductFormComponent) },

  { path: 'suppliers', loadComponent: () => import('./suppliers/supplier-list.component').then(m => m.SupplierListComponent) },
  { path: 'suppliers/new', loadComponent: () => import('./suppliers/supplier-form.component').then(m => m.SupplierFormComponent) },
  { path: 'suppliers/:id/edit', loadComponent: () => import('./suppliers/supplier-form.component').then(m => m.SupplierFormComponent) },

  { path: 'product-suppliers', loadComponent: () => import('./ps/ps-search.component').then(m => m.PsSearchComponent) },
  { path: 'product-suppliers/:productId', loadComponent: () => import('./ps/ps-list.component').then(m => m.PsSearchComponent) },
];
