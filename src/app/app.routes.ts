import { Routes } from '@angular/router';
import { authGuard, authMatchGuard } from './shared/guards/auth.guard';
import { ShellComponent } from './modules/layout/shell.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent) },

  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'inventory',
        canMatch: [authMatchGuard], // <- bloquea incluso la carga del módulo lazy
        loadChildren: () =>
          import('./modules/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES),
      },
      { path: '', pathMatch: 'full', redirectTo: 'inventory' },
    ]
  },

  { path: '**', redirectTo: '' }
];
