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
  // o behaviorSubject começa como null (modal fechado)
  private modalState = new BehaviorSubject<ModalData | null>(null);
  
  // o componente do modal vai "assinar" este observable
  modalState$ = this.modalState.asObservable();

  abrir(dados: ModalData) {
    this.modalState.next(dados);
  }

  fechar() {
    this.modalState.next(null);
  }
}