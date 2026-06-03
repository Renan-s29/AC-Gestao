import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss',
})
export class RelatoriosComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    data_inicio: [''],
    data_fim: [''],
    status: [''],
    associado_id: [''],
  });

  readonly msg = signal<string | null>(null);

  private params() {
    const v = this.form.getRawValue();
    return {
      data_inicio: v.data_inicio || undefined,
      data_fim: v.data_fim || undefined,
      status: v.status || undefined,
      associado_id: v.associado_id || undefined,
    };
  }

  baixarExcel() {
    this.msg.set(null);
    this.api.getBlob('/relatorios/excel', this.params() as any).subscribe({
      next: (blob) => this.dispararDownload(blob, 'ac-gestao-faturamentos.xlsx'),
      error: () => this.msg.set('Falha ao gerar Excel.'),
    });
  }

  baixarPdf() {
    this.msg.set(null);
    this.api.getBlob('/relatorios/pdf', this.params() as any).subscribe({
      next: (blob) => this.dispararDownload(blob, 'ac-gestao-faturamentos.pdf'),
      error: () => this.msg.set('Falha ao gerar PDF.'),
    });
  }

  private dispararDownload(blob: Blob, nome: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
