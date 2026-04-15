import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'aviso';
}


@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  
  toastState = this.toastSubject.asObservable();

  exibir(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' = 'sucesso') {
    this.toastSubject.next({ mensagem, tipo });
  }
}
