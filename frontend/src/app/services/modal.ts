import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalData {
  titulo: string;
  mensagem: string;
  confirmar: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // The behaviorSubject starts as null (closed modal)
  private modalState = new BehaviorSubject<ModalData | null>(null);
  
  // the modal component will "subscribe" to this observable
  modalState$ = this.modalState.asObservable();

  abrir(dados: ModalData) {
    this.modalState.next(dados);
  }

  fechar() {
    this.modalState.next(null);
  }
}