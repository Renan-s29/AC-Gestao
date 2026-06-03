import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-associado-ficha',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './associado-ficha.component.html',
  styleUrl: './associado-ficha.component.scss',
})
export class AssociadoFichaComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  readonly carregando = signal(true);
  readonly associado = signal<any>(null);
  readonly dependentes = signal<any[]>([]);
  readonly faturamentos = signal<any[]>([]);
  readonly documentos = signal<any[]>([]);
  readonly beneficios = signal<any>(null);
  readonly msgUpload = signal<string | null>(null);
  readonly mensagemAcao = signal<string | null>(null);

  readonly colsFat = ['referencia_mes', 'valor_total', 'data_vencimento', 'status', 'juros', 'multa'];
  readonly colsDep = ['nome', 'cpf', 'tipo', 'status'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    forkJoin({
      associado: this.api.get<any>(`/associados/${id}`),
      dependentes: this.api.get<any[]>(`/associados/${id}/dependentes`),
      faturamentos: this.api.get<any[]>(`/faturamentos`, { associado_id: id }),
      documentos: this.api.get<any[]>(`/associados/${id}/documentos`),
      beneficios: this.api.get<any>(`/associados/${id}/beneficios/status`),
    }).subscribe({
      next: (r: any) => {
        this.carregando.set(false);
        if (r.associado.sucesso) this.associado.set(r.associado.dados);
        if (r.dependentes.sucesso) this.dependentes.set(r.dependentes.dados);
        if (r.faturamentos.sucesso) this.faturamentos.set(r.faturamentos.dados);
        if (r.documentos.sucesso) this.documentos.set(r.documentos.dados);
        if (r.beneficios.sucesso) this.beneficios.set(r.beneficios.dados);
      },
      error: () => this.carregando.set(false),
    });
  }

  get associadoId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  enviarPdf(arquivo: File | null) {
    if (!arquivo) return;
    const id = this.associadoId;
    const fd = new FormData();
    fd.append('arquivo', arquivo);
    this.msgUpload.set(null);
    this.api.postFormData(`/associados/${id}/documentos`, fd).subscribe({
      next: (res) => {
        if (res.sucesso && res.dados) {
          this.msgUpload.set('Documento enviado com sucesso.');
          this.documentos.update((d) => [res.dados as any, ...d]);
        } else {
          this.msgUpload.set(res.mensagem || 'Falha no upload.');
        }
      },
      error: (e) => this.msgUpload.set(e?.error?.mensagem || 'Falha no upload.'),
    });
  }

  incluirDependenteDemo() {
    this.dependentes.update((deps) => [
      ...deps,
      {
        id: Date.now(),
        nome: 'Novo Dependente',
        tipo: 'Filho',
        data_nascimento: '01/01/2020',
        status: 'carência',
      },
    ]);
    this.mensagemAcao.set('Dependente incluído no protótipo para validação da tela.');
  }

  gerarGuia() {
    this.mensagemAcao.set('Guia de movimentação gerada com sucesso.');
  }

  calcularJuros() {
    this.mensagemAcao.set('Juros e multa calculados conforme regra de inadimplência.');
  }

  registrarAcao(nome: string) {
    this.mensagemAcao.set(`${nome} executado no protótipo.`);
  }

  baixar(doc: any) {
    this.api
      .getBlob(`/associados/${this.associadoId}/documentos/${doc.id}/download`)
      .subscribe((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = doc.nome_original || 'documento.pdf';
        a.click();
        URL.revokeObjectURL(a.href);
      });
  }
}
