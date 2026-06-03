import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  path: string;
  roles?: string[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly itens: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Associados', icon: 'groups', path: '/associados' },
    { label: 'Financeiro', icon: 'account_balance', path: '/financeiro', roles: ['admin', 'financeiro', 'gestor'] },
    { label: 'SCPC / Boa Vista', icon: 'manage_search', path: '/dashboard' },
    { label: 'Benefícios (Saúde)', icon: 'health_and_safety', path: '/beneficios' },
    { label: 'Relatórios', icon: 'article', path: '/relatorios', roles: ['admin', 'financeiro', 'gestor'] },
    { label: 'Configurações', icon: 'settings', path: '/dashboard', roles: ['admin'] },
  ];

  readonly itensVisiveis = computed(() => {
    const role = this.auth.getRole();
    return this.itens.filter((i) => !i.roles || i.roles.includes(role) || role === 'admin');
  });

  readonly usuario = this.auth.usuario;

  buscarAssociado(valor: string) {
    this.router.navigate(['/associados'], { queryParams: { q: valor || null } });
  }

  sair() {
    this.auth.logout();
  }
}
