import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.scss',
})
export class FinanceiroComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly carregando = signal(true);
  readonly linhas = signal<any[]>([]);
  readonly cols = ['id', 'associado_id', 'razao_social', 'valor_total', 'data_vencimento', 'status', 'acoes'];

  readonly formMes = this.fb.nonNullable.group({
    referencia_mes: [this.mesAtual()],
  });

  ngOnInit(): void {
    this.carregar();
  }

  mesAtual(): string {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${m}`;
  }

  carregar() {
    this.carregando.set(true);
    this.api.get<any[]>('/faturamentos').subscribe({
      next: (r) => {
        this.carregando.set(false);
        if (r.sucesso) this.linhas.set(r.dados);
      },
      error: () => this.carregando.set(false),
    });
  }

  gerarMensal() {
    const referencia_mes = this.formMes.getRawValue().referencia_mes;
    this.api.post<any[]>('/faturamentos/gerar-mensal', { referencia_mes }).subscribe({
      next: (r) => {
        if (r.sucesso) this.carregar();
      },
    });
  }

  calcular(id: number) {
    this.api.post(`/faturamentos/${id}/calcular-juros-multa`, {}).subscribe(() => this.carregar());
  }

  marcarPago(id: number) {
    const hoje = new Date();
    const data = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(
      hoje.getDate()
    ).padStart(2, '0')}`;
    this.api.patch(`/faturamentos/${id}/marcar-pagamento`, { data_pagamento: data }).subscribe(() => this.carregar());
  }
}
