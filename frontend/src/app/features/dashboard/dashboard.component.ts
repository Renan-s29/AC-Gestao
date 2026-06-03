import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime, distinctUntilChanged, switchMap, of } from "rxjs";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService } from "../../core/services/api.service";

interface DashboardResumo {
  inadimplentes: any[];
  total_inadimplentes: number;
  consultas_scpc_mes: number;
  faturamento_scpc_mes: number; // Novo campo conforme protótipo
  pendencias_saude_total: number; // Novo campo conforme protótipo
  pendencias_saude: any[];
  grafico_consultas_scpc: { mes: string; total_consultas: number }[];
}

interface AssociadoResumo {
  id: number;
  razao_social: string;
  cnpj: string;
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly carregando = signal(true);
  readonly resumo = signal<DashboardResumo | null>(null);
  readonly buscaCtrl = new FormControl<string>("", { nonNullable: true });
  readonly opcoesBusca = signal<AssociadoResumo[]>([]);

  ngOnInit(): void {
    this.api.get<DashboardResumo>("/dashboard/resumo").subscribe({
      next: (r: any) => {
        this.carregando.set(false);
        if (r.sucesso) this.resumo.set(r.dados);
      },
      error: () => this.carregando.set(false),
    });

    this.buscaCtrl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((q) => {
          const termo = q.trim();
          if (termo.length < 2) return of({ sucesso: true, dados: [] });
          return this.api.get<AssociadoResumo[]>("/dashboard/autocomplete", {
            q: termo,
          });
        }),
      )
      .subscribe((r: any) => {
        if (r.sucesso) this.opcoesBusca.set(r.dados);
      });
  }

  exibirAssociado(a: any): string {
    return a && typeof a !== "string" ? `${a.razao_social} · ${a.cnpj}` : "";
  }

  aoEscolher(ev: MatAutocompleteSelectedEvent) {
    const a = ev.option.value as AssociadoResumo;
    if (a?.id) this.router.navigate(["/associados", a.id]);
  }
}
