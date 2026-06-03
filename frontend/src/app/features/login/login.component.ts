import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly erro = signal<string | null>(null);
  readonly carregando = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['admin@acgestao.local', [Validators.required, Validators.email]],
    senha: ['password', [Validators.required]],
  });

  entrar() {
    if (this.form.invalid) return;
    this.erro.set(null);
    this.carregando.set(true);
    const { email, senha } = this.form.getRawValue();
    this.auth.login(email, senha).subscribe({
      next: (res) => {
        this.carregando.set(false);
        if (res.sucesso) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.erro.set(res.mensagem || 'Falha no login.');
        }
      },
      error: (e) => {
        this.carregando.set(false);
        this.erro.set(e?.error?.mensagem || 'Não foi possível autenticar.');
      },
    });
  }
}
