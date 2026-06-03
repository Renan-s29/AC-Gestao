import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

export interface UsuarioJwt {
  id: number;
  nome: string;
  email: string;
  role: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly tokenKey = 'ac_gestao_token';
  private readonly usuarioKey = 'ac_gestao_usuario';

  readonly usuario = signal<UsuarioJwt | null>(this.lerUsuario());

  login(email: string, senha: string) {
    return this.api.post<{ token: string; usuario: UsuarioJwt }>('/auth/login', { email, senha }).pipe(
      tap((res) => {
        if (!res.sucesso || !res.dados) return;
        localStorage.setItem(this.tokenKey, res.dados.token);
        localStorage.setItem(this.usuarioKey, JSON.stringify(res.dados.usuario));
        this.usuario.set(res.dados.usuario);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.usuario.set(null);
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string {
    return this.usuario()?.role || '';
  }

  podeVerFinanceiro(): boolean {
    const r = this.getRole();
    return r === 'admin' || r === 'financeiro' || r === 'gestor';
  }

  private lerUsuario(): UsuarioJwt | null {
    const raw = localStorage.getItem(this.usuarioKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UsuarioJwt;
    } catch {
      return null;
    }
  }
}
