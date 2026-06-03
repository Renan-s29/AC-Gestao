import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  get<T>(path: string, params?: Record<string, string | number | undefined | null>) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<{ sucesso: boolean; dados: T; mensagem?: string }>(`${this.base}${path}`, {
      params: httpParams,
    });
  }

  post<T>(path: string, body: unknown) {
    return this.http.post<{ sucesso: boolean; dados: T; mensagem?: string }>(`${this.base}${path}`, body);
  }

  patch<T>(path: string, body: unknown) {
    return this.http.patch<{ sucesso: boolean; dados: T; mensagem?: string }>(`${this.base}${path}`, body);
  }

  postFormData<T>(path: string, formData: FormData) {
    return this.http.post<{ sucesso: boolean; dados: T; mensagem?: string }>(`${this.base}${path}`, formData);
  }

  postBlob(path: string, body?: unknown) {
    return this.http.post(`${this.base}${path}`, body ?? {}, {
      responseType: 'blob',
    });
  }

  getBlob(path: string, params?: Record<string, string | undefined>) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) httpParams = httpParams.set(k, v);
      });
    }
    return this.http.get(`${this.base}${path}`, { params: httpParams, responseType: 'blob' });
  }
}
