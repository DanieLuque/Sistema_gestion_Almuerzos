import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'menu',
    loadComponent: () => import('./features/menu/menu.component').then(m => m.MenuComponent)
  },
  {
    path: 'reservas',
    loadComponent: () => import('./features/reservas/reservas.component').then(m => m.ReservasComponent)
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./features/pedidos/pedidos.component').then(m => m.PedidosComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
