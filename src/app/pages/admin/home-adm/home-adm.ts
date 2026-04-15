import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLateral } from '../../../components/menu-lateral/menu-lateral';
import { RouterModule } from '@angular/router';
import { IconeComponent } from '../../../components/icone/icone';
import { ToastService } from '../../../core/services/toast';
import { ModalService } from '../../../services/modal'; 

@Component({
  selector: 'app-home-adm',
  standalone: true,
  imports: [CommonModule, MenuLateral, RouterModule, IconeComponent], 
  templateUrl: './home-adm.html',
  styleUrl: './home-adm.css',
})
export class HomeAdm implements OnInit {
  listaFilmes: any[] = [];

  constructor(
    private toastService: ToastService,
    private modalService: ModalService // 3. Injetou o controle remoto
  ) { }

  ngOnInit() {
    this.atualizarListaDaTela();
  }

  atualizarListaDaTela() {
    const dadosSalvos = localStorage.getItem('meusFilmes');
    if (dadosSalvos) {
      this.listaFilmes = JSON.parse(dadosSalvos);
    } else {
      this.listaFilmes = [
        { id: 1, titulo: 'Interestelar', genero: 'Ficção Científica', capa: 'https://m.media-amazon.com/images/I/71qzTzxzoCL.jpg', ano: 2014 },
        { id: 2, titulo: 'Batman', genero: 'Ação', capa: 'https://m.media-amazon.com/images/I/818hyvdVfvL._AC_SY679_.jpg', ano: 2008 }
      ];
      localStorage.setItem('meusFilmes', JSON.stringify(this.listaFilmes));
    }
  }


  remover(id: number) {
    const filme = this.listaFilmes.find(f => f.id === id);

    this.modalService.abrir({
      titulo: 'Excluir Filme',
      mensagem: `Tem certeza que deseja remover "${filme?.titulo}"?`,
      confirmar: () => {
        this.listaFilmes = this.listaFilmes.filter(f => f.id !== id);
        localStorage.setItem('meusFilmes', JSON.stringify(this.listaFilmes));
        this.toastService.exibir('Filme removido com sucesso!', 'sucesso');
      }
    });
  }
}