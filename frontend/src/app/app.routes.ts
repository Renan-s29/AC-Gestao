import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'associados',
        loadComponent: () => import('./features/associados/associados-lista.component').then((m) => m.AssociadosListaComponent),
      },
      {
        path: 'associados/:id',
        loadComponent: () =>
          import('./features/associado-ficha/associado-ficha.component').then((m) => m.AssociadoFichaComponent),
      },
      {
        path: 'financeiro',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'financeiro', 'gestor'] },
        loadComponent: () => import('./features/financeiro/financeiro.component').then((m) => m.FinanceiroComponent),
      },
      {
        path: 'beneficios',
        loadComponent: () => import('./features/beneficios/beneficios.component').then((m) => m.BeneficiosComponent),
      },
      {
        path: 'relatorios',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'financeiro', 'gestor'] },
        loadComponent: () => import('./features/relatorios/relatorios.component').then((m) => m.RelatoriosComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
