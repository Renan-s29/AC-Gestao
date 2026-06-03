import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './beneficios.component.html',
  styleUrl: './beneficios.component.scss',
})
export class BeneficiosComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({ associado_id: ['1'] });
  readonly resultado = signal<any | null>(null);
  readonly erro = signal<string | null>(null);

  consultar() {
    const id = this.form.getRawValue().associado_id;
    this.erro.set(null);
    this.api.get<any>(`/associados/${id}/beneficios/status`).subscribe({
      next: (r) => {
        if (r.sucesso) this.resultado.set(r.dados);
        else this.erro.set(r.mensagem || 'Falha na consulta.');
      },
      error: (e) => this.erro.set(e?.error?.mensagem || 'Falha na consulta.'),
    });
  }
}
