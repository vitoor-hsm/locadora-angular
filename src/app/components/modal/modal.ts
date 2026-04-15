import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Adicione OnInit aqui
import { ModalData, ModalService } from '../../services/modal';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class ModalComponent implements OnInit { 
  dados: ModalData | null = null;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
    this.modalService.modalState$.subscribe(estado => {
      this.dados = estado;
    });
  }

  aoCancelar() {
    this.modalService.fechar();
  }

  aoConfirmar() {
    if (this.dados) {
      this.dados.confirmar();
    }
    this.modalService.fechar();
  }
}
