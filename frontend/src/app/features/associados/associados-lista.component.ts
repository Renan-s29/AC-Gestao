import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-associados-lista',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './associados-lista.component.html',
  styleUrl: './associados-lista.component.scss',
})
export class AssociadosListaComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly termo = signal('');
  readonly associados = signal<any[]>([]);

  readonly associadosFiltrados = computed(() => {
    const q = this.termo().toLowerCase().trim();
    if (!q) return this.associados();
    return this.associados().filter((a) =>
      [a.razao_social, a.cnpj, a.email, a.telefone].some((v) => String(v || '').toLowerCase().includes(q))
    );
  });

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap.get('q') || '';
    this.termo.set(q);
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    this.erro.set(null);
    this.api.get<any[]>('/associados').subscribe({
      next: (res) => {
        this.carregando.set(false);
        if (res.sucesso) this.associados.set(res.dados || []);
        else this.erro.set(res.mensagem || 'Não foi possível carregar os associados.');
      },
      error: (e) => {
        this.carregando.set(false);
        this.erro.set(e?.error?.mensagem || 'Falha ao conectar com o backend.');
      },
    });
  }

  pesquisar(valor: string) {
    this.termo.set(valor);
  }

  abrirFicha(associado: any) {
    this.router.navigate(['/associados', associado.id || associado.id_associado]);
  }
}
